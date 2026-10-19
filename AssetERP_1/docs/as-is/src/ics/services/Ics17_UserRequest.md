# ics.Ics17_UserRequest

`server/ics/Ics17_UserRequest.java`

서비스 키 `ics.Ics17_UserRequest.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`ics17_user_request.selectById`](../../ics/sql/ics17_user_request.md) | - |  |
| `selectBySearchText` | 31 | [`ics17_user_request.selectBySearchText`](../../ics/sql/ics17_user_request.md) | `Ics17_Tab_UserRequest` |  |
| `selectBySearchTextAdmin` | 51 | [`ics17_user_request.selectBySearchTextAdmin`](../../ics/sql/ics17_user_request.md) | `Ics17_Tab_UserRequestAdmin` |  |
| `updateLawContent` | 73 | [`ics17_user_request.updateLawContent`](../../ics/sql/ics17_user_request.md) | `Ics17_Lookup_LawContent` |  |
| `update` | 84 | `UpdateDataModel(ics17_user_request)` 동적 INSERT/UPDATE | `Ics17_Edit_UserRequest`, `Ics17_Edit_UserRequestAdmin` | `UpdateDataModel` |
| `delete` | 97 | `UpdateDataModel(ics17_user_request)` 동적 DELETE | `Ics17_Edit_UserRequest` | `UpdateDataModel` |
