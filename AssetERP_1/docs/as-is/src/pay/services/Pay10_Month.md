# pay.Pay10_Month

`server/pay/Pay10_Month.java`

서비스 키 `pay.Pay10_Month.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 31 | [`pay10_month.selectById`](../../pay/sql/pay10_month.md) | - |  |
| `selectByCompanyId` | 37 | [`pay10_month.selectByCompanyId`](../../pay/sql/pay10_month.md) | `Pay10_Tab_Month` |  |
| `selectByPersonId` | 54 | [`pay10_month.selectByPersonId`](../../pay/sql/pay10_month.md) | `Pay10_TabPage_Retire`, `Pay10_Tab_Retire` |  |
| `selectByList` | 70 | [`pay10_month.selectByList`](../../pay/sql/pay10_month.md) | - |  |
| `selectByYear` | 87 | [`pay10_month.selectByYear`](../../pay/sql/pay10_month.md) | `Pay10_Lookup_GroupList` |  |
| `selectByYearPersonId` | 105 | [`pay10_month.selectByYearPersonId`](../../pay/sql/pay10_month.md) | `Pay10_Tab_PersonList`, `Pay10_Tab_PersonListManager` |  |
| `selectByRetirePayCode` | 121 | [`pay10_month.selectByRetirePayCode`](../../pay/sql/pay10_month.md) | `Apr01_Edit_ApprDoc`, `Pay10_TabPage_Retire` |  |
| `selectByMonthIdCount` | 137 | [`pay10_month.selectByMonthIdCount`](../../pay/sql/pay10_month.md) | `Pay10_Tab_PersonList`, `Pay10_Tab_PersonListManager` |  |
| `getRetireInfo` | 151 | [`pay10_month.getRetireInfo`](../../pay/sql/pay10_month.md) | `Pay12_TabPage_RetireInsure`, `Pay13_TabPage_RetireTax`, `Pay15_TabPage_RetireLeave` |  |
| `getHtmlData` | 161 | [`pay10_month.getHtmlData`](../../pay/sql/pay10_month.md) | - |  |
| `getHtmlData10` | 177 | [`pay10_month.getHtmlData10`](../../pay/sql/pay10_month.md) | `Apr01_Edit_ApprDoc` |  |
| `selectBypayCode` | 195 | [`pay10_month.selectBypayCode`](../../pay/sql/pay10_month.md) | `Apr01_Edit_ApprDoc` |  |
| `checkAppr` | 211 | [`act02_journal.countByPayMonthCode`](../../act/sql/act02_journal.md), [`pay05_relate_appr.checkAppr`](../../pay/sql/pay05_relate_appr.md) | `Pay10_Lookup_Insert`, `Pay10_Lookup_Work`, `Pay10_Tab_Month`, `Pay10_Tab_MonthItem`, `Pay11_TabPage_MonthItem` |  |
| `insert` | 243 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay01_annual.selectByApprStatus`](../../pay/sql/pay01_annual.md), [`pay10_month.insert`](../../pay/sql/pay10_month.md), [`pay10_month.selectByPayDatePersonId`](../../pay/sql/pay10_month.md), [`pay11_month_item.getAdjustPay`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureEi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureHi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureLtc`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureNps`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.insert`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.insertLatestInfo`](../../pay/sql/pay11_month_item.md), [`sys12_calendar.workDayPerson`](../../sys/sql/sys12_calendar.md) | `Pay10_Lookup_Insert` | `Calendar`, `DateUtil` |
| `modelUpdate` | 615 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay10_month)` 동적 INSERT/UPDATE | `Pay10_Lookup_Work` | `UpdateDataModel` |
| `deleteAll` | 628 | [`pay11_month_item.deleteByMonthId`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureAdjustModi`](../../pay/sql/pay11_month_item.md), [`pay12_retire_insure.deleteByMonthId`](../../pay/sql/pay12_retire_insure.md), [`pay13_retire_tax.deleteByMonthId`](../../pay/sql/pay13_retire_tax.md), [`pay14_retire_tax_item.deleteByMonthId`](../../pay/sql/pay14_retire_tax_item.md), [`pay32_insure_pay.deleteByDate`](../../pay/sql/pay32_insure_pay.md), `UpdateDataModel(pay10_month)` 동적 DELETE | `Pay10_Tab_Month` | `UpdateDataModel` |
| `update` | 673 | `UpdateDataModel(pay10_month)` 동적 INSERT/UPDATE | `Pay10_Tab_List`, `Pay10_Tab_Month` | `UpdateDataModel` |
| `delete` | 678 | `UpdateDataModel(pay10_month)` 동적 DELETE | - | `UpdateDataModel` |
