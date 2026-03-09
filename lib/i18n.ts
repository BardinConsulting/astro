// UI translations for French and English.
// AI-generated predictions are always in French (controlled via the API prompt).

export type Locale = "fr" | "en";

export interface Translations {
  lang:       string;
  header: {
    tagline:  string;
  };
  form: {
    title:          string;
    birthDate:      string;
    birthTime:      string;
    birthTimeHint:  string;
    birthPlace:     string;
    otherCity:      string;
    latPlaceholder: string;
    lonPlaceholder: string;
    theme:          string;
    submit:         string;
    submitting:     string;
  };
  prediction: {
    title:     string;
    emptyHint: string;
    consulting: string;
    footer:    string;
    timeout:   string;
    error:     string;
  };
  profile: {
    title:     string;
    moon:      string;
    ascendant: string;
    share:     string;
    copied:    string;
    exportPdf: string;
  };
  wheel: {
    title:     string;
    sun:       string;
    moon:      string;
    ascendant: string;
    emptyHint: string;
  };
  planets: {
    title:    string;
    aspects:  string;
    balance:  string;
    retrograde: string;
  };
  ttft:   string;
  cached: string;
  theme:  { dark: string; light: string };
}

const fr: Translations = {
  lang:   "FR",
  header: {
    tagline: "Déchiffrez les mystères de votre destinée à travers l'alignement des astres",
  },
  form: {
    title:          "Thème Natal",
    birthDate:      "📅 Date de naissance",
    birthTime:      "🕐 Heure de naissance",
    birthTimeHint:  "Pour un ascendant précis",
    birthPlace:     "🌍 Lieu de naissance",
    otherCity:      "Autre",
    latPlaceholder: "Latitude",
    lonPlaceholder: "Longitude",
    theme:          "🔮 Thème de prévision",
    submit:         "✨ Révéler ma destinée",
    submitting:     "Consultation des astres...",
  },
  prediction: {
    title:      "Prévision Astrologique",
    emptyHint:  "Entrez vos données natales pour recevoir votre prévision cosmique personnalisée",
    consulting: "Consultation...",
    footer:     "✦ AstroVision ✦ Propulsé par Claude Opus ✦",
    timeout:    "La consultation a expiré après 90 secondes. Les astres sont particulièrement bavards aujourd'hui — veuillez réessayer.",
    error:      "Une erreur s'est produite lors de la consultation des astres. Veuillez réessayer.",
  },
  profile: {
    title:     "💫 Votre profil cosmique",
    moon:      "Lune",
    ascendant: "Ascendant",
    share:     "🔗 Partager cette consultation",
    copied:    "✓ Lien copié !",
    exportPdf: "📄 Exporter en PDF",
  },
  wheel: {
    title:     "🪐 Roue Zodiacale",
    sun:       "☀ Soleil",
    moon:      "☽ Lune",
    ascendant: "↑ Ascendant",
    emptyHint: "Votre carte du ciel apparaîtra ici après la consultation",
  },
  planets: {
    title:      "📊 Positions & Aspects",
    aspects:    "🔗 Aspects actifs",
    balance:    "⚖️ Équilibre élémentaire",
    retrograde: "℞",
  },
  ttft:   "1er token",
  cached: "⚡ Depuis le cache",
  theme:  { dark: "🌙", light: "☀️" },
};

const en: Translations = {
  lang:   "EN",
  header: {
    tagline: "Decipher the mysteries of your destiny through the alignment of the stars",
  },
  form: {
    title:          "Natal Chart",
    birthDate:      "📅 Date of birth",
    birthTime:      "🕐 Time of birth",
    birthTimeHint:  "For an accurate ascendant",
    birthPlace:     "🌍 Place of birth",
    otherCity:      "Other",
    latPlaceholder: "Latitude",
    lonPlaceholder: "Longitude",
    theme:          "🔮 Reading theme",
    submit:         "✨ Reveal my destiny",
    submitting:     "Consulting the stars...",
  },
  prediction: {
    title:      "Astrological Reading",
    emptyHint:  "Enter your natal data to receive your personalized cosmic forecast",
    consulting: "Consulting...",
    footer:     "✦ AstroVision ✦ Powered by Claude Opus ✦",
    timeout:    "The consultation timed out after 90 seconds. The stars are particularly talkative today — please try again.",
    error:      "An error occurred while consulting the stars. Please try again.",
  },
  profile: {
    title:     "💫 Your cosmic profile",
    moon:      "Moon",
    ascendant: "Ascendant",
    share:     "🔗 Share this reading",
    copied:    "✓ Link copied!",
    exportPdf: "📄 Export to PDF",
  },
  wheel: {
    title:     "🪐 Zodiac Wheel",
    sun:       "☀ Sun",
    moon:      "☽ Moon",
    ascendant: "↑ Ascendant",
    emptyHint: "Your sky chart will appear here after the reading",
  },
  planets: {
    title:      "📊 Positions & Aspects",
    aspects:    "🔗 Active aspects",
    balance:    "⚖️ Elemental balance",
    retrograde: "℞",
  },
  ttft:   "1st token",
  cached: "⚡ From cache",
  theme:  { dark: "🌙", light: "☀️" },
};

export const translations: Record<Locale, Translations> = { fr, en };
