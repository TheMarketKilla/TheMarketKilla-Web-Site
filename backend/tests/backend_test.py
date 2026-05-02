"""Backend API tests for TheMarketKilla."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://market-killa-trading.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "TheMarketKilla" in data["message"]


# ---------- Prices ----------
class TestPrices:
    def test_prices_returns_4_tickers(self, session):
        r = session.get(f"{API}/prices", timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        keys = {t["key"] for t in data}
        # Allow if some upstream fails but expect 4 normally
        assert {"BTC", "ETH", "XRP", "GOLD"}.issubset(keys), f"Got keys: {keys}"
        for t in data:
            for f in ("key", "symbol", "price", "change_24h", "high_24h", "low_24h", "volume_24h"):
                assert f in t, f"missing {f} in {t}"
            assert isinstance(t["price"], (int, float))
            assert t["price"] > 0


# ---------- Klines ----------
class TestKlines:
    @pytest.mark.parametrize("key", ["BTC", "ETH", "XRP", "GOLD"])
    def test_klines_for_key(self, session, key):
        r = session.get(f"{API}/klines/{key}", params={"interval": "1h", "limit": 48}, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["key"] == key
        assert "candles" in data
        assert len(data["candles"]) > 0
        c = data["candles"][0]
        for f in ("t", "open", "high", "low", "close", "volume"):
            assert f in c

    def test_klines_unknown_symbol_404(self, session):
        r = session.get(f"{API}/klines/FOO", timeout=15)
        assert r.status_code == 404

    def test_klines_invalid_interval_400(self, session):
        r = session.get(f"{API}/klines/BTC", params={"interval": "99m"}, timeout=15)
        assert r.status_code == 400


# ---------- Contact ----------
class TestContact:
    created_id = None

    def test_create_contact_valid(self, session):
        payload = {
            "name": "TEST_User",
            "email": "test_user@example.com",
            "phone": "+34123456789",
            "plan_interest": "PRO",
            "message": "Hello, I am interested in PRO plan.",
            "language": "en",
        }
        r = session.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        d = r.json()
        assert d["name"] == "TEST_User"
        assert d["email"] == "test_user@example.com"
        assert d["plan_interest"] == "PRO"
        assert "id" in d and len(d["id"]) >= 8
        assert "created_at" in d
        assert "_id" not in d
        TestContact.created_id = d["id"]

    def test_create_contact_invalid_email(self, session):
        payload = {"name": "TEST_X", "email": "not-an-email", "message": "hello there"}
        r = session.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_create_contact_missing_fields(self, session):
        r = session.post(f"{API}/contact", json={"email": "a@b.com"}, timeout=15)
        assert r.status_code == 422

    def test_list_contacts_excludes_id_and_sorted(self, session):
        r = session.get(f"{API}/contact", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        for it in items:
            assert "_id" not in it
            assert "id" in it
            assert "created_at" in it
        # Verify sort desc
        if len(items) >= 2:
            assert items[0]["created_at"] >= items[1]["created_at"]
        # Verify our created contact is there
        if TestContact.created_id:
            assert any(i["id"] == TestContact.created_id for i in items)
