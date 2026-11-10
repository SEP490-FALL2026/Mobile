import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import type { RequestablePlanPageResponseDtoDataItemsItem } from '@/shared/api/generated/model/requestable-software'
import { todayIso } from '@/shared/lib/calendar'
import { formatApiDate } from '@/shared/lib/format-date'
import { mobileColors } from '@/shared/theme/colors'
import { DatePickerField } from '@/shared/ui/date-picker-field'

import { useGroupRequest } from '../hooks/use-group-request'
import { formatMoney } from '../model/format'

export function GroupRequestPanel() {
  const { i18n, t } = useTranslation()
  const router = useRouter()
  const [planSearch, setPlanSearch] = useState('')
  const [planPage, setPlanPage] = useState(1)
  const [peopleSearch, setPeopleSearch] = useState('')
  const [peoplePage, setPeoplePage] = useState(1)
  const [plan, setPlan] = useState<RequestablePlanPageResponseDtoDataItemsItem>()
  const [endDate, setEndDate] = useState('')
  const [manyReasons, setManyReasons] = useState<Record<string, string>>({})
  const [reason, setReason] = useState('')
  const [people, setPeople] = useState<Record<string, string>>({})
  const [validation, setValidation] = useState(false)
  const {
    plans,
    people: candidates,
    check,
    submit
  } = useGroupRequest(planSearch.trim(), planPage, peopleSearch.trim(), peoplePage)
  const ids = Object.keys(people)
  const valid = !!plan && reason.trim().length > 0 && reason.trim().length <= 1000 && ids.length > 0
  const body = plan
    ? {
        planId: plan.id,
        businessReason: reason.trim(),
        ...(endDate ? { expectedEndDate: endDate } : {}),
        lines: ids.map((employeeId) => {
          const many = manyReasons[employeeId]?.trim()
          return many ? { employeeId, manyPaidSoftwareReason: many } : { employeeId }
        })
      }
    : undefined
  const signatureOf = (input: NonNullable<typeof body>) =>
    JSON.stringify([
      input.planId,
      input.businessReason,
      input.expectedEndDate ?? '',
      input.lines.map((line) => [line.employeeId, line.manyPaidSoftwareReason ?? '']).sort()
    ])
  const checked =
    check.data && body && signatureOf(check.data.input) === signatureOf(body) ? check.data.check : undefined
  const problems =
    !!checked &&
    (!checked.plan.eligible ||
      !!checked.tooManyLines ||
      !!checked.tooFewLines ||
      checked.endDateOutOfRange ||
      checked.lines.some((line) => !line.ok))
  const locked = submit.isPending || submit.isError || submit.isSuccess
  const format = new Intl.NumberFormat(i18n.language)

  function resetCheck() {
    check.reset()
  }
  function toggle(employeeId: string, fullName: string) {
    if (locked) return
    setPeople((current) => {
      const next = { ...current }
      if (next[employeeId]) delete next[employeeId]
      else next[employeeId] = fullName
      return next
    })
    resetCheck()
  }
  function runCheck() {
    if (!valid || !body) {
      setValidation(true)
      return
    }
    setValidation(false)
    check.mutate(body)
  }
  function send() {
    if (!body || !checked || problems || locked) return
    submit.mutate(body)
  }

  if (submit.isSuccess) {
    return (
      <View style={styles.stack}>
        <View accessibilityRole='summary' style={[styles.banner, styles.bannerOk]}>
          <Feather
            accessibilityElementsHidden
            color={mobileColors.success}
            importantForAccessibility='no'
            name='check-circle'
            size={18}
          />
          <Text style={styles.bannerOkText}>{t('manager.group.sent')}</Text>
        </View>
        <Pressable
          accessibilityRole='button'
          onPress={() => router.push({ pathname: '/live-requests/[requestId]', params: { requestId: submit.data } })}
          style={styles.primary}
        >
          <Text style={styles.primaryText}>{t('manager.group.openRequest')}</Text>
        </Pressable>
        <Pressable
          accessibilityRole='button'
          onPress={() => {
            submit.reset()
            check.reset()
            setPeople({})
            setReason('')
            setPlan(undefined)
          }}
          style={styles.secondary}
        >
          <Text style={styles.secondaryText}>{t('manager.group.another')}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.stack}>
      <View style={styles.copy}>
        <Text accessibilityRole='header' style={styles.title}>
          {t('manager.group.title')}
        </Text>
        <Text style={styles.muted}>{t('manager.group.hint')}</Text>
      </View>
      {submit.isError ? (
        <Text accessibilityRole='alert' style={styles.error}>
          {t('manager.group.uncertain')}
        </Text>
      ) : null}

      {!plan ? (
        <>
          <Text style={styles.step}>{t('manager.group.stepPlan')}</Text>
          <TextInput
            accessibilityLabel={t('requests.createLive.search')}
            editable={!locked}
            maxLength={100}
            onChangeText={(text) => {
              setPlanSearch(text)
              setPlanPage(1)
            }}
            placeholder={t('requests.createLive.search')}
            placeholderTextColor={mobileColors.muted}
            style={styles.input}
            value={planSearch}
          />
          {plans.isLoading ? (
            <Text accessibilityRole='progressbar' style={styles.muted}>
              {t('requests.createLive.loading')}
            </Text>
          ) : null}
          {plans.isError ? (
            <Pressable accessibilityRole='button' onPress={() => void plans.refetch()} style={styles.action}>
              <Text accessibilityRole='alert' style={styles.error}>
                {t('requests.createLive.catalogError')}
              </Text>
              <Text style={styles.link}>{t('licenses.live.retry')}</Text>
            </Pressable>
          ) : null}
          {plans.data?.items.map((item) => (
            <Pressable
              accessibilityLabel={t('requests.createLive.choosePlan', { app: item.application.name, plan: item.name })}
              accessibilityRole='button'
              accessibilityState={{ disabled: locked || !item.canSubmit }}
              disabled={locked || !item.canSubmit}
              key={item.id}
              onPress={() => {
                setPlan(item)
                resetCheck()
              }}
              style={[styles.card, !item.canSubmit && styles.cardBlocked]}
            >
              <Text style={styles.name}>{item.application.name}</Text>
              <Text style={styles.muted}>{t('licenses.live.plan', { plan: item.name })}</Text>
              {!item.canSubmit ? <Text style={styles.error}>{t('requests.createLive.planBlocked')}</Text> : null}
            </Pressable>
          ))}
          {plans.data && plans.data.pagination.totalPages > 1 ? (
            <View style={styles.pagination}>
              <Pressable
                accessibilityRole='button'
                disabled={planPage <= 1}
                onPress={() => setPlanPage(planPage - 1)}
                style={[styles.action, planPage <= 1 && styles.disabled]}
              >
                <Text style={styles.link}>{t('licenses.live.previous')}</Text>
              </Pressable>
              <Text style={styles.muted}>{t('licenses.live.page', { page: format.format(planPage) })}</Text>
              <Pressable
                accessibilityRole='button'
                disabled={planPage >= plans.data.pagination.totalPages}
                onPress={() => setPlanPage(planPage + 1)}
                style={[styles.action, planPage >= plans.data.pagination.totalPages && styles.disabled]}
              >
                <Text style={styles.link}>{t('licenses.live.next')}</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      ) : null}

      {plan ? (
        <>
          <Text style={styles.step}>
            {t('manager.group.stepDetails', { app: plan.application.name, plan: plan.name })}
          </Text>
          <Pressable
            accessibilityRole='button'
            accessibilityState={{ disabled: locked }}
            disabled={locked}
            onPress={() => {
              setPlan(undefined)
              resetCheck()
            }}
            style={[styles.action, locked && styles.disabled]}
          >
            <Text style={styles.link}>{t('manager.group.changePlan')}</Text>
          </Pressable>
          <Text style={styles.label}>{t('manager.group.endDate')}</Text>
          <DatePickerField
            disabled={locked}
            label={t('manager.group.endDate')}
            max={checked?.maxEndDate}
            min={todayIso()}
            onChange={(value) => {
              setEndDate(value)
              resetCheck()
            }}
            placeholder={t('manager.group.endDatePlaceholder')}
            value={endDate}
          />
          <Text style={styles.label}>{t('requests.createLive.reason')}</Text>
          <TextInput
            accessibilityLabel={t('requests.createLive.reason')}
            editable={!locked}
            maxLength={1000}
            multiline
            onChangeText={(value) => {
              setReason(value)
              resetCheck()
            }}
            style={[styles.input, styles.reason]}
            value={reason}
          />

          <Text style={styles.step}>{t('manager.group.stepPeople', { count: ids.length })}</Text>
          <TextInput
            accessibilityLabel={t('manager.group.searchPeople')}
            editable={!locked}
            maxLength={100}
            onChangeText={(text) => {
              setPeopleSearch(text)
              setPeoplePage(1)
            }}
            placeholder={t('manager.group.searchPeople')}
            placeholderTextColor={mobileColors.muted}
            style={styles.input}
            value={peopleSearch}
          />
          {candidates.isLoading ? (
            <Text accessibilityRole='progressbar' style={styles.muted}>
              {t('manager.live.loading')}
            </Text>
          ) : null}
          {candidates.isError ? (
            <Pressable accessibilityRole='button' onPress={() => void candidates.refetch()} style={styles.action}>
              <Text accessibilityRole='alert' style={styles.error}>
                {t('manager.group.peopleError')}
              </Text>
              <Text style={styles.link}>{t('licenses.live.retry')}</Text>
            </Pressable>
          ) : null}
          {candidates.data?.items.length === 0 ? <Text style={styles.muted}>{t('manager.group.noPeople')}</Text> : null}
          {candidates.data?.items.map((person) => {
            const on = !!people[person.employeeId]
            return (
              <Pressable
                accessibilityLabel={person.fullName}
                accessibilityRole='checkbox'
                accessibilityState={{ checked: on, disabled: locked }}
                disabled={locked}
                key={person.employeeId}
                onPress={() => toggle(person.employeeId, person.fullName)}
                style={[styles.card, on && styles.cardChecked]}
              >
                <View style={styles.row}>
                  <View style={[styles.box, on && styles.boxChecked]}>
                    {on ? (
                      <Feather color={mobileColors.white} importantForAccessibility='no' name='check' size={14} />
                    ) : null}
                  </View>
                  <View style={styles.copy}>
                    <Text style={styles.name}>{person.fullName}</Text>
                    <Text style={styles.muted}>{person.workEmail}</Text>
                  </View>
                </View>
              </Pressable>
            )
          })}
          {candidates.data && candidates.data.pagination.totalPages > 1 ? (
            <View style={styles.pagination}>
              <Pressable
                accessibilityRole='button'
                disabled={peoplePage <= 1}
                onPress={() => setPeoplePage(peoplePage - 1)}
                style={[styles.action, peoplePage <= 1 && styles.disabled]}
              >
                <Text style={styles.link}>{t('licenses.live.previous')}</Text>
              </Pressable>
              <Text style={styles.muted}>{t('licenses.live.page', { page: format.format(peoplePage) })}</Text>
              <Pressable
                accessibilityRole='button'
                disabled={peoplePage >= candidates.data.pagination.totalPages}
                onPress={() => setPeoplePage(peoplePage + 1)}
                style={[styles.action, peoplePage >= candidates.data.pagination.totalPages && styles.disabled]}
              >
                <Text style={styles.link}>{t('licenses.live.next')}</Text>
              </Pressable>
            </View>
          ) : null}

          {validation ? (
            <Text accessibilityRole='alert' style={styles.error}>
              {t('manager.group.validation')}
            </Text>
          ) : null}
          {check.isError ? (
            <Text accessibilityRole='alert' style={styles.error}>
              {t('manager.group.checkError')}
            </Text>
          ) : null}

          {checked ? (
            <View style={styles.card}>
              <Text style={styles.name}>{t('manager.group.checkTitle')}</Text>
              {!checked.plan.eligible ? <Text style={styles.error}>{t('manager.group.planNotEligible')}</Text> : null}
              {checked.tooManyLines ? (
                <Text style={styles.error}>{t('manager.group.tooMany', { max: checked.tooManyLines.max })}</Text>
              ) : null}
              {checked.tooFewLines ? (
                <Text style={styles.error}>{t('manager.group.tooFew', { min: checked.tooFewLines.min })}</Text>
              ) : null}
              {checked.endDateOutOfRange ? (
                <Text style={styles.error}>
                  {t('manager.group.endDateOutOfRange', {
                    date: formatApiDate(checked.maxEndDate, i18n.language) ?? checked.maxEndDate
                  })}
                </Text>
              ) : null}
              {checked.lines.map((line) => (
                <View key={line.employeeId} style={styles.row}>
                  <Feather
                    accessibilityElementsHidden
                    color={line.ok ? mobileColors.success : mobileColors.danger}
                    importantForAccessibility='no'
                    name={line.ok ? 'check-circle' : 'x-circle'}
                    size={16}
                  />
                  <Text style={styles.copy}>
                    {people[line.employeeId] ?? line.employeeId}
                    {line.reason ? ` — ${t(`manager.group.reasons.${line.reason}`)}` : ''}
                  </Text>
                </View>
              ))}
              {checked.lines
                .filter((line) => line.manyPaidSoftware || line.reason === 'MANY_PAID_SOFTWARE_REASON_REQUIRED')
                .map((line) => (
                  <View key={`many-${line.employeeId}`} style={styles.reserve}>
                    <Text style={styles.label}>
                      {t('manager.group.manyPaid', {
                        name: people[line.employeeId] ?? line.employeeId,
                        count: line.manyPaidSoftware?.count ?? 0,
                        threshold: line.manyPaidSoftware?.threshold ?? 0
                      })}
                    </Text>
                    <TextInput
                      accessibilityLabel={t('manager.group.manyPaidFor', {
                        name: people[line.employeeId] ?? line.employeeId
                      })}
                      editable={!locked}
                      maxLength={1000}
                      multiline
                      onChangeText={(value) => {
                        setManyReasons((current) => ({ ...current, [line.employeeId]: value }))
                        resetCheck()
                      }}
                      style={[styles.input, styles.reason]}
                      value={manyReasons[line.employeeId] ?? ''}
                    />
                  </View>
                ))}
              <Text style={styles.muted}>
                {checked.pricing.status === 'PRICED'
                  ? t('manager.group.cost', {
                      total: formatMoney(checked.pricing.amount, i18n.language) ?? t('manager.live.costUnavailable'),
                      each: formatMoney(checked.amountPerPerson, i18n.language) ?? t('manager.live.costUnavailable')
                    })
                  : checked.pricing.status === 'MISSING'
                    ? t('manager.live.costMissing')
                    : t('manager.live.costNotApplicable')}
              </Text>
              <Text style={styles.muted}>
                {t(checked.hasSpendStep ? 'manager.group.hasSpend' : 'manager.group.noSpend')}
              </Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole='button'
            accessibilityState={{ busy: check.isPending, disabled: locked || check.isPending }}
            disabled={locked || check.isPending}
            onPress={runCheck}
            style={[styles.secondary, (locked || check.isPending) && styles.disabled]}
          >
            <Text style={styles.secondaryText}>
              {check.isPending ? t('manager.group.checking') : t('manager.group.check')}
            </Text>
          </Pressable>
          {checked && !problems ? (
            <Pressable
              accessibilityRole='button'
              accessibilityState={{ busy: submit.isPending, disabled: locked }}
              disabled={locked}
              onPress={send}
              style={[styles.primary, locked && styles.disabled]}
            >
              <Text style={styles.primaryText}>
                {submit.isPending ? t('manager.spend.sending') : t('manager.group.submit')}
              </Text>
            </Pressable>
          ) : null}
        </>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  action: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: 44 },
  banner: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', gap: 9, padding: 12 },
  bannerOk: { backgroundColor: mobileColors.successSoft },
  bannerOkText: { color: mobileColors.success, flex: 1, fontSize: 13, fontWeight: '600' },
  box: {
    alignItems: 'center',
    borderColor: mobileColors.border,
    borderRadius: 7,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24
  },
  boxChecked: { backgroundColor: mobileColors.primary, borderColor: mobileColors.primary },
  card: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 7,
    padding: 14
  },
  cardBlocked: { opacity: 0.6 },
  cardChecked: { borderColor: mobileColors.primary },
  copy: { flex: 1, gap: 2 },
  disabled: { opacity: 0.4 },
  error: { color: mobileColors.danger, fontSize: 13, lineHeight: 19 },
  input: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: mobileColors.foreground,
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12
  },
  label: { color: mobileColors.muted, fontSize: 12 },
  link: { color: mobileColors.primaryInk, fontWeight: '700' },
  muted: { color: mobileColors.muted, fontSize: 12, lineHeight: 18 },
  name: { color: mobileColors.foreground, fontSize: 15, fontWeight: '700' },
  pagination: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  primary: {
    alignItems: 'center',
    backgroundColor: mobileColors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 50
  },
  primaryText: { color: mobileColors.white, fontSize: 14, fontWeight: '700' },
  reason: { minHeight: 96, paddingTop: 12, textAlignVertical: 'top' },
  reserve: { borderTopColor: mobileColors.border, borderTopWidth: 1, gap: 6, paddingTop: 10 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  secondary: {
    alignItems: 'center',
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48
  },
  secondaryText: { color: mobileColors.foreground, fontSize: 14, fontWeight: '700' },
  stack: { gap: 12 },
  step: { color: mobileColors.primaryInk, fontSize: 13, fontWeight: '700', marginTop: 4 },
  title: { color: mobileColors.foreground, fontSize: 17, fontWeight: '700' }
})
