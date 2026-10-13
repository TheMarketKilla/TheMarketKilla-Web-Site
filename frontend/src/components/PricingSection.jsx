import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { Check, TelegramLogo } from "@phosphor-icons/react";
import { SERVICE_ROUTES, TELEGRAM_DM } from "../lib/sitelinks";

export default function PricingSection({ onSelectPlan }) {
  const { t } = useI18n();
  const tiers = t.pricing.tiers;
  // Orden de los planes en translations.js ↔ slug de servicio
  const SLUGS = ["copytrading", "breakouts", "bullrun", "senales"];

  return (
    <section id="pricing" className="py-24 sm:py-32 px-6 lg:px-12 relative" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="label-mono mb-3 text-champagne">{t.pricing.kicker}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium text-white mb-4 leading-[1.05]">
            {t.pricing.title}
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">{t.pricing.subtitle}</p>
        </div>
        <div className="hairline mb-12 max-w-md mx-auto" />

        {/* items-stretch + h-full → las 4 tarjetas comparten exactamente la misma altura */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-4 items-stretch">
          {tiers.map((tier, idx) => {
            // El plan destacado: el del descuento (robot con oferta), si existe; si no, el segundo
            const featured = tiers.some((x) => x.price_was) ? Boolean(tier.price_was) : idx === 1;
            const isMonthly = tier.name === "SEÑALES" || tier.name === "SIGNALS";
            const slug = tier.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <div
                key={tier.name}
                className={`relative matte-card p-8 flex flex-col h-full transition-all duration-500 hover:border-champagne/50 ${
                  featured ? "border-champagne/40 shadow-[0_0_50px_rgba(229,193,88,0.08)]" : ""
                }`}
                data-testid={`pricing-tier-${slug}`}
              >
                {featured && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 bg-champagne text-black px-4 py-1.5 label-mono">
                    {t.pricing.most}
                  </div>
                )}
                <div className="label-mono text-champagne mb-2">{tier.name}</div>
                <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">{tier.tagline}</p>

                {/* Bloque de precio con altura fija → alinea las 4 tarjetas a la vez */}
                <div className="min-h-[104px] mb-8">
                  {tier.price_was ? (
                    <>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-mono-ui text-base text-zinc-600 line-through decoration-zinc-600">
                          {tier.price_was}
                        </span>
                        <span className="label-mono text-[9px] px-2 py-1 border border-champagne/60 text-champagne bg-champagne/10 pulse-discount whitespace-nowrap">
                          {tier.discount}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-5xl sm:text-6xl font-medium text-champagne tracking-tighter">
                          {tier.price}
                        </span>
                        <span className="text-zinc-500 font-mono-ui text-sm">{t.pricing.once}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl sm:text-6xl font-medium text-white tracking-tighter">
                        {tier.price}
                      </span>
                      <span className="text-zinc-500 font-mono-ui text-sm">
                        {isMonthly ? t.pricing.mo : t.pricing.once}
                      </span>
                    </div>
                  )}
                </div>

                {/* flex-1 → la lista absorbe la diferencia y empuja el CTA al fondo */}
                <ul className="space-y-3 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check size={16} className="text-champagne shrink-0 mt-0.5" weight="bold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {tier.note && (
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-6 pt-4 border-t border-white/5 min-h-[58px]">
                    {tier.note}
                  </p>
                )}
                {/* Cada acceso lleva a la sub-página de ese servicio */}
                <Link
                  to={SERVICE_ROUTES[SLUGS[idx]]}
                  className={`${featured ? "btn-gold" : "btn-ghost"} w-full text-center mt-6`}
                  data-testid={`pricing-cta-${slug}`}
                >
                  {t.pricing.tier_cta}
                </Link>
                {/* Contacto directo: máxima facilidad para contratar */}
                <a
                  href={TELEGRAM_DM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full text-center inline-flex items-center justify-center gap-2 border border-champagne/30 text-champagne/90 hover:text-champagne hover:border-champagne/70 hover:bg-champagne/5 transition-colors py-3 label-mono text-[11px]"
                  data-testid={`pricing-hire-${slug}`}
                >
                  <TelegramLogo size={14} weight="fill" />
                  {t.pricing.hire_cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
