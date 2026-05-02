import { useI18n } from "../i18n/I18nContext";
import { Robot, Copy, ChartLineUp, Lightning } from "@phosphor-icons/react";

const ICONS = { robots: Robot, copy: Copy, invest: ChartLineUp, signals: Lightning };

const IMAGES = {
  robots:
    "https://images.unsplash.com/photo-1735469157670-1212e570eadc?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  copy:
    "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  invest:
    "https://images.pexels.com/photos/4808279/pexels-photo-4808279.jpeg?auto=compress&cs=tinysrgb&w=1200",
  signals:
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
};

function ServiceCard({ k, item, big }) {
  const Icon = ICONS[k];
  return (
    <article
      className={`relative group matte-card overflow-hidden transition-all duration-500 hover:border-champagne/40 ${big ? "lg:col-span-8 lg:row-span-2 min-h-[520px]" : "lg:col-span-4 min-h-[260px]"}`}
      data-testid={`service-card-${k}`}
    >
      <div
        className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity duration-700"
        style={{
          backgroundImage: `url(${IMAGES[k]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(0.6) brightness(0.45)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
      <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border border-champagne/40 flex items-center justify-center text-champagne">
              <Icon size={22} weight="duotone" />
            </div>
            <div className="label-mono text-champagne">{item.tag}</div>
          </div>
          <div className="w-1.5 h-1.5 bg-champagne pulse-gold" />
        </div>
        <div className="mt-12 lg:mt-16">
          <h3 className={`font-display ${big ? "text-3xl sm:text-4xl" : "text-2xl"} tracking-tight text-white mb-4 leading-tight`}>
            {item.title}
          </h3>
          <p className="text-zinc-400 leading-relaxed text-sm sm:text-base max-w-md">
            {item.desc}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ServicesSection() {
  const { t } = useI18n();
  const list = t.services.list;
  return (
    <section id="services" className="py-24 sm:py-32 px-6 lg:px-12 relative" data-testid="services-section">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 max-w-3xl">
          <div className="label-mono mb-3 text-champagne">{t.services.kicker}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium text-white mb-4 leading-[1.05]">
            {t.services.title}
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">{t.services.subtitle}</p>
        </div>
        <div className="hairline mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-min">
          <ServiceCard k="robots" item={list.robots} big />
          <ServiceCard k="copy" item={list.copy} />
          <ServiceCard k="signals" item={list.signals} />
          <ServiceCard k="invest" item={list.invest} big />
        </div>
      </div>
    </section>
  );
}
