/*
 * translations.js — TheMarketKilla
 * Contenido real de la marca. Precios: themarketkilla-brand/reference/catalogo.md
 * Regla: nada de cifras inventadas, promesas de rentabilidad ni resultados no verificables.
 */

export const translations = {
  es: {
    nav: {
      services: "Servicios",
      markets: "Mercados",
      pricing: "Accesos",
      contact: "Contacto",
      cta: "Escríbeme",
    },
    hero: {
      kicker: "TRADING AUTOMATIZADO · FOREX · ORO · CRYPTO",
      title_a: "El sistema opera.",
      title_b: "Con reglas, no con emoción.",
      subtitle:
        "+10 años operando Forex, Oro y Crypto. +500 estrategias programadas. Robots que ejecutan la misma disciplina de siempre, 24/5, sin dudar y sin avaricia.",
      cta_primary: "Ver cómo funciona",
      cta_secondary: "Ver mercados en vivo",
      stat_a: "Años en los mercados",
      stat_b: "Estrategias programadas",
      stat_c: "FTMO Challenge pasado",
    },
    ticker: { live: "EN VIVO" },
    markets: {
      kicker: "DATOS · BINANCE · TIEMPO REAL",
      title: "Sala de mercados",
      subtitle:
        "Precios spot directos del libro de órdenes de Binance. BTC, ETH, XRP y oro tokenizado (PAXG) — actualizados cada 15 segundos.",
      change_24h: "24h",
      high: "Máx 24h",
      low: "Mín 24h",
      vol: "Volumen",
    },
    services: {
      kicker: "SERVICIOS · THEMARKETKILLA",
      title: "Cuatro formas de operar conmigo. 👇",
      subtitle:
        "Del robot que trabaja solo al grupo donde guiamos el ciclo alcista. Elige por dónde entrar.",
      list: {
        robots: {
          tag: "01",
          title: "CopyTrading en Oro",
          badge: "GRATIS",
          desc: "Copio mis operaciones de scalping en Oro (XAUUSD) desde una cuenta Master. Tú solo conectas y ajustas el lote. Es gratis si abres tu cuenta de Roboforex con mi código.",
          meta: "Roboforex · MT5 Cent · mínimo $100",
          cta_label: "Entrar al canal de CopyTrading",
          cta_href: "https://t.me/TheMarketKillaCopyTrading",
          cta2_label: "Abrir mi panel de Roboforex",
          cta2_href: "https://my.roboforex.com/en/?a=emvr",
        },
        copy: {
          tag: "02",
          title: "Robot BreakOuts",
          badge: "GRATIS O $490",
          desc: "Mi robot de MT5: busca la tendencia y entra en cada ruptura a favor. Multipar, con stop bajo la estructura, BreakEven y TrailingStop. Nunca Grid, nunca Martingala. Lo pasó al 100 % en FTMO.",
          meta: "MT5 · Forex · Oro · Índices · Fondeo",
        },
        invest: {
          tag: "03",
          title: "Bull Run 2026",
          badge: "10 PLAZAS",
          desc: "Grupo privado para recorrer el ciclo alcista: qué acumular y por qué, con visión macro y rebalanceo táctico. Solo 10 personas, para poder escribirles una por una.",
          meta: "Pago único $490 · grupo privado",
        },
        signals: {
          tag: "04",
          title: "Señales",
          badge: "PRÓXIMAMENTE",
          desc: "Forex, Crypto, Índices y Metales. De 2 a 10 señales por semana, cada una con Stop Loss estricto, Take Profit, BreakEven y TrailingStop. Entrega por canal privado.",
          meta: "Desde $30/mes",
        },
      },
    },
    pricing: {
      kicker: "ACCESOS",
      title: "Cada servicio, su precio.",
      subtitle:
        "Sin suscripciones atadas ni planes que no uso. Lo que cuesta cada cosa es lo que ves.",
      mo: "/mes",
      once: "pago único",
      most: "MÁS ELEGIDO",
      cta: "Escríbeme por Telegram",
      tiers: [
        {
          name: "COPYTRADING",
          price: "GRATIS",
          tagline: "Solo con mi código de referido",
          features: [
            "Copia automática de mis operaciones",
            "Scalping en Oro (XAUUSD)",
            "Cuenta Master transparente",
            "Mínimo $100 en tu cuenta",
            "Sin cuotas ni mensualidades",
          ],
          note: "Gratis para todos los referidos de Roboforex. Sin cuotas ni mensualidades.",
        },
        {
          name: "ROBOT BREAKOUTS",
          price: "$200",
          price_was: "$490",
          discount: "AHORRAS $290 · -59%",
          tagline: "Licencia premium · cualquier broker",
          features: [
            "El robot en tu MT5, multipar",
            "Stop bajo estructura + BreakEven + Trailing",
            "Sin Grid ni Martingala",
            "Sirve para fondeo (FTMO/FundedNext)",
            "Pago único, tuyo para siempre",
          ],
          note: "Oferta por tiempo limitado. Con cuenta Roboforex o Tickmill (Pro·Classic) y mi código, la licencia sale gratis.",
        },
        {
          name: "BULL RUN 2026",
          price: "$490",
          tagline: "Grupo privado · solo 10 plazas",
          features: [
            "Ruta guiada por el ciclo alcista",
            "Qué acumular y por qué, con visión macro",
            "Rebalanceo táctico sobre la marcha",
            "Acceso directo a mí, uno por uno",
            "Pago único, sin mensualidades",
          ],
          note: "Solo 10 personas: cuando se llenan, se cierra.",
        },
        {
          name: "SEÑALES",
          price: "Desde $30",
          tagline: "Forex · Crypto · Índices · Metales",
          features: [
            "2-10 señales por semana",
            "Stop Loss estricto en cada entrada",
            "Take Profit, BreakEven y TrailingStop",
            "Entrega directa por Telegram",
            "$30/mes · $75/3m · $135/6m · $240/12m",
          ],
          note: "🕒 Muy pronto. La lista se cierra por orden de llegada.",
        },
      ],
    },
    contact: {
      kicker: "CONTACTO",
      title: "Háblame directo.",
      subtitle:
        "Sin formularios ni intermediarios. Me escribes por Telegram, me cuentas qué buscas y te digo si puedo ayudarte.",
      telegram: "Escribirme al privado",
      channel: "Entrar al canal",
      panel_title: "Un mensaje y hablamos.",
      panel_text:
        "Me cuentas qué buscas — copiar mis operaciones, el robot, el grupo del Bull Run o las señales — y te digo con franqueza si encaja contigo. Sin formularios, sin esperas, sin comerciales de por medio.",
      email_label: "Email",
      cards: {
        dm: { label: "TELEGRAM", value: "@TheMarketKilla" },
        channel: { label: "CANAL", value: "The_Market_Killa" },
        email: { label: "EMAIL", value: "themarketkilla@hotmail.com" },
      },
      note: "Respondo yo, no un bot. Si no te contesto al instante, es porque estoy frente al gráfico.",
    },
    footer: {
      tagline: "+10 años operando. +500 estrategias programadas.",
      legal: "TheMarketKilla no es una sociedad constituida. Los datos de la cuenta Master se publican en abierto.",
      copy: "Todos los derechos reservados.",
      channels: "CANALES",
      contact: "CONTACTO",
      nav: "NAV",
      terms: "Términos",
      privacy: "Privacidad",
    },
  },
  en: {
    nav: {
      services: "Services",
      markets: "Markets",
      pricing: "Access",
      contact: "Contact",
      cta: "Message me",
    },
    hero: {
      kicker: "AUTOMATED TRADING · FOREX · GOLD · CRYPTO",
      title_a: "The system trades.",
      title_b: "By rules, not emotion.",
      subtitle:
        "+10 years trading Forex, Gold and Crypto. +500 strategies programmed. Robots running the same discipline as always — 24/5, without hesitation, without greed.",
      cta_primary: "See how it works",
      cta_secondary: "Live markets",
      stat_a: "Years in the markets",
      stat_b: "Strategies programmed",
      stat_c: "FTMO Challenge passed",
    },
    ticker: { live: "LIVE" },
    markets: {
      kicker: "DATA · BINANCE · REAL-TIME",
      title: "Market room",
      subtitle:
        "Spot prices straight from Binance's order book. BTC, ETH, XRP and tokenized gold (PAXG) — refreshed every 15 seconds.",
      change_24h: "24h",
      high: "24h High",
      low: "24h Low",
      vol: "Volume",
    },
    services: {
      kicker: "SERVICES · THEMARKETKILLA",
      title: "Four ways to trade with me. 👇",
      subtitle:
        "From the robot that works on its own to the group where we ride the bull cycle. Pick your entry.",
      list: {
        robots: {
          tag: "01",
          title: "Gold CopyTrading",
          badge: "FREE",
          desc: "I copy my Gold (XAUUSD) scalping trades from a Master account. You just connect and set the lot size. Free if you open your Roboforex account with my code.",
          meta: "Roboforex · MT5 Cent · $100 minimum",
          cta_label: "Join the CopyTrading channel",
          cta_href: "https://t.me/TheMarketKillaCopyTrading",
          cta2_label: "Open my Roboforex panel",
          cta2_href: "https://my.roboforex.com/en/?a=emvr",
        },
        copy: {
          tag: "02",
          title: "BreakOuts Robot",
          badge: "FREE OR $490",
          desc: "My MT5 robot: reads the trend and takes every breakout in its direction. Multi-pair, stop under structure, BreakEven and TrailingStop. Never Grid, never Martingale. It passed FTMO 100 %.",
          meta: "MT5 · Forex · Gold · Indices · Prop firms",
        },
        invest: {
          tag: "03",
          title: "Bull Run 2026",
          badge: "10 SPOTS",
          desc: "A private group to ride the bull cycle: what to accumulate and why, with macro vision and tactical rebalancing. Only 10 people, so I can answer each one personally.",
          meta: "One-time $490 · private group",
        },
        signals: {
          tag: "04",
          title: "Signals",
          badge: "COMING SOON",
          desc: "Forex, Crypto, Indices and Metals. 2 to 10 signals a week, each with a strict Stop Loss, Take Profit, BreakEven and TrailingStop. Delivered through a private channel.",
          meta: "From $30/month",
        },
      },
    },
    pricing: {
      kicker: "ACCESS",
      title: "Each service, its price.",
      subtitle:
        "No locked-in subscriptions and no plans I don't use. What it costs is what you see.",
      mo: "/mo",
      once: "one-time",
      most: "MOST CHOSEN",
      cta: "Message me on Telegram",
      tiers: [
        {
          name: "COPYTRADING",
          price: "FREE",
          tagline: "Only with my referral code",
          features: [
            "Automatic copy of my trades",
            "Gold (XAUUSD) scalping",
            "Transparent Master account",
            "$100 minimum in your account",
            "No fees, no monthly payments",
          ],
          note: "Free for all Roboforex referrals. No fees, no monthly payments.",
        },
        {
          name: "BREAKOUTS ROBOT",
          price: "$200",
          price_was: "$490",
          discount: "SAVE $290 · -59%",
          tagline: "Premium license · any broker",
          features: [
            "The robot on your MT5, multi-pair",
            "Stop under structure + BreakEven + Trailing",
            "No Grid, no Martingale",
            "Works for prop firms (FTMO/FundedNext)",
            "One-time payment, yours for good",
          ],
          note: "Limited-time offer. With a Roboforex or Tickmill account (Pro·Classic) and my code, the license comes out free.",
        },
        {
          name: "BULL RUN 2026",
          price: "$490",
          tagline: "Private group · only 10 spots",
          features: [
            "Guided route through the bull cycle",
            "What to accumulate and why, with macro vision",
            "Tactical rebalancing along the way",
            "Direct access to me, one on one",
            "One-time payment, no subscriptions",
          ],
          note: "Only 10 people: when it fills, it closes.",
        },
        {
          name: "SIGNALS",
          price: "From $30",
          tagline: "Forex · Crypto · Indices · Metals",
          features: [
            "2-10 signals per week",
            "Strict Stop Loss on every entry",
            "Take Profit, BreakEven and TrailingStop",
            "Delivered directly on Telegram",
            "$30/mo · $75/3m · $135/6m · $240/12m",
          ],
          note: "🕒 Coming very soon. The list closes in order of arrival.",
        },
      ],
    },
    contact: {
      kicker: "CONTACT",
      title: "Talk to me directly.",
      subtitle:
        "No forms, no middlemen. You message me on Telegram, tell me what you're after, and I'll tell you if I can help.",
      telegram: "Message me privately",
      channel: "Join the channel",
      panel_title: "One message and we talk.",
      panel_text:
        "Tell me what you're after — copying my trades, the robot, the Bull Run group or the signals — and I'll tell you straight if it fits you. No forms, no waiting, no salespeople in between.",
      email_label: "Email",
      cards: {
        dm: { label: "TELEGRAM", value: "@TheMarketKilla" },
        channel: { label: "CHANNEL", value: "The_Market_Killa" },
        email: { label: "EMAIL", value: "themarketkilla@hotmail.com" },
      },
      note: "You get me, not a bot. If I don't answer right away, I'm in front of the chart.",
    },
    footer: {
      tagline: "+10 years trading. +500 strategies programmed.",
      legal: "TheMarketKilla is not a registered company. The Master account data is published openly.",
      copy: "All rights reserved.",
      channels: "CHANNELS",
      contact: "CONTACT",
      nav: "NAV",
      terms: "Terms",
      privacy: "Privacy",
    },
  },
};

export default translations;
