"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import AstroForm from "@/components/AstroForm";
import PlanetGrid from "@/components/PlanetGrid";
import PredictionDisplay from "@/components/PredictionDisplay";
import { calculateAstroData, ZODIAC_SIGNS, type AstroData } from "@/lib/astrology";

const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });
const ZodiacWheel = dynamic(() => import("@/components/ZodiacWheel"), { ssr: false });

export default function Home() {
  const [astroData, setAstroData] = useState<AstroData | null>(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("global");

  const handleSubmit = useCallback(async (formData: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: string;
    longitude: string;
    theme: string;
  }) => {
    setLoading(true);
    setPrediction("");
    setCurrentTheme(formData.theme);

    const birthDate = new Date(formData.birthDate + "T12:00:00Z");
    const latitude = parseFloat(formData.latitude) || 48.8566;
    const longitude = parseFloat(formData.longitude) || 2.3522;

    const data = calculateAstroData(birthDate, formData.birthTime, formData.birthPlace, latitude, longitude);
    setAstroData(data);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ astroData: data, theme: formData.theme }),
      });

      if (!response.ok) throw new Error("Erreur API");
      if (!response.body) throw new Error("Pas de réponse");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setPrediction((prev) => prev + chunk);
      }
    } catch (err) {
      console.error(err);
      setPrediction("Une erreur s'est produite lors de la consultation des astres. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: "linear-gradient(135deg, #0a0015 0%, #12003a 50%, #0a0015 100%)" }}>
      <StarField />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)", filter: "blur(60px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ec4899, transparent)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-10 px-4">
          <div className="text-5xl mb-3 animate-float">✨</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">AstroVision</span>
          </h1>
          <p className="text-purple-300/70 text-lg max-w-xl mx-auto">
            Déchiffrez les mystères de votre destinée à travers l&apos;alignement des astres
          </p>
          <div className="flex justify-center gap-3 mt-3 text-purple-400/40 text-2xl">
            {ZODIAC_SIGNS.map((z, i) => (
              <span key={z.symbol} style={{ animationDelay: `${i * 0.2}s` }} className="animate-twinkle">{z.symbol}</span>
            ))}
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Form */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6">
                <h2 className="text-purple-300 font-bold text-lg mb-6 flex items-center gap-2">
                  <span>🌟</span> Thème Natal
                </h2>
                <AstroForm onSubmit={handleSubmit} loading={loading} />
              </div>
            </div>

            {/* Center: Wheel + Planets */}
            <div className="lg:col-span-1 space-y-6">
              {astroData ? (
                <>
                  <div className="glass-card p-6">
                    <h2 className="text-purple-300 font-bold text-lg mb-4 flex items-center gap-2">
                      <span>🪐</span> Roue Zodiacale
                    </h2>
                    <ZodiacWheel astroData={astroData} />
                  </div>
                  <div className="glass-card p-6">
                    <h2 className="text-purple-300 font-bold text-lg mb-4 flex items-center gap-2">
                      <span>📊</span> Positions & Aspects
                    </h2>
                    <PlanetGrid astroData={astroData} />
                  </div>
                </>
              ) : (
                <div className="glass-card p-8 text-center">
                  <div className="text-7xl mb-4 animate-rotate-slow inline-block">♈</div>
                  <p className="text-purple-300/50">
                    Votre carte du ciel apparaîtra ici après la consultation
                  </p>
                </div>
              )}
            </div>

            {/* Right: Prediction */}
            <div className="lg:col-span-1">
              <PredictionDisplay
                text={prediction}
                loading={loading}
                theme={currentTheme}
              />

              {/* Compatibility quick info */}
              {astroData && !loading && prediction && (
                <div className="glass-card p-4 mt-4">
                  <h3 className="text-purple-300 text-sm font-bold mb-3 flex items-center gap-2">
                    <span>💫</span> Votre profil cosmique
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg" style={{ background: "rgba(88, 28, 135, 0.2)" }}>
                      <div className="text-lg">{astroData.sunSign.emoji}</div>
                      <div className="text-purple-300 font-medium">{astroData.sunSign.name}</div>
                      <div className="text-purple-400/60">{astroData.sunSign.ruler}</div>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "rgba(88, 28, 135, 0.2)" }}>
                      <div className="text-lg">🌙</div>
                      <div className="text-purple-300 font-medium">{astroData.moonSign.name}</div>
                      <div className="text-purple-400/60">Lune</div>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "rgba(88, 28, 135, 0.2)" }}>
                      <div className="text-lg">{astroData.ascendant.emoji}</div>
                      <div className="text-purple-300 font-medium">{astroData.ascendant.name}</div>
                      <div className="text-purple-400/60">Ascendant</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center pb-8 text-purple-400/30 text-sm">
          <p>✦ AstroVision ✦ Propulsé par Claude Opus 4.6 ✦</p>
          <p className="mt-1 text-xs">À des fins de divertissement. Les astres guident, l&apos;humain décide.</p>
        </footer>
      </div>
    </div>
  );
}
