# TODO — AstroVision

> Géré manuellement. Cocher un item = créer un commit `fix:` ou `feat:` correspondant.

---

## 🔴 Critique

- [x] **Dockerfile — `BUILD_TARGET` manquant** : `RUN npm run build` ne produit pas l'output standalone ; corrigé en `npm run build:docker`
- [x] **`/api/health` manquant** : le HEALTHCHECK Docker appelait un endpoint inexistant ; endpoint créé
- [x] **Ascendant inexact** : `longitude_approx()` devinait la longitude depuis la latitude ; corrigé en passant la vraie longitude de naissance
- [x] **XSS dans `formatPrediction`** : le markdown était appliqué à du texte non-échappé ; HTML-escape ajouté avant les substitutions
- [x] **Hydration mismatch** : `Math.random()` dans les largeurs du skeleton React ; remplacé par un tableau de valeurs fixes
- [ ] **Rate limiting absent sur `/api/predict`** : un utilisateur peut épuiser le quota Anthropic en boucle — ajouter un rate-limiter en mémoire (Map + timestamp, 0 dépendance)
- [ ] **Pas de timeout sur la requête streaming côté client** : si Claude ne répond pas, le `reader.read()` peut bloquer indéfiniment — ajouter `AbortController` avec timeout 90s

---

## 🟠 Important

- [ ] **Couverture de tests insuffisante** : seule `lib/astrology.ts` est testée ; ajouter des tests pour `formatPrediction` et les edge cases de `calculateAstroData` (heure manquante, latitude extrême)
- [ ] **`docker-compose.yml` healthcheck** : appelle `http://localhost:3000` au lieu de `/api/health` — aligner avec le Dockerfile
- [ ] **`next.config.ts` — output conditionnel fragile** : la variante Docker repose sur une variable d'env au build ; documenter clairement dans le Dockerfile et les workflows CI
- [ ] **Pas de gestion du cas `ANTHROPIC_API_KEY` absente** : l'API retourne une erreur Anthropic non structurée ; ajouter une vérification au démarrage du handler avec un message d'erreur lisible
- [ ] **Canvas StarField — stars hors viewport après resize** : les étoiles sont positionnées une seule fois au montage ; les positions deviennent invalides après un resize
- [ ] **Accessibilité Canvas** : `ZodiacWheel` et `StarField` n'ont pas d'`aria-label` ni de fallback textuel

---

## 🟢 Nice to have

- [ ] Cache du thème natal en `localStorage` (évite de recalculer si même paramètres)
- [ ] Export PDF du thème natal (via `window.print()` + CSS `@media print`, 0 dépendance)
- [ ] Support i18n (anglais au minimum)
- [ ] Partage de prédiction via URL (paramètres encodés en base64)
- [ ] Mode clair configurable
- [ ] Tests E2E Playwright pour le flux principal
- [ ] Métriques de latence streaming côté client (time-to-first-token)
