# adv.Adv05_OrgAuth

`server/adv/Adv05_OrgAuth.java`

서비스 키 `adv.Adv05_OrgAuth.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`adv05_org_auth.selectById`](../../adv/sql/adv05_org_auth.md) | - |  |
| `updateAuthYn` | 29 | [`adv05_org_auth.checkOrgAuth`](../../adv/sql/adv05_org_auth.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(adv05_org_auth)` 동적 INSERT/UPDATE | `Adv05_Lookup_OrgAuth` | `UpdateDataModel` |
| `update` | 72 | `UpdateDataModel(adv05_org_auth)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 77 | `UpdateDataModel(adv05_org_auth)` 동적 DELETE | - | `UpdateDataModel` |
