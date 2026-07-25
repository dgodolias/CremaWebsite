import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { chromium } from 'playwright'

const here = dirname(fileURLToPath(import.meta.url))
const source = await readFile(resolve(here, 'crema-signal.js'), 'utf8')
const client = new Client({ name: 'crema-lottie-client', version: '1.0.0' })
const transport = new StdioClientTransport({
  command: 'npx.cmd',
  args: ['-y', '@lottiefiles/creator-mcp@latest'],
})
let browser

const text = (result) =>
  result.content
    .filter((item) => item.type === 'text')
    .map((item) => item.text)
    .join('\n')

try {
  await client.connect(transport)

  await client.callTool({ name: 'get_rules', arguments: {} })
  for (let page = 1; page <= 4; page += 1) {
    await client.callTool({ name: 'get_api_doc', arguments: { page } })
  }

  browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    // Chrome 147+ gates public-site → loopback WebSockets behind a user prompt.
    // This flag is scoped to this disposable automation browser only.
    args: [
      '--disable-features=LocalNetworkAccessChecks,LocalNetworkAccessChecksWebSockets',
    ],
  })

  const creatorPage = await browser.newPage()
  creatorPage.on('console', (message) => {
    if (/mcp|websocket|ws:|refused|content security/i.test(message.text())) {
      console.error(`[creator:${message.type()}] ${message.text()}`)
    }
  })
  await creatorPage.goto('https://creator.lottiefiles.com/', { waitUntil: 'domcontentloaded' })
  await creatorPage.evaluate(() => sessionStorage.setItem('localMCPEnabled', 'true'))
  await creatorPage.reload({ waitUntil: 'domcontentloaded' })
  await creatorPage.waitForTimeout(3_000)
  const bridgeProbe = await creatorPage.evaluate(
    () =>
      new Promise((resolvePromise) => {
        const socket = new WebSocket('ws://127.0.0.1:3847')
        const timeout = setTimeout(
          () => resolvePromise({ event: 'timeout', readyState: socket.readyState }),
          4_000,
        )
        socket.onopen = () => {
          clearTimeout(timeout)
          socket.close()
          resolvePromise({ event: 'open', readyState: socket.readyState })
        }
        socket.onerror = () => {
          clearTimeout(timeout)
          resolvePromise({ event: 'error', readyState: socket.readyState })
        }
      }),
  )
  console.log(
    JSON.stringify({
      automationBypass: 'isolated Chrome process only',
      bridgeProbe,
      localMCPEnabled: await creatorPage.evaluate(() => sessionStorage.getItem('localMCPEnabled')),
    }),
  )

  let result
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    result = await client.callTool({
      name: 'run_script',
      arguments: { script: source },
    })

    if (!result.isError) break
    if (attempt < 6) await new Promise((resolvePromise) => setTimeout(resolvePromise, 5_000))
  }

  console.log(text(result))
  if (result.isError) process.exitCode = 1
} finally {
  await browser?.close()
  await client.close()
}
