import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import Seo from "./Seo";
import Header from "./Header";
import Footer from "./Footer";
import { ArrowRight, ArrowLeft, Check, Copy, Robot, ChartLineUp, Lightning } from "@phosphor-icons/react";
import { SERVICE_ROUTES } from "../lib/sitelinks";
import { MediaLightbox } from "./MediaBits";
import { ResultsBlock, HowBlock, ProofBlock, StepsBlock, HonestBlock } from "./ServiceBlocks";
import PlansBlock from "./PlansBlock";

/*
 * ServicePage — plantilla de sub-página de servicio.
 * Orden (auditoría 2026-11): HERO → RESULTADOS → CÓMO FUNCIONA → PRUEBAS(+video)
 * → PASOS → OBJECIONES → FAQ → CTA FINAL → OTROS SERVICIOS.
 * Las pruebas y los resultados van arriba de la mecánica: son lo que convence.
 */
// Mismos iconos que las tarjetas de servicio de la home (ServicesSection.jsx):
// el visitante reconoce cada servicio por su símbolo, aquí y allá.
const SERVICE_ICONS = { copytrading: Copy, breakouts: Robot, bullrun: ChartLineUp, senales: Lightning };

export default function ServicePage({ slug }) {
  const { t } = useI18n();
  const page = t.services.pages[slug];
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!page) return null;

  return (
    <div className="App relative" data-testid={`service-page-${slug}`}>
      <Seo
        title={page.seo.title}
        description={page.seo.description}
        path={SERVICE_ROUTES[slug]}
      />
      <Header />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-6 lg:px-12 overflow-hidden grain"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 75% 35%, rgba(229,193,88,0.12) 0%, rgba(229,193,88,0.03) 38%, transparent 65%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 label-mono hover:text-champagne transition-colors mb-10"
            data-testid="service-back"
          >
            <ArrowLeft size={13} weight="bold" />
            {t.services.page_nav_back}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="label-mono mb-5 text-champagne flex items-center gap-3">
                <span className="w-8 h-px bg-champagne" />
                {page.kicker}
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tighter leading-[0.98] mb-6">
                {page.title_a}{" "}
                <span className="gold-text-gradient">{page.title_b}</span>
              </h1>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
                {page.lead}
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a
                  href={page.cta_href}
                  target={page.cta_href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="btn-gold group"
                  data-testid="service-hero-cta"
                >
                  {page.cta_label}
                  <ArrowRight
                    size={14}
                    weight="bold"
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </a>
                {page.cta2_href && (
                  <a
                    href={page.cta2_href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    data-testid="service-hero-cta2"
                  >
                    {page.cta2_label}
                  </a>
                )}
              </div>

              {/* Datos duros del servicio */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border border-white/5">
                {page.facts.map((f) => (
                  <div key={f.label} className="bg-[#0a0a0a] p-4">
                    <div className="label-mono text-[9px] mb-2">{f.label}</div>
                    <div className="font-display text-lg text-champagne leading-tight">
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ficha lateral */}
            <aside className="lg:col-span-5 w-full">
              <div className="matte-card p-7 lg:p-8">
                <div className="label-mono text-champagne mb-4">{page.aside.title}</div>
                {page.aside.price && (
                  <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-white/5">
                    <span className="font-display text-5xl font-medium text-white tracking-tighter">
                      {page.aside.price}
                    </span>
                    <span className="font-mono-ui text-sm text-zinc-500">
                      {page.aside.price_note}
                    </span>
                  </div>
                )}
                <ul className="space-y-3">
                  {page.aside.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check size={16} weight="bold" className="text-champagne shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                {page.aside.note && (
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-6 pt-5 border-t border-white/5">
                    {page.aside.note}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="hairline max-w-6xl mx-auto" />

      <ResultsBlock results={page.results} onOpen={setLightbox} />

      <HowBlock how={page.how} />

      <ProofBlock proof={page.proof} onOpen={setLightbox} />

      <PlansBlock plans={page.plans} />

      <StepsBlock steps={page.steps} />

      {/* Objeciones a la izquierda (los 4 puntos), video operando a la derecha */}
      <HonestBlock honest={page.honest} video={page.proof && page.proof.video} />

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-6 lg:px-12 bg-[#080808] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="label-mono mb-3 text-champagne">{page.faq.kicker}</div>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tighter font-medium text-white mb-10 leading-[1.08]">
            {page.faq.title}
          </h2>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {page.faq.items.map((f, i) => (
              <details key={i} className="group py-5" data-testid={`faq-${i}`}>
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                  <span className="font-display text-base sm:text-lg text-white leading-snug">
                    {f.q}
                  </span>
                  <span className="text-champagne shrink-0 font-mono-ui text-lg leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-sm text-zinc-400 leading-relaxed mt-3 pr-8">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-6 lg:px-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 60%, rgba(229,193,88,0.10) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tighter font-medium text-white mb-5 leading-[1.08]">
            {page.final.title}
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-9">
            {page.final.text}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={page.final.cta_href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold group"
              data-testid="service-final-cta"
            >
              {page.final.cta_label}
              <ArrowRight
                size={14}
                weight="bold"
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href={page.final.cta2_href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              {page.final.cta2_label}
            </a>
          </div>
        </div>
      </section>

      {/* ── OTROS SERVICIOS ────────────────────────────────────── */}
      <section className="py-14 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="label-mono mb-6">{page.others_label}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(SERVICE_ROUTES)
              .filter(([k]) => k !== slug)
              .map(([k, route]) => {
                const Icon = SERVICE_ICONS[k];
                return (
                <Link
                  key={k}
                  to={route}
                  className="matte-card p-6 flex items-center justify-between gap-4 hover:border-champagne/40 transition-colors group"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    {/* Icono del servicio: el mismo de la home */}
                    <span
                      className="w-9 h-9 border border-champagne/40 flex items-center justify-center text-champagne shrink-0"
                      data-testid={`other-icon-${k}`}
                    >
                      {Icon ? <Icon size={18} weight="duotone" /> : null}
                    </span>
                    <span className="font-display text-base text-white leading-tight">
                      {t.services.pages[k].nav_label}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    weight="bold"
                    className="text-champagne shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </Link>
                );
              })}
          </div>
        </div>
      </section>

      {lightbox && (
        <MediaLightbox
          items={lightbox.items}
          item={lightbox.items ? undefined : lightbox}
          start={lightbox.start || 0}
          onClose={() => setLightbox(null)}
        />
      )}

      <Footer />
    </div>
  );
}
