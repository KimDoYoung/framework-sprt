# emp20_leave

`server/emp/mapper/emp20_leave.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 70 | [`apr01_appr`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp20_Leave.selectById`, `emp.Emp20_Leave.updateOverConfirm` |
| `selectByPersonId` | select | 102 | [`apr01_appr`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp24_joint_leave`](../../../db/tables/emp.md), [`emp27_leave_old`](../../../db/tables/emp.md), [`emp28_joint_leave_except`](../../../db/tables/emp.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_biz_days`, `f_get_close_date`, `f_get_emptrans`, `f_get_leave_count`, `f_sysdate` | `emp.Emp20_Leave.selectByPersonId`, `sys.Sys99_Print.insertRdLeaveManager` |
| `selectByPersonName` | select | 240 | [`apr01_appr`](../../../db/tables/apr.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp24_joint_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_biz_days`, `f_sysdate` | `emp.Emp20_Leave.selectByPersonName`, `sys.Sys99_Print.insertRdLeaveList` |
| `selectByDays` | select | 303 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md) | `f_get_close_date`, `f_get_leave_days`, `f_get_leave_days2`, `f_today` | `emp.Emp20_Leave.selectByDays` |
| `selectByDate` | select | 331 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` | `emp.Emp20_Leave.selectByDate` |
| `selectByDatePaging` | select | 339 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` | `emp.Emp20_Leave.selectByDatePaging` |
| `selectByDatePagingTotal` | select | 349 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` | `emp.Emp20_Leave.selectByDatePaging` |
| `selectMyPageLeave` | sql | 357 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` |  |
| `leaveDateCheck` | select | 473 | [`emp20_leave`](../../../db/tables/emp.md) |  | `emp.Emp20_Leave.leaveDateCheck` |
| `count` | select | 485 | - | `f_get_leave_count` | `emp.Emp20_Leave.count` |
| `countByDate` | select | 489 | - | `f_get_leave_count_by_date` | `emp.Emp20_Leave.count` |
| `checkSpcLeaveCode` | select | 493 | [`emp20_leave`](../../../db/tables/emp.md) |  | `emp.Emp20_Leave.checkSpcLeaveCode`, `sys.Sys09_Code.checkCode` |
| `cancelUpdate` | update | 501 | [`emp20_leave`](../../../db/tables/emp.md) |  | `emp.Emp20_Leave.cancelUpdate` |
| `updateOverConfirm` | update | 507 | [`emp20_leave`](../../../db/tables/emp.md) | `f_sysdate` | `emp.Emp20_Leave.updateOverConfirm` |
