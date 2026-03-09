# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅        |

## Reporting a Vulnerability

**Ne pas ouvrir de GitHub Issue public pour signaler une faille de sécurité.**

Envoyer un email à : **security@bardin-consulting.com**

Inclure :
- Description de la vulnérabilité
- Étapes pour la reproduire
- Impact potentiel
- Correction suggérée (si applicable)

Vous recevrez un accusé de réception sous 48h et un correctif sera publié dans les 7 jours pour les failles critiques.

## Politique de divulgation

Nous suivons un processus de **divulgation responsable coordonnée** :
1. La faille est signalée en privé
2. Nous confirmons et développons un correctif
3. Un correctif est publié
4. La faille est divulguée publiquement après 90 jours maximum

## Périmètre

### Dans le périmètre
- Injection dans l'API `/api/predict` (prompt injection, XSS)
- Fuite de la clé `ANTHROPIC_API_KEY` via les réponses API
- Contournement de la validation des entrées utilisateur
- Vulnérabilités dans les dépendances npm directes

### Hors périmètre
- Attaques DoS volumétriques
- Ingénierie sociale
- Bugs sans impact sécurité

## Bonnes pratiques intégrées

- `ANTHROPIC_API_KEY` uniquement côté serveur (jamais exposée au client)
- `dangerouslySetInnerHTML` protégé par HTML-escape + whitelist de tags
- Headers de sécurité : `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- `.env*` exclu du dépôt via `.gitignore`
- Docker : utilisateur non-root (`nextjs:nodejs`, uid 1001)
- Dependabot activé pour les mises à jour automatiques
