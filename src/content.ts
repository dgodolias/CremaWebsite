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
    order: 'Παραγγελία',
    orderWolt: 'Παραγγελία στο Wolt',
    orderEfood: 'efood',
    footerOne: 'Life is uncertain.',
    footerTwo: 'Eat dessert first.',
    phone: '210 346 7213',
    location: 'Περσεφόνης 63, Γκάζι',
  },
  heroShots: [
    'Καφές Dimello σε πραγματική φωτογραφία της μάρκας',
    'Χειροποίητη μπάρα βρώμης από το μενού του Crema',
    'Club Sandwich XL και αραβική πίτα από το μενού του Crema',
  ],
  marquee: ['Καφές','Κρέπες','Βάφλες','Παγωτό'],
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
        title: 'Παγωτό Provio',
        detail: 'παγωτό Provio με φρέσκο γάλα ημέρας και ελληνική ταυτότητα, σε γεύσεις όπως αμαρένα, σοκολάτα και βανίλια',
      },
    ],
  },
  crepes: {
    eyebrow: 'Φτιάξε την κρέπα σου',
    title: 'Η κρέπα, όπως τη θέλεις.',
    slogan: 'Κρέπες με αγνά υλικά καθημερινά, μείγμα δικό μας και κάθε δημιουργία φτιαγμένη με αγάπη, φροντίδα και μεράκι. Γιατί η καλύτερη γεύση ξεκινά από όσα διαλέγουμε και ολοκληρώνεται σε κάθε ζεστή, λαχταριστή μπουκιά.',
    hint: 'Hover ή πάτησε για να δεις τα υλικά',
    scrollHint: 'Κύλησε για όλα τα υλικά',
    close: 'Κλείσιμο υλικών',
    cards: [
      {
        id: 'savory',
        number: '01',
        title: 'Αλμυρή κρέπα',
        imageAlt: 'Αλμυρή κρέπα με τυρί, γαλοπούλα, ντομάτα, πιπεριά και μανιτάρια',
        categories: [
          { title: 'Βάση', items: ['Φύλλο κρέπας'] },
          {
            title: 'Προσθέστε τυριά',
            items: ['Παρμεζάνα', 'Mozzarella', 'Philadelphia', 'Φέτα', 'Ροκφόρ', 'Gouda', 'Blue cheese'],
          },
          {
            title: 'Προσθέστε αλλαντικά | κρεατικά',
            items: [
              'Κοτόπουλο ψίχα',
              'Φιλέτο κοτόπουλο',
              'Μπιφτέκι μοσχαρίσιο',
              'Λουκάνικο Φρανκφούρτης',
              'Λουκάνικο χωριάτικο',
              'Σαλάμι αέρος',
              'Γαλοπούλα',
              'Μπέικον',
              'Καπνιστό χοιρινό',
              'Ζαμπόν',
              'Κοτομπουκιές',
            ],
          },
          {
            title: 'Προσθέστε λαχανικά',
            items: ['Ελιές', 'Καλαμπόκι', 'Μαρούλι', 'Μανιτάρια', 'Πιπεριά πράσινη', 'Ντομάτα'],
          },
          {
            title: 'Προσθέστε sauces',
            items: [
              'Ρώσικη',
              'Ουγγαρέζα',
              'Μαγιονέζα',
              'Κηπούρου',
              'Τυροκαυτερή',
              'Τυροσαλάτα',
              'Σως μουστάρδας',
              'Μουστάρδα',
              'Ketchup',
              'Tabasco',
            ],
          },
          {
            title: 'Προσθέστε extra',
            items: ['Τόνος', 'Πατατάκια', 'Κρέμα γάλακτος', 'Αυγό βραστό', 'Ομελέτα', 'Πάστα ελιάς'],
          },
        ],
      },
      {
        id: 'sweet',
        number: '02',
        title: 'Γλυκιά κρέπα',
        imageAlt: 'Γλυκιά κρέπα με πραλίνα σοκολάτας και φρέσκες φράουλες',
        categories: [
          { title: 'Βάση', items: ['Φύλλο κρέπας'] },
          {
            title: 'Προσθέστε πραλίνες',
            items: [
              'Σοκολάτα Nutella',
              'Σοκολάτα bitter',
              'Πραλίνα Kinder Bueno',
              'Πραλίνα καραμέλα',
              'Πραλίνα μπανάνα',
              'Λευκή σοκολάτα',
              'Πραλίνα Ferrero',
              'Πραλίνα φράουλα',
              'Φυστικοβούτυρο',
              'Μαρμελάδα φράουλα',
              'Μαρμελάδα βερύκοκο',
              'Πραλίνα Biscoff crunchy',
            ],
          },
          {
            title: 'Προσθέστε extra πραλίνα',
            items: [
              'Σοκολάτα Nutella',
              'Σοκολάτα bitter',
              'Πραλίνα Kinder Bueno',
              'Πραλίνα καραμέλα',
              'Πραλίνα μπανάνα',
              'Λευκή σοκολάτα',
              'Πραλίνα Ferrero',
              'Πραλίνα φράουλα',
              'Φυστικοβούτυρο',
              'Μαρμελάδα φράουλα',
              'Μαρμελάδα βερύκοκο',
            ],
          },
          {
            title: 'Προσθέστε extra',
            items: [
              'Σαντιγύ',
              'Μπισκότο',
              'Μπισκότο Oreo',
              'Μπισκότο digestive',
              'Μπισκότο Lotus Biscoff',
              'Αμύγδαλο',
              'Φουντούκι',
              'Καρύδι',
              'Καρύδα',
              'Μπανάνα φρούτο',
              'Μήλο φρούτο',
              'Φράουλα φρούτο',
              'Ανανάς φρούτο',
              'Grand Marnier',
              'Kahlua',
              'Baileys',
              'Caprice',
            ],
          },
          {
            title: 'Προσθέστε μπάλα παγωτό',
            items: [
              'Παγωτό σοκολάτα μπάλα',
              'Παγωτό μπανάνα μπάλα',
              'Παγωτό βανίλια Μαδαγασκάρης μπάλα',
              'Παγωτό φυστίκι Σικελίας μπάλα',
              'Παγωτό Ferrero μπάλα',
              'Παγωτό cookies μπάλα',
              'Παγωτό φράουλα μπάλα',
              'Παγωτό brownies μπάλα',
              'Παγωτό εκμέκ με κανταΐφι μπάλα',
              'Παγωτό Kinder Bueno μπάλα',
              'Παγωτό γιαούρτι αγριοκέρασο μπάλα',
              'Παγωτό stracciatella μπάλα',
              'Παγωτό black forest μπάλα',
              'Παγωτό μπουγάτσα μπάλα',
              'Παγωτό snickers μπάλα',
            ],
          },
          {
            title: 'Προσθέστε extra μπάλα παγωτό',
            items: [
              'Παγωτό σοκολάτα μπάλα',
              'Παγωτό μπανάνα μπάλα',
              'Παγωτό βανίλια Μαδαγασκάρης μπάλα',
              'Παγωτό φυστίκι Σικελίας μπάλα',
              'Παγωτό Ferrero μπάλα',
              'Παγωτό cookies μπάλα',
              'Παγωτό φράουλα μπάλα',
              'Παγωτό brownies μπάλα',
              'Παγωτό εκμέκ με κανταΐφι μπάλα',
              'Παγωτό Kinder Bueno μπάλα',
              'Παγωτό γιαούρτι αγριοκέρασο μπάλα',
              'Παγωτό stracciatella μπάλα',
              'Παγωτό black forest μπάλα',
              'Παγωτό μπουγάτσα μπάλα',
              'Παγωτό snickers μπάλα',
            ],
          },
        ],
      },
    ],
  },
  products: {
    eyebrow: 'Και άλλα από το μενού',
    title: 'Πολύ περισσότερα από τις βασικές μας προτάσεις.',
    cta: 'Παράγγειλε',
    items: [
      {
        name: 'My Waffle',
        note: 'φτιάξε τη δική σου βάφλα με τα υλικά και τις γεύσεις που προτιμάς',
      },
      {
        name: "Σαλάτα Caesar's",
        note: "κοτόπουλο φιλέτο, παρμεζάνα, μπέικον, κρουτόν και Caesar's dressing",
      },
      {
        name: 'Banoffee',
        note: 'δροσερό γλυκό με μπανάνα, καραμέλα και κρεμώδη υφή',
      },
      {
        name: 'Φρουτοσαλάτα',
        note: 'πολύχρωμα φρούτα εποχής για μια φρέσκια, ελαφριά επιλογή',
      },
      {
        name: 'Φυσικός χυμός ανάμεικτος',
        note: 'φυσικός χυμός με φρούτα εποχής, φτιαγμένος τη στιγμή της παραγγελίας',
      },
    ],
  },
  provio: {
    eyebrow: 'Μάρκα που στηρίζουμε',
    title: 'Provio',
    body: 'Στο Crema επιλέγουμε και στηρίζουμε την ελληνική Provio. Το παγωτό Provio ξεχωρίζει για τον χαρακτήρα και την αυθεντική του ταυτότητα.',
    logoAlt: 'Λογότυπο Provio',
    productAlt: 'Αυθεντική συσκευασία παγωτού Provio αμαρένα',
  },
  gallery: {
    label: 'Περισσότερες επιλογές από το μενού Crema',
    items: ['Cheesecake βύσσινο', 'Milkshake', 'Yogurt bowl', 'Mousse cookies', 'Lemon pie', 'Donut Bueno'],
  },
  location: {
    eyebrow: 'Περσεφόνης 63',
    title: 'Περσεφόνης 63, Γκάζι. Εκεί που ο καφές συναντά την κρέπα.',
    body:
      'Θα το βρεις στην Περσεφόνης 63, στο Γκάζι. Άνοιξε τον χάρτη, δες τον κατάλογο ή κάλεσε στο 210 346 7213.',
    hours: 'Ανοιχτά 24 ώρες · 7 ημέρες την εβδομάδα',
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
