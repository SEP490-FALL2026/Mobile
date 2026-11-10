import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, waitFor } from '@testing-library/react-native'

import {
  groupRequestCandidateList,
  groupRequestCheck,
  groupRequestSubmit
} from '@/shared/api/generated/operations/group-requests'
import { requestablePlanList } from '@/shared/api/generated/operations/requestable-software'
import { spendBatchSubmit, spendQueueList } from '@/shared/api/generated/operations/spend-submission'
import { setAppLanguage } from '@/shared/i18n/i18n'

import { GroupRequestPanel } from './group-request-screen'
import { SpendQueuePanel } from './spend-queue-screen'

const mockRouter = { push: jest.fn(), replace: jest.fn() }
const mockSession = {
  state: 'authenticated',
  read: <T,>(fn: (token: string) => Promise<T>) => fn('test-token'),
  write: <T,>(fn: (token: string) => Promise<T>) => fn('test-token')
}
jest.mock('expo-router', () => ({ useRouter: () => mockRouter }))
jest.mock('@/shared/api/session-context', () => ({ useSession: () => mockSession }))
jest.mock('@/shared/api/generated/operations/spend-submission', () => ({
  spendQueueList: jest.fn(),
  spendBatchSubmit: jest.fn()
}))
jest.mock('@/shared/api/generated/operations/group-requests', () => ({
  groupRequestCandidateList: jest.fn(),
  groupRequestCheck: jest.fn(),
  groupRequestSubmit: jest.fn()
}))
jest.mock('@/shared/api/generated/operations/requestable-software', () => ({
  requestablePlanList: jest.fn()
}))

const id = '01234567-89ab-cdef-0123-456789abcdef'
const id2 = '11234567-89ab-cdef-0123-456789abcdef'
const ok = <T,>(data: T) => data
const page = (totalItems: number) => ({ page: 1, pageSize: 20, totalItems, totalPages: totalItems ? 1 : 0 })
const money = (amount: string) => ({ amount, currency: 'VND' })

function renderWith(node: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false, gcTime: 0 } }
  })
  return render(<QueryClientProvider client={client}>{node}</QueryClientProvider>)
}

beforeEach(async () => {
  jest.clearAllMocks()
  await setAppLanguage('vi', false)
})

const queueItem = (requestId: string, over: Record<string, unknown> = {}) => ({
  requestId,
  plan: { planId: id, planName: 'Pro', applicationName: 'Slack' },
  softwareName: null,
  requester: { employeeId: id, employeeCode: 'E1', fullName: 'Hà An' },
  beneficiary: null,
  lineCount: 1,
  amount: money('8400000'),
  budgetYear: 2026,
  stage: 'NOT_SUBMITTED',
  budgetOutcome: 'WITHIN_BASE',
  blockedReasons: [],
  overBy: null,
  readyToSubmit: true,
  updatedAt: '2026-11-09T00:00:00Z',
  queuedAt: '2026-11-09T00:00:00Z',
  waitedWorkingDays: 1,
  overdue: false,
  reminders: 0,
  ...over
})

describe('spend queue', () => {
  test('sends the chosen ready requests in one batch and shows how each fared', async () => {
    jest.mocked(spendQueueList).mockResolvedValue(
      ok({
        success: true,
        message: 'Q',
        data: {
          items: [
            queueItem(id),
            queueItem(id2, {
              stage: 'BLOCKED',
              budgetOutcome: 'BLOCKED',
              blockedReasons: ['PRICE_EXPIRED'],
              readyToSubmit: false
            })
          ],
          pagination: page(2)
        }
      }) as never
    )
    jest.mocked(spendBatchSubmit).mockResolvedValue(
      ok({
        success: true,
        message: 'B',
        data: {
          batch: { id, itemCount: 1 },
          results: [{ requestId: id, outcome: 'SENT_TO_APPROVER', reserveConfirmation: 'NOT_GIVEN', stopReason: null }]
        }
      }) as never
    )
    const screen = await renderWith(<SpendQueuePanel permitted />)
    await screen.findByText('Báo giá không còn hiệu lực', { exact: false })
    expect(screen.getByRole('checkbox', { name: /Slack/, disabled: true })).toBeTruthy()
    await fireEvent.press(screen.getByRole('button', { name: /Chọn tất cả mục sẵn sàng \(1\)/ }))
    await fireEvent.press(screen.getByRole('button', { name: 'Trình 1 yêu cầu lên người duyệt chi' }))
    await fireEvent.press(screen.getByRole('button', { name: 'Gửi ngay' }))
    await screen.findByText('Đã gửi lô gồm 1 yêu cầu.')
    screen.getByText('Đã chuyển tới người duyệt chi')
    expect(spendBatchSubmit).toHaveBeenCalledWith({ requestIds: [id] }, expect.anything())
  })

  test('asks for a one-line reason when a request uses the reserve and sends it with the batch', async () => {
    jest.mocked(spendQueueList).mockResolvedValue(
      ok({
        success: true,
        message: 'Q',
        data: {
          items: [
            queueItem(id, { stage: 'RESERVE_CONFIRMATION', budgetOutcome: 'USES_RESERVE', readyToSubmit: false })
          ],
          pagination: page(1)
        }
      }) as never
    )
    jest.mocked(spendBatchSubmit).mockResolvedValue(
      ok({
        success: true,
        message: 'B',
        data: {
          batch: { id, itemCount: 1 },
          results: [{ requestId: id, outcome: 'SENT_TO_APPROVER', reserveConfirmation: 'APPLIED', stopReason: null }]
        }
      }) as never
    )
    const screen = await renderWith(<SpendQueuePanel permitted />)
    await fireEvent.press(await screen.findByRole('checkbox', { name: /Slack/ }))
    await fireEvent.press(screen.getByRole('button', { name: 'Trình 1 yêu cầu lên người duyệt chi' }))
    await fireEvent.press(screen.getByRole('button', { name: 'Gửi ngay' }))
    screen.getByText('Hãy nhập lý do một dòng (tối đa 500 ký tự) cho mọi yêu cầu dùng dự phòng.')
    expect(spendBatchSubmit).not.toHaveBeenCalled()
    await fireEvent.changeText(screen.getByLabelText('Lý do dùng dự phòng cho Slack'), 'Cần cho dự án mới')
    await fireEvent.press(screen.getByRole('button', { name: 'Gửi ngay' }))
    await waitFor(() =>
      expect(spendBatchSubmit).toHaveBeenCalledWith(
        { requestIds: [id], reserveConfirmations: [{ requestId: id, reason: 'Cần cho dự án mới' }] },
        expect.anything()
      )
    )
    await screen.findByText('Đã gửi lô gồm 1 yêu cầu.')
  })

  test('never sends a blocked request and says when the queue is empty', async () => {
    jest
      .mocked(spendQueueList)
      .mockResolvedValue(ok({ success: true, message: 'Q', data: { items: [], pagination: page(0) } }) as never)
    const screen = await renderWith(<SpendQueuePanel permitted />)
    await screen.findByText('Không có yêu cầu nào chờ trình.')
    expect(spendBatchSubmit).not.toHaveBeenCalled()
  })
})

