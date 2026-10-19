# sch03_deadline

`server/sch/mapper/sch03_deadline.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 54 | [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_sysdate` | `sch.Sch03_Deadline.selectById`, `sch.Sch03_Deadline.updateModel` |
| `selectByClassTreeId` | select | 74 | [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_sysdate` | `sch.Sch03_Deadline.selectByClassTreeId` |
| `selectByInfoId` | select | 97 | [`sch03_deadline`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_sysdate` | `sch.Sch03_Deadline.selectByInfoId` |
| `selectDeadlineName` | select | 118 | [`sch03_deadline`](../../../db/tables/sch.md) | `f_get_deadline_nm` | `sch.Sch03_Deadline.selectDeadlineName` |
| `createSch09` | select | 125 | [`sch01_info`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md) | `f_create_schdeadlineday` | - |
| `insert` | insert | 135 | [`sch03_deadline`](../../../db/tables/sch.md) |  | `sch.Sch03_Deadline.insertModel`, `sch.Sch03_Deadline.updateModel` |
| `insertByInfoId` | insert | 190 | [`sch03_deadline`](../../../db/tables/sch.md) | `f_create_seq` | `sch.Sch01_Info.copySchedule` |
| `deleteByInfoId` | delete | 220 | [`sch03_deadline`](../../../db/tables/sch.md) |  | `sch.Sch03_Deadline.deleteByInfoId` |
