# Deployment Guide (Vercel)

## 1. Prepare Database (PostgreSQL)
Vercel requires a cloud database (SQLite will resets on every deployment).
We recommended using **Neon** (free tier) or **Supabase**.

1.  Create a project on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2.  Get the **Connection String** (starts with `postgres://...`).

## 2. Update Code for Production
Before pushing, you must update the database provider.

1.  Open `prisma/schema.prisma`.
2.  Change `provider = "sqlite"` to `provider = "postgresql"`.
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```

## 3. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel"
# Create repo on GitHub, then:
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

## 4. Deploy on Vercel
1.  Import the repo on [Vercel.com](https://vercel.com).
2.  **Environment Variables**:
    - `DATABASE_URL`: Your Postgres connection string.
    - `NEXTAUTH_SECRET`: Random string (ex: `openssl rand -base64 32`).
    - `NEXTAUTH_URL`: **Doit être exactement l’URL du site** (ex: `https://votre-projet.vercel.app`). Après le premier déploiement, copiez l’URL depuis la barre d’adresse et mettez-la dans NEXTAUTH_URL, puis redéployez. Sinon la connexion (login) échouera.
    - `GROQ_API_KEY`: Clé API Groq (IA).
    - (Optionnel) `SITE_URL`: Si vous utilisez un domaine personnalisé, définissez-le ici pour l’add-in Word.
3.  **Build Command**: `npm run build`.
4.  **Install Command**: `npm install`.

## 5. Finalize Database
After deployment, apply the schema and **create an admin user** in production:

```bash
# .env doit contenir DATABASE_URL de production
npx prisma db push
npx tsx prisma/create-admin.ts   # ou le script que vous utilisez pour créer l’admin
```

Sans utilisateur en base, la connexion sur le site déployé ne fonctionnera pas (même avec les bons identifiants locaux).

## 6. Vérifier la config (connexion / add-in)
- Ouvrez `https://votre-site.vercel.app/api/health` : vous devez voir `nextAuthUrl` égal à l’URL du site. Si ce n’est pas le cas, corrigez `NEXTAUTH_URL` sur Vercel et redéployez.
- Pour l’add-in Word : sur Vercel, `VERCEL_URL` est défini automatiquement ; le manifest utilisera cette URL. Si vous avez un domaine personnalisé, définissez `SITE_URL` dans les variables d’environnement.
