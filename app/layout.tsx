import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "✨ AstroVision — Prévisions Astrologiques IA",
  description: "Découvrez votre destinée à travers les astres. Prévisions personnalisées basées sur votre signe solaire, ascendant, signe lunaire et l'alignement des planètes, propulsées par l'IA.",
  keywords: "astrologie, horoscope, signe zodiacal, ascendant, planètes, prévisions, IA",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#0a0015",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen antialiased" style={{ background: "#0a0015", color: "#e8d5ff" }}>
        {children}
      </body>
    </html>
  );
}
