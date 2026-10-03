/**
 * Plan history - one entry per plan version, newest first. Admin only.
 *
 * Versions 2.0-7.2 were written in the standalone business-plan repo and
 * are kept verbatim; never retro-edit an entry to new prices. Price
 * changes get an entry here (with the intake/gap math) before anyone
 * quotes the new number.
 */

export type PlanVersion = {
  version: string
  /** YYYY-MM-DD */
  date: string
  title: string
  changes: string[]
}

export const planVersion = '8.0'

export const changelog: PlanVersion[] = [
  {
    version: '8.0',
    date: '2026-10-03',
    title: 'Folded into the admin',
    changes: [
      'Moved the plan from its own site (thegfnc-business-plan) into the admin at /admin/plan. Public facts — facility names, descriptions, quantities, services, tiers, events, amenities — are now read straight from the site’s data files, so the v7.2 plan↔site mapping and the manual sync check are retired: there is nothing left to drift. The plan’s copies of the Facilities, Services, Membership, and Events pages are gone; the public pages are the reference.',
      'Prices came off the public site in September (the Aug 25 biz-dev call: prospects should start a conversation, not bounce on a number), so the new Rates page is now the only place prices live. Rates are keyed by the site’s slugs and a test fails if a public offering has no price.',
      'Recorded the July 20 rate raise that shipped site-first, against v7.2’s pricing carve-out: permanent desk $400 → $450/mo and band slot $200 → $250/mo. At today’s three desks and one band, intake would be $1,600 against ~$2,125 in costs — a gap of about −$525 (was −$725). $450 of that is the founder’s own desk, so outside money is $1,150 and the external-cash gap is about −$975. Unconfirmed: whether existing holders moved to the new rates — v7.2’s billing check hasn’t been repeated.',
      'Synced everything else the site changed since v7.2: permanent desks cut from 8 to 4, a monthly Open House added (first Thursday, 7 PM) ahead of Works in Progress and Off Genre Jam, “Sound system + operator” renamed “Sound system”, the shop renamed the Online Store (the site now says “a percentage of each sale”; the split stays 25% of net), and the Rental agreement’s rent line now reads from the price list.',
    ],
  },
  {
    version: '7.2',
    date: '2026-07-16',
    title: 'Public-site sync',
    changes: [
      "Synced the plan to the shipped public site (thegoodfornothings.club), which is now the source of truth for everything it publishes — the site iterated on this plan's data and the plan was behind.",
      "Adopted the site's live pricing: permanent desk $400/mo (superseding v7.0's $275 launch-wave price — the '$400 desk' floated and deferred in the v6.0 session is, in effect, shipped) and band slot $200/mo. The founder confirmed every current holder pays the advertised rates, so intake on the held units rises from $975 to $1,400 — real billing, not list price — narrowing the stated monthly gap from about −$1,150 to about −$725. Keeping v7.0's both-figures honesty: $400 of that intake is the founder's own desk, so outside money is $1,000/mo and the external-cash gap is about −$1,125.",
      'Renamed the recording control room to the mixing control room and the membership agreement to the rental agreement, added tier price lines and the three-step joining flow, replaced Accountability Hour with Works in Progress (second Thursday), moved Off Genre Jam to third Thursday, pointed the consignment shop at members and associates, and swapped milk for creamer.',
      'Documented the plan↔site file mapping and a recurring sync check so the two repos stop diverging silently.',
    ],
  },
  {
    version: '7.1',
    date: '2026-07-07',
    title: 'Renamed the plan',
    changes: [
      "Retired the 'Co-op Build Hub' working title in favor of 'Clubhouse plan' — the venture is an LLC with rental memberships, not a cooperative, and the plan's own copy has always called the space the clubhouse. Updated the header, page title, social card, and API index to match.",
    ],
  },
  {
    version: '7.0',
    date: '2026-06-12',
    title: 'House Operations',
    changes: [
      "Mapped six quiet places to take a meeting on the Facilities page — the band room before 3 PM, the control room when it's not booked, the electronics bench corner, the main room one meeting at a time, and two outdoor spots (garage side and back patio) — no booking, first come, first served.",
      'Wrote down the opening and closing runbook (four locks, only the lights you need, occupied setpoints ~73°F/~67°F, blinds; closing adds the gear-off-at-the-strip and candles/kitchen sweep, then 80°F/60°F to protect the equipment and pipes) and logged it as the first documented system against the key-person and shared-space-ops risks.',
      'Added etiquette to the House rules: leave it tidy, report broken equipment early, treat everything with respect and own it if you break it, and protect the zero-theft-to-date trust streak.',
      "Cut the permanent desk from $300 to $275/mo as the opening price for the first gated wave — a real $75/mo less intake (all three desks billed $300), honestly widening the monthly gap to about −$1,150 — and corrected the Money page's stale ~$1,950 cost callout to the Calculator's real ~$2,125 total.",
    ],
  },
  {
    version: '6.0',
    date: '2026-06-08',
    title: 'Running the Space',
    changes: [
      "Named the operations gap honestly on the key-person risk: the space can't afford to salary an operator (even maxed out it nets ~$1k/mo), rent credits are ruled out, and how day-to-day operators get compensated is an open question — recorded, not solved.",
      "Added a shared-space operations risk — turnover, abandoned gear, and lock/key management — drawn from a collaborator's rehearsal-space experience, with near-term mitigations (small ~4-band base, a gear custody policy) and keypad access as the direction.",
      "Logged the Matt Schaefer session as a field note, including the first outside counter-point that the $300 desk is 'about right' — challenging, not erasing, the willingness-to-pay risk.",
      'Corrected stale intake figures in the risk register to the $300 desk price (3 desks + 1 band ≈ $1,050/mo vs ~$2,125 cost), so the Risks and Calculator pages tell the same story; everything else floated in the session (a $3,000 event package, a $400 non-friend desk, a scheduling tool) was deferred, not built.',
    ],
  },
  {
    version: '5.0',
    date: '2026-06-08',
    title: 'People & Amenities',
    changes: [
      'Added member amenities (coffee, water, seltzer, snacks) as a stocked perk on the Facilities page, and budgeted the cost in the Calculator.',
      'Reframed membership around paying and contributing — not friendship — opening the door to a broader community while keeping the right to say no.',
      "Refined facilities: couches→more desks framed as capacity-if-demand (not guaranteed revenue), the darkroom reframed as 'just needs a door,' and an optional assistant added to the recording, darkroom, and electronics benches.",
      'Added an event-planning service and enriched the Switchyards comparison; logged the willingness-to-pay concern on the $300 desk and named a gated paid wave — not service revenue — as the real de-risk.',
    ],
  },
  {
    version: '4.0',
    date: '2026-06-06',
    title: 'Grounded the hub in reality; real routes + mobile',
    changes: [
      "Separated what exists today from what's aspirational: a status field across the offerings, facility data rewritten to the real space (one band room, one photo studio, one recording control room — no flex desks), and the made-up hero metrics removed.",
      "Added a public-ready Services menu and an Events calendar; reworked the Business Model and Financials pages around the current space and corrected the Calculator to today's reality.",
      "De-slopped the copy throughout and logged the founders' strategy session as a field note feeding the risk register.",
      'Moved off hash tabs to real routes (refresh, back button, and shareable links all work), added a mobile-friendly header (hamburger drawer + bottom nav, auto-hide), and integrated Vercel Web Analytics.',
    ],
  },
  {
    version: '3.0',
    date: '2026-06-01',
    title: 'Simplified to à-la-carte; restructured into a guided plan',
    changes: [
      'Killed the six tiers, the credits system, and overage/public-rate math: pricing is now a flat à-la-carte rate card — desks and band rooms are monthly holds; recording and photo studios book hourly; equipment is per-rental; the main space is event-rental.',
      'Dropped founding/intro pricing entirely (revisit only if funded), and reframed access as a gated waitlist with accepted waves — not open to the public, Cinemaker-style.',
      'Added a Facilities pillar (the clubhouse and how you book/access each room) sourced from the same data as the rate card, so each section is a single source of truth.',
      "Restructured the firehose 'Business Plan' tab into a narrative spine that increases fidelity as you click in: Overview → The Space → The Model → The Money → The Risks → The Plan → Field Notes.",
      'Added an honest, upfront Risk register + viability verdict (operationalizing the adversarial review) and a Field Notes section to capture tour interviews and feed feedback back into the risks.',
      'Rewired the Calculator off the dead tier model to à-la-carte inputs, with break-even read in recurring-holder terms.',
    ],
  },
  {
    version: '2.2',
    date: '2026-05-31',
    title: 'Founder pay reframed',
    changes: [
      'Owner pay is no longer a fixed day-one salary: owners take at most a very modest stipend at launch.',
      'Real compensation comes through profit-sharing as a cash buffer builds; a full operator salary is a long-term goal, not a launch obligation.',
      'Threaded through the exec summary, legal structure, financial plan, and verdict; the live Calculator now frames any surplus as a profit-share & reserve pool.',
    ],
  },
  {
    version: '2.1',
    date: '2026-05-31',
    title: 'Brand events & AV production added',
    changes: [
      'Added a fifth ancillary revenue stream: paid brand events & AV production (photo booth, projectors, sound, lighting).',
      "It's the one stream with already-proven demand — GFNC has been hired and paid for it — and it travels off-site, so it isn't capped by the building's calendar.",
      'Modeled live in the Calculator and woven into the funding and verdict sections as a de-risking asset.',
    ],
  },
  {
    version: '2.0',
    date: '2026-05-01',
    title: 'Tiers, credits & ancillary streams',
    changes: [
      'Reworked pricing into workspace tiers plus a facility-credits system (included hours + discounted overage + sellable excess).',
      'Introduced three ancillary revenue streams: a coffee tenant, a member retail/gallery program, and public studio rentals.',
      'Updated software strategy (buy the commodity, build the differentiator) and broker strategy throughout.',
    ],
  },
]
