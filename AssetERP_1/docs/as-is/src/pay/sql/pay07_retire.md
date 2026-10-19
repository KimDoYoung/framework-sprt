# pay07_retire

`server/pay/mapper/pay07_retire.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 57 | [`apr01_appr`](../../../db/tables/apr.md), [`pay07_retire`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay07_Retire.selectById` |
| `selectByCompanyId` | select | 66 | [`apr01_appr`](../../../db/tables/apr.md), [`pay07_retire`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay07_Retire.selectByCompanyId` |
| `selectByPersonId` | select | 75 | [`apr01_appr`](../../../db/tables/apr.md), [`pay07_retire`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay07_Retire.selectByPersonId` |
| `countRetire` | select | 85 | [`pay07_retire`](../../../db/tables/pay.md) |  | `pay.Pay07_Retire.countRetire` |
| `checkAppr` | select | 91 | [`apr01_appr`](../../../db/tables/apr.md), [`pay07_retire`](../../../db/tables/pay.md) |  | `pay.Pay07_Retire.createRetire`, `pay.Pay07_Retire.deleteRetire` |
| `updateApprId` | update | 98 | [`pay07_retire`](../../../db/tables/pay.md) |  | `pay.Pay07_Retire.updateApprId` |
