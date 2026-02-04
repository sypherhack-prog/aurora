# Tester l’extension Word Aurora AI

## Prérequis

- Microsoft Word (Windows/Mac) ou Word sur le web
- Le site déployé (ex. https://aurora-omega.vercel.app.com) avec l’add-in servi sous `/addin/`

## 1. Installer l’add-in dans Word (desktop)

1. Ouvrir **Word**.
2. **Insérer** → **Obtenir des modules complémentaires** (ou **Add-ins** → **Obtenir des add-ins**).
3. Choisir **Partager un module** (ou **Mon organisation** / **Installer un module personnalisé** selon la version).
4. Saisir l’URL du **manifest** :
   ```text
   https://VOTRE-DOMAINE/addin/manifest.xml
   ```
   Exemple : `https://aurora-omega.vercel.app.com/addin/manifest.xml`
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

## 4. Vérifier que tout fonctionne

- Connexion : le volet affiche « Bonjour, [prénom] » après login.
- Actions IA : sélection → clic sur une action → le texte est remplacé par le résultat.
- En cas d’erreur : vérifier que l’URL du site dans le manifest et dans `taskpane.ts` (API_BASE_URL) correspond bien à votre déploiement (et que CORS / auth sont OK).
