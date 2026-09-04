export const supportedLanguages = [
  { code: 'el', displayCode: 'GR', label: 'Ελληνικά' },
  { code: 'en', displayCode: 'EN', label: 'English' },
  { code: 'de', displayCode: 'DE', label: 'Deutsch' },
  { code: 'fr', displayCode: 'FR', label: 'Français' },
  { code: 'it', displayCode: 'IT', label: 'Italiano' },
  { code: 'es', displayCode: 'ES', label: 'Español' },
  { code: 'ru', displayCode: 'RU', label: 'Русский' },
  { code: 'zh-CN', displayCode: 'ZH', label: '中文' },
  { code: 'ar', displayCode: 'AR', label: 'العربية' },
  { code: 'tr', displayCode: 'TR', label: 'Türkçe' },
  { code: 'bg', displayCode: 'BG', label: 'Български' },
  { code: 'ro', displayCode: 'RO', label: 'Română' },
  { code: 'uk', displayCode: 'UA', label: 'Українська' },
  { code: 'pl', displayCode: 'PL', label: 'Polski' },
  { code: 'nl', displayCode: 'NL', label: 'Nederlands' },
  { code: 'pt', displayCode: 'PT', label: 'Português' },
] as const

export type LanguageCode = (typeof supportedLanguages)[number]['code']

export const greekContent = {
  meta: {
    orderWolt: 'Παραγγελία στο Wolt',
    orderEfood: 'Παραγγελία στο efood',
    orderBox: 'Παραγγελία στο BOX',
    call: 'Κλήση στο Crema Gazi',
    instagram: 'Instagram Crema Gazi',
    map: 'Άνοιγμα χάρτη',
  },
  nav: ['Ιστορία', 'Προτάσεις', 'Γκάζι', 'Delivery'],
  hero: {
    eyebrow: 'Dimello · φρέσκα snacks · delivery στο Γκάζι',
    brand: 'Crema',
    headline: ['Νέες γεύσεις', 'στο Γκάζι.'],
    subcopy:
      'Καφές Dimello, χειροποίητες μπάρες, αραβικές πίτες, Club Sandwich XL και παγωτό Provio στην Περσεφόνης 63. Πέρνα από το Crema ή άνοιξε το μενού για παραγγελία.',
    orderWolt: 'Παραγγελία στο Wolt',
    orderEfood: 'efood',
    footerOne: 'Life is uncertain.',
    footerTwo: 'Eat dessert first.',
    phone: '210 346 7213',
    location: 'Περσεφόνης 63',
  },
  heroShots: [
    'Καφές Dimello σε πραγματική φωτογραφία της μάρκας',
    'Χειροποίητη μπάρα βρώμης από το μενού του Crema',
    'Club Sandwich XL και αραβική πίτα από το μενού του Crema',
  ],
  marquee: ['Dimello', 'μπάρες', 'αραβικές', 'Club XL', 'Provio'],
  story: {
    eyebrow: 'Crema Gazi',
    title: 'Καφές, snacks και παγωτό που αξίζει να δοκιμάσεις.',
    body:
      'Στον κατάλογο θα βρεις καφέ Dimello, χειροποίητες μπάρες βρώμης, αραβικές πίτες, Club Sandwich XL, παγωτό Provio, κρέπες, βάφλες, γλυκά και ροφήματα. Διάλεξε την πρόταση που σου ταιριάζει.',
    visualMain: 'Dimello & snacks',
    visualSub: 'καφές · μπάρες · αραβικές · Club XL · Provio',
    logoAlt: 'Logo Crema Gazi',
  },
  signatures: {
    eyebrow: 'Προτάσεις',
    title: 'Οι επιλογές που θέλεις να δεις πρώτα.',
    items: [
      {
        title: 'Καφές Dimello',
        detail: 'espresso, cappuccino και freddo με τη σταθερή ποιότητα της Dimello',
      },
      {
        title: 'Χειροποίητες μπάρες',
        detail: 'μπάρες βρώμης με φράουλα, φυστικοβούτυρο, κάσιους και άλλες γεύσεις',
      },
      {
        title: 'Αραβικές πίτες',
        detail: 'με emmental, γαλοπούλα, ντομάτα και μαγιονέζα ή άλλους συνδυασμούς',
      },
      {
        title: 'Club Sandwich XL',
        detail: 'γαλοπούλα, gouda, καπνιστό μπέικον, λαχανικά, μαγιονέζα και πατατάκια',
      },
    ],
  },
  products: {
    eyebrow: 'Δημοφιλή',
    title: 'Αυτά θέλεις να δεις πρώτα.',
    cta: 'Παράγγειλε',
    items: [
      {
        name: 'Καφές Dimello',
        note: 'espresso, cappuccino, freddo και latte για take away ή delivery',
      },
      {
        name: 'Μπάρες βρώμης',
        note: 'χειροποίητες επιλογές με φράουλα, αμαρένα, φυστικοβούτυρο ή ξηρούς καρπούς',
      },
      {
        name: 'Αραβική πίτα',
        note: 'emmental, γαλοπούλα, ντομάτα και μαγιονέζα σε δροσερή, χορταστική επιλογή',
      },
      {
        name: 'Club Sandwich XL',
        note: 'με γαλοπούλα, gouda, καπνιστό μπέικον, ντομάτα, μαρούλι, μαγιονέζα και πατατάκια',
      },
      {
        name: 'Παγωτό Provio',
        note: 'πραγματικό παγωτό Provio σε αυθεντική επώνυμη συσκευασία',
      },
    ],
  },
  provio: {
    eyebrow: 'Μάρκα που στηρίζουμε',
    title: 'Provio',
    body: 'Στο Crema επιλέγουμε και στηρίζουμε την ελληνική Provio, με παγωτό που ξεχωρίζει για τον χαρακτήρα και την αυθεντική του ταυτότητα.',
    logoAlt: 'Λογότυπο Provio',
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
    eyebrow: 'Από κοντά · Wolt · efood · BOX',
    title: 'Από κοντά, Wolt, efood, BOX ή τηλέφωνο. Διάλεξε τρόπο και προχώρα.',
    hours: '4',
    hoursLabel: 'τρόποι',
    body: 'Άνοιξε τον κατάλογο, συνέχισε σε Wolt, efood ή BOX, ή κάλεσε απευθείας το κατάστημα.',
  },
  footer: {
    address: 'Περσεφόνης 63, Γκάζι · 210 346 7213 · Dimello · μπάρες · αραβικές · Club XL · Provio · delivery',
  },
  language: {
    label: 'Γλώσσα',
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
