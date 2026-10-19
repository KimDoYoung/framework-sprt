# pay04_formula

`server/pay/mapper/pay04_formula_20230620.xml`

> ⚠ 같은 namespace 매퍼 2개: `pay04_formula.xml`, `pay04_formula_20230620.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`pay04_formula`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay04_Formula.selectById`, `pay.Pay04_Formula_20230620.selectById` |
| `selectByCompanyId` | select | 24 | [`pay04_formula`](../../../db/tables/pay.md) |  | `pay.Pay04_Formula.basicDataCreate`, `pay.Pay04_Formula.selectByCompanyId`, `pay.Pay04_Formula_20230620.selectByCompanyId` |
| `selectByDate` | select | 32 | [`pay04_formula`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay04_Formula.basicDataCreate`, `pay.Pay04_Formula.selectByDate`, `pay.Pay04_Formula_20230620.selectByDate` |
| `selectByMaxCompanyId` | select | 35 | [`pay04_formula`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md) |  | `pay.Pay04_Formula.insert` |
| `selectByCode` | select | 41 | [`pay04_formula`](../../../db/tables/pay.md) |  | `pay.Pay04_Formula_20230620.insert` |
| `selectByDateCode` | select | 50 | [`pay04_formula`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay04_Formula_20230620.insert` |
| `getFormulaByDate` | select | 63 | [`pay04_formula`](../../../db/tables/pay.md) | `f_cdnm` | - |
| `insert` | insert | 74 | [`pay04_formula`](../../../db/tables/pay.md) |  | `pay.Pay04_Formula.basicDataCreate`, `pay.Pay04_Formula.insert`, `pay.Pay04_Formula_20230620.insert` |
| `selectByUseYn` | select | 91 | [`pay20_item`](../../../db/tables/pay.md) |  | `pay.Pay04_Formula.selectByUseYn` |
| `insertFromAdmin` | insert | 93 | [`pay04_formula`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_create_seq`, `f_sysdate` | - |
| `deleteByDate` | delete | 122 | [`pay04_formula`](../../../db/tables/pay.md) |  | `pay.Pay04_Formula.basicDataCreate`, `pay.Pay04_Formula.deleteByDate`, `pay.Pay04_Formula_20230620.deleteByDate` |
| `insertFormPay04` | insert | 153 | [`pay04_formula`](../../../db/tables/pay.md) | `f_create_seq` | - |
