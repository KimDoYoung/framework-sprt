# emp23_etc_leave_person

`server/emp/mapper/emp23_etc_leave_person.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp23_EtcLeavePerson.selectById` |
| `selectByPersonId` | select | 24 | [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp23_EtcLeavePerson.selectByPersonId` |
| `selectByEtcLeaveId` | select | 33 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md) | `f_code_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_seq`, `f_sysdate` | `emp.Emp23_EtcLeavePerson.selectByEtcLeaveId` |
