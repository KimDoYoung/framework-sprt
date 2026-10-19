# pay05_relate_appr

`server/pay/mapper/pay05_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`pay05_relate_appr`](../../../db/tables/pay.md) |  | `pay.Pay05_RelateAppr.selectById` |
| `selectByCompanyId` | select | 25 | [`apr01_appr`](../../../db/tables/apr.md), [`pay05_relate_appr`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay05_RelateAppr.insert`, `pay.Pay05_RelateAppr.selectByCompanyId` |
| `selectByRetire` | select | 36 | [`apr01_appr`](../../../db/tables/apr.md), [`pay05_relate_appr`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay05_RelateAppr.insertRetire`, `pay.Pay05_RelateAppr.selectByRetire` |
| `checkAppr` | select | 48 | [`apr01_appr`](../../../db/tables/apr.md), [`pay05_relate_appr`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay02_Month.checkAppr`, `pay.Pay07_Retire.checkAppr`, `pay.Pay10_Month.checkAppr` |
| `checkApprRetire` | select | 69 | [`apr01_appr`](../../../db/tables/apr.md), [`pay05_relate_appr`](../../../db/tables/pay.md) | `f_cdnm` | - |
| `insert` | insert | 82 | [`pay05_relate_appr`](../../../db/tables/pay.md) |  | `pay.Pay05_RelateAppr.insert`, `pay.Pay05_RelateAppr.insertRetire` |
| `updateApprId` | update | 100 | [`pay05_relate_appr`](../../../db/tables/pay.md) |  | `pay.Pay05_RelateAppr.updateApprId` |
| `deleteRetireId` | delete | 107 | [`pay05_relate_appr`](../../../db/tables/pay.md) |  | `pay.Pay12_RetireInsure.getInsureRetire` |
