# apr08_appr_role

`server/apr/mapper/apr08_appr_role.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`apr08_appr_role`](../../../db/tables/apr.md) |  | `apr.Apr08_ApprRole.selectById` |
| `selectByAll` | select | 25 | [`apr08_appr_role`](../../../db/tables/apr.md) | `f_cdnm`, `f_sysdate` | `apr.Apr08_ApprRole.selectByAll` |
