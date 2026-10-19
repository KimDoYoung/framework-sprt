# icam.Icam55_IcamUser

`server/icam/Icam55_IcamUser.java`

서비스 키 `icam.Icam55_IcamUser.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`icam55_icam_user.selectById`](../../icam/sql/icam55_icam_user.md) | - |  |
| `selectBySearchText` | 26 | [`icam55_icam_user.selectBySearchText`](../../icam/sql/icam55_icam_user.md) | `Icam55_Tab_UserRegAppr`, `Icam55_Tab_UserStopAuthAppr` |  |
| `selectByDate` | 39 | [`icam55_icam_user.selectByDate`](../../icam/sql/icam55_icam_user.md) | `Icam55_Tab_UserApprResult` |  |
| `selectByProcStateCode` | 52 | [`icam55_icam_user.selectByProcStateCode`](../../icam/sql/icam55_icam_user.md) | `Icam55_Tab_UserStopAuth` |  |
| `deleteApprId` | 64 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md) | `Icam55_Tab_UserRegAppr`, `Icam55_Tab_UserStopAuthAppr` |  |
| `updateApprId` | 76 | [`icam55_icam_user.updateApprId`](../../icam/sql/icam55_icam_user.md) | `Icam55_Tab_UserRegAppr` |  |
| `updateApprIds` | 88 | [`icam55_icam_user.updateApprId`](../../icam/sql/icam55_icam_user.md) | `Icam55_Tab_UserStopAuthAppr` |  |
| `updateResult` | 103 | [`icam55_icam_user.updateResult`](../../icam/sql/icam55_icam_user.md) | `Icam55_Lookup_UserApprResult` |  |
| `updateMultiAuth` | 126 | [`icam55_icam_user.updateStopAuth`](../../icam/sql/icam55_icam_user.md) | `Icam55_Lookup_UserStopAuth` |  |
| `updateEachAuth` | 149 | [`icam55_icam_user.updateStopAuth`](../../icam/sql/icam55_icam_user.md) | `Icam55_Edit_UserStopAuth` |  |
| `updateModel` | 163 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(icam55_icam_user)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 180 | `UpdateDataModel(icam55_icam_user)` 동적 INSERT/UPDATE | `Icam55_Edit_UserRegAppr`, `Icam55_Lookup_RegContent`, `Icam55_Tab_UserApprResult`, `Icam55_Tab_UserStopAuthAppr` | `UpdateDataModel` |
| `delete` | 185 | `UpdateDataModel(icam55_icam_user)` 동적 DELETE | `Icam55_Tab_UserRegAppr`, `Icam55_Tab_UserStopAuthAppr` | `UpdateDataModel` |
