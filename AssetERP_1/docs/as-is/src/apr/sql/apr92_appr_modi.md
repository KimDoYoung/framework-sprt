# apr92_appr_modi

`server/apr/mapper/apr92_appr_modi.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`apr92_appr_modi`](../../../db/tables/apr.md) |  | `apr.Apr92_ApprModi.selectById` |
| `selectByPersonId` | select | 31 | [`apr92_appr_modi`](../../../db/tables/apr.md) |  | `apr.Apr01_Appr.modelUpdate`, `apr.Apr92_ApprModi.selectByPersonId` |
| `insert` | insert | 39 | [`apr01_appr`](../../../db/tables/apr.md), [`apr92_appr_modi`](../../../db/tables/apr.md) | `f_create_seq`, `f_sysdate` | `apr.Apr01_Appr.modelUpdate`, `apr.Apr92_ApprModi.insert` |
| `updateReason` | update | 61 | [`apr92_appr_modi`](../../../db/tables/apr.md) | `f_sysdate` | `apr.Apr01_Appr.modelUpdate` |
| `deleteByApprId` | delete | 68 | [`apr92_appr_modi`](../../../db/tables/apr.md) |  | `apr.Apr92_ApprModi.deleteByApprId` |
