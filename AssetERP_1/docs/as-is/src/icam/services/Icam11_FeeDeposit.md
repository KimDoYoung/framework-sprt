# icam.Icam11_FeeDeposit

`server/icam/Icam11_FeeDeposit.java`

서비스 키 `icam.Icam11_FeeDeposit.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`icam11_fee_deposit.selectById`](../../icam/sql/icam11_fee_deposit.md) | - |  |
| `selectByCompanyId` | 21 | [`icam11_fee_deposit.selectByCompanyId`](../../icam/sql/icam11_fee_deposit.md) | `Icam11_Tab_FundMngFeeDeposit`, `Icam11_Tab_OfficeMngFeeDeposit` |  |
| `selectByFundCode2` | 26 | [`icam11_fee_deposit.selectByFundCode2`](../../icam/sql/icam11_fee_deposit.md) | `Icam11_Grid_MngFeeDeposit` |  |
| `update` | 31 | `UpdateDataModel(icam11_fee_deposit)` 동적 INSERT/UPDATE | `Icam11_Grid_MngFeeDeposit` | `UpdateDataModel` |
| `delete` | 36 | `UpdateDataModel(icam11_fee_deposit)` 동적 DELETE | `Icam11_Grid_MngFeeDeposit` | `UpdateDataModel` |
