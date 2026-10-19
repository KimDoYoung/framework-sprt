# emp26_init_leave

`server/emp/mapper/emp26_init_leave.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp26_init_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `emp.Emp26_InitLeave.selectById` |
| `selectByCompanyId` | select | 37 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp26_init_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `emp.Emp26_InitLeave.selectByCompanyId` |
| `selectByYear` | select | 58 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp26_init_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `emp.Emp26_InitLeave.selectByYear` |
