# fnd08_org_auth

`server/fnd/mapper/fnd08_org_auth.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`fnd08_org_auth`](../../../db/tables/fnd.md) |  | - |
| `selectByAll` | select | 21 | [`fnd08_org_auth`](../../../db/tables/fnd.md) | `f_org_nm`, `f_sysdate` | `fnd.Fnd08_OrgAuth.selectByAll` |
| `checkOrgAuth` | select | 27 | [`fnd08_org_auth`](../../../db/tables/fnd.md) |  | `fnd.Fnd08_OrgAuth.updateAuthYn` |
