# fnd06_office_work

`server/fnd/mapper/fnd06_office_work.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | `fnd.Fnd06_OfficeWork.preUpdate` |
| `selectByCd` | select | 35 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | `fnd.Fnd06_OfficeWork.preUpdate`, `fnd.Fnd06_OfficeWork.selectIcamOfficeWork` |
| `selectByCodeName` | select | 42 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | `fnd.Fnd06_OfficeWork.selectByCodeName` |
| `selectByText` | select | 49 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | `fnd.Fnd06_OfficeWork.selectByText` |
| `selectByOfficeWorkName` | select | 56 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | - |
| `selectByCompanyId0` | select | 63 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | `fnd.Fnd06_OfficeWork.selectByCompanyId0` |
| `selectByCompanyId` | select | 75 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | `fnd.Fnd06_OfficeWork.selectByCompanyId` |
| `selectIcamOfficeWork` | select | 110 | `szx0gr` ⚠DB없음 |  | - |
| `selectByKofiaCode` | select | 119 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | - |
| `selectByExtrCode` | select | 126 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | - |
| `countByCode` | select | 136 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | - |
| `insertUpdate` | insert | 143 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | `fnd.Fnd06_OfficeWork.selectIcamOfficeWork` |
| `insert` | insert | 209 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | - |
| `insert2` | insert | 249 | [`fnd06_office_work`](../../../db/tables/fnd.md), [`icam03_fund`](../../../db/tables/icam.md) | `f_create_seq` | - |
| `insert3` | insert | 270 | [`fnd06_office_work`](../../../db/tables/fnd.md) | `f_create_seq` | - |
| `confirmUpdate` | update | 295 | [`fnd06_office_work`](../../../db/tables/fnd.md) |  | - |
