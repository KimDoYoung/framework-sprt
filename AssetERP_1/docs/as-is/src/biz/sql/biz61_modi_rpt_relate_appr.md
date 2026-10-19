# biz61_modi_rpt_relate_appr

`server/biz/mapper/biz61_modi_rpt_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`apr01_appr`](../../../db/tables/apr.md), [`biz61_modi_rpt_relate_appr`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz61_ModiRptRelateAppr.selectById` |
| `selectByCompanyId` | select | 26 | [`apr01_appr`](../../../db/tables/apr.md), [`biz61_modi_rpt_relate_appr`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz61_ModiRptRelateAppr.selectByCompanyId`, `biz.Biz61_ModiRptRelateAppr.updateApprId` |
| `insert` | insert | 37 | [`biz61_modi_rpt_relate_appr`](../../../db/tables/biz.md) | `f_create_seq` | `biz.Biz61_ModiRptRelateAppr.updateApprId` |
| `updateApprId` | update | 53 | [`biz61_modi_rpt_relate_appr`](../../../db/tables/biz.md) |  | `biz.Biz61_ModiRptRelateAppr.updateApprId` |
