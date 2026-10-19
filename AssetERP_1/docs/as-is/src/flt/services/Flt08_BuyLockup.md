# flt.Flt08_BuyLockup

`server/flt/Flt08_BuyLockup.java`

서비스 키 `flt.Flt08_BuyLockup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`flt08_buy_lockup.selectById`](../../flt/sql/flt08_buy_lockup.md) | - |  |
| `selectByText` | 25 | [`flt08_buy_lockup.selectByText`](../../flt/sql/flt08_buy_lockup.md) | `Flt08_Lookup_LockupItem` |  |
| `checkLockup` | 31 | [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md), [`flt08_buy_lockup.checkLockup`](../../flt/sql/flt08_buy_lockup.md) | `Flt10_Tab_BuyReport` |  |
| `update` | 76 | `UpdateDataModel(flt08_buy_lockup)` 동적 INSERT/UPDATE | `Flt08_Lookup_LockupItem` | `UpdateDataModel` |
| `delete` | 81 | `UpdateDataModel(flt08_buy_lockup)` 동적 DELETE | `Flt08_Lookup_LockupItem` | `UpdateDataModel` |
