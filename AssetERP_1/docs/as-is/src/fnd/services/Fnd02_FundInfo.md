# fnd.Fnd02_FundInfo

`server/fnd/Fnd02_FundInfo.java`

서비스 키 `fnd.Fnd02_FundInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`fnd02_fund_info.selectById`](../../fnd/sql/fnd02_fund_info.md) | - |  |
| `selectByFundCode` | 30 | [`fnd02_fund_info.selectByFundCode`](../../fnd/sql/fnd02_fund_info.md) | - |  |
| `selectByPaging` | 35 | [`fnd02_fund_info.selectByNamePaging`](../../fnd/sql/fnd02_fund_info.md), [`fnd02_fund_info.selectByNameTotal`](../../fnd/sql/fnd02_fund_info.md) | `Fnd01_Grid_FundIcamHistory` |  |
| `update` | 41 | `UpdateDataModel(fnd02_fund_info)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 46 | `UpdateDataModel(fnd02_fund_info)` 동적 DELETE | - | `UpdateDataModel` |
