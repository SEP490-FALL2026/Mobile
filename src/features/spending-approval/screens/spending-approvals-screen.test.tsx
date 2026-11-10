import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { AxiosError } from 'axios'

import { SpendingApprovalsScreen } from '@/features/spending-approval'
import { accessRequestGet, accessRequestNeedDecide } from '@/shared/api/generated/operations/access-requests'
import { meGet } from '@/shared/api/generated/operations/me'
import { needDecisionList } from '@/shared/api/generated/operations/need-decisions'
import { notificationList, notificationUnreadCount } from '@/shared/api/generated/operations/notifications'
import {
  spendApprovalDecide,
  spendApprovalGet,
  spendApprovalList
} from '@/shared/api/generated/operations/spend-approvals'
import { setAppLanguage } from '@/shared/i18n/i18n'

const mockRedirect = jest.fn()
const mockSession = {
  state: 'authenticated',
  logout: jest.fn(),
  read: <T,>(fn: (token: string) => Promise<T>) => fn('test-token'),
  write: <T,>(fn: (token: string) => Promise<T>) => fn('test-token')
}
jest.mock('expo-router', () => ({
  Redirect: (props: { href: string }) => {
    mockRedirect(props.href)
    return null
  },
  useRouter: () => ({ replace: jest.fn(), push: jest.fn(), back: jest.fn(), canGoBack: () => false })
}))
jest.mock('@/shared/api/session-context', () => ({ useSession: () => mockSession }))
jest.mock('@/shared/api/generated/operations/me', () => ({ meGet: jest.fn() }))
jest.mock('@/shared/api/generated/operations/spend-approvals', () => ({
  spendApprovalList: jest.fn(),
  spendApprovalGet: jest.fn(),
  spendApprovalDecide: jest.fn()
}))
jest.mock('@/shared/api/generated/operations/need-decisions', () => ({ needDecisionList: jest.fn() }))
jest.mock('@/shared/api/generated/operations/access-requests', () => ({
  accessRequestGet: jest.fn(),
  accessRequestNeedDecide: jest.fn()
}))
jest.mock('@/shared/api/generated/operations/notifications', () => ({
  notificationList: jest.fn(),
  notificationUnreadCount: jest.fn(),
  notificationMarkRead: jest.fn(),
  notificationMarkAllRead: jest.fn()
}))

function apiFailure(status: number, code: string) {
  return new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: {} } as never,
    data: { success: false, error: { code } }
  })
}

const id = '01234567-89ab-cdef-0123-456789abcdef'
const stepId = '11234567-89ab-cdef-0123-456789abcdef'
const response = <T,>(data: T) => data
const money = (amount: string) => ({ amount, currency: 'VND' })

function renderScreen() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false, gcTime: 0 } }
  })
  return render(
    <QueryClientProvider client={client}>
      <SpendingApprovalsScreen />
    </QueryClientProvider>
  )
}

function mockProfile(roles: ('SPENDING_APPROVER' | 'MANAGER' | 'EMPLOYEE')[]) {
  jest.mocked(meGet).mockResolvedValue(
    response({
      success: true,
      message: 'ME.RETRIEVED',
      data: {
        appUserId: id,
        loginEmail: 'ceo@example.test',
        upcomingUnits: [],
        roles,
        employee: { id, employeeCode: 'E9', fullName: 'Lê Minh', department: null, unplaced: false, jobTitle: null },
        managerScope: null
      }
    })
  )
}

const page = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }

