import { Component } from "react";

/**
 * SectionBoundary — ErrorBoundary ligero para aislar una pieza concreta.
 * Uso: envolver componentes decorativos (3D, gráficos) para que un fallo
 * en ellos NO tumbe la página entera.
 *
 * silent=true  → si falla, no pinta nada (queda el fondo del contenedor).
 * silent=false → si falla, pinta un aviso discreto en su lugar.
 */
export default class SectionBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("SectionBoundary: pieza aislada sin render.", error?.message);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    if (this.props.silent) return null;

    return (
      <div className="w-full h-full flex items-center justify-center label-mono text-zinc-700">
        {this.props.fallback || "no disponible"}
      </div>
    );
  }
}
