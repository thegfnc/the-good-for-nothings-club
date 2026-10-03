/**
 * Business model - how the club makes money and who else is out there.
 * Admin only. Ported from the business plan (v7.2) and kept current here.
 */

export const businessCopy = {
  lead: 'Use our facilities and services to create a workspace that fits your needs. What makes it more than a workspace is the network that comes with.',
  moreTitle: 'More than a room',
  moreCards: [
    {
      title: 'Our channels, your work',
      body: "Members can be featured in the club newsletter and across our social. Both go out on a regular cadence, and we ask what you'd like included before each one does.",
    },
    {
      title: 'A members only chatroom',
      body: 'An always-on Discord to organize, trade feedback, ask for a hand, and find collaborators across disciplines.',
    },
    {
      title: 'Who runs the club',
      body: "The founding members (Jason, Chris, Max, Matt) run the clubhouse day to day. On the public site, 'member' means a monthly renter — the founders are listed separately on the About page as the crew behind the club.",
    },
  ],
  joiningTitle: 'Joining',
  joiningBody:
    'Applications are open anytime but space is limited. Applicants join a waitlist and are accepted in waves as desks and band slots open up, with a tour first for associates and members. This keeps the space for people who are active in the club and using it regularly.',
  workTitle: 'How the revenue flows',
  workIntro:
    "When a paid project comes in, it's offered down the membership list by tenure — the longest-standing members get right of first refusal, and if they pass it moves to the next person.",
  splits: [
    {
      label: 'Hourly facilities fees',
      value: '50% to the club, 50% to the member working',
    },
    { label: 'Hourly assistant fees', value: '100% to the member assisting' },
    {
      label: 'Service work',
      value:
        '75% to the person doing the work · 25% to the club for admin + equipment',
    },
    { label: 'Consignment shop', value: '25% of net profit to the club' },
  ],
  compareTitle: 'How GFNC compares',
  compareIntro:
    'No nearby competitor bundles workspace, photo, recording, rehearsal, shared gear, and events under one roof, run by people embedded in the scene. À la carte lets each member assemble that bundle themselves.',
}

export type Competitor = {
  name: string
  url?: string
  model: string
  pricing: string
  gap: string
}

export const competitors: Competitor[] = [
  {
    name: 'Switchyards',
    url: 'https://www.switchyards.com/',
    model:
      'National "work club" chain — all flex seating, 24/7, curated; unlimited coffee, no meals, few quiet booths',
    pricing: '$129/mo flat',
    gap: 'No gear, studios, rehearsal, dedicated desks, or scene-embedded operators',
  },
  {
    name: 'Cinemaker',
    url: 'https://austinfilmschool.org/become-a-member',
    model: 'Equipment co-op, nonprofit, app-gated',
    pricing: '$165 / $265; Friends $25–50',
    gap: 'No desks, rehearsal, events, or retail',
  },
  {
    name: 'The Cathedral',
    url: 'https://thecathedralatx.com/',
    model: 'Event & gallery-led, for-profit',
    pricing: '$125 → $1,850',
    gap: 'No maker gear or studios',
  },
  {
    name: 'Photogroup',
    url: 'https://www.photogroupaustin.com/',
    model:
      'Photo/video studio rental + in-house gear, plus the PG Collective photographer membership; since 2011',
    pricing: 'Day rates + membership; by quote',
    gap: 'Photo/video only — no desks, rehearsal, recording, or events',
  },
  {
    name: 'Creative Collective ATX',
    url: 'https://creativecollectiveatx.com/',
    model:
      'Co-working + events and a membership community for female founders in East Austin',
    pricing: 'Membership; by quote',
    gap: 'No studios, rehearsal, recording, or maker gear',
  },
  {
    name: 'Bolm Arts',
    url: 'https://www.bolmarts.org/',
    model:
      'Nonprofit artist-run gallery + collective in East Austin — exhibitions, shows, and community events',
    pricing: 'Nonprofit; membership',
    gap: 'Exhibitions only — no studios, rehearsal, recording, or workspace',
  },
]