describe('group request', () => {
  test('checks the people and then sends only a request that passed the check', async () => {
    jest.mocked(requestablePlanList).mockResolvedValue(
      ok({
        success: true,
        message: 'P',
        data: {
          items: [
            {
              id,
              name: 'Team',
              provisioningType: 'MANUAL',
              application: { name: 'DataDog' },
              price: {},
              costsMoney: true,
              canSubmit: true,
              submitBlockedReason: null
            }
          ],
          pagination: page(1)
        }
      }) as never
    )
    jest.mocked(groupRequestCandidateList).mockResolvedValue(
      ok({
        success: true,
        message: 'C',
        data: {
          items: [
            { employeeId: id, fullName: 'Hà An', workEmail: 'an@x.test' },
            { employeeId: id2, fullName: 'Bùi Bình', workEmail: 'binh@x.test' }
          ],
          pagination: page(2)
        }
      }) as never
    )
    jest.mocked(groupRequestCheck).mockResolvedValue(
      ok({
        success: true,
        message: 'K',
        data: {
          plan: { eligible: true, reason: null },
          tooManyLines: null,
          tooFewLines: null,
          maxEndDate: '2099-12-31',
          endDateOutOfRange: false,
          lines: [
            { employeeId: id, ok: true, reason: null },
            { employeeId: id2, ok: false, reason: 'HAS_ACCESS' }
          ],
          lineCount: 2,
          hasSpendStep: true,
          pricing: { status: 'PRICED', amount: money('6000000') },
          amountPerPerson: money('3000000')
        }
      }) as never
    )
    jest
      .mocked(groupRequestSubmit)
      .mockResolvedValue(ok({ success: true, message: 'S', data: { request: { id } } }) as never)
    const screen = await renderWith(<GroupRequestPanel />)
    await fireEvent.press(await screen.findByRole('button', { name: /DataDog/ }))
    // choosing a plan moves to its own step: the catalog is hidden and the form is on top
    expect(screen.queryByLabelText('Tìm phần mềm hoặc gói')).toBeNull()
    screen.getByText('Chọn gói khác')
    screen.getByLabelText('Dùng đến ngày')
    await fireEvent.changeText(screen.getByLabelText('Lý do nghiệp vụ (bắt buộc)'), 'Giám sát hệ thống')
    await fireEvent.press(await screen.findByRole('checkbox', { name: 'Hà An' }))
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Bùi Bình' }))
    await fireEvent.press(screen.getByRole('button', { name: 'Kiểm tra trước khi gửi' }))
    await screen.findByText(/Đã có phần mềm này/)
    expect(screen.queryByRole('button', { name: 'Gửi yêu cầu' })).toBeNull()
    expect(groupRequestSubmit).not.toHaveBeenCalled()

    // Removing the person who failed the check makes the check stale until it is run again.
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Bùi Bình' }))
    expect(screen.queryByText(/Đã có phần mềm này/)).toBeNull()
    jest.mocked(groupRequestCheck).mockResolvedValue(
      ok({
        success: true,
        message: 'K',
        data: {
          plan: { eligible: true, reason: null },
          tooManyLines: null,
          tooFewLines: null,
          maxEndDate: '2099-12-31',
          endDateOutOfRange: false,
          lines: [{ employeeId: id, ok: true, reason: null }],
          lineCount: 1,
          hasSpendStep: true,
          pricing: { status: 'PRICED', amount: money('3000000') },
          amountPerPerson: money('3000000')
        }
      }) as never
    )
    await fireEvent.press(screen.getByRole('button', { name: 'Kiểm tra trước khi gửi' }))
    await fireEvent.press(await screen.findByRole('button', { name: 'Gửi yêu cầu' }))
    await waitFor(() =>
      expect(groupRequestSubmit).toHaveBeenCalledWith(
        { planId: id, businessReason: 'Giám sát hệ thống', lines: [{ employeeId: id }] },
        expect.anything()
      )
    )
    await screen.findByText('Đã gửi yêu cầu.')
  })
})
