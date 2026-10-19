# fnd.Fnd08_OrgAuth

`server/fnd/Fnd08_OrgAuth.java`

서비스 키 `fnd.Fnd08_OrgAuth.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 26 | [`fnd08_org_auth.selectByAll`](../../fnd/sql/fnd08_org_auth.md) | - |  |
| `updateAuthYn` | 37 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd08_org_auth.checkOrgAuth`](../../fnd/sql/fnd08_org_auth.md), `UpdateDataModel(fnd08_org_auth)` 동적 INSERT/UPDATE | `Fnd08_Lookup_OrgAuth` | `UpdateDataModel` |
| `update` | 81 | `UpdateDataModel(fnd08_org_auth)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
