# sch.Sch20_Checklist

`server/sch/Sch20_Checklist.java`

서비스 키 `sch.Sch20_Checklist.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`sch20_checklist.selectById`](../../sch/sql/sch20_checklist.md) | `Sch20_Edit_Checklist` |  |
| `selectBySearchText` | 25 | [`sch20_checklist.selectBySearchText`](../../sch/sql/sch20_checklist.md) | `Sch20_Tab_AddChecklist` |  |
| `selectByCheckId` | 35 | [`sch20_checklist.selectByCheckId`](../../sch/sql/sch20_checklist.md) | `Sch21_Edit_ChecklistContent` |  |
| `update` | 41 | `UpdateDataModel(sch20_checklist)` 동적 INSERT/UPDATE | `Sch20_Edit_Checklist` | `UpdateDataModel` |
| `delete` | 49 | `UpdateDataModel(sch20_checklist)` 동적 DELETE | `Sch20_Tab_AddChecklist` | `UpdateDataModel` |
