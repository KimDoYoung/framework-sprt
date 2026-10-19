# ics.Ics10_Checklist

`server/ics/Ics10_Checklist.java`

서비스 키 `ics.Ics10_Checklist.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`ics10_checklist.selectById`](../../ics/sql/ics10_checklist.md) | - |  |
| `selectBySearchText` | 27 | [`ics10_checklist.selectBySearchText`](../../ics/sql/ics10_checklist.md) | `Ics10_Lookup_UseYn`, `Ics10_Tab_Checklist` |  |
| `selectByAdmin` | 40 | [`ics10_checklist.selectByAdmin`](../../ics/sql/ics10_checklist.md) | `Ics10_Tab_ChecklistAdmin` |  |
| `selectByPersonId` | 53 | [`ics10_checklist.selectByPersonId`](../../ics/sql/ics10_checklist.md) | `Ics15_Tab_ChecklistWrite` |  |
| `modelUpdate` | 69 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.updateUseYn`](../../ics/sql/ics11_checklist_company.md), `UpdateDataModel(ics10_checklist)` 동적 INSERT/UPDATE | `Ics10_Edit_Checklist` | `UpdateDataModel` |
| `preDelete` | 91 | [`ics15_checklist_write.deleteChecklistIdCheck`](../../ics/sql/ics15_checklist_write.md) | `Ics10_Tab_Checklist` |  |
| `update` | 116 | `UpdateDataModel(ics10_checklist)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 121 | `UpdateDataModel(ics10_checklist)` 동적 DELETE | `Ics10_Tab_Checklist`, `Ics10_Tab_ChecklistAdmin` | `UpdateDataModel` |
