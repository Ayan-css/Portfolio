/**
 * Smoke test: server-render the shell and every window's content, then assert
 * the things that must be true are on the page. Catches import cycles, bad
 * exports and render-time crashes without needing a browser.
 * Run with: node smoke.mjs
 */
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'
import assert from 'node:assert/strict'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
let failures = 0

const check = async (name, fn) => {
  try {
    await fn()
    console.log(`  ok   ${name}`)
  } catch (error) {
    failures += 1
    console.error(`  FAIL ${name}\n       ${error.message}`)
  }
}

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const { Desktop } = await vite.ssrLoadModule('/src/components/os/Desktop.tsx')
  const { WindowManagerProvider } = await vite.ssrLoadModule('/src/hooks/useWindowManager.tsx')
  const { SkillFilterProvider } = await vite.ssrLoadModule('/src/hooks/useSkillFilter.tsx')
  const { WINDOW_CONTENT } = await vite.ssrLoadModule('/src/components/os/registry.tsx')

  // First paint is the boot overlay alone — the desktop mounts once boot finishes,
  // which is what gives the dock and icons their entrance animation.
  const firstPaint = renderToString(h(App))
  await check('first paint is the boot overlay, and it is skippable', () => {
    assert.match(firstPaint, /skip \[any key\]/)
    assert.doesNotMatch(firstPaint, /AyanOS taskbar/)
  })

  const desktop = renderToString(
    h(
      WindowManagerProvider,
      null,
      h(SkillFilterProvider, null, h(Desktop, { onOpenPalette: () => {}, paletteOpen: false })),
    ),
  )
  await check('desktop renders the dock and every module', () => {
    assert.match(desktop, /AyanOS taskbar/)
    for (const label of ['About', 'Stack', 'Projects', 'Timeline', 'Contact']) {
      assert.ok(desktop.includes(label), `dock item missing: ${label}`)
    }
  })

  await check('snake renders on the home screen with its controls', () => {
    assert.match(desktop, /\$ \.\/snake/)
    assert.match(desktop, /score/)
    assert.match(desktop, /command palette/)
    // The dock is still the plain route to every module — the game is never the only way in.
    assert.match(desktop, /AyanOS taskbar/)
  })

  const renderWindow = (id) =>
    renderToString(
      h(WindowManagerProvider, null, h(SkillFilterProvider, null, h(WINDOW_CONTENT[id]))),
    )

  const expectations = {
    about: [/Ansari Mohd Ayan Nasiruddin/, /ayan48311@gmail\.com/, /linkedin\.com\/in\/ayan-ansari/],
    stack: [/installed packages/, /TypeScript/, /PostgreSQL/, /Razorpay/],
    projects: [/PrintOK\.app/, /Porejects\//, /flagship/],
    timeline: [/Anjuman-I-Islam/, /9\.65/, /Rise Club/],
    printok: [/PrintOK/, /pre-launch/, /print-ok-customer-web\.vercel\.app/],
    porejects: [/expense-tracker/, /weather-app/, /project-management/, /all in one repo/],
    contact: [/send_message/, /github\.com\/Ayan-css/, /ayan48311@gmail\.com/],
  }

  for (const [id, patterns] of Object.entries(expectations)) {
    const html = renderWindow(id)
    check(`window "${id}" renders its content`, () => {
      for (const pattern of patterns) assert.match(html, pattern)
    })
  }

  // Links are asserted against the data, not the DOM — a repo link only renders
  // once its row is expanded, but a wrong or missing URL is always a bug.
  await check('every external link is present and points where the resume says', async () => {
    const { flagship, porejects, profile } = await vite.ssrLoadModule('/src/lib/data.ts')
    const live = flagship.links.find((l) => l.kind === 'live')
    assert.equal(live.href, 'https://print-ok-customer-web.vercel.app')
    assert.equal(flagship.links.find((l) => l.kind === 'repo').href, 'https://github.com/Ayan-css/PrintOK')
    assert.ok(profile.linkedin.includes('linkedin.com/in/'), 'linkedin URL missing')
    for (const p of porejects) {
      assert.ok(p.repo.startsWith('https://github.com/'), `${p.id} has no repo URL`)
    }
  })

  // The honesty constraint, enforced: no invented traction anywhere in the UI.
  await check('no fabricated metrics in any module', () => {
    const all = Object.keys(WINDOW_CONTENT)
      .map(renderWindow)
      .join(' ')
    for (const banned of [/\d+\s*(k|K)?\+?\s*users/, /\d+%\s*(proficien|skill)/i, /customers served/i]) {
      assert.doesNotMatch(all, banned)
    }
  })
} finally {
  await vite.close()
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nall checks passed')
