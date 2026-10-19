# sch05_relate_ics

`server/sch/mapper/sch05_relate_ics.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `sch.Sch05_RelateIcs.selectById` |
| `selectByInfoId` | select | 30 | [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md) | `f_cdnm`, `f_get_deadline_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate` | `sch.Sch05_RelateIcs.selectByInfoId` |
| `insertByInfoId` | insert | 42 | [`sch05_relate_ics`](../../../db/tables/sch.md) | `f_create_seq` | `sch.Sch01_Info.copySchedule` |
| `deleteCheckListCont` | delete | 53 | [`sch05_relate_ics`](../../../db/tables/sch.md) |  | `sch.Sch05_RelateIcs.deleteCheckListCont` |
