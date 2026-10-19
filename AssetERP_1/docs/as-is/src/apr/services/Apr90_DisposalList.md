# apr.Apr90_DisposalList

`server/apr/Apr90_DisposalList.java`

서비스 키 `apr.Apr90_DisposalList.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 33 | [`apr90_disposal_list.selectById`](../../apr/sql/apr90_disposal_list.md) | - |  |
| `selectByCompanyId` | 38 | [`apr90_disposal_list.selectByCompanyId`](../../apr/sql/apr90_disposal_list.md) | `Apr90_Tab_DisposalAppr`, `Apr90_Tab_DisposalListAdmin` |  |
| `selectByPersonId` | 43 | [`apr90_disposal_list.selectByPersonId`](../../apr/sql/apr90_disposal_list.md) | `Apr90_Tab_DisposalList` |  |
| `checkDisposal` | 53 | [`apr90_disposal_list.checkDisposal`](../../apr/sql/apr90_disposal_list.md), [`com01_relate_appr.checkUseRelateApprId`](../../com/sql/com01_relate_appr.md), [`pay50_expense.selectByExpenseApprId`](../../pay/sql/pay50_expense.md) | `Apr01_Edit_ApprDoc` |  |
| `updateAppr` | 81 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr11_advert_book.deleteByApprId`](../../apr/sql/apr11_advert_book.md), [`apr90_disposal_list.updateDisposalCode`](../../apr/sql/apr90_disposal_list.md), [`apr91_disposal_history.insert`](../../apr/sql/apr91_disposal_history.md), [`opr01_create.updateApprIdByApprId`](../../opr/sql/opr01_create.md), [`pln02_plan.updateApprIdByApprId`](../../pln/sql/pln02_plan.md) | `Apr90_Tab_DisposalAppr`, `Apr90_Tab_DisposalListAdmin` |  |
| `modelUpdate` | 123 | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr91_disposal_history.insert`](../../apr/sql/apr91_disposal_history.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(apr90_disposal_list)` 동적 INSERT/UPDATE | `Apr90_Lookup_DisposalList` | `SendMailMaster`, `SendSMSAPIFunction`, `SendTalkAPI`, `UpdateDataModel` |
| `update` | 228 | `UpdateDataModel(apr90_disposal_list)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 233 | `UpdateDataModel(apr90_disposal_list)` 동적 DELETE | - | `UpdateDataModel` |
