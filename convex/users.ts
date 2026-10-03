import { createAccount, getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'
import { Resend } from 'resend'

import { internal } from './_generated/api'
import type { Id } from './_generated/dataModel'
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type ActionCtx,
} from './_generated/server'
import { requireUser } from './admin'
import { envAdminEmails } from './auth'

/**
 * Admin accounts: invite, list, resend, remove.
 *
 * Inviting creates the account straight away with a random password no one
 * knows, then emails a link to /admin/login?setup=<email>. That page runs
 * the existing emailed-code reset flow, so only someone who controls the
 * inbox can set a password and get in. Until they do, the admin shows as
 * "Invited" (no `lastSeenAt`).
 *
 * Admins seeded from ADMIN_ALLOWED_EMAILS can't be removed here — they
 * could sign straight back up. Take them out of the env var first.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** How often the admin shell may bump `lastSeenAt`. */
const SEEN_THROTTLE_MS = 10 * 60 * 1000

const normalizeEmail = (email: string) => email.trim().toLowerCase()

async function requireAdminAction(ctx: ActionCtx) {
  const userId = await getAuthUserId(ctx)
  const user =
    userId === null
      ? null
      : await ctx.runQuery(internal.users.getUser, { userId })
  if (userId === null || user === null) {
    throw new ConvexError('Not authenticated')
  }
  return { userId, user }
}

function siteUrl() {
  return (process.env.SITE_URL ?? 'https://thegoodfornothings.club').replace(
    /\/+$/,
    ''
  )
}

async function sendInviteEmail({
  email,
  inviterName,
}: {
  email: string
  inviterName: string
}) {
  const link = `${siteUrl()}/admin/login?setup=${encodeURIComponent(email)}`
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'GFNC Admin <hello@send.thegoodfornothings.club>',
    to: [email],
    replyTo: 'hello@thegoodfornothings.club',
    subject: `${inviterName} invited you to the GFNC admin`,
    text: [
      `${inviterName} invited you to help run the admin for The Good for Nothings Club.`,
      '',
      'Set up your account here:',
      link,
      '',
      "We'll email you an 8-digit code to confirm it's you, then you pick your password.",
      "If you weren't expecting this, you can ignore this email.",
    ].join('\n'),
  })
  if (error) {
    throw new ConvexError('Could not send the invite email')
  }
}

function randomSecret() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

export const getUser = internalQuery({
  args: { userId: v.id('users') },
  handler: (ctx, { userId }) => ctx.db.get(userId),
})

/** Records the invite so the auth callback lets this email sign up. */
export const prepareInvite = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    invitedBy: v.id('users'),
  },
  handler: async (ctx, { email, name, invitedBy }) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('email', q => q.eq('email', email))
      .first()
    if (existing) {
      throw new ConvexError(`${email} is already an admin`)
    }
    const stale = await ctx.db
      .query('adminInvites')
      .withIndex('by_email', q => q.eq('email', email))
      .collect()
    for (const invite of stale) await ctx.db.delete(invite._id)
    await ctx.db.insert('adminInvites', {
      email,
      ...(name ? { name } : {}),
      invitedBy,
    })
  },
})

/** Drops an invite whose account creation or email failed. */
export const discardInvite = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const invites = await ctx.db
      .query('adminInvites')
      .withIndex('by_email', q => q.eq('email', email))
      .collect()
    for (const invite of invites) await ctx.db.delete(invite._id)
  },
})

const displayName = (user: { name?: string; email?: string }) =>
  user.name || user.email || 'A GFNC admin'

export const invite = action({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId, user: inviter } = await requireAdminAction(ctx)
    const email = normalizeEmail(args.email)
    const name = args.name?.trim() || undefined
    if (!EMAIL_PATTERN.test(email)) {
      throw new ConvexError('Enter a valid email address')
    }

    await ctx.runMutation(internal.users.prepareInvite, {
      email,
      name,
      invitedBy: userId,
    })
    let created = false
    try {
      await createAccount(ctx, {
        provider: 'password',
        account: { id: email, secret: randomSecret() },
        profile: { email, ...(name ? { name } : {}) },
      })
      created = true
      await sendInviteEmail({ email, inviterName: displayName(inviter) })
    } catch (error) {
      // Leave no half-made invite behind: a created account stays (it's
      // listed as Invited and can be resent or removed), a failed one
      // takes its invite row with it.
      if (!created) {
        await ctx.runMutation(internal.users.discardInvite, { email })
      }
      throw error instanceof ConvexError
        ? error
        : new ConvexError(
            created
              ? 'Account created, but the invite email failed — try Resend'
              : 'Could not create the account'
          )
    }
  },
})

