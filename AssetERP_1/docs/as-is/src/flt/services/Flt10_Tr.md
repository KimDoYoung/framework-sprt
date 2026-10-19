# flt.Flt10_Tr

`server/flt/Flt10_Tr.java`

서비스 키 `flt.Flt10_Tr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 33 | [`flt10_tr.selectById`](../../flt/sql/flt10_tr.md) | - |  |
| `selectByCompanyId` | 39 | [`flt10_tr.selectByCompanyId`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_PreApprove` |  |
| `selectItemName` | 54 | [`flt10_tr.selectItemName`](../../flt/sql/flt10_tr.md) | `Flt10_Lookup_Item` |  |
| `selectByTrList` | 65 | [`flt10_tr.selectByTrList`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_TrList`, `Flt10_Tab_TrListAdmin` |  |
| `selectByTrType` | 70 | [`flt10_tr.selectByTrType`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_AcntTransfer`, `Flt10_Tab_RightsExercise` |  |
| `selectInvestLimit` | 75 | [`flt10_tr.selectInvestLimit`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_BuyReport` |  |
| `selectEmpAppr` | 80 | [`flt10_tr.selectEmpAppr`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_EmpAppr` |  |
| `selectViolate` | 85 | [`flt10_tr.selectViolate`](../../flt/sql/flt10_tr.md) | `Flt10_Lookup_ViolateView`, `Flt10_Tab_Violate` |  |
| `getList` | 90 | [`flt10_tr.getList`](../../flt/sql/flt10_tr.md) | - |  |
| `selectByDate` | 102 | `flt10_tr.selectByDate`(없음) | - |  |
| `selectByAccountId` | 112 | [`flt10_tr.selectByAccountId`](../../flt/sql/flt10_tr.md) | `Flt10_Lookup_ExpectTr`, `Flt10_TabPage_Appr`, `Flt10_Tab_BuyReport`, `Flt10_Tab_SellReport` |  |
| `selectByPeriod` | 158 | [`flt10_tr.selectByPeriod`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_RealTransaction` |  |
| `selectByApprId` | 177 | [`flt10_tr.selectByApprId`](../../flt/sql/flt10_tr.md) | `Flt10_Grid_EmpAppr` |  |
| `selectByStdDate` | 188 | [`flt10_tr.selectByStdDate`](../../flt/sql/flt10_tr.md) | `Flt10_TabPage_ReportPerson` |  |
| `selectByStdDate2` | 199 | [`flt10_tr.selectByStdDate2`](../../flt/sql/flt10_tr.md) | `Flt10_TabPage_TrList` |  |
| `checkPreAppr` | 211 | [`flt02_emp.selectByDate`](../../flt/sql/flt02_emp.md), [`flt03_account.countAccount`](../../flt/sql/flt03_account.md), [`flt10_tr.checkReport`](../../flt/sql/flt10_tr.md), [`flt10_tr.getPreReportDate`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_RealTransaction` |  |
| `checkNextAppr` | 276 | [`flt02_emp.selectByDate`](../../flt/sql/flt02_emp.md), [`flt03_account.countAccount`](../../flt/sql/flt03_account.md), [`flt10_tr.checkNextReport`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_RealTransaction` |  |
| `sendMessage` | 327 | [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`flt10_tr.getSendMessageList`](../../flt/sql/flt10_tr.md), [`flt10_tr.updateConfirmSmsYn`](../../flt/sql/flt10_tr.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Flt10_Tab_PreApprove` | `SendMailStep`, `SendSMSAPIFunction`, `SendTalkAPI` |
| `countByTrDate` | 442 | [`flt10_tr.countByTrDate`](../../flt/sql/flt10_tr.md), [`flt14_relate_appr.checkAppr`](../../flt/sql/flt14_relate_appr.md) | `Flt13_Lookup_BookInit` |  |
| `getBizDate` | 459 | [`flt10_tr.getBizDate`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_RealTransaction`, `Flt11_Tab_BookList`, `Flt11_Tab_BookListAdmin` |  |
| `insertFloorTrBook` | 468 | [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md) | `Flt10_Lookup_AcntTransfer`, `Flt10_Lookup_RightsExercise`, `Flt10_Tab_RealTransaction`, `Flt11_Tab_BookList`, `Flt11_Tab_BookListAdmin` |  |
| `updateExpectApprId` | 487 | [`flt10_tr.updateExpectApprId`](../../flt/sql/flt10_tr.md) | - |  |
| `updateApprId` | 504 | [`flt10_tr.updateApprId`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_RealTransaction` |  |
| `updateStatusCode` | 521 | [`flt01_company_std.getExpectTrDate2`](../../flt/sql/flt01_company_std.md), [`flt10_tr.updateStatusCode`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_BuyReport`, `Flt10_Tab_PreApprove`, `Flt10_Tab_SellReport` |  |
| `updateUnFill` | 574 | [`flt10_tr.selectSimpleById`](../../flt/sql/flt10_tr.md), [`flt10_tr.updateUnfillYn`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_BuyReport`, `Flt10_Tab_SellReport` |  |
| `deleteApprList` | 602 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`flt10_tr.updateByApprId`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_RealTransaction` |  |
| `deleteAppr` | 621 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`flt10_tr.updateByApprId`](../../flt/sql/flt10_tr.md) | `Flt10_Grid_EmpAppr` |  |
| `deleteUpdate` | 639 | [`flt10_tr.delete`](../../flt/sql/flt10_tr.md), [`flt10_tr.updateTrData`](../../flt/sql/flt10_tr.md) | `Flt10_Tab_RealTransaction` |  |
| `modelUpdate` | 657 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(flt10_tr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 670 | [`flt13_book_init.getInitDate`](../../flt/sql/flt13_book_init.md), `UpdateDataModel(flt10_tr)` 동적 INSERT/UPDATE | `Flt10_Lookup_AcntTransfer`, `Flt10_Lookup_RejectReasonWrite`, `Flt10_Lookup_RightsExercise`, `Flt10_TabPage_Appr`, `Flt10_Tab_BuyReport`, `Flt10_Tab_RealTransaction`, `Flt10_Tab_SellReport` | `UpdateDataModel` |
| `delete` | 711 | `UpdateDataModel(flt10_tr)` 동적 DELETE | `Flt10_TabPage_Appr`, `Flt10_Tab_BuyReport`, `Flt10_Tab_RealTransaction`, `Flt10_Tab_SellReport` | `UpdateDataModel` |
| `delete2` | 716 | [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md), `UpdateDataModel(flt10_tr)` 동적 DELETE | `Flt10_Tab_AcntTransfer`, `Flt10_Tab_RightsExercise` | `UpdateDataModel` |
