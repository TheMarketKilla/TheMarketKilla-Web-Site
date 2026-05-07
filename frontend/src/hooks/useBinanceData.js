/**
 * useBinanceData.js — TheMarketKilla
 * Hook personalizado para obtener datos de mercado desde la API pública de Binance.
 * Usa datos mock como fallback si la API no responde.
 *
 * Binance public API endpoints (no necesita API key):
 *   24hr ticker: GET https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT",...]
 *   Klines:      GET https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=48
 */

import { useState, useEffect, useRef, useCallback } from "react";

const BINANCE_BASE = "https://api.binance.com";

// Mapeo de nuestras keys a símbolos de Binance
export const SYMBOL_MAP = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  XRP: "XRPUSDT",
  GOLD: "PAXGUSDT",
};

const SYMBOL_MAP_REVERSE = Object.fromEntries(
  Object.entries(SYMBOL_MAP).map(([k, v]) => [v, k])
);

// Intervalo de actualización en ms (15 segundos para precios, 60s para klines)
const PRICE_POLL_INTERVAL = 15000;
const KLINE_POLL_INTERVAL = 60000;

// ---------------------------------------------------------------------------
// Helper: fetch con timeout
// ---------------------------------------------------------------------------
async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Helper: parsear kline de Binance a nuestro formato
// ---------------------------------------------------------------------------
function parseKline(k) {
  return {
    t: k[0],               // open time
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  };
}

// ---------------------------------------------------------------------------
// Hook principal: precios 24hr de todos los símbolos
// ---------------------------------------------------------------------------
export function useBinancePrices() {
  const [prices, setPrices] = useState(null);   // null = cargando
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchPrices = useCallback(async () => {
    try {
      const symbols = Object.values(SYMBOL_MAP);
      const url = `${BINANCE_BASE}/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`;
      const data = await fetchWithTimeout(url);

      if (!mountedRef.current) return;

      const mapped = data.map((item) => {
        const key = SYMBOL_MAP_REVERSE[item.symbol] || item.symbol;
        return {
          key,
          symbol: item.symbol,
          price: parseFloat(item.lastPrice),
          change_24h: parseFloat(item.priceChangePercent),
          high_24h: parseFloat(item.highPrice),
          low_24h: parseFloat(item.lowPrice),
          volume_24h: parseFloat(item.quoteVolume),
        };
      });

      setPrices(mapped);
      setError(null);
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchPrices();
    const interval = setInterval(fetchPrices, PRICE_POLL_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchPrices]);

  return { prices, error, refresh: fetchPrices };
}

// ---------------------------------------------------------------------------
// Hook para klines de un símbolo específico
// ---------------------------------------------------------------------------
export function useBinanceKlines(key, interval = "1h", limit = 48) {
  const [klines, setKlines] = useState(null);   // null = cargando
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const symbol = SYMBOL_MAP[key] || key;

  const fetchKlines = useCallback(async () => {
    try {
      const url = `${BINANCE_BASE}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      const data = await fetchWithTimeout(url);

      if (!mountedRef.current) return;

      const candles = data.map(parseKline);
      setKlines({
        key,
        symbol,
        interval,
        candles,
      });
      setError(null);
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
      }
    }
  }, [key, symbol, interval, limit]);

  useEffect(() => {
    mountedRef.current = true;
    fetchKlines();
    const intervalId = setInterval(fetchKlines, KLINE_POLL_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchKlines]);

  return { klines, error, refresh: fetchKlines };
}

// ---------------------------------------------------------------------------
// Hook que devuelve TODOS los klines (BTC, ETH, XRP, GOLD)
// ---------------------------------------------------------------------------
export function useAllBinanceKlines(interval = "1h", limit = 48) {
  const [allKlines, setAllKlines] = useState(null);
  const [error, setError] = useState(null);

  const btc = useBinanceKlines("BTC", interval, limit);
  const eth = useBinanceKlines("ETH", interval, limit);
  const xrp = useBinanceKlines("XRP", interval, limit);
  const gold = useBinanceKlines("GOLD", interval, limit);

  useEffect(() => {
    // Solo cuando todos tengan datos
    if (btc.klines && eth.klines && xrp.klines && gold.klines) {
      setAllKlines({
        BTC: btc.klines,
        ETH: eth.klines,
        XRP: xrp.klines,
        GOLD: gold.klines,
      });
      setError(null);
    }
    // Si alguno falla, reportamos el primer error
    const err = btc.error || eth.error || xrp.error || gold.error;
    if (err) setError(err);
  }, [btc.klines, eth.klines, xrp.klines, gold.klines, btc.error, eth.error, xrp.error, gold.error]);

  return { allKlines, error };
}

export default useBinancePrices;
