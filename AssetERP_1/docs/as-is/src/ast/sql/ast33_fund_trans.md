# ast33_fund_trans

`server/ast/mapper/ast33_fund_trans.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`act02_journal`](../../../db/tables/act.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`sys01_company`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm` | `ast.Ast33_FundTrans.selectById` |
| `selectByDate` | select | 50 | [`act02_journal`](../../../db/tables/act.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`sys01_company`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm` | `ast.Ast33_FundTrans.selectByDate` |
| `selectFundTransByDate` | select | 79 | [`ast33_fund_trans`](../../../db/tables/ast.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `selectFundTransByCorpCode` | select | 91 | [`ast33_fund_trans`](../../../db/tables/ast.md), [`sys15_corp`](../../../db/tables/sys.md) |  | `icam.Icam13_FeeBookCheck.checkFeeBook` |
