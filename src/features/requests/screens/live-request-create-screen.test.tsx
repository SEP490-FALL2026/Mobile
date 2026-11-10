import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, waitFor } from '@testing-library/react-native'

import { LiveRequestCreateScreen } from '@/features/requests'
import { accessRequestPreview, accessRequestSubmit } from '@/shared/api/generated/operations/access-requests'
import { requestablePlanList } from '@/shared/api/generated/operations/requestable-software'
import { setAppLanguage } from '@/shared/i18n/i18n'
import { todayIso } from '@/shared/lib/calendar'

const mockRouter = { replace: jest.fn() }
const mockSession = {
  state: 'authenticated',
  read: <T,>(operation: (token: string) => Promise<T>) => operation('test-token'),
  write: <T,>(operation: (token: string) => Promise<T>) => operation('test-token')
}
jest.mock('expo-router', () => ({ Redirect: () => null, useRouter: () => mockRouter }))
jest.mock('@/shared/api/session-context', () => ({ useSession: () => mockSession }))
jest.mock('@/shared/api/generated/operations/requestable-software', () => ({
  requestablePlanList: jest.fn()
}))
jest.mock('@/shared/api/generated/operations/access-requests', () => ({
  accessRequestPreview: jest.fn(),
  accessRequestSubmit: jest.fn()
}))

const id = '01234567-89ab-cdef-0123-456789abcdef'
function renderScreen() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false, gcTime: 0 } }
  })
  return render(
    <QueryClientProvider client={client}>
      <LiveRequestCreateScreen />
    </QueryClientProvider>
  )
}
beforeEach(async () => {
  jest.clearAllMocks()
  await setAppLanguage('vi', false)
  jest.mocked(requestablePlanList).mockResolvedValue({
    success: true,
    message: 'PLAN.LISTED',
    data: {
      items: [
        {
          id,
          name: 'Pro',
          application: { id, name: 'Figma', kind: 'SAAS' },
          provisioningType: 'K4',
          price: { status: 'PRICED', missingReason: null },
          costsMoney: true,
          canSubmit: true,
          submitBlockedReason: null
        }
      ],
      pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
    }
  })
  jest.mocked(accessRequestPreview).mockResolvedValue({
    success: true,
    message: 'REQUEST.PREVIEW',
    data: {
      preview: {
        plan: { planId: id, planName: 'Pro', applicationId: id, applicationName: 'Figma' },
        branch: 'PAID_IN_CATALOG',
        expectedEndDate: null,
        department: { id, code: 'IT', name: 'IT' },
        costCenter: null,
        maxEndDate: '2099-12-31',
        termRequired: false,
        annualVendorAmount: null,
        limits: {
          openNewCount: 0,
          openNewMax: 3,
          openRequestId: null,
          paidSoftwareCount: 0,
          paidSoftwareThreshold: 3,
          reasonRequired: false,
          refusal: null
        },
        existingAccess: null,
        blockedBy: null,
        canSubmit: true,
        budgetYear: null,
        pricing: {
          status: 'NOT_APPLICABLE',
          missingReason: null,
          amount: null,
          unitPrice: null,
          billingCycle: null,
          kind: null,
          months: null,
          monthlyPrice: null,
          nextYearAmount: null
        },
        costEstimate: null,
        spendSubmission: 'NOT_NEEDED',
        chain: [],
        totalExpectedWorkingDays: 2
      }
    }
  })
})

test('requires a valid reason, previews the actual plan, and locks after an uncertain submission', async () => {
  jest.mocked(accessRequestSubmit).mockRejectedValueOnce(new Error('offline'))
  const screen = await renderScreen()
  await screen.findByText('Figma')
  await fireEvent.press(screen.getByRole('button', { name: 'Chọn Figma, Pro' }))
  await fireEvent.press(screen.getByRole('button', { name: 'Kiểm tra yêu cầu' }))
  screen.getByText('Nhập lý do từ 1 đến 1000 ký tự.')
  expect(accessRequestPreview).not.toHaveBeenCalled()
  await fireEvent.changeText(screen.getByLabelText('Lý do nghiệp vụ (bắt buộc)'), '  Thiết kế  ')
  await fireEvent.press(screen.getByLabelText('Dùng đến ngày'))
  await fireEvent.press(screen.getByText('Hôm nay'))
  await fireEvent.press(screen.getByRole('button', { name: 'Kiểm tra yêu cầu' }))
  await screen.findByText('Có thể gửi yêu cầu. Máy chủ sẽ kiểm tra lại khi gửi.')
  expect(accessRequestPreview).toHaveBeenCalledWith(
    { planId: id, expectedEndDate: todayIso() },
    expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } })
  )
  await fireEvent.press(screen.getByRole('button', { name: 'Gửi yêu cầu' }))
  await screen.findByText('Chưa thể xác nhận kết quả. Hãy kiểm tra danh sách yêu cầu trước khi gửi lại để tránh trùng.')
  expect(accessRequestSubmit).toHaveBeenCalledWith(
    { planId: id, businessReason: 'Thiết kế', expectedEndDate: todayIso() },
    expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } })
  )
  expect(screen.getByRole('button', { name: 'Gửi yêu cầu' }).props.accessibilityState.disabled).toBe(true)
  expect(accessRequestSubmit).toHaveBeenCalledTimes(1)
})