beforeEach(async () => {
  jest.clearAllMocks()
  await setAppLanguage('vi', false)
  mockProfile(['SPENDING_APPROVER'])
  jest
    .mocked(notificationList)
    .mockResolvedValue(
      response({ success: true, message: 'N', data: { items: [], pagination: { ...page, totalItems: 0 } } }) as never
    )
  jest
    .mocked(notificationUnreadCount)
    .mockResolvedValue(response({ success: true, message: 'N', data: { unread: 0 } }) as never)
  jest.mocked(spendApprovalList).mockResolvedValue(
    response({
      success: true,
      message: 'SPEND_APPROVAL.LISTED',
      data: {
        items: [
          {
            requestId: id,
            stepId,
            stepKind: 'SPEND_APPROVAL',
            openedAt: '2026-11-09T00:00:00Z',
            slaWorkingDays: 2,
            dueOn: '2026-11-12',
            plan: { planId: id, planName: 'Pro', applicationName: 'Slack' },
            softwareName: null,
            requester: { employeeId: id, employeeCode: 'E1', fullName: 'Hà An' },
            beneficiary: null,
            lineCount: 1,
            costCenter: { id, code: 'CC-TECH' },
            amount: money('8400000'),
            primaryCode: 'BUDGET_OK',
            outcome: 'WITHIN_BASE',
            routing: { mode: 'VIA_HEAD', oneStepReason: null },
            batchId: null
          }
        ],
        pagination: page
      }
    }) as never
  )
  jest.mocked(spendApprovalGet).mockResolvedValue(
    response({
      success: true,
      message: 'SPEND_APPROVAL.RETRIEVED',
      data: {
        spendApproval: {
          requestId: id,
          step: {
            id: stepId,
            state: 'PENDING',
            waitingReason: null,
            assignee: null,
            openedAt: '2026-11-09T00:00:00Z',
            decidedAt: null,
            slaWorkingDays: 2
          },
          routing: { mode: 'VIA_HEAD', oneStepReason: null },
          annualVendorAmount: null,
          budgetSnapshot: {
            year: 2026,
            outcome: 'WITHIN_BASE',
            blockedReasons: [],
            base: money('200000000'),
            reserve: money('10000000'),
            committed: money('50000000'),
            spent: money('115000000'),
            pending: null,
            remainingBase: money('26600000'),
            remainingWithReserve: money('36600000'),
            overBaseBy: null,
            overBy: null,
            reserveConfirmation: null,
            decisionSnapshotCheckId: null,
            computedAt: '2026-11-09T00:00:00Z'
          },
          request: {
            state: 'PENDING',
            plan: null,
            softwareName: 'Slack',
            requester: { employeeId: id, employeeCode: 'E1', fullName: 'Hà An' },
            beneficiary: null,
            lineCount: 1,
            costCenter: { id, code: 'CC-TECH' },
            businessReason: 'Giao tiếp nhóm',
            termMonths: 12,
            expectedEndDate: null,
            budgetYear: 2026
          },
          need: null,
          cost: null,
          assessment: null,
          decision: null
        }
      }
    }) as never
  )
  jest.mocked(needDecisionList).mockResolvedValue(
    response({
      success: true,
      message: 'NEED.LISTED',
      data: {
        items: [
          {
            requestId: id,
            stepId,
            stepKind: 'NEED',
            deciderRole: 'SPENDING_APPROVER',
            type: 'GRANT',
            openedAt: '2026-11-09T00:00:00Z',
            assignedAt: null,
            slaWorkingDays: 2,
            dueOn: '2026-11-12',
            plan: { planId: id, planName: 'Team', applicationName: 'DataDog' },
            softwareName: null,
            requester: { employeeId: id, employeeCode: 'M1', fullName: 'Trưởng Phòng B' },
            beneficiary: null,
            lineCount: 1,
            department: { id, code: 'TECH', name: 'Phòng Công nghệ' },
            businessReasonExcerpt: 'Giám sát',
            termMonths: 12,
            pricing: { status: 'PRICED', amount: money('3000000') }
          }
        ],
        pagination: page
      }
    }) as never
  )
})

test('lists only live spend items with amount, budget status and no static demo copy', async () => {
  const screen = await renderScreen()
  await screen.findByText('Slack')
  screen.getByText('Lê Minh')
  screen.getByText('Người duyệt chi')
  screen.getByText('Hà An')
  screen.getByText('Trong ngân sách cơ sở')
  expect(screen.queryByText(/demo/i)).toBeNull()
  expect(spendApprovalList).toHaveBeenCalledWith(
    { page: 1, pageSize: 20 },
    expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } }),
    expect.anything()
  )
})

