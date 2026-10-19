# emp92_sms_notice

`server/emp/mapper/emp92_sms_notice.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`emp92_sms_notice`](../../../db/tables/emp.md), [`sys09_code`](../../../db/tables/sys.md) |  | `emp.Emp92_SmsNotice.selectById` |
| `selectByPersonId` | select | 40 | [`emp92_sms_notice`](../../../db/tables/emp.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `emp.Emp92_SmsNotice.selectByPersonId` |
| `check` | select | 63 | [`emp92_sms_notice`](../../../db/tables/emp.md) |  | `emp.Emp92_SmsNotice.updateList` |
| `sendCheckTalk` | select | 71 | [`emp92_sms_notice`](../../../db/tables/emp.md) |  | `apr.Apr01_Appr.update`, `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate`, `apr.Apr04_ApprStep.updateList`, `apr.Apr90_DisposalList.modelUpdate`, `emp.Emp20_Leave.cancelUpdate`, `flt.Flt10_Tr.sendMessage`, `pay.Pay50_Expense.confirmSendMessage`, `pay.Pay50_Expense.rejectSendMessage` |
| `sendCheckMail` | select | 80 | [`emp92_sms_notice`](../../../db/tables/emp.md) |  | `apr.Apr01_Appr.update`, `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate`, `apr.Apr04_ApprStep.updateList`, `apr.Apr90_DisposalList.modelUpdate`, `emp.Emp20_Leave.cancelUpdate`, `flt.Flt10_Tr.sendMessage`, `pay.Pay50_Expense.confirmSendMessage`, `pay.Pay50_Expense.rejectSendMessage` |
| `sendCheckSms` | select | 89 | [`emp92_sms_notice`](../../../db/tables/emp.md) |  | `apr.Apr01_Appr.update`, `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate`, `apr.Apr04_ApprStep.updateList`, `apr.Apr90_DisposalList.modelUpdate`, `emp.Emp20_Leave.cancelUpdate`, `flt.Flt10_Tr.sendMessage`, `pay.Pay50_Expense.confirmSendMessage`, `pay.Pay50_Expense.rejectSendMessage` |
| `insert` | insert | 98 | [`emp92_sms_notice`](../../../db/tables/emp.md) | `f_create_seq` | `emp.Emp92_SmsNotice.updateList` |
| `updateNoticeYn` | update | 120 | [`emp92_sms_notice`](../../../db/tables/emp.md) |  | `emp.Emp92_SmsNotice.updateList` |
