# ics.Ics04_Share

`server/ics/Ics04_Share.java`

서비스 키 `ics.Ics04_Share.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`ics04_share.selectById`](../../ics/sql/ics04_share.md) | - |  |
| `selectByManagerId` | 25 | [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md) | `Icr01_Lookup_Share`, `Ics01_Lookup_Share`, `Ics04_Page_Share` |  |
| `update` | 36 | `UpdateDataModel(ics04_share)` 동적 INSERT/UPDATE | `Ics04_Page_Share` | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(ics04_share)` 동적 DELETE | `Ics04_Page_Share` | `UpdateDataModel` |
