# flt11_book

`server/flt/mapper/flt11_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 45 | [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_get_biz_days`, `f_get_floortrrcntbuydate`, `to_decrypts` | `flt.Flt11_Book.selectById` |
| `selectByText` | select | 72 | [`flt01_company_std`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_get_biz_date`, `f_get_biz_days`, `f_get_floortrfundholdcheck`, `f_get_floortrrcntbuydate`, `to_decrypts` | `flt.Flt11_Book.selectByText` |
| `selectByText2` | select | 122 | [`apr01_appr`](../../../db/tables/apr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_get_biz_date`, `f_get_biz_days`, `f_get_floortrfundholdcheck`, `f_get_floortrrcntbuydate`, `f_get_quarter_date`, `to_decrypts` | `flt.Flt11_Book.selectByText2` |
| `selectByBookList` | select | 242 | [`emp04_add_title`](../../../db/tables/emp.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_biz_days`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_floortrrcntbuydate`, `getperson`, `to_decrypts` | `flt.Flt11_Book.selectByBookList`, `sys.Sys99_Print.insertRdBookList`, `sys.Sys99_Print.insertRdBookListAdmin` |
| `selectByDate` | select | 316 | [`apr01_appr`](../../../db/tables/apr.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_biz_date`, `f_get_floortrrcntbuydate`, `f_sysdate`, `getperson`, `to_decrypts` | `flt.Flt11_Book.selectByDate` |
| `checkBookQtyByAccountId` | select | 419 | [`flt11_book`](../../../db/tables/flt.md) |  | `flt.Flt06_AccountClose.insert` |
| `selectInsert` | insert | 427 | [`flt11_book`](../../../db/tables/flt.md) | `f_create_seq`, `f_get_biz_date`, `f_today` | - |
| `insertByFlt13` | insert | 450 | [`flt05_item_type`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md) | `f_create_seq` | `flt.Flt13_BookInit.update` |
| `updateBookAmt` | update | 483 | [`flt11_book`](../../../db/tables/flt.md) |  | `flt.Flt12_BookMonth.insertBookAmt`, `flt.Flt12_BookMonth.update` |
| `updateItemName` | update | 495 | [`flt11_book`](../../../db/tables/flt.md) |  | - |
| `deleteByCompanyId` | delete | 501 | [`flt11_book`](../../../db/tables/flt.md) | `f_today` | - |
| `deleteByPersonId` | delete | 508 | [`flt11_book`](../../../db/tables/flt.md) |  | - |
| `deleteByItemName` | delete | 516 | [`flt11_book`](../../../db/tables/flt.md) |  | `flt.Flt13_BookInit.delete`, `flt.Flt13_BookInit.update` |
