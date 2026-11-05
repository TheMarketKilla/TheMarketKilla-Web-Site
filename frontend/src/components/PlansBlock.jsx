import { Check } from "@phosphor-icons/react";

/*
 * PlansBlock — bloque de precios de una sub-página de servicio.
 * Muestra los planes del servicio en tarjetas de altura igualada.
 * 5 planes → grid de 5 columnas en desktop; en móvil se apilan.
 */
export default function PlansBlock({ plans }) {
  if (!plans || !plans.items || !plans.items.length) return null;

  const cols =
    plans.items.length >= 5
      ? "md:grid-cols-3 xl:grid-cols-5"
      : plans.items.length === 4
      ? "md:grid-cols-2 xl:grid-cols-4"
      : "md:grid-cols-3";

  return (
    <section
      className="py-16 sm:py-24 px-6 lg:px-12 border-t border-white/5 bg-[#080808]"
      data-testid="service-plans"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="label-mono mb-3 text-champagne">{plans.kicker}</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium text-white mb-4 leading-[1.05]">
            {plans.title}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">{plans.subtitle}</p>
        </div>

        <div className={`grid grid-cols-1 ${cols} gap-5 items-stretch`}>
          {plans.items.map((p) => (
            <div
              key={p.name}
              className={`relative matte-card p-6 flex flex-col h-full transition-all duration-500 hover:border-champagne/50 ${
                p.featured ? "border-champagne/40 shadow-[0_0_50px_rgba(229,193,88,0.08)]" : ""
              }`}
              data-testid={`plan-${p.name.toLowerCase()}`}
            >
              {p.featured && (
                <div className="absolute top-0 right-0 -translate-y-1/2 bg-champagne text-black px-3 py-1 label-mono text-[9px]">
                  {plans.featured}
                </div>
              )}

              <div className="label-mono text-champagne mb-2">{p.name}</div>
              <p className="text-zinc-500 text-xs mb-5 min-h-[34px] leading-relaxed">{p.tagline}</p>

              {/* Precio con altura fija: las tarjetas quedan alineadas */}
              <div className="min-h-[72px] mb-5">
                {p.was && (
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono-ui text-sm text-zinc-600 line-through">{p.was}</span>
                    <span className="label-mono text-[8px] px-1.5 py-0.5 border border-champagne/60 text-champagne bg-champagne/10 whitespace-nowrap">
                      {p.save}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span
                    className={`font-display text-4xl font-medium tracking-tighter ${
                      p.featured ? "text-champagne" : "text-white"
                    }`}
                  >
                    {p.price}
                  </span>
                  <span className="text-zinc-500 font-mono-ui text-xs">{p.per}</span>
                </div>
              </div>

              <ul className="space-y-2 flex-1">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                    <Check size={14} weight="bold" className="text-champagne shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {p.note && (
                <p className="text-[10px] text-zinc-500 leading-relaxed mt-4 pt-3 border-t border-white/5">
                  {p.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
