/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HERO_SCROLL_VIDEO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