export const resendInvite = action({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const { user: inviter } = await requireAdminAction(ctx)
    const target = await ctx.runQuery(internal.users.getUser, { userId })
    if (!target?.email) {
      throw new ConvexError('That admin no longer exists')
    }
    if (target.lastSeenAt !== undefined) {
      throw new ConvexError(`${target.email} has already accepted`)
    }
    await sendInviteEmail({
      email: target.email,
      inviterName: displayName(inviter),
    })
  },
})

export const list = query({
  args: {},
  handler: async ctx => {
    const me = await requireUser(ctx)
    const envEmails = envAdminEmails()
    const users = await ctx.db.query('users').collect()
    const emailById = new Map<Id<'users'>, string | undefined>(
      users.map(user => [user._id, user.email])
    )
    return users
      .map(user => {
        const fromEnv = !!user.email && envEmails.includes(user.email)
        return {
          _id: user._id,
          email: user.email ?? '',
          name: user.name,
          status: user.lastSeenAt === undefined ? 'invited' : 'active',
          lastSeenAt: user.lastSeenAt,
          invitedAt: user.invitedAt ?? user._creationTime,
          invitedBy: user.invitedBy
            ? (emailById.get(user.invitedBy) ?? 'a removed admin')
            : undefined,
          isMe: user._id === me,
          fromEnv,
          removable: user._id !== me && !fromEnv,
        } as const
      })
      .sort((a, b) => a.email.localeCompare(b.email))
  },
})

/** Called by the admin shell; marks invites accepted and tracks activity. */
export const touch = mutation({
  args: {},
  handler: async ctx => {
    const userId = await requireUser(ctx)
    const user = await ctx.db.get(userId)
    const now = Date.now()
    if (!user?.lastSeenAt || now - user.lastSeenAt > SEEN_THROTTLE_MS) {
      await ctx.db.patch(userId, { lastSeenAt: now })
    }
  },
})

/**
 * Deletes an admin outright: sessions, refresh tokens, password account,
 * pending codes, then the user. Their open tabs lose access on the next
 * request (requireUser checks the user row still exists).
 */
export const remove = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const me = await requireUser(ctx)
    if (userId === me) {
      throw new ConvexError("You can't remove yourself")
    }
    const target = await ctx.db.get(userId)
    if (!target) return
    if (target.email && envAdminEmails().includes(target.email)) {
      throw new ConvexError(
        `${target.email} is in ADMIN_ALLOWED_EMAILS — remove it there first`
      )
    }

    const sessions = await ctx.db
      .query('authSessions')
      .withIndex('userId', q => q.eq('userId', userId))
      .collect()
    for (const session of sessions) {
      const tokens = await ctx.db
        .query('authRefreshTokens')
        .withIndex('sessionId', q => q.eq('sessionId', session._id))
        .collect()
      for (const token of tokens) await ctx.db.delete(token._id)
      await ctx.db.delete(session._id)
    }

    const accounts = await ctx.db
      .query('authAccounts')
      .withIndex('userIdAndProvider', q => q.eq('userId', userId))
      .collect()
    for (const account of accounts) {
      const codes = await ctx.db
        .query('authVerificationCodes')
        .withIndex('accountId', q => q.eq('accountId', account._id))
        .collect()
      for (const code of codes) await ctx.db.delete(code._id)
      await ctx.db.delete(account._id)
    }

    if (target.email) {
      const email = target.email
      const invites = await ctx.db
        .query('adminInvites')
        .withIndex('by_email', q => q.eq('email', email))
        .collect()
      for (const invite of invites) await ctx.db.delete(invite._id)
    }
    await ctx.db.delete(userId)
  },
})
