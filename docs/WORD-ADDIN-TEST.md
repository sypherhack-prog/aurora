# Tester l’extension Word Aurora AI

## Prérequis

- Microsoft Word (Windows/Mac) ou Word sur le web
- Le site déployé (ex. https://aurora-omega.vercel.app) avec l’add-in servi sous `/addin/`

## 1. Installer l’add-in dans Word (desktop)

1. Ouvrir **Word**.
2. **Insérer** → **Obtenir des modules complémentaires** (ou **Add-ins** → **Obtenir des add-ins**).
3. Choisir **Partager un module** (ou **Mon organisation** / **Installer un module personnalisé** selon la version).
4. Saisir l’URL du **manifest** :
   ```text
   https://VOTRE-DOMAINE/addin/manifest.xml
   ```
   Exemple : `https://aurora-omega.vercel.app/addin/manifest.xml`
5. Valider. Le module « Aurora AI » apparaît dans le ruban (onglet **Accueil**, groupe **Aurora AI**).

## 2. Utiliser l’add-in

1. Cliquer sur le bouton **Aurora AI** dans l’onglet **Accueil**.
2. Le volet Aurora AI s’ouvre à droite.
3. Se connecter avec le même email/mot de passe que sur le site.
4. Dans le document, sélectionner du texte puis choisir une action (ex. « Améliorer le paragraphe », « Traduire »). Le résultat remplace la sélection.

## 3. Tester en local (développement)

1. Dans le repo : `cd word-addin` puis `npm install` et `npm run build`.
2. Servir le site Next.js en local : à la racine du repo, `npm run dev`. L’add-in en prod pointe vers l’URL de déploiement ; pour du dev local il faut soit :
   - utiliser **sideload** avec un manifest qui pointe vers `https://localhost:3000` (et avoir le serveur add-in en HTTPS sur le port 3000),  
   - soit déployer une préview (ex. Vercel) et utiliser l’URL de préview comme base + `/addin/manifest.xml`.

Pour sideload en dev avec localhost, voir la doc Office Add-in (manifest en dev avec `SourceLocation` sur `https://localhost:3000/...`).

## 4. Chargement depuis le bureau (fichier manifest local)

Si vous installez l’add-in en choisissant **un fichier .xml sur votre ordinateur** (Partager un module → parcourir) :

1. Utilisez **le manifest généré par le build**, pas celui du dossier `word-addin/` :
   - Fichier à utiliser : `public/addin/manifest.xml` (ou `manifest-prod.xml`) **après** avoir exécuté `npm run build` à la racine du projet.
2. Les URLs à l’intérieur du manifest doivent pointer vers **le site réellement déployé** (ex. `https://aurora-omega.vercel.app`). Si le site est sur un autre domaine, modifiez `word-addin/webpack.config.js` (urlProd) et `word-addin/manifest-prod.xml`, puis refaites `npm run build`.
3. **Recommandation** : pour éviter les erreurs, privilégiez l’installation par **URL du manifest** (étape 1 ci‑dessus) avec l’URL de votre site, ex. `https://aurora-omega.vercel.app/addin/manifest.xml`.

## 5. Dépannage : « Nous n’avons pas pu démarrer ce complément »

- **Vérifier l’URL** : Le manifest utilisait auparavant `aurora-omega.vercel.app.com` (incorrect). La bonne URL Vercel est `aurora-omega.vercel.app` (sans `.com`). Un nouveau build a été fait avec cette correction.
- **Redéployer** : Après correction, faites `npm run build`, déployez sur Vercel, puis réinstallez l’add-in (avec l’URL du manifest ou avec le nouveau `public/addin/manifest.xml`).
- **Tester dans le navigateur** : Ouvrez `https://aurora-omega.vercel.app/addin/taskpane.html`. La page doit s’afficher (sans erreur 404). Si elle ne s’ouvre pas, l’add-in ne pourra pas démarrer dans Word.
- **Fichier local** : Si vous chargez un manifest depuis le bureau, assurez-vous que c’est bien `public/addin/manifest.xml` **après** un build, et que votre site est bien en ligne à l’URL indiquée dans ce fichier.

## 6. Vérifier que tout fonctionne

- Connexion : le volet affiche « Bonjour, [prénom] » après login.
- Actions IA : sélection → clic sur une action → le texte est remplacé par le résultat.
- En cas d’erreur : vérifier que l’URL du site dans le manifest et dans `taskpane.ts` (API_BASE_URL) correspond bien à votre déploiement (et que CORS / auth sont OK).
