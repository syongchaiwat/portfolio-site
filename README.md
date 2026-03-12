# Sarunchana Yongchaiwathana — Portfolio

Personal portfolio website for Sarunchana Yongchaiwathana, Data Scientist & Master's Student in AI.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Theme**: next-themes (dark/light)
- **Icons**: lucide-react
- **Deployment**: Vercel

## Sections

| Section | Description |
|---|---|
| Hero | Typing animation, CTAs, social links |
| About | Bio, profile photo, stat badges |
| Skills | Skill group cards by category |
| Projects | Filterable by category (AI/LLM, Pricing, Experimentation); expandable cards with article modal |
| Experience | Alternating left/right timeline with work & education entries |
| Contact | Social link cards (GitHub, LinkedIn, Email, YouTube) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customisation

Replace the placeholder files before deploying:

- `/public/profile.jpg` — profile photo
- `/public/resume.pdf` — resume (linked from the Hero section)

Update real project details, GitHub URLs, and experience entries in:

- `lib/data/projects.ts`
- `lib/data/experience.ts`
- `lib/data/skills.ts`

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` to trigger a deployment.
