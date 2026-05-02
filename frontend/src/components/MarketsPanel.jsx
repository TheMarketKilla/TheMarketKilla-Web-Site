import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { useI18n } from "../i18n/I18nContext";
import { mockPrices, mockKlines, getMockKlines } from "../data/mockData";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function buildTicksMap(data) {
  const map = {};
  (data || []).forEach((p) => { if (p?.key) map[p.key] = p; });
  return map;
}

const SYMBOLS = [
  { key: "BTC", name: "Bitcoin", code: "BTC/USDT" },
  { key: "ETH", name: "Ethereum", code: "ETH/USDT" },
  { key: "XRP", name: "Ripple", code: "XRP/USDT" },
  { key: "GOLD", name: "Gold (PAXG)", code: "PAXG/USDT" },
];

function formatPrice(v) {
  if (v >= 1000) return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (v >= 1) return v.toFixed(4);
  return v.toFixed(6);
}

function MarketCard({ s, tick }) {
  const [candles, setCandles] = useState([]);
  const { t } = useI18n();

  useEffect(() => {
    setCandles(getMockKlines(s.key)?.candles || []);
    let alive = true;
    const load = async () => {
      try {
        const r = await axios.get(`${API}/klines/${s.key}`, { params: { interval: "1h", limit: 48 } });
        if (alive && r?.data?.candles) setCandles(r.data.candles);
      } catch (e) {
        console.warn(`klines ${s.key} fetch failed, using fallback`, e?.message);
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => { alive = false; clearInterval(id); };
  }, [s.key]);

  const up = tick ? (tick?.change_24h ?? 0) >= 0 : true;
  const stroke = up ? "#10B981" : "#EF4444";
  const data = candles.map((c) => ({ t: c?.t ?? 0, p: c?.close ?? 0 }));
  const price = tick?.price;

  return (
    <div className="matte-card p-6 group hover:border-champagne/40 transition-colors duration-300" data-testid={`market-card-${s.key}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="label-mono mb-1">{s.code}</div>
          <div className="font-display text-2xl text-white">{s.name}</div>
        </div>
        {tick && (
          <div className={`flex items-center gap-1 font-mono-ui text-xs px-2 py-1 ${up ? "text-[#10B981] border-[#10B981]/30" : "text-[#EF4444] border-[#EF4444]/30"} border`}>
            {up ? <CaretUp size={10} weight="fill" /> : <CaretDown size={10} weight="fill" />}
            {up ? "+" : ""}{(tick?.change_24h ?? 0).toFixed(2)}%
          </div>
        )}
      </div>
      <div className="font-mono-ui text-3xl text-white mb-4 tracking-tight">
        {price ? `$${formatPrice(price)}` : "—"}
      </div>

      <div className="h-24 -mx-2" style={{ minWidth: 200, minHeight: 96 }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="99%" height={96}>
            <LineChart data={data}>
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Tooltip
                contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(229,193,88,0.3)", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                labelStyle={{ color: "#71717a" }}
                itemStyle={{ color: "#fff" }}
                formatter={(v) => [`$${formatPrice(v)}`, "Price"]}
                labelFormatter={(l) => new Date(l).toLocaleString()}
              />
              <Line type="monotone" dataKey="p" stroke={stroke} strokeWidth={1.6} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center label-mono">loading...</div>
        )}
      </div>

      {tick && (
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
          <div>
            <div className="label-mono">{t.markets.high}</div>
            <div className="font-mono-ui text-xs text-zinc-300">${formatPrice(tick?.high_24h ?? 0)}</div>
          </div>
          <div>
            <div className="label-mono">{t.markets.low}</div>
            <div className="font-mono-ui text-xs text-zinc-300">${formatPrice(tick?.low_24h ?? 0)}</div>
          </div>
          <div>
            <div className="label-mono">{t.markets.vol}</div>
            <div className="font-mono-ui text-xs text-zinc-300">${((tick?.volume_24h ?? 0) / 1e6).toFixed(1)}M</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketsPanel() {
  const [ticks, setTicks] = useState(() => buildTicksMap(mockPrices));
  const { t } = useI18n();

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await axios.get(`${API}/prices`);
        if (alive && r?.data) {
          setTicks(buildTicksMap(r.data));
        }
      } catch (e) {
        console.warn("markets fetch failed, using fallback data", e?.message);
      }
    };
    load();
    const id = setInterval(load, 12000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <section id="markets" className="py-24 sm:py-32 px-6 lg:px-12 relative" data-testid="markets-section">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="label-mono mb-3 text-champagne">{t.markets.kicker}</div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tighter font-medium text-white max-w-xl">
              {t.markets.title}
            </h2>
          </div>
          <p className="text-zinc-400 text-base max-w-md leading-relaxed">{t.markets.subtitle}</p>
        </div>
        <div className="hairline mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/5">
          {SYMBOLS.map((s) => (
            <MarketCard key={s.key} s={s} tick={ticks[s.key]} />
          ))}
        </div>
      </div>
    </section>
  );
}
