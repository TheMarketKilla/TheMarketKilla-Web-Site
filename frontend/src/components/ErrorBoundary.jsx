import { Component } from "react";

/**
 * ErrorBoundary — red de seguridad de la app.
 * Si algo revienta al renderizar, muestra una salida en vez de una pantalla en blanco.
 * El botón fuerza una recarga, para no quedar atrapado en un bundle viejo.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, detail: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, detail: error?.message ? String(error.message) : "" };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  reload = () => {
    try {
      if (window.caches?.keys) {
        window.caches.keys().then((keys) => keys.forEach((k) => window.caches.delete(k)));
      }
    } catch (e) {
      /* cache API no disponible: seguimos con la recarga */
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6" data-testid="error-boundary">
          <div className="matte-card p-10 max-w-md text-center">
            <div className="w-12 h-12 mx-auto mb-6 relative flex items-center justify-center">
              <div className="absolute inset-0 border border-champagne rotate-45" />
              <div className="w-2 h-2 bg-champagne" />
            </div>
            <h2 className="font-display text-2xl text-white tracking-tight mb-3">
              TheMarketKilla
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Algo salió mal cargando esta sección. Recarga la página.
            </p>
            {this.state.detail && (
              <p className="font-mono-ui text-[10px] text-zinc-600 mb-6 break-words">{this.state.detail}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={this.reload} className="btn-gold" data-testid="error-reload-btn">
                Recargar
              </button>
              <a
                href="https://t.me/TheMarketKilla"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Escríbeme
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
