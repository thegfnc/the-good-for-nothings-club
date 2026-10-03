import {
  BulletList,
  PlanCard,
  PlanPage,
  PlanSection,
} from '@/components/admin/plan/PlanPage'
import { businessCopy, competitors } from '@/data/plan/business'

export const metadata = { title: 'Business model' }

export default function BusinessPage() {
  return (
    <PlanPage title='Business model' lead={businessCopy.lead}>
      <PlanSection title={businessCopy.moreTitle}>
        <div className='grid gap-4 md:grid-cols-3'>
          {businessCopy.moreCards.map(card => (
            <PlanCard key={card.title} title={card.title}>
              <p className='text-black/70'>{card.body}</p>
            </PlanCard>
          ))}
        </div>
      </PlanSection>

      <PlanSection title={businessCopy.joiningTitle}>
        <p className='max-w-2xl font-sans text-sm'>
          {businessCopy.joiningBody}
        </p>
      </PlanSection>

      <PlanSection title={businessCopy.workTitle} lead={businessCopy.workIntro}>
        <div className='font-sans text-sm'>
          <BulletList
            items={businessCopy.splits.map(split => (
              <>
                <span className='font-semibold'>{split.label}</span>
                <span className='text-black/60'> — {split.value}</span>
              </>
            ))}
          />
        </div>
      </PlanSection>

      <PlanSection
        title={businessCopy.compareTitle}
        lead={businessCopy.compareIntro}
      >
        <div className='overflow-x-auto'>
          <table className='w-full font-sans text-sm'>
            <thead>
              <tr className='border-b-2 border-black text-left tracking-[1px] uppercase'>
                <th className='py-2 pr-4'>Space</th>
                <th className='py-2 pr-4'>Model</th>
                <th className='py-2 pr-4'>Pricing</th>
                <th className='py-2'>Gap GFNC fills</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map(competitor => (
                <tr
                  key={competitor.name}
                  className='border-b border-black/20 align-top'
                >
                  <td className='py-3 pr-4 font-bold'>
                    {competitor.url ? (
                      <a
                        href={competitor.url}
                        target='_blank'
                        rel='noreferrer'
                        className='underline'
                      >
                        {competitor.name}
                      </a>
                    ) : (
                      competitor.name
                    )}
                  </td>
                  <td className='py-3 pr-4'>{competitor.model}</td>
                  <td className='py-3 pr-4 whitespace-nowrap'>
                    {competitor.pricing}
                  </td>
                  <td className='py-3 text-black/70'>{competitor.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PlanSection>
    </PlanPage>
  )
}
