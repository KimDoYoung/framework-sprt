# icam20_price

`server/icam/mapper/icam20_price.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`icam20_price`](../../../db/tables/icam.md) |  | `icam.Icam20_Price.selectById` |
| `whereCondition` | sql | 31 | - |  |  |
| `selectByStdDatePaging` | select | 37 | [`icam20_price`](../../../db/tables/icam.md) |  | `icam.Icam20_Price.selectByStdDatePaging` |
| `selectByStdDatePagingTotal` | select | 47 | [`icam20_price`](../../../db/tables/icam.md) |  | `icam.Icam20_Price.selectByStdDatePaging` |
| `selectIcamStkPrice` | select | 54 | `oms9jj` ⚠DB없음 |  | - |
| `selectIcamStkPriceOld` | select | 71 | `sjm0jj` ⚠DB없음, `sjt1tg` ⚠DB없음 |  | - |
| `selectIcamFundPrice` | select | 91 | `pzm0tu` ⚠DB없음, `pzm1ti` ⚠DB없음 |  | - |
| `selectIcamStkItemByListDate` | select | 106 | `sjm0jj` ⚠DB없음 |  | - |
| `selectChangedItemName` | select | 114 | [`icam20_price`](../../../db/tables/icam.md) |  | - |
| `insert` | insert | 126 | [`icam20_price`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate` | - |
| `updateItemName` | update | 144 | [`icam20_price`](../../../db/tables/icam.md) |  | - |
| `delete` | delete | 152 | [`icam20_price`](../../../db/tables/icam.md) |  | - |
