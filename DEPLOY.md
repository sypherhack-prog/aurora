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
    - `NEXTAUTH_SECRET`: Random string.
    - `NEXTAUTH_URL`: `https://<your-project>.vercel.app` (you get this after deploy, or set strictly).
    - `GEMINI_API_KEY`: Your AI API key.
3.  **Build Command**: default is fine (`npm run build`).
4.  **Install Command**: default is fine (`npm install`).

## 5. Finalize Database
After deployment, go to the Vercel project Settings -> Deployments -> Redeploy OR run the migration command locally if you can connect to the remote DB:
```bash
# Apply schema to production DB
npx prisma db push
```
(You need the `DATABASE_URL` in your .env to be the production one for this command).
