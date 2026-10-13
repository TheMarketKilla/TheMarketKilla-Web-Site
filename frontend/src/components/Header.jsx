import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { List, X } from "@phosphor-icons/react";

/*
 * Header — nav que funciona igual en la home (anclas) y en las sub-páginas.
 * En una sub-página las anclas llevan a "/#seccion" para no romper la ruta.
 */
export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = ["services", "markets", "pricing", "contact"];
  const labels = {
    services: t.nav.services,
    markets: t.nav.markets,
    pricing: t.nav.pricing,
    contact: t.nav.contact,
  };

  const go = (e, id) => {
    setOpen(false);
    if (onHome) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Volvemos a la home y bajamos a la sección
      e.preventDefault();
      navigate(`/#${id}`);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled || !onHome ? "bg-black/70 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"}`}
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="logo-link">
          <div className="w-7 h-7 relative flex items-center justify-center">
            <div className="absolute inset-0 border border-champagne rotate-45" />
            <div className="w-1.5 h-1.5 bg-champagne" />
          </div>
          <span className="font-display text-base tracking-tight text-white">
            The<span className="gold-text-gradient font-semibold">MarketKilla</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {sections.map((id) => (
            <a
              key={id}
              href={onHome ? `#${id}` : `/#${id}`}
              onClick={(e) => go(e, id)}
              className="label-mono hover:text-champagne transition-colors"
              data-testid={`nav-${id}`}
            >
              {labels[id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 border border-white/10 p-0.5">
            {["es", "en"].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-3 py-1 text-[11px] font-mono-ui uppercase tracking-widest transition-colors ${lang === code ? "bg-champagne text-black" : "text-zinc-400 hover:text-white"}`}
                data-testid={`lang-toggle-${code}`}
              >
                {code}
              </button>
            ))}
          </div>
          <a
            href="https://t.me/TheMarketKilla"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex btn-gold py-2 px-5 text-[10px]"
            data-testid="header-cta"
          >
            {t.nav.cta}
          </a>
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-toggle"
            aria-label="menu"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl" data-testid="mobile-menu">
          <div className="px-6 py-6 flex flex-col gap-5">
            {sections.map((id) => (
              <a
                key={id}
                href={onHome ? `#${id}` : `/#${id}`}
                onClick={(e) => go(e, id)}
                className="label-mono hover:text-champagne"
                data-testid={`mobile-nav-${id}`}
              >
                {labels[id]}
              </a>
            ))}
            <a
              href="https://t.me/TheMarketKilla"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-gold py-2 px-5 text-[10px] self-start"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
