# emp.Emp50_TransportExpense

`server/emp/Emp50_TransportExpense.java`

서비스 키 `emp.Emp50_TransportExpense.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`emp50_transport_expense.selectById`](../../emp/sql/emp50_transport_expense.md) | - |  |
| `selectByYearMonth` | 26 | [`emp50_transport_expense.selectByYearMonth`](../../emp/sql/emp50_transport_expense.md) | `Emp50_Tab_TransportExpense` |  |
| `copyUpdate` | 42 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp50_transport_expense)` 동적 INSERT/UPDATE | `Emp50_Tab_TransportExpense` | `UpdateDataModel` |
| `update` | 55 | `UpdateDataModel(emp50_transport_expense)` 동적 INSERT/UPDATE | `Emp50_Tab_TransportExpense` | `UpdateDataModel` |
| `delete` | 60 | `UpdateDataModel(emp50_transport_expense)` 동적 DELETE | `Emp50_Tab_TransportExpense` | `UpdateDataModel` |
