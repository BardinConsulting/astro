# Decisions Techniques — AstroVision

> Enregistrement des décisions d'architecture non évidentes, avec contexte et alternatives considérées.

---

## ADR-001 — Node:test natif plutôt que Jest/Vitest

**Date** : 2025-03
**Statut** : Accepté

**Contexte** : Le projet doit avoir une suite de tests sans alourdir le `package.json`. Jest ajoute ~15 dépendances ; Vitest ~8.

**Décision** : Utiliser `node:test` + `node:assert` (Node 22 built-in) avec `--experimental-strip-types` pour exécuter les fichiers TypeScript directement.

**Conséquences** :
- ✅ 0 dépendance de test supplémentaire
- ✅ Fonctionne nativement sur Node 22 (utilisé en CI et en Docker)
- ⚠️ Pas de watch mode natif (utiliser `--watch` en Node 22+)
- ⚠️ Couverture via `--experimental-test-coverage` (moins précise que c8/istanbul)

---

## ADR-002 — Release-please plutôt que semantic-release

**Date** : 2025-03
**Statut** : Accepté

**Contexte** : Versioning automatique basé sur Conventional Commits. `semantic-release` nécessite ~10 plugins npm. `release-please` (Google) fonctionne entièrement via une GitHub Action, sans dépendances npm.

**Décision** : `googleapis/release-please-action@v4` dans un workflow GitHub Actions.

**Conséquences** :
- ✅ 0 dépendance npm supplémentaire
- ✅ Crée la PR de release automatiquement, merge manuel ou auto-merge
- ✅ Génère `CHANGELOG.md` avec les commits conventionnels
- ⚠️ Nécessite `GITHUB_TOKEN` avec permissions `write` sur `contents` et `pull-requests`

---

## ADR-003 — Output standalone conditionnel pour Docker

**Date** : 2025-03
**Statut** : Accepté

**Contexte** : Next.js peut produire un output `standalone` (image Docker plus petite, ~50 MB) ou un output standard. L'output standalone casse les exports statiques nécessaires pour Capacitor/Android.

**Décision** : Variable d'environnement `BUILD_TARGET=docker` activée uniquement dans le `Dockerfile` via `npm run build:docker`. Les autres déploiements (Vercel, Android) utilisent `npm run build` ou `npm run build:static`.

**Conséquences** :
- ✅ Un seul `next.config.ts` pour les 3 cibles de déploiement
- ✅ Image Docker minimale (standalone ~50 MB vs ~300 MB)
- ⚠️ `npm run build` sans la variable ne produit pas d'output standalone — la CI utilise `npm run build` (Vercel-compatible), ce qui est correct

---

## ADR-004 — Algorithmes astronomiques maison sans librairie

**Date** : 2025-03
**Statut** : Accepté

**Contexte** : Des librairies comme `astronomia` ou `ephemeris` ajoutent plusieurs centaines de KB. Les calculs nécessaires (VSOP87 simplifié, Keplerian elements) sont réimplémentables en ~200 lignes.

**Décision** : Implémentation dans `lib/astrology.ts` avec les algorithmes de Jean Meeus ("Astronomical Algorithms").

**Conséquences** :
- ✅ 0 dépendance astronomique
- ✅ Bundle size minimal (calculé côté client sans import dynamique)
- ⚠️ Précision limitée (~0.5-1° d'erreur) — acceptable pour un usage de divertissement
- ⚠️ Pas de correction des perturbations planétaires (VSOP87 complet)

---

## ADR-005 — Streaming SSE via ReadableStream natif

**Date** : 2025-03
**Statut** : Accepté

**Contexte** : Afficher la réponse Claude en temps réel. Options : SSE avec `EventSource`, WebSocket, ou streaming HTTP direct.

**Décision** : `ReadableStream` natif dans le Route Handler Next.js, lu côté client avec `response.body.getReader()`. Pas de lib SSE, pas de WebSocket.

**Conséquences** :
- ✅ 0 dépendance supplémentaire
- ✅ Compatible avec le timeout Vercel de 60s (`maxDuration` dans `vercel.json`)
- ⚠️ Pas de reconnexion automatique (contrairement à `EventSource`)
- ⚠️ Un seul flux par requête — pour multi-session, envisager WebSocket
