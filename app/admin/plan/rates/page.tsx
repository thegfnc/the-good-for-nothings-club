import {
  LeaderRow,
  PlanCard,
  PlanPage,
  PlanSection,
} from '@/components/admin/plan/PlanPage'
import { facilities, storefrontCopy } from '@/data/facilities'
import { membershipTiers } from '@/data/membership'
import {
  facilityRates,
  potentialFacilities,
  serviceRates,
  storefrontTerms,
  tierPrices,
  type RateLine,
  type ServicePriceLine,
} from '@/data/plan/rates'
import { services, servicesCopy } from '@/data/services'
import { formatMoney } from '@/lib/plan/money'

export const metadata = { title: 'Rates' }

/** Rows under optional group labels, in first-seen group order. */
function Grouped<T extends { group?: string }>({
  rows,
  render,
}: {
  rows: T[]
  render: (row: T) => React.ReactNode
}) {
  const groups = [...new Set(rows.map(row => row.group))]
  return (
    <div className='flex flex-col gap-2'>
      {groups.map(group => (
        <div key={group ?? '_'}>
          {group && (
            <div className='text-[11px] font-semibold tracking-[0.08em] text-black/50 uppercase'>
              {group}
            </div>
          )}
          {rows.filter(row => row.group === group).map(render)}
        </div>
      ))}
    </div>
  )
}

const rateRow = (line: RateLine) => (
  <LeaderRow
    key={`${line.group}-${line.item}`}
    label={line.item}
    value={`${formatMoney(line.amount)} ${line.unit}`}
  />
)

const priceRow = (line: ServicePriceLine) => (
  <LeaderRow
    key={`${line.group}-${line.label}`}
    label={line.label}
    value={line.price}
  />
)

export default function RatesPage() {
  const live = facilities.filter(f => f.status !== 'planned')

  return (
    <PlanPage
      title='Rates'
      lead='The price list. The public site shows no prices, so this is the one place they live — quote from here. Names and descriptions come from the public pages.'
    >
      <PlanSection title='Membership'>
        <div className='grid gap-4 md:grid-cols-3'>
          {membershipTiers.map(tier => (
            <PlanCard key={tier.slug} title={tier.name} meta={tier.price}>
              {tierPrices[tier.slug]}
            </PlanCard>
          ))}
        </div>
      </PlanSection>

      <PlanSection title='Facilities'>
        <div className='grid gap-4 md:grid-cols-2'>
          {live.map(facility => {
            const rate = facilityRates[facility.slug]
            return (
              <PlanCard
                key={facility.slug}
                title={
                  <LeaderRow
                    label={facility.name}
                    value={
                      rate
                        ? `${rate.model === 'hourly' ? 'From ' : ''}${formatMoney(rate.amount)} ${rate.model === 'monthly' ? '/ mo' : '/ hr'}`
                        : 'No rate'
                    }
                  />
                }
                meta={facility.quantity}
              >
                {rate?.model === 'hourly' && (
                  <Grouped rows={rate.rateCard} render={rateRow} />
                )}
                {rate?.note && (
                  <p className='mt-2 text-xs text-black/60'>{rate.note}</p>
                )}
              </PlanCard>
            )
          })}
        </div>
      </PlanSection>

      <PlanSection
        title='Potential facilities'
        lead='Planning rates for rooms the site keeps unpublished until they’re real.'
      >
        <div className='grid gap-4 md:grid-cols-2'>
          {potentialFacilities.map(facility => (
            <PlanCard
              key={facility.slug}
              className='border-dashed border-black/40'
              title={
                <LeaderRow
                  label={facility.name}
                  value={`From ${formatMoney(facility.rate.amount)} / hr`}
                />
              }
            >
              <p className='mb-3 text-black/60'>{facility.description}</p>
              <Grouped rows={facility.rate.rateCard} render={rateRow} />
            </PlanCard>
          ))}
        </div>
      </PlanSection>

      {servicesCopy.categories.map(category => {
        const inCategory = services.filter(s => s.category === category.key)
        if (inCategory.length === 0) return null
        return (
          <PlanSection
            key={category.key}
            title={`Services · ${category.title}`}
          >
            <div className='grid gap-4 md:grid-cols-2'>
              {inCategory.map(service => {
                const rate = serviceRates[service.slug]
                return (
                  <PlanCard
                    key={service.slug}
                    title={
                      <LeaderRow
                        label={service.name}
                        value={rate?.price ?? 'No rate'}
                      />
                    }
                  >
                    {rate?.lines && (
                      <Grouped rows={rate.lines} render={priceRow} />
                    )}
                    {rate?.detail && (
                      <p className='mt-2 text-xs text-black/60'>
                        {rate.detail}
                      </p>
                    )}
                  </PlanCard>
                )
              })}
            </div>
          </PlanSection>
        )
      })}

      <PlanSection title={storefrontCopy.title}>
        <PlanCard
          title={
            <LeaderRow
              label={storefrontCopy.name}
              value={storefrontTerms.split}
            />
          }
        >
          <p className='text-black/60'>{storefrontTerms.detail}</p>
        </PlanCard>
      </PlanSection>
    </PlanPage>
  )
}
