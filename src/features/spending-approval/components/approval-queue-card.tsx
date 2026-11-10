import { Feather } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { mobileColors } from '@/shared/theme/colors'

import { initialsOf } from '../model/spending-approvals'

interface ApprovalQueueCardProps {
  accessibilityLabel: string
  amount?: string
  chips?: ReactNode
  due?: string
  onPress: () => void
  person: string
  personMeta: string
  plan?: string
  title: string
}

export function ApprovalQueueCard({
  accessibilityLabel,
  amount,
  chips,
  due,
  onPress,
  person,
  personMeta,
  plan,
  title
}: ApprovalQueueCardProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialsOf(person)}</Text>
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.person}>
            {person}
          </Text>
          <Text numberOfLines={1} style={styles.muted}>
            {personMeta}
          </Text>
        </View>
        <Feather
          accessibilityElementsHidden
          color={mobileColors.muted}
          importantForAccessibility='no'
          name='chevron-right'
          size={20}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.body}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          {plan ? <Text style={styles.muted}>{plan}</Text> : null}
        </View>
        {amount ? <Text style={styles.amount}>{amount}</Text> : null}
      </View>
      {chips ? <View style={styles.chips}>{chips}</View> : null}
      {due ? (
        <View style={styles.dueRow}>
          <Feather
            accessibilityElementsHidden
            color={mobileColors.muted}
            importantForAccessibility='no'
            name='clock'
            size={13}
          />
          <Text style={styles.muted}>{due}</Text>
        </View>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  amount: { color: mobileColors.foreground, fontSize: 16, fontWeight: '700' },
  avatar: {
    alignItems: 'center',
    backgroundColor: mobileColors.primarySoft,
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38
  },
  avatarText: { color: mobileColors.primaryInk, fontWeight: '700' },
  body: { alignItems: 'flex-start', flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  card: {
    backgroundColor: mobileColors.white,
    borderColor: mobileColors.border,
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: '0px 4px 10px rgba(93, 59, 32, 0.04)',
    gap: 10,
    padding: 14
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  copy: { flex: 1, gap: 2 },
  divider: { backgroundColor: mobileColors.border, height: 1 },
  dueRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  muted: { color: mobileColors.muted, fontSize: 12, lineHeight: 18 },
  person: { color: mobileColors.foreground, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.85 },
  title: { color: mobileColors.foreground, fontSize: 16, fontWeight: '700' },
  top: { alignItems: 'center', flexDirection: 'row', gap: 10 }
})
