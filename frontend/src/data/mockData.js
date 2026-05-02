/**
 * mockData.js — TheMarketKilla
 * Datos de fallback realistas para cuando el backend no está disponible.
 * Los precios son representativos del mercado real (Binance spot).
 */

// 1. Precios de mercado (PriceTicker + MarketsPanel)
export const mockPrices = [
  {
    key: "BTC",
    symbol: "BTCUSDT",
    price: 67420.35,
    change_24h: 2.14,
    high_24h: 68950.00,
    low_24h: 65880.10,
    volume_24h: 28450000000,
  },
  {
    key: "ETH",
    symbol: "ETHUSDT",
    price: 3518.72,
    change_24h: -0.87,
    high_24h: 3590.40,
    low_24h: 3420.55,
    volume_24h: 15200000000,
  },
  {
    key: "XRP",
    symbol: "XRPUSDT",
    price: 0.6012,
    change_24h: 3.45,
    high_24h: 0.6189,
    low_24h: 0.5740,
    volume_24h: 1850000000,
  },
  {
    key: "GOLD",
    symbol: "PAXGUSDT",
    price: 2387.50,
    change_24h: 0.32,
    high_24h: 2395.80,
    low_24h: 2370.20,
    volume_24h: 420000000,
  },
];

// 2. Velas (klines) para gráficos — 48 velas de 1h
function generateMockCandles(basePrice, volatility, count = 48) {
  const now = Date.now();
  const hourMs = 3600000;
  const candles = [];
  let price = basePrice;

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * hourMs;
    const change = (Math.random() - 0.5) * volatility;
    const open = price;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = basePrice * 10000 + Math.random() * basePrice * 5000;

    candles.push({
      t: timestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: parseFloat(volume.toFixed(0)),
    });

    price = close;
  }

  return candles;
}

export const mockKlines = {
  BTC: { key: "BTC", symbol: "BTCUSDT", interval: "1h", candles: generateMockCandles(67420, 350) },
  ETH: { key: "ETH", symbol: "ETHUSDT", interval: "1h", candles: generateMockCandles(3518, 80) },
  XRP: { key: "XRP", symbol: "XRPUSDT", interval: "1h", candles: generateMockCandles(0.60, 0.025) },
  GOLD: { key: "GOLD", symbol: "PAXGUSDT", interval: "1h", candles: generateMockCandles(2387, 25) },
};

// 3. Helper: get mock klines by key
export function getMockKlines(key) {
  return mockKlines[key] || mockKlines.BTC;
}

export default mockPrices;
