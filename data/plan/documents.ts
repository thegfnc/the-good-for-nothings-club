/**
 * Documents - agreements people sign and checklists leadership runs.
 * Admin only. Drafts: no signed copies exist yet.
 */

import { formatMoney } from '@/lib/plan/money'

import { facilityRates } from './rates'

export type DocumentSection = {
  heading?: string
  /** Paragraphs. */
  body?: string[]
  /** List rows. */
  items?: string[]
}

export type ClubDocument = {
  slug: string
  name: string
  kind: 'signed' | 'checklist'
  /** One line under the title. */
  summary: string
  sections: DocumentSection[]
}

const desk = formatMoney(facilityRates['permanent-desk'].amount)
const band = formatMoney(facilityRates['band-room'].amount)

export const documents: ClubDocument[] = [
  {
    slug: 'rental-agreement',
    name: 'Rental agreement',
    kind: 'signed',
    summary:
      'The terms a member signs before keys are issued — this agreement covers both permanent desks and band slots.',
    sections: [
      {
        heading: 'Parties & term',
        body: [
          'This agreement is between The Good for Nothings Club and the member. It runs month-to-month from the first day of paid access, and either side can end it with 30 days’ written notice.',
        ],
      },
      {
        heading: 'Rent & payment',
        items: [
          `Permanent desk: ${desk} per month. Band practice slot: ${band} per month, with one agreement per band signed by its designated point person.`,
          'Rent is due on the 1st of each month; automatic payment is required.',
          'Declined payments carry a 7-day grace period. Access is suspended after 14 days unpaid, and the agreement terminates after 30.',
        ],
      },
      {
        heading: 'Keys & access',
        items: [
          'Membership includes keys and 24/7 access to the clubhouse.',
          'One set of keys per desk. One set per band, held by the band’s point person, who is responsible for the band’s access.',
          'Keys may not be copied or lent, and members may not admit others for unaccompanied use of the space.',
          'Lost keys must be reported within 24 hours; the member covers re-keying costs if required.',
        ],
      },
      {
        heading: 'Guests',
        items: [
          'Guests are welcome while the member is present and remains with them.',
          'The member is responsible for their guests’ conduct and any damage they cause.',
          'Guests do not receive independent use of bookable facilities.',
        ],
      },
      {
        heading: 'House rules & conduct',
        items: [
          'The club’s house rules — including noise windows, parking, and etiquette — are part of this agreement.',
          'Repeated or serious violations are cause for immediate termination.',
        ],
      },
      {
        heading: 'Property & liability',
        items: [
          'Members furnish their own desk area and store personal property at their own risk.',
          'The club does not insure member property; personal gear coverage is recommended.',
          'The liability waiver is signed alongside this agreement and incorporated into it.',
        ],
      },
      {
        heading: 'Ending membership',
        items: [
          '30 days’ written notice from either side.',
          'The desk or band storage is cleared and all keys are returned by the last day of the final paid month.',
          'Departing members in good standing remain in the club’s system as associates.',
        ],
      },
    ],
  },
  {
    slug: 'liability-waiver',
    name: 'Liability waiver',
    kind: 'signed',
    summary: 'Signed by every member and associate before using the space.',
    sections: [
      {
        heading: 'Assumption of risk',
        body: [
          'The clubhouse is a working space with studio, workshop, and music equipment. The signer uses the facilities and equipment at their own risk, and agrees to ask for help before operating anything they don’t know how to use.',
        ],
      },
      {
        heading: 'Release',
        body: [
          'The signer releases the club and its leadership from claims for personal injury or property loss arising from ordinary use of the space, except where caused by gross negligence.',
        ],
      },
      {
        heading: 'Personal property',
        body: [
          'Anything brought into or stored at the clubhouse is at the owner’s risk.',
        ],
      },
      {
        heading: 'Media',
        body: [
          'The club photographs events and day-to-day life at the house for its own channels. The signer grants permission for their likeness to be used in these photos and videos.',
        ],
      },
    ],
  },
]
