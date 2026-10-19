# rpt03_week

`server/rpt/mapper/rpt03_week.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 44 | [`rpt03_week`](../../../db/tables/rpt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `rpt.Rpt03_Week.boldUpdate`, `rpt.Rpt03_Week.selectById` |
| `selectByStartDate` | select | 60 | [`rpt03_week`](../../../db/tables/rpt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `rpt.Rpt03_Week.selectByStartDate` |
| `selectByCompanyId` | select | 86 | [`rpt03_week`](../../../db/tables/rpt.md), [`rpt04_week_confirm`](../../../db/tables/rpt.md) | `f_emp_kor_nm`, `f_get_emptrans` | `rpt.Rpt03_Week.selectByCompanyId` |
| `selectByLastStartDate` | select | 146 | [`rpt03_week`](../../../db/tables/rpt.md) | `f_cdnm`, `f_sysdate` | `sys.Sys99_Print.insertRdWeekConfirm`, `sys.Sys99_Print.insertRdWeekWrite` |
| `getBeforeWeek` | select | 193 | [`rpt03_week`](../../../db/tables/rpt.md) |  | `rpt.Rpt03_Week.getBeforeWeek` |
| `getLastWeek` | select | 204 | [`rpt03_week`](../../../db/tables/rpt.md) | `f_emp_kor_nm`, `f_get_emptrans` | `rpt.Rpt03_Week.getLastWeek` |
| `checkWeekBizType` | select | 217 | [`rpt03_week`](../../../db/tables/rpt.md) |  | `rpt.Rpt03_Week.checkWeekBizType`, `sys.Sys09_Code.checkCode` |
| `boldUpdate` | update | 224 | [`rpt03_week`](../../../db/tables/rpt.md) |  | `rpt.Rpt03_Week.boldUpdate` |
| `insertBeforeWeek` | insert | 230 | [`rpt03_week`](../../../db/tables/rpt.md) | `f_create_seq` | `rpt.Rpt03_Week.insertBeforeWeek` |
| `modelUpsert` | insert | 241 | [`rpt03_week`](../../../db/tables/rpt.md) | `f_create_seq` | `rpt.Rpt03_Week.inUpdateData`, `rpt.Rpt03_Week.modelUpsert`, `rpt.Rpt03_Week.updateFixYn` |
