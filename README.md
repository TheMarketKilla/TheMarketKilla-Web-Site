# 📄 TheMarketKilla-Web-Site

Web oficial de **TheMarketKilla** — trading automatizado (robots/EA), CopyTrading, Oro (XAUUSD) y Crypto.

- **Producción:** https://the-market-killa-web-site.vercel.app
- **Repo:** https://github.com/TheMarketKilla/TheMarketKilla-Web-Site

## 🚀 Stack

- **Frontend:** React 19 + CRA/craco · Tailwind CSS v3 · Framer Motion · shadcn/ui · Phosphor Icons · Three.js (hero) · Recharts
- **Datos de mercado:** API pública de Binance (ticker 24h + klines) con fallback a mock
- **i18n:** ES / EN propio (`src/i18n/translations.js`)
- **Deploy:** Vercel (proyecto `the-market-killa-web-site`, root `frontend/`, output `build`)

## 🛠 Desarrollo local

```bash
cd frontend
npm install --legacy-peer-deps
npm start          # http://localhost:3000
npm run build      # build de producción
```

## 🚀 Deploy

Proyecto Vercel ya vinculado (CLI + token del vault). Desde `frontend/`:

```bash
set -a; source ~/.hermes/vault/vercel.env; set +a
npx vercel deploy --prod --yes --token "$VERCEL_TOKEN"
```

> Detalle del flujo → skill `themarketkilla-web` y skill `deploy-vercel`.

## 📁 Estructura

```
frontend/
  src/
    components/     Header · Hero · HeroScene · PriceTicker · MarketsPanel ·
                    ServicesSection · PricingSection · ContactSection · Footer
    data/           mockData.js (fallback de precios)
    hooks/          useBinanceData.js (Binance pública)
    i18n/           I18nContext.jsx · translations.js (ES/EN)
  public/           index.html
backend/            (legacy, sin uso — el sitio es estático)
```
