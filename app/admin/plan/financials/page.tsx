import Calculator from '@/components/admin/plan/Calculator'
import { PlanPage } from '@/components/admin/plan/PlanPage'
import { financialsCopy } from '@/data/plan/financials'
import { calculatorDefaults } from '@/lib/plan/calculator'

export const metadata = { title: 'Financials' }

export default function FinancialsPage() {
  return (
    <PlanPage title='Financials' lead={financialsCopy.lead}>
      <Calculator
        defaults={calculatorDefaults()}
        footnote={financialsCopy.footnote}
      />
    </PlanPage>
  )
}
