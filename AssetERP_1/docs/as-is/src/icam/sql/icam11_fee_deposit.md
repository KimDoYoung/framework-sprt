# icam11_fee_deposit

`server/icam/mapper/icam11_fee_deposit.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`ast01_class_tree`](../../../db/tables/ast.md), [`icam11_fee_deposit`](../../../db/tables/icam.md) |  | `icam.Icam11_FeeDeposit.selectById` |
| `selectByFundCode` | select | 30 | [`icam11_fee_deposit`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.getICAMFundFee` |
| `selectByFundCode2` | select | 41 | [`ast01_class_tree`](../../../db/tables/ast.md), [`icam11_fee_deposit`](../../../db/tables/icam.md) |  | `icam.Icam11_FeeDeposit.selectByFundCode2` |
| `selectByCompanyId` | select | 56 | [`ast01_class_tree`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md), [`icam11_fee_deposit`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_today` | `icam.Icam11_FeeDeposit.selectByCompanyId` |
| `insert` | insert | 95 | [`icam11_fee_deposit`](../../../db/tables/icam.md) | `f_create_batchseq` | `icam.Icam10_Fee.getICAMFundFee` |
