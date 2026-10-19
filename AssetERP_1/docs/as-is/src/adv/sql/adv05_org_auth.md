# adv05_org_auth

`server/adv/mapper/adv05_org_auth.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`adv05_org_auth`](../../../db/tables/adv.md) |  | `adv.Adv05_OrgAuth.selectById` |
| `checkOrgAuth` | select | 20 | [`adv05_org_auth`](../../../db/tables/adv.md) |  | `adv.Adv05_OrgAuth.updateAuthYn` |
