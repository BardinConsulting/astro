"use client";
import { useEffect, useRef, useMemo } from "react";
import { THEME_CONFIG, ZODIAC_SIGNS } from "@/lib/astrology";

interface Props {
  text: string;
  loading: boolean;
  theme: string;
}

// Convert markdown to safe HTML. Only allows <strong>, <em>, <h3>, <p> tags.
function formatPrediction(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") // escape first
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^#{1,2} (.+)$/gm, "<h3>$1</h3>")
    .replace(/\n\n+/g, "</p><p>");
}

export default function PredictionDisplay({ text, loading, theme }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cfg = THEME_CONFIG[theme] ?? THEME_CONFIG.global;

  // Memoize formatting so it only reruns when text changes, not on loading toggling
  const formattedHtml = useMemo(
    () => (text ? `<p>${formatPrediction(text)}</p>` : ""),
    [text]
  );

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
          {ZODIAC_SIGNS.slice(0, 6).map((s, i) => (
            <span key={s.symbol} className="text-purple-400/30 animate-twinkle" style={{ animationDelay: `${i * 0.3}s` }}>
              {s.symbol}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.2))" }}
      >
        <span className="text-2xl">{cfg.icon}</span>
        <div>
          <h2 className="font-bold text-white text-lg">Prévision Astrologique</h2>
          <p className="text-purple-300/70 text-sm">{cfg.label}</p>
        </div>
        {loading && (
          <div className="ml-auto flex items-center gap-2 text-purple-300/70 text-sm">
            <span className="inline-block w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            Consultation...
          </div>
        )}
      </div>

      <div ref={containerRef} className="p-6 max-h-96 overflow-y-auto">
        {loading && !text && (
          <div className="space-y-3">
            {[100, 90, 95, 80, 88, 70].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded-full animate-pulse"
                style={{ background: "rgba(168, 85, 247, 0.1)", width: `${w}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {formattedHtml && (
          <div
            className="prediction-text text-purple-100/90 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        )}

        {loading && text && (
          <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5 rounded-sm" />
        )}
      </div>

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
