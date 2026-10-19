# bbs.Bbs11_Application

`server/bbs/Bbs11_Application.java`

서비스 키 `bbs.Bbs11_Application.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`bbs11_application.selectById`](../../bbs/sql/bbs11_application.md) | - |  |
| `selectByPersonId` | 26 | [`bbs11_application.selectByPersonId`](../../bbs/sql/bbs11_application.md) | `Bbs11_Tab_Application` |  |
| `selectByResultCheck` | 38 | [`bbs11_application.selectByResultCheck`](../../bbs/sql/bbs11_application.md) | `Bbs11_Tab_ApplicationMng` |  |
| `selectByAppStatus` | 50 | [`bbs11_application.selectByAppStatus`](../../bbs/sql/bbs11_application.md) | `Emp15_Lookup_GetCert`, `Emp15_Tab_Cert` |  |
| `modelUpdate` | 59 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs11_application)` 동적 INSERT/UPDATE | `Bbs11_Edit_Application`, `Bbs11_Tab_ApplicationMng` | `UpdateDataModel` |
| `updateAppStatus` | 72 | [`bbs11_application.updateAppStatus`](../../bbs/sql/bbs11_application.md) | `Emp15_Lookup_StampDocCert` |  |
| `update` | 80 | `UpdateDataModel(bbs11_application)` 동적 INSERT/UPDATE | `Bbs11_Tab_ApplicationMng` | `UpdateDataModel` |
| `delete` | 85 | `UpdateDataModel(bbs11_application)` 동적 DELETE | `Bbs11_Tab_Application` | `UpdateDataModel` |
