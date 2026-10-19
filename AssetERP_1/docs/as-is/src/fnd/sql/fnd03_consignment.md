# fnd03_consignment

`server/fnd/mapper/fnd03_consignment.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | `fnd.Fnd03_Consignment.insertCheck`, `fnd.Fnd03_Consignment.preUpdate` |
| `selectByCd` | select | 31 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | `fnd.Fnd03_Consignment.preUpdate`, `fnd.Fnd03_Consignment.selectIcamConsignment` |
| `selectByCodeName` | select | 38 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | `fnd.Fnd03_Consignment.selectByCodeName` |
| `selectByText` | select | 45 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | `fnd.Fnd03_Consignment.selectByText` |
| `selectByConsignmentName` | select | 52 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | - |
| `selectByCompanyId0` | select | 59 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | `fnd.Fnd03_Consignment.selectByCompanyId0` |
| `selectByCompanyId` | select | 71 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | `fnd.Fnd03_Consignment.selectByCompanyId` |
| `selectIcamConsignment` | select | 107 | `szx0st` ⚠DB없음 |  | - |
| `insertUpdate` | insert | 114 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | `fnd.Fnd03_Consignment.insertCheck`, `fnd.Fnd03_Consignment.selectIcamConsignment` |
| `insert` | insert | 177 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | - |
| `insert2` | insert | 215 | [`fnd03_consignment`](../../../db/tables/fnd.md), [`icam03_fund`](../../../db/tables/icam.md) | `f_create_seq` | - |
| `insert3` | insert | 236 | [`fnd03_consignment`](../../../db/tables/fnd.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi30_fund`](../../../db/tables/ifi.md) | `f_create_seq` | - |
| `confirmUpdate` | update | 277 | [`fnd03_consignment`](../../../db/tables/fnd.md) |  | - |
