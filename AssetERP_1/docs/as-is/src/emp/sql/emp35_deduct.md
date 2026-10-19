# emp35_deduct

`server/emp/mapper/emp35_deduct.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`emp35_deduct`](../../../db/tables/emp.md) |  | `emp.Emp35_Deduct.selectById` |
| `selectByPersonId` | select | 32 | [`emp35_deduct`](../../../db/tables/emp.md) |  | `emp.Emp35_Deduct.selectByPersonId` |
| `selectByCompanyId` | select | 40 | [`emp35_deduct`](../../../db/tables/emp.md) |  | `emp.Emp35_Deduct.insert`, `pay.Pay31_InsureApply.insert3` |
| `selectByStdDate` | select | 53 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp35_deduct`](../../../db/tables/emp.md) | `f_get_4insure_yn` | `emp.Emp35_Deduct.selectByStdDate` |
| `insert` | insert | 119 | [`emp35_deduct`](../../../db/tables/emp.md) |  | `emp.Emp00_TransInfo.update`, `emp.Emp35_Deduct.insert` |
| `deleteByDeductId` | delete | 148 | [`emp35_deduct`](../../../db/tables/emp.md) |  | `emp.Emp35_Deduct.deleteAll`, `emp.Emp35_Deduct.insert` |
