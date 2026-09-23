/**
 * Smoke test: server-render the whole app and assert the shell is really there.
 * Catches import cycles, bad exports and render-time crashes without a browser.
 * Run with: node smoke.mjs
 */
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import assert from 'node:assert/strict'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const html = renderToString(createElement(App))

  assert.match(html, /AyanOS/, 'boot banner missing')
  assert.match(html, /AyanOS taskbar/, 'dock missing')
  for (const label of ['About', 'Stack', 'Projects', 'Timeline', 'Contact']) {
    assert.ok(html.includes(label), `dock item missing: ${label}`)
  }

  console.log(`ok — app renders, ${html.length} chars`)
} finally {
  await vite.close()
}
