# mkt02_manager

`server/mkt/mapper/mkt02_manager.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`mkt02_manager`](../../../db/tables/mkt.md) |  | `mkt.Mkt02_Manager.selectById` |
| `selectByTargetCompanyId` | select | 25 | [`mkt02_manager`](../../../db/tables/mkt.md) |  | `mkt.Mkt02_Manager.selectByTargetCompanyId` |
| `updateTargetCompanyId` | update | 32 | [`mkt02_manager`](../../../db/tables/mkt.md) |  | `mkt.Mkt02_Manager.updateTargetCompanyId` |
| `deleteByTargetCompanyId` | delete | 40 | [`mkt02_manager`](../../../db/tables/mkt.md) |  | `mkt.Mkt01_TargetCompany.delete` |
| `excelInsert` | insert | 46 | [`mkt02_manager`](../../../db/tables/mkt.md) |  | - |
