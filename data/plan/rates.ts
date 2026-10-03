/**
 * Rates - the internal price list. Admin only.
 *
 * The public site stopped printing prices in Sept 2026 (#63: prospects
 * start a conversation instead of bouncing on a number), so this file is
 * now the only place prices live. Names, descriptions, and quantities stay
 * in the public data files (data/facilities.ts, data/services.ts) - rates
 * here are keyed by the same slugs, and tests/planRates.test.ts fails if a
 * public offering has no price.
 *
 * Price changes get a decision record in data/plan/changelog.ts (with the
 * intake/gap math) before they're quoted to anyone.
 */

export type RateLine = {
  /** Sub-heading in the menu, e.g. "Room" / "Staff". */
  group?: string
  item: string
  amount: number
  unit: string
}

export type FacilityRate =
  | { model: 'monthly'; amount: number; note?: string }
  | {
      model: 'hourly'
      /** Headline "from" rate - the weekday room rate. */
      amount: number
      note?: string
      rateCard: RateLine[]
    }

/** Keyed by `slug` in data/facilities.ts. */
export const facilityRates: Record<string, FacilityRate> = {
  'permanent-desk': { model: 'monthly', amount: 450 },
  'band-room': {
    model: 'monthly',
    amount: 250,
    note: 'One agreement per band, signed by its point person.',
  },
  'photo-studio': {
    model: 'hourly',
    amount: 30,
    note: 'Two-hour minimum. Members pay half the weekday rate, nights and weekends included.',
    rateCard: [
      {
        group: 'Room',
        item: 'Weekday · 9–5, Mon–Fri',
        amount: 30,
        unit: '/hr',
      },
      { group: 'Room', item: 'Evenings & weekends', amount: 40, unit: '/hr' },
      { group: 'Staff', item: 'Assistant (optional)', amount: 50, unit: '/hr' },
    ],
  },
  'recording-studio': {
    model: 'hourly',
    amount: 30,
    note: 'Two-hour minimum. Members pay half the weekday rate, nights and weekends included.',
    rateCard: [
      {
        group: 'Room',
        item: 'Weekday · 9–5, Mon–Fri',
        amount: 30,
        unit: '/hr',
      },
      { group: 'Room', item: 'Evenings & weekends', amount: 40, unit: '/hr' },
      { group: 'Staff', item: 'Engineer (optional)', amount: 50, unit: '/hr' },
    ],
  },
}

/**
 * Facilities the plan prices but the site doesn't publish yet (the site
 * keeps them commented out of data/facilities.ts until they're real).
 */
export type PotentialFacility = {
  slug: string
  name: string
  description: string
  rate: Extract<FacilityRate, { model: 'hourly' }>
}

export const potentialFacilities: PotentialFacility[] = [
  {
    slug: 'darkroom',
    name: 'Darkroom',
    description:
      'A black-and-white darkroom for developing and printing — chemicals included. Just needs a door.',
    rate: {
      model: 'hourly',
      amount: 20,
      note: 'Two-hour minimum.',
      rateCard: [
        {
          group: 'Room',
          item: 'Weekday · 9–5, Mon–Fri',
          amount: 20,
          unit: '/hr',
        },
        {
          group: 'Staff',
          item: 'Assistant (optional)',
          amount: 50,
          unit: '/hr',
        },
      ],
    },
  },
  {
    slug: 'repair-bench',
    name: 'Electronics & guitar bench',
    description:
      'A workbench with the necessary tools and materials for fixing electronics and setting up instruments.',
    rate: {
      model: 'hourly',
      amount: 10,
      note: 'Two-hour minimum.',
      rateCard: [
        {
          group: 'Room',
          item: 'Weekday · 9–5, Mon–Fri',
          amount: 10,
          unit: '/hr',
        },
        {
          group: 'Staff',
          item: 'Assistant (optional)',
          amount: 50,
          unit: '/hr',
        },
      ],
    },
  },
]

export type ServicePriceLine = {
  /** e.g. "At the clubhouse" / "On-site". */
  group?: string
  label: string
  /** Human string - pricing is soft ("From $250", "By quote"). */
  price: string
}

export type ServiceRate = {
  /** Headline price. Its leading dollar figure feeds the calculator. */
  price: string
  detail?: string
  lines?: ServicePriceLine[]
}

/** Keyed by `slug` in data/services.ts. */
export const serviceRates: Record<string, ServiceRate> = {
  photography: {
    price: 'From $250',
    lines: [
      { group: 'At the clubhouse', label: 'Portrait', price: 'From $250' },
      {
        group: 'At the clubhouse',
        label: 'Product / promo',
        price: 'From $300',
      },
      { group: 'On-site', label: 'Event coverage', price: 'From $250' },
      { group: 'On-site', label: 'Portrait', price: 'From $300' },
      { group: 'On-site', label: 'Product / promo', price: 'From $350' },
    ],
  },
  video: {
    price: 'From $400',
    lines: [
      {
        group: 'At the clubhouse',
        label: 'Product / promo',
        price: 'From $400',
      },
      { group: 'On-site', label: 'Event coverage', price: 'From $400' },
      { group: 'On-site', label: 'Product / promo', price: 'From $450' },
      { group: 'On-site', label: 'Music video', price: 'From $1,000' },
    ],
  },
  music: {
    price: 'From $300',
    lines: [
      { label: 'Mixing', price: '$300 / song' },
      { label: 'Production', price: 'By quote' },
      { label: 'Composition', price: 'By quote' },
    ],
  },
  zines: {
    price: 'From $1,000',
    detail: 'Quoted to page count, print quality, and run size.',
  },
  'photo-booth': { price: 'From $150 / hr' },
  cinema: { price: 'From $400' },
  'sound-system': {
    price: 'From $400',
    detail: 'Includes the operator, setup, and teardown.',
  },
  'event-planning': { price: 'From $1,000' },
}

/** The consignment shop's terms. The site says only "a percentage". */
export const storefrontTerms = {
  split: '25% of net profit',
  detail:
    'The club handles shipping, returns, customer service, and sales tax for 25% of the net profit on each sale.',
}

/**
 * Tier price lines as quoted in a conversation. The site shows only the
 * commitment ("Monthly" / "Pay as you go" / "Free"). Keyed by `slug` in
 * data/membership.ts.
 */
export const tierPrices: Record<string, string> = {
  member: 'Desk $450 / mo · Band room $250 / mo',
  associate: 'Hourly rates, two-hour minimum',
  friend: 'Free',
}
