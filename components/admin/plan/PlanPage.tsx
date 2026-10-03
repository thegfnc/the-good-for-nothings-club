import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Shared frame for the business-plan pages in the admin: the admin's
 * uppercase page title, an optional lead, then the sections.
 */
export function PlanPage({
  title,
  lead,
  children,
}: {
  title: string
  lead?: ReactNode
  children: ReactNode
}) {
  return (
    <div className='max-w-5xl'>
      <h1 className='font-sans text-2xl leading-none font-black tracking-[-0.02em] uppercase'>
        {title}
      </h1>
      {lead && (
        <p className='mt-3 max-w-2xl font-sans text-sm text-black/60'>{lead}</p>
      )}
      <div className='mt-8 flex flex-col gap-10'>{children}</div>
    </div>
  )
}

export function PlanSection({
  title,
  lead,
  children,
  className,
}: {
  title: string
  lead?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      <h2 className='mb-1 font-sans text-xs font-semibold tracking-[1px] text-black/60 uppercase'>
        {title}
      </h2>
      {lead && (
        <p className='mb-3 max-w-2xl font-sans text-sm text-black/80'>{lead}</p>
      )}
      {children}
    </section>
  )
}

/** One structural border; the interior stays light. */
export function PlanCard({
  title,
  meta,
  children,
  className,
}: {
  title?: ReactNode
  meta?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('border-2 border-black p-4 font-sans text-sm', className)}
    >
      {title && <h3 className='text-base leading-tight font-bold'>{title}</h3>}
      {meta && (
        <p className='mt-1 text-xs font-semibold tracking-[0.08em] text-black/60 uppercase'>
          {meta}
        </p>
      )}
      {children && (
        <div className={cn(title || meta ? 'mt-3' : '')}>{children}</div>
      )}
    </div>
  )
}

/** A menu-style line: label, dotted leader, value. */
export function LeaderRow({
  label,
  value,
  className,
}: {
  label: ReactNode
  value: ReactNode
  className?: string
}) {
  // Spans throughout so a row can sit inside a heading.
  return (
    <span className={cn('flex items-baseline gap-2 py-0.5', className)}>
      <span>{label}</span>
      <span
        aria-hidden
        className='min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-black/40'
      />
      <span className='font-semibold whitespace-nowrap tabular-nums'>
        {value}
      </span>
    </span>
  )
}

export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className='flex list-disc flex-col gap-1.5 pl-5 marker:text-black/40'>
      {items.map((item, i) => (
        <li key={i} className='leading-snug'>
          {item}
        </li>
      ))}
    </ul>
  )
}
