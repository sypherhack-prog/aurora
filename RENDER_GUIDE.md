# Deploying to Render

Render is a great choice for hosting Next.js applications.

## 1. Database Setup (Critical)
Since you are using a database, you **cannot use SQLite** on Render (your data will be lost every time you deploy). You must use PostgreSQL.

1.  **Create a Postgres Database**:
    *   You can create one on [Render](https://render.com) (New -> PostgreSQL).
    *   Copy the `Internal Database URL` (if deploying app on Render too) or `External Database URL`.

2.  **Update Prisma Schema**:
    *   Open `prisma/schema.prisma`.
    *   Change `provider = "sqlite"` to `provider = "postgresql"`.
    *   Commit this change before pushing to GitHub (or change it just for the deploy).

## 2. Push to GitHub
If you haven't already:
```bash
# Create a repository on GitHub
git remote add origin <YOUR_GITHUB_REPO_URL>
git add .
git commit -m "Ready for deployment"
git push -u origin main
```

## 3. Configure Render Web Service
1.  Go to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npx prisma generate && npm run build`
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Advanced):
    *   `DATABASE_URL`: Your Postgres connection string.
    *   `NEXTAUTH_SECRET`: Random string (e.g. `openssl rand -base64 32`).
    *   `NEXTAUTH_URL`: Your Render URL (e.g., `https://your-app.onrender.com`).
    *   `GEMINI_API_KEY`: Your AI API Key.
    *   `NODE_VERSION`: `20` (Recommended).

## 4. Run Migrations
After deployment, Render interprets the build command. To ensure the database schema is applied:
*   Update **Build Command** to: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
*   (Note: `migrate deploy` requires the DB to be reachable).