test('shows the read-only budget snapshot and approves with the server contract', async () => {
  jest.mocked(spendApprovalDecide).mockResolvedValue(
    response({
      success: true,
      message: 'SPEND_APPROVAL.DECIDED',
      data: {
        spendApproval: {
          ...(jest.mocked(spendApprovalGet).mock.results[0]?.value ?? {}),
          requestId: id,
          decision: { decision: 'APPROVED', reason: null, decidedBy: {}, decidedAt: '2026-11-10T00:00:00Z' }
        }
      }
    }) as never
  )
  const screen = await renderScreen()
  await fireEvent.press(await screen.findByRole('button', { name: 'Xem Slack do Hà An yêu cầu' }))
  await screen.findByText('Snapshot ngân sách')
  await screen.findByText('Còn lại trong ngân sách cơ sở')
  screen.getByText('Chỉ đọc')
  await fireEvent.press(await screen.findByRole('button', { name: 'Duyệt' }))
  await fireEvent.press(screen.getByRole('button', { name: 'Xác nhận' }))
  await waitFor(() => expect(spendApprovalDecide).toHaveBeenCalledWith(id, { decision: 'APPROVE' }, expect.anything()))
})

test('rejecting requires a reason before anything is sent', async () => {
  const screen = await renderScreen()
  await fireEvent.press(await screen.findByRole('button', { name: 'Xem Slack do Hà An yêu cầu' }))
  await fireEvent.press(await screen.findByRole('button', { name: 'Từ chối' }))
  await fireEvent.press(screen.getByRole('button', { name: 'Xác nhận' }))
  screen.getByText('Cần nhập lý do từ 1 đến 1.000 ký tự.')
  expect(spendApprovalDecide).not.toHaveBeenCalled()
  await fireEvent.changeText(screen.getByLabelText('Lý do từ chối'), 'Vượt kế hoạch')
  jest.mocked(spendApprovalDecide).mockRejectedValue(apiFailure(409, 'SPEND.RECHECKED_RETURNED_TO_HEAD'))
  await fireEvent.press(screen.getByRole('button', { name: 'Xác nhận' }))
  await waitFor(() =>
    expect(spendApprovalDecide).toHaveBeenCalledWith(
      id,
      { decision: 'REJECT', reason: 'Vượt kế hoạch' },
      expect.anything()
    )
  )
  await screen.findByText(/Yêu cầu được kiểm tra lại và quay về/)
})

test('manager one-step requests are decided through the need decision', async () => {
  jest.mocked(accessRequestGet).mockResolvedValue(
    response({
      success: true,
      message: 'REQUEST.RETRIEVED',
      data: {
        request: {
          id,
          type: 'GRANT',
          needStep: { id: stepId, state: 'PENDING' },
          needDecision: null,
          department: { id, code: 'TECH', name: 'Phòng Công nghệ' },
          requester: { employeeId: id, employeeCode: 'M1', fullName: 'Trưởng Phòng B' },
          beneficiary: null,
          businessReason: 'Giám sát',
          termMonths: 12,
          pricing: { status: 'PRICED', amount: money('3000000') }
        }
      }
    }) as never
  )
  jest.mocked(accessRequestNeedDecide).mockResolvedValue(
    response({
      success: true,
      message: 'NEED.DECIDED',
      data: { request: { id, needDecision: { decision: 'APPROVED' } } }
    }) as never
  )
  const screen = await renderScreen()
  await fireEvent.press(await screen.findByRole('tab', { name: 'Mở mục Yêu cầu trưởng phòng' }))
  await fireEvent.press(await screen.findByRole('button', { name: 'Xem DataDog do Trưởng Phòng B yêu cầu' }))
  await fireEvent.press(await screen.findByRole('button', { name: 'Duyệt' }))
  await fireEvent.press(screen.getByRole('button', { name: 'Xác nhận' }))
  await waitFor(() =>
    expect(accessRequestNeedDecide).toHaveBeenCalledWith(id, { decision: 'APPROVE' }, expect.anything())
  )
})

test('other roles are sent away from the approver workspace', async () => {
  mockProfile(['MANAGER'])
  await renderScreen()
  await waitFor(() => expect(mockRedirect).toHaveBeenCalledWith('/live-need-approvals'))
  expect(spendApprovalList).not.toHaveBeenCalled()
})
