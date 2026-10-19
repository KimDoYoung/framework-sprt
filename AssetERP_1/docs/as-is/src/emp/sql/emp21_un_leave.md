# emp21_un_leave

`server/emp/mapper/emp21_un_leave.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 52 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp21_UnLeave.selectById` |
| `selectByPersonId` | select | 73 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_close_date`, `f_get_emptrans`, `f_sysdate` | `emp.Emp21_UnLeave.selectByPersonId` |
| `selectByCompanyId` | select | 144 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp21_UnLeave.selectByCompanyId` |
| `selectByUnLeaveCode` | select | 165 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_close_date`, `f_get_emptrans`, `f_sysdate` | `emp.Emp21_UnLeave.selectByUnLeaveCode` |
| `selectByUnLeaveCode2` | select | 198 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp21_UnLeave.selectByUnLeaveCode2` |
| `updateApprId` | update | 237 | [`emp21_un_leave`](../../../db/tables/emp.md) |  | `emp.Emp21_UnLeave.insertAppr`, `emp.Emp21_UnLeave.insertAppr2` |
| `insert` | insert | 243 | [`emp21_un_leave`](../../../db/tables/emp.md) | `f_today` | `emp.Emp21_UnLeave.insert`, `emp.Emp21_UnLeave.insert2` |
