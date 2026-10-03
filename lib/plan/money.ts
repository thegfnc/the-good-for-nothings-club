/**
 * Pure calculator math - no data imports, so the client bundle carries no
 * prices or costs. The defaults are built server-side (./calculator.ts)
 * and arrive as props on the authenticated page.
 */

/** "$1,000" / "-$525" */
export function formatMoney(amount: number) {
  const sign = amount < 0 ? '-' : ''
  return `${sign}$${Math.abs(Math.round(amount)).toLocaleString('en-US')}`
}

/** Leading dollar figure of a human price: "From $1,000" → 1000, "By quote" → null. */
export function parsePrice(label: string): number | null {
  const match = label.match(/\$\s*([\d,]+)/)
  return match ? Number(match[1].replace(/,/g, '')) : null
}

export type IncomeLine = {
  id: string
  label: string
  rate: number
  qty: number
  /** Marks offerings the site doesn't publish yet. */
  potential?: boolean
}

export type CalculatorDefaults = {
  costs: { id: string; label: string; amount: number }[]
  holds: IncomeLine[]
  hourly: IncomeLine[]
  services: IncomeLine[]
}

export const lineTotal = (lines: IncomeLine[]) =>
  lines.reduce((sum, line) => sum + line.rate * line.qty, 0)

export type CalculatorTotals = {
  holds: number
  hourly: number
  services: number
  store: number
  income: number
  costs: number
  net: number
}

export function calculatorTotals(input: {
  costs: { amount: number }[]
  holds: IncomeLine[]
  hourly: IncomeLine[]
  services: IncomeLine[]
  storeSales: number
}): CalculatorTotals {
  const holds = lineTotal(input.holds)
  const hourly = lineTotal(input.hourly)
  const services = lineTotal(input.services)
  const store = input.storeSales
  const income = holds + hourly + services + store
  const costs = input.costs.reduce((sum, cost) => sum + cost.amount, 0)
  return { holds, hourly, services, store, income, costs, net: income - costs }
}
