'use client'

import { useState } from 'react'

import {
  calculatorTotals,
  formatMoney,
  lineTotal,
  type CalculatorDefaults,
  type IncomeLine,
} from '@/lib/plan/money'
import { cn } from '@/lib/utils'

/** Non-negative number from an input; blanks and junk read as 0. */
const toAmount = (raw: string) => {
  const n = Number(raw)
  return Number.isFinite(n) ? Math.max(0, n) : 0
}

const inputClassName =
  'w-full border border-black/30 bg-white px-2 py-1 text-right font-sans text-sm tabular-nums focus:border-black focus:outline-none'

function NumberInput({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (value: number) => void
  label: string
}) {
  return (
    <input
      type='number'
      min={0}
      inputMode='decimal'
      aria-label={label}
      className={inputClassName}
      value={value}
      onChange={event => onChange(toAmount(event.target.value))}
    />
  )
}

function Block({
  title,
  total,
  children,
}: {
  title: string
  total?: number
  children: React.ReactNode
}) {
  return (
    <div className='border-2 border-black p-4'>
      <div className='mb-2 flex items-baseline justify-between'>
        <h3 className='text-base font-bold'>{title}</h3>
        {total !== undefined && (
          <span className='text-sm font-semibold tabular-nums'>
            {formatMoney(total)} / mo
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function LinesTable({
  lines,
  qtyLabel,
  onChange,
}: {
  lines: IncomeLine[]
  qtyLabel: string
  onChange: (lines: IncomeLine[]) => void
}) {
  const update = (id: string, patch: Partial<IncomeLine>) =>
    onChange(lines.map(line => (line.id === id ? { ...line, ...patch } : line)))

  return (
    <div className='grid grid-cols-[1fr_88px_72px] items-center gap-x-2 gap-y-1.5'>
      <span className='text-[11px] font-semibold tracking-[0.08em] text-black/50 uppercase'>
        Item
      </span>
      <span className='text-right text-[11px] font-semibold tracking-[0.08em] text-black/50 uppercase'>
        Rate $
      </span>
      <span className='text-right text-[11px] font-semibold tracking-[0.08em] text-black/50 uppercase'>
        {qtyLabel}
      </span>
      {lines.map(line => (
        <div key={line.id} className='contents'>
          <span className='leading-tight'>
            {line.label}
            {line.potential && (
              <span className='ml-1.5 text-[10px] font-semibold tracking-[0.08em] text-black/50 uppercase'>
                potential
              </span>
            )}
          </span>
          <NumberInput
            label={`${line.label} rate`}
            value={line.rate}
            onChange={rate => update(line.id, { rate })}
          />
          <NumberInput
            label={`${line.label} ${qtyLabel}`}
            value={line.qty}
            onChange={qty => update(line.id, { qty })}
          />
        </div>
      ))}
    </div>
  )
}

function Ledger({
  label,
  value,
  strong,
  colored,
}: {
  label: string
  value: number
  strong?: boolean
  colored?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between py-1.5',
        strong
          ? 'border-b-2 border-black font-bold'
          : 'border-b border-black/15 text-black/70'
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'tabular-nums',
          colored && (value >= 0 ? 'text-green-700' : 'text-red-700')
        )}
      >
        {formatMoney(value)}
      </span>
    </div>
  )
}

export default function Calculator({
  defaults,
  footnote,
}: {
  defaults: CalculatorDefaults
  footnote: string
}) {
  const [costs, setCosts] = useState(defaults.costs)
  const [holds, setHolds] = useState(defaults.holds)
  const [hourly, setHourly] = useState(defaults.hourly)
  const [services, setServices] = useState(defaults.services)
  const [storeSales, setStoreSales] = useState(0)

  const totals = calculatorTotals({
    costs,
    holds,
    hourly,
    services,
    storeSales,
  })
  const reset = () => {
    setCosts(defaults.costs)
    setHolds(defaults.holds)
    setHourly(defaults.hourly)
    setServices(defaults.services)
    setStoreSales(0)
  }

  return (
    <div className='grid items-start gap-6 font-sans text-sm lg:grid-cols-[1.15fr_0.85fr]'>
      <div className='flex flex-col gap-4'>
        <h3 className='text-xs font-semibold tracking-[1px] text-black/60 uppercase'>
          Money out
        </h3>
        <Block title='Monthly costs' total={totals.costs}>
          <div className='grid grid-cols-[1fr_88px] items-center gap-x-2 gap-y-1.5'>
            {costs.map(cost => (
              <div key={cost.id} className='contents'>
                <span>{cost.label}</span>
                <NumberInput
                  label={cost.label}
                  value={cost.amount}
                  onChange={amount =>
                    setCosts(
                      costs.map(c => (c.id === cost.id ? { ...c, amount } : c))
                    )
                  }
                />
              </div>
            ))}
          </div>
        </Block>

        <h3 className='mt-2 text-xs font-semibold tracking-[1px] text-black/60 uppercase'>
          Money in
        </h3>
        <Block title='Monthly holds' total={lineTotal(holds)}>
          <LinesTable lines={holds} qtyLabel='Holders' onChange={setHolds} />
        </Block>
        <Block title='Hourly bookings' total={lineTotal(hourly)}>
          <LinesTable lines={hourly} qtyLabel='Hrs / mo' onChange={setHourly} />
        </Block>
        <Block title='Services & projects' total={lineTotal(services)}>
          <LinesTable
            lines={services}
            qtyLabel='Jobs / mo'
            onChange={setServices}
          />
        </Block>
        <Block title='Online store' total={storeSales}>
          <div className='grid grid-cols-[1fr_88px] items-center gap-x-2'>
            <span>The club’s cut (25% of net)</span>
            <NumberInput
              label='Online store revenue to the club'
              value={storeSales}
              onChange={setStoreSales}
            />
          </div>
        </Block>
      </div>

      <div className='lg:sticky lg:top-8'>
        <div className='border-2 border-black p-5'>
          <div className='text-xs font-semibold tracking-[1px] text-black/60 uppercase'>
            {totals.net >= 0 ? 'Monthly surplus' : 'Monthly shortfall'}
          </div>
          <div
            className={cn(
              'mt-1 text-[40px] leading-none font-black tracking-[-0.02em] tabular-nums',
              totals.net >= 0 ? 'text-green-700' : 'text-red-700'
            )}
          >
            {formatMoney(totals.net)}
            <span className='text-lg font-bold'> / mo</span>
          </div>
          <div className='mt-4'>
            <Ledger label='Monthly holds' value={totals.holds} />
            <Ledger label='Hourly bookings' value={totals.hourly} />
            <Ledger label='Services & projects' value={totals.services} />
            <Ledger label='Online store' value={totals.store} />
            <Ledger label='Income' value={totals.income} strong />
            <Ledger label='Costs' value={-totals.costs} />
            <Ledger label='Net' value={totals.net} strong colored />
          </div>
          <button
            type='button'
            onClick={reset}
            className='mt-4 text-xs font-semibold tracking-[0.08em] text-black/60 uppercase underline hover:text-black'
          >
            Reset to today
          </button>
        </div>
        <p className='mt-3 text-xs text-black/60'>{footnote}</p>
      </div>
    </div>
  )
}
