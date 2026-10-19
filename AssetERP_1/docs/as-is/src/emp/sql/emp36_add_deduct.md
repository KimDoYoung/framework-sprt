# emp36_add_deduct

`server/emp/mapper/emp36_add_deduct.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`emp36_add_deduct`](../../../db/tables/emp.md) |  | `emp.Emp36_AddDeduct.selectById` |
| `selectByDeductId` | select | 21 | [`emp36_add_deduct`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp36_AddDeduct.selectByDeductId` |
| `insert` | insert | 29 | [`emp36_add_deduct`](../../../db/tables/emp.md) |  | `emp.Emp00_TransInfo.update` |
| `addDeductTypeInsert` | insert | 44 | [`emp35_deduct`](../../../db/tables/emp.md), [`emp36_add_deduct`](../../../db/tables/emp.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_cdnm`, `f_create_seq`, `f_today` | `emp.Emp35_Deduct.insert`, `emp.Emp36_AddDeduct.addDeductTypeInsert` |
| `deleteByDeductId` | delete | 71 | [`emp36_add_deduct`](../../../db/tables/emp.md) |  | `emp.Emp35_Deduct.deleteAll`, `emp.Emp35_Deduct.insert` |
