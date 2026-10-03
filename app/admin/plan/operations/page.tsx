import {
  BulletList,
  PlanCard,
  PlanPage,
  PlanSection,
} from '@/components/admin/plan/PlanPage'
import { amenities } from '@/data/facilities'
import { houseRules, meetingSpots, runbook } from '@/data/plan/operations'

export const metadata = { title: 'Operations' }

export default function OperationsPage() {
  return (
    <PlanPage
      title='Operations'
      lead='The house rules, where to take a meeting, what’s stocked, and how to open and close up.'
    >
      <PlanSection title='House rules'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {houseRules.map(rule => (
            <PlanCard key={rule.label} title={rule.label}>
              <BulletList items={rule.points} />
            </PlanCard>
          ))}
          <PlanCard
            title='Taking a meeting'
            meta='No booking · first come, first served'
          >
            <BulletList
              items={meetingSpots.map(spot => (
                <>
                  {spot.name}
                  {spot.availability && (
                    <span className='text-black/60'>
                      {' '}
                      — {spot.availability}
                    </span>
                  )}
                </>
              ))}
            />
          </PlanCard>
          <PlanCard
            title='Stocked amenities'
            meta='Same list as the facilities page'
          >
            <BulletList items={amenities} />
          </PlanCard>
        </div>
      </PlanSection>

      <PlanSection title='Opening & closing'>
        <div className='grid gap-4 md:grid-cols-2'>
          {runbook.map(list => (
            <PlanCard key={list.title} title={list.title}>
              <ol className='flex list-decimal flex-col gap-1.5 pl-5 marker:font-semibold'>
                {list.steps.map(step => (
                  <li key={step.label} className='leading-snug'>
                    <span className='font-semibold'>{step.label}</span>
                    {step.detail && (
                      <span className='text-black/60'> — {step.detail}</span>
                    )}
                  </li>
                ))}
              </ol>
            </PlanCard>
          ))}
        </div>
      </PlanSection>
    </PlanPage>
  )
}
