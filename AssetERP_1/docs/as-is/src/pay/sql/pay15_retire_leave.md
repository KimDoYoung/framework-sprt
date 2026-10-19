# pay15_retire_leave

`server/pay/mapper/pay15_retire_leave.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`pay15_retire_leave`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay15_RetireLeave.selectById` |
| `selectByMonthId` | select | 34 | [`pay15_retire_leave`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay15_RetireLeave.selectByMonthId` |
| `getRetireLeave` | select | 45 | [`apr01_appr`](../../../db/tables/apr.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay15_retire_leave`](../../../db/tables/pay.md) | `f_get_leave_days`, `f_get_leave_days2` | `pay.Pay15_RetireLeave.getRetireLeave` |
| `calcRemLeaveDays` | select | 82 | - | `f_calc_rem_leave_days` | `pay.Pay15_RetireLeave.calcRetireLeaveDays` |
| `selectRemLeaveDays` | select | 86 | [`pay16_retire_rem_leave`](../../../db/tables/pay.md) |  | `pay.Pay15_RetireLeave.selectRemLeaveDays` |
