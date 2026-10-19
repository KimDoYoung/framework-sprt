# crm.Crm02_Inspection

`server/crm/Crm02_Inspection.java`

서비스 키 `crm.Crm02_Inspection.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`crm02_inspection.selectById`](../../crm/sql/crm02_inspection.md) | - |  |
| `selectByFindText` | 29 | [`crm02_inspection.selectByFindText`](../../crm/sql/crm02_inspection.md) | `Crm02_Tab_Inspection`, `Crm02_Tab_InspectionManager` |  |
| `update` | 56 | `UpdateDataModel(crm02_inspection)` 동적 INSERT/UPDATE | `Crm02_Edit_Inspection` | `UpdateDataModel` |
| `delete` | 68 | `UpdateDataModel(crm02_inspection)` 동적 DELETE | `Crm02_Tab_InspectionManager` | `UpdateDataModel` |
