"use client";
import { useState, useEffect } from "react";
import { THEME_CONFIG } from "@/lib/astrology";

export interface FormData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: string;
  longitude: string;
  theme: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  loading: boolean;
  defaultValues?: Partial<FormData>;
}

const CITIES = [
  { name: "Paris",      lat: "48.8566", lon: "2.3522"   },
  { name: "Marseille",  lat: "43.2965", lon: "5.3698"   },
  { name: "Lyon",       lat: "45.7640", lon: "4.8357"   },
  { name: "Bordeaux",   lat: "44.8378", lon: "-0.5792"  },
  { name: "Toulouse",   lat: "43.6047", lon: "1.4442"   },
  { name: "Montréal",   lat: "45.5017", lon: "-73.5673" },
  { name: "Bruxelles",  lat: "50.8503", lon: "4.3517"   },
  { name: "Genève",     lat: "46.2044", lon: "6.1432"   },
  { name: "Casablanca", lat: "33.5731", lon: "-7.5898"  },
  { name: "Tunis",      lat: "36.8190", lon: "10.1658"  },
  { name: "Alger",      lat: "36.7372", lon: "3.0865"   },
  { name: "Dakar",      lat: "14.6928", lon: "-17.4467" },
  { name: "Londres",    lat: "51.5074", lon: "-0.1278"  },
  { name: "Madrid",     lat: "40.4168", lon: "-3.7038"  },
  { name: "Rome",       lat: "41.9028", lon: "12.4964"  },
  { name: "New York",   lat: "40.7128", lon: "-74.0060" },
  { name: "Tokyo",      lat: "35.6762", lon: "139.6503" },
  { name: "Shanghai",   lat: "31.2304", lon: "121.4737" },
  { name: "Autre",      lat: "",        lon: ""          },
];

const THEMES = Object.entries(THEME_CONFIG).map(([value, cfg]) => ({ value, ...cfg }));

const INPUT_CLASS = "w-full px-4 py-3 rounded-xl text-purple-100 border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all";
const INPUT_STYLE = { background: "rgba(88, 28, 135, 0.2)" };

export default function AstroForm({ onSubmit, loading, defaultValues }: Props) {
  const [formData, setFormData] = useState<FormData>({
    birthDate:  defaultValues?.birthDate  ?? "",
    birthTime:  defaultValues?.birthTime  ?? "12:00",
    birthPlace: defaultValues?.birthPlace ?? "Paris",
    latitude:   defaultValues?.latitude   ?? "48.8566",
    longitude:  defaultValues?.longitude  ?? "2.3522",
    theme:      defaultValues?.theme      ?? "global",
  });

  // When share URL is decoded after mount, sync form fields
  useEffect(() => {
    if (!defaultValues || Object.keys(defaultValues).length === 0) return;
    setFormData((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues]);

  const handleCityChange = (city: string) => {
    const found = CITIES.find((c) => c.name === city);
    setFormData((prev) => ({
      ...prev,
      birthPlace: city,
      latitude:  found?.lat || prev.latitude,
      longitude: found?.lon || prev.longitude,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.birthDate) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-purple-300 text-sm font-medium tracking-wider uppercase">
          📅 Date de naissance
        </label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData((p) => ({ ...p, birthDate: e.target.value }))}
          required
          className={INPUT_CLASS}
          style={INPUT_STYLE}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-purple-300 text-sm font-medium tracking-wider uppercase">
          🕐 Heure de naissance
        </label>
        <input
          type="time"
          value={formData.birthTime}
          onChange={(e) => setFormData((p) => ({ ...p, birthTime: e.target.value }))}
          className={INPUT_CLASS}
          style={INPUT_STYLE}
        />
        <p className="text-xs text-purple-400/60">Pour un ascendant précis</p>
      </div>

      <div className="space-y-2">
        <label className="block text-purple-300 text-sm font-medium tracking-wider uppercase">
          🌍 Lieu de naissance
        </label>
        <select
          value={formData.birthPlace}
          onChange={(e) => handleCityChange(e.target.value)}
          className={INPUT_CLASS}
          style={INPUT_STYLE}
        >
          {CITIES.map((c) => (
            <option key={c.name} value={c.name} style={{ background: "#1a0033" }}>
              {c.name}
            </option>
          ))}
        </select>
        {formData.birthPlace === "Autre" && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number" step="0.0001" placeholder="Latitude"
              value={formData.latitude}
              onChange={(e) => setFormData((p) => ({ ...p, latitude: e.target.value }))}
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />
            <input
              type="number" step="0.0001" placeholder="Longitude"
              value={formData.longitude}
              onChange={(e) => setFormData((p) => ({ ...p, longitude: e.target.value }))}
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />
          </div>
        )}
      </div>

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
              <div className="text-sm font-medium">{t.icon} {t.label}</div>
              <div className="text-xs text-purple-400/60 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.birthDate}
        className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)" }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Consultation des astres...
            </>
          ) : (
            <>✨ Révéler ma destinée</>
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
