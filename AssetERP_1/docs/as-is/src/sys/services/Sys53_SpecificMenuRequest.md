# sys.Sys53_SpecificMenuRequest

`server/sys/Sys53_SpecificMenuRequest.java`

서비스 키 `sys.Sys53_SpecificMenuRequest.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sys53_specific_menu_request.selectById`](../../sys/sql/sys53_specific_menu_request.md) | - |  |
| `selectByText` | 23 | [`sys53_specific_menu_request.selectByText`](../../sys/sql/sys53_specific_menu_request.md) | `Sys53_Tab_SpecificMenuRequest` |  |
| `selectByTextAdmin` | 33 | [`sys53_specific_menu_request.selectByTextAdmin`](../../sys/sql/sys53_specific_menu_request.md) | `Sys53_Tab_SpecificMenuRequestAdmin` |  |
| `update` | 43 | `UpdateDataModel(sys53_specific_menu_request)` 동적 INSERT/UPDATE | `Sys53_Tab_SpecificMenuRequest`, `Sys53_Tab_SpecificMenuRequestAdmin` | `UpdateDataModel` |
| `delete` | 48 | `UpdateDataModel(sys53_specific_menu_request)` 동적 DELETE | `Sys53_Tab_SpecificMenuRequest` | `UpdateDataModel` |
