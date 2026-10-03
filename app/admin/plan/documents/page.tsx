import {
  BulletList,
  PlanCard,
  PlanPage,
  PlanSection,
} from '@/components/admin/plan/PlanPage'
import { documents } from '@/data/plan/documents'

export const metadata = { title: 'Documents' }

const SHELVES = [
  { kind: 'signed', title: 'Signed documents' },
  { kind: 'checklist', title: 'Checklists' },
] as const

export default function DocumentsPage() {
  return (
    <PlanPage
      title='Documents'
      lead='Agreements and checklists used by the club. Drafts — no signed copies exist yet; rent figures read from the price list.'
    >
      {SHELVES.map(shelf => {
        const docs = documents.filter(doc => doc.kind === shelf.kind)
        if (docs.length === 0) return null
        return (
          <PlanSection key={shelf.kind} title={shelf.title}>
            <div className='flex flex-col gap-6'>
              {docs.map(doc => (
                <PlanCard
                  key={doc.slug}
                  title={<span id={doc.slug}>{doc.name}</span>}
                  className='scroll-mt-20 p-6'
                >
                  <p className='text-black/60'>{doc.summary}</p>
                  {doc.sections.map((section, i) => (
                    <div key={section.heading ?? i} className='mt-5'>
                      {section.heading && (
                        <h4 className='mb-2 text-xs font-semibold tracking-[0.08em] uppercase'>
                          {section.heading}
                        </h4>
                      )}
                      {section.body?.map(paragraph => (
                        <p key={paragraph} className='my-2 leading-relaxed'>
                          {paragraph}
                        </p>
                      ))}
                      {section.items && <BulletList items={section.items} />}
                    </div>
                  ))}
                </PlanCard>
              ))}
            </div>
          </PlanSection>
        )
      })}
    </PlanPage>
  )
}
