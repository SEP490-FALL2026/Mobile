export interface Money {
  amount: string
  currency: string
}

export function formatMoney(value: Money | null | undefined, locale: string): string | undefined {
  if (!value || !/^[A-Z]{3}$/.test(value.currency) || !/^-?\d{1,12}(\.\d{1,4})?$/.test(value.amount)) return undefined
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(value.amount))
}
