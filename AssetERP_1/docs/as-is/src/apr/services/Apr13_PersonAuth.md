# apr.Apr13_PersonAuth

`server/apr/Apr13_PersonAuth.java`

서비스 키 `apr.Apr13_PersonAuth.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`apr13_person_auth.selectById`](../../apr/sql/apr13_person_auth.md) | - |  |
| `selectByApprId` | 22 | [`apr13_person_auth.selectByApprId`](../../apr/sql/apr13_person_auth.md) | `Apr13_Lookup_PersonAuth` |  |
| `update` | 28 | `UpdateDataModel(apr13_person_auth)` 동적 INSERT/UPDATE | `Apr13_Lookup_PersonAuth` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(apr13_person_auth)` 동적 DELETE | `Apr13_Lookup_PersonAuth` | `UpdateDataModel` |
