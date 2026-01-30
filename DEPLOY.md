# Deployment Guide

## 1. Push to GitHub
First, initialize the repository and push your code.

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a repository on GitHub.com to get the URL
# Then run:
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel
Reference: [Next.js Deployment](https://nextjs.org/docs/deployment)

1. Go to [Vercel.com](https://vercel.com) and login/signup.
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. **Environment Variables**:
   Add the following variables in the Vercel dashboard:
   - `DATABASE_URL` (Your production database URL, e.g., Supabase or Neon)
   - `NEXTAUTH_SECRET` (Generate one with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (Your Vercel domain, e.g., `https://your-app.vercel.app`)
   - `GEMINI_API_KEY` (Your Google Gemini API Key)
5. Click **Deploy**.

## 3. Database Migration (Production)
If using a managed Postgres (Supabase/Neon):
```bash
npx prisma migrate deploy
```

---

## Infrastructure FAQ

### Is Vercel the best option?
For this application (Next.js), **Vercel is the standard and easiest option**.
- **Pros**: Zero-config, automatic scaling, excellent integration with Next.js features.
- **Cons**: "Serverless Cold Starts" (the API might take 1-2s to wake up if not used for a while).

**Alternative Recommendations:**
If you want to avoid "cold starts" or have full control:
1.  **Railway / Render**: These platforms allow you to run the app as a docker container or persistent service. This keeps the API always ready.
    - *Better for*: Consistent API response times.
2.  **VPS (Hetzner/DigitalOcean) + Coolify**:
    - *Best for*: Lowest cost and maximum control. You host your own database and app.

**Verdict**: Start with Vercel. It is free and sufficient for user validation. If you notice specific lag issues with the AI response, you can easily migrate to Railway later.
