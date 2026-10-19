# pay.Pay51_ExpenseForm

`server/pay/Pay51_ExpenseForm.java`

서비스 키 `pay.Pay51_ExpenseForm.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`pay51_expense_form.selectById`](../../pay/sql/pay51_expense_form.md) | - |  |
| `selectByCompanyId` | 27 | [`pay51_expense_form.selectByCompanyId`](../../pay/sql/pay51_expense_form.md) | `Pay51_Lookup_ExpenseForm` |  |
| `formCheck` | 35 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay51_expense_form.insert`](../../pay/sql/pay51_expense_form.md), [`sys09_code.selectByExpenseForm`](../../sys/sql/sys09_code.md) | `Pay51_Lookup_ExpenseForm` |  |
| `formCodeCall` | 59 | [`pay51_expense_form.selectByformCode`](../../pay/sql/pay51_expense_form.md) | `Pay50_Lookup_ExpenseRequestInsert` |  |
| `modelUpdate` | 72 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay51_expense_form)` 동적 INSERT/UPDATE | `Pay51_Lookup_ExpenseForm` | `UpdateDataModel` |
| `update` | 85 | `UpdateDataModel(pay51_expense_form)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 90 | `UpdateDataModel(pay51_expense_form)` 동적 DELETE | - | `UpdateDataModel` |
