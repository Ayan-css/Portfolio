# AyanOS

The interactive portfolio of **Ansari Mohd Ayan Nasiruddin**, built as a personal
operating system. It boots, it has a window manager, and every project is
explored inside the portfolio rather than by being sent somewhere else.

The narrative is deliberately lopsided: **PrintOK** is real, deployed,
production-shaped software, so it gets a full application window, an interactive
architecture diagram and a simulated end-to-end walkthrough. Six practice apps
share one collapsed folder. That asymmetry is the design, not an oversight.

```
npm install
npm run dev        # http://localhost:5173
npm run verify     # typecheck + production build + render smoke test
```

## Stack

| | |
|---|---|
| Framework | React 19 + Vite 7 + TypeScript (strict) |
| Styling | Tailwind CSS v4 — tokens only, no config file |
| Motion | Framer Motion |
| Icons | lucide-react |
| Mail | EmailJS (client-side, no backend) |

Everything else is hand-rolled on purpose. The command palette, window
dragging, the boot sequence, the architecture diagram and the phone mockup
would each have cost a dependency to save fewer lines than the dependency
itself. There is no GSAP, no cmdk, no react-rnd, no state library.

## How it's put together

```
src/
  components/
    os/          Taskbar/Dock, Window, DesktopIcons, CommandPalette,
                 ContextMenu, BootSequence, Desktop, registry
    sections/    About, TechStack, Projects, Timeline, Contact
    projects/    PrintOKApp, ArchitectureDiagram, PhoneWalkthrough,
                 PorojectsFolder, ProjectPreviewCard, AppIcon
    ui.tsx       TechTag, SectionHead, ExternalLink, Pane
  data/          profile.json, skills.json, projects.json, timeline.json
  hooks/         useWindowManager, useSkillFilter, useShortcuts,
                 useMediaQuery, useCursorGlow, useClock
  lib/           types, data (typed accessors), tech (colour legend),
                 commands, contact, windowMeta
```

Three ideas hold it together:

1. **`lib/windowMeta.ts` imports no components.** Both the window manager and
   the content registry read from it, which is what keeps them free of a
   circular import.
2. **All copy lives in `src/data/*.json`.** Editing the portfolio's text never
   means touching a component.
3. **Colour carries information.** `lib/tech.ts` maps each technology to its
   real brand hue, so a tag's colour in the Projects window means the same
   thing as in the Tech Stack grid.

## Keyboard

| | |
|---|---|
| `⌘K` / `Ctrl K` | command palette |
| `⌘1`–`⌘5` | jump to a dock module |
| `Esc` / `⌘W` | close the focused window |
| `⌘Enter` | maximise / restore |
| any key during boot | skip the boot sequence |

Palette easter eggs: `sudo make coffee`, `uptime`, `cat resume.pdf`, `reboot`,
`killall windows`.

## The home screen

With no windows open, the desktop is a game of Snake. Arrows or WASD to play,
`space` to pause.

The arena has a doorway cut into its left wall. Steer out through it and the
desktop itself becomes the board: the desktop icons and the dock light up, and
driving the head into one opens that window. The game stays mounted behind
whatever you opened, so closing it drops you back with the same snake, same
length, same score — you carry on to the next icon rather than starting over.

Screen edges wrap, so running off one side brings you back on the other. Only
the arena wall and the snake itself are fatal.

Desktop only. The dock opens every one of those modules in one click, so the
game is a second route, never the only one.

## Configuration

### Contact form (EmailJS)

```bash
cp .env.example .env
```

Fill in the three values from your [EmailJS](https://www.emailjs.com) dashboard.
All three are public identifiers by design — there is no secret here and the
site stays a static build.

Without them the form still works: it validates the input and hands over a
`mailto:` with the message already written, and it says that's what it's doing.
It never shows a success state for a message that didn't go anywhere.

### Content

Everything on the site comes from `src/data/*.json` and is sourced from the
resume in `public/resume.pdf`. Two slots are still optional rather than empty:

- [ ] **`src/data/projects.json` → `porejects[].screenshot`** — optional paths
      under `public/`. Absent, a pixel gravestone or a generated on-brand app
      window is drawn instead of a stock illustration.
- [ ] **`og:image`** — not referenced yet, because pointing at an image that
      doesn't exist is worse than having none. Add a 1200×630 PNG to `public/`
      and add the two meta tags when you have one.
- [ ] **`index.html` → canonical / `og:url`** — currently
      `https://ayanos.vercel.app/`. Change if you deploy elsewhere.

The resume also lists a phone number. It's deliberately not on the site —
the PDF is downloadable, but a number in the page source gets scraped. Add it
to `profile.json` and the Contact module if you want it surfaced.

`npm run check` fails the build if invented metrics — user counts, proficiency
percentages, "customers served" — ever appear in any module.

## GitHub profile README

`github-profile/README.md` is a separate, drop-in file for the special
`Ayan-css/Ayan-css` repository that renders on the GitHub profile page. Same
theme, adapted to what GitHub Markdown actually allows — no CSS, so the terminal
look comes from fenced code blocks and ASCII, and the colour legend from
shields.io badges using the same hex values as `lib/tech.ts`.

Copy it to the root of a repo named exactly `Ayan-css`, and create that repo if
it doesn't exist. Nothing in this project depends on it.

## Deploying

It's a static build; `npm run build` emits `dist/`.

On **Vercel**: import the repo, framework preset Vite, add the three
`VITE_EMAILJS_*` environment variables, deploy. Nothing else to configure —
there is one route, so no rewrites are needed.

## Accessibility & performance

- Every interactive element is a real `button`, `a`, `input` or `label`, so the
  whole OS works from the keyboard and reads correctly to a screen reader.
- `prefers-reduced-motion` skips the boot sequence, stops the walkthrough
  auto-advancing, disables the cursor glow and reduces every transition to zero.
- The cursor glow writes to CSS custom properties inside one `requestAnimationFrame`
  and never triggers a React render.
- Below 860px the desktop metaphor is replaced by full-height sheets rather than
  a shrunken desktop.

## License

Personal portfolio — the code is free to learn from, the content isn't mine to
give away.
