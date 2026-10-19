# flt.Flt06_AccountClose

`server/flt/Flt06_AccountClose.java`

서비스 키 `flt.Flt06_AccountClose.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`flt06_account_close.selectById`](../../flt/sql/flt06_account_close.md) | - |  |
| `selectByPersonId` | 27 | [`flt06_account_close.selectByPersonId`](../../flt/sql/flt06_account_close.md) | `Flt06_TabPage_AccountClose` |  |
| `insert` | 36 | [`flt06_account_close.insert`](../../flt/sql/flt06_account_close.md), [`flt11_book.checkBookQtyByAccountId`](../../flt/sql/flt11_book.md) | `Flt03_Lookup_AccountClose` |  |
| `updateApprId` | 64 | [`flt06_account_close.updateApprId`](../../flt/sql/flt06_account_close.md) | `Flt06_TabPage_AccountClose` |  |
| `update` | 85 | `UpdateDataModel(flt06_account_close)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 90 | `UpdateDataModel(flt06_account_close)` 동적 DELETE | `Flt06_TabPage_AccountClose` | `UpdateDataModel` |
