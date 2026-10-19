# sch.Sch05_RelateIcs

`server/sch/Sch05_RelateIcs.java`

서비스 키 `sch.Sch05_RelateIcs.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`sch05_relate_ics.selectById`](../../sch/sql/sch05_relate_ics.md) | - |  |
| `selectByInfoId` | 26 | [`sch05_relate_ics.selectByInfoId`](../../sch/sql/sch05_relate_ics.md) | `Sch05_Page_RelateIcs`, `Sch21_Edit_ChecklistContent` |  |
| `selectByIcsClassTreeId` | 34 | [`ics01_class_tree.selectByRelateIcsId`](../../ics/sql/ics01_class_tree.md) | `Sch05_Lookup_IcsClass`, `Sch05_Lookup_IcsClass_backup` |  |
| `modelUpdate` | 40 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sch05_relate_ics)` 동적 INSERT/UPDATE | `Ics10_Edit_Checklist` | `UpdateDataModel` |
| `deleteCheckListCont` | 53 | [`sch05_relate_ics.deleteCheckListCont`](../../sch/sql/sch05_relate_ics.md) | `Sch21_Page_AddChecklistContent` |  |
| `update` | 63 | `UpdateDataModel(sch05_relate_ics)` 동적 INSERT/UPDATE | `Sch21_Edit_ChecklistContent` | `UpdateDataModel` |
| `delete` | 68 | `UpdateDataModel(sch05_relate_ics)` 동적 DELETE | `Sch05_Page_RelateIcs`, `Sch21_Edit_ChecklistContent` | `UpdateDataModel` |
