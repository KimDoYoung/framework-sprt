# crm10_cmnt

`server/crm/mapper/crm10_cmnt.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`crm10_cmnt`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md) |  | - |
| `selectByItemId` | select | 30 | [`crm10_cmnt`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md) |  | `crm.Crm01_Item.delete`, `crm.Crm10_Comment.selectByItemId` |
