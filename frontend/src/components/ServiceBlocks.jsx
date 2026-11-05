/*
 * Bloques de la sub-página de servicio, extraídos de ServicePage.jsx.
 * Orden (auditoría 2026-11): HERO → RESULTADOS → CÓMO FUNCIONA →
 * PRUEBAS (+video) → PASOS → OBJECIONES → FAQ → CTA FINAL.
 * Las pruebas y los resultados van ANTES de la mecánica: son lo que convence.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Warning, MagnifyingGlassPlus, X } from "@phosphor-icons/react";
import { AutoLoopVideo, MediaCarousel, softNormalize } from "./MediaBits";

/* ── RESULTADOS ─────────────────────────────────────────────── */
export function ResultsBlock({ results, onOpen }) {
  if (!results) return null;
  return (
    <section className="py-16 sm:py-20 px-6 lg:px-12 bg-[#080808] border-y border-white/5" data-testid="service-results">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div>
            <div className="label-mono mb-3 text-champagne">{results.kicker}</div>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tighter font-medium text-white mb-4 leading-[1.1]">
              {results.title}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">{results.text}</p>
            <div className="grid grid-cols-2 gap-3">
              {results.stats.map((s) => (
                <div key={s.label} className="matte-card p-4">
                  <div className="font-display text-xl sm:text-2xl text-champagne leading-none mb-1">
                    {s.value}
                  </div>
                  <div className="label-mono text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
            {results.note && (
              <p className="text-xs text-zinc-500 leading-relaxed mt-4">{results.note}</p>
            )}
          </div>
          <ResultsMedia results={results} onOpen={onOpen} />
        </div>
      </div>
    </section>
  );
}

/* ── MEDIA DE RESULTADOS: abanico rotativo (foto + video) ───── */
/*
 * Mismo abanico que el de pruebas, pero en el recuadro pequeño del bloque
 * Resultado Real: las DOS piezas (foto Myfxbook + video MT5) desfilan de
 * derecha a izquierda en bucle continuo, con una copia de cada una en una
 * segunda fila centrada para que el bucle no tenga hueco.
 * Alto FIJO: nunca crece hacia abajo.
 */
// Una sola pieza de media: se muestra entera, sin abanico ni bucle.
// (Vive aparte para no romper el orden de hooks de ResultsMedia.)
function SingleResultsMedia({ piece, onOpen }) {
  const only = piece;
  const items = [{ ...only, wide: true, type: only.kind || "image" }];
  return (
    <figure className="matte-card overflow-hidden" data-testid="results-media">
      <div className="relative w-full aspect-square overflow-hidden bg-black">
        <button
          type="button"
          className="w-full h-full block cursor-zoom-in"
          onClick={() => onOpen({ items, start: 0 })}
          aria-label={`Ampliar: ${only.label}`}
          data-testid="results-single"
        >
          <img
            src={only.src}
            alt={only.alt}
            loading="lazy"
            className="w-full h-full object-contain"
            data-testid="results-image"
          />
        </button>
        <span className="media-tile-zoom is-on" aria-hidden="true">
          <MagnifyingGlassPlus size={18} weight="bold" />
        </span>
      </div>
      <figcaption className="p-4 border-t border-white/5">
        <div className="label-mono text-champagne mb-1">{only.label}</div>
        <p className="text-xs text-zinc-400 leading-relaxed">{only.caption}</p>
      </figcaption>
    </figure>
  );
}

function ResultsMedia({ results, onOpen }) {
  const pieces = [{ kind: "image", ...results.image }];
  if (results.video) pieces.push({ kind: "video", ...results.video });

  // Una sola pieza → media estática, sin abanico ni bucle (se decide en el
  // render, no con un early return: los hooks deben llamarse siempre igual).
  const single = pieces.length === 1;
  const track = pieces.length > 1 ? [...pieces, ...pieces, ...pieces] : pieces;
  const ref = useRef(null);
  const drag = useRef({ active: false, lastX: 0, moved: false, justDragged: false });
  const posRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf;
    let last = performance.now();
    const SPEED = 14; // px/s: lento, elegante
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!drag.current.active && !paused) posRef.current -= SPEED * dt;
      const half = el.scrollWidth / 2;
      if (half > 0) {
        posRef.current = softNormalize(posRef.current, half);
        const idx = Math.floor((-posRef.current) / (el.scrollWidth / track.length)) % pieces.length;
        setShown(idx);
      }
      el.style.transform = `translate3d(${posRef.current}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, pieces.length, track.length]);

  const startDrag = (x) => { drag.current = { active: true, lastX: x, moved: false, justDragged: false }; };
  const moveDrag = (x) => {
    const d = drag.current;
    if (!d.active) return;
    posRef.current += x - d.lastX;
    d.lastX = x;
    if (Math.abs(x - d.lastX) > 3) d.moved = true;
    if (ref.current) ref.current.style.transform = `translate3d(${posRef.current}px,0,0)`;
  };
  const endDrag = () => {
    const d = drag.current;
    d.active = false;
    d.justDragged = d.moved;
    if (ref.current) posRef.current = softNormalize(posRef.current, ref.current.scrollWidth / 2);
  };

  const piece = pieces[shown] || pieces[0];

  // Abre el lightbox con la GALERÍA entera y la pieza tocada: así se puede
  // pasar a la siguiente sin cerrar. `start` es el índice de arranque.
  const items = pieces.map((p) => {
    const { fan_src, kind, ...full } = p;
    return { ...full, type: kind, wide: true };   // el lightbox usa `type`
  });
  const openAt = (idx) => onOpen({ items, start: Math.max(0, Math.min(idx, items.length - 1)) });

  if (single) return <SingleResultsMedia piece={piece} onOpen={onOpen} />;

  return (
    <figure className="matte-card overflow-hidden" data-testid="results-media">
      <div
        className="relative w-full aspect-square overflow-hidden bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); endDrag(); }}
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
        style={{ touchAction: "pan-y", cursor: "grab" }}
        data-testid="results-fan"
      >
        <div ref={ref} className="results-fan-track" data-testid="results-fan-track">
          {track.map((p, n) => (
            <div
              key={`${p.src}-${n}`}
              className="results-fan-item"
              role="button"
              tabIndex={0}
              onClick={() => { if (!drag.current.justDragged) openAt(pieces.indexOf(p) === -1 ? 0 : pieces.indexOf(p)); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openAt(pieces.indexOf(p) === -1 ? 0 : pieces.indexOf(p)); }}
              data-testid={`results-item-${p.kind}`}
            >
              {p.kind === "image" ? (
                <img
                  src={p.fan_src || p.src}
                  alt={p.alt}
                  loading="lazy"
                  draggable="false"
                  data-testid={n === 0 ? "results-image" : undefined}
                />
              ) : (
                <video
                  src={p.fan_src || p.src}
                  poster={p.fan_src ? p.fan_src.replace(/\.mp4$/, ".jpg") : p.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  data-testid={n === pieces.length ? "results-video" : undefined}
                />
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 border border-white/10 backdrop-blur-sm pointer-events-none">
          {pieces.map((p, n) => (
            <span
              key={p.src}
              className={`w-1.5 h-1.5 rounded-full ${n === shown ? "bg-champagne" : "bg-white/30"}`}
            />
          ))}
          <span className="font-mono-ui text-[9px] text-zinc-400 ml-1">{pieces.length} ARCHIVOS · TOCA PARA AMPLIAR</span>
        </div>

        <span className="media-tile-zoom is-on" aria-hidden="true">
          <MagnifyingGlassPlus size={18} weight="bold" />
        </span>
      </div>

      <figcaption className="p-4 border-t border-white/5">
        <div className="label-mono text-champagne mb-1">{piece.label}</div>
        <p className="text-xs text-zinc-400 leading-relaxed">{piece.caption}</p>
      </figcaption>
    </figure>
  );
}


/* ── CÓMO FUNCIONA ──────────────────────────────────────────── */
export function HowBlock({ how }) {
  return (
    <section className="py-16 sm:py-20 px-6 lg:px-12" data-testid="service-how">
      <div className="max-w-6xl mx-auto">
        <div className="label-mono mb-3 text-champagne">{how.kicker}</div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium text-white mb-8 leading-[1.08]">
          {how.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {how.items.map((it) => (
            <div key={it.n} className="matte-card p-7 flex flex-col h-full">
              <div className="font-display text-3xl text-champagne/40 mb-4">{it.n}</div>
              <h3 className="font-display text-xl text-white mb-3 leading-tight">{it.t}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PRUEBAS: galería + video juntos + enlaces verificables ─── */
export function ProofBlock({ proof, onOpen }) {
  if (!proof) return null;
  const hasShots = proof.shots && proof.shots.length > 0;
  return (
    <section id="pruebas" className="py-16 sm:py-20 px-6 lg:px-12 bg-[#080808] border-y border-white/5" data-testid="service-proof">
      <div className="max-w-6xl mx-auto">
        <div className="label-mono mb-3 text-champagne">{proof.kicker}</div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium text-white mb-6 leading-[1.08]">
          {proof.title}
        </h2>
        <p className="text-zinc-400 leading-relaxed max-w-3xl mb-10">{proof.text}</p>

        {hasShots && (
          <MediaCarousel
            items={proof.shots.map((s) => ({ type: "image", ...s }))}
            onOpen={onOpen}
          />
        )}

        {proof.links && proof.links.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {proof.links.map((l) => (
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
                  <span className="font-mono-ui text-[10px] text-zinc-600 break-all">{l.href}</span>
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

        {proof.disclaimer && (
          <div className="flex items-start gap-3 mt-8 p-5 border border-white/10 bg-white/[0.02]">
            <Warning size={18} className="text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">{proof.disclaimer}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── PASOS PARA EMPEZAR ─────────────────────────────────────── */
export function StepsBlock({ steps }) {
  return (
    <section className="py-16 sm:py-20 px-6 lg:px-12" data-testid="service-steps">
      <div className="max-w-6xl mx-auto">
        <div className="label-mono mb-3 text-champagne">{steps.kicker}</div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium text-white mb-10 leading-[1.08]">
          {steps.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {steps.items.map((s) => (
            <div key={s.n} className="bg-[#0a0a0a] p-6 sm:p-7 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 border border-champagne/50 text-champagne font-mono-ui text-xs flex items-center justify-center shrink-0">
                  {s.n}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-champagne/40 to-transparent" />
              </div>
              <h3 className="font-display text-lg text-white mb-2 leading-tight">{s.t}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        {steps.footnote && (
          <p className="text-sm text-zinc-500 leading-relaxed mt-8 max-w-3xl">{steps.footnote}</p>
        )}
      </div>
    </section>
  );
}

/* ── OBJECIONES + VIDEO ─────────────────────────────────────── */
/*
 * Dos columnas: a la IZQUIERDA las objeciones ("lo que NO es"), a la
 * DERECHA el video de la cuenta operando en vivo. El video es prueba:
 * va junto al argumento que lo respalda, no en una sección aparte.
 * En móvil: primero el texto, después el video.
 */
export function HonestBlock({ honest, video }) {
  const [open, setOpen] = useState(false);
  if (!honest) return null;
  return (
    <section className="py-16 sm:py-20 px-6 lg:px-12 bg-[#080808] border-y border-white/5" data-testid="service-honest">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <div className="label-mono mb-3 text-champagne">{honest.kicker}</div>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tighter font-medium text-white mb-8 leading-[1.08]">
            {honest.title}
          </h2>
          <div className="space-y-5">
            {honest.items.map((h) => (
              <div key={h} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
                <Check size={16} weight="bold" className="text-champagne shrink-0 mt-1" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {video && (
          <figure className="matte-card overflow-hidden" data-testid="service-video-block">
            <button
              type="button"
              className="media-tile-media video-frame w-full"
              onClick={() => setOpen(true)}
              aria-label={`Ampliar: ${video.label}`}
              data-testid="video-open"
            >
              {/* key={src}: al navegar entre sub-páginas React reutiliza el mismo
                  <video> y mantiene el medio anterior → remontarlo por src. */}
              <AutoLoopVideo
                key={video.src}
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
        )}
      </div>

      {open && video && <VideoModal video={video} onClose={() => setOpen(false)} />}
    </section>
  );
}

/* ── Ventana del video (lightbox local) ─────────────────────── */
function VideoModal({ video, onClose }) {
  return (
    <div
      className="media-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.label}
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
        <video
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          className="media-lightbox-media"
          data-testid="lightbox-video"
        />
        <figcaption className="media-lightbox-cap">
          <span className="label-mono text-champagne">{video.label}</span>
          {video.caption && (
            <p className="text-xs text-zinc-400 leading-relaxed mt-1">{video.caption}</p>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
