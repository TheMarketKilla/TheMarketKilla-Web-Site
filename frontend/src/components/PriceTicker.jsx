import Marquee from "react-fast-marquee";
import { useI18n } from "../i18n/I18nContext";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { mockPrices } from "../data/mockData";
import { useBinancePrices } from "../hooks/useBinanceData";

/*
 * PriceTicker — franja fina de precios en vivo, SOLO estética.
 * Va pegada al borde inferior del hero (absolute bottom-0): no ocupa
 * altura propia ni empuja el contenido. SIEMPRE hacia la izquierda.
 */
const LABELS = { BTC: "BITCOIN", ETH: "ETHEREUM", XRP: "RIPPLE", GOLD: "GOLD · PAXG" };

export default function PriceTicker() {
  const { t } = useI18n();
  const { prices: livePrices } = useBinancePrices();

  // Usar datos de Binance si están disponibles, si no usar mock
  const prices = livePrices || mockPrices;
  const items = [...prices, ...prices, ...prices];

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-10 border-t border-white/5 bg-[#050505]/70 backdrop-blur-sm py-2 overflow-hidden"
      data-testid="price-ticker"
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 bg-[#050505] pr-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] pulse-gold" />
        <span className="label-mono text-[9px] text-champagne">{t.ticker.live}</span>
      </div>
      <Marquee gradient gradientColor="#050505" gradientWidth={100} speed={40} pauseOnHover direction="left">
        {items.map((p, i) => {
          const price = p?.price ?? 0;
          const change24h = p?.change_24h ?? 0;
          const key = p?.key || "unknown";
          const up = change24h >= 0;
          return (
            <div key={`${key}-${i}`} className="flex items-center gap-2 px-5 font-mono-ui text-[11px]" data-testid={`ticker-item-${key}-${i}`}>
              <span className="text-zinc-600">{LABELS[key] || key}</span>
              <span className="text-zinc-200 tracking-tight">${price >= 1000 ? price.toFixed(2) : price.toFixed(price >= 1 ? 4 : 6)}</span>
              <span className={`flex items-center gap-0.5 ${up ? "ticker-up" : "ticker-down"}`}>
                {up ? <CaretUp size={9} weight="fill" /> : <CaretDown size={9} weight="fill" />}
                {up ? "+" : ""}{change24h.toFixed(2)}%
              </span>
              <span className="text-zinc-800">|</span>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
