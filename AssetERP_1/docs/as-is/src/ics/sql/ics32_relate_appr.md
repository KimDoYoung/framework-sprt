# ics32_relate_appr

`server/ics/mapper/ics32_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`ics32_relate_appr`](../../../db/tables/ics.md) |  | `ics.Ics32_RelateAppr.selectById` |
| `selectByCompanyId` | select | 30 | [`apr01_appr`](../../../db/tables/apr.md), [`ics32_relate_appr`](../../../db/tables/ics.md) | `f_cdnm` | `ics.Ics32_RelateAppr.insert`, `ics.Ics32_RelateAppr.selectByCompanyId` |
| `selectByCount` | select | 41 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`ics32_relate_appr`](../../../db/tables/ics.md), [`org00_org_info`](../../../db/views.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm` | `ics.Ics32_RelateAppr.selectByCount` |
| `insert` | insert | 114 | [`ics32_relate_appr`](../../../db/tables/ics.md) |  | `ics.Ics32_RelateAppr.insert` |
| `updateApprId` | update | 130 | [`ics32_relate_appr`](../../../db/tables/ics.md) |  | `ics.Ics32_RelateAppr.updateApprId` |
