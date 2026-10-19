# pay51_expense_form

`server/pay/mapper/pay51_expense_form.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`pay51_expense_form`](../../../db/tables/pay.md) | `f_cdnm`, `f_today` | `pay.Pay51_ExpenseForm.selectById` |
| `selectByCompanyId` | select | 23 | [`pay51_expense_form`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `pay.Pay51_ExpenseForm.selectByCompanyId` |
| `selectByformCode` | select | 39 | [`pay51_expense_form`](../../../db/tables/pay.md) | `f_cdnm`, `f_today` | `pay.Pay51_ExpenseForm.formCodeCall` |
| `insert` | insert | 47 | [`pay51_expense_form`](../../../db/tables/pay.md) |  | `pay.Pay51_ExpenseForm.formCheck` |
| `insertFormPay51` | insert | 62 | [`pay51_expense_form`](../../../db/tables/pay.md) | `f_create_seq` | - |
