// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  enabled: process.env.VERCEL_ENV !== 'development',

  dsn: 'https://b09e651f10614ec57d486de1b4422648@o4506369040187392.ingest.us.sentry.io/4507098361430016',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: process.env.NODE_ENV === 'development',
})
