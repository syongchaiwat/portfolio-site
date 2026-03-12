# CLAUDE.md — Portfolio Site

## Project Overview
Personal portfolio site for Sarunchana Yongchaiwathana (Data Scientist & Master's Student in AI).
Built with Next.js App Router + TypeScript + Tailwind CSS v4.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict — no `any` types)
- **Styling**: Tailwind CSS v4 — uses `@import "tailwindcss"` (NOT `@tailwind base/components/utilities`)
- **Animations**: Framer Motion
- **Theme**: next-themes (`defaultTheme: dark`, `attribute: class`)
- **Forms**: react-hook-form
- **Icons**: lucide-react
- **Utilities**: clsx + tailwind-merge via `cn()` helper
- **Email**: Resend API

## Commands
```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # build — run after changes to catch errors
npm run lint     # lint — run after changes
```
Always run `npm run build` and `npm run lint` after making code changes.

## Deployment
Deployed on **Vercel**. Do not modify `next.config.ts` or environment variable handling without considering Vercel compatibility.

## Key File Structure
```
app/
  layout.tsx        # ThemeProvider, fonts (Inter + Space Grotesk)
  page.tsx          # assembles all sections
  globals.css       # CSS variables, .glass-card, .mesh-bg, .gradient-text

components/
  layout/
    Navbar.tsx      # fixed, blur-on-scroll, mobile drawer
    Footer.tsx
    ThemeProvider.tsx
  sections/
    Hero.tsx        # typing animation, CTAs, social icons
    About.tsx       # 2-col layout, profile photo with gradient ring
    Skills.tsx      # skill group glass cards
    Projects.tsx    # expandable accordion cards (AnimatePresence)
    Experience.tsx  # alternating timeline
    Contact.tsx     # contact info + validated form

lib/
  animations.ts             # shared Framer Motion variants
  data/
    projects.ts
    skills.ts
    experience.ts
```

## CSS Conventions
- CSS variables: `--background`, `--surface`, `--surface-2`, `--foreground`, `--muted`, `--muted-foreground`, `--border-color`, `--accent`, `--accent-light`
- Dark theme on `:root`, light theme on `.light`
- Accent colour: `#7c3aed` → `#a855f7` (purple/violet gradient)
- Google Fonts `@import url(...)` **must come before** `@import "tailwindcss"` in globals.css
- Utility classes: `.glass-card`, `.gradient-text`, `.mesh-bg`, `.cursor-blink`

## Rules for Claude
- **Never auto-commit.** Always ask before creating git commits.
- **No `any` types.** Keep full TypeScript type safety throughout.
- **No unsolicited refactors.** Only touch files directly related to the requested change.
- **No new files unless necessary.** Prefer editing existing files.
- **No comments** added to unchanged code.
- Run `npm run build && npm run lint` after any code change to verify correctness.

## Assets (placeholders — replace with real files)
- `/public/profile.jpg` — profile photo (fallback: "SY" initials)
- `/public/resume.pdf` — resume download

## Environment Variables (Vercel + local `.env.local`)
- `RESEND_API_KEY` — required for contact form email sending
