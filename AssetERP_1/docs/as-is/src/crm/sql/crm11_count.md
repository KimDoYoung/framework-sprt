# crm11_count

`server/crm/mapper/crm11_count.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`crm11_count`](../../../db/tables/crm.md) |  | - |
| `insertUpdateCount` | insert | 22 | [`crm11_count`](../../../db/tables/crm.md) | `f_create_seq`, `f_sysdate` | `crm.Crm11_Count.insertUpdateCount` |
