import type { LanguageCode } from '../content'

type PrimitiveNode = string | number | boolean | null
type JsonNode = PrimitiveNode | readonly JsonNode[] | { readonly [key: string]: JsonNode }

type TranslationResponse = {
  data?: {
    translations?: Array<{
      translatedText?: string
    }>
  }
  error?: {
    message?: string
  }
}

const API_ENDPOINT = 'https://translation.googleapis.com/language/translate/v2'
const CACHE_PREFIX = 'crema-gazi-translation'

function flattenStrings(node: JsonNode, path: string[] = [], output: Array<{ path: string[]; value: string }> = []) {
  if (typeof node === 'string') {
    output.push({ path, value: node })
    return output
  }

  if (Array.isArray(node)) {
    node.forEach((item, index) => flattenStrings(item, [...path, String(index)], output))
    return output
  }

  if (node && typeof node === 'object') {
    Object.entries(node).forEach(([key, value]) => flattenStrings(value, [...path, key], output))
  }

  return output
}

function assignPath(target: unknown, path: string[], value: string) {
  let cursor = target as Record<string, JsonNode> | JsonNode[]
  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index]
    cursor = Array.isArray(cursor)
      ? (cursor[Number(segment)] as Record<string, JsonNode> | JsonNode[])
      : (cursor[segment] as Record<string, JsonNode> | JsonNode[])
  }

  const last = path[path.length - 1]
  if (Array.isArray(cursor)) {
    cursor[Number(last)] = value
  } else {
    cursor[last] = value
  }
}

function decodeHtml(value: string) {
  const parser = new DOMParser()
  return parser.parseFromString(value, 'text/html').documentElement.textContent ?? value
}

export async function translateContent<T extends JsonNode>(content: T, target: LanguageCode): Promise<T> {
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY as string | undefined
  if (!apiKey) {
    throw new Error('Missing VITE_GOOGLE_TRANSLATE_API_KEY')
  }

  const cacheKey = `${CACHE_PREFIX}:${target}:v1`
  const cached = window.localStorage.getItem(cacheKey)
  if (cached) {
    return JSON.parse(cached) as T
  }

  const entries = flattenStrings(content)
  const response = await fetch(`${API_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: entries.map((entry) => entry.value),
      source: 'el',
      target,
      format: 'text',
    }),
  })

  const payload = (await response.json()) as TranslationResponse
  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'Google Translation API request failed')
  }

  const translations = payload.data?.translations ?? []
  const translated = structuredClone(content) as T

  entries.forEach((entry, index) => {
    const nextValue = translations[index]?.translatedText
    assignPath(translated, entry.path, decodeHtml(nextValue ?? entry.value))
  })

  window.localStorage.setItem(cacheKey, JSON.stringify(translated))
  return translated
}
