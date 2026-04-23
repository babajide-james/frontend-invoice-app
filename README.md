# Invoice Management App

Minimal full-stack invoice management app scaffold (Next.js + Tailwind).

Core Objective

Build a fully functional invoice app that allows users to:

- Create invoices
- Read (view) invoices
- Update invoices
- Delete invoices
- Save drafts
- Mark invoices as paid
- Filter by invoice status
- Toggle light/dark mode
- Experience full responsiveness
- See hover states on interactive elements
- Persist state using: LocalStorage, IndexedDB or a backend (Node/Express, Next.js API, etc.)

Quick setup

```bash
# from project root
npm install
npm run dev
```

Open http://localhost:3000

Architecture

- Next.js for client + API routes (easy deploy to Vercel)
- `pages/api/*` - invoices CRUD
- `data/invoices.json` - simple JSON persistence for demo
- `contexts/ThemeContext.js` - theme toggling and storage
- `pages/_document.js` - sets HTML lang and basic meta tags for accessibility/SEO

Trade-offs and notes

- The data store is a simple JSON file for demo purposes. For production use replace with a proper DB.
- Tailwind used for quick responsive layout and hover states.
- Accessibility: modals and keyboard handlers included at a basic level; further auditing recommended.

What's next

- Implement the UI pages and API routes (already scaffolded). See `pages/` and `pages/api/invoices`.

Polish and deployment

- Responsive styles and hover states: implemented with Tailwind utility classes and small CSS transitions in `styles/globals.css`.
- Data persistence: demo uses `data/invoices.json`. For production, switch to a DB (Postgres, MongoDB, Supabase).

Deploying (Vercel)

1. Install the Vercel CLI or use the Vercel web dashboard.

```bash
# from project root
npm run build
vercel --prod
```

2. Ensure `data/invoices.json` is replaced with a proper storage backend for multi-instance deployments. The JSON file persists locally for demonstration only.

Notes

- Run locally: `npm install` then `npm run dev` (app runs on `http://localhost:3000`).
- The project includes basic accessibility improvements (focus trap for modals, labelled inputs). Consider an a11y audit before production.
- This repo is ready for further UI polish or integration with a hosted DB/API.
