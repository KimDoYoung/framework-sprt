# apr12_relate_adv

`server/apr/mapper/apr12_relate_adv.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 34 | [`adv02_account`](../../../db/tables/adv.md), [`apr12_relate_adv`](../../../db/tables/apr.md) |  | - |
| `selectByApprId` | select | 43 | [`adv02_account`](../../../db/tables/adv.md), [`apr12_relate_adv`](../../../db/tables/apr.md) |  | `apr.Apr12_RelateAdv.selectByApprId` |
| `deleteByApprId` | delete | 51 | [`apr12_relate_adv`](../../../db/tables/apr.md) |  | - |
