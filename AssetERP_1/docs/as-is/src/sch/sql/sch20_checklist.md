# sch20_checklist

`server/sch/mapper/sch20_checklist.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`sch03_deadline`](../../../db/tables/sch.md), [`sch20_checklist`](../../../db/tables/sch.md) | `f_cdnm`, `f_sysdate` | `sch.Sch20_Checklist.selectById` |
| `selectBySearchText` | select | 37 | [`sch03_deadline`](../../../db/tables/sch.md), [`sch20_checklist`](../../../db/tables/sch.md) | `f_cdnm`, `f_sysdate` | `sch.Sch20_Checklist.selectBySearchText` |
| `selectByCheckId` | select | 59 | [`sch20_checklist`](../../../db/tables/sch.md) |  | `sch.Sch20_Checklist.selectByCheckId` |
