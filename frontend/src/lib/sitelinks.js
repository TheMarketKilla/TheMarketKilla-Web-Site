/*
 * sitelinks.js — Links externos e internos de la marca (fuente única).
 * Los textos viven en i18n/translations.js; acá solo los destinos.
 */

// Canales y contacto reales de marca
export const LINKS = {
  dm: "https://t.me/TheMarketKilla",
  canal: "https://t.me/The_Market_Killa",
  copyCanal: "https://t.me/TheMarketKillaCopyTrading",
  roboforex: "https://my.roboforex.com/en/?a=emvr",
  youtube: "https://www.youtube.com/@themarketkilla",
  email: "mailto:themarketkilla@hotmail.com",
  // CopyTrading — estrategias del panel de Roboforex
  roboEstrategiaA: "https://my.roboforex.com/en/copy-trading/my/strategies/bbba/37393149/overview",
  roboEstrategiaB: "https://my.roboforex.com/en/copy-trading/my/strategies/bbba/27486031/overview",
  // CopyTrading — cuentas master auditadas en Myfxbook
  myfxbookPerfil: "https://www.myfxbook.com/members/TheMarketKilla",
  myfxbookMaster1:
    "https://www.myfxbook.com/members/TheMarketKilla/themarketkilla-millions-strategy-1/12241336",
  myfxbookMaster2:
    "https://www.myfxbook.com/members/TheMarketKilla/themarketkilla-millions-strategy-2/12241349",
  // BreakOuts — prueba verificable
  myfxbookBreakouts:
    "https://www.myfxbook.com/members/TheMarketKilla/themarketkilla-breakout-killa-premium/11918605",
};

// Ruta interna de cada servicio (slug ↔ clave de traducción)
export const SERVICE_SLUGS = {
  copytrading: "copytrading",
  breakouts: "robot-breakouts",
  bullrun: "bull-run-2026",
  senales: "senales",
};

// Atajos de contacto (los más usados en CTAs)
export const TELEGRAM_DM = LINKS.dm;
export const TELEGRAM_CANAL = LINKS.canal;
export const COPY_CANAL = LINKS.copyCanal;

export const SERVICE_ROUTES = {
  copytrading: "/copytrading",
  breakouts: "/robot-breakouts",
  bullrun: "/bull-run-2026",
  senales: "/senales",
};

export default LINKS;
