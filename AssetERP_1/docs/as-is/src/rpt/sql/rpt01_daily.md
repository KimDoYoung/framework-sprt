# rpt01_daily

`server/rpt/mapper/rpt01_daily.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`rpt01_daily`](../../../db/tables/rpt.md) |  | `rpt.Rpt01_Daily.selectById` |
| `selectByText` | select | 32 | [`rpt01_daily`](../../../db/tables/rpt.md) | `f_emp_kor_nm` | `rpt.Rpt01_Daily.selectByText` |
| `selectByConfirmText` | select | 45 | [`rpt01_daily`](../../../db/tables/rpt.md) | `f_emp_kor_nm`, `f_get_emptrans` | `rpt.Rpt01_Daily.selectByConfirmText`, `sys.Sys99_Print.insertRdDaily` |
| `confirmUpdate` | update | 73 | [`rpt01_daily`](../../../db/tables/rpt.md) |  | `rpt.Rpt01_Daily.confirmUpdate` |
| `delete` | delete | 81 | [`rpt01_daily`](../../../db/tables/rpt.md) |  | - |
