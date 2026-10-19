# pay.Pay04_Formula

`server/pay/Pay04_Formula.java`

서비스 키 `pay.Pay04_Formula.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`pay04_formula.selectById`](../../pay/sql/pay04_formula.md) | - |  |
| `selectByCompanyId` | 27 | [`pay04_formula.selectByCompanyId`](../../pay/sql/pay04_formula.md) | `Pay04_Lookup_Formula`, `Pay04_TabPage_Formula`, `Pay04_Tab_Formula` |  |
| `selectByDate` | 39 | [`pay04_formula.selectByDate`](../../pay/sql/pay04_formula.md) | `Pay04_Lookup_Formula`, `Pay04_TabPage_Formula`, `Pay04_Tab_Formula` |  |
| `selectByUseYn` | 53 | [`pay04_formula.selectByUseYn`](../../pay/sql/pay04_formula.md) | - |  |
| `insert` | 58 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay04_formula.insert`](../../pay/sql/pay04_formula.md), [`pay04_formula.selectByMaxCompanyId`](../../pay/sql/pay04_formula.md) | `Pay04_Lookup_Insert` |  |
| `basicDataCreate` | 91 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay04_formula.deleteByDate`](../../pay/sql/pay04_formula.md), [`pay04_formula.insert`](../../pay/sql/pay04_formula.md), [`pay04_formula.selectByCompanyId`](../../pay/sql/pay04_formula.md), [`pay04_formula.selectByDate`](../../pay/sql/pay04_formula.md) | `Pay04_TabPage_Formula` |  |
| `deleteByDate` | 139 | [`pay04_formula.deleteByDate`](../../pay/sql/pay04_formula.md) | `Pay04_Lookup_Formula`, `Pay04_TabPage_Formula`, `Pay04_Tab_Formula` |  |
| `update` | 152 | `UpdateDataModel(pay04_formula)` 동적 INSERT/UPDATE | `Pay04_Lookup_Formula`, `Pay04_TabPage_Formula`, `Pay04_Tab_Formula` | `UpdateDataModel` |
| `delete` | 157 | `UpdateDataModel(pay04_formula)` 동적 DELETE | `Pay04_Lookup_Formula`, `Pay04_TabPage_Formula` | `UpdateDataModel` |
