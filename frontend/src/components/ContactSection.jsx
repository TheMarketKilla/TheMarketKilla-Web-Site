import { useEffect, useState } from "react";
import axios from "axios";
import { useI18n } from "../i18n/I18nContext";
import { toast } from "sonner";
import { ArrowRight } from "@phosphor-icons/react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactSection({ initialPlan }) {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", plan_interest: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      // Normalize plan name to match plan_options (e.g., "PRO" -> "Pro")
      const normalized =
        initialPlan.charAt(0).toUpperCase() + initialPlan.slice(1).toLowerCase();
      const match = t.contact.plan_options.find(
        (o) => o.toLowerCase() === normalized.toLowerCase()
      );
      setForm((f) => ({ ...f, plan_interest: match || normalized }));
    }
  }, [initialPlan, t.contact.plan_options]);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, { ...form, language: lang });
      toast.success(t.contact.success);
      setForm({ name: "", email: "", phone: "", plan_interest: "", message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail.map((d) => d.msg).join(", ") : (detail || t.contact.error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
            <div>
              <div className="label-mono mb-1">DESK</div>
              <div className="font-mono-ui text-sm text-zinc-300">desk@themarketkilla.com</div>
            </div>
            <div>
              <div className="label-mono mb-1">RESPONSE</div>
              <div className="font-mono-ui text-sm text-zinc-300">&lt; 24h</div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-7 matte-card p-8 sm:p-10 space-y-5" data-testid="contact-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-mono mb-2 block">{t.contact.name}</label>
              <input
                required
                value={form.name}
                onChange={update("name")}
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white font-mono-ui text-sm focus:border-champagne focus:outline-none transition-colors"
                data-testid="contact-input-name"
              />
            </div>
            <div>
              <label className="label-mono mb-2 block">{t.contact.email}</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={update("email")}
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white font-mono-ui text-sm focus:border-champagne focus:outline-none transition-colors"
                data-testid="contact-input-email"
              />
            </div>
            <div>
              <label className="label-mono mb-2 block">{t.contact.phone}</label>
              <input
                value={form.phone}
                onChange={update("phone")}
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white font-mono-ui text-sm focus:border-champagne focus:outline-none transition-colors"
                data-testid="contact-input-phone"
              />
            </div>
            <div>
              <label className="label-mono mb-2 block">{t.contact.plan}</label>
              <div className="flex gap-2 flex-wrap">
                {t.contact.plan_options.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setForm({ ...form, plan_interest: opt })}
                    className={`px-3 py-2 text-xs font-mono-ui uppercase tracking-wider border transition-colors ${form.plan_interest === opt ? "border-champagne text-champagne bg-champagne/5" : "border-white/10 text-zinc-400 hover:border-white/30"}`}
                    data-testid={`contact-plan-${opt}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="label-mono mb-2 block">{t.contact.message}</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={update("message")}
              className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white font-mono-ui text-sm focus:border-champagne focus:outline-none transition-colors resize-none"
              data-testid="contact-input-message"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full sm:w-auto group disabled:opacity-50"
            data-testid="contact-submit"
          >
            <span>{loading ? t.contact.sending : t.contact.submit}</span>
            <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" weight="bold" />
          </button>
        </form>
      </div>
    </section>
  );
}
