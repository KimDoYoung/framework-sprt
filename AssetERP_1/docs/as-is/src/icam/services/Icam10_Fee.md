# icam.Icam10_Fee

`server/icam/Icam10_Fee.java`

서비스 키 `icam.Icam10_Fee.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | [`icam10_fee.selectById`](../../icam/sql/icam10_fee.md) | - |  |
| `selectByFeeTypePaging` | 29 | [`icam10_fee.selectByFeeTypePaging`](../../icam/sql/icam10_fee.md), [`icam10_fee.selectByFeeTypePagingTotal`](../../icam/sql/icam10_fee.md) | `Icam10_Tab_FeeAdmin`, `Icam10_Tab_FundMngFee`, `Icam10_Tab_OfficeMngFee` |  |
| `selectByFundCode` | 35 | [`icam10_fee.selectByFundCode`](../../icam/sql/icam10_fee.md) | `Ast30_Lookup_FeeDetail` |  |
| `selectFundList` | 40 | [`icam10_fee.selectFundList`](../../icam/sql/icam10_fee.md) | `Icam10_Lookup_FundCode` |  |
| `getCurrentFeeByFund` | 45 | [`icam10_fee.getCurrentFeeByFund`](../../icam/sql/icam10_fee.md) | `Icam10_Tab_CurrentFeeByFund` |  |
| `getICAMFundFee` | 50 | [`biz13_with_corp.selectManageTypeIs1`](../../biz/sql/biz13_with_corp.md), [`icam10_fee.deleteFundMngFee`](../../icam/sql/icam10_fee.md), [`icam10_fee.deleteOfficeMngFeeByFundCode`](../../icam/sql/icam10_fee.md), [`icam10_fee.insert`](../../icam/sql/icam10_fee.md), [`icam11_fee_deposit.insert`](../../icam/sql/icam11_fee_deposit.md), [`icam11_fee_deposit.selectByFundCode`](../../icam/sql/icam11_fee_deposit.md), [`icam12_fee_book.deleteByFundCode`](../../icam/sql/icam12_fee_book.md), [`icam12_fee_book.insert`](../../icam/sql/icam12_fee_book.md) | `Icam10_Lookup_getICAM` | `DatabaseFactoryICAM` |
| `updateFee` | 165 | [`icam10_fee.updateFee`](../../icam/sql/icam10_fee.md) | `Icam10_Lookup_FundFee` |  |
| `createFeeBook` | 176 | [`icam10_fee.createFundFeeBook`](../../icam/sql/icam10_fee.md), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md) | `Icam10_Lookup_getICAM` |  |
| `createFeeRcvTr` | 206 | [`icam10_fee.createFundFeeRcvTr`](../../icam/sql/icam10_fee.md), [`icam10_fee.createFundFeeRcvTr2`](../../icam/sql/icam10_fee.md), [`sys12_calendar.selectPeriod`](../../sys/sql/sys12_calendar.md) | `Icam10_Lookup_getICAM` | `Calendar` |
