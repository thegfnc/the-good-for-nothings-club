'use client'

import { useState, useTransition } from 'react'

import { refreshPublicContent } from '@/app/admin/content/actions'
import { Button } from '@/components/ui/Button'

/**
 * Public project and member pages serve cached Convex data for up to an
 * hour. Content is edited in Convex directly, so this is how an edit goes
 * live right away.
 */
export default function RefreshPublicSite() {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')

  return (
    <div className='flex items-center gap-3'>
      {status !== 'idle' && (
        <span className='font-sans text-xs text-black/60' role='status'>
          {status === 'done'
            ? 'Public pages will show the latest content.'
            : 'Refresh failed. Try again.'}
        </span>
      )}
      <Button
        variant='outline'
        size='sm'
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await refreshPublicContent()
              setStatus('done')
            } catch {
              setStatus('error')
            }
          })
        }
      >
        {pending ? 'Refreshing…' : 'Refresh public site'}
      </Button>
    </div>
  )
}
