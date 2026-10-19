# pay03_account

`server/pay/mapper/pay03_account.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`ast01_class_tree`](../../../db/tables/ast.md), [`pay03_account`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay03_Account.selectById` |
| `selectByCompanyId` | select | 29 | [`ast01_class_tree`](../../../db/tables/ast.md), [`pay03_account`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay03_Account.selectByCompanyId` |
| `selectByStartDate` | select | 38 | [`ast01_class_tree`](../../../db/tables/ast.md), [`pay03_account`](../../../db/tables/pay.md) | `f_cdnm` | `pay.Pay03_Account.selectByStartDate` |
