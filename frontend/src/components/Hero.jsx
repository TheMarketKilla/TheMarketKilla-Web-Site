import HeroScene from "./HeroScene";
import SectionBoundary from "./SectionBoundary";
import { useI18n } from "../i18n/I18nContext";
import { ArrowRight } from "@phosphor-icons/react";
import { TELEGRAM_DM } from "../lib/sitelinks";
import PriceTicker from "./PriceTicker";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center overflow-hidden grain pt-16" data-testid="hero-section">
      {/* Sin foto de fondo: el hero ahora lo sostienen el 3D y la marca.
          (La textura de stock usaba mixBlendMode "screen" y aclaraba el 3D encima.) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      {/* Halo dorado: da profundidad al 3D sin taparlo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 68% 45%, rgba(229,193,88,0.10) 0%, rgba(229,193,88,0.03) 35%, transparent 62%)",
        }}
      />

      {/* 3D scene */}
      {/* El 3D va aislado: si el GPU falla, cae el adorno, nunca la web */}
      <SectionBoundary silent>
        <HeroScene />
      </SectionBoundary>

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.7) 70%, #050505 100%)",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-8 pb-10 lg:pt-24 lg:pb-12">
        <div className="max-w-3xl">
          <div className="label-mono mb-4 lg:mb-6 text-champagne flex items-center gap-3">
            <span className="w-8 h-px bg-champagne" />
            {t.hero.kicker}
          </div>
          <h1 className="font-display text-[2.15rem] sm:text-6xl lg:text-7xl font-medium text-white tracking-tighter leading-[1.03] mb-5">
            {t.hero.title_a}<br />
            <span className="gold-text-gradient">{t.hero.title_b}</span>
          </h1>
          <p className="text-zinc-300 text-sm sm:text-lg leading-relaxed max-w-xl mb-7 lg:mb-10">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 lg:gap-4">
            <a href="#services" className="btn-gold group" data-testid="hero-cta-primary">
              {t.hero.cta_primary}
              <ArrowRight size={14} weight="bold" className="ml-2 transition-transform group-hover:translate-x-1" />
            </a>
            <a href={TELEGRAM_DM} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-testid="hero-cta-secondary">
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>

        {/* Stats — datos verificables, no métricas inventadas.
            En móvil van justo debajo de los CTAs (antes quedaban fuera del pliegue). */}
        <div className="mt-10 lg:mt-16 grid grid-cols-3 gap-px bg-white/5 max-w-4xl border border-white/5" data-testid="hero-stats">
          {[
            { v: "+10", l: t.hero.stat_a },
            { v: "+500", l: t.hero.stat_b },
            { v: "100%", l: t.hero.stat_c },
          ].map((s) => (
            <div key={s.l} className="bg-[#070707] p-4 sm:p-8" data-testid={`hero-stat-${s.l.replace(/\s+/g,'-').toLowerCase()}`}>
              <div className="font-display text-2xl sm:text-4xl text-white tracking-tighter mb-1 sm:mb-2">{s.v}</div>
              <div className="label-mono text-[9px] sm:text-[11px] leading-tight">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Franja de precios pegada al borde inferior: decoración, no ocupa altura */}
      <PriceTicker />

      {/* Scroll indicator — solo escritorio: en móvil robaba el pliegue */}
      <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 opacity-60">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-champagne to-transparent" />
        <div className="label-mono text-[9px]">SCROLL</div>
      </div>
    </section>
  );
}
