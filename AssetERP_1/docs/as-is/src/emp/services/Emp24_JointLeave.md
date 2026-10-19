# emp.Emp24_JointLeave

`server/emp/Emp24_JointLeave.java`

서비스 키 `emp.Emp24_JointLeave.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`emp24_joint_leave.selectById`](../../emp/sql/emp24_joint_leave.md) | - |  |
| `selectByCompanyId` | 28 | [`emp24_joint_leave.selectByCompanyId`](../../emp/sql/emp24_joint_leave.md) | - |  |
| `selectByYear` | 38 | [`emp24_joint_leave.selectByYear`](../../emp/sql/emp24_joint_leave.md) | `Emp24_Tab_JointLeave` |  |
| `updateApprId` | 49 | [`emp24_joint_leave.updateApprId`](../../emp/sql/emp24_joint_leave.md) | `Emp24_Tab_JointLeave` |  |
| `deleteApprId` | 64 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md) | `Emp24_Tab_JointLeave` |  |
| `update` | 76 | `UpdateDataModel(emp24_joint_leave)` 동적 INSERT/UPDATE | `Emp24_Tab_JointLeave` | `UpdateDataModel` |
| `delete` | 81 | `UpdateDataModel(emp24_joint_leave)` 동적 DELETE | `Emp24_Tab_JointLeave` | `UpdateDataModel` |
