import { useEffect, useState } from "react";
import axios from "axios";
import Marquee from "react-fast-marquee";
import { useI18n } from "../i18n/I18nContext";
import { CaretUp, CaretDown } from "@phosphor-icons/react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LABELS = { BTC: "BITCOIN", ETH: "ETHEREUM", XRP: "RIPPLE", GOLD: "GOLD · PAXG" };

export default function PriceTicker() {
  const { t } = useI18n();
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    let alive = true;
    const fetchPrices = async () => {
      try {
        const r = await axios.get(`${API}/prices`);
        if (alive) setPrices(r.data || []);
      } catch (e) {
        console.warn("prices fetch failed", e?.message);
      }
    };
    fetchPrices();
    const id = setInterval(fetchPrices, 12000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  if (prices.length === 0) {
    return (
      <div className="border-y border-white/5 bg-black/40 py-3 text-center label-mono" data-testid="ticker-loading">
        Loading market data...
      </div>
    );
  }

  const items = [...prices, ...prices, ...prices];

  return (
    <div className="relative border-y border-white/5 bg-black/60 backdrop-blur py-3 overflow-hidden" data-testid="price-ticker">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 bg-[#050505] pr-4">
        <span className="w-2 h-2 rounded-full bg-[#10B981] pulse-gold" />
        <span className="label-mono text-champagne">{t.ticker.live}</span>
      </div>
      <Marquee gradient gradientColor="#050505" gradientWidth={120} speed={45} pauseOnHover>
        {items.map((p, i) => {
          const price = p?.price ?? 0;
          const change24h = p?.change_24h ?? 0;
          const key = p?.key || "unknown";
          const up = change24h >= 0;
          return (
            <div key={`${key}-${i}`} className="flex items-center gap-3 px-8 font-mono-ui text-sm" data-testid={`ticker-item-${key}-${i}`}>
              <span className="text-zinc-500">{LABELS[key] || key}</span>
              <span className="text-white tracking-tight">${price >= 1000 ? price.toFixed(2) : price.toFixed(price >= 1 ? 4 : 6)}</span>
              <span className={`flex items-center gap-1 ${up ? "ticker-up" : "ticker-down"}`}>
                {up ? <CaretUp size={12} weight="fill" /> : <CaretDown size={12} weight="fill" />}
                {up ? "+" : ""}{change24h.toFixed(2)}%
              </span>
              <span className="text-zinc-700">|</span>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
