Liquid Chrome is a slow animated background for my portfolio, in four options. Each option is a theme: pick one in the theme switcher and every colour, type specimen and live preview on this page follows it. The tokens keep the site's own variable names, so a chosen column replaces the values in `app/globals.css` directly.

## The four options

| Option | Reference | Feel | Colour family | Motion | Text sits on |
|---|---|---|---|---|---|
| **Molten** | Dark violet chrome | Rich, familiar, closest to the site today | Violet, magenta, pale pink crests | Medium folds, thin bright lines | Dark scrim |
| **Silk** | Blue and pink flow | Calm, premium, soft | Cobalt, sky, soft pink | Long stretched folds, the slowest | Dark scrim |
| **Opaline** | Pastel droplets | Light, friendly, playful | Periwinkle, lilac, aqua, magenta rims | Droplets merge and split | Pale scrim |
| **Prism** | Blue and orange glass | Bold, memorable, sharp | Steel blue, cyan, lilac, coral flare | Creases slide across each other | Dark scrim |

**Recommendation:** Molten in dark mode, Opaline in light mode. The site already has a theme toggle, Molten keeps the identity people have seen, and Opaline is the one light option. If I want a single theme and a cleaner break from violet, Silk is the alternative.

## Palettes

Liquid stops, darkest to brightest. They drive the shader, not the interface.

| Option | `liquid-1` | `liquid-2` | `liquid-3` | `liquid-4` | `liquid-5` |
|---|---|---|---|---|---|
| Molten | `#0c0420` | `#25107a` | `#7426e0` | `#c65bf0` | `#f6dcff` |
| Silk | `#0a1a5e` | `#1f4fd8` | `#5b8df5` | `#d88ae6` | `#f7eaff` |
| Opaline | `#7f90f2` | `#c6aaf4` | `#a6eee6` | `#b61fd6` | `#fff6ff` |
| Prism | `#0a1c3f` | `#2c62c8` | `#2fcdf2` | `#c0a8ff` | `#ff9f6b` |

Interface colours, which replace the current `globals.css` values.

| Option | `background` | `foreground` | `muted` | `accent` | `accent-light` | `on-accent` |
|---|---|---|---|---|---|---|
| Molten | `#0a0614` | `#ffffff` | `#d3cbe8` | `#a855f7` | `#d8b4fe` | `#12051f` |
| Silk | `#060f2e` | `#f6f8ff` | `#ccd6f4` | `#6ea8ff` | `#f0a6e6` | `#06112e` |
| Opaline | `#eef0ff` | `#17103a` | `#3f3668` | `#6d28d9` | `#a21caf` | `#ffffff` |
| Prism | `#050d20` | `#f3f9ff` | `#c8d7e8` | `#35d0f5` | `#ffab7a` | `#04202c` |

## Visual foundations

**Legibility on a moving surface**

- Never set text directly on the canvas. Put `scrim` between them.
- In the hero, use the radial `.lc-scrim-hero`. The edges stay vivid and the text keeps a calm centre.
- In every section below the hero, use the flat `.lc-scrim-read` and put content in `.glass-card`.
- Keep `surface` at 85% alpha or more. At that level, `foreground`, `muted` and `muted-foreground` hold 4.5:1 even over a pure white highlight.
- With the radial scrim, `foreground` and `muted` hold at least 5.8:1 at every sampled pixel behind the hero's text across five minutes of drift, in all four options.
- Set `on-accent` text on `accent` fills. The site's current white on `#a855f7` reaches only 4.0:1.
- Focus rings are 2px solid `focus` at 2px offset.

**Motion**

- Keep it slow enough to notice only after a few seconds of watching. Each option's drift speed lives in its preset in `bundle.js`.
- Mount one fixed canvas for the whole page. Sections scroll over it, and the background does not scroll.
- Respect `prefers-reduced-motion`: draw one still frame.
- Render at 30 frames per second and .6 scale. The surface has no fine detail, so the lower resolution does not show.
- Pause offscreen and in hidden tabs.
- Fall back to the token gradient on `.lc-stage` when WebGL is missing.

**Colour in the shader**

- Change colour only through the `liquid-*` tokens. The shader reads them at mount and again when `data-theme` changes.
- Change shape and speed only in the preset.

**Type, spacing and shape**

- Keep the site's pairing: Space Grotesk for `hero`, `hero-sub`, `section-title` and `card-title`, Inter for everything else.
- Corners stay at `radius-button` for buttons, `radius-card` for cards and `radius-pill` for chips and the badge.
- Keep `space-24` section padding, so the liquid shows between glass cards.
- The only shadow is `accent-glow`, on the primary button.

## Content fundamentals

- First person and plain: "Hi, I'm Sarunchana", "View My Work", "Download Resume".
- Title case on buttons and section titles. Uppercase only on the `label` eyebrow.
- Skill cards keep their existing emoji icons on the site. The background adds no new decoration.

## Iconography

The site uses `lucide-react` line icons at 16 to 20px, inheriting `muted`, and `accent-light` on hover. This system adds no icons and no logo.

## What changes on the site

- Replace `.mesh-bg` and the two floating orbs in `Hero.tsx` with one `LiquidBackground` mounted in `app/layout.tsx`.
- Replace the `:root` values in `globals.css` with the chosen dark option, and the `.light` values with the light one.
- Change the primary button's hard-coded gradient and white text in `Hero.tsx` to `accent` and `on-accent`.
- Change `.glass-card`'s hard-coded `rgba` to `var(--surface)`.
- Update `.gradient-text`, `::selection` and `tailwind.config.ts` gradients, which also hard-code the current violets.
