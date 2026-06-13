export const supportedLanguages = [
  { code: 'el', label: 'Ελληνικά' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ru', label: 'Русский' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh-CN', label: '中文' },
  { code: 'ja', label: '日本語' },
] as const

export type LanguageCode = (typeof supportedLanguages)[number]['code']

export const greekContent = {
  meta: {
    orderWolt: 'Παραγγελία στο Wolt',
    orderEfood: 'efood',
    call: 'Κλήση στο Crema Gazi',
    instagram: 'Instagram Crema Gazi',
    map: 'Άνοιγμα χάρτη',
  },
  nav: ['Ιστορία', 'Προτάσεις', 'Γκάζι', 'Delivery'],
  hero: {
    eyebrow: 'Κρεπερί · καφές · delivery στο Γκάζι',
    brand: 'Crema',
    headline: ['Κρέπες', 'στο Γκάζι.'],
    subcopy:
      'Κρέπες, βάφλες, καφές, σφολιάτες και γλυκά στην Περσεφόνης 63. Πέρνα από το Crema ή άνοιξε το μενού για παραγγελία.',
    orderWolt: 'Παραγγελία στο Wolt',
    orderEfood: 'efood',
    footerOne: 'Life is uncertain.',
    footerTwo: 'Eat dessert first.',
    phone: '210 346 7213',
    location: 'Περσεφόνης 63',
  },
  heroShots: [
    'Κρύος καφές φωτογραφημένος σε μαρμάρινη επιφάνεια',
    'Χρυσαφένια σφολιάτα φωτογραφημένη σε μάρμαρο',
    'Φλιτζάνι espresso φωτογραφημένο σε μάρμαρο',
  ],
  marquee: ['καφές', 'κρέπες', 'βάφλες', 'pastry', 'delivery'],
  story: {
    eyebrow: 'Crema Gazi',
    title: 'Γλυκιά, αλμυρή ή όπως τη φτιάχνεις εσύ.',
    body:
      'Στον κατάλογο θα βρεις γλυκές και αλμυρές κρέπες, My Waffle, croissant, σφολιάτες, sandwiches, γλυκά, παγωτό, καφέδες και ροφήματα. Διάλεξε έτοιμη πρόταση ή φτιάξε τη δική σου.',
    visualMain: 'Crepes & coffee',
    visualSub: 'κρέπες · βάφλες · καφές · pastry',
    logoAlt: 'Logo Crema Gazi',
  },
  signatures: {
    eyebrow: 'Προτάσεις',
    title: 'Ξεκίνα από τα βασικά: κρέπα, βάφλα, καφές, κάτι γλυκό.',
    items: [
      {
        title: 'Κρέπες & βάφλες',
        detail: 'γλυκές, αλμυρές ή φτιαγμένες με τα υλικά που θες',
      },
      {
        title: 'Καφές',
        detail: 'espresso, freddo και καθημερινός καφές για take away ή delivery',
      },
      {
        title: 'Ροφήματα',
        detail: 'κρύα και ζεστά ροφήματα για να τα βάλεις δίπλα στην παραγγελία',
      },
      {
        title: 'Σφολιάτες & snacks',
        detail: 'croissant, σφολιάτες, sandwiches και κάτι γρήγορο για τη διαδρομή',
      },
    ],
  },
  products: {
    eyebrow: 'Δημοφιλή',
    title: 'Στον κατάλογο ξεκινάς από εδώ.',
    cta: 'Παράγγειλε',
    items: [
      {
        name: 'Κρέπα επιλογής',
        note: 'γλυκιά ή αλμυρή, με υλικά που διαλέγεις στον κατάλογο',
      },
      {
        name: 'Σφολιάτα',
        note: 'γρήγορη επιλογή για πρωί, γραφείο ή βόλτα στο Γκάζι',
      },
      {
        name: 'Espresso',
        note: 'καφές στο χέρι ή μαζί με την παραγγελία σου',
      },
      {
        name: 'Κρύο ρόφημα',
        note: 'freddo, σοκολάτα ή άλλο ρόφημα για πιο δροσερή επιλογή',
      },
      {
        name: 'Ζεστή σοκολάτα',
        note: 'για όταν το γλυκό ξεκινάει από το ποτήρι',
      },
      {
        name: 'Παγωτό & γλυκά',
        note: 'επιλογές ψυγείου για μετά την κρέπα, τη βάφλα ή τον καφέ',
      },
    ],
  },
  galleryAlt: 'Λεπτομέρεια προϊόντος Crema',
  location: {
    eyebrow: 'Περσεφόνης 63',
    title: 'Περσεφόνης 63, Γκάζι. Εκεί που ο καφές συναντά την κρέπα.',
    body:
      'Θα το βρεις στην Περσεφόνης 63, στο Γκάζι. Άνοιξε τον χάρτη, δες τον κατάλογο ή κάλεσε στο 210 346 7213.',
    openMap: 'Άνοιγμα χάρτη',
    callNow: 'Κλήση τώρα',
    mapWord: 'Γκάζι',
  },
  delivery: {
    eyebrow: 'Από κοντά · delivery · τηλέφωνο',
    title: 'Από κοντά, Wolt, efood ή τηλέφωνο. Διάλεξε τρόπο και προχώρα.',
    hours: '3',
    hoursLabel: 'τρόποι',
    body: 'Άνοιξε τον κατάλογο, συνέχισε σε Wolt ή efood, ή κάλεσε απευθείας το κατάστημα.',
  },
  footer: {
    address: 'Περσεφόνης 63, Γκάζι · 210 346 7213 · κρέπες · βάφλες · καφές · delivery',
  },
  language: {
    label: 'Γλώσσα',
    loading: 'Μετάφραση...',
    apiMissing: 'Η μετάφραση δεν είναι διαθέσιμη αυτή τη στιγμή.',
    ready: 'Μετάφραση από Google Translate.',
    fallback: 'Η μετάφραση δεν είναι διαθέσιμη αυτή τη στιγμή.',
  },
} as const

type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? ReadonlyArray<DeepWiden<U>>
        : T extends object
          ? { [K in keyof T]: DeepWiden<T[K]> }
          : T

export type SiteContent = DeepWiden<typeof greekContent>
