# /sync-projects

Regenerate `lib/data/projects.ts` from the source markdown files in `content/projects/`.

## Step 1 — Determine scope

Run `git status --short content/projects/` to detect uncommitted changes.

**If changed files are found** (modified `M`, added `?? `or `A`):
- Tell the user which `.md` files have changed.
- Ask: "Sync only the changed files, or all files? (changed/all)"
- Wait for the user's reply before proceeding.
  - `changed` → only re-parse the changed files and update just their entries in `projects.ts`
  - `all` → re-parse every `.md` file and fully replace the `projects` array

**If no changed files are found:**
- Ask: "No changes detected in content/projects/. Sync a specific file, or all files? (provide filename or 'all')"
- Wait for the user's reply.
  - Filename (e.g. `ubi-prediction.md`) → re-parse that file only
  - `all` → re-parse every `.md` file and fully replace the `projects` array

## Step 2 — Parse files

For each file in scope, read it and parse the frontmatter and body sections.

### Frontmatter (YAML block between `---` delimiters)
- `id` → `id`
- `category` → `category` (must be exactly `"AI / LLM"`, `"Pricing Optimization"`, or `"Experimentation"`)
- `order` → sort order within the category (integer, ascending)
- `tags` → `tags` array
- `demoUrl` → `demoUrl`
- `imageAlt` → `imageAlt`
- `shortDescription` → `shortDescription`
- `githubUrl` → `githubUrl` (AI / LLM only; default to `"https://github.com"` if absent)

### Body sections
- `# Heading` → `title`
- `## Key Outcomes` bullet list → `outcomes[]` (strip leading `- ` from each line)
- `### Motivation` → `article.motivation`
  - Capture all text between `### Motivation` and the next `###` heading
  - Preserve paragraph breaks as `\n\n` (blank lines between paragraphs become `\n\n` in the string)
  - Trim leading/trailing whitespace
- `### Approaches` bullet list → `article.approaches[]`
  - Strip leading `- ` from each line
  - Strip `**bold text.**` markdown (remove `**` markers) — merge bold header into prose
- `### Key Takeaways` bullet list → `article.keyTakeaways[]`
  - Same stripping rules as Approaches

### `longDescription`
Derive a 3–4 sentence summary from the `### Motivation` section — capture the core problem and the solution approach. Do not copy verbatim; write a concise synthesis.

### Article field
- **AI / LLM** projects: no `article` field (omit it entirely)
- **Pricing Optimization** and **Experimentation** projects: include the full `article` object

### `githubUrl`
- AI / LLM: use `githubUrl` from frontmatter if present, otherwise `"https://github.com"`
- Pricing Optimization / Experimentation: always `"https://github.com"` (placeholder — button won't show because `article` is present)

## Step 3 — Update `projects.ts`

**If scope = `all`:** Fully replace the `projects` array. Sort within each category by `order`. Category order in the array:
1. `Pricing Optimization`
2. `Experimentation`
3. `AI / LLM`

**If scope = changed or specific file:** Replace only the entry/entries matching the parsed `id`(s). Preserve all other entries unchanged, maintaining their current positions.

Keep the TypeScript interface definitions (`ProjectArticle`, `Project`, `ProjectCategory`) and the `PROJECT_CATEGORIES` export unchanged.

## Skipping empty folders

If a category subfolder contains no `.md` files (or doesn't exist), skip that category entirely — do not wipe its existing entries in `projects.ts`.

## After updating `projects.ts`

Run `npm run build` to confirm no TypeScript errors.

## Important notes

- Never modify `ProjectArticle`, `Project`, `ProjectCategory` interface definitions
- Never modify the `PROJECT_CATEGORIES` export
- `article.motivation` uses `\n\n` between paragraphs so `Projects.tsx` can split them into `<p>` tags
- Strip all `**text**` markdown bold markers from approach and takeaway strings before writing to `projects.ts` — they render as literal asterisks in the UI
- If a file lacks a `### Motivation` / `### Approaches` / `### Key Takeaways` section, skip the `article` field for that project

## Parsing rules

### Frontmatter (YAML block between `---` delimiters)
- `id` → `id`
- `category` → `category` (must be exactly `"AI / LLM"`, `"Pricing Optimization"`, or `"Experimentation"`)
- `order` → sort order within the category (integer, ascending)
- `tags` → `tags` array
- `demoUrl` → `demoUrl`
- `imageAlt` → `imageAlt`
- `shortDescription` → `shortDescription`
- `githubUrl` → `githubUrl` (AI / LLM only; default to `"https://github.com"` if absent)

### Body sections
- `# Heading` → `title`
- `## Key Outcomes` bullet list → `outcomes[]` (strip leading `- ` from each line)
- `### Motivation` → `article.motivation`
  - Capture all text between `### Motivation` and the next `###` heading
  - Preserve paragraph breaks as `\n\n` (blank lines between paragraphs become `\n\n` in the string)
  - Trim leading/trailing whitespace
- `### Approaches` bullet list → `article.approaches[]`
  - Strip leading `- ` from each line
  - Strip `**bold text.**` markdown (remove `**` markers) — merge bold header into prose
- `### Key Takeaways` bullet list → `article.keyTakeaways[]`
  - Same stripping rules as Approaches

### `longDescription`
Derive a 3–4 sentence summary from the `### Motivation` section — capture the core problem and the solution approach. Do not copy verbatim; write a concise synthesis.

### Article field
- **AI / LLM** projects: no `article` field (omit it entirely)
- **Pricing Optimization** and **Experimentation** projects: include the full `article` object

### `githubUrl`
- AI / LLM: use `githubUrl` from frontmatter if present, otherwise `"https://github.com"`
- Pricing Optimization / Experimentation: always `"https://github.com"` (placeholder — button won't show because `article` is present)

## Array ordering in `projects.ts`

Sort projects within each category by their `order` frontmatter field (ascending). The category order in the array is:
1. `Pricing Optimization`
2. `Experimentation`
3. `AI / LLM`

## Skipping empty folders

If a category subfolder contains no `.md` files (or doesn't exist), skip that category entirely — do not wipe its existing entries in `projects.ts`.

## After updating `projects.ts`

Run `npm run build` to confirm no TypeScript errors.

## Important notes

- Never modify `ProjectArticle`, `Project`, `ProjectCategory` interface definitions
- Never modify the `PROJECT_CATEGORIES` export
- `article.motivation` uses `\n\n` between paragraphs so `Projects.tsx` can split them into `<p>` tags
- Strip all `**text**` markdown bold markers from approach and takeaway strings before writing to `projects.ts` — they render as literal asterisks in the UI
- If a file lacks a `### Motivation` / `### Approaches` / `### Key Takeaways` section, skip the `article` field for that project
