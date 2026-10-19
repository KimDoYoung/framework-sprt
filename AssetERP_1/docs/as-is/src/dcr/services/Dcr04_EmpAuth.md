# dcr.Dcr04_EmpAuth

`server/dcr/Dcr04_EmpAuth.java`

서비스 키 `dcr.Dcr04_EmpAuth.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`dcr04_emp_auth.selectById`](../../dcr/sql/dcr04_emp_auth.md) | - |  |
| `selectByText` | 25 | [`dcr04_emp_auth.selectByText`](../../dcr/sql/dcr04_emp_auth.md) | `Dcr04_TabPage_EmpAuth` |  |
| `getTargetList` | 34 | [`dcr04_emp_auth.getTargetList`](../../dcr/sql/dcr04_emp_auth.md) | `Dcr04_Lookup_DocList` |  |
| `getTargetClassTreeList` | 43 | [`dcr04_emp_auth.getTargetClassTreeList`](../../dcr/sql/dcr04_emp_auth.md) | `Dcr04_TabPage_DocList` |  |
| `updateList` | 52 | [`dcr04_emp_auth.checkPerson`](../../dcr/sql/dcr04_emp_auth.md), [`dcr04_emp_auth.updateNote`](../../dcr/sql/dcr04_emp_auth.md), `UpdateDataModel(dcr04_emp_auth)` 동적 INSERT/UPDATE | `Dcr04_TabPage_EmpAuth` | `UpdateDataModel` |
| `update` | 76 | `UpdateDataModel(dcr04_emp_auth)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 81 | `UpdateDataModel(dcr04_emp_auth)` 동적 DELETE | `Dcr04_TabPage_DocList`, `Dcr04_TabPage_EmpAuth` | `UpdateDataModel` |
