# biz29_account

`server/biz/mapper/biz29_account.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`ast01_class_tree`](../../../db/tables/ast.md), [`biz29_account`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz29_Account.selectById` |
| `selectByCompanyId` | select | 33 | [`ast01_class_tree`](../../../db/tables/ast.md), [`biz29_account`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz29_Account.selectByCompanyId` |
| `selectBySearchText` | select | 44 | [`ast01_class_tree`](../../../db/tables/ast.md), [`biz29_account`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz29_Account.selectBySearchText` |
| `insertNotAccount` | insert | 56 | [`biz20_fee_charge`](../../../db/tables/biz.md), [`biz29_account`](../../../db/tables/biz.md) | `f_create_seq` | `biz.Biz20_FeeCharge.createFeeCharge` |
