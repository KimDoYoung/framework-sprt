# rpt05_week_biz_class

`server/rpt/mapper/rpt05_week_biz_class.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`rpt05_week_biz_class`](../../../db/tables/rpt.md) | `f_cdnm`, `f_today` | `rpt.Rpt05_WeekBizClass.selectById` |
| `selectByPersonId` | select | 23 | [`rpt05_week_biz_class`](../../../db/tables/rpt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `rpt.Rpt05_WeekBizClass.selectByPersonId` |
| `upsert` | insert | 37 | [`rpt05_week_biz_class`](../../../db/tables/rpt.md) | `f_create_seq` | `rpt.Rpt05_WeekBizClass.upsert` |
