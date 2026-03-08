"use client";
import { useEffect, useRef } from "react";

interface Props {
  text: string;
  loading: boolean;
  theme: string;
}

const THEME_ICONS: Record<string, string> = {
  global: "🌟",
  amour: "❤️",
  travail: "💼",
  sante: "🌿",
  finances: "💰",
  spiritualite: "🔮",
};

const THEME_LABELS: Record<string, string> = {
  global: "Vue d'ensemble",
  amour: "Amour & Relations",
  travail: "Carrière & Succès",
  sante: "Santé & Bien-être",
  finances: "Finances & Prospérité",
  spiritualite: "Chemin Spirituel",
};

function formatPrediction(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/^# (.+)$/gm, "<h3>$1</h3>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|p])/gm, "")
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith("<")) return line;
      return line;
    });
}

export default function PredictionDisplay({ text, loading, theme }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text]);

  if (!text && !loading) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-6xl mb-4 animate-float">🔮</div>
        <p className="text-purple-300/60 text-lg">
          Entrez vos données natales pour recevoir votre prévision cosmique personnalisée
        </p>
        <div className="mt-4 flex justify-center gap-4 text-2xl">
          {["♈", "♉", "♊", "♋", "♌", "♍"].map((s, i) => (
            <span key={i} className="text-purple-400/30 animate-twinkle" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.2))" }}
      >
        <span className="text-2xl">{THEME_ICONS[theme] || "🌟"}</span>
        <div>
          <h2 className="font-bold text-white text-lg">Prévision Astrologique</h2>
          <p className="text-purple-300/70 text-sm">{THEME_LABELS[theme] || "Vue d'ensemble"}</p>
        </div>
        {loading && (
          <div className="ml-auto flex items-center gap-2 text-purple-300/70 text-sm">
            <span className="inline-block w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            Consultation...
          </div>
        )}
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="p-6 max-h-96 overflow-y-auto"
      >
        {loading && !text && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-4 rounded-full animate-pulse"
                style={{
                  background: "rgba(168, 85, 247, 0.1)",
                  width: `${70 + Math.random() * 30}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {text && (
          <div
            className="prediction-text text-purple-100/90 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: `<p>${formatPrediction(text)}</p>`,
            }}
          />
        )}

        {loading && text && (
          <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5 rounded-sm" />
        )}
      </div>

      {/* Footer ornament */}
      {!loading && text && (
        <div className="px-6 py-3 text-center border-t border-purple-500/10">
          <div className="text-purple-400/30 text-xs tracking-widest">
            ✦ AstroVision ✦ Propulsé par Claude Opus ✦
          </div>
        </div>
      )}
    </div>
  );
}
