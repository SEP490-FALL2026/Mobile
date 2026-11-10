import { fireEvent, render } from '@testing-library/react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { setAppLanguage } from '@/shared/i18n/i18n'
import { todayIso } from '@/shared/lib/calendar'

import { DatePickerField } from './date-picker-field'

function Harness({ min, max, initial = '' }: { min?: string; max?: string; initial?: string }) {
  const { t } = useTranslation()
  const [value, setValue] = useState(initial)
  return (
    <DatePickerField
      label={t('manager.group.endDate')}
      max={max}
      min={min}
      onChange={setValue}
      placeholder={t('manager.group.endDatePlaceholder')}
      value={value}
    />
  )
}

beforeEach(async () => {
  await setAppLanguage('vi', false)
})

test('shows the placeholder, opens a calendar and fills the field from a tapped day', async () => {
  const today = todayIso()
  const screen = await render(<Harness />)
  screen.getByText('Chọn ngày (không bắt buộc)')
  await fireEvent.press(screen.getByLabelText('Dùng đến ngày'))
  await fireEvent.press(screen.getByTestId(`day-${today}`))
  expect(screen.queryByText('Chọn ngày (không bắt buộc)')).toBeNull()
  expect(screen.getByLabelText('Dùng đến ngày').props.accessibilityValue.text).not.toBe('Chọn ngày (không bắt buộc)')
})

test('does not let a day outside the allowed range be chosen', async () => {
  const today = todayIso()
  const screen = await render(<Harness min={today} />)
  await fireEvent.press(screen.getByLabelText('Dùng đến ngày'))
  // The day before today is only on screen when today is not the first day of the shown month.
  const yesterday = new Date(`${today}T00:00:00Z`)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const before = screen.queryByTestId(`day-${yesterday.toISOString().slice(0, 10)}`)
  if (before) {
    await fireEvent.press(before)
    expect(screen.getByText('Chọn ngày (không bắt buộc)')).toBeTruthy()
  }
  await fireEvent.press(screen.getByText('Hôm nay'))
  expect(screen.queryByText('Chọn ngày (không bắt buộc)')).toBeNull()
})

test('can clear a chosen date', async () => {
  const screen = await render(<Harness initial={todayIso()} />)
  expect(screen.queryByText('Chọn ngày (không bắt buộc)')).toBeNull()
  await fireEvent.press(screen.getByLabelText('Xóa ngày'))
  screen.getByText('Chọn ngày (không bắt buộc)')
})

test('moves between months', async () => {
  const screen = await render(<Harness />)
  await fireEvent.press(screen.getByLabelText('Dùng đến ngày'))
  await fireEvent.press(screen.getByLabelText('Tháng sau'))
  await fireEvent.press(screen.getByLabelText('Tháng trước'))
  expect(screen.getByTestId(`day-${todayIso()}`)).toBeTruthy()
})
