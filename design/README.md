# Design

Reference only. Nothing in this folder is imported by the site or sent to visitors.

## Active look
**Prism, dark mode only.** Chosen November 2026 over Molten, Silk and Opaline.

- Colors: `app/globals.css`, the only place colors are defined.
- Shape and speed: `components/background/prism-preset.ts`.
- Rendering: `components/background/liquid-renderer.ts`.

## Decisions
- **Dark only.** Prism's chrome look depends on bright lines against deep shadow. A light version would be a new design: new highlights in the shader and a new accent, since cyan can't be used for text on white.
- **Name gradient goes through lilac.** Cyan straight to coral turns grey in the middle.
- **Coral stays rare.** Flare, small labels and gradient ends. Never buttons or large fills.
- **Vivid hero, dim sections, no lines.** One scrim is fixed to the screen. Its edges fill in as you scroll, then the background keeps darkening gradually. Sections have no background of their own, because any layer attached to the page shows as a line while scrolling.
- **Scroll-linked fades.** Content fades in as it enters and out as it leaves.

## Other options
`liquid-options/` keeps all four as they were designed.

- `preview.html`: open it in a browser to see all four running.
- `overview.md`: comparison, palettes and rules.
- `options/`: notes on each option.
- `tokens.json`, `tokens.css`: every color for every option.
- `bundle.js`: both shaders, plus each option's shape and speed.

Live version: [Liquid Chrome design system](https://claude.ai/artifact/Uxekbdpascgoz4gm5w8ZJp) (private link).

## Switching to another option
1. Copy that option's column from `liquid-options/tokens.json` into `app/globals.css`.
2. Copy its preset from `liquid-options/bundle.js` into a new preset file, renaming the short keys to the names in `prism-preset.ts`.
3. Opaline uses a different shader (droplets). Copy `DROPS` from `bundle.js` into the renderer as well.
4. Check `--gradient-accent` and the timeline colors in `Experience.tsx`, which follow the tokens but were tuned for Prism.
