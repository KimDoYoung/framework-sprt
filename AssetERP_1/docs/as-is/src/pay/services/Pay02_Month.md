# pay.Pay02_Month

`server/pay/Pay02_Month.java`

서비스 키 `pay.Pay02_Month.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 28 | [`pay02_month.selectById`](../../pay/sql/pay02_month.md) | - |  |
| `selectByCompanyId` | 34 | [`pay02_month.selectByCompanyId`](../../pay/sql/pay02_month.md) | `Pay02_Tab_List`, `Pay02_Tab_Month` |  |
| `selectByYearPersonId` | 51 | [`pay02_month.selectByYearPersonId`](../../pay/sql/pay02_month.md) | `Pay02_Tab_PersonList`, `Pay02_Tab_PersonListManager` |  |
| `selectByYear` | 67 | [`pay02_month.selectByYear`](../../pay/sql/pay02_month.md) | `Pay02_Lookup_GroupList` |  |
| `selectByTrans` | 83 | [`pay02_month.selectByTrans`](../../pay/sql/pay02_month.md) | - |  |
| `getHtmlData` | 99 | [`pay02_month.getHtmlData`](../../pay/sql/pay02_month.md) | - |  |
| `calculate` | 116 | [`pay02_month.selectByCompanyId`](../../pay/sql/pay02_month.md), [`pay02_month.updateRealPay`](../../pay/sql/pay02_month.md) | `Pay02_Tab_Month` |  |
| `calculateByPersonId` | 163 | [`pay02_month.selectByCompanyId`](../../pay/sql/pay02_month.md), [`pay02_month.updateRealPay`](../../pay/sql/pay02_month.md) | `Pay02_Lookup_Work` |  |
| `insert` | 212 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay01_annual.selectByApprStatus`](../../pay/sql/pay01_annual.md), [`pay02_month.insert`](../../pay/sql/pay02_month.md), [`pay02_month.selectByLatestInfo`](../../pay/sql/pay02_month.md), [`pay02_month.selectByPayDatePersonId`](../../pay/sql/pay02_month.md), [`sys12_calendar.workDay`](../../sys/sql/sys12_calendar.md) | `Pay02_Lookup_Insert` |  |
| `checkAppr` | 351 | [`pay05_relate_appr.checkAppr`](../../pay/sql/pay05_relate_appr.md) | `Pay02_Lookup_Insert`, `Pay02_Tab_Month` |  |
| `update` | 367 | `UpdateDataModel(pay02_month)` 동적 INSERT/UPDATE | `Pay02_Lookup_Unsettled`, `Pay02_Lookup_Work`, `Pay02_Tab_List`, `Pay02_Tab_Month` | `UpdateDataModel` |
| `delete` | 372 | `UpdateDataModel(pay02_month)` 동적 DELETE | `Pay02_Tab_Month` | `UpdateDataModel` |
