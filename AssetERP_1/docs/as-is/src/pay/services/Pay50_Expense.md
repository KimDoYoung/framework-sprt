# pay.Pay50_Expense

`server/pay/Pay50_Expense.java`

서비스 키 `pay.Pay50_Expense.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 40 | [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md) | `Ast07_Lookup_Settle`, `Pay50_Edit_Expense`, `Pay50_Tab_ExpenseManager`, `Pay50_Tab_ExpenseRequest` |  |
| `selectByDate` | 46 | [`pay50_expense.selectByDate`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpenseRequest` |  |
| `selectByDateConfirm` | 52 | [`pay50_expense.selectByDateConfirm`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpenseConfirm` |  |
| `selectByExpenseApprIdList` | 58 | [`pay50_expense.selectByExpenseApprIdList`](../../pay/sql/pay50_expense.md) | `Apr03_Page_Relate` |  |
| `selectExpenseRequest` | 73 | [`pay50_expense.selectExpenseRequest`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_ExpenseRequestList`, `Pay50_Tab_ExpenseManager` |  |
| `selectExpenseAppr` | 79 | [`pay50_expense.selectExpenseAppr`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_ExpenseCopy`, `Pay50_Tab_Expense`, `Pay50_Tab_ExpenseManager` |  |
| `selectNewExpenseAppr` | 85 | [`pay50_expense.selectNewExpenseAppr`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_ExpenseUnJournal`, `Pay50_Lookup_NewExpenseApprList`, `Pay50_Tab_ExpenseJournal`, `Pay50_Tab_ExpensePayWrite` |  |
| `selectExpensePay` | 91 | [`pay50_expense.selectExpensePay`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpensePayWrite` |  |
| `selectBySettleDate` | 97 | [`pay50_expense.selectBySettleDate`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpensePay` |  |
| `selectBySettleApprId` | 103 | [`pay50_expense.selectBySettleApprId`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpensePay` |  |
| `selectExpenseAccountSum` | 109 | [`pay50_expense.selectExpenseAccountSum`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_AccountSumList` |  |
| `selectOfficeAssets` | 115 | [`pay50_expense.selectOfficeAssets`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_ExpenseOfficeAssets` |  |
| `selectExpenseUnJournal` | 121 | `pay50_expense.selectExpenseUnJournal`(없음) | - |  |
| `selectExpenseJournal` | 127 | [`pay50_expense.selectExpenseJournal`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpenseJournal` |  |
| `getConfirmerId` | 133 | [`pay50_expense.getConfirmerId`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_ExpenseRequestInsert` |  |
| `updateApprEmpId` | 139 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.insertRequest`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateApprEmpId`](../../pay/sql/pay50_expense.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Pay50_Tab_ExpenseManager` | `File` |
| `updateExpenseApprId` | 211 | [`pay50_expense.updateExpenseApprId`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_Expense`, `Pay50_Tab_ExpenseManager` |  |
| `updatesSttleApprId` | 226 | [`pay50_expense.updateSettleApprId`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpensePayWrite` |  |
| `updateSettleEmpId` | 241 | [`ast06_tr.updateExpenseId`](../../ast/sql/ast06_tr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.insertExpense`](../../pay/sql/pay50_expense.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateSettleEmpId`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpensePayWrite` |  |
| `initExpense` | 301 | [`apr01_appr.selectByApprId3`](../../apr/sql/apr01_appr.md), [`pay50_expense.deleteById`](../../pay/sql/pay50_expense.md), [`pay50_expense.initExpense`](../../pay/sql/pay50_expense.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Pay50_Tab_Expense`, `Pay50_Tab_ExpenseManager` | `File` |
| `initExpenseSettle` | 351 | [`apr01_appr.selectByApprId3`](../../apr/sql/apr01_appr.md), [`ast07_settle.countByExpenseId`](../../ast/sql/ast07_settle.md), [`pay50_expense.deleteById`](../../pay/sql/pay50_expense.md), [`pay50_expense.initExpenseSettle`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpensePayWrite` |  |
| `updateAccountCode` | 394 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.insertExpense`](../../pay/sql/pay50_expense.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateAccountCode`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_ExpenseUnJournal`, `Pay50_Lookup_UpdateAccount` |  |
| `updateDeposit` | 456 | [`pay50_expense.updateDepositId`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_UpdateDeposit` |  |
| `updateConfirmStatusCode` | 474 | [`pay50_expense.updateConfirmStatusCode`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpenseRequest` |  |
| `updateConfirmReason` | 487 | [`pay50_expense.updateConfirmReason`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpenseConfirm` |  |
| `updateRejectReason` | 506 | [`pay50_expense.updateRejectReason`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpenseManager` |  |
| `updateContent` | 519 | [`pay50_expense.updateContent`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_Content` |  |
| `modelUpdate` | 531 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay50_expense)` 동적 INSERT/UPDATE | `Pay50_Lookup_ExpenseRequestInsert` | `UpdateDataModel` |
| `createJournal` | 544 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.createJournal`](../../pay/sql/pay50_expense.md), [`pay50_expense.insertExpense`](../../pay/sql/pay50_expense.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md) | `Pay50_Lookup_ExpenseUnJournal` |  |
| `deleteJournal` | 654 | [`act02_journal.deleteByJournalId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByJournalId`](../../act/sql/act06_journal_tmp.md), [`com01_relate_appr.deleteByKeyTableId`](../../com/sql/com01_relate_appr.md), [`pay50_expense.deleteById`](../../pay/sql/pay50_expense.md), [`pay50_expense.initExpenseJournal`](../../pay/sql/pay50_expense.md), [`pay50_expense.selectByJournalId`](../../pay/sql/pay50_expense.md) | `Pay50_Tab_ExpenseJournal` | `Act04_GenLedger` |
| `confirmSendMessage` | 701 | [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`pay50_expense.getConfirmSendMessageList`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateConfirmSmsYn`](../../pay/sql/pay50_expense.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Pay50_Tab_ExpenseConfirm` | `SendMailStep`, `SendSMSAPIFunction`, `SendTalkAPI` |
| `rejectSendMessage` | 814 | [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`pay50_expense.getRejectSendMessageList`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateRejectSmsYn`](../../pay/sql/pay50_expense.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Pay50_Tab_ExpenseManager` | `SendMailStep`, `SendSMSAPIFunction`, `SendTalkAPI` |
| `deleteRequest` | 942 | [`com01_relate_appr.deleteByKeyTableId`](../../com/sql/com01_relate_appr.md), [`pay50_expense.deleteById`](../../pay/sql/pay50_expense.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md) | `Pay50_Tab_ExpenseRequest` |  |
| `update` | 979 | `UpdateDataModel(pay50_expense)` 동적 INSERT/UPDATE | `Pay50_Edit_Expense`, `Pay50_Tab_ExpensePayWrite` | `UpdateDataModel` |
| `delete` | 984 | `UpdateDataModel(pay50_expense)` 동적 DELETE | - | `UpdateDataModel` |
