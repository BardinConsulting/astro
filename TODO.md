# TODO — AstroVision

> Géré manuellement. Cocher un item = créer un commit `fix:` ou `feat:` correspondant.

---

## 🔴 Critique

- [x] **Dockerfile — `BUILD_TARGET` manquant** : `RUN npm run build` ne produit pas l'output standalone ; corrigé en `npm run build:docker`
- [x] **`/api/health` manquant** : le HEALTHCHECK Docker appelait un endpoint inexistant ; endpoint créé
- [x] **Ascendant inexact** : `longitude_approx()` devinait la longitude depuis la latitude ; corrigé en passant la vraie longitude de naissance
- [x] **XSS dans `formatPrediction`** : le markdown était appliqué à du texte non-échappé ; HTML-escape ajouté avant les substitutions
- [x] **Hydration mismatch** : `Math.random()` dans les largeurs du skeleton React ; remplacé par un tableau de valeurs fixes
- [x] **Rate limiting absent sur `/api/predict`** : rate-limiter en mémoire ajouté (Map + timestamp, 10 req/min/IP, 0 dépendance, nettoyage automatique)
- [x] **Pas de timeout sur la requête streaming côté client** : `AbortController` avec timeout 90s ajouté dans `page.tsx`

---

## 🟠 Important

- [x] **Couverture de tests insuffisante** : 7 edge cases ajoutés (heure vide, latitudes extrêmes, solstices, ascendant par longitude, aspects)
- [x] **`docker-compose.yml` healthcheck** : aligné sur `/api/health` comme le Dockerfile
- [x] **Pas de gestion du cas `ANTHROPIC_API_KEY` absente** : vérification ajoutée en tête de handler avec erreur 503 lisible
- [x] **Canvas StarField — stars hors viewport après resize** : `spawnStars(w, h)` appelé dans `resize()` — positions recalculées à chaque redimensionnement
- [x] **Accessibilité Canvas** : `role="img"` + `aria-label` dynamique sur `ZodiacWheel` ; `role="presentation"` + `aria-hidden="true"` sur `StarField`
- [ ] **`next.config.ts` — output conditionnel fragile** : documenter dans un commentaire explicite que le build CI utilise le mode standard (non-standalone) intentionnellement

---

## 🟢 Nice to have

- [x] Cache du thème natal en `localStorage` (TTL 24h, clé dérivée des paramètres du formulaire, 0 dépendance)
- [x] Partage de prédiction via URL (`?s=base64(formData)` → pre-fill formulaire, bouton "Copier le lien")
- [ ] Export PDF du thème natal (via `window.print()` + CSS `@media print`, 0 dépendance)
- [ ] Support i18n (anglais au minimum)
- [ ] Mode clair configurable
- [ ] Tests E2E Playwright pour le flux principal
- [ ] Métriques de latence streaming côté client (time-to-first-token)
