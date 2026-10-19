# ast.Ast16_NonDeductTax

`server/ast/Ast16_NonDeductTax.java`

서비스 키 `ast.Ast16_NonDeductTax.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 15 | [`ast16_non_deduct_tax.selectById`](../../ast/sql/ast16_non_deduct_tax.md) | - |  |
| `selectByPurTrId` | 20 | [`ast16_non_deduct_tax.selectByPurTrId`](../../ast/sql/ast16_non_deduct_tax.md) | `Ast16_Lookup_NonDeductTax` |  |
| `update` | 25 | `UpdateDataModel(ast16_non_deduct_tax)` 동적 INSERT/UPDATE | `Ast16_Lookup_NonDeductTax` | `UpdateDataModel` |
| `delete` | 30 | `UpdateDataModel(ast16_non_deduct_tax)` 동적 DELETE | `Ast16_Lookup_NonDeductTax` | `UpdateDataModel` |
