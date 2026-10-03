import { facilities } from '@/data/facilities'
import { holdCounts, monthlyCosts } from '@/data/plan/financials'
import {
  facilityRates,
  potentialFacilities,
  serviceRates,
} from '@/data/plan/rates'
import { services } from '@/data/services'

import { parsePrice, type CalculatorDefaults, type IncomeLine } from './money'

/**
 * The calculator's starting point, built from the public offering and the
 * internal price list so rates never drift. Every line is a rate × a
 * quantity; costs are a flat amount.
 */

export function calculatorDefaults(): CalculatorDefaults {
  const holds: IncomeLine[] = []
  const hourly: IncomeLine[] = []

  for (const facility of facilities) {
    if (facility.status === 'planned') continue
    const rate = facilityRates[facility.slug]
    if (!rate) continue
    const line = { id: facility.slug, label: facility.name, rate: rate.amount }
    if (rate.model === 'monthly') {
      holds.push({ ...line, qty: holdCounts[facility.slug] ?? 0 })
    } else {
      hourly.push({ ...line, qty: 0 })
    }
  }
  for (const facility of potentialFacilities) {
    hourly.push({
      id: facility.slug,
      label: facility.name,
      rate: facility.rate.amount,
      qty: 0,
      potential: true,
    })
  }

  const serviceLines = services.flatMap(service => {
    const price = serviceRates[service.slug]
    const amount = price ? parsePrice(price.price) : null
    return amount === null
      ? []
      : [{ id: service.slug, label: service.name, rate: amount, qty: 0 }]
  })

  return {
    costs: monthlyCosts.map(({ id, label, amount }) => ({ id, label, amount })),
    holds,
    hourly,
    services: serviceLines,
  }
}
