# emp24_joint_leave

`server/emp/mapper/emp24_joint_leave.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`apr01_appr`](../../../db/tables/apr.md), [`emp24_joint_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp24_JointLeave.selectById` |
| `selectByCompanyId` | select | 28 | [`apr01_appr`](../../../db/tables/apr.md), [`emp24_joint_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp24_JointLeave.selectByCompanyId` |
| `selectByYear` | select | 37 | [`apr01_appr`](../../../db/tables/apr.md), [`emp24_joint_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp24_JointLeave.selectByYear` |
| `updateApprId` | update | 48 | [`emp24_joint_leave`](../../../db/tables/emp.md) |  | `emp.Emp24_JointLeave.updateApprId` |
