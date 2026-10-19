# emp08_license

`server/emp/mapper/emp08_license.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`emp01_person`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md) |  | - |
| `selectByPersonId` | select | 40 | [`emp01_person`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md) |  | `emp.Emp08_License.selectByPersonId` |
| `selectByHistory` | select | 49 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`emp32_relate_license`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp08_License.selectByHistory`, `sys.Sys99_Print.insertRdEmp08History` |
