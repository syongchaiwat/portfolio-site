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
| Skills | Skill group cards (Core Data Science, Machine Learning, LLMs & GenAI, Big Data) |
| Projects | Filterable by category (AI/LLM, Pricing Optimization, Experimentation); expandable cards with article modal |
| Experience | Alternating left/right timeline with work, education & bootcamp entries |
| Contact | Social link cards (GitHub, LinkedIn, Email, YouTube) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content Workflow

Project and experience data is authored in markdown and synced to TypeScript via Claude Code slash commands.

### Projects

Source files live in `content/projects/{category}/`. Each file follows the template in `content/projects/_template.md`.

To add or update a project:
1. Create or edit the relevant `.md` file in `content/projects/`
2. Run `/sync-projects` in Claude Code — it parses the markdown and regenerates `lib/data/projects.ts`

### Experience

Source file: `content/experience/experience.md`

To add or update a timeline entry:
1. Edit `content/experience/experience.md`
2. Run `/sync-experience` in Claude Code — it regenerates `lib/data/experience.ts`

### Skills

Edit `lib/data/skills.ts` directly — no sync command needed.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` to trigger a deployment.
