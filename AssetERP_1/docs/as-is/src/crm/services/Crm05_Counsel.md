# crm.Crm05_Counsel

`server/crm/Crm05_Counsel.java`

서비스 키 `crm.Crm05_Counsel.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`crm05_counsel.selectById`](../../crm/sql/crm05_counsel.md) | - |  |
| `selectByFindText` | 29 | [`crm05_counsel.selectByFindText`](../../crm/sql/crm05_counsel.md) | `Crm05_Tab_CounselInfo_in`, `Crm05_Tab_CounselInfo_out` |  |
| `update` | 67 | `UpdateDataModel(crm05_counsel)` 동적 INSERT/UPDATE | `Crm05_Edit_CounselInfo_in`, `Crm05_Edit_CounselInfo_out` | `UpdateDataModel` |
| `delete` | 79 | `UpdateDataModel(crm05_counsel)` 동적 DELETE | `Crm05_Tab_CounselInfo_in`, `Crm05_Tab_CounselInfo_out` | `UpdateDataModel` |
