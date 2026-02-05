# Dépannage : connexion admin et add-in Word

## La connexion ne marche pas sur le site déployé

### 1. Vérifier NEXTAUTH_URL
La variable **NEXTAUTH_URL** doit être **exactement** l’URL que vous voyez dans la barre d’adresse quand vous ouvrez votre site.

- Ouvrez : `https://votre-site.vercel.app/api/health`
- Regardez la valeur de `nextAuthUrl`.
- Si elle est vide ou différente de l’URL du site (ex. vous êtes sur `https://aurora-gilt-two.vercel.app` mais `nextAuthUrl` est `http://localhost:3000`), la connexion échouera.

**À faire :** Dans Vercel → Projet → Settings → Environment Variables, définissez :
- `NEXTAUTH_URL` = `https://votre-url-exacte.vercel.app` (sans slash final)
Puis redéployez (Redeploy).

### 2. Créer un utilisateur admin en production
La base de données de **production** est séparée de celle en local. Vos comptes créés en local n’existent pas en prod.

**À faire :**
1. Dans un terminal, avec un `.env` qui contient le **DATABASE_URL de production** (celui de Vercel) :
   ```bash
   npx prisma db push
   node prisma/create-admin.js
   ```
   (ou le script que vous utilisez pour créer l’admin, en pointant vers la base de prod.)
2. Utilisez ensuite **ce** compte (email / mot de passe) pour vous connecter sur le site déployé.

### 3. Vérifier NEXTAUTH_SECRET
Sur Vercel, `NEXTAUTH_SECRET` doit être défini (une chaîne aléatoire). Sans elle, la session peut échouer.

---

## L’add-in Word ne démarre pas (« Nous n’avons pas pu démarrer ce complément »)

### 1. Utiliser la bonne URL
Le manifest de l’add-in doit pointer vers **l’URL réelle** de votre site.

- Sur **Vercel**, le build utilise automatiquement `VERCEL_URL` (ex. `aurora-gilt-two.vercel.app`). Vous n’avez rien à faire si votre site est bien déployé sur ce domaine.
- Si vous utilisez un **domaine personnalisé**, définissez sur Vercel la variable **SITE_URL** = `https://votre-domaine.com`, puis redéployez.

### 2. Vérifier que l’add-in est bien servi
Ouvrez dans le navigateur (en étant connecté à Internet) :
```text
https://VOTRE-URL-REELLE/addin/taskpane.html
```
Exemple : `https://aurora-gilt-two.vercel.app/addin/taskpane.html`

- Si vous avez une **404** : le site n’a pas été déployé avec le bon build ou l’URL est mauvaise. Refaites un déploiement (push sur GitHub pour déclencher un build Vercel).
- Si la page s’affiche : l’add-in devrait pouvoir démarrer dans Word avec le **même** domaine.

### 3. Installer l’add-in : **fichier manifest local** (recommandé)

**Important :** Sur Word (bureau et Office sur le web), l’option « Partager un module » ou « Upload My Add-in » exige de **sélectionner un fichier .xml sur votre ordinateur**. Il n’est généralement pas possible de coller une URL directement.

**Procédure :**

1. **Télécharger le manifest** sur votre ordinateur :
   - Ouvrez : `https://aurora-omega.vercel.app/addin/manifest.xml`
   - Clic droit → « Enregistrer sous » / « Save as »
   - Enregistrez le fichier `manifest.xml` (par ex. sur le Bureau)

2. **Installer l’add-in dans Word** :
   - **Word sur le web** : Accueil → Modules complémentaires → Plus de paramètres → **Charger mon module** → Parcourir → sélectionnez `manifest.xml` → Charger
   - **Word bureau** : Insérer → Obtenir des modules complémentaires → Partager un module → **Parcourir** → sélectionnez `manifest.xml`

3. **Alternative (fichier local du projet)**  
   Si vous avez cloné le dépôt : utilisez `public/addin/manifest.xml` (il pointe déjà vers `aurora-omega.vercel.app`). Assurez-vous que le site est bien en ligne à cette URL.

### 4. Quelle est mon URL réelle ?
Après déploiement sur Vercel, l’URL est du type :
- `https://nom-du-projet.vercel.app`
ou, si vous avez connecté un dépôt :
- `https://aurora-omega.vercel.app` (ou un autre nom selon le projet).

Ouvrez votre site dans le navigateur et **copiez l’URL de la barre d’adresse**. C’est cette URL qu’il faut utiliser pour :
- `NEXTAUTH_URL`
- l’ouverture de `/addin/taskpane.html` et `/addin/manifest.xml`
