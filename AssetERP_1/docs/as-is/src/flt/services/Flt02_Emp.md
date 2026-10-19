# flt.Flt02_Emp

`server/flt/Flt02_Emp.java`

서비스 키 `flt.Flt02_Emp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`flt02_emp.selectById`](../../flt/sql/flt02_emp.md) | - |  |
| `selectByPersonId` | 25 | [`flt02_emp.selectByPersonId`](../../flt/sql/flt02_emp.md) | `Flt02_Lookup_Emp` |  |
| `selectByCompanyId` | 34 | [`flt02_emp.selectByCompanyId`](../../flt/sql/flt02_emp.md) | `Flt02_Tab_EmpInfo` |  |
| `selectByDate` | 39 | [`flt02_emp.selectByDate`](../../flt/sql/flt02_emp.md) | `Flt03_Tab_AccountReport`, `Flt10_Tab_BuyReport`, `Flt10_Tab_RealTransaction`, `Flt10_Tab_SellReport` |  |
| `selectInvestLimit` | 49 | [`flt02_emp.selectInvestLimit`](../../flt/sql/flt02_emp.md) | `Flt10_Tab_RealTransaction` |  |
| `update` | 54 | `UpdateDataModel(flt02_emp)` 동적 INSERT/UPDATE | `Flt02_Lookup_Emp` | `UpdateDataModel` |
| `delete` | 59 | `UpdateDataModel(flt02_emp)` 동적 DELETE | `Flt02_Lookup_Emp` | `UpdateDataModel` |
