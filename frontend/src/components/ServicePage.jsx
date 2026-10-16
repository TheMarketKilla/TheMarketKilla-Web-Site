import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import Seo from "./Seo";
import Header from "./Header";
import Footer from "./Footer";
import { ArrowRight, ArrowLeft, Check, Warning, X, MagnifyingGlassPlus } from "@phosphor-icons/react";
import { SERVICE_ROUTES } from "../lib/sitelinks";

/*
 * VideoHero — video sin controles que arranca solo al entrar en pantalla y
 * queda en loop infinito. Si el visitante sale del viewport se pausa (ahorra
 * CPU/batería) y al volver se reanuda. muted + playsInline = autoplay permitido.
 */
function AutoLoopVideo({ src, poster, className, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      className={className}
      {...rest}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

/*
 * MediaLightbox — amplía una pieza (foto o video) a pantalla completa.
 * Se cierra con la X, con click en el fondo (fuera de la pieza) o con Escape.
 * El video se reproduce en loop sin controles, igual que en la galería.
 */
function MediaLightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!item) return null;
  return (
    <div
      className="media-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
      data-testid="media-lightbox"
    >
      <button
        type="button"
        className="media-lightbox-close"
        onClick={onClose}
        aria-label="Cerrar"
        data-testid="lightbox-close"
      >
        <X size={20} weight="bold" />
      </button>
      <figure className="media-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        {item.type === "video" ? (
          <video
            src={item.src}
            poster={item.poster}
            autoPlay
            muted
            loop
            playsInline
            className="media-lightbox-media"
            data-testid="lightbox-video"
          />
        ) : (
          <img
            src={item.src}
            alt={item.alt}
            className="media-lightbox-media"
            data-testid="lightbox-image"
          />
        )}
        <figcaption className="media-lightbox-cap">
          <span className="label-mono text-champagne">{item.label}</span>
          {item.caption && (
            <p className="text-xs text-zinc-400 leading-relaxed mt-1">{item.caption}</p>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

/*
 * MediaCarousel — abanico simétrico de fotos que se desliza solo (bucle continuo,
 * de derecha a izquierda) y que además se puede ARRASTRAR con el mouse o con el
 * dedo en móvil. Al soltar, el deslizamiento suave continúa desde el punto donde
 * lo dejaste. Cada pieza se amplía con un click (abre el lightbox).
 * El video NO va aquí: tiene su propio espacio junto al bloque "SIN VENDERTE HUMO".
 */
function MediaCarousel({ items, onOpen }) {
  const track = [...items, ...items]; // duplicado para el bucle continuo
  const ref = useRef(null);
  const drag = useRef({ active: false, startX: 0, lastX: 0, moved: false, justDragged: false });
  const [paused, setPaused] = useState(false);

  // Posición base del offset en píxeles (negativa: avanza hacia la izquierda).
  // Se guarda fuera de React para que la animación no re-renderice nada.
  const posRef = useRef(0);

  // Reajusta el offset al rango del bucle, pero SÓLO cuando se sale por el
  // borde (|offset| supera media anchura). Un desplazamiento pequeño dentro
  // del rango queda intacto: así un arrastre corto nunca da un salto.
  const normalize = (x, half) => {
    if (half <= 0) return x;
    let v = x;
    while (v > 0) v -= half;
    while (v <= -half) v += half;
    return v;
  };
  // Variante suave para el final del arrastre: mantiene el punto visual exacto
  // y sólo reencuadra si hace falta. Si el arrastre fue corto, no toca nada.
  const softNormalize = (x, half) => {
    if (half <= 0) return x;
    if (x <= 0 && x > -half) return x;
    return normalize(x, half);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf;
    let last = performance.now();
    const SPEED = 24; // px por segundo (lento y elegante)

    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const d = drag.current;
      if (!d.active && !paused) {
        posRef.current -= SPEED * dt;
      }
      // Reencuadre invisible del bucle cuando el offset se sale del rango
      const half = el.scrollWidth / 2;
      if (half > 0) posRef.current = softNormalize(posRef.current, half);
      el.style.transform = `translate3d(${posRef.current}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // ── Arrastre con mouse o dedo ────────────────────────────────────────────
  const startDrag = (x) => {
    const d = drag.current;
    d.active = true;
    d.startX = x;
    d.lastX = x;
    d.moved = false;
  };
  // Normaliza el offset al rango del bucle [-half, 0] para que el arrastre
  // pueda seguir indefinidamente.
  const moveDrag = (x) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = x - d.lastX;
    d.lastX = x;
    posRef.current += dx;
    if (Math.abs(x - d.startX) > 6) d.moved = true;
    const el = ref.current;
    if (el) {
      // Sin normalizar: el track está duplicado, así que un offset fuera de
      // rango sigue mostrando contenido válido y no hay salto visible.
      el.style.transform = `translate3d(${posRef.current}px,0,0)`;
    }
  };
  const endDrag = () => {
    const d = drag.current;
    d.active = false;
    // Al soltar sólo reencuadramos si nos salimos del rango; si no, no tocamos.
    const el = ref.current;
    if (el) posRef.current = softNormalize(posRef.current, el.scrollWidth / 2);
    // Si hubo arrastre real, el próximo click no debe abrir el lightbox.
    d.justDragged = d.moved;
  };

  const onMouseDown = (e) => { startDrag(e.clientX); };
  const onMouseMove = (e) => { if (drag.current.active) { moveDrag(e.clientX); } };
  const onMouseUp = () => endDrag();
  const onTouchStart = (e) => { startDrag(e.touches[0].clientX); };
  const onTouchMove = (e) => { moveDrag(e.touches[0].clientX); };
  const onTouchEnd = () => endDrag();

  const handleOpen = (m) => {
    // Si el usuario venía arrastrando, el click no abre el lightbox.
    if (drag.current.justDragged) { drag.current.justDragged = false; drag.current.moved = false; return; }
    onOpen(m);
  };

  return (
    <div
      className="media-carousel group/mc relative overflow-hidden border-y border-white/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); endDrag(); }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: "pan-y", cursor: "grab" }}
    >
      <div ref={ref} className="media-carousel-track py-4" data-testid="media-carousel-track">
        {track.map((m, i) => (
          <figure
            key={`${m.src}-${i}`}
            className="media-tile matte-card overflow-hidden shrink-0"
          >
            <button
              type="button"
              className="media-tile-media"
              onClick={() => handleOpen(m)}
              aria-label={`Ampliar: ${m.label}`}
              data-testid="media-tile-open"
            >
              <img
                src={m.src}
                alt={m.alt}
                loading="lazy"
                draggable="false"
                className="w-full h-full object-cover"
              />
              <span className="media-tile-zoom" aria-hidden="true">
                <MagnifyingGlassPlus size={16} weight="bold" />
              </span>
            </button>
            <figcaption className="media-tile-cap">
              <span className="label-mono text-champagne">{m.label}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="media-carousel-fade media-carousel-fade-l" />
      <div className="media-carousel-fade media-carousel-fade-r" />
    </div>
  );
}

/*
 * VideoAndHonest — el video del robot en vivo a la izquierda y el bloque
 * "SIN VENDERTE HUMO" a la derecha, en dos columnas equilibradas.
 */
function VideoAndHonest({ video, honest }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <figure className="matte-card overflow-hidden flex flex-col">
        <button
          type="button"
          className="media-tile-media video-frame w-full"
          onClick={() => setOpen(true)}
          aria-label={`Ampliar: ${video.label}`}
          data-testid="video-open"
        >
          <AutoLoopVideo
            src={video.src}
            poster={video.poster}
            className="w-full h-full object-cover bg-black"
            data-testid="service-video"
          />
          <span className="media-tile-zoom" aria-hidden="true">
            <MagnifyingGlassPlus size={18} weight="bold" />
          </span>
        </button>
        <figcaption className="p-5 border-t border-white/5">
          <div className="label-mono text-champagne mb-1">{video.label}</div>
          {video.caption && (
            <p className="text-xs text-zinc-400 leading-relaxed">{video.caption}</p>
          )}
        </figcaption>
      </figure>

      <div>
        <div className="label-mono mb-3 text-champagne">{honest.kicker}</div>
        <h3 className="font-display text-2xl sm:text-3xl tracking-tighter font-medium text-white mb-6 leading-[1.1]">
          {honest.title}
        </h3>
        <div className="space-y-4">
          {honest.items.map((h) => (
            <div key={h} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
              <Check size={16} weight="bold" className="text-champagne shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <MediaLightbox item={{ type: "video", ...video }} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

/*
 * ServicePage — plantilla de sub-página de servicio.
 * Toda la estructura es igual para las 4: lo único que cambia es el contenido
 * de `t.services.pages[slug]`. Sin cifras inventadas: solo datos reales de marca.
 */

function Section({ kicker, title, children, className = "" }) {
  return (
    <section className={`py-16 sm:py-20 px-6 lg:px-12 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {kicker && <div className="label-mono mb-3 text-champagne">{kicker}</div>}
        {title && (
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium text-white mb-8 leading-[1.08]">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

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

      {/* ── CÓMO FUNCIONA ──────────────────────────────────────── */}
      <Section kicker={page.how.kicker} title={page.how.title}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {page.how.items.map((it) => (
            <div key={it.n} className="matte-card p-7 flex flex-col h-full">
              <div className="font-display text-3xl text-champagne/40 mb-4">{it.n}</div>
              <h3 className="font-display text-xl text-white mb-3 leading-tight">{it.t}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── PASOS PARA EMPEZAR ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-6 lg:px-12 bg-[#080808] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="label-mono mb-3 text-champagne">{page.steps.kicker}</div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium text-white mb-10 leading-[1.08]">
            {page.steps.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {page.steps.items.map((s) => (
              <div key={s.n} className="bg-[#0a0a0a] p-7 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 border border-champagne/50 text-champagne font-mono-ui text-xs flex items-center justify-center">
                    {s.n}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-champagne/40 to-transparent" />
                </div>
                <h3 className="font-display text-lg text-white mb-2 leading-tight">{s.t}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          {page.steps.footnote && (
            <p className="text-sm text-zinc-500 leading-relaxed mt-8 max-w-3xl">
              {page.steps.footnote}
            </p>
          )}
        </div>
      </section>

      {/* ── PRUEBAS / GALERÍA ──────────────────────────────────── */}
      <Section kicker={page.proof.kicker} title={page.proof.title}>
        <p className="text-zinc-400 leading-relaxed max-w-3xl mb-10">{page.proof.text}</p>

        {page.proof.shots.length > 0 && (
          <MediaCarousel
            items={page.proof.shots.map((s) => ({ type: "image", ...s }))}
            onOpen={setLightbox}
          />
        )}

        {page.proof.links.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {page.proof.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="matte-card p-6 flex items-start justify-between gap-4 hover:border-champagne/40 transition-colors group"
              >
                <div>
                  <div className="label-mono text-champagne mb-2">{l.label}</div>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-2">{l.text}</p>
                  <span className="font-mono-ui text-[10px] text-zinc-600 break-all">
                    {l.href}
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="text-champagne shrink-0 mt-1 transition-transform group-hover:translate-x-1"
                />
              </a>
            ))}
          </div>
        )}

        {page.proof.disclaimer && (
          <div className="flex items-start gap-3 mt-8 p-5 border border-white/10 bg-white/[0.02]">
            <Warning size={18} className="text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">{page.proof.disclaimer}</p>
          </div>
        )}
      </Section>

      {/* ── VIDEO EN VIVO + SIN VENDERTE HUMO ──────────────────── */}
      {page.proof.video && page.honest && (
        <section className="py-16 sm:py-20 px-6 lg:px-12 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <VideoAndHonest video={page.proof.video} honest={page.honest} />
          </div>
        </section>
      )}

      {/* ── RESULTADOS ─────────────────────────────────────────── */}
      {page.results && (
        <section className="py-16 sm:py-20 px-6 lg:px-12 bg-[#080808] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <div>
                <div className="label-mono mb-3 text-champagne">{page.results.kicker}</div>
                <h3 className="font-display text-2xl sm:text-3xl tracking-tighter font-medium text-white mb-4 leading-[1.1]">
                  {page.results.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{page.results.text}</p>
                <div className="grid grid-cols-2 gap-3">
                  {page.results.stats.map((s) => (
                    <div key={s.label} className="matte-card p-4">
                      <div className="font-display text-xl sm:text-2xl text-champagne leading-none mb-1">
                        {s.value}
                      </div>
                      <div className="label-mono text-zinc-500">{s.label}</div>
                    </div>
                  ))}
                </div>
                {page.results.note && (
                  <p className="text-xs text-zinc-500 leading-relaxed mt-4">{page.results.note}</p>
                )}
              </div>
              <figure className="matte-card overflow-hidden">
                <button
                  type="button"
                  className="media-tile-media w-full"
                  onClick={() => setLightbox({ type: "image", ...page.results.image })}
                  aria-label={`Ampliar: ${page.results.image.label}`}
                  data-testid="results-image-open"
                >
                  <img
                    src={page.results.image.src}
                    alt={page.results.image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    data-testid="results-image"
                  />
                  <span className="media-tile-zoom" aria-hidden="true">
                    <MagnifyingGlassPlus size={18} weight="bold" />
                  </span>
                </button>
                <figcaption className="p-4 border-t border-white/5">
                  <div className="label-mono text-champagne mb-1">{page.results.image.label}</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{page.results.image.caption}</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      )}

      {lightbox && <MediaLightbox item={lightbox} onClose={() => setLightbox(null)} />}

      {/* ── HONESTIDAD (qué NO es) — solo si no se mostró junto al video ── */}
      {page.honest && !page.proof.video && (
        <section className="py-16 sm:py-20 px-6 lg:px-12 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="label-mono mb-3 text-champagne">{page.honest.kicker}</div>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tighter font-medium text-white mb-8 leading-[1.08]">
              {page.honest.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {page.honest.items.map((h) => (
                <div key={h} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
                  <Check size={16} weight="bold" className="text-champagne shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
              .map(([k, route]) => (
                <Link
                  key={k}
                  to={route}
                  className="matte-card p-6 flex items-center justify-between gap-4 hover:border-champagne/40 transition-colors group"
                >
                  <span className="font-display text-base text-white leading-tight">
                    {t.services.pages[k].nav_label}
                  </span>
                  <ArrowRight
                    size={15}
                    weight="bold"
                    className="text-champagne shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
