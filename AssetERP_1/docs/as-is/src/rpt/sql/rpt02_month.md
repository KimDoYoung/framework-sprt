# rpt02_month

`server/rpt/mapper/rpt02_month.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`rpt02_month`](../../../db/tables/rpt.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `rpt.Rpt02_Month.selectById` |
| `selectByText` | select | 33 | [`rpt02_month`](../../../db/tables/rpt.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `rpt.Rpt02_Month.selectByText`, `sys.Sys99_Print.insertRdMonth` |
