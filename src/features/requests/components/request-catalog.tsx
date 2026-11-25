import { Feather } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import { SoftwareIcon } from '@/entities/software'
import { PressableFeedback } from '@/shared/ui/pressable-feedback'
import { SegmentedControl } from '@/shared/ui/segmented-control'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '@/shared/api/generated/contracts/requestable-software'
import type { MobileColors } from '@/shared/theme/colors'
import { useMobileTheme } from '@/shared/theme/theme-provider'

import { useHeldPlans } from '../hooks/use-held-plans'
import { isNoDepartment, useRequestCatalog } from '../hooks/use-request-catalog'

// The catalog has two levels: applications (department suggestions or the whole catalog) and the plans of one
// application. The parent owns which application is open so its single back button can step back to the list.
export function RequestCatalog({
  getScrollY,
  scrollTo,
  application,
  onApplicationChange,
  onSelect,
  onOpenAccess,
  onSearchChange
}: {
  application?: { id: string; name: string }
  onApplicationChange: (application: { id: string; name: string }) => void
  getScrollY: () => number
  scrollTo: (y: number, animated: boolean) => void
  onSelect: (plan: RequestablePlanPageResponseDtoDataItemsItem) => void
  onOpenAccess: (assignmentId: string) => void
  onSearchChange: (hasSearch: boolean) => void
}) {
  const { t, i18n } = useTranslation()
  const { colors } = useMobileTheme()
  const styles = createStyles(colors)
  const [listMode, setListMode] = useState<'department' | 'applications'>('department')
  const mode = application ? 'plans' : listMode
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const heldPlans = useHeldPlans()
  const { department, applications, plans } = useRequestCatalog(mode, search.trim(), page, application?.id)
  const query = mode === 'department' ? department : mode === 'applications' ? applications : plans

  const listPosition = useRef({ y: 0, page: 1 })
  function chooseApplication(id: string, name: string) {
    if (mode === 'plans') return
    listPosition.current = { y: getScrollY(), page }
    scrollTo(0, false)
    setPage(1)
    onApplicationChange({ id, name })
  }
  function showApplications() {
    setListMode('applications')
    setPage(1)
  }
  // Coming back from an application's plans restores the list page and scroll position the user left.
  const openApplication = useRef(application?.id)
  useEffect(() => {
    const wasOpen = openApplication.current
    openApplication.current = application?.id
    if (!wasOpen || application) return
    setPage(listPosition.current.page)
    const { y } = listPosition.current
    setTimeout(() => scrollTo(y, false), 60)
  }, [application, scrollTo])

  return (
    <View style={styles.content}>
      {mode !== 'plans' ? (
        <>
          <TextInput
            accessibilityLabel={t('requests.createLive.catalog.search')}
            value={search}
            maxLength={100}
            placeholder={t('requests.createLive.catalog.searchPlaceholder')}
            placeholderTextColor={colors.muted}
            onChangeText={(value) => {
              setSearch(value)
              onSearchChange(!!value)
              setPage(1)
              if (value) setListMode('applications')
            }}
            style={styles.input}
          />
          <SegmentedControl
            onChange={(value) => {
              if (value === 'department') {
                setListMode('department')
                setSearch('')
                onSearchChange(false)
                setPage(1)
              } else {
                showApplications()
              }
            }}
            options={[
              { label: t('requests.createLive.catalog.department'), value: 'department' },
              { label: t('requests.createLive.catalog.all'), value: 'applications' }
            ]}
            value={mode === 'department' ? 'department' : 'applications'}
          />
          {mode === 'department' ? (
            <Text style={styles.muted}>{t('requests.createLive.catalog.departmentHint')}</Text>
          ) : null}
        </>
      ) : (
        <>
          <Text accessibilityRole='header' style={styles.pageHeading}>
            {t('requests.createLive.catalog.plansFor', { name: application?.name })}
          </Text>
        </>
      )}
      {query.isLoading ? (
        <Text accessibilityRole='progressbar' style={styles.muted}>
          {t('requests.createLive.loading')}
        </Text>
      ) : null}
      {query.isError ? (
        <View style={styles.card}>
          <Text accessibilityRole='alert' style={styles.error}>
            {isNoDepartment(query.error)
              ? t('requests.createLive.previewNoDepartment')
              : t('requests.createLive.catalogError')}
          </Text>
          {!isNoDepartment(query.error) ? (
            <PressableFeedback accessibilityRole='button' onPress={() => void query.refetch()} style={styles.action}>
              <Text style={styles.link}>{t('licenses.live.retry')}</Text>
            </PressableFeedback>
          ) : null}
          {page > 1 ? (
            <PressableFeedback accessibilityRole='button' onPress={() => setPage(page - 1)} style={styles.action}>
              <Text style={styles.link}>{t('licenses.live.previous')}</Text>
            </PressableFeedback>
          ) : null}
        </View>
      ) : null}
      {!query.isError && query.data?.items.length === 0 ? (
        <Text style={styles.muted}>{t(`requests.createLive.catalog.empty.${mode}`)}</Text>
      ) : null}
      {mode === 'department' && !department.isError
        ? department.data?.items.map((item) => (
            <PressableFeedback
              key={item.entryId}
              accessibilityRole='button'
              accessibilityLabel={
                item.planName
                  ? t('requests.createLive.catalog.openSuggestion', { name: item.applicationName, plan: item.planName })
                  : t('requests.createLive.catalog.openApp', { name: item.applicationName })
              }
              onPress={() => chooseApplication(item.applicationId, item.applicationName)}
              style={styles.card}
            >
              <View style={styles.row}>
                <SoftwareIcon name={item.applicationName} logoUrl={item.applicationLogoUrl} />
                <View style={styles.copy}>
                  <Text style={styles.heading}>{item.applicationName}</Text>
                  {item.planName ? (
                    <Text style={styles.muted}>{t('licenses.live.plan', { plan: item.planName })}</Text>
                  ) : null}
                  {item.note ? <Text style={styles.muted}>{item.note}</Text> : null}
                </View>
                <Feather
                  accessibilityElementsHidden
                  importantForAccessibility='no'
                  name='chevron-right'
                  size={20}
                  color={colors.muted}
                />
              </View>
            </PressableFeedback>
          ))
        : null}
      {mode === 'applications' && !applications.isError
        ? applications.data?.items.map((item) => (
            <PressableFeedback
              key={item.id}
              accessibilityRole='button'
              accessibilityLabel={t('requests.createLive.catalog.openApp', { name: item.name })}
              onPress={() => chooseApplication(item.id, item.name)}
              style={styles.card}
            >
              <View style={styles.row}>
                <SoftwareIcon name={item.name} logoUrl={item.logoUrl} />
                <View style={styles.copy}>
                  <Text style={styles.heading}>{item.name}</Text>
                  {item.vendorName ? (
                    <Text style={styles.muted}>
                      {t('requests.createLive.catalog.vendor', { name: item.vendorName })}
                    </Text>
                  ) : null}
                  <Text style={styles.muted}>{item.functionalGroup.name}</Text>
                  <Text style={styles.muted}>
                    {t('requests.createLive.catalog.planCount', { count: numberFormat(item.planCount, i18n.language) })}
                  </Text>
                  <Text style={styles.muted}>
                    {t(item.costsMoney ? 'requests.createLive.catalog.paid' : 'requests.createLive.catalog.free')}
                  </Text>
                  {!item.canSubmit ? (
                    <Text style={styles.error}>
                      {item.submitBlockedReason === 'FINANCE_SETUP_INCOMPLETE'
                        ? t('requests.createLive.previewNoCostCenter')
                        : t('requests.createLive.planBlocked')}
                    </Text>
                  ) : null}
                </View>
              </View>
            </PressableFeedback>
          ))
        : null}
      {mode === 'plans' && !plans.isError
        ? plans.data?.items.map((plan) => {
            const heldAssignmentId = heldPlans.get(plan.id)
            return (
              <PressableFeedback
                key={plan.id}
                accessibilityRole='button'
                accessibilityLabel={
                  heldAssignmentId
                    ? `${t('requests.createLive.choosePlan', { app: plan.application.name, plan: plan.name })}. ${t('requests.createLive.catalog.held')}`
                    : t('requests.createLive.choosePlan', { app: plan.application.name, plan: plan.name })
                }
                accessibilityHint={heldAssignmentId ? t('requests.createLive.catalog.heldHint') : undefined}
                onPress={() => (heldAssignmentId ? onOpenAccess(heldAssignmentId) : onSelect(plan))}
                style={[styles.card, heldAssignmentId && styles.cardHeld]}
              >
                {heldAssignmentId ? (
                  <View style={styles.heldBadge}>
                    <Feather
                      accessibilityElementsHidden
                      color={colors.success}
                      importantForAccessibility='no'
                      name='check-circle'
                      size={14}
                    />
                    <Text style={styles.heldText}>{t('requests.createLive.catalog.held')}</Text>
                  </View>
                ) : null}
                <Text style={styles.heading}>{plan.name}</Text>
                <Text style={styles.muted}>{t('licenses.live.provisioning', { type: plan.provisioningType })}</Text>
                <Text style={styles.muted}>{t(`requests.createLive.catalog.pricing.${plan.price.status}`)}</Text>
                <Text style={styles.muted}>
                  {t(plan.costsMoney ? 'requests.createLive.catalog.paid' : 'requests.createLive.catalog.free')}
                </Text>
                {!plan.canSubmit ? (
                  <Text style={styles.error}>
                    {plan.submitBlockedReason === 'FINANCE_SETUP_INCOMPLETE'
                      ? t('requests.createLive.previewNoCostCenter')
                      : t('requests.createLive.planBlocked')}
                  </Text>
                ) : null}
                {heldAssignmentId ? (
                  <Text style={styles.muted}>{t('requests.createLive.catalog.heldHint')}</Text>
                ) : null}
              </PressableFeedback>
            )
          })
        : null}
      {!query.isError && query.data && query.data.pagination.totalPages > 1 ? (
        <View style={styles.pagination}>
          <PressableFeedback
            accessibilityRole='button'
            disabled={page <= 1}
            accessibilityState={{ disabled: page <= 1 }}
            onPress={() => setPage(page - 1)}
            style={[styles.action, page <= 1 && styles.disabled]}
          >
            <Text style={styles.link}>{t('licenses.live.previous')}</Text>
          </PressableFeedback>
          <Text style={styles.muted}>{t('licenses.live.page', { page: numberFormat(page, i18n.language) })}</Text>
          <PressableFeedback
            accessibilityRole='button'
            disabled={page >= query.data.pagination.totalPages}
            accessibilityState={{ disabled: page >= query.data.pagination.totalPages }}
            onPress={() => setPage(page + 1)}
            style={[styles.action, page >= query.data.pagination.totalPages && styles.disabled]}
          >
            <Text style={styles.link}>{t('licenses.live.next')}</Text>
          </PressableFeedback>
        </View>
      ) : null}
    </View>
  )
}

function numberFormat(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value)
}

const createStyles = (colors: MobileColors) =>
  StyleSheet.create({
    content: { gap: 12 },
    tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 16,
      paddingHorizontal: 14,
      minHeight: 52,
      color: colors.foreground
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 20,
      padding: 18,
      gap: 7
    },
    cardHeld: { backgroundColor: colors.surfaceSubtle },
    heldBadge: {
      alignSelf: 'flex-start',
      alignItems: 'center',
      backgroundColor: colors.successBackground,
      borderCurve: 'continuous',
      borderRadius: 8,
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 4
    },
    heldText: { color: colors.success, fontSize: 12, fontWeight: '700' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    copy: { flex: 1, gap: 4 },
    heading: { color: colors.foreground, fontSize: 16, fontWeight: '700' },
    pageHeading: { color: colors.foreground, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
    muted: { color: colors.muted, fontSize: 13, lineHeight: 19 },
    error: { color: colors.danger, fontSize: 13, lineHeight: 19 },
    link: { color: colors.primaryInk, fontWeight: '700' },
    action: { minHeight: 44, justifyContent: 'center' },
    pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    disabled: { opacity: 0.4 }
  })
