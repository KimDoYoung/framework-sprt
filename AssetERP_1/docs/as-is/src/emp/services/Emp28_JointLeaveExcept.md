# emp.Emp28_JointLeaveExcept

`server/emp/Emp28_JointLeaveExcept.java`

서비스 키 `emp.Emp28_JointLeaveExcept.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`emp28_joint_leave_except.selectById`](../../emp/sql/emp28_joint_leave_except.md) | - |  |
| `selectByJointLeaveId` | 21 | [`emp28_joint_leave_except.selectByJointLeaveId`](../../emp/sql/emp28_joint_leave_except.md) | `Emp24_Tab_JointLeave` |  |
| `update` | 28 | `UpdateDataModel(emp28_joint_leave_except)` 동적 INSERT/UPDATE | `Emp24_Tab_JointLeave` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(emp28_joint_leave_except)` 동적 DELETE | `Emp24_Tab_JointLeave` | `UpdateDataModel` |
