from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
import httpx
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="TheMarketKilla API")
api_router = APIRouter(prefix="/api")

BINANCE_BASE = "https://data-api.binance.vision"
SYMBOLS = {
    "BTC": "BTCUSDT",
    "ETH": "ETHUSDT",
    "XRP": "XRPUSDT",
    "GOLD": "PAXGUSDT",  # PAXG is gold-backed token
}

# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    plan_interest: Optional[str] = Field(default=None, max_length=40)
    message: str = Field(min_length=4, max_length=2000)
    language: Optional[str] = Field(default="es", max_length=4)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    plan_interest: Optional[str] = None
    message: str
    language: Optional[str] = "es"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PriceTick(BaseModel):
    key: str
    symbol: str
    price: float
    change_24h: float
    high_24h: float
    low_24h: float
    volume_24h: float


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "TheMarketKilla API online", "version": "1.0"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for c in checks:
        if isinstance(c.get('timestamp'), str):
            c['timestamp'] = datetime.fromisoformat(c['timestamp'])
    return checks


@api_router.post("/contact", response_model=Contact, status_code=201)
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    return contact


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for c in items:
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return items


async def _fetch_ticker(client_http: httpx.AsyncClient, key: str, symbol: str):
    try:
        r = await client_http.get(f"{BINANCE_BASE}/api/v3/ticker/24hr", params={"symbol": symbol}, timeout=8)
        r.raise_for_status()
        d = r.json()
        return PriceTick(
            key=key,
            symbol=symbol,
            price=float(d["lastPrice"]),
            change_24h=float(d["priceChangePercent"]),
            high_24h=float(d["highPrice"]),
            low_24h=float(d["lowPrice"]),
            volume_24h=float(d["quoteVolume"]),
        )
    except Exception as e:
        logger.warning(f"ticker fetch failed {symbol}: {e}")
        return None


@api_router.get("/prices", response_model=List[PriceTick])
async def get_prices():
    async with httpx.AsyncClient() as http_client:
        tasks = [_fetch_ticker(http_client, k, s) for k, s in SYMBOLS.items()]
        results = await asyncio.gather(*tasks)
    return [r for r in results if r is not None]


@api_router.get("/klines/{key}")
async def get_klines(key: str, interval: str = "1h", limit: int = 48):
    key = key.upper()
    if key not in SYMBOLS:
        raise HTTPException(status_code=404, detail="Unknown symbol")
    if interval not in {"1m", "5m", "15m", "1h", "4h", "1d"}:
        raise HTTPException(status_code=400, detail="Unsupported interval")
    limit = max(10, min(limit, 200))
    symbol = SYMBOLS[key]
    async with httpx.AsyncClient() as http_client:
        try:
            r = await http_client.get(
                f"{BINANCE_BASE}/api/v3/klines",
                params={"symbol": symbol, "interval": interval, "limit": limit},
                timeout=10,
            )
            r.raise_for_status()
            raw = r.json()
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Binance error: {e}")
    candles = [
        {
            "t": int(row[0]),
            "open": float(row[1]),
            "high": float(row[2]),
            "low": float(row[3]),
            "close": float(row[4]),
            "volume": float(row[5]),
        }
        for row in raw
    ]
    return {"key": key, "symbol": symbol, "interval": interval, "candles": candles}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
