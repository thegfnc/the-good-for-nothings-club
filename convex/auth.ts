import { Password } from '@convex-dev/auth/providers/Password'
import { convexAuth } from '@convex-dev/auth/server'

import type { MutationCtx } from './_generated/server'
import { ResendOTPPasswordReset } from './ResendOTPPasswordReset'

/** Bootstrap admins from the ADMIN_ALLOWED_EMAILS deployment env var. */
export function envAdminEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Email+password sign-in for /admin, with an emailed-code forgot-password
 * flow. There is no open sign-up: an account can only be created for an
 * email in ADMIN_ALLOWED_EMAILS (the bootstrap admins) or one with a
 * pending invite. Admins invite each other from /admin/users — the invite
 * creates the account with a random password, and the invitee sets their
 * own through the emailed-code flow (see convex/users.ts).
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({ reset: ResendOTPPasswordReset })],
  callbacks: {
    async createOrUpdateUser(genericCtx, args) {
      // The callback's ctx is typed against a generic data model; ours has
      // the adminInvites index.
      const ctx = genericCtx as unknown as MutationCtx
      if (args.existingUserId) {
        return args.existingUserId
      }
      const email =
        typeof args.profile.email === 'string'
          ? args.profile.email.toLowerCase()
          : ''
      if (!email) {
        throw new Error('Sign-up is disabled')
      }
      const invite = await ctx.db
        .query('adminInvites')
        .withIndex('by_email', q => q.eq('email', email))
        .first()
      if (invite) {
        await ctx.db.delete(invite._id)
        return ctx.db.insert('users', {
          email,
          ...(invite.name ? { name: invite.name } : {}),
          invitedBy: invite.invitedBy,
          invitedAt: invite._creationTime,
        })
      }
      if (!envAdminEmails().includes(email)) {
        throw new Error('Sign-up is disabled')
      }
      return ctx.db.insert('users', { email })
    },
  },
})
