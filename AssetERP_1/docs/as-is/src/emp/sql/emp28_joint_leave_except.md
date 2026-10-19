# emp28_joint_leave_except

`server/emp/mapper/emp28_joint_leave_except.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`emp28_joint_leave_except`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp28_JointLeaveExcept.selectById` |
| `selectByJointLeaveId` | select | 24 | [`emp28_joint_leave_except`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp28_JointLeaveExcept.selectByJointLeaveId` |
