export const resources = {
  en: {
    translation: {
      common: {
        back: 'Back',
        datePicker: {
          title: 'Choose a date from the calendar',
          clear: 'Clear date',
          close: 'Close',
          today: 'Today',
          previousMonth: 'Previous month',
          nextMonth: 'Next month'
        },
        brand: 'SAAS-SENTRY MOBILE',
        brandInitial: 'S',
        brandName: 'SaaS-Sentry',
        demo: 'demo',
        demoDecisionError: 'This demo item is no longer available for that action. Please review its current status.',
        language: {
          english: 'English',
          englishShort: 'EN',
          selector: 'Language',
          switchTo: 'Switch to {{language}}',
          vietnamese: 'Vietnamese',
          vietnameseShort: 'VI'
        }
      },
      navigation: {
        createRequest: 'Create request',
        inbox: 'Inbox',
        openTab: 'Open {{tab}}',
        requests: 'Requests',
        software: 'Software',
        tabs: 'Main navigation'
      },
      auth: {
        back: 'Back',
        profileLoading: 'Loading your account…',
        profileError: 'Could not load your account. Retry or sign out.',
        demoNote: 'UF-17 / QĐ-46a · Internal email and password only; no external sign-in provider. Demo data.',
        email: 'Company email',
        emailPlaceholder: 'name@company.tech',
        forgotPassword: 'Forgot password?',
        recoveryUnavailable: 'Password recovery is not available in the app yet. Please use the web application.',
        loading: 'Please wait…',
        errors: {
          credentials: 'Check your email and password and try again.',
          rateLimit: 'Too many attempts. Please wait before trying again.',
          general: 'Could not sign in. Check your connection and try again.',
          configuration: 'The application API address is invalid or insecure. Contact your administrator.',
          restore: 'The previous session could not be restored. Please sign in again.'
        },
        login: 'Sign in',
        loginTitle: 'Sign in to your internal account',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        recovery: {
          backToLogin: 'Back to sign in',
          done: {
            description: 'Your demo password has been updated. You can now return to sign in.',
            title: 'Password updated'
          },
          email: {
            description: 'Enter your company email and we will send reset instructions.',
            title: 'Reset your password'
          },
          newPassword: 'New password',
          openLink: 'Open simulated reset link',
          resetButton: 'Set new password',
          send: 'Send instructions',
          sent: {
            description:
              'If an account matches that email, reset instructions will be sent. This response is the same for every address.',
            title: 'Check your email'
          },
          passwordStep: {
            description: 'Choose a new password for your internal account.',
            title: 'Create a new password'
          }
        }
      },
      home: {
        capabilitiesHeading: 'Mobile scope',
        capabilities: {
          myRequests: {
            title: 'My software and requests',
            description:
              'Employees view their software and requests, and submit or withdraw a simple request for catalog software.'
          },
          needApproval: {
            title: 'Need approval',
            description: 'Managers decide the need approval step for requests from their department.'
          },
          spendApproval: {
            title: 'Spending approval',
            description:
              'The spending approver decides one item at a time using a read-only budget snapshot, and handles the need step when a manager submits their own request.'
          },
          inbox: {
            title: 'In-app inbox',
            description: 'Users read workflow updates in the app without push notifications.'
          }
        },
        contractNote:
          'These are the four mobile tasks in BRD 3.53. The current OpenAPI snapshot only defines a system status endpoint, so business actions are not connected yet.',
        description: 'Native iOS and Android companion for the four workflows defined in the BRD.',
        openEmployeeDemo: 'Open employee demo',
        title: 'SaaS-Sentry on mobile'
      },
      manager: {
        spend: {
          title: 'Send to spending approver',
          hint: 'Paid requests of your department whose need is approved. Send them on in one batch.',
          empty: 'Nothing is waiting to be sent on.',
          emptyHint: 'Approved paid requests of your department appear here.',
          error: 'Could not load the queue. Please try again.',
          uncertain: 'Could not confirm the submission. Refresh the queue to check before trying again.',
          selectReady: 'Select all ready ({{count}})',
          budgetOutcomes: {
            WITHIN_BASE: 'Within the base budget',
            USES_RESERVE: 'Uses the reserve',
            BLOCKED: 'Blocked'
          },
          overBy: 'Over by {{amount}}',
          reserveReason: 'Reason for using the reserve (one line)',
          reserveReasonFor: 'Reserve reason for {{name}}',
          reservePlaceholder: 'Why the reserve is needed',
          reserveRequired: 'Give a one-line reason (up to 500 characters) for every request that uses the reserve.',
          reserveIgnored: 'The reason was ignored because this request does not use the reserve.',
          select: 'Select {{name}} requested by {{person}}',
          reference: 'Request: {{id}}',
          waited: 'Waiting {{days}} working days',
          submit: 'Send {{count}} to the spending approver',
          confirmTitle: 'Send {{count}} request(s) now?',
          confirmNote:
            'Each request is checked against the budget. Requests that fail stay in the queue with the reason.',
          sending: 'Sending…',
          confirmSend: 'Send now',
          sent: 'Batch sent with {{count}} request(s).',
          backToQueue: 'Back to the queue',
          stages: {
            NOT_SUBMITTED: 'Ready to send',
            RESERVE_CONFIRMATION: 'Needs your reserve confirmation',
            BLOCKED: 'Blocked',
            RETURNED_BY_FINANCE: 'Returned by Finance'
          },
          stopReasons: {
            STALE_COST_EVIDENCE: 'Price evidence is stale',
            CLOSED_OR_EXPIRED_BUDGET_PERIOD: 'Budget period closed',
            PRICE_MISSING: 'Price is missing',
            PRICE_EXPIRED: 'The price quote is no longer valid',
            NO_APPROVED_BUDGET: 'No approved budget in the current cost center',
            OVER_RESERVE: 'Over the reserve',
            RATE_MISSING: 'Exchange rate is missing'
          },
          outcomes: {
            SENT_TO_APPROVER: 'Sent to the spending approver',
            SENT_TO_FINANCE: 'Sent to Finance for review first',
            STOPPED: 'Stopped, stays in the queue',
            AWAITING_RESERVE_CONFIRMATION: 'Waiting for your reserve confirmation'
          }
        },
        group: {
          title: 'Request for people in your department',
          hint: 'Ask for one paid plan for two or more people in your department.',
          stepPlan: '1. Choose a plan',
          changePlan: 'Choose another plan',
          endDate: 'Use until',
          endDatePlaceholder: 'Pick a date (optional)',
          endDateOutOfRange: 'The date is too late. The latest is {{date}}.',
          manyPaid:
            '{{name}} uses {{count}} paid applications (threshold {{threshold}}). Explain why another is needed.',
          manyPaidFor: 'Reason for {{name}}',
          stepDetails: '2. Details for {{app}} · {{plan}}',
          stepPeople: '3. Choose people ({{count}} chosen)',
          searchPeople: 'Search people by name or email',
          noPeople: 'No people found.',
          peopleError: 'Could not load people. Please try again.',
          validation: 'Choose a plan, enter a reason and choose at least one person.',
          check: 'Check before sending',
          checking: 'Checking…',
          checkError: 'Could not check the request. Please try again.',
          checkTitle: 'Result of the check',
          planNotEligible: 'This plan does not take a group request.',
          tooMany: 'Too many people. The most allowed is {{max}}.',
          tooFew: 'Too few people. The least allowed is {{min}}.',
          termLimit: 'The term is too long. The most allowed is {{max}} months.',
          cost: 'Cost: {{total}} in all, {{each}} for each person.',
          hasSpend: 'It goes on to a spending decision after the need is confirmed.',
          noSpend: 'It has no spending step.',
          submit: 'Send the request',
          uncertain: 'Could not confirm the submission. Check your requests before trying again.',
          sent: 'Request sent.',
          openRequest: 'Open the request',
          another: 'Create another request',
          reasons: {
            SPENDING_APPROVER: 'Is the spending approver',
            OUTSIDE_DEPARTMENT: 'Not in your department',
            NOT_ACTIVE: 'No longer working here',
            EMAIL_REQUIRED: 'Has no work email',
            HAS_ACCESS: 'Already has this software',
            HAS_OPEN_REQUEST: 'Already has an open request',
            DUPLICATE_LINE: 'Listed twice',
            HEAD_IN_GROUP: 'The head is decided separately',
            TERM_REQUIRED: 'This plan needs a "Use until" date',
            OPEN_LIMIT_REACHED: 'Already has as many open requests as allowed',
            MANY_PAID_SOFTWARE_REASON_REQUIRED: 'Needs a reason for another paid application'
          }
        },
        live: {
          openQueue: 'Need approvals',
          backSoftware: 'Back to my software',
          backQueue: 'Back to assigned approvals',
          kicker: 'Assigned work',
          title: 'Need approvals',
          details: 'Review request',
          scope:
            'Individual requests assigned to you. Other request types and department-wide views are not available here.',
          loading: 'Loading approvals',
          queueError: 'Could not load assigned approvals. Please try again.',
          detailError: 'Could not load this request. It may no longer be assigned to you.',
          count: '{{formattedCount}} assigned requests',
          assignedLabel: 'Assigned individual requests',
          role: 'Department head',
          noScope: 'No active department-head assignment was returned. Refresh or contact your administrator.',
          urgentUnavailable: 'Urgent SLA count unavailable',
          urgentHint: 'Exact SLA time is not provided by the API.',
          spendTab: 'Send to approver',
          groupTab: 'Group request',
          personal: 'My software and requests',
          review: 'Review',
          refreshQueue: 'Refresh assigned requests',
          empty: 'No individual need decisions are assigned to you on this page.',
          openNamed: 'Review {{name}} requested by {{person}}',
          requester: 'Requested by: {{name}}',
          department: 'Department: {{name}}',
          departmentLabel: 'Department',
          profileError: 'Could not load your account. Please try again.',
          similarTitle: 'Existing access in the same functional group',
          similarLoading: 'Loading existing access',
          similarError: 'Could not load existing access. Please try again.',
          similarEmpty: 'No existing access in the same functional group.',
          cost: 'Estimated request amount',
          costNotApplicable: 'Not applicable',
          costMissing: 'Pricing is not available yet.',
          costUnavailable: 'Amount cannot be displayed. Check the web application.',
          due: 'Due: {{date}}',
          longTermBlocked:
            'Approval for terms over 12 months requires a confirmation not available in the current API. Use the web workflow or contact support.',
          stale: 'This step is no longer available for a decision. Return to the queue and refresh.',
          saved: 'The need decision was recorded. Return to the queue to see the latest assignments.',
          uncertain:
            'The decision could not be confirmed. Return to the queue and check the request before trying again.',
          reject: 'Reject',
          approve: 'Approve',
          confirmApprove: 'Approve this need?',
          confirmReject: 'Reject this need?',
          confirmNote:
            'This records a real decision on the server. The server checks authorization and current status.',
          rejectReason: 'Reason for rejection',
          reasonRequired: 'Enter a rejection reason of 1–1000 characters.',
          confirm: 'Confirm decision'
        },
        approveNeed: 'Approve need',
        approvedResult: 'Need approval recorded for {{id}}.',
        backToHome: 'Back to demo home',
        backToQueue: 'Back to department queue',
        budgetLink: 'Budget plan',
        businessReason: 'Business reason',
        cancel: 'Cancel',
        confirmApproval: 'Confirm need approval',
        confirmRejection: 'Confirm rejection',
        closeRejectSheet: 'Close rejection form',
        department: 'Department',
        departmentVisibleCount: 'Department-visible items',
        departmentVisibilityHint: 'Visible for context, but not assigned to your approval queue.',
        departmentVisibilityTitle: 'Department visibility · not assigned',
        demoActionNote: 'Demo only · this action stays in this session and is not sent to an API.',
        demoNote: 'Static demo data · SLA values are illustrative snapshots.',
        detailSubtitle: 'Review the work context and request conditions before deciding.',
        duration: '{{months}} months',
        durationLabel: 'Requested duration',
        emptyQueue: 'No requests are waiting for your decision.',
        emptyQueueHint: 'Completed demo decisions are removed from the assigned queue.',
        emptySearch: 'No requests match these filters.',
        emptySearchHint: 'Try a different employee, software name or request flag.',
        filters: {
          all: 'All',
          label: 'Filter department requests',
          longTerm: 'Over 12 months',
          outsideStandard: 'Outside standard'
        },
        initials: 'LH',
        kicker: 'Department head · demo',
        longTermConfirmation: 'I confirm this request is genuinely needed for more than 12 months for the project.',
        longTermFlag: 'OI-07a · Over 12 months',
        longTermNoticeBody:
          'Requests over 12 months need additional review (OI-07a). Confirm the extended need before approval.',
        longTermNoticeTitle: 'Extended duration review',
        managerMeta: 'Department head · CC-TECH',
        managerName: 'Lê Hoàng',
        assignedCount: 'Assigned to you',
        openRequest: 'Review request {{id}} for {{software}}',
        outsideStandard: 'Outside standard',
        outsideStandardDetail: 'Outside the standard toolset · the requester provided a business reason.',
        plannedBudget: 'Plan line {{plan}}',
        planUnavailable: 'Budget plan not provided in this demo',
        queueHint: 'Only requests assigned to the department head appear in this queue.',
        queueTitle: 'Assigned need approvals',
        requesterTitle: 'Employee and department context',
        reasons: {
          claude:
            'Development and research work needs an AI workspace for the requested 18-month period (demo reason).',
          raycast: 'The employee needs a productivity launcher for daily engineering workflows (demo reason).'
        },
        reject: 'Reject',
        rejectDescription: 'A rejection reason is required and will appear in the demo decision record.',
        rejectReasonLabel: 'Rejection reason',
        rejectReasonLength: '{{count}} / 10 characters minimum',
        rejectReasonPlaceholder: 'Explain why the business need is not approved',
        rejectTitle: 'Reject need',
        rejectedResult: 'Request {{id}} rejected in this demo.',
        rejectionSuggestions: {
          cost: 'The cost is not suitable for this project at this time.',
          projectTiming: 'The project has not reached the stage where this tool is needed.',
          standardAlternative: 'A suitable alternative is already available in the standard toolset.'
        },
        searchLabel: 'Search by employee, software or request ID',
        searchPlaceholder: 'Search department requests',
        slaRemainingDays: 'SLA · {{days}}d {{hours}}h remaining',
        slaRemainingHours: 'SLA · {{hours}}h remaining',
        slaTitle: 'Service-level target',
        slaUnavailable: 'SLA not provided in this demo',
        employeeVisibilityNote: 'Visible within your department; this item is not assigned to the need approval queue.',
        standardUnknown: 'Standard status not provided',
        statusUnavailable: 'Demo status unavailable',
        reasonUnavailable: 'No business reason provided in this demo.',
        standardTool: 'Standard toolset',
        subtitle: 'Review your department’s software needs and take assigned actions.',
        suggestionsTitle: 'Suggested reasons',
        tabs: {
          department: 'Department',
          queue: 'Queue'
        },
        title: 'Need approval queue',
        unplannedBudget: 'Outside the approved plan · demo',
        visibility: {
          otherApproved: {
            label: 'Need approved · department view',
            note: 'Need approval was recorded in this demo.'
          },
          otherRejected: {
            label: 'Rejected · department view',
            note: 'The manager rejected this need in this demo.'
          },
          needApproved: {
            label: 'Need approved · department view',
            note: 'The spending approver approved this self-request’s need step. Subsequent steps are not simulated.'
          },
          rejected: {
            label: 'Rejected · department view',
            note: 'The spending approver rejected this self-request’s need step.'
          },
          withdrawn: {
            label: 'Withdrawn · department view',
            note: 'The employee withdrew this request.'
          },
          financeReview: {
            label: 'Finance review · department view',
            note: 'Visible within your department. Finance is reviewing this request; it is not in the spending approver queue.'
          },
          selfRequest: {
            label: 'SoD-4 · self-request',
            note: 'This is the manager’s own request. Need review is routed to the spending approver; no manager decision is available here.'
          }
        }
      },
      spending: {
        tabs: {
          manager: 'Manager requests',
          spend: 'Spending'
        },
        role: 'Spending approver',
        noTerm: 'No "use until" date set',
        outcome: { WITHIN_BASE: 'Within the base budget', USES_RESERVE: 'Uses the reserve', BLOCKED: 'Blocked' },
        blockedReasons: {
          PRICE_EXPIRED: 'The price quote is no longer valid',
          NO_APPROVED_BUDGET: 'No approved budget in the current cost center',
          OVER_RESERVE: 'Over the reserve'
        },
        routing: { oneStep: 'One-step request' },
        kicker: 'Approvals assigned to you',
        title: 'Spending approvals',
        subtitle: 'Decide each item against its read-only budget snapshot. Batches and Finance work stay on the web.',
        profileError: 'Could not load your account. Retry or sign out.',
        retry: 'Retry',
        refresh: 'Refresh list',
        loading: 'Loading…',
        unnamed: 'Unnamed software',
        plan: 'Plan: {{plan}}',
        months: '{{count}} months',
        dateUnavailable: 'Date unavailable',
        costUnavailable: 'Not available',
        backToQueue: '← Back to the list',
        assignedLabel: '{{count}} assigned',
        card: {
          open: 'Review {{name}} requested by {{person}}',
          due: 'Due {{date}}'
        },
        spendQueue: {
          title: 'Spending to approve',
          hint: 'Paid requests that passed need approval and the budget check.',
          empty: 'Nothing waiting for your spending decision.',
          emptyHint: 'New items appear here as soon as they are assigned to you.',
          error: 'Could not load the spending queue. Please try again.'
        },
        managerQueue: {
          title: 'Manager requests',
          hint: 'A head’s own request goes to you as one step (need and spending together).',
          empty: 'No manager request is waiting for you.',
          emptyHint: 'Requests from heads, or from departments without a head, appear here.',
          error: 'Could not load manager requests. Please try again.'
        },
        manager: {
          oneStep: 'One-step request',
          sodNote: 'A head cannot approve their own request, so the need decision is yours.',
          department: 'Department',
          costNotApplicable: 'No cost for this request',
          costMissing: 'Price not yet recorded',
          longTermBlocked: 'A term over 12 months cannot be approved on mobile because the confirmation is missing.'
        },
        classification: {
          INTERNAL: 'Internal software',
          PAID_LICENSED: 'Paid licensed software'
        },
        controlLevel: {
          FULL: 'Fully controllable',
          PARTIAL: 'Partly controllable',
          UNCONTROLLABLE: 'Not controllable'
        },
        detail: {
          spendKicker: 'Spending decision',
          managerKicker: 'Manager request',
          error: 'Could not load the details. Please try again.',
          request: 'Request',
          reference: 'Reference',
          requester: 'Requested by',
          beneficiary: 'For',
          costCenter: 'Cost center',
          term: 'Term',
          reason: 'Business reason',
          due: 'Due date',
          cost: 'Cost',
          estimatedCost: 'Estimated cost',
          preTax: 'Before tax',
          tax: 'Tax',
          totalPayable: 'Total payable',
          noProfile: 'Estimated with the default price because no price profile is set.',
          assessment: 'IT assessment',
          classification: 'Software type',
          controlLevel: 'Control level',
          riskNote: 'Control risk note',
          needDecided: 'Need decision',
          decidedAt: 'Decided on',
          budgetBlocked: 'The budget check says this cannot be approved. The server decides again when you confirm.'
        },
        budget: {
          title: 'Budget snapshot',
          accessibleLabel: 'Read-only budget snapshot',
          readOnly: 'Read-only',
          readOnlyHint: 'Reference data from the latest check. It cannot be edited on mobile.',
          unavailable: 'No budget snapshot is available for this request.',
          year: 'Year {{year}}',
          base: 'Base budget',
          reserve: 'Reserve',
          committed: 'Committed',
          pending: 'Waiting for a decision',
          remainingBase: 'Left in the base',
          remainingWithReserve: 'Left with the reserve',
          overBase: 'Over the base by',
          overReserve: 'Over the reserve by',
          reserveConfirmed: 'Reserve confirmed by {{name}}',
          reserveUnconfirmed:
            'This request uses the reserve and the head has not confirmed it. The server may send it back.',
          loading: 'Loading the budget snapshot…',
          error: 'Could not load the budget snapshot. You can still decide; the server checks again.',
          bindingTotal: 'Binds {{amount}}',
          noYears: 'No year figures were recorded for this check.',
          yearLabel: 'Year {{year}}',
          budget: 'Budget',
          held: 'Held',
          spent: 'Spent',
          thisRequest: 'This request',
          remaining: 'Left after this request',
          noBudget: 'No budget for this year.',
          noFigure: '—'
        },
        decision: {
          approve: 'Approve',
          reject: 'Reject',
          confirmApprove: 'Approve this request?',
          confirmReject: 'Reject this request?',
          confirmNote: 'The decision is recorded as an approval record and cannot be changed.',
          reasonLabel: 'Reason for rejection',
          reasonPlaceholder: 'Write why you reject this request',
          reasonRequired: 'A reason of 1 to 1,000 characters is required.',
          cancel: 'Cancel',
          confirm: 'Confirm',
          sending: 'Sending…',
          saved: 'Decision saved. The list is refreshed.',
          stale: 'This item is no longer waiting for your decision. Go back and refresh the list.'
        },
        errors: {
          forbidden: 'You cannot decide this item. It is not assigned to you or it is your own request.',
          stale: 'This item was already decided or changed. Go back and refresh the list.',
          recheck: 'The request was checked again and went back to Finance or its head. Nothing was decided.',
          sod: 'You cannot decide a request whose Finance review you completed.',
          invalid: 'The decision was not accepted. Check the reason and try again from the list.',
          uncertain: 'Could not confirm the decision. Refresh the list to see the current status before trying again.'
        }
      },
      inbox: {
        live: {
          unreadCount: '{{formattedCount}} unread',
          countUnavailable: 'Unread count unavailable',
          countError: 'Could not load the unread count.',
          markAll: 'Mark all as read',
          markRead: 'Mark as read',
          markNamed: 'Mark {{code}} as read',
          loading: 'Loading notifications',
          loadError: 'Could not load notifications. Please try again.',
          writeError: 'Could not confirm the update. Check the inbox before trying again.',
          empty: 'No notifications on this page.',
          read: 'Read',
          unread: 'Unread',
          requestReference: 'Request: {{id}}',
          unknown: 'Other update ({{code}})',
          codes: {
            REQUEST_SUBMITTED: 'Request submitted',
            REQUEST_GRANTED: 'Access granted',
            REQUEST_NEED_APPROVED: 'Need approved',
            REQUEST_NEED_REJECTED: 'Need rejected',
            REQUEST_SPEND_APPROVED: 'Spending approved',
            REQUEST_SPEND_REJECTED: 'Spending rejected',
            STEP_ASSIGNED: 'A workflow step needs your attention',
            REQUEST_WITHDRAWN: 'Request withdrawn',
            HANDOVER_REQUIRED: 'A data handover needs confirmation'
          }
        },
        approverEmpty: 'No demo notifications are available for this role yet.',
        demoNote: 'Demo notifications only · no push notifications',
        items: {
          assignedNeed: {
            body: 'Request {{requestId}} was submitted for need review.',
            title: 'New need review'
          },
          withdrawn: {
            body: 'Request {{requestId}} was withdrawn by the employee.',
            title: 'Request withdrawn'
          },
          otherNeedApproved: {
            body: 'The need step for request {{requestId}} was approved by the spending approver.',
            title: 'Need approved'
          },
          otherRejected: {
            title: 'Need rejected'
          },
          needApproved: {
            body: 'The need for request {{requestId}} was approved and moved to manager submission on the web.',
            title: 'Need approved'
          },
          spendApproved: {
            body: 'Spending was approved for request {{requestId}} and it moved to waiting for IT.',
            title: 'Spending approved'
          },
          approved: {
            body: 'The need for request {{requestId}} was approved and then sent for Finance review.',
            title: 'Need approved'
          },
          expired: {
            body: 'The {{software}} license has expired.',
            title: 'License expired'
          },
          ready: {
            body: 'Request {{requestId}} for {{software}} was ready for IT to start provisioning.',
            title: 'Ready to provision'
          },
          rejected: {
            title: 'Request rejected'
          }
        },
        openNotification: 'Open notification about {{software}}',
        reasonUnavailable: 'The demo rejection reason is unavailable.',
        read: 'Read',
        title: 'Inbox',
        unread: 'Unread · {{count}}'
      },
      licenses: {
        live: {
          kicker: 'My workspace',
          description: 'Software rights held or starting later, from your account.',
          noDepartment: 'No department assigned',
          loading: 'Loading your account and software…',
          error: 'Could not load your information. Please check your connection and try again.',
          retry: 'Try again',
          total: '{{formattedCount}} rights',
          expiringTotal: '{{formattedCount}} rights',
          countUnavailable: 'Unavailable',
          currentRights: 'Current and upcoming',
          expiringLabel: 'Expiring within 7 days',
          summaryError: 'The expiring total could not be loaded.',
          unavailableHint: 'This feature is not connected yet.',
          pageFilterNote: 'The expiring filter applies only to the current page. Use the page controls to see more.',
          noExpiringPage: 'No expiring rights on this page.',
          emptyHint: 'Your assigned software will appear here when available.',
          empty: 'You do not have any current software rights.',
          emptyPage: 'There are no rights on this page.',
          dateUnavailable: 'Invalid date returned by the server',
          plan: 'Plan: {{plan}}',
          provisioning: 'Provisioning type: {{type}}',
          unknownStatus: 'Unknown server status: {{status}}',
          start: 'Effective from: {{date}}',
          end: 'Expected end: {{date}}',
          expiringSoon: 'Ending within seven days',
          previous: 'Previous',
          next: 'Next',
          page: 'Page {{page}}',
          otherFeatures: 'Approvals are not connected yet.',
          logout: 'Sign out',
          logoutError: 'Could not confirm sign out with the server. Check your connection and try again.',
          status: {
            UPCOMING: 'Upcoming',
            PROVISIONING: 'Provisioning',
            ACTIVE: 'Active',
            EXPIRED: 'Expired',
            REVOKING: 'Revoking',
            ENDING: 'Ending',
            ENDED: 'Ended'
          }
        },
        accessTypes: {
          licenseKey: 'License key (K4)',
          workspaceSeat: 'Workspace seat'
        },
        back: 'Back to my software',
        categories: {
          all: 'All',
          design: 'Design',
          development: 'Development',
          productivity: 'Productivity'
        },
        detail: {
          account: 'Company account',
          email: 'Company email',
          key: 'License key',
          keyMasked: 'Masked license key',
          noPassword: 'Passwords are not shown in this app.',
          status: 'Status',
          workspace: 'Workspace'
        },
        demoData: 'Demo data · not connected to live accounts',
        empty: 'No software found in this category.',
        activeCount: '{{count}} software',
        expiringCount: '{{count}} expiring',
        employeeDepartment: 'CC-TECH',
        employeeName: 'Nguyen Van A',
        employeeRole: 'Product Dev',
        filterLabel: 'Filter software',
        kicker: 'Employee workspace · demo',
        listFilters: {
          all: 'All software',
          expiring: 'Expiring'
        },
        listTitle: 'Your software',
        noExpiring: 'No software is marked as expiring in this demo.',
        openSoftware: 'Open {{name}} details',
        securityNote: 'One company account or seat per employee. Credentials are not shared (QĐ-75).',
        screenTitle: 'My software',
        screenSubtitle: 'Your company-provided software and access',
        status: {
          active: 'Active',
          expiring: 'Expires in {{days}} days'
        },
        summary: {
          active: 'Active',
          expiring: 'Expiring soon'
        }
      },
      requests: {
        createLive: {
          title: 'Request software',
          intro: 'Select a plan from the catalog, enter a reason and review the server preview before sending.',
          search: 'Search software or plans',
          loading: 'Loading catalog',
          catalogError: 'Could not load the catalog.',
          empty: 'No plans on this page.',
          choosePlan: 'Select {{app}}, {{plan}}',
          planBlocked: 'This plan cannot currently be submitted.',
          selected: '{{app}} · {{plan}}',
          changePlan: 'Choose another plan',
          endDate: 'Use until',
          endDatePlaceholder: 'Pick a date (optional)',
          endDateRequired: 'This plan needs a "Use until" date.',
          maxEndDate: 'It can be used until {{date}} at the latest.',
          openLimit: 'Open requests for new access: {{count}} of {{max}}.',
          refusal: {
            HAS_OPEN_REQUEST: 'You already have an open request for this plan.',
            OPEN_LIMIT_REACHED: 'You already have as many open requests as you may.'
          },
          manyPaid: 'You use {{count}} paid applications (threshold {{threshold}}). Explain why you need another.',
          manyPaidLabel: 'Reason for another paid application',
          term: 'Duration in months (1–12)',
          reason: 'Business reason (required)',
          validation: 'Enter a reason of 1–1000 characters.',
          preview: 'Review request',
          previewLoading: 'Checking request',
          previewError: 'Could not check the request. Please try again.',
          review: 'Server preview',
          canSubmit: 'The request can be submitted. The server will check again on submission.',
          cannotSubmit: 'This request cannot currently be submitted.',
          blockedCode: 'Blocked reason: {{reason}}',
          existingAccess: 'You already hold access to this software.',
          maxTerm: 'Maximum duration: {{months}} months',
          pricingBlocked: 'The spending step cannot proceed until pricing is available.',
          expectedDays: 'Estimated processing time: {{days}} working days',
          submit: 'Send request',
          sending: 'Sending request. Please wait.',
          submitUncertain:
            'The result could not be confirmed. Check your requests before trying again to avoid duplicates.',
          withdraw: 'Withdraw',
          withdrawNamed: 'Withdraw request for {{name}}',
          confirmWithdraw: 'Withdraw this request?',
          withdrawNote:
            'The server will check whether withdrawal is allowed. Some requests must wait for IT to close the task.',
          withdrawAction: 'Confirm withdrawal',
          withdrawSuccess: 'Withdrawal recorded. Check the current request status; it may still be waiting for IT.',
          withdrawError: 'The result could not be confirmed. Check the refreshed request status before trying again.'
        },
        live: {
          subtitle: 'Requests you sent, from your account.',
          views: { open: 'In progress', ended: 'Ended' },
          loading: 'Loading requests',
          listError: 'Could not load requests. Please try again.',
          detailError: 'Could not load this request. It may be unavailable to your account.',
          empty: 'No requests on this page.',
          unnamed: 'Software request',
          openNamed: 'Open request for {{name}}',
          submitted: 'Submitted: {{date}}',
          back: 'Back to requests',
          detailsTitle: 'Request details',
          noTerm: 'No "use until" date set',
          reviseOnWeb: 'This request was sent back for changes. Revise it on the web.',
          manyPaid: 'Reason for using {{count}} paid applications',
          involvement: { SENT: 'Sent by me', FOR_ME: 'For me' },
          routing: {
            DEFAULT: 'This request goes straight to the spending approver in one step.',
            REQUESTER_IS_HEAD: 'You head the department, so it goes straight to the spending approver in one step.',
            NO_DEPARTMENT_HEAD:
              'Your department has no head, so it goes straight to the spending approver in one step.',
            HEAD_LEFT: 'The head of your department left, so it goes straight to the spending approver in one step.'
          },
          spendStages: {
            NOT_SUBMITTED: 'Waiting to be sent for a spending decision',
            RETURNED_TO_REQUESTER: 'Returned to you for changes',
            RESERVE_CONFIRMATION: 'Waiting for the head to confirm use of the reserve',
            BLOCKED: 'Blocked by the budget check',
            WAITING_SPEND_DECISION: 'Waiting for the spending decision',
            REFUSED: 'Spending refused'
          },
          lineStates: {
            AWAITING_NEED: 'Your line: waiting for need approval',
            NEED_CONFIRMED: 'Your line: need confirmed',
            NEED_REJECTED: 'Your line: need rejected',
            SPEND_REJECTED: 'Your line: spending rejected',
            APPROVED: 'Your line: approved',
            EXECUTING: 'Your line: being set up',
            AWAITING_IT_CLOSE: 'Your line: waiting for IT to close',
            COMPLETED: 'Your line: completed',
            FAILED: 'Your line: failed',
            WITHDRAWN: 'Your line: withdrawn',
            DROPPED: 'Your line: dropped',
            CANCELLED: 'Your line: cancelled'
          },
          cost: 'Cost',
          progress: {
            title: 'Progress',
            steps: {
              submitted: 'Request sent',
              need: 'Need approval',
              spend: 'Spending approval',
              execution: 'IT carries it out'
            },
            status: {
              done: 'Done',
              current: 'In progress',
              pending: 'Not started',
              failed: 'Stopped',
              skipped: 'Not needed'
            },
            notes: {
              noDepartmentHead: 'your department has no head yet',
              noSpendingApprover: 'no spending approver is set',
              financeReview: 'Finance is reviewing it',
              budget: 'waiting for the budget',
              notRequired: 'not needed, you head the department',
              reserveConfirmation: 'waiting for the head to confirm the reserve',
              blocked: 'blocked by the budget check',
              revision: 'sent back to you for changes',
              spendSubmission: 'waiting to be sent to the spending approver',
              itAssessment: 'IT is assessing it'
            }
          },
          viewRequest: 'View request',
          reference: 'Request: {{id}}',
          reason: 'Business reason',
          term: 'Requested duration',
          months: '{{months}} months',
          requester: 'Requested by',
          beneficiary: 'For',
          needReason: 'Need decision reason',
          spendReason: 'Spending refusal reason',
          withdrawalReason: 'Withdrawal reason',
          draft: 'Draft',
          draftNote: 'Draft editing is not available on mobile yet.',
          unknownState: 'Other status ({{state}})',
          unknownType: 'Other request type ({{type}})',
          lineCount: '{{formattedCount}} request items',
          types: {
            GRANT: 'Software access',
            SERVICE_ACCOUNT: 'Service account',
            RENEWAL: 'Renewal',
            GROUP_GRANT: 'Group request'
          },
          states: {
            PENDING: 'Pending',
            WAITING_CONTROLLED: 'Waiting for control',
            AWAITING_EXECUTION: 'Waiting for execution',
            AWAITING_IT_ASSESSMENT: 'Waiting for IT assessment',
            AWAITING_SPEND_SUBMISSION: 'Waiting for spending submission',
            AWAITING_FINANCE_REVIEW: 'Waiting for Finance review',
            AWAITING_REQUESTER_REVISION: 'Sent back for changes',
            AWAITING_BUDGET: 'Waiting for budget',
            AWAITING_SPEND_DECISION: 'Waiting for spending decision',
            REJECTED: 'Rejected',
            IT_REJECTED: 'Rejected by IT',
            EXECUTING: 'In execution',
            COMPLETED: 'Completed',
            FAILED: 'Failed',
            AWAITING_IT_CLOSE: 'Waiting for IT to close withdrawal',
            WITHDRAWN: 'Withdrawn',
            CANCELLED: 'Cancelled'
          }
        },
        back: 'Back',
        backToSoftware: 'Back to my software',
        annualCost: '{{amount}} VND/year',
        catalogCount: '{{count}} items',
        catalogEmptyDescription: 'Try another software name or clear the search.',
        catalogEmptyTitle: 'No matching software',
        catalogFilters: 'Filter catalog',
        catalogHint: 'Choose a tool already included in the company catalog.',
        catalogSubtitle: 'Select a catalog tool and tell us how you will use it.',
        categories: {
          ai: 'AI tools',
          productivity: 'Productivity'
        },
        cancel: 'Keep request',
        chooseCatalogTool: 'Choose software from the catalog',
        chooseTool: 'Choose {{name}}',
        confirm: 'Withdraw request',
        confirmWithdraw: 'Withdraw request {{id}}?',
        cost: '{{amount}} VND',
        createNew: 'Request software',
        continue: 'Continue',
        detailsSubtitle: 'Choose a duration and explain the work need.',
        detailsTitle: 'Request details',
        demoData: 'Demo data · actions stay in this session only',
        duration: '{{months}} months',
        durationDefault: 'Standard period',
        durationExtended: 'Extended period',
        durationHint: 'Choose 12 or 18 months.',
        durationLabel: 'Requested duration',
        edit: 'Edit',
        estimatedCost: 'Estimated amount',
        errors: {
          reasonRequired: 'Add a business reason for software outside the standard toolset.'
        },
        financeReview: 'Finance review',
        filters: {
          all: 'All',
          outside: 'Outside standard',
          standard: 'Standard'
        },
        kicker: 'Employee request',
        listKicker: 'Employee workspace · demo',
        listSubtitle: 'Track your requests and review their current status.',
        managerName: 'Le Hoang',
        longTermWarning: 'OI-07a · Requests over 12 months need additional review.',
        newTitle: 'New software request',
        noDemoQuote: 'No demo quote provided',
        noMobileBatch:
          'Mobile does not submit spending batches. A manager may submit a batch on the web when applicable.',
        noBudgetCode: 'Budget check codes and balances are not shown. Rejected requests cannot be withdrawn.',
        notices: {
          financeReview: 'Finance is reviewing this request. It is not yet in the spending approver queue.',
          longTerm: 'OI-07a · 18-month request; additional review applies.',
          submittedWeb: 'Lê Hoàng submitted the spending batch on the web.'
        },
        rejectedBy: 'Rejected by manager {{name}} · {{date}}',
        rejectedBySpending: 'Rejected by spending approver {{name}} · {{date}}',
        rejectionReasons: {
          adobeBudgetOptimized:
            'The department budget has been optimized this quarter. Use Figma Pro or Canva Team from the standard toolset.'
        },
        openRequest: 'Open request {{id}} for {{name}}',
        outOfStandard: 'Outside the standard toolset',
        outOfStandardReason: 'A business reason is required for software outside the standard toolset.',
        personalOnly: 'This mobile request is for your own access only.',
        planReference: 'Plan reference',
        possibleSteps:
          'Possible steps: need review, web batch submission when applicable, Finance review when required, spending approval when required, and IT provisioning. The actual route depends on the request.',
        possibleStepsTitle: 'Possible review steps',
        personalAccess: 'For my own access',
        progress: 'Request progress: step {{current}} of {{total}}',
        reasonOptional: 'Optional for software in the standard toolset.',
        reasonLabel: 'Business reason',
        reasonPlaceholder: 'Describe how this software supports your work',
        review: 'Review request',
        reviewSubtitle: 'Check the request details before sending it for review.',
        reviewTitle: 'Review before submitting',
        requestFor: 'Request for',
        searchCatalog: 'Search software',
        selectedTool: 'Selected software',
        standardTool: 'Standard toolset',
        steps: {
          catalog: 'Catalog',
          details: 'Details',
          review: 'Review'
        },
        summaryTitle: 'Request summary',
        status: {
          awaitingExecution: 'Waiting for IT to start',
          awaitingManagerSubmission: 'Waiting for manager to submit',
          awaitingNeed: 'Waiting for need approval',
          completed: 'Completed',
          executing: 'IT is provisioning · cannot withdraw',
          financeReview: 'Finance review',
          provisioningFailed: 'Provisioning failed',
          rejected: 'Rejected',
          spendApproval: 'Waiting for spending approval',
          waitingInvitation: 'Waiting for invitation acceptance',
          withdrawn: 'Withdrawn'
        },
        submit: 'Submit request',
        submittedWeb: 'Submitted on the web',
        changeTool: 'Change',
        catalog: {
          descriptions: {
            claude: 'AI workspace for analysis, writing and coding tasks.',
            raycast: 'Productivity launcher for tools and everyday workflows.'
          }
        },
        timeline: {
          awaitingExecution: 'IT has not started provisioning yet',
          created: 'Request submitted',
          executionStarted: 'IT started provisioning',
          financeReview: 'Finance review started',
          needApproved: 'Need approved',
          needReviewPending: 'Waiting for need review',
          rejected: 'Request rejected',
          spendApproved: 'Spending approved',
          spendReviewPending: 'Waiting for spending decision',
          submittedWeb: 'Lê Hoàng submitted the spending batch on the web',
          withdrawn: 'Request withdrawn'
        },
        timelineTitle: 'Request timeline',
        title: 'My requests',
        withdraw: 'Withdraw',
        withdrawPolicy:
          'Withdraw while pending approval, awaiting execution, failed, or waiting for an invitation. Do not withdraw while provisioning or after completion. A queue shows assigned work, not the full visibility scope.',
        withdrawNamed: 'Withdraw request {{id}}',
        withdrawResult: 'The request will be marked withdrawn in this demo.',
        withdrawn: 'Withdrawn',
        standard: 'Standard toolset'
      }
    }
  },
  vi: {
    translation: {
      common: {
        back: 'Quay lại',
        datePicker: {
          title: 'Chọn ngày từ lịch',
          clear: 'Xóa ngày',
          close: 'Đóng',
          today: 'Hôm nay',
          previousMonth: 'Tháng trước',
          nextMonth: 'Tháng sau'
        },
        brand: 'SAAS-SENTRY MOBILE',
        brandInitial: 'S',
        brandName: 'SaaS-Sentry',
        demo: 'giả lập',
        demoDecisionError: 'Yêu cầu demo không còn hợp lệ cho thao tác này. Vui lòng xem lại trạng thái hiện tại.',
        language: {
          english: 'Tiếng Anh',
          englishShort: 'EN',
          selector: 'Ngôn ngữ',
          switchTo: 'Chuyển sang {{language}}',
          vietnamese: 'Tiếng Việt',
          vietnameseShort: 'VI'
        }
      },
      navigation: {
        createRequest: 'Tạo yêu cầu',
        inbox: 'Thông báo',
        openTab: 'Mở mục {{tab}}',
        requests: 'Yêu cầu',
        software: 'Phần mềm',
        tabs: 'Điều hướng chính'
      },
      auth: {
        back: 'Quay lại',
        profileLoading: 'Đang tải thông tin tài khoản…',
        profileError: 'Không thể tải thông tin tài khoản. Hãy thử lại hoặc đăng xuất.',
        demoNote: 'UF-17 / QĐ-46a: email và mật khẩu nội bộ, không đăng nhập qua nhà cung cấp ngoài. Dữ liệu giả lập.',
        email: 'Email công ty',
        emailPlaceholder: 'ten@company.tech',
        forgotPassword: 'Quên mật khẩu?',
        recoveryUnavailable: 'Đặt lại mật khẩu chưa có trên ứng dụng. Vui lòng sử dụng trang web.',
        loading: 'Vui lòng đợi…',
        errors: {
          credentials: 'Vui lòng kiểm tra email và mật khẩu.',
          rateLimit: 'Quá nhiều lần thử. Vui lòng đợi rồi thử lại.',
          general: 'Không thể đăng nhập. Kiểm tra kết nối và thử lại.',
          configuration: 'Địa chỉ API của ứng dụng không hợp lệ hoặc không an toàn. Vui lòng liên hệ quản trị viên.',
          restore: 'Không thể khôi phục phiên trước. Vui lòng đăng nhập lại.'
        },
        login: 'Đăng nhập',
        loginTitle: 'Đăng nhập tài khoản nội bộ',
        password: 'Mật khẩu',
        passwordPlaceholder: 'Nhập mật khẩu',
        recovery: {
          backToLogin: 'Về đăng nhập',
          done: {
            description: 'Mật khẩu giả lập đã được cập nhật. Bạn có thể quay lại đăng nhập.',
            title: 'Đã cập nhật mật khẩu'
          },
          email: {
            description: 'Nhập email công ty để nhận hướng dẫn đặt lại mật khẩu.',
            title: 'Đặt lại mật khẩu'
          },
          newPassword: 'Mật khẩu mới',
          openLink: 'Mở liên kết đặt lại giả lập',
          resetButton: 'Đặt mật khẩu mới',
          send: 'Gửi hướng dẫn',
          sent: {
            description:
              'Nếu email khớp với tài khoản, hướng dẫn đặt lại sẽ được gửi. Phản hồi này giống nhau với mọi địa chỉ.',
            title: 'Kiểm tra email'
          },
          passwordStep: {
            description: 'Chọn mật khẩu mới cho tài khoản nội bộ.',
            title: 'Tạo mật khẩu mới'
          }
        }
      },
      home: {
        capabilitiesHeading: 'Phạm vi Mobile',
        capabilities: {
          myRequests: {
            title: 'Phần mềm và yêu cầu của tôi',
            description:
              'Nhân viên xem phần mềm, yêu cầu của mình và gửi hoặc rút yêu cầu đơn giản cho phần mềm đã có trong danh mục.'
          },
          needApproval: {
            title: 'Duyệt nhu cầu',
            description: 'Trưởng phòng quyết định bước duyệt nhu cầu cho yêu cầu của phòng mình.'
          },
          spendApproval: {
            title: 'Duyệt chi',
            description:
              'Người duyệt chi quyết định từng mục trên snapshot ngân sách chỉ đọc, đồng thời duyệt bước nhu cầu khi trưởng phòng tự gửi yêu cầu.'
          },
          inbox: {
            title: 'Hộp thông báo trong ứng dụng',
            description: 'Người dùng xem cập nhật quy trình trong ứng dụng, không dùng thông báo đẩy.'
          }
        },
        contractNote:
          'Đây là bốn tác vụ mobile của BRD 3.53. OpenAPI hiện chỉ có endpoint trạng thái hệ thống nên các thao tác nghiệp vụ chưa được kết nối.',
        description: 'Ứng dụng native iOS và Android cho bốn luồng được xác định trong BRD.',
        openEmployeeDemo: 'Mở demo nhân viên',
        title: 'SaaS-Sentry trên di động'
      },
      manager: {
        spend: {
          title: 'Trình lên người duyệt chi',
          hint: 'Yêu cầu trả phí của phòng đã được duyệt nhu cầu. Trình đi theo một lô.',
          empty: 'Không có yêu cầu nào chờ trình.',
          emptyHint: 'Yêu cầu trả phí đã duyệt nhu cầu của phòng sẽ hiện ở đây.',
          error: 'Không tải được hàng đợi. Vui lòng thử lại.',
          uncertain: 'Chưa xác nhận được việc trình. Hãy làm mới hàng đợi để kiểm tra trước khi thử lại.',
          selectReady: 'Chọn tất cả mục sẵn sàng ({{count}})',
          budgetOutcomes: { WITHIN_BASE: 'Trong ngân sách cơ sở', USES_RESERVE: 'Dùng dự phòng', BLOCKED: 'Bị chặn' },
          overBy: 'Vượt {{amount}}',
          reserveReason: 'Lý do dùng dự phòng (một dòng)',
          reserveReasonFor: 'Lý do dùng dự phòng cho {{name}}',
          reservePlaceholder: 'Vì sao cần dùng dự phòng',
          reserveRequired: 'Hãy nhập lý do một dòng (tối đa 500 ký tự) cho mọi yêu cầu dùng dự phòng.',
          reserveIgnored: 'Lý do bị bỏ qua vì yêu cầu này không dùng dự phòng.',
          select: 'Chọn {{name}} do {{person}} yêu cầu',
          reference: 'Yêu cầu: {{id}}',
          waited: 'Đã chờ {{days}} ngày làm việc',
          submit: 'Trình {{count}} yêu cầu lên người duyệt chi',
          confirmTitle: 'Trình {{count}} yêu cầu ngay bây giờ?',
          confirmNote: 'Mỗi yêu cầu được kiểm tra với ngân sách. Yêu cầu không đạt sẽ ở lại hàng đợi kèm lý do.',
          sending: 'Đang gửi…',
          confirmSend: 'Gửi ngay',
          sent: 'Đã gửi lô gồm {{count}} yêu cầu.',
          backToQueue: 'Về hàng đợi',
          stages: {
            NOT_SUBMITTED: 'Sẵn sàng trình',
            RESERVE_CONFIRMATION: 'Cần bạn xác nhận dùng dự phòng',
            BLOCKED: 'Đang bị chặn',
            RETURNED_BY_FINANCE: 'Finance trả về'
          },
          stopReasons: {
            STALE_COST_EVIDENCE: 'Bằng chứng giá đã cũ',
            CLOSED_OR_EXPIRED_BUDGET_PERIOD: 'Kỳ ngân sách đã đóng',
            PRICE_MISSING: 'Thiếu giá',
            PRICE_EXPIRED: 'Báo giá không còn hiệu lực',
            NO_APPROVED_BUDGET: 'Cost center hiện tại chưa có ngân sách đã duyệt',
            OVER_RESERVE: 'Vượt quá dự phòng',
            RATE_MISSING: 'Thiếu tỷ giá'
          },
          outcomes: {
            SENT_TO_APPROVER: 'Đã chuyển tới người duyệt chi',
            SENT_TO_FINANCE: 'Chuyển Finance rà soát trước',
            STOPPED: 'Bị dừng, ở lại hàng đợi',
            AWAITING_RESERVE_CONFIRMATION: 'Chờ bạn xác nhận dùng dự phòng'
          }
        },
        group: {
          title: 'Yêu cầu cho người trong phòng',
          hint: 'Xin một gói trả phí cho từ hai người trở lên trong phòng của bạn.',
          stepPlan: '1. Chọn gói',
          changePlan: 'Chọn gói khác',
          endDate: 'Dùng đến ngày',
          endDatePlaceholder: 'Chọn ngày (không bắt buộc)',
          endDateOutOfRange: 'Ngày dùng đến quá muộn. Muộn nhất là {{date}}.',
          manyPaid:
            '{{name}} đang dùng {{count}} phần mềm trả phí (ngưỡng {{threshold}}). Hãy giải thích vì sao cần thêm.',
          manyPaidFor: 'Lý do cho {{name}}',
          stepDetails: '2. Chi tiết cho {{app}} · {{plan}}',
          stepPeople: '3. Chọn người ({{count}} người đã chọn)',
          searchPeople: 'Tìm người theo tên hoặc email',
          noPeople: 'Không tìm thấy ai.',
          peopleError: 'Không tải được danh sách người. Vui lòng thử lại.',
          validation: 'Hãy chọn gói, nhập lý do và chọn ít nhất một người.',
          check: 'Kiểm tra trước khi gửi',
          checking: 'Đang kiểm tra…',
          checkError: 'Không kiểm tra được yêu cầu. Vui lòng thử lại.',
          checkTitle: 'Kết quả kiểm tra',
          planNotEligible: 'Gói này không nhận yêu cầu cho nhóm.',
          tooMany: 'Quá nhiều người. Tối đa {{max}} người.',
          tooFew: 'Quá ít người. Tối thiểu {{min}} người.',
          termLimit: 'Thời hạn quá dài. Tối đa {{max}} tháng.',
          cost: 'Chi phí: tổng {{total}}, mỗi người {{each}}.',
          hasSpend: 'Sau khi xác nhận nhu cầu, yêu cầu đi tiếp tới bước quyết định chi.',
          noSpend: 'Yêu cầu này không có bước duyệt chi.',
          submit: 'Gửi yêu cầu',
          uncertain: 'Chưa xác nhận được việc gửi. Hãy kiểm tra danh sách yêu cầu trước khi thử lại.',
          sent: 'Đã gửi yêu cầu.',
          openRequest: 'Mở yêu cầu',
          another: 'Tạo yêu cầu khác',
          reasons: {
            SPENDING_APPROVER: 'Là người duyệt chi',
            OUTSIDE_DEPARTMENT: 'Không thuộc phòng của bạn',
            NOT_ACTIVE: 'Đã nghỉ việc',
            EMAIL_REQUIRED: 'Chưa có email công việc',
            HAS_ACCESS: 'Đã có phần mềm này',
            HAS_OPEN_REQUEST: 'Đang có yêu cầu mở',
            DUPLICATE_LINE: 'Bị chọn hai lần',
            HEAD_IN_GROUP: 'Trưởng phòng được quyết riêng',
            TERM_REQUIRED: 'Gói này cần chọn ngày "Dùng đến ngày"',
            OPEN_LIMIT_REACHED: 'Đã có số yêu cầu mở tối đa',
            MANY_PAID_SOFTWARE_REASON_REQUIRED: 'Cần lý do cho phần mềm trả phí thêm'
          }
        },
        live: {
          openQueue: 'Duyệt nhu cầu',
          backSoftware: 'Về phần mềm của tôi',
          backQueue: 'Về danh sách được giao',
          kicker: 'Công việc được giao',
          title: 'Duyệt nhu cầu',
          details: 'Xem yêu cầu',
          scope: 'Yêu cầu cá nhân được giao cho bạn. Các loại yêu cầu khác và danh sách toàn phòng chưa có tại đây.',
          loading: 'Đang tải yêu cầu cần duyệt',
          queueError: 'Không thể tải danh sách được giao. Vui lòng thử lại.',
          detailError: 'Không thể tải yêu cầu này. Yêu cầu có thể không còn được giao cho bạn.',
          count: '{{formattedCount}} yêu cầu được giao',
          assignedLabel: 'Yêu cầu cá nhân được giao',
          role: 'Trưởng phòng',
          noScope: 'Tài khoản chưa có phạm vi trưởng phòng đang hiệu lực. Hãy tải lại hoặc liên hệ quản trị viên.',
          urgentUnavailable: 'Chưa có số đơn gấp',
          urgentHint: 'API chưa cung cấp thời điểm SLA chính xác.',
          spendTab: 'Trình chi',
          groupTab: 'Yêu cầu nhóm',
          personal: 'Phần mềm và yêu cầu của tôi',
          review: 'Thẩm định',
          refreshQueue: 'Làm mới yêu cầu được giao',
          empty: 'Không có yêu cầu cá nhân cần bạn duyệt trên trang này.',
          openNamed: 'Xem {{name}} do {{person}} yêu cầu',
          requester: 'Người gửi: {{name}}',
          department: 'Phòng ban: {{name}}',
          departmentLabel: 'Phòng ban',
          profileError: 'Không thể tải thông tin tài khoản. Vui lòng thử lại.',
          similarTitle: 'Quyền hiện có cùng nhóm chức năng',
          similarLoading: 'Đang tải quyền hiện có',
          similarError: 'Không thể tải quyền hiện có. Vui lòng thử lại.',
          similarEmpty: 'Không có quyền hiện có cùng nhóm chức năng.',
          cost: 'Số tiền dự kiến của yêu cầu',
          costNotApplicable: 'Không áp dụng',
          costMissing: 'Chưa có thông tin giá.',
          costUnavailable: 'Không thể hiển thị số tiền. Hãy xem trên web.',
          due: 'Hạn xử lý: {{date}}',
          longTermBlocked:
            'Duyệt thời hạn trên 12 tháng cần xác nhận chưa có trong API hiện tại. Hãy dùng web hoặc liên hệ hỗ trợ.',
          stale: 'Bước này không còn sẵn sàng để quyết định. Hãy quay lại và tải mới danh sách.',
          saved: 'Đã ghi nhận quyết định nhu cầu. Quay lại danh sách để xem các việc được giao mới nhất.',
          uncertain: 'Chưa thể xác nhận quyết định. Hãy quay lại danh sách và kiểm tra trước khi thử lại.',
          reject: 'Từ chối',
          approve: 'Duyệt nhu cầu',
          confirmApprove: 'Duyệt nhu cầu này?',
          confirmReject: 'Từ chối nhu cầu này?',
          confirmNote: 'Thao tác này ghi quyết định thật trên máy chủ. Máy chủ kiểm tra quyền và trạng thái hiện tại.',
          rejectReason: 'Lý do từ chối',
          reasonRequired: 'Nhập lý do từ chối từ 1 đến 1000 ký tự.',
          confirm: 'Xác nhận quyết định'
        },
        approveNeed: 'Duyệt nhu cầu',
        approvedResult: 'Đã ghi nhận duyệt nhu cầu cho {{id}}.',
        backToHome: 'Về trang demo',
        backToQueue: 'Về hàng đợi phòng ban',
        budgetLink: 'Kế hoạch ngân sách',
        businessReason: 'Lý do nghiệp vụ',
        cancel: 'Hủy',
        confirmApproval: 'Xác nhận duyệt nhu cầu',
        confirmRejection: 'Xác nhận từ chối',
        closeRejectSheet: 'Đóng biểu mẫu từ chối',
        department: 'Phòng ban',
        departmentVisibleCount: 'Mục phòng ban có thể xem',
        departmentVisibilityHint: 'Có thể xem để nắm tình hình nhưng không được giao cho bạn xử lý.',
        departmentVisibilityTitle: 'Phạm vi phòng ban · không được giao',
        demoActionNote: 'Chỉ là demo · thao tác lưu trong phiên này, chưa gửi lên API.',
        demoNote: 'Dữ liệu tĩnh · SLA là ảnh chụp minh họa.',
        detailSubtitle: 'Xem bối cảnh công việc và điều kiện yêu cầu trước khi quyết định.',
        duration: '{{months}} tháng',
        durationLabel: 'Thời hạn đề nghị',
        emptyQueue: 'Không có yêu cầu đang chờ bạn quyết định.',
        emptyQueueHint: 'Yêu cầu đã xử lý trong demo được gỡ khỏi hàng đợi được giao.',
        emptySearch: 'Không có yêu cầu khớp bộ lọc.',
        emptySearchHint: 'Thử tên nhân viên, phần mềm hoặc cờ yêu cầu khác.',
        filters: {
          all: 'Tất cả',
          label: 'Lọc yêu cầu phòng ban',
          longTerm: 'Trên 12 tháng',
          outsideStandard: 'Ngoài bộ chuẩn'
        },
        initials: 'LH',
        kicker: 'Trưởng phòng · demo',
        longTermConfirmation: 'Tôi xác nhận nhu cầu này thực sự cần thiết kéo dài trên 12 tháng cho dự án.',
        longTermFlag: 'OI-07a · Trên 12 tháng',
        longTermNoticeBody:
          'Yêu cầu trên 12 tháng cần rà soát bổ sung (OI-07a). Hãy xác nhận nhu cầu kéo dài trước khi duyệt.',
        longTermNoticeTitle: 'Rà soát thời hạn dài',
        managerMeta: 'Trưởng phòng · CC-TECH',
        managerName: 'Lê Hoàng',
        assignedCount: 'Được giao cho bạn',
        openRequest: 'Xem yêu cầu {{id}} cho {{software}}',
        outsideStandard: 'Ngoài bộ chuẩn',
        outsideStandardDetail: 'Ngoài bộ công cụ chuẩn · nhân viên đã cung cấp lý do nghiệp vụ.',
        plannedBudget: 'Dòng kế hoạch {{plan}}',
        planUnavailable: 'Chưa có thông tin kế hoạch ngân sách trong demo',
        queueHint: 'Chỉ yêu cầu được giao cho trưởng phòng mới xuất hiện trong hàng đợi này.',
        queueTitle: 'Yêu cầu chờ duyệt nhu cầu',
        requesterTitle: 'Nhân viên và bối cảnh phòng ban',
        reasons: {
          claude: 'Nhu cầu công việc phát triển và nghiên cứu cần workspace AI trong thời hạn 18 tháng (lý do demo).',
          raycast: 'Nhân viên cần công cụ khởi chạy để hỗ trợ quy trình kỹ thuật hằng ngày (lý do demo).'
        },
        reject: 'Từ chối',
        rejectDescription: 'Cần có lý do từ chối; lý do sẽ xuất hiện trong bản ghi quyết định demo.',
        rejectReasonLabel: 'Lý do từ chối',
        rejectReasonLength: '{{count}} / tối thiểu 10 ký tự',
        rejectReasonPlaceholder: 'Giải thích vì sao nhu cầu công việc không được duyệt',
        rejectTitle: 'Từ chối nhu cầu',
        rejectedResult: 'Đã ghi nhận từ chối yêu cầu {{id}} trong demo.',
        rejectionSuggestions: {
          cost: 'Chi phí hiện chưa phù hợp với dự án này.',
          projectTiming: 'Dự án chưa đến giai đoạn cần công cụ này.',
          standardAlternative: 'Bộ công cụ chuẩn đã có phần mềm phù hợp để thay thế.'
        },
        searchLabel: 'Tìm theo nhân viên, phần mềm hoặc mã yêu cầu',
        searchPlaceholder: 'Tìm yêu cầu phòng ban',
        slaRemainingDays: 'SLA · còn {{days}} ngày {{hours}} giờ',
        slaRemainingHours: 'SLA · còn {{hours}} giờ',
        slaTitle: 'Thời hạn xử lý',
        slaUnavailable: 'Chưa có SLA trong dữ liệu demo',
        employeeVisibilityNote: 'Yêu cầu thuộc phạm vi phòng ban; hiện không nằm trong hàng đợi duyệt nhu cầu.',
        standardUnknown: 'Chưa có thông tin bộ chuẩn',
        statusUnavailable: 'Chưa có trạng thái demo',
        reasonUnavailable: 'Dữ liệu demo chưa có lý do nghiệp vụ.',
        standardTool: 'Bộ công cụ chuẩn',
        subtitle: 'Rà soát nhu cầu phần mềm của phòng và xử lý các mục được giao.',
        suggestionsTitle: 'Lý do gợi ý',
        tabs: {
          department: 'Phòng ban',
          queue: 'Hàng đợi'
        },
        title: 'Hàng đợi duyệt nhu cầu',
        unplannedBudget: 'Ngoài kế hoạch đã duyệt · demo',
        visibility: {
          otherApproved: {
            label: 'Đã duyệt nhu cầu · phạm vi phòng',
            note: 'Đã ghi nhận duyệt nhu cầu trong phiên demo.'
          },
          otherRejected: {
            label: 'Đã từ chối · phạm vi phòng',
            note: 'Trưởng phòng đã từ chối nhu cầu trong phiên demo.'
          },
          needApproved: {
            label: 'Đã duyệt nhu cầu · phạm vi phòng',
            note: 'Người duyệt chi đã duyệt bước nhu cầu của yêu cầu tự gửi. Các bước tiếp theo chưa được mô phỏng.'
          },
          rejected: {
            label: 'Đã từ chối · phạm vi phòng',
            note: 'Người duyệt chi đã từ chối bước nhu cầu của yêu cầu tự gửi.'
          },
          withdrawn: {
            label: 'Đã rút · phạm vi phòng',
            note: 'Nhân viên đã rút yêu cầu này.'
          },
          financeReview: {
            label: 'Finance rà soát · phạm vi phòng',
            note: 'Trưởng phòng xem được trong phạm vi phòng ban. Finance đang rà soát; yêu cầu chưa vào hàng đợi Người duyệt chi.'
          },
          selfRequest: {
            label: 'SoD-4 · yêu cầu của chính mình',
            note: 'Đây là yêu cầu của trưởng phòng. Bước duyệt nhu cầu được chuyển cho Người duyệt chi; trưởng phòng không thể tự quyết ở đây.'
          }
        }
      },
      spending: {
        tabs: {
          manager: 'Yêu cầu trưởng phòng',
          spend: 'Duyệt chi'
        },
        role: 'Người duyệt chi',
        noTerm: 'Chưa đặt ngày dùng đến',
        outcome: { WITHIN_BASE: 'Trong ngân sách cơ sở', USES_RESERVE: 'Dùng dự phòng', BLOCKED: 'Bị chặn' },
        blockedReasons: {
          PRICE_EXPIRED: 'Báo giá không còn hiệu lực',
          NO_APPROVED_BUDGET: 'Cost center hiện tại chưa có ngân sách đã duyệt',
          OVER_RESERVE: 'Vượt quá dự phòng'
        },
        routing: { oneStep: 'Yêu cầu một bước' },
        kicker: 'Việc được giao cho bạn',
        title: 'Phê duyệt chi',
        subtitle: 'Quyết định từng mục dựa trên snapshot ngân sách chỉ đọc. Lô và việc của Finance chỉ làm trên web.',
        profileError: 'Không tải được tài khoản. Hãy thử lại hoặc đăng xuất.',
        retry: 'Thử lại',
        refresh: 'Làm mới danh sách',
        loading: 'Đang tải…',
        unnamed: 'Phần mềm chưa có tên',
        plan: 'Gói: {{plan}}',
        months: '{{count}} tháng',
        dateUnavailable: 'Chưa có ngày',
        costUnavailable: 'Chưa có',
        backToQueue: '← Về danh sách',
        assignedLabel: '{{count}} mục được giao',
        card: {
          open: 'Xem {{name}} do {{person}} yêu cầu',
          due: 'Hạn {{date}}'
        },
        spendQueue: {
          title: 'Cần duyệt chi',
          hint: 'Yêu cầu trả phí đã qua bước nhu cầu và kiểm tra ngân sách.',
          empty: 'Không có mục nào chờ bạn duyệt chi.',
          emptyHint: 'Mục mới sẽ xuất hiện ngay khi được giao cho bạn.',
          error: 'Không tải được hàng đợi duyệt chi. Vui lòng thử lại.'
        },
        managerQueue: {
          title: 'Yêu cầu của trưởng phòng',
          hint: 'Yêu cầu của chính trưởng phòng chuyển tới bạn một bước (nhu cầu và chi gộp lại).',
          empty: 'Không có yêu cầu của trưởng phòng nào chờ bạn.',
          emptyHint: 'Yêu cầu của trưởng phòng, hoặc của phòng chưa có trưởng phòng, sẽ hiện ở đây.',
          error: 'Không tải được yêu cầu của trưởng phòng. Vui lòng thử lại.'
        },
        manager: {
          oneStep: 'Yêu cầu một bước',
          sodNote: 'Trưởng phòng không tự duyệt yêu cầu của mình nên bước nhu cầu do bạn quyết.',
          department: 'Phòng ban',
          costNotApplicable: 'Yêu cầu này không có chi phí',
          costMissing: 'Chưa ghi nhận giá',
          longTermBlocked: 'Thời hạn trên 12 tháng chưa thể duyệt trên mobile vì thiếu xác nhận cần có.'
        },
        classification: {
          INTERNAL: 'Phần mềm nội bộ',
          PAID_LICENSED: 'Phần mềm trả phí có bản quyền'
        },
        controlLevel: {
          FULL: 'Kiểm soát đầy đủ',
          PARTIAL: 'Kiểm soát một phần',
          UNCONTROLLABLE: 'Không kiểm soát được'
        },
        detail: {
          spendKicker: 'Quyết định chi',
          managerKicker: 'Yêu cầu của trưởng phòng',
          error: 'Không tải được chi tiết. Vui lòng thử lại.',
          request: 'Yêu cầu',
          reference: 'Mã yêu cầu',
          requester: 'Người yêu cầu',
          beneficiary: 'Người thụ hưởng',
          costCenter: 'Cost center',
          term: 'Thời hạn',
          reason: 'Lý do nghiệp vụ',
          due: 'Hạn xử lý',
          cost: 'Chi phí',
          estimatedCost: 'Chi phí ước tính',
          preTax: 'Trước thuế',
          tax: 'Thuế',
          totalPayable: 'Tổng phải trả',
          noProfile: 'Ước tính theo giá mặc định vì chưa có hồ sơ giá.',
          assessment: 'Đánh giá của IT',
          classification: 'Loại phần mềm',
          controlLevel: 'Mức kiểm soát',
          riskNote: 'Ghi chú rủi ro kiểm soát',
          needDecided: 'Quyết định nhu cầu',
          decidedAt: 'Quyết định ngày',
          budgetBlocked:
            'Kiểm tra ngân sách cho thấy mục này không thể duyệt. Máy chủ sẽ kiểm tra lại khi bạn xác nhận.'
        },
        budget: {
          title: 'Snapshot ngân sách',
          accessibleLabel: 'Snapshot ngân sách chỉ đọc',
          readOnly: 'Chỉ đọc',
          readOnlyHint: 'Dữ liệu tham chiếu từ lần kiểm tra gần nhất, không sửa được trên mobile.',
          unavailable: 'Yêu cầu này chưa có snapshot ngân sách.',
          year: 'Năm {{year}}',
          base: 'Ngân sách cơ sở',
          reserve: 'Dự phòng',
          committed: 'Đã cam kết',
          pending: 'Đang chờ quyết định',
          remainingBase: 'Còn lại trong ngân sách cơ sở',
          remainingWithReserve: 'Còn lại gồm cả dự phòng',
          overBase: 'Vượt ngân sách cơ sở',
          overReserve: 'Vượt dự phòng',
          reserveConfirmed: 'Trưởng phòng {{name}} đã xác nhận dùng dự phòng',
          reserveUnconfirmed:
            'Yêu cầu này dùng dự phòng nhưng trưởng phòng chưa xác nhận. Máy chủ có thể trả yêu cầu về.',
          loading: 'Đang tải snapshot ngân sách…',
          error: 'Không tải được snapshot ngân sách. Bạn vẫn quyết được; máy chủ sẽ kiểm tra lại.',
          bindingTotal: 'Ràng buộc {{amount}}',
          noYears: 'Lần kiểm tra này chưa ghi số liệu theo năm.',
          yearLabel: 'Năm {{year}}',
          budget: 'Ngân sách',
          held: 'Đang giữ',
          spent: 'Đã chi',
          thisRequest: 'Yêu cầu này',
          remaining: 'Còn lại sau yêu cầu này',
          noBudget: 'Năm này chưa có ngân sách.',
          noFigure: '—'
        },
        decision: {
          approve: 'Duyệt',
          reject: 'Từ chối',
          confirmApprove: 'Duyệt yêu cầu này?',
          confirmReject: 'Từ chối yêu cầu này?',
          confirmNote: 'Quyết định được ghi thành bản ghi phê duyệt và không thể sửa.',
          reasonLabel: 'Lý do từ chối',
          reasonPlaceholder: 'Nhập lý do từ chối yêu cầu này',
          reasonRequired: 'Cần nhập lý do từ 1 đến 1.000 ký tự.',
          cancel: 'Hủy',
          confirm: 'Xác nhận',
          sending: 'Đang gửi…',
          saved: 'Đã lưu quyết định. Danh sách đã được làm mới.',
          stale: 'Mục này không còn chờ bạn quyết định. Hãy quay lại và làm mới danh sách.'
        },
        errors: {
          forbidden: 'Bạn không thể quyết mục này. Mục không được giao cho bạn hoặc là yêu cầu của chính bạn.',
          stale: 'Mục này đã được quyết hoặc đã thay đổi. Hãy quay lại và làm mới danh sách.',
          recheck: 'Yêu cầu được kiểm tra lại và quay về Finance hoặc trưởng phòng. Chưa có quyết định nào được lưu.',
          sod: 'Bạn không thể quyết yêu cầu mà bạn đã hoàn tất rà soát Finance.',
          invalid: 'Quyết định không được chấp nhận. Kiểm tra lý do rồi thử lại từ danh sách.',
          uncertain:
            'Chưa xác nhận được quyết định. Hãy làm mới danh sách để xem trạng thái hiện tại trước khi thử lại.'
        }
      },
      inbox: {
        live: {
          unreadCount: '{{formattedCount}} thông báo chưa đọc',
          countUnavailable: 'Chưa có số thông báo chưa đọc',
          countError: 'Không thể tải số thông báo chưa đọc.',
          markAll: 'Đánh dấu tất cả đã đọc',
          markRead: 'Đánh dấu đã đọc',
          markNamed: 'Đánh dấu đã đọc: {{code}}',
          loading: 'Đang tải thông báo',
          loadError: 'Không thể tải thông báo. Vui lòng thử lại.',
          writeError: 'Chưa thể xác nhận kết quả. Hãy kiểm tra hộp thư trước khi thử lại.',
          empty: 'Không có thông báo trên trang này.',
          read: 'Đã đọc',
          unread: 'Chưa đọc',
          requestReference: 'Mã yêu cầu: {{id}}',
          unknown: 'Cập nhật khác ({{code}})',
          codes: {
            REQUEST_SUBMITTED: 'Yêu cầu đã được gửi',
            REQUEST_GRANTED: 'Đã cấp quyền sử dụng',
            REQUEST_NEED_APPROVED: 'Nhu cầu đã được duyệt',
            REQUEST_NEED_REJECTED: 'Nhu cầu đã bị từ chối',
            REQUEST_SPEND_APPROVED: 'Đề nghị chi đã được duyệt',
            REQUEST_SPEND_REJECTED: 'Đề nghị chi đã bị từ chối',
            STEP_ASSIGNED: 'Có bước xử lý được giao cho bạn',
            REQUEST_WITHDRAWN: 'Yêu cầu đã được rút',
            HANDOVER_REQUIRED: 'Cần xác nhận bàn giao dữ liệu'
          }
        },
        approverEmpty: 'Chưa có thông báo demo cho vai trò này.',
        demoNote: 'Thông báo giả lập · không có thông báo đẩy',
        items: {
          assignedNeed: {
            body: 'Yêu cầu {{requestId}} đã được gửi để duyệt nhu cầu.',
            title: 'Yêu cầu cần duyệt nhu cầu'
          },
          withdrawn: {
            body: 'Nhân viên đã rút yêu cầu {{requestId}}.',
            title: 'Yêu cầu đã rút'
          },
          otherNeedApproved: {
            body: 'Người duyệt chi đã duyệt bước nhu cầu của yêu cầu {{requestId}}.',
            title: 'Nhu cầu đã được duyệt'
          },
          otherRejected: {
            title: 'Nhu cầu bị từ chối'
          },
          needApproved: {
            body: 'Nhu cầu của yêu cầu {{requestId}} đã được duyệt và chuyển sang chờ trưởng phòng trình trên web.',
            title: 'Nhu cầu đã được duyệt'
          },
          spendApproved: {
            body: 'Yêu cầu {{requestId}} đã được duyệt chi và chuyển sang chờ IT.',
            title: 'Đã duyệt chi'
          },
          approved: {
            body: 'Nhu cầu của yêu cầu {{requestId}} đã được duyệt và chuyển sang Finance rà soát.',
            title: 'Nhu cầu đã được duyệt'
          },
          expired: {
            body: 'Giấy phép {{software}} đã hết hạn.',
            title: 'Giấy phép đã hết hạn'
          },
          ready: {
            body: 'Yêu cầu {{requestId}} cho {{software}} đã sẵn sàng để IT bắt đầu cấp phát.',
            title: 'Sẵn sàng cấp phát'
          },
          rejected: {
            title: 'Yêu cầu bị từ chối'
          }
        },
        openNotification: 'Mở thông báo về {{software}}',
        reasonUnavailable: 'Dữ liệu demo chưa có lý do từ chối.',
        read: 'Đã đọc',
        title: 'Thông báo',
        unread: 'Chưa đọc · {{count}}'
      },
      licenses: {
        live: {
          kicker: 'Không gian của tôi',
          description: 'Quyền phần mềm hiện có hoặc sắp bắt đầu của tài khoản bạn.',
          noDepartment: 'Chưa có phòng ban',
          loading: 'Đang tải tài khoản và phần mềm…',
          error: 'Không thể tải thông tin. Vui lòng kiểm tra kết nối và thử lại.',
          retry: 'Thử lại',
          total: '{{formattedCount}} quyền',
          expiringTotal: '{{formattedCount}} quyền',
          countUnavailable: 'Chưa có dữ liệu',
          currentRights: 'Hiện có và sắp bắt đầu',
          expiringLabel: 'Sắp hết hạn trong 7 ngày',
          summaryError: 'Không thể tải tổng số quyền sắp hết hạn.',
          unavailableHint: 'Tính năng này chưa được kết nối.',
          pageFilterNote: 'Bộ lọc chỉ áp dụng cho trang hiện tại. Chuyển trang để xem thêm.',
          noExpiringPage: 'Không có quyền sắp hết hạn trên trang này.',
          emptyHint: 'Phần mềm được cấp sẽ xuất hiện tại đây khi có dữ liệu.',
          empty: 'Bạn chưa có quyền phần mềm hiện tại.',
          emptyPage: 'Không có quyền phần mềm trên trang này.',
          dateUnavailable: 'Ngày không hợp lệ từ máy chủ',
          plan: 'Gói: {{plan}}',
          provisioning: 'Loại cấp phát: {{type}}',
          unknownStatus: 'Trạng thái máy chủ chưa được hỗ trợ: {{status}}',
          start: 'Hiệu lực từ: {{date}}',
          end: 'Dự kiến kết thúc: {{date}}',
          expiringSoon: 'Sắp hết hạn trong bảy ngày',
          previous: 'Trang trước',
          next: 'Trang sau',
          page: 'Trang {{page}}',
          otherFeatures: 'Chức năng duyệt chưa được kết nối.',
          logout: 'Đăng xuất',
          logoutError: 'Chưa thể xác nhận đăng xuất với máy chủ. Vui lòng kiểm tra kết nối và thử lại.',
          status: {
            UPCOMING: 'Sắp bắt đầu',
            PROVISIONING: 'Đang cấp',
            ACTIVE: 'Đang hoạt động',
            EXPIRED: 'Đã hết hạn',
            REVOKING: 'Đang thu hồi',
            ENDING: 'Sắp kết thúc',
            ENDED: 'Đã kết thúc'
          }
        },
        accessTypes: {
          licenseKey: 'Khóa bản quyền (K4)',
          workspaceSeat: 'Workspace seat'
        },
        back: 'Quay lại phần mềm của tôi',
        categories: {
          all: 'Tất cả',
          design: 'Thiết kế',
          development: 'Lập trình',
          productivity: 'Năng suất'
        },
        detail: {
          account: 'Tài khoản công ty',
          email: 'Email công ty',
          key: 'Khóa bản quyền',
          keyMasked: 'Khóa bản quyền đã che',
          noPassword: 'Ứng dụng không hiển thị mật khẩu.',
          status: 'Trạng thái',
          workspace: 'Workspace'
        },
        demoData: 'Dữ liệu minh họa · chưa kết nối tài khoản thật',
        empty: 'Không tìm thấy phần mềm trong danh mục này.',
        activeCount: '{{count}} phần mềm',
        expiringCount: '{{count}} mục',
        employeeDepartment: 'CC-TECH',
        employeeName: 'Nguyễn Văn A',
        employeeRole: 'Product Dev',
        filterLabel: 'Lọc phần mềm',
        kicker: 'Không gian nhân viên · demo',
        listFilters: {
          all: 'Tất cả',
          expiring: 'Sắp hết hạn'
        },
        listTitle: 'Phần mềm được cấp',
        noExpiring: 'Không có phần mềm nào được đánh dấu sắp hết hạn trong demo.',
        openSoftware: 'Mở chi tiết {{name}}',
        securityNote: 'Mỗi người một tài khoản công ty / seat riêng. Không chia sẻ thông tin đăng nhập (QĐ-75).',
        screenTitle: 'Phần mềm của tôi',
        screenSubtitle: 'Phần mềm và quyền truy cập do công ty cấp',
        status: {
          active: 'Đang hiệu lực',
          expiring: 'Còn {{days}} ngày'
        },
        summary: {
          active: 'Đang hiệu lực',
          expiring: 'Sắp hết hạn'
        }
      },
      requests: {
        createLive: {
          title: 'Yêu cầu phần mềm',
          intro: 'Chọn gói trong danh mục, nhập lý do và xem kiểm tra từ máy chủ trước khi gửi.',
          search: 'Tìm phần mềm hoặc gói',
          loading: 'Đang tải danh mục',
          catalogError: 'Không thể tải danh mục.',
          empty: 'Không có gói trên trang này.',
          choosePlan: 'Chọn {{app}}, {{plan}}',
          planBlocked: 'Hiện chưa thể gửi yêu cầu cho gói này.',
          selected: '{{app}} · {{plan}}',
          changePlan: 'Chọn gói khác',
          endDate: 'Dùng đến ngày',
          endDatePlaceholder: 'Chọn ngày (không bắt buộc)',
          endDateRequired: 'Gói này cần bạn chọn ngày "Dùng đến ngày".',
          maxEndDate: 'Có thể dùng đến ngày {{date}} là muộn nhất.',
          openLimit: 'Yêu cầu cấp mới đang mở: {{count}} trên {{max}}.',
          refusal: {
            HAS_OPEN_REQUEST: 'Bạn đã có một yêu cầu đang mở cho gói này.',
            OPEN_LIMIT_REACHED: 'Bạn đã có số yêu cầu đang mở tối đa được phép.'
          },
          manyPaid: 'Bạn đang dùng {{count}} phần mềm trả phí (ngưỡng {{threshold}}). Hãy giải thích vì sao cần thêm.',
          manyPaidLabel: 'Lý do cần thêm phần mềm trả phí',
          term: 'Thời hạn theo tháng (1–12)',
          reason: 'Lý do nghiệp vụ (bắt buộc)',
          validation: 'Nhập lý do từ 1 đến 1000 ký tự.',
          preview: 'Kiểm tra yêu cầu',
          previewLoading: 'Đang kiểm tra yêu cầu',
          previewError: 'Không thể kiểm tra yêu cầu. Vui lòng thử lại.',
          review: 'Kết quả kiểm tra từ máy chủ',
          canSubmit: 'Có thể gửi yêu cầu. Máy chủ sẽ kiểm tra lại khi gửi.',
          cannotSubmit: 'Hiện không thể gửi yêu cầu này.',
          blockedCode: 'Mã lý do không thể gửi: {{reason}}',
          existingAccess: 'Bạn đã có quyền sử dụng phần mềm này.',
          maxTerm: 'Thời hạn tối đa: {{months}} tháng',
          pricingBlocked: 'Bước duyệt chi chưa thể tiếp tục cho đến khi có giá.',
          expectedDays: 'Thời gian xử lý dự kiến: {{days}} ngày làm việc',
          submit: 'Gửi yêu cầu',
          sending: 'Đang gửi yêu cầu. Vui lòng chờ.',
          submitUncertain:
            'Chưa thể xác nhận kết quả. Hãy kiểm tra danh sách yêu cầu trước khi gửi lại để tránh trùng.',
          withdraw: 'Rút yêu cầu',
          withdrawNamed: 'Rút yêu cầu cho {{name}}',
          confirmWithdraw: 'Rút yêu cầu này?',
          withdrawNote: 'Máy chủ sẽ kiểm tra quyền rút. Một số yêu cầu phải chờ IT đóng tác vụ.',
          withdrawAction: 'Xác nhận rút',
          withdrawSuccess: 'Đã ghi nhận yêu cầu rút. Hãy xem trạng thái hiện tại; yêu cầu có thể vẫn đang chờ IT.',
          withdrawError: 'Chưa thể xác nhận kết quả. Hãy kiểm tra trạng thái yêu cầu sau khi tải lại trước khi thử lại.'
        },
        live: {
          subtitle: 'Các yêu cầu bạn đã gửi từ tài khoản của mình.',
          views: { open: 'Đang xử lý', ended: 'Đã kết thúc' },
          loading: 'Đang tải yêu cầu',
          listError: 'Không thể tải yêu cầu. Vui lòng thử lại.',
          detailError: 'Không thể tải yêu cầu này. Tài khoản của bạn có thể không có quyền xem.',
          empty: 'Không có yêu cầu trên trang này.',
          unnamed: 'Yêu cầu phần mềm',
          openNamed: 'Xem yêu cầu cho {{name}}',
          submitted: 'Đã gửi: {{date}}',
          back: 'Quay lại yêu cầu',
          detailsTitle: 'Chi tiết yêu cầu',
          noTerm: 'Chưa đặt ngày dùng đến',
          reviseOnWeb: 'Yêu cầu này bị trả về để chỉnh sửa. Hãy sửa trên web.',
          manyPaid: 'Lý do dùng {{count}} phần mềm trả phí',
          involvement: { SENT: 'Tôi gửi', FOR_ME: 'Dành cho tôi' },
          routing: {
            DEFAULT: 'Yêu cầu này đi thẳng tới người duyệt chi trong một bước.',
            REQUESTER_IS_HEAD: 'Bạn là trưởng phòng nên yêu cầu đi thẳng tới người duyệt chi trong một bước.',
            NO_DEPARTMENT_HEAD:
              'Phòng của bạn chưa có trưởng phòng nên yêu cầu đi thẳng tới người duyệt chi trong một bước.',
            HEAD_LEFT: 'Trưởng phòng đã nghỉ nên yêu cầu đi thẳng tới người duyệt chi trong một bước.'
          },
          spendStages: {
            NOT_SUBMITTED: 'Đang chờ được trình để quyết định chi',
            RETURNED_TO_REQUESTER: 'Được trả về cho bạn để chỉnh sửa',
            RESERVE_CONFIRMATION: 'Chờ trưởng phòng xác nhận dùng dự phòng',
            BLOCKED: 'Bị chặn bởi kiểm tra ngân sách',
            WAITING_SPEND_DECISION: 'Chờ quyết định chi',
            REFUSED: 'Duyệt chi bị từ chối'
          },
          lineStates: {
            AWAITING_NEED: 'Phần của bạn: chờ duyệt nhu cầu',
            NEED_CONFIRMED: 'Phần của bạn: đã xác nhận nhu cầu',
            NEED_REJECTED: 'Phần của bạn: nhu cầu bị từ chối',
            SPEND_REJECTED: 'Phần của bạn: duyệt chi bị từ chối',
            APPROVED: 'Phần của bạn: đã duyệt',
            EXECUTING: 'Phần của bạn: đang cấp',
            AWAITING_IT_CLOSE: 'Phần của bạn: chờ IT đóng',
            COMPLETED: 'Phần của bạn: hoàn tất',
            FAILED: 'Phần của bạn: thất bại',
            WITHDRAWN: 'Phần của bạn: đã rút',
            DROPPED: 'Phần của bạn: đã bỏ',
            CANCELLED: 'Phần của bạn: đã hủy'
          },
          cost: 'Chi phí',
          progress: {
            title: 'Tiến trình',
            steps: {
              submitted: 'Đã gửi yêu cầu',
              need: 'Duyệt nhu cầu',
              spend: 'Duyệt chi',
              execution: 'IT thực hiện'
            },
            status: {
              done: 'Hoàn tất',
              current: 'Đang xử lý',
              pending: 'Chưa bắt đầu',
              failed: 'Bị dừng',
              skipped: 'Không cần'
            },
            notes: {
              noDepartmentHead: 'phòng chưa có trưởng phòng',
              noSpendingApprover: 'chưa có người duyệt chi',
              financeReview: 'Finance đang rà soát',
              budget: 'đang chờ ngân sách',
              notRequired: 'không cần, bạn là trưởng phòng',
              reserveConfirmation: 'chờ trưởng phòng xác nhận dùng dự phòng',
              blocked: 'bị chặn bởi kiểm tra ngân sách',
              revision: 'được trả về để bạn chỉnh sửa',
              spendSubmission: 'đang chờ trình lên người duyệt chi',
              itAssessment: 'IT đang đánh giá'
            }
          },
          viewRequest: 'Xem yêu cầu',
          reference: 'Mã yêu cầu: {{id}}',
          reason: 'Lý do nghiệp vụ',
          term: 'Thời hạn yêu cầu',
          months: '{{months}} tháng',
          requester: 'Người gửi',
          beneficiary: 'Người được cấp',
          needReason: 'Lý do quyết định nhu cầu',
          spendReason: 'Lý do từ chối chi',
          withdrawalReason: 'Lý do rút yêu cầu',
          draft: 'Bản nháp',
          draftNote: 'Chưa thể chỉnh sửa bản nháp trên mobile.',
          unknownState: 'Trạng thái khác ({{state}})',
          unknownType: 'Loại yêu cầu khác ({{type}})',
          lineCount: '{{formattedCount}} mục yêu cầu',
          types: {
            GRANT: 'Cấp quyền phần mềm',
            SERVICE_ACCOUNT: 'Tài khoản dịch vụ',
            RENEWAL: 'Gia hạn',
            GROUP_GRANT: 'Yêu cầu nhóm'
          },
          states: {
            PENDING: 'Chờ xử lý',
            WAITING_CONTROLLED: 'Chờ kiểm soát',
            AWAITING_EXECUTION: 'Chờ thực hiện',
            AWAITING_IT_ASSESSMENT: 'Chờ IT đánh giá',
            AWAITING_SPEND_SUBMISSION: 'Chờ trình duyệt chi',
            AWAITING_FINANCE_REVIEW: 'Chờ Finance xem xét',
            AWAITING_REQUESTER_REVISION: 'Bị trả về để chỉnh sửa',
            AWAITING_BUDGET: 'Chờ ngân sách',
            AWAITING_SPEND_DECISION: 'Chờ quyết định chi',
            REJECTED: 'Đã từ chối',
            IT_REJECTED: 'IT đã từ chối',
            EXECUTING: 'Đang thực hiện',
            COMPLETED: 'Hoàn tất',
            FAILED: 'Không thành công',
            AWAITING_IT_CLOSE: 'Chờ IT đóng yêu cầu rút',
            WITHDRAWN: 'Đã rút',
            CANCELLED: 'Đã hủy'
          }
        },
        back: 'Quay lại',
        backToSoftware: 'Về phần mềm của tôi',
        annualCost: '{{amount}} VNĐ/năm',
        catalogCount: '{{count}} mục',
        catalogEmptyDescription: 'Thử tên phần mềm khác hoặc xóa nội dung tìm kiếm.',
        catalogEmptyTitle: 'Không tìm thấy phần mềm',
        catalogFilters: 'Lọc danh mục phần mềm',
        catalogHint: 'Chọn công cụ đã có trong danh mục của công ty.',
        catalogSubtitle: 'Chọn phần mềm trong danh mục và mô tả nhu cầu sử dụng.',
        categories: {
          ai: 'Công cụ AI',
          productivity: 'Năng suất'
        },
        cancel: 'Giữ yêu cầu',
        chooseCatalogTool: 'Chọn phần mềm trong danh mục',
        chooseTool: 'Chọn {{name}}',
        confirm: 'Xác nhận rút',
        confirmWithdraw: 'Rút yêu cầu {{id}}?',
        cost: '{{amount}} VNĐ',
        createNew: 'Tạo yêu cầu phần mềm',
        continue: 'Tiếp tục',
        detailsSubtitle: 'Chọn thời hạn và nêu nhu cầu công việc.',
        detailsTitle: 'Thông tin yêu cầu',
        demoData: 'Dữ liệu minh họa · thao tác chỉ lưu trong phiên này',
        duration: '{{months}} tháng',
        durationDefault: 'Thời hạn chuẩn',
        durationExtended: 'Thời hạn mở rộng',
        durationHint: 'Chọn 12 hoặc 18 tháng.',
        durationLabel: 'Thời hạn đề nghị',
        edit: 'Chỉnh sửa',
        estimatedCost: 'Số tiền dự kiến',
        errors: {
          reasonRequired: 'Hãy nhập lý do nghiệp vụ cho phần mềm ngoài bộ công cụ chuẩn.'
        },
        financeReview: 'Finance rà soát',
        filters: {
          all: 'Tất cả',
          outside: 'Ngoài bộ chuẩn',
          standard: 'Bộ công cụ chuẩn'
        },
        kicker: 'Yêu cầu của nhân viên',
        listKicker: 'Không gian nhân viên · demo',
        listSubtitle: 'Theo dõi yêu cầu và trạng thái xử lý của bạn.',
        managerName: 'Lê Hoàng',
        longTermWarning: 'OI-07a · Yêu cầu trên 12 tháng cần rà soát bổ sung.',
        newTitle: 'Yêu cầu phần mềm mới',
        noDemoQuote: 'Chưa có báo giá minh họa',
        noMobileBatch: 'Mobile không trình lô. Khi áp dụng, trưởng phòng có thể trình lô trên web.',
        noBudgetCode: 'Không hiện mã kiểm tra ngân sách hay số dư. Không rút đơn đã kết thúc.',
        notices: {
          financeReview: 'Finance đang rà soát. Yêu cầu chưa vào hàng đợi Người duyệt chi.',
          longTerm: 'OI-07a · Yêu cầu 18 tháng; cần rà soát bổ sung.',
          submittedWeb: 'Lê Hoàng đã trình lô duyệt chi trên web.'
        },
        rejectedBy: 'Từ chối bởi trưởng phòng {{name}} · {{date}}',
        rejectedBySpending: 'Từ chối bởi người duyệt chi {{name}} · {{date}}',
        rejectionReasons: {
          adobeBudgetOptimized: 'Ngân sách phòng quý này đã tối ưu. Dùng Figma Pro hoặc Canva Team trong bộ chuẩn.'
        },
        openRequest: 'Mở yêu cầu {{id}} cho {{name}}',
        outOfStandard: 'Ngoài bộ công cụ chuẩn',
        outOfStandardReason: 'Phần mềm ngoài bộ chuẩn cần có lý do nghiệp vụ.',
        personalOnly: 'Yêu cầu mobile chỉ dành cho quyền truy cập của chính bạn.',
        planReference: 'Mã dòng kế hoạch',
        possibleSteps:
          'Các bước có thể có: duyệt nhu cầu, trình lô trên web khi áp dụng, Finance rà soát khi cần, duyệt chi khi cần và IT cấp phát. Tuyến thực tế tùy từng yêu cầu.',
        possibleStepsTitle: 'Các bước có thể cần duyệt',
        personalAccess: 'Cho quyền truy cập của tôi',
        progress: 'Tiến trình yêu cầu: bước {{current}}/{{total}}',
        reasonOptional: 'Không bắt buộc với phần mềm trong bộ công cụ chuẩn.',
        reasonLabel: 'Lý do nghiệp vụ',
        reasonPlaceholder: 'Mô tả phần mềm hỗ trợ công việc của bạn như thế nào',
        review: 'Xem lại yêu cầu',
        reviewSubtitle: 'Kiểm tra thông tin trước khi gửi yêu cầu.',
        reviewTitle: 'Xem lại trước khi gửi',
        requestFor: 'Yêu cầu cho',
        searchCatalog: 'Tìm phần mềm',
        selectedTool: 'Phần mềm đã chọn',
        standardTool: 'Bộ công cụ chuẩn',
        steps: {
          catalog: 'Danh mục',
          details: 'Thông tin',
          review: 'Xem lại'
        },
        summaryTitle: 'Tóm tắt yêu cầu',
        status: {
          awaitingExecution: 'Chờ IT thực thi',
          awaitingManagerSubmission: 'Chờ trưởng phòng trình',
          awaitingNeed: 'Chờ duyệt nhu cầu',
          completed: 'Hoàn tất',
          executing: 'Đang thực thi · không thể rút',
          financeReview: 'Finance rà soát',
          provisioningFailed: 'Cấp phát lỗi',
          rejected: 'Từ chối',
          spendApproval: 'Chờ duyệt chi',
          waitingInvitation: 'Chờ chấp nhận lời mời',
          withdrawn: 'Đã rút'
        },
        submit: 'Gửi yêu cầu',
        submittedWeb: 'Đã trình trên web',
        changeTool: 'Thay đổi',
        catalog: {
          descriptions: {
            claude: 'Không gian AI hỗ trợ phân tích, viết nội dung và lập trình.',
            raycast: 'Trình khởi chạy công cụ và thao tác thường dùng trong công việc.'
          }
        },
        timeline: {
          awaitingExecution: 'IT chưa bắt đầu cấp phát',
          created: 'Đã gửi yêu cầu',
          executionStarted: 'IT đã bắt đầu cấp phát',
          financeReview: 'Bắt đầu rà soát Finance',
          needApproved: 'Đã duyệt nhu cầu',
          needReviewPending: 'Đang chờ duyệt nhu cầu',
          rejected: 'Yêu cầu đã bị từ chối',
          spendApproved: 'Đã duyệt chi',
          spendReviewPending: 'Đang chờ quyết định duyệt chi',
          submittedWeb: 'Lê Hoàng đã trình lô trên web',
          withdrawn: 'Đã rút yêu cầu'
        },
        timelineTitle: 'Tiến trình yêu cầu',
        title: 'Yêu cầu của tôi',
        withdraw: 'Rút yêu cầu',
        withdrawPolicy:
          'Rút khi đang chờ duyệt, chờ thực thi, cấp phát lỗi hoặc chờ lời mời. Không rút khi đang thực thi hoặc đã xong. Hàng đợi là việc được giao, không phải toàn bộ phạm vi xem.',
        withdrawNamed: 'Rút yêu cầu {{id}}',
        withdrawResult: 'Yêu cầu sẽ được chuyển sang trạng thái Đã rút trong bản demo.',
        withdrawn: 'Đã rút',
        standard: 'Bộ công cụ chuẩn'
      }
    }
  }
} as const

export type SupportedLanguage = keyof typeof resources
