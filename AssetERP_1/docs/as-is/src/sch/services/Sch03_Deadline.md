# sch.Sch03_Deadline

`server/sch/Sch03_Deadline.java`

서비스 키 `sch.Sch03_Deadline.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) | `Ics01_Lookup_Info`, `Sch04_Lookup_IcrList`, `Sch04_Lookup_IcsList`, `Sch04_Lookup_SchList` |  |
| `selectByClassTreeId` | 27 | [`sch03_deadline.selectByClassTreeId`](../../sch/sql/sch03_deadline.md) | `Icr01_Grid_IcrType`, `Sch03_Lookup_Icr`, `Sch03_Lookup_Ics`, `Sch03_Lookup_IcsUser` |  |
| `selectByInfoId` | 33 | [`sch03_deadline.selectByInfoId`](../../sch/sql/sch03_deadline.md) | `Sch01_Lookup_Info`, `Sch20_Edit_Checklist` |  |
| `selectDeadlineName` | 43 | [`sch03_deadline.selectDeadlineName`](../../sch/sql/sch03_deadline.md) | `Icr01_Edit_ClassTree`, `Ics01_Edit_ClassTree` |  |
| `updateModel` | 50 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch03_deadline.insert`](../../sch/sql/sch03_deadline.md), [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) | `Sch01_Lookup_Info`, `Sch03_Lookup_Icr`, `Sch03_Lookup_Ics`, `Sch20_Edit_Checklist` |  |
| `insertModel` | 76 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch03_deadline.insert`](../../sch/sql/sch03_deadline.md), `UpdateDataModel(sch03_deadline)` 동적 INSERT/UPDATE | `Sch03_Lookup_Cycle`, `Sch03_Lookup_Short` | `UpdateDataModel` |
| `deleteByInfoId` | 95 | [`sch03_deadline.deleteByInfoId`](../../sch/sql/sch03_deadline.md) | `Sch20_Edit_Checklist` |  |
| `update` | 103 | `UpdateDataModel(sch03_deadline)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 108 | `UpdateDataModel(sch03_deadline)` 동적 DELETE | `Sch01_Lookup_Info`, `Sch03_Lookup_Icr`, `Sch03_Lookup_Ics`, `Sch20_Edit_Checklist` | `UpdateDataModel` |
