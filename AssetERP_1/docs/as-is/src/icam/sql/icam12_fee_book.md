# icam12_fee_book

`server/icam/mapper/icam12_fee_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`icam12_fee_book`](../../../db/tables/icam.md) |  | `icam.Icam12_FeeBook.selectById` |
| `whereCondition` | sql | 33 | - |  |  |
| `selectByStdDatePaging` | select | 44 | [`icam12_fee_book`](../../../db/tables/icam.md) |  | `icam.Icam12_FeeBook.selectByStdDatePaging` |
| `selectByStdDatePagingTotal` | select | 55 | [`icam12_fee_book`](../../../db/tables/icam.md) |  | `icam.Icam12_FeeBook.selectByStdDatePaging` |
| `selectLastDayFeeIcamData` | select | 62 | `szm0fd` ⚠DB없음, `szx0aa` ⚠DB없음, `uzm0cd` ⚠DB없음 |  | - |
| `insert` | insert | 96 | [`icam12_fee_book`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate` | `icam.Icam10_Fee.getICAMFundFee`, `icam.Icam13_FeeBookCheck.checkFeeBook` |
| `delete` | delete | 116 | [`icam12_fee_book`](../../../db/tables/icam.md) |  | `icam.Icam13_FeeBookCheck.checkFeeBook` |
| `deleteByFundCode` | delete | 123 | [`icam12_fee_book`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.getICAMFundFee` |
