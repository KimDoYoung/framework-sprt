# apr21_relate_appr

`server/apr/mapper/apr21_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`apr01_appr`](../../../db/tables/apr.md), [`apr21_relate_appr`](../../../db/tables/apr.md) |  | `apr.Apr21_RelateAppr.selectById` |
| `selectByApprId` | select | 32 | [`apr01_appr`](../../../db/tables/apr.md), [`apr21_relate_appr`](../../../db/tables/apr.md) |  | `apr.Apr21_RelateAppr.selectByApprId` |
| `deleteByApprId` | delete | 47 | [`apr21_relate_appr`](../../../db/tables/apr.md) |  | `apr.Apr01_Appr.update`, `apr.Apr21_RelateAppr.insert` |
