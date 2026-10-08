import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/i18n/I18nContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PriceTicker from "@/components/PriceTicker";
import MarketsPanel from "@/components/MarketsPanel";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

function Landing() {
  const [planInterest, setPlanInterest] = useState("");

  const onSelectPlan = (name) => {
    setPlanInterest(name);
    requestAnimationFrame(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <div className="App relative" data-testid="landing-page">
      <Header />
      <Hero />
      <PriceTicker />
      <MarketsPanel />
      <ServicesSection />
      <PricingSection onSelectPlan={onSelectPlan} />
      <ContactSection initialPlan={planInterest} />
      <Footer />
      <Toaster theme="dark" position="top-right" toastOptions={{
        style: { background: "#0a0a0a", border: "1px solid rgba(229,193,88,0.4)", color: "#fff", fontFamily: "JetBrains Mono", borderRadius: 0 }
      }} />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
