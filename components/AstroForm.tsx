"use client";
import { useState } from "react";

interface FormData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: string;
  theme: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

const CITIES = [
  { name: "Paris", lat: "48.8566" },
  { name: "Marseille", lat: "43.2965" },
  { name: "Lyon", lat: "45.7640" },
  { name: "Bordeaux", lat: "44.8378" },
  { name: "Toulouse", lat: "43.6047" },
  { name: "Montréal", lat: "45.5017" },
  { name: "Bruxelles", lat: "50.8503" },
  { name: "Genève", lat: "46.2044" },
  { name: "Casablanca", lat: "33.5731" },
  { name: "Tunis", lat: "36.8190" },
  { name: "Alger", lat: "36.7372" },
  { name: "Dakar", lat: "14.6928" },
  { name: "Londres", lat: "51.5074" },
  { name: "Madrid", lat: "40.4168" },
  { name: "Rome", lat: "41.9028" },
  { name: "New York", lat: "40.7128" },
  { name: "Tokyo", lat: "35.6762" },
  { name: "Shanghai", lat: "31.2304" },
  { name: "Autre", lat: "" },
];

const THEMES = [
  { value: "global", label: "🌟 Vue d'ensemble", desc: "Personnalité & destinée générale" },
  { value: "amour", label: "❤️ Amour & Relations", desc: "Vie sentimentale & compatibilité" },
  { value: "travail", label: "💼 Carrière & Succès", desc: "Vie professionnelle & ambitions" },
  { value: "sante", label: "🌿 Santé & Bien-être", desc: "Équilibre physique & mental" },
  { value: "finances", label: "💰 Finances & Prospérité", desc: "Argent, abondance & opportunités" },
  { value: "spiritualite", label: "🔮 Spiritualité", desc: "Évolution de l'âme & karma" },
];

export default function AstroForm({ onSubmit, loading }: Props) {
  const [formData, setFormData] = useState<FormData>({
    birthDate: "",
    birthTime: "12:00",
    birthPlace: "Paris",
    latitude: "48.8566",
    theme: "global",
  });

  const handleCityChange = (city: string) => {
    const found = CITIES.find((c) => c.name === city);
    setFormData((prev) => ({
      ...prev,
      birthPlace: city,
      latitude: found?.lat || prev.latitude,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.birthDate) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Birth Date */}
      <div className="space-y-2">
        <label className="block text-purple-300 text-sm font-medium tracking-wider uppercase">
          📅 Date de naissance
        </label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData((p) => ({ ...p, birthDate: e.target.value }))}
          required
          className="w-full px-4 py-3 rounded-xl text-purple-100 border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          style={{ background: "rgba(88, 28, 135, 0.2)" }}
        />
      </div>

      {/* Birth Time */}
      <div className="space-y-2">
        <label className="block text-purple-300 text-sm font-medium tracking-wider uppercase">
          🕐 Heure de naissance
        </label>
        <input
          type="time"
          value={formData.birthTime}
          onChange={(e) => setFormData((p) => ({ ...p, birthTime: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl text-purple-100 border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          style={{ background: "rgba(88, 28, 135, 0.2)" }}
        />
        <p className="text-xs text-purple-400/60">Pour un ascendant précis</p>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="block text-purple-300 text-sm font-medium tracking-wider uppercase">
          🌍 Lieu de naissance
        </label>
        <select
          value={formData.birthPlace}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-purple-100 border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          style={{ background: "rgba(88, 28, 135, 0.2)" }}
        >
          {CITIES.map((c) => (
            <option key={c.name} value={c.name} style={{ background: "#1a0033" }}>
              {c.name}
            </option>
          ))}
        </select>
        {formData.birthPlace === "Autre" && (
          <input
            type="number"
            step="0.0001"
            placeholder="Latitude (ex: 48.8566 pour Paris)"
            value={formData.latitude}
            onChange={(e) => setFormData((p) => ({ ...p, latitude: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-purple-100 border border-purple-500/30 focus:border-purple-400 focus:outline-none transition-all"
            style={{ background: "rgba(88, 28, 135, 0.2)" }}
          />
        )}
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <label className="block text-purple-300 text-sm font-medium tracking-wider uppercase">
          🔮 Thème de prévision
        </label>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setFormData((p) => ({ ...p, theme: t.value }))}
              className={`p-3 rounded-xl text-left transition-all border ${
                formData.theme === t.value
                  ? "border-purple-400 text-purple-100"
                  : "border-purple-500/20 text-purple-300/70 hover:border-purple-500/40"
              }`}
              style={{
                background: formData.theme === t.value
                  ? "rgba(168, 85, 247, 0.2)"
                  : "rgba(88, 28, 135, 0.1)",
              }}
            >
              <div className="text-sm font-medium">{t.label}</div>
              <div className="text-xs text-purple-400/60 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !formData.birthDate}
        className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Consultation des astres...
            </>
          ) : (
            <>
              ✨ Révéler ma destinée
            </>
          )}
        </span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
          style={{ background: "linear-gradient(135deg, #ffffff, transparent)" }}
        />
      </button>
    </form>
  );
}
