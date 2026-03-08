import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { AstroData } from "@/lib/astrology";
import { THEME_CONFIG } from "@/lib/astrology";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { astroData, theme }: { astroData: AstroData; theme: string } = await request.json();

    if (!astroData) {
      return new Response(JSON.stringify({ error: "Données astrologiques manquantes" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { sunSign, moonSign, ascendant, planetPositions, aspects } = astroData;

    const planetSummary = planetPositions
      .map((p) => `${p.planet.name} en ${p.sign.name}${p.retrograde ? " (rétrograde)" : ""} à ${p.degree}°`)
      .join(", ");

    const aspectSummary = aspects
      .slice(0, 8)
      .map((a) => `${a.planet1} ${a.symbol} ${a.planet2} (${a.type}, orbe ${a.orb}°)`)
      .join("; ");

    const themePrompt = THEME_CONFIG[theme]?.prompt ?? THEME_CONFIG.global.prompt;

    const prompt = `Tu es un astrologue expert avec une connaissance profonde de l'astrologie occidentale et védique. Génère une prévision astrologique détaillée et poétique en français.

**Thème de la prévision :** ${themePrompt}

**Données natales :**
- Signe solaire : ${sunSign.name} (${sunSign.element}, ${sunSign.quality}, gouverné par ${sunSign.ruler})
- Signe lunaire : ${moonSign.name} (${moonSign.element}, ${moonSign.quality})
- Ascendant : ${ascendant.name} (${ascendant.element}, ${ascendant.quality})

**Positions planétaires :**
${planetSummary}

**Aspects planétaires actifs :**
${aspectSummary || "Aucun aspect majeur significatif"}

**Instructions :**
1. Commence par une ouverture poétique et mystique sur le cosmos (2-3 phrases)
2. Analyse l'interaction entre le signe solaire, lunaire et l'ascendant (3-4 phrases)
3. Interprète les positions planétaires les plus significatives (4-5 phrases)
4. Analyse les aspects planétaires et leur influence (3-4 phrases)
5. Donne des conseils pratiques pour la période actuelle (3-4 conseils concrets)
6. Conclus avec une affirmation positive et encourageante

Utilise un ton à la fois mystique, poétique et concret. Inclus des métaphores cosmiques. Formate avec des sections claires en utilisant des marqueurs **Titre :** pour chaque section. La prévision doit être riche, détaillée et personnalisée (environ 400-500 mots).`;

    const stream = await client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system: "Tu es AstroVision, un astrologue de renommée mondiale qui combine la sagesse ancienne des étoiles avec les insights de l'intelligence artificielle moderne. Tes prévisions sont poétiques, précises et profondément perspicaces.",
      messages: [{ role: "user", content: prompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Prediction API error:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la génération de la prévision" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
