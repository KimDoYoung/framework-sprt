# dcr04_emp_auth

`server/dcr/mapper/dcr04_emp_auth.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans`, `f_sysdate` | `dcr.Dcr04_EmpAuth.selectById` |
| `checkPerson` | select | 32 | [`dcr04_emp_auth`](../../../db/tables/dcr.md) |  | `dcr.Dcr04_EmpAuth.updateList` |
| `selectByText` | select | 40 | [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans`, `f_sysdate` | `dcr.Dcr04_EmpAuth.selectByText` |
| `getTargetList` | select | 57 | [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans`, `f_sysdate` | `dcr.Dcr04_EmpAuth.getTargetList` |
| `getTargetClassTreeList` | select | 79 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md) | `f_class_tree_nm_allpath` | `dcr.Dcr04_EmpAuth.getTargetClassTreeList` |
| `update` | update | 94 | [`dcr04_emp_auth`](../../../db/tables/dcr.md) |  | - |
| `updateNote` | update | 101 | [`dcr04_emp_auth`](../../../db/tables/dcr.md) |  | `dcr.Dcr04_EmpAuth.updateList` |
| `deleteByEmpAuthId` | delete | 108 | [`dcr04_emp_auth`](../../../db/tables/dcr.md) |  | - |
