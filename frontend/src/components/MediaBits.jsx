/*
 * MediaBits — media compartida de las sub-páginas de servicio:
 * AutoLoopVideo (video en loop), MediaLightbox y MediaCarousel (abanico).
 * Extraído de ServicePage.jsx.
 */
import { useEffect, useRef, useState } from "react";
import { X, MagnifyingGlassPlus } from "@phosphor-icons/react";

export function AutoLoopVideo({ src, poster, className, ...rest }) {
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
/*
 * MediaLightbox — amplía una pieza en pantalla completa.
 * Si recibe `items` (galería) se puede pasar a la siguiente/anterior SIN
 * cerrar: flechas en pantalla, teclas ← → y deslizamiento con el dedo.
 * Con `item` suelto funciona igual que antes (una sola pieza).
 */
export function MediaLightbox({ item, items, start = 0, onClose }) {
  const source = items && items.length ? items : item ? [item] : [];
  const list = source.map((it) => {
    // El lightbox SIEMPRE abre la versión completa: fuera el recorte del abanico.
    const { fan_src, ...full } = it;
    return full;
  });
  const [i, setI] = useState(start);
  const touch = useRef({ x: 0, active: false });
  const many = list.length > 1;
  const piece = list[Math.min(i, list.length - 1)] || null;

  const go = (d) => setI((n) => (n + d + list.length) % list.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (!many) return;
      if (e.key === "ArrowRight") setI((n) => (n + 1) % list.length);
      if (e.key === "ArrowLeft") setI((n) => (n - 1 + list.length) % list.length);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, many, list.length]);

  if (!piece) return null;

  const startX = (x) => { touch.current = { x, active: true }; };
  const endX = (x) => {
    if (!touch.current.active || !many) return;
    const dx = x - touch.current.x;
    touch.current.active = false;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className={`media-lightbox${piece.wide ? " is-wide" : ""}`}
      onClick={onClose}
      onTouchStart={(e) => startX(e.touches[0].clientX)}
      onTouchEnd={(e) => endX(e.changedTouches[0].clientX)}
      role="dialog"
      aria-modal="true"
      aria-label={piece.label}
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

      {many && (
        <>
          <button
            type="button"
            className="media-lightbox-nav prev"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Anterior"
            data-testid="lightbox-prev"
          >
            ‹
          </button>
          <button
            type="button"
            className="media-lightbox-nav next"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Siguiente"
            data-testid="lightbox-next"
          >
            ›
          </button>
        </>
      )}

      <figure className="media-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        {piece.type === "video" ? (
          <video
            key={piece.src}
            src={piece.hd || piece.src}
            poster={piece.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="media-lightbox-media"
            data-testid="lightbox-video"
          />
        ) : (
          <img
            key={piece.src}
            src={piece.src}
            alt={piece.alt}
            className="media-lightbox-media"
            data-testid="lightbox-image"
          />
        )}
        <figcaption className="media-lightbox-cap">
          <span className="label-mono text-champagne">{piece.label}</span>
          {piece.caption && (
            <p className="text-xs text-zinc-400 leading-relaxed mt-1">{piece.caption}</p>
          )}
          {many && (
            <p className="font-mono-ui text-[10px] text-zinc-600 mt-2" data-testid="lightbox-counter">
              {i + 1} / {list.length} — desliza o usa ‹ ›
            </p>
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
// Reajusta el offset al rango del bucle [-half, 0], pero SÓLO cuando se sale por
// el borde (|offset| supera media anchura). Un desplazamiento pequeño dentro del
// rango queda intacto: así un arrastre corto nunca da un salto visual.
// Nivel de módulo a propósito: son puras y así no son deps del useEffect.
function normalize(x, half) {
  if (half <= 0) return x;
  let v = x;
  while (v > 0) v -= half;
  while (v <= -half) v += half;
  return v;
}
// Variante suave para el final del arrastre y el tick del bucle: mantiene el
// punto visual exacto y sólo reencuadra si hace falta. Si el arrastre fue corto,
// no toca nada.
export function softNormalize(x, half) {
  if (half <= 0) return x;
  if (x <= 0 && x > -half) return x;
  return normalize(x, half);
}

export function MediaCarousel({ items, onOpen }) {
  // Las piezas se repiten hasta cubrir el contenedor y luego UNA vez más:
  // con pocas piezas, dos copias no llenan la pantalla y se ve un hueco negro
  // al pasar de la última a la primera.
  const perCopy = Math.max(
    items.length,
    Math.ceil((typeof window !== "undefined" ? window.innerWidth : 1440) / 232) + 1,
  );
  const oneCopy = Array.from({ length: perCopy }, (_, n) => items[n % items.length]);
  const track = [...oneCopy, ...oneCopy]; // duplicado para el bucle continuo
  const ref = useRef(null);
  const drag = useRef({ active: false, startX: 0, lastX: 0, moved: false, justDragged: false });
  const [paused, setPaused] = useState(false);

  // Posición base del offset en píxeles (negativa: avanza hacia la izquierda).
  // Se guarda fuera de React para que la animación no re-renderice nada.
  const posRef = useRef(0);

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

  // Abre el lightbox con TODAS las piezas del abanico y la tocada como inicio:
  // así se puede pasar a la siguiente sin cerrar.
  const handleOpen = (m) => {
    // Si el usuario venía arrastrando, el click no abre el lightbox.
    if (drag.current.justDragged) { drag.current.justDragged = false; drag.current.moved = false; return; }
    const start = items.findIndex((it) => it.src === m.src);
    onOpen({ items: items.map((it) => ({ ...it, type: it.type || "image" })), start: start < 0 ? 0 : start });
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
