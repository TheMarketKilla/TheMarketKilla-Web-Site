import { useI18n } from "../i18n/I18nContext";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-white/5 bg-[#030303] py-12 px-6 lg:px-12" data-testid="site-footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 relative flex items-center justify-center">
                <div className="absolute inset-0 border border-champagne rotate-45" />
                <div className="w-1.5 h-1.5 bg-champagne" />
              </div>
              <span className="font-display text-base text-white">
                The<span className="gold-text-gradient font-semibold">MarketKilla</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">{t.footer.tagline}</p>
          </div>
          <div className="md:col-span-3">
            <div className="label-mono mb-4">{t.footer.nav}</div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#services" className="hover:text-champagne">{t.nav.services}</a></li>
              <li><a href="#markets" className="hover:text-champagne">{t.nav.markets}</a></li>
              <li><a href="#pricing" className="hover:text-champagne">{t.nav.pricing}</a></li>
              <li><a href="#contact" className="hover:text-champagne">{t.nav.contact}</a></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <div className="label-mono mb-4">{t.footer.contact}</div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href="https://t.me/TheMarketKilla" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                  Telegram · @TheMarketKilla
                </a>
              </li>
              <li>
                <a href="https://t.me/The_Market_Killa" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                  Canal · @The_Market_Killa
                </a>
              </li>
              <li>
                <a href="mailto:themarketkilla@hotmail.com" className="hover:text-champagne">
                  themarketkilla@hotmail.com
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@themarketkilla" target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                  YouTube · @themarketkilla
                </a>
              </li>
            </ul>
            <p className="text-xs text-zinc-600 leading-relaxed mt-4">{t.footer.legal}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              <a href="/terminos" className="text-xs text-zinc-500 hover:text-champagne transition-colors">{t.footer.terms}</a>
              <a href="/privacidad" className="text-xs text-zinc-500 hover:text-champagne transition-colors">{t.footer.privacy}</a>
            </div>
          </div>
        </div>
        <div className="hairline mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="label-mono">© {new Date().getFullYear()} TheMarketKilla · {t.footer.copy}</div>
          <div className="font-mono-ui text-[10px] text-zinc-700 tracking-widest">v1.0 · MARKET ENGINE</div>
        </div>
      </div>
    </footer>
  );
}
