# flt08_buy_lockup

`server/flt/mapper/flt08_buy_lockup.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`com50_item`](../../../db/tables/com.md), [`flt08_buy_lockup`](../../../db/tables/flt.md) | `f_cdnm`, `f_today` | `flt.Flt08_BuyLockup.selectById` |
| `selectByText` | select | 27 | [`com50_item`](../../../db/tables/com.md), [`flt08_buy_lockup`](../../../db/tables/flt.md) | `f_cdnm`, `f_today` | `flt.Flt08_BuyLockup.selectByText` |
| `checkLockup` | select | 39 | [`adv10_book`](../../../db/tables/adv.md), [`adv11_book_extr`](../../../db/tables/adv.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`flt08_buy_lockup`](../../../db/tables/flt.md), [`flt09_fund_item`](../../../db/tables/flt.md), [`fnd10_book`](../../../db/tables/fnd.md), [`fnd11_book_extr`](../../../db/tables/fnd.md) | `f_get_biz_date2`, `f_today` | `flt.Flt08_BuyLockup.checkLockup` |
