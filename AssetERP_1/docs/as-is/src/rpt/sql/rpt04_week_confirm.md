# rpt04_week_confirm

`server/rpt/mapper/rpt04_week_confirm.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`rpt04_week_confirm`](../../../db/tables/rpt.md) |  | `rpt.Rpt04_WeekConfirm.selectById` |
| `selectByCompanyId` | select | 27 | [`rpt04_week_confirm`](../../../db/tables/rpt.md) | `f_emp_kor_nm`, `f_get_emptrans` | `rpt.Rpt04_WeekConfirm.selectByCompanyId` |
| `selectByConfirmerId` | select | 37 | [`rpt04_week_confirm`](../../../db/tables/rpt.md) | `f_emp_kor_nm`, `f_get_emptrans` | `rpt.Rpt04_WeekConfirm.selectByConfirmerId` |
| `confirmUpdate` | insert | 49 | [`rpt04_week_confirm`](../../../db/tables/rpt.md) | `f_create_seq`, `f_sysdate` | `rpt.Rpt04_WeekConfirm.confirmUpdate` |
| `updateNote` | update | 84 | [`rpt04_week_confirm`](../../../db/tables/rpt.md) | `f_create_seq` | `rpt.Rpt04_WeekConfirm.updateNote` |
| `updateByPersonId` | update | 109 | [`rpt04_week_confirm`](../../../db/tables/rpt.md) |  | `rpt.Rpt04_WeekConfirm.updateByPersonId` |
