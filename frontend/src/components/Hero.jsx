import HeroScene from "./HeroScene";
import { useI18n } from "../i18n/I18nContext";
import { ArrowRight } from "@phosphor-icons/react";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center overflow-hidden grain" data-testid="hero-section">
      {/* Texture backdrop */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1763805508094-901f2a79ff77?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "screen",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

      {/* 3D scene */}
      <HeroScene />

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.7) 70%, #050505 100%)",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-24 pb-12">
        <div className="max-w-3xl">
          <div className="label-mono mb-6 text-champagne flex items-center gap-3">
            <span className="w-8 h-px bg-champagne" />
            {t.hero.kicker}
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-medium text-white tracking-tighter leading-[0.95] mb-6">
            {t.hero.title_a}<br />
            <span className="gold-text-gradient">{t.hero.title_b}</span>
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-xl mb-10">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="btn-gold group" data-testid="hero-cta-primary">
              {t.hero.cta_primary}
              <ArrowRight size={14} weight="bold" className="ml-2 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#markets" className="btn-ghost" data-testid="hero-cta-secondary">
              {t.hero.cta_secondary}
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 max-w-4xl border border-white/5">
          {[
            { v: "12.4M+", l: t.hero.stat_a },
            { v: "$84M", l: t.hero.stat_b },
            { v: "37", l: t.hero.stat_c },
          ].map((s) => (
            <div key={s.l} className="bg-[#070707] p-6 sm:p-8" data-testid={`hero-stat-${s.l.replace(/\s+/g,'-').toLowerCase()}`}>
              <div className="font-display text-3xl sm:text-4xl text-white tracking-tighter mb-2">{s.v}</div>
              <div className="label-mono">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-champagne to-transparent" />
        <div className="label-mono text-[9px]">SCROLL</div>
      </div>
    </section>
  );
}
