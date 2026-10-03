/**
 * Financials - the current space, by the month. Admin only.
 *
 * Only fixed costs and today's holder counts live here. Income lines are
 * derived from data/plan/rates.ts so the calculator never drifts from the
 * price list (see lib/plan/calculator.ts).
 */

export type CostLine = {
  id: string
  label: string
  /** Monthly dollars; editable in the calculator. */
  amount: number
}

export const monthlyCosts: CostLine[] = [
  { id: 'rent', label: 'Rent', amount: 1800 },
  { id: 'nnn', label: 'Triple-net / CAM', amount: 0 },
  { id: 'util', label: 'Utilities', amount: 0 },
  { id: 'net', label: 'Internet & phone', amount: 0 },
  { id: 'insurance', label: 'Insurance', amount: 100 },
  { id: 'maint', label: 'Maintenance & cleaning', amount: 100 },
  { id: 'software', label: 'Software & subscriptions', amount: 0 },
  { id: 'supplies', label: 'Supplies & consumables', amount: 50 },
  { id: 'amenities', label: 'Pantry & amenities', amount: 75 },
  { id: 'reserve', label: 'Equipment reserve', amount: 0 },
  { id: 'mkt', label: 'Marketing', amount: 0 },
  { id: 'misc', label: 'Other / contingency', amount: 0 },
]

/**
 * How many people hold each monthly facility today, keyed by facility
 * slug. One of the desks is the founder's own, so outside money is one
 * desk less than intake.
 */
export const holdCounts: Record<string, number> = {
  'permanent-desk': 3,
  'band-room': 1,
}

export const financialsCopy = {
  lead: 'Where things actually stand today. Adjust the menu below to see what it takes to close the gap.',
  footnote:
    'Rates default to the price list — edit any of them to model a change. This starts from the space exactly as it is today.',
}
