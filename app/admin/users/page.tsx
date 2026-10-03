'use client'

import { Authenticated, useAction, useMutation, useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fieldLabelClassName } from '@/components/ui/fieldStyles'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof ConvexError && typeof error.data === 'string'
    ? error.data
    : fallback

const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

function InviteForm() {
  const invite = useAction(api.users.invite)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null
  )

  return (
    <form
      className='border-2 border-black p-4'
      onSubmit={async event => {
        event.preventDefault()
        setSubmitting(true)
        setNotice(null)
        try {
          await invite({ email, name: name || undefined })
          setNotice({ ok: true, text: `Invite sent to ${email.trim()}.` })
          setEmail('')
          setName('')
        } catch (error) {
          setNotice({
            ok: false,
            text: errorMessage(error, 'Could not send the invite.'),
          })
        } finally {
          setSubmitting(false)
        }
      }}
    >
      <h2 className='font-sans text-xs font-semibold tracking-[1px] text-black/60 uppercase'>
        Invite an admin
      </h2>
      <div className='mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end'>
        <label className='flex flex-col gap-1'>
          <span className={fieldLabelClassName}>Email</span>
          <Input
            type='email'
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
        </label>
        <label className='flex flex-col gap-1'>
          <span className={fieldLabelClassName}>Name (optional)</span>
          <Input value={name} onChange={event => setName(event.target.value)} />
        </label>
        <Button type='submit' disabled={submitting}>
          {submitting ? 'Sending…' : 'Send invite'}
        </Button>
      </div>
      <p className='mt-3 font-sans text-xs text-black/60'>
        They get an email with a setup link. Confirming takes an 8-digit code
        sent to that inbox, so only they can finish it.
      </p>
      {notice && (
        <p
          className={cn(
            'mt-2 font-sans text-sm',
            notice.ok ? 'text-green-700' : 'text-red-600'
          )}
        >
          {notice.text}
        </p>
      )}
    </form>
  )
}

function RowActions({
  userId,
  email,
  status,
  removable,
  fromEnv,
}: {
  userId: Id<'users'>
  email: string
  status: 'invited' | 'active'
  removable: boolean
  fromEnv: boolean
}) {
  const resend = useAction(api.users.resendInvite)
  const remove = useMutation(api.users.remove)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const run = async (action: () => Promise<unknown>, done: string) => {
    setBusy(true)
    setMessage(null)
    try {
      await action()
      setMessage(done)
    } catch (error) {
      setMessage(errorMessage(error, 'Something went wrong.'))
    } finally {
      setBusy(false)
    }
  }

  const buttonClassName =
    'font-sans text-xs font-semibold tracking-[0.08em] uppercase underline underline-offset-2 hover:text-black disabled:opacity-40'

  return (
    <div className='flex flex-col items-end gap-1'>
      <div className='flex gap-3 text-black/60'>
        {status === 'invited' && (
          <button
            type='button'
            disabled={busy}
            className={buttonClassName}
            onClick={() => run(() => resend({ userId }), 'Invite resent.')}
          >
            Resend
          </button>
        )}
        {removable ? (
          <button
            type='button'
            disabled={busy}
            className={cn(buttonClassName, 'text-red-700 hover:text-red-900')}
            onClick={() => {
              if (window.confirm(`Remove ${email} from the admin?`)) {
                run(() => remove({ userId }), 'Removed.')
              }
            }}
          >
            {status === 'invited' ? 'Revoke' : 'Remove'}
          </button>
        ) : (
          fromEnv && (
            <span
              className='font-sans text-[11px] text-black/40'
              title='Seeded from ADMIN_ALLOWED_EMAILS on the Convex deployment. Remove it there to remove this admin.'
            >
              Env admin
            </span>
          )
        )}
      </div>
      {message && (
        <span className='font-sans text-xs text-black/60'>{message}</span>
      )}
    </div>
  )
}

function Admins() {
  const admins = useQuery(api.users.list)

  return (
    <div className='max-w-4xl'>
      <h1 className='font-sans text-2xl leading-none font-black tracking-[-0.02em] uppercase'>
        Admins
      </h1>
      <p className='mt-3 font-sans text-sm text-black/60'>
        Everyone here can see and edit inquiries and read the plan.
      </p>

      <div className='mt-6'>
        <InviteForm />
      </div>

      <div className='mt-8 overflow-x-auto'>
        {admins === undefined ? (
          <p className='font-sans text-sm text-black/60'>Loading…</p>
        ) : (
          <table className='w-full font-sans text-sm'>
            <thead>
              <tr className='border-b-2 border-black text-left tracking-[1px] uppercase'>
                <th className='py-2 pr-4'>Admin</th>
                <th className='py-2 pr-4'>Status</th>
                <th className='py-2 pr-4'>Added</th>
                <th className='py-2' />
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr
                  key={admin._id}
                  className='border-b border-black/20 align-top'
                >
                  <td className='py-3 pr-4'>
                    <div className='font-bold'>
                      {admin.name || admin.email}
                      {admin.isMe && (
                        <span className='ml-2 border border-black px-1 text-xs uppercase'>
                          you
                        </span>
                      )}
                    </div>
                    {admin.name && (
                      <div className='text-black/60'>{admin.email}</div>
                    )}
                  </td>
                  <td className='py-3 pr-4'>
                    {admin.status === 'active' ? (
                      <>
                        <div>Active</div>
                        {admin.lastSeenAt && (
                          <div className='text-xs text-black/60'>
                            Last seen {formatDate(admin.lastSeenAt)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className='text-black/60'>Invited · pending</div>
                    )}
                  </td>
                  <td className='py-3 pr-4 whitespace-nowrap'>
                    <div>{formatDate(admin.invitedAt)}</div>
                    {admin.invitedBy && (
                      <div className='text-xs text-black/60'>
                        by {admin.invitedBy}
                      </div>
                    )}
                  </td>
                  <td className='py-3 text-right'>
                    <RowActions
                      userId={admin._id}
                      email={admin.email}
                      status={admin.status}
                      removable={admin.removable}
                      fromEnv={admin.fromEnv}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <Authenticated>
      <Admins />
    </Authenticated>
  )
}
