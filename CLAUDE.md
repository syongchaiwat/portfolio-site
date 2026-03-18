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
- **Icons**: lucide-react (note: `Github` icon is deprecated but still functional)
- **Utilities**: clsx + tailwind-merge via `cn()` helper

## Commands
```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # build — run after changes to catch errors
npm run lint     # lint — run after changes
```

## Deployment
Deployed on **Vercel**. Do not modify `next.config.ts` without considering Vercel compatibility.

## Key File Structure
```
app/
  layout.tsx        # ThemeProvider, fonts (Inter + Space Grotesk)
  page.tsx          # assembles all sections
  globals.css       # CSS variables, .glass-card, .mesh-bg, .gradient-text

components/
  layout/
    Navbar.tsx      # fixed, blur-on-scroll, mobile drawer, dark/light toggle
    Footer.tsx      # social icons + copyright
    ThemeProvider.tsx
  sections/
    Hero.tsx        # 2-col layout (photo left, text right); typing animation; profile photo with gradient ring; "SY" initials fallback
    About.tsx       # NOT rendered — kept as reference only (was removed from page.tsx)
    Skills.tsx      # skill group glass cards (grid sm:grid-cols-2 lg:grid-cols-3)
    Projects.tsx    # category filter tabs + expandable accordion cards + article modal
    Experience.tsx  # alternating left/right timeline (dot + year per entry)
    Contact.tsx     # social link cards only (no form)

lib/
  animations.ts             # fadeUp, fadeIn, slideInLeft, slideInRight, stagger, scaleIn
  data/
    projects.ts             # Project[] with category, article (optional), outcomes, tags
    skills.ts               # skillGroups[]
    experience.ts           # TimelineEntry[] (type: "work"|"education"|"bootcamp")

content/
  projects/
    _template.md                  # template with frontmatter + body structure
    ai-llm/                       # source .md files for AI / LLM projects
    pricing-optimization/         # source .md files for Pricing Optimization projects
    experimentation/              # source .md files for Experimentation projects
  experience/
    experience.md                 # source for all timeline entries (work, education, bootcamp)
```

## Section Details

### Projects (`Projects.tsx` + `lib/data/projects.ts`)
- Three category filter tabs: `"AI / LLM"`, `"Pricing Optimization"`, `"Experimentation"`
- Switching tabs resets expanded card and fades grid in/out via `AnimatePresence mode="wait"`
- Each card is an accordion — only one can be expanded at a time (`expandedId: string | null`)
- Grid uses `items-start` to prevent non-expanded cards from stretching to fill row height
- **AI / LLM** projects link to GitHub (`githubUrl`); no `article` field
- **Pricing Optimization** and **Experimentation** projects have an `article` field (no GitHub link shown)
- `article` shape: `{ motivation: string; approaches: string[]; keyTakeaways: string[] }`
- `article.motivation` supports multiple paragraphs separated by `\n\n` — rendered as separate `<p>` tags in the modal
- "Read Article" button opens `ArticleModal` (`max-w-3xl`, `max-h-[85vh]` scrollable, click outside or Escape to close)
- `ProjectCategory` type and `PROJECT_CATEGORIES` array are exported from `projects.ts`
- Display order within each category is determined by array order in `projects.ts` (matches `order` frontmatter field in source `.md` files)

### Content Files (`content/projects/`)
Source markdown files for all Pricing Optimization and Experimentation projects. Use `/sync-projects` to regenerate `projects.ts` from these files.

**File naming:** `{project-id}.md` — kebab-case matching the `id` field in `projects.ts`

**Frontmatter fields:**
```yaml
---
id: kebab-case-id
category: AI / LLM | Pricing Optimization | Experimentation
order: 1                    # display order within the category tab
tags: [Tag1, Tag2, Tag3]
demoUrl: "#"
imageAlt: description
shortDescription: One sentence shown on the collapsed card.
# githubUrl: https://...   # AI / LLM only
---
```

**Body sections (in order):**
- `# Title` → `title`
- `> tagline` → used as reference for `shortDescription`
- `**Skills:** ...` → `tags` (title-cased)
- `## Key Outcomes` bullets → `outcomes[]`
- `## Article` → `article` object
  - `### Motivation` (one or more paragraphs, separated by blank lines)
  - `### Approaches` (bullet list — bold headers are stripped when entering `projects.ts`)
  - `### Key Takeaways` (bullet list — bold headers are stripped when entering `projects.ts`)

**Adding a new project:**
1. Create `content/projects/{category-folder}/{project-id}.md` using `_template.md`
2. Fill in frontmatter and all body sections
3. Run `/sync-projects` to regenerate `projects.ts`

### Experience (`Experience.tsx` + `lib/data/experience.ts`)
- Entries alternate left/right by index (even → left, odd → right)
- Each entry is its own grid row: `grid-cols-[1fr_5rem_1fr] items-start`
- Center column: year badge + icon dot; year shown is **end year** if finished, **start year** if "Present"
- `getDisplayYear(date)`: returns last 4-digit year unless date contains "Present" (returns first)
- Mobile: single column with dot on left

### Content Files — Experience (`content/experience/experience.md`)
Source for all timeline entries. Use `/sync-experience` to regenerate `lib/data/experience.ts`.

**Entry format** (one per block, separated by the next frontmatter `---`):
```
---
id: kebab-case-id
type: work | education | bootcamp
date: MMM YYYY – MMM YYYY   (or "MMM YYYY – Present")
title: Job title or degree name
organisation: Organisation name
location: City, Country
---

- Bullet point one
- Bullet point two
```

**Rules:**
- Entry order in the file = display order in the timeline (top = most recent)
- Valid `type` values: `"work"`, `"education"`, `"bootcamp"`
- Date format: `"MMM YYYY – MMM YYYY"` or `"MMM YYYY – Present"`
- To add/edit/remove an entry: edit `experience.md`, then run `/sync-experience`

### Contact (`Contact.tsx`)
- Social link cards only — no contact form
- Links: GitHub, LinkedIn, Email, YouTube

## CSS Conventions
- CSS variables: `--background`, `--surface`, `--surface-2`, `--foreground`, `--muted`, `--muted-foreground`, `--border-color`, `--accent`, `--accent-light`
- Dark theme on `:root`, light theme on `.light`
- Accent colour: `#7c3aed` → `#a855f7` (purple/violet gradient)
- Google Fonts `@import url(...)` **must come before** `@import "tailwindcss"` in globals.css
- Utility classes: `.glass-card`, `.gradient-text`, `.mesh-bg`, `.cursor-blink`

## Data Conventions
- All real social URLs are already set (GitHub, LinkedIn, Email, YouTube) across Navbar, Footer, Hero, Contact
- `projects.ts`: `githubUrl` placeholder is `"https://github.com"`, `demoUrl` placeholder is `"#"` — only show Live Demo button when `demoUrl !== "#"`
- `experience.ts`: date format is `"MMM YYYY – MMM YYYY"` or `"MMM YYYY – Present"`

## Rules for Claude
- **Never auto-commit.** Always ask before creating git commits.
- **No `any` types.** Keep full TypeScript type safety throughout.
- **No unsolicited refactors.** Only touch files directly related to the requested change.
- **No new files unless necessary.** Prefer editing existing files.
- **No comments** added to unchanged code.

## Assets (placeholders — replace with real files)
- `/public/profile.jpg` — profile photo (fallback: "SY" initials in gradient circle)
- `/public/resume.pdf` — resume download (linked from Hero "Download Resume" button)
