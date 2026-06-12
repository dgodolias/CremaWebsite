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
    eyebrow: '24ωρο delivery · Γκάζι Αθήνα',
    brand: 'Crema',
    headline: ['Γλυκό', 'πρώτα.'],
    subcopy:
      'Κρέπες, βάφλες, καφές και γλυκά στην Περσεφόνης 63, για την ώρα που το Γκάζι θέλει κάτι ζεστό, γλυκό και γρήγορο.',
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
  marquee: ['καφές', 'κρέπες', 'βάφλες', 'pastry', '24ωρο delivery'],
  story: {
    eyebrow: 'Crema Gazi',
    title: 'Όχι μια ήσυχη σελίδα καφέ. Ένα σήμα για γλυκό αργά τη νύχτα.',
    body:
      'Η δημόσια εικόνα του μαγαζιού είναι ξεκάθαρη: μαύρο φόντο, πράσινο σύμβολο crema, πορτοκαλί ένταση delivery και λευκό χειρόγραφο logo. Το site τα μετατρέπει σε καθαρή, premium βιτρίνα για το μαγαζί από το οποίο ήδη παραγγέλνει ο κόσμος.',
    visualMain: '24ωρο delivery',
    visualSub: 'κρέπες · βάφλες · καφές · γλυκά',
    logoAlt: 'Logo Crema Gazi από το δημόσιο Instagram profile',
  },
  signatures: {
    eyebrow: 'Προτάσεις',
    title: 'Μάρμαρο, crema, ζέστη, ζάχαρη. Όχι generic delivery grid.',
    items: [
      {
        title: 'Espresso ritual',
        detail: 'illy shot, μαρμάρινος πάγκος, καθαρό τελείωμα',
      },
      {
        title: 'Iced crema',
        detail: 'κρύος καφές, αφρός, κανέλα, ενέργεια μέχρι αργά',
      },
      {
        title: 'Pastry hit',
        detail: 'ζεστό, βουτυράτο, γρήγορα στην πόρτα σου',
      },
      {
        title: 'Dessert first',
        detail: 'κρέπες, βάφλες και pastry shop διάθεση',
      },
    ],
  },
  products: {
    eyebrow: 'Δημοφιλή',
    title: 'Πράγματα που παραγγέλνεις χωρίς δεύτερη σκέψη.',
    cta: 'Παράγγειλε',
    items: [
      {
        name: 'Freddo με αφρό',
        note: 'κρύο, καθαρό, έτοιμο για βόλτα στο Γκάζι',
      },
      {
        name: 'Ζεστή σφολιάτα',
        note: 'βουτυράτη υφή, γρήγορο comfort',
      },
      {
        name: 'Espresso shot',
        note: 'μικρό, δυνατό, ακριβές',
      },
      {
        name: 'Γλυκό late night',
        note: 'όταν το “κάτι γλυκό” γίνεται παραγγελία',
      },
      {
        name: 'Crema coffee',
        note: 'καφές με μαρμάρινο mood',
      },
      {
        name: 'Snack stop',
        note: 'για πριν, μετά ή ανάμεσα',
      },
    ],
  },
  galleryAlt: 'Λεπτομέρεια προϊόντος Crema',
  location: {
    eyebrow: 'Περσεφόνης 63',
    title: 'Φτιαγμένο για τον ρυθμό του Γκαζιού: καφές πριν, γλυκό μετά, delivery πάντα.',
    body:
      'Οι δημόσιες καταχωρίσεις τοποθετούν το Crema στην Περσεφόνης 63, Γκάζι, Αθήνα, με 24ωρο delivery και τηλεφωνικές παραγγελίες στο 210 346 7213.',
    openMap: 'Άνοιγμα χάρτη',
    callNow: 'Κλήση τώρα',
    mapWord: 'Γκάζι',
  },
  delivery: {
    eyebrow: 'Ανοιχτά όλη μέρα',
    title: 'Όταν η πόλη μένει ξύπνια, το Crema συνεχίζει να κινείται.',
    hours: '24',
    hoursLabel: 'ώρες',
    body: 'Παράγγειλε μέσω Wolt ή efood, ή κάλεσε απευθείας το κατάστημα.',
  },
  footer: {
    address: 'Περσεφόνης 63, Γκάζι · 210 346 7213 · 24ωρο delivery',
  },
  language: {
    label: 'Γλώσσα',
    loading: 'Μετάφραση...',
    apiMissing: 'Πρόσθεσε Google Translate API key για live μετάφραση.',
    ready: 'Μετάφραση από Google Cloud Translation.',
    fallback: 'Ελληνικό περιεχόμενο μέχρι να συνδεθεί API key.',
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
