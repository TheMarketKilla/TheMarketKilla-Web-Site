import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

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
              Algo saliÃ³ mal. Recarga la pÃ¡gina.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-gold"
              data-testid="error-reload-btn"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
