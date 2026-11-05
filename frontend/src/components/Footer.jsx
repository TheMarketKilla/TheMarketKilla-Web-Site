import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { LINKS, SERVICE_ROUTES } from "../lib/sitelinks";

/*
 * Footer — 4 columnas con rol único cada una:
 * Marca · Servicios · Sígueme · Contacto. Sin repetir lo que ya dice
 * la sección de contacto de la home (acá solo DM, email y Roboforex).
 */
const SERVICES = ["copytrading", "breakouts", "bullrun", "senales"];

export default function Footer() {
  const { t } = useI18n();
  const location = useLocation();
  const onHome = location.pathname === "/";

  const goSection = (e, id) => {
    if (!onHome) return; // en sub-páginas deja navegar a /#id
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5 bg-[#030303] pt-14 pb-10 px-6 lg:px-12" data-testid="site-footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 mb-10">
          {/* Marca */}
          <div className="col-span-2 md:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 relative flex items-center justify-center">
                <div className="absolute inset-0 border border-champagne rotate-45" />
                <div className="w-1.5 h-1.5 bg-champagne" />
              </div>
              <span className="font-display text-base text-white">
                The<span className="gold-text-gradient font-semibold">MarketKilla</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">{t.footer.tagline}</p>
          </div>

          {/* Servicios — acceso directo a cada sub-página */}
          <div className="md:col-span-3">
            <div className="label-mono mb-4">{t.footer.services}</div>
            <ul className="space-y-2 text-sm text-zinc-400">
              {SERVICES.map((k) => (
                <li key={k}>
                  <Link to={SERVICE_ROUTES[k]} className="hover:text-champagne transition-colors">
                    {t.footer.serviceLinks[k]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sígueme */}
          <div className="md:col-span-3">
            <div className="label-mono mb-4">{t.footer.channels}</div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href={LINKS.canal} target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">
                  {t.footer.channelLabel}
                </a>
              </li>
              <li>
                <a href={LINKS.copyCanal} target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">
                  {t.footer.copyCanal}
                </a>
              </li>
              <li>
                <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">
                  {t.footer.youtube}
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto — solo los canales directos + atajos de la home */}
          <div className="col-span-2 md:col-span-2">
            <div className="label-mono mb-4">{t.footer.contact}</div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href={LINKS.dm} target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">
                  {t.footer.dmLabel}
                </a>
              </li>
              <li>
                <a href={LINKS.email} className="hover:text-champagne transition-colors break-all">
                  {t.footer.emailLabel}
                </a>
              </li>
              <li>
                <a href={LINKS.roboforex} target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">
                  {t.footer.roboforex}
                </a>
              </li>
            </ul>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li>
                <a href={onHome ? "#services" : "/#services"} onClick={(e) => goSection(e, "services")} className="hover:text-champagne transition-colors">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href={onHome ? "#pricing" : "/#pricing"} onClick={(e) => goSection(e, "pricing")} className="hover:text-champagne transition-colors">
                  {t.nav.pricing}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-[11px] text-zinc-600 leading-relaxed mb-5 max-w-3xl">{t.footer.legal}</p>
        <div className="hairline mb-5" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="label-mono text-[10px]">© {new Date().getFullYear()} TheMarketKilla · {t.footer.copy}</div>
          <div className="flex items-center gap-4">
            <a href="/terminos" className="text-xs text-zinc-500 hover:text-champagne transition-colors">{t.footer.terms}</a>
            <a href="/privacidad" className="text-xs text-zinc-500 hover:text-champagne transition-colors">{t.footer.privacy}</a>
            <span className="font-mono-ui text-[10px] text-zinc-700 tracking-widest">v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
