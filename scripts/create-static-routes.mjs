import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dist = resolve('dist')
const index = resolve(dist, 'index.html')
const signalDirectory = resolve(dist, 'signal')
const signalIndex = resolve(signalDirectory, 'index.html')
const siteOrigin = process.env.SITE_ORIGIN ?? 'https://dgodolias.github.io'
const signalCanonical = new URL('/CremaWebsite/signal/', siteOrigin).href

const signalMetadata = {
  title: 'Crema Signal — coffee, crepes & late-night Gazi',
  description:
    'Crema Signal is an experimental, motion-led story for coffee, crepes and late-night delivery from Gazi, Athens.',
  themeColor: '#100c0a',
}

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`Could not find ${label} in the built index.html`)
  }

  return html.replace(pattern, replacement)
}

function upsertCanonical(html) {
  const canonicalTag = `<link rel="canonical" href="${signalCanonical}" />`
  const existingCanonical = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i

  if (existingCanonical.test(html)) {
    return html.replace(existingCanonical, canonicalTag)
  }

  return html.replace(/\s*<\/head>/i, `\n    ${canonicalTag}\n  </head>`)
}

await mkdir(signalDirectory, { recursive: true })

const homeHtml = await readFile(index, 'utf8')
let signalHtml = replaceRequired(
  homeHtml,
  /<html\b[^>]*\blang=["'][^"']*["'][^>]*>/i,
  '<html lang="en">',
  'the document language',
)
signalHtml = replaceRequired(
  signalHtml,
  /<meta\b[^>]*\bname=["']description["'][^>]*>/i,
  `<meta name="description" content="${signalMetadata.description}" />`,
  'the description metadata',
)
signalHtml = replaceRequired(
  signalHtml,
  /<meta\b[^>]*\bname=["']theme-color["'][^>]*>/i,
  `<meta name="theme-color" content="${signalMetadata.themeColor}" />`,
  'the theme-color metadata',
)
signalHtml = replaceRequired(
  signalHtml,
  /<title>[\s\S]*?<\/title>/i,
  `<title>${signalMetadata.title}</title>`,
  'the document title',
)
signalHtml = upsertCanonical(signalHtml)

await writeFile(signalIndex, signalHtml, 'utf8')

// Keep a generic SPA entry point for unknown GitHub Pages paths.
await copyFile(index, resolve(dist, '404.html'))

console.log(`Created static /signal metadata (${signalCanonical}) and the GitHub Pages SPA fallback.`)
