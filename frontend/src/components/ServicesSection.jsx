import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { Robot, Copy, ChartLineUp, Lightning, ArrowRight } from "@phosphor-icons/react";
import { SERVICE_ROUTES } from "../lib/sitelinks";

const ICONS = { copytrading: Copy, breakouts: Robot, bullrun: ChartLineUp, senales: Lightning };

function ServiceCard({ k, item }) {
  const { t } = useI18n();
  const Icon = ICONS[k] || Copy;
  const to = SERVICE_ROUTES[k];

  return (
    <article
      className="relative group matte-card overflow-hidden transition-all duration-500 hover:border-champagne/40 h-full flex flex-col"
      data-testid={`service-card-${k}`}
    >
      {/* Tarjetas limpias: sin foto. El peso visual lo llevan el icono dorado y la tipografia. */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-[#050505]/40" />
      <div className="relative z-10 p-7 lg:p-8 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border border-champagne/40 flex items-center justify-center text-champagne">
              <Icon size={22} weight="duotone" />
            </div>
            <div className="label-mono text-champagne">{item?.tag}</div>
          </div>
          <div className="w-1.5 h-1.5 bg-champagne pulse-gold" />
        </div>
        {/* cuerpo: crece para que el pie quede anclado abajo en las 4 tarjetas */}
        <div className="mt-12 flex-1 flex flex-col">
          <h3 className="font-display text-2xl tracking-tight text-white leading-tight">
            {item?.title}
          </h3>
          {item?.badge && (
            <div className="pt-3">
              <span className="inline-block label-mono text-[9px] px-2 py-1 border border-champagne/40 text-champagne whitespace-nowrap">
                {item.badge}
              </span>
            </div>
          )}
          <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
            {item?.desc}
          </p>
          <div className="mt-auto pt-6">
            {item?.meta && (
              <div className="pt-4 border-t border-white/5 font-mono-ui text-[11px] text-zinc-500 tracking-wide">
                {item.meta}
              </div>
            )}
            {/* Toda la tarjeta lleva a la sub-página dedicada del servicio */}
            <Link
              to={to}
              className="mt-4 inline-flex items-center gap-2 label-mono text-champagne hover:text-white transition-colors group/cta"
              data-testid={`service-cta-${k}`}
            >
              {t.services.card_cta}
              <ArrowRight
                size={13}
                weight="bold"
                className="transition-transform group-hover/cta:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
      {/* Capa clicable de la tarjeta completa (debajo del CTA, que queda accesible encima) */}
      <Link
        to={to}
        aria-label={item?.title}
        className="absolute inset-0 z-20"
        data-testid={`service-link-${k}`}
      />
    </article>
  );
}

export default function ServicesSection() {
  const { t } = useI18n();
  const list = t.services.list;
  const order = ["copytrading", "breakouts", "bullrun", "senales"];
  return (
    <section id="services" className="py-24 sm:py-32 px-6 lg:px-12 relative" data-testid="services-section">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 max-w-3xl">
          <div className="label-mono mb-3 text-champagne">{t.services.kicker}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium text-white mb-4 leading-[1.05]">
            {t.services.title}
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">{t.services.subtitle}</p>
        </div>
        <div className="hairline mb-10" />
        {/* 4 tarjetas idénticas: misma altura en móvil, tablet y escritorio */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch auto-rows-fr">
          {order.map((k) => (
            <ServiceCard key={k} k={k} item={list[k]} />
          ))}
        </div>
      </div>
    </section>
  );
}
