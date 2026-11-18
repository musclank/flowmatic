# FLOWMATIC

**Connect. Automate. Grow.**

FLOWMATIC is a visual workflow automation platform built with React, TypeScript, Vite, and React Flow. The current foundation includes email authentication and per-user cloud storage for visual workflows through Supabase.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Flow (`@xyflow/react`)
- Supabase Auth and PostgreSQL
- Cloudflare Pages frontend

## Supabase setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run the complete script in [supabase/schema.sql](supabase/schema.sql).
3. In Supabase project settings, copy the Project URL and the publishable key (or legacy anon key).
4. In Cloudflare Pages, open **Settings → Environment variables** and add these variables for Production and Preview if you use both:
   - `VITE_SUPABASE_URL` — your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase publishable/anon key
5. Trigger a new deployment so Vite can include the variables in the frontend build.
6. In Supabase Authentication → URL Configuration, set the Site URL to your Cloudflare Pages production URL and add preview URLs you intend to use to the Redirect URLs allow list.
7. Open `/dashboard`, create an account, and sign in.

**Security:** Never use the Supabase service-role key in Cloudflare Pages frontend variables or commit it to GitHub. The SQL schema enables Row Level Security and restricts each authenticated user to their own workflow rows.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill in the Supabase values in `.env.local`. To build:

```bash
npm run build
```

## Current capabilities

- Public product landing page
- Email/password sign up and sign in
- Authenticated workspace
- Visual workflow canvas with Trigger, Action, and Condition nodes
- Cloud save and load for workflow nodes and connections
- User-scoped database access through Supabase Row Level Security

Workflow execution and third-party integrations are planned for later phases.