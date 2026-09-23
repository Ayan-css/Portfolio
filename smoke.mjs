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

const check = (name, fn) => {
  try {
    fn()
    console.log(`  ok   ${name}`)
  } catch (error) {
    failures += 1
    console.error(`  FAIL ${name}\n       ${error.message}`)
  }
}

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const { WindowManagerProvider } = await vite.ssrLoadModule('/src/hooks/useWindowManager.tsx')
  const { SkillFilterProvider } = await vite.ssrLoadModule('/src/hooks/useSkillFilter.tsx')
  const { WINDOW_CONTENT } = await vite.ssrLoadModule('/src/components/os/registry.tsx')

  const shell = renderToString(h(App))
  check('shell renders with boot banner and dock', () => {
    assert.match(shell, /AyanOS/)
    assert.match(shell, /AyanOS taskbar/)
    for (const label of ['About', 'Stack', 'Projects', 'Timeline', 'Contact']) {
      assert.ok(shell.includes(label), `dock item missing: ${label}`)
    }
  })

  const renderWindow = (id) =>
    renderToString(
      h(WindowManagerProvider, null, h(SkillFilterProvider, null, h(WINDOW_CONTENT[id]))),
    )

  const expectations = {
    about: [/Ansari Mohd Ayan Nasiruddin/, /ayan48311@gmail\.com/],
    stack: [/installed packages/, /TypeScript/, /PostgreSQL/, /Razorpay/],
    projects: [/PrintOK\.app/, /Porejects\//, /flagship/],
    timeline: [/Anjuman-I-Islam/, /9\.65/, /Rise Club/],
    printok: [/PrintOK/, /pre-launch/, /printok\.vercel\.app/],
    porejects: [/expense-tracker/, /weather-app/, /project-management/],
    contact: [/send_message/, /github\.com\/Ayan-css/, /ayan48311@gmail\.com/],
  }

  for (const [id, patterns] of Object.entries(expectations)) {
    const html = renderWindow(id)
    check(`window "${id}" renders its content`, () => {
      for (const pattern of patterns) assert.match(html, pattern)
    })
  }

  // The honesty constraint, enforced: no invented traction anywhere in the UI.
  check('no fabricated metrics in any module', () => {
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
