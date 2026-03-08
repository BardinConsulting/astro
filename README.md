# ✨ AstroVision — Application de Prévisions Astrologiques IA

Application web et mobile de prévisions astrologiques personnalisées, propulsée par **Claude Opus 4.6** d'Anthropic.

## 🌟 Fonctionnalités

- **Calculs astronomiques précis** : signe solaire, lunaire, ascendant, positions planétaires
- **Roue zodiacale interactive** : visualisation animée de la carte du ciel
- **Prévisions IA en streaming** : analyse via Claude Opus 4.6 avec adaptive thinking
- **6 thèmes de lecture** : global, amour, carrière, santé, finances, spiritualité
- **Aspects planétaires** : conjonctions, oppositions, trigones, carrés, sextiles
- **Équilibre élémentaire** : Feu, Terre, Air, Eau

## 🚀 Déploiements

### 1. Développement local
```bash
cp .env.example .env.local
# Ajoutez votre ANTHROPIC_API_KEY dans .env.local
npm install && npm run dev
# → http://localhost:3000
```

### 2. Vercel (web)
```bash
npm i -g vercel && vercel
# Ajoutez ANTHROPIC_API_KEY dans Vercel Dashboard > Settings > Env Vars
```

### 3. Docker
```bash
# Avec docker-compose
ANTHROPIC_API_KEY=your_key docker-compose up -d

# Ou manuellement
docker build -t astrovision .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_key astrovision
```

### 4. APK Android (Capacitor)
```bash
# Prérequis: Android Studio installé
npm run build:static          # Build Next.js statique
npm run android:init          # Init Capacitor (1ère fois)
npm run android:add           # Ajouter plateforme Android
npm run android:build         # Sync + ouvrir Android Studio
# Dans Android Studio: Build > Generate Signed APK
```

## 📁 Structure
```
├── app/api/predict/route.ts   # API Claude Opus 4.6 streaming
├── components/
│   ├── AstroForm.tsx          # Formulaire naissance
│   ├── ZodiacWheel.tsx        # Roue zodiacale Canvas
│   ├── PlanetGrid.tsx         # Planètes + aspects
│   └── PredictionDisplay.tsx  # Streaming prévision
├── lib/astrology.ts           # Calculs astronomiques
├── Dockerfile                 # Build Docker multi-stage
├── docker-compose.yml         # Orchestration
├── vercel.json                # Config Vercel
└── capacitor.config.ts        # Config Android/iOS
```

## Variables d'environnement
| Variable | Requis | Description |
|----------|--------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | Clé API Anthropic (console.anthropic.com) |

## Technologies
**Next.js 16** · **Claude Opus 4.6** · **Tailwind CSS 4** · **Canvas API** · **Capacitor 8** · **Docker** · **Vercel**

---
*À des fins de divertissement. Les astres guident, l'humain décide.*
