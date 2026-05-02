# TheMarketKilla — Trading & Market Intelligence Platform

Plataforma web profesional para monitoreo de mercados financieros en tiempo real, con precios de criptomonedas (BTC, ETH, XRP, GOLD/PAXG), gráficos interactivos y servicios de trading.

## 🚀 Stack Tecnológico

- **Frontend:** React (CRA) + craco, Tailwind CSS v3, Framer Motion, shadcn/ui
- **Backend:** FastAPI + Python (data en JSON)
- **API Externa:** Binance API
- **3D/Visualización:** Three.js (HeroScene), Recharts
- **Despliegue:** Vercel

## 🛠 Desarrollo Local

```bash
# Frontend
cd frontend
npm install --legacy-peer-deps
npm start

# Backend (opcional)
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

## 🌐 Links

- **Web:** https://the-market-killa-web-site.vercel.app
- **GitHub:** https://github.com/TheMarketKilla/TheMarketKilla-Web-Site
