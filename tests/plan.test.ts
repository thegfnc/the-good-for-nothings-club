import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { facilities } from '@/data/facilities'
import { membershipTiers } from '@/data/membership'
import { changelog, planVersion } from '@/data/plan/changelog'
import { documents } from '@/data/plan/documents'
import { holdCounts } from '@/data/plan/financials'
import { facilityRates, serviceRates, tierPrices } from '@/data/plan/rates'
import { services } from '@/data/services'
import { calculatorDefaults } from '@/lib/plan/calculator'
import { calculatorTotals, formatMoney, parsePrice } from '@/lib/plan/money'

/**
 * The business plan reads public facts from the site's data files and
 * keeps prices in data/plan/rates.ts, keyed by the same slugs. These
 * guards catch a public offering shipping without a price, and a price
 * entry outliving the offering it belonged to.
 */

describe('rates cover the public offering', () => {
  const liveFacilities = facilities.filter(f => f.status !== 'planned')

  it('every live facility has a rate, and every rate a facility', () => {
    expect(Object.keys(facilityRates).sort()).toEqual(
      liveFacilities.map(f => f.slug).sort()
    )
  })

  it('rate models match the facility models', () => {
    for (const facility of liveFacilities) {
      expect(facilityRates[facility.slug].model, facility.slug).toBe(
        facility.model
      )
    }
  })

  it('every service has a price, and every price a service', () => {
    expect(Object.keys(serviceRates).sort()).toEqual(
      services.map(s => s.slug).sort()
    )
  })

  it('every membership tier has a quoted price line', () => {
    expect(Object.keys(tierPrices).sort()).toEqual(
      membershipTiers.map(t => t.slug).sort()
    )
  })

  it('the member price line quotes the monthly rates', () => {
    expect(tierPrices.member).toContain(
      formatMoney(facilityRates['permanent-desk'].amount)
    )
    expect(tierPrices.member).toContain(
      formatMoney(facilityRates['band-room'].amount)
    )
  })

  it('hold counts only name monthly facilities', () => {
    for (const slug of Object.keys(holdCounts)) {
      expect(facilityRates[slug]?.model, slug).toBe('monthly')
    }
  })
})

describe('plan data stays admin-only', () => {
  it('no public page or markdown twin imports data/plan', () => {
    const publicFiles = [
      'lib/markdown/pages.ts',
      'lib/markdown/site.ts',
      'app/markdown/[[...path]]/route.ts',
      'app/llms.txt/route.ts',
      'app/llms-full.txt/route.ts',
      'app/sitemap.ts',
    ]
    for (const file of publicFiles) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(
        /data\/plan|lib\/plan/
      )
    }
  })

  it('the client calculator only imports pure math', () => {
    const source = readFileSync('components/admin/plan/Calculator.tsx', 'utf8')
    expect(source).not.toMatch(/@\/data\//)
    expect(source).not.toMatch(/lib\/plan\/calculator/)
  })
})

describe('calculator', () => {
  it('parses the leading dollar figure from a price label', () => {
    expect(parsePrice('From $1,000')).toBe(1000)
    expect(parsePrice('$300 / song')).toBe(300)
    expect(parsePrice('From $150 / hr')).toBe(150)
    expect(parsePrice('By quote')).toBeNull()
  })

  it('formats money with a sign and thousands separator', () => {
    expect(formatMoney(1600)).toBe('$1,600')
    expect(formatMoney(-525)).toBe('-$525')
  })

  it("matches the gap recorded in the current plan version's changelog", () => {
    const defaults = calculatorDefaults()
    const totals = calculatorTotals({ ...defaults, storeSales: 0 })
    const current = changelog.find(entry => entry.version === planVersion)
    const text = current?.changes.join(' ') ?? ''

    expect(text).toContain(`intake would be ${formatMoney(totals.holds)}`)
    expect(text).toContain(`~${formatMoney(totals.costs)} in costs`)
    expect(text).toContain(`about −${formatMoney(-totals.net)}`)
  })

  it('the rental agreement quotes the current monthly rates', () => {
    const agreement = documents.find(d => d.slug === 'rental-agreement')
    const text = JSON.stringify(agreement)
    expect(text).toContain(
      `Permanent desk: ${formatMoney(facilityRates['permanent-desk'].amount)} per month`
    )
    expect(text).toContain(
      `Band practice slot: ${formatMoney(facilityRates['band-room'].amount)} per month`
    )
  })
})

describe('changelog', () => {
  it('is newest first and starts at the current version', () => {
    expect(changelog[0].version).toBe(planVersion)
    const dates = changelog.map(entry => entry.date)
    expect([...dates].sort().reverse()).toEqual(dates)
  })
})
