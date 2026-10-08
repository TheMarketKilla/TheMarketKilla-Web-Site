import { useI18n } from "../i18n/I18nContext";
import { TelegramLogo, Envelope, Broadcast } from "@phosphor-icons/react";

const CHANNELS = [
  {
    key: "dm",
    href: "https://t.me/TheMarketKilla",
    Icon: TelegramLogo,
  },
  {
    key: "channel",
    href: "https://t.me/The_Market_Killa",
    Icon: Broadcast,
  },
  {
    key: "email",
    href: "mailto:themarketkilla@hotmail.com",
    Icon: Envelope,
  },
];

export default function ContactSection() {
  const { t } = useI18n();

  return (
    <section id="contact" className="py-24 sm:py-32 px-6 lg:px-12 relative" data-testid="contact-section">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="label-mono mb-3 text-champagne">{t.contact.kicker}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium text-white mb-6 leading-[1.05]">
            {t.contact.title}
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-md">{t.contact.subtitle}</p>
          <div className="hairline mt-12 max-w-xs" />
          <div className="mt-12 space-y-4">
            {CHANNELS.map(({ key, href, Icon }) => (
              <a
                key={key}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
                data-testid={`contact-channel-${key}`}
              >
                <span className="w-9 h-9 border border-white/10 group-hover:border-champagne/50 flex items-center justify-center text-zinc-400 group-hover:text-champagne transition-colors">
                  <Icon size={16} weight="duotone" />
                </span>
                <span>
                  <span className="label-mono block">{t.contact.cards[key].label}</span>
                  <span className="font-mono-ui text-sm text-zinc-300 group-hover:text-champagne transition-colors">
                    {t.contact.cards[key].value}
                  </span>
                </span>
              </a>
            ))}
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed mt-8 max-w-xs">{t.contact.note}</p>
        </div>

        <div className="lg:col-span-7 matte-card p-8 sm:p-12 flex flex-col justify-center" data-testid="contact-panel">
          <div className="w-12 h-12 border border-champagne/40 flex items-center justify-center text-champagne mb-8">
            <TelegramLogo size={24} weight="duotone" />
          </div>
          <h3 className="font-display text-3xl sm:text-4xl tracking-tight text-white mb-4 leading-tight">
            {t.contact.panel_title}
          </h3>
          <p className="text-zinc-400 leading-relaxed text-sm sm:text-base mb-10 max-w-lg">
            {t.contact.panel_text}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://t.me/TheMarketKilla"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              data-testid="contact-cta-dm"
            >
              {t.contact.telegram}
            </a>
            <a
              href="https://t.me/The_Market_Killa"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              data-testid="contact-cta-channel"
            >
              {t.contact.channel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
