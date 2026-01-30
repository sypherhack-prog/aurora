# Aurora AI - Document Editor

A modern, AI-powered document editing SaaS application built with Next.js 16, featuring intelligent formatting, multi-language support, and a premium dark-mode interface.

## Features

- **AI-Powered Editing**: Auto-formatting, grammar correction, content generation
- **Rich Text Editor**: Built on Tiptap with tables, lists, and advanced formatting
- **Multi-Language Translation**: Translate documents between French, English, Spanish, and more
- **Export Options**: HTML, Markdown, and plain text exports
- **Subscription System**: MVola payment integration with admin verification
- **Admin Dashboard**: User management, subscription tracking, revenue analytics

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aurora-ai.git
cd aurora-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for session encryption
- `NEXTAUTH_URL`: Your app URL (e.g., http://localhost:3000)
- `GEMINI_API_KEY`: Google Gemini API key

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

## Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions for Vercel.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── editor/         # Document editor
│   └── pricing/        # Pricing page
├── components/         # Reusable UI components
└── lib/                # Utilities and configurations
    ├── auth.ts         # NextAuth configuration
    ├── db.ts           # Prisma client
    ├── gemini.ts       # AI integration
    └── logger.ts       # Logging utility
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
