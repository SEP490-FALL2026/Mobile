import { StyleSheet } from 'react-native'

import type { MobileColors } from '@/shared/theme/colors'

// Styles shared by the Manager queue, request detail and decision screens.
export const createNeedApprovalStyles = (mobileColors: MobileColors) =>
  StyleSheet.create({
    titleBlock: { gap: 4 },
    pageTitle: { color: mobileColors.foreground, fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
    safe: {
      flex: 1,
      backgroundColor: mobileColors.background,
      experimental_backgroundImage: mobileColors.backgroundGradient
    },
    screen: { flex: 1 },
    profile: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: mobileColors.border
    },
    profileIdentity: { flex: 1, minWidth: 0, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9 },
    profileActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    personalButton: {
      flex: 1,
      minHeight: 44,
      paddingHorizontal: 14,
      borderCurve: 'continuous',
      borderRadius: 14,
      backgroundColor: mobileColors.primarySoft,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    personalLabel: { color: mobileColors.primaryInk, fontWeight: '700', fontSize: 13, flexShrink: 1 },
    iconButton: {
      width: 44,
      height: 44,
      borderCurve: 'continuous',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: mobileColors.border,
      backgroundColor: mobileColors.white,
      alignItems: 'center',
      justifyContent: 'center'
    },
    review: { color: mobileColors.primary, fontWeight: '700', fontSize: 12 },
    reviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 5 },
    summaryRow: { flexDirection: 'row', gap: 10 },
    content: { padding: 16, paddingBottom: 30, gap: 14 },
    action: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' },
    link: { color: mobileColors.primaryInk, fontWeight: '700' },
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 18,
      borderCurve: 'continuous',
      borderRadius: 20,
      backgroundColor: mobileColors.primarySoft
    },
    headingCopy: { flex: 1, gap: 5 },
    kicker: {
      color: mobileColors.primaryInk,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase'
    },
    title: { color: mobileColors.foreground, fontSize: 25, fontWeight: '700' },
    icon: {
      width: 44,
      height: 44,
      borderCurve: 'continuous',
      borderRadius: 16,
      backgroundColor: mobileColors.surface,
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      backgroundColor: mobileColors.white,
      borderColor: mobileColors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 16,
      padding: 16,
      gap: 9
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    avatar: {
      width: 38,
      height: 38,
      borderCurve: 'continuous',
      borderRadius: 19,
      backgroundColor: mobileColors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center'
    },
    avatarText: { color: mobileColors.primaryInk, fontWeight: '700' },
    divider: { height: 1, backgroundColor: mobileColors.border },
    name: { color: mobileColors.foreground, fontSize: 16, fontWeight: '700', flexShrink: 1 },
    summaryCard: {
      flex: 1,
      backgroundColor: mobileColors.surface,
      borderColor: mobileColors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 16,
      padding: 18,
      gap: 10
    },
    summaryHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    summaryLabel: { color: mobileColors.primaryInk, fontSize: 13, fontWeight: '700', flexShrink: 1 },
    summaryCount: { color: mobileColors.foreground, fontSize: 24, fontWeight: '700' },
    label: { color: mobileColors.muted, fontSize: 12, marginTop: 4 },
    value: { color: mobileColors.foreground, fontSize: 14, lineHeight: 20 },
    muted: { color: mobileColors.muted, fontSize: 13, lineHeight: 19 },
    heroSubtitle: { color: mobileColors.foreground },
    error: { color: mobileColors.danger, fontSize: 13, lineHeight: 19 },
    success: { color: mobileColors.success, fontSize: 13, lineHeight: 19 },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    outline: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: mobileColors.border,
      borderCurve: 'continuous',
      borderRadius: 12,
      paddingHorizontal: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    primary: {
      minHeight: 48,
      backgroundColor: mobileColors.primary,
      borderCurve: 'continuous',
      borderRadius: 12,
      paddingHorizontal: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    primaryText: { color: mobileColors.onPrimary, fontWeight: '700' },
    disabled: { opacity: 0.4 },
    input: {
      minHeight: 90,
      borderColor: mobileColors.border,
      borderWidth: 1,
      borderCurve: 'continuous',
      borderRadius: 12,
      padding: 12,
      color: mobileColors.foreground,
      textAlignVertical: 'top'
    },
    confirm: { borderTopWidth: 1, borderTopColor: mobileColors.border, paddingTop: 12, gap: 10 },
    queueHeader: { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
    footer: {
      backgroundColor: mobileColors.backgroundEnd,
      borderTopColor: mobileColors.border,
      borderTopWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 12
    }
  })
