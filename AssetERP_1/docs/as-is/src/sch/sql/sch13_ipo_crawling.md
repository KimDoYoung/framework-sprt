# sch13_ipo_crawling

`server/sch/mapper/sch13_ipo_crawling.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 46 | [`sch13_ipo_crawling`](../../../db/tables/sch.md) |  | - |
| `selectByTrackId` | select | 52 | [`sch13_ipo_crawling`](../../../db/tables/sch.md) | `f_today` | - |
| `selectValidItemCode` | select | 62 | - | `f_get_ipo_valid_item_cd` | - |
| `insert` | insert | 66 | [`sch13_ipo_crawling`](../../../db/tables/sch.md) | `f_create_batchseq` | - |
