/**
 * Operations - house rules, where to take a meeting, and how to open and
 * close up. Admin only. The amenities list lives in data/facilities.ts
 * (the site publishes it) and the operations page reads it from there.
 */

export type HouseRule = {
  label: string
  points: string[]
}

export const houseRules: HouseRule[] = [
  {
    label: 'Parking',
    points: [
      '11am–7pm — park in the neighborhood (front lot is reserved for the vintage store)',
      'Before 11am and after 7pm — front lot is available for use',
      '15-min load-in out front, anytime',
    ],
  },
  {
    label: 'Photo studio',
    points: [
      '11am–7pm — keep sound to a reasonable volume while the vintage store is open',
      'Before 11am and after 7pm — no restrictions on sound',
    ],
  },
  {
    label: 'Band practice',
    points: [
      'Not permitted before 3pm',
      '3–6pm — coordinate with desk renters; sometimes available',
      'All doors should be closed during practice while the vintage store is open (11am–7pm)',
    ],
  },
  {
    label: 'Etiquette',
    points: [
      "Noise-cancelling headphones are highly encouraged — it's an open, shared space",
      'Smoke and vape outside, away from the building — cigarettes, cannabis, and vapes get pulled into the AC and pumped into the vintage store up front',
      "Leave it tidy — put things back where you found them so the next person doesn't have to search",
      'Report broken equipment as early as possible — it sucks to find out when you sit down to use it',
      'The space runs on trust. Treat everything with respect and help us keep this a zero theft space',
    ],
  },
]

export type MeetingSpot = {
  name: string
  availability?: string
}

/** No booking - first come, first served. */
export const meetingSpots: MeetingSpot[] = [
  { name: 'Main room', availability: 'one meeting at a time' },
  { name: 'Mixing control room', availability: "when it isn't booked" },
  { name: 'Electronics & guitar bench corner' },
  { name: 'Band practice room', availability: 'before 3pm' },
  { name: 'Outside by the garage', availability: 'weather permitting' },
  { name: 'Outside on the back patio', availability: 'weather permitting' },
]

export type RunbookStep = {
  label: string
  detail?: string
}

export const runbook: { title: string; steps: RunbookStep[] }[] = [
  {
    title: 'Opening',
    steps: [
      {
        label: 'Unlock the doors',
        detail:
          'There are three keys to open up the facilities, two for the outside gate and one for the inside doors.',
      },
      {
        label: 'Turn on lights',
        detail:
          'There are about ten light switches in the house — turn on the ones you need.',
      },
      {
        label: 'Set the thermostat',
        detail: 'Summer: cool to ~73°F. Winter: heat to ~67°F.',
      },
      {
        label: 'Open the blinds',
        detail:
          'Window & french doors in the main room + window in the mixing control room.',
      },
      {
        label: 'Brew some coffee (optional)',
        detail:
          'Coffee is available in the kitchen. Feel free to brew enough for yourself and others.',
      },
    ],
  },
  {
    title: 'Closing',
    steps: [
      {
        label: 'Ensure kitchen equipment is off',
        detail:
          'Turn off the stove, oven, and any other kitchen equipment you used. Ensure all candles are blown out.',
      },
      {
        label: 'Close the blinds',
        detail:
          'Window & french doors in the main room + window in the mixing control room.',
      },
      {
        label: 'Turn off lights + equipment',
        detail: 'Turn off light switches, lamps, and any equipment you used.',
      },
      {
        label: 'Set the thermostat for an empty house',
        detail:
          'Summer: 80°F. Winter: heat at 60°F. Use the weather for guidance.',
      },
      {
        label: 'Lock the doors',
        detail: 'Lock all three doors and both gate locks on the way out.',
      },
    ],
  },
]
