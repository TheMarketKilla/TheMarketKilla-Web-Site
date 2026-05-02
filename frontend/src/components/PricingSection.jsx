import { useI18n } from "../i18n/I18nContext";
import { Check } from "@phosphor-icons/react";

export default function PricingSection({ onSelectPlan }) {
  const { t } = useI18n();
  const tiers = t.pricing.tiers;
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4">
          {tiers.map((tier, idx) => {
            const featured = idx === 1;
            return (
              <div
                key={tier.name}
                className={`relative matte-card p-8 sm:p-10 transition-all duration-500 hover:border-champagne/50 ${featured ? "lg:scale-[1.04] lg:-mt-4 border-champagne/40 shadow-[0_0_50px_rgba(229,193,88,0.06)]" : ""}`}
                data-testid={`pricing-tier-${tier.name}`}
              >
                {featured && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 bg-champagne text-black px-4 py-1.5 label-mono">
                    {t.pricing.most}
                  </div>
                )}
                <div className="label-mono text-champagne mb-2">{tier.name}</div>
                <p className="text-zinc-500 text-sm mb-6">{tier.tagline}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display text-5xl sm:text-6xl font-medium text-white tracking-tighter">${tier.price}</span>
                  <span className="text-zinc-500 font-mono-ui text-sm">{t.pricing.mo}</span>
                </div>
                <ul className="space-y-3 mb-10 min-h-[200px]">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check size={16} className="text-champagne shrink-0 mt-0.5" weight="bold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onSelectPlan?.(tier.name)}
                  className={featured ? "btn-gold w-full" : "btn-ghost w-full"}
                  data-testid={`pricing-cta-${tier.name}`}
                >
                  {t.pricing.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