test('removes preview on form changes and blocks submission if server rejects preview', async () => {
  const screen = await renderScreen()
  await screen.findByText('Figma')
  await fireEvent.press(screen.getByRole('button', { name: 'Chọn Figma, Pro' }))
  await fireEvent.changeText(screen.getByLabelText('Lý do nghiệp vụ (bắt buộc)'), 'Thiết kế')
  await fireEvent.press(screen.getByRole('button', { name: 'Kiểm tra yêu cầu' }))
  await screen.findByText('Có thể gửi yêu cầu. Máy chủ sẽ kiểm tra lại khi gửi.')
  await fireEvent.press(screen.getByLabelText('Dùng đến ngày'))
  await fireEvent.press(screen.getByText('Hôm nay'))
  expect(screen.queryByRole('button', { name: 'Gửi yêu cầu' })).toBeNull()
  const response = await jest.mocked(accessRequestPreview)({ planId: id })
  if (!response.data) throw new Error('Expected preview')
  jest.mocked(accessRequestPreview).mockResolvedValueOnce({
    ...response,
    data: { preview: { ...response.data.preview, canSubmit: false, expectedEndDate: todayIso() } }
  })
  await fireEvent.press(screen.getByRole('button', { name: 'Kiểm tra yêu cầu' }))
  await screen.findByText('Hiện không thể gửi yêu cầu này.')
  expect(screen.getByRole('button', { name: 'Gửi yêu cầu' }).props.accessibilityState.disabled).toBe(true)
  expect(accessRequestSubmit).not.toHaveBeenCalled()
})

test('loads catalog errors and retries', async () => {
  jest.mocked(requestablePlanList).mockRejectedValueOnce(new Error('offline'))
  const screen = await renderScreen()
  await screen.findByText('Không thể tải danh mục.')
  await fireEvent.press(screen.getByRole('button', { name: 'Thử lại' }))
  await waitFor(() => screen.getByText('Figma'))
})

test('navigates to the created request after successful submission', async () => {
  jest.mocked(accessRequestSubmit).mockResolvedValueOnce({
    success: true,
    message: 'REQUEST.CREATED',
    data: {
      request: {
        id,
        type: 'GRANT',
        branch: 'PAID_IN_CATALOG',
        state: 'PENDING',
        routing: { mode: 'VIA_HEAD', oneStepReason: null },
        flags: { manyPaidSoftware: null },
        plan: { planId: id, planName: 'Pro', applicationId: id, applicationName: 'Figma' },
        proposal: null,
        department: { id, code: 'IT', name: 'IT' },
        costCenter: null,
        requester: { employeeId: id, employeeCode: 'E1', fullName: 'An' },
        beneficiary: null,
        lineCount: 1,
        businessReason: 'Thiết kế',
        termMonths: 12,
        expectedEndDate: null,
        serviceAccount: null,
        renewal: null,
        spend: null,
        budgetYear: null,
        pricing: {
          status: 'NOT_APPLICABLE',
          missingReason: null,
          amount: null,
          unitPrice: null,
          billingCycle: null,
          kind: null,
          months: null,
          monthlyPrice: null,
          nextYearAmount: null
        },
        policy: { version: 1, hasSpendStep: true, slaWorkingDays: 2 },
        submittedAt: '2026-11-09T00:00:00Z',
        needStep: {
          id,
          state: 'PENDING',
          assignee: null,
          routingRow: 1,
          waitingReason: null,
          slaWorkingDays: 2,
          createdAt: '2026-11-09T00:00:00Z',
          assignedAt: null,
          decidedAt: null
        },
        needDecision: null,
        withdrawal: null,
        cancellation: null
      }
    }
  })
  const screen = await renderScreen()
  await screen.findByText('Figma')
  await fireEvent.press(screen.getByRole('button', { name: 'Chọn Figma, Pro' }))
  await fireEvent.changeText(screen.getByLabelText('Lý do nghiệp vụ (bắt buộc)'), 'Thiết kế')
  await fireEvent.press(screen.getByRole('button', { name: 'Kiểm tra yêu cầu' }))
  await screen.findByText('Có thể gửi yêu cầu. Máy chủ sẽ kiểm tra lại khi gửi.')
  await fireEvent.press(screen.getByRole('button', { name: 'Gửi yêu cầu' }))
  await waitFor(() =>
    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: '/live-requests/[requestId]',
      params: { requestId: id }
    })
  )
  await screen.findByText('Đang gửi yêu cầu. Vui lòng chờ.')
})
