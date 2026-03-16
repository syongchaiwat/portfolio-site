# /sync-experience

Regenerate `lib/data/experience.ts` from `content/experience/experience.md`.

## What to do

Read `content/experience/experience.md` and fully replace the `timelineEntries` array in `lib/data/experience.ts`. Keep the `EntryType`, `TimelineEntry` interface, and all type/interface definitions unchanged.

## File format

The source file contains one or more entries. Each entry follows this pattern:

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
- Bullet point three
```

Multiple entries are separated by the next `---` block (which starts the next entry's frontmatter).

## Parsing rules

- Each `---...---` block is one entry's frontmatter; the bullet list below it (until the next `---` block or end of file) is `bullets[]`
- Strip the leading `- ` from each bullet line
- Skip the HTML comment at the top of the file (`<!-- ... -->`)
- Entry order in the file = entry order in the `timelineEntries` array (top = first = most recent)
- Valid `type` values: `"work"`, `"education"`, `"bootcamp"`

## After updating `experience.ts`

Run `npm run build` to confirm no TypeScript errors.

## Important notes

- Never modify `EntryType`, `TimelineEntry` interface definitions
- Preserve exact date strings from the file (do not reformat)
- The timeline UI alternates left/right by array index — order matters
