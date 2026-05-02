import Marquee from "react-fast-marquee";
import { useI18n } from "../i18n/I18nContext";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { mockPrices } from "../data/mockData";

const LABELS = { BTC: "BITCOIN", ETH: "ETHEREUM", XRP: "RIPPLE", GOLD: "GOLD · PAXG" };

export default function PriceTicker() {
  const { t } = useI18n();
  const prices = mockPrices;
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
