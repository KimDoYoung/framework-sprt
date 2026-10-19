# biz05_relate_appr

`server/biz/mapper/biz05_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`biz05_relate_appr`](../../../db/tables/biz.md) |  | `biz.Biz05_RelateAppr.selectById` |
| `selectByPromoId` | select | 31 | [`apr01_appr`](../../../db/tables/apr.md), [`biz05_relate_appr`](../../../db/tables/biz.md) | `f_cdnm`, `f_emp_kor_nm` | `biz.Biz05_RelateAppr.selectByPromoId` |
| `selectByPromoIdList` | select | 43 | [`apr01_appr`](../../../db/tables/apr.md), [`biz05_relate_appr`](../../../db/tables/biz.md) |  | `biz.Biz05_RelateAppr.selectByPromoIdList` |
| `selectByDataYm` | select | 57 | [`apr01_appr`](../../../db/tables/apr.md), [`biz05_relate_appr`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz05_RelateAppr.insert`, `biz.Biz05_RelateAppr.selectApprId`, `biz.Biz05_RelateAppr.selectByDataYm` |
| `selectByPersonId` | select | 68 | [`apr01_appr`](../../../db/tables/apr.md), [`biz05_relate_appr`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz05_RelateAppr.insertPersonId`, `biz.Biz05_RelateAppr.selectByPersonId` |
| `selectFileCount` | select | 81 | [`biz05_relate_appr`](../../../db/tables/biz.md), [`sys10_file`](../../../db/tables/sys.md) |  | `biz.Biz05_RelateAppr.selectFileCount` |
| `insert` | insert | 89 | [`biz05_relate_appr`](../../../db/tables/biz.md) |  | `biz.Biz05_RelateAppr.insert` |
| `insertPersonId` | insert | 109 | [`biz05_relate_appr`](../../../db/tables/biz.md) |  | `biz.Biz05_RelateAppr.insertPersonId` |
| `updateApprId` | update | 131 | [`biz05_relate_appr`](../../../db/tables/biz.md) |  | `biz.Biz05_RelateAppr.updateApprId` |
| `deleteByApprId` | delete | 137 | [`biz05_relate_appr`](../../../db/tables/biz.md) |  | `biz.Biz05_RelateAppr.insert`, `biz.Biz05_RelateAppr.insertPersonId` |
