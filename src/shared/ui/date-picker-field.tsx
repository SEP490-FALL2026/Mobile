import { Feather } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { buildMonth, isDateAllowed, shiftMonth, todayIso } from '@/shared/lib/calendar'
import { formatApiDate } from '@/shared/lib/format-date'
import { mobileColors } from '@/shared/theme/colors'

interface DatePickerFieldProps {
  disabled?: boolean
  label: string
  /** Latest date that can be chosen, as YYYY-MM-DD. */
  max?: string
  /** Earliest date that can be chosen, as YYYY-MM-DD. */
  min?: string
  onChange: (value: string) => void
  placeholder: string
  /** The chosen date as YYYY-MM-DD, or an empty string for none. */
  value: string
}

/** A field that opens a small calendar to pick a date, so nobody has to type one. */
export function DatePickerField({ disabled, label, max, min, onChange, placeholder, value }: DatePickerFieldProps) {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const anchor = value || todayIso()
  const [view, setView] = useState({ year: Number(anchor.slice(0, 4)), month: Number(anchor.slice(5, 7)) - 1 })
  const today = todayIso()
  const weeks = useMemo(() => buildMonth(view.year, view.month), [view])
  const monthTitle = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(view.year, view.month, 1))
  )
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(i18n.language, { weekday: 'short', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2024, 0, 1 + index)) // 2024-01-01 is a Monday
    )
  )
  const display = formatApiDate(value, i18n.language)

  function show() {
    if (disabled) return
    const start = value || today
    setView({ year: Number(start.slice(0, 4)), month: Number(start.slice(5, 7)) - 1 })
    setOpen(true)
  }
  function choose(iso: string) {
    onChange(iso)
    setOpen(false)
  }

  return (
    <>
      <Pressable
        accessibilityHint={t('common.datePicker.title')}
        accessibilityLabel={label}
        accessibilityRole='button'
        accessibilityState={{ disabled: !!disabled }}
        accessibilityValue={{ text: display ?? placeholder }}
        disabled={disabled}
        onPress={show}
        style={[styles.field, disabled && styles.disabled]}
      >
        <Feather
          accessibilityElementsHidden
          color={mobileColors.primaryInk}
          importantForAccessibility='no'
          name='calendar'
          size={18}
        />
        <Text style={[styles.value, !display && styles.placeholder]}>{display ?? placeholder}</Text>
        {value && !disabled ? (
          <Pressable
            accessibilityLabel={t('common.datePicker.clear')}
            accessibilityRole='button'
            hitSlop={10}
            onPress={() => onChange('')}
            style={styles.clear}
          >
            <Feather
              accessibilityElementsHidden
              color={mobileColors.muted}
              importantForAccessibility='no'
              name='x'
              size={16}
            />
          </Pressable>
        ) : null}
      </Pressable>

      <Modal animationType='fade' onRequestClose={() => setOpen(false)} transparent visible={open}>
        <View style={styles.backdrop}>
          <Pressable
            accessibilityLabel={t('common.datePicker.close')}
            accessibilityRole='button'
            onPress={() => setOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View accessibilityViewIsModal style={styles.sheet}>
            <Text accessibilityRole='header' style={styles.title}>
              {label}
            </Text>
            <View style={styles.monthRow}>
              <Pressable
                accessibilityLabel={t('common.datePicker.previousMonth')}
                accessibilityRole='button'
                onPress={() => setView((current) => shiftMonth(current.year, current.month, -1))}
                style={styles.navButton}
              >
                <Feather
                  accessibilityElementsHidden
                  color={mobileColors.primaryInk}
                  importantForAccessibility='no'
                  name='chevron-left'
                  size={20}
                />
              </Pressable>
              <Text accessibilityLiveRegion='polite' style={styles.month}>
                {monthTitle}
              </Text>
              <Pressable
                accessibilityLabel={t('common.datePicker.nextMonth')}
                accessibilityRole='button'
                onPress={() => setView((current) => shiftMonth(current.year, current.month, 1))}
                style={styles.navButton}
              >
                <Feather
                  accessibilityElementsHidden
                  color={mobileColors.primaryInk}
                  importantForAccessibility='no'
                  name='chevron-right'
                  size={20}
                />
              </Pressable>
            </View>

            <View style={styles.week}>
              {weekdays.map((name) => (
                <Text key={name} style={styles.weekday}>
                  {name}
                </Text>
              ))}
            </View>
            {weeks.map((week) => (
              <View key={week[0].iso} style={styles.week}>
                {week.map((cell) => {
                  const allowed = isDateAllowed(cell.iso, min, max)
                  const selected = cell.iso === value
                  return (
                    <Pressable
                      accessibilityLabel={formatApiDate(cell.iso, i18n.language) ?? cell.iso}
                      accessibilityRole='button'
                      accessibilityState={{ disabled: !allowed, selected }}
                      disabled={!allowed}
                      key={cell.iso}
                      onPress={() => choose(cell.iso)}
                      style={[
                        styles.day,
                        selected && styles.daySelected,
                        cell.iso === today && !selected && styles.dayToday
                      ]}
                      testID={`day-${cell.iso}`}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          !cell.inMonth && styles.dayOutside,
                          !allowed && styles.dayDisabled,
                          selected && styles.dayTextSelected
                        ]}
                      >
                        {cell.day}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            ))}

            <View style={styles.footer}>
              <Pressable
                accessibilityRole='button'
                disabled={!value}
                onPress={() => choose('')}
                style={[styles.footerButton, !value && styles.disabled]}
              >
                <Text style={styles.footerText}>{t('common.datePicker.clear')}</Text>
              </Pressable>
              <Pressable
                accessibilityRole='button'
                disabled={!isDateAllowed(today, min, max)}
                onPress={() => choose(today)}
                style={[styles.footerButton, !isDateAllowed(today, min, max) && styles.disabled]}
              >
                <Text style={styles.footerText}>{t('common.datePicker.today')}</Text>
              </Pressable>
              <Pressable accessibilityRole='button' onPress={() => setOpen(false)} style={styles.footerPrimary}>
                <Text style={styles.footerPrimaryText}>{t('common.datePicker.close')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(36, 28, 24, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  clear: { alignItems: 'center', height: 32, justifyContent: 'center', width: 32 },
  day: { alignItems: 'center', borderRadius: 12, flex: 1, height: 42, justifyContent: 'center', margin: 1 },
  dayDisabled: { opacity: 0.3 },
  dayOutside: { color: mobileColors.muted },
  daySelected: { backgroundColor: mobileColors.primary },
  dayText: { color: mobileColors.foreground, fontSize: 14, fontWeight: '600' },
  dayTextSelected: { color: mobileColors.white },
  dayToday: { borderColor: mobileColors.primary, borderWidth: 1 },
  disabled: { opacity: 0.4 },
  field: {
    alignItems: 'center',
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 12
  },
  footer: { flexDirection: 'row', gap: 8, marginTop: 8 },
  footerButton: {
    alignItems: 'center',
    borderColor: mobileColors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44
  },
  footerPrimary: {
    alignItems: 'center',
    backgroundColor: mobileColors.primary,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44
  },
  footerPrimaryText: { color: mobileColors.white, fontSize: 13, fontWeight: '700' },
  footerText: { color: mobileColors.primaryInk, fontSize: 13, fontWeight: '700' },
  month: {
    color: mobileColors.foreground,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  monthRow: { alignItems: 'center', flexDirection: 'row' },
  navButton: {
    alignItems: 'center',
    backgroundColor: mobileColors.primarySoft,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  placeholder: { color: mobileColors.muted },
  sheet: {
    backgroundColor: mobileColors.background,
    borderRadius: 20,
    gap: 6,
    maxWidth: 380,
    padding: 16,
    width: '100%'
  },
  title: { color: mobileColors.foreground, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  value: { color: mobileColors.foreground, flex: 1, fontSize: 15 },
  week: { flexDirection: 'row' },
  weekday: {
    color: mobileColors.muted,
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 6,
    textAlign: 'center'
  }
})
