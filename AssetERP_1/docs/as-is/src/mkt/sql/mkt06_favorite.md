# mkt06_favorite

`server/mkt/mapper/mkt06_favorite.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`mkt06_favorite`](../../../db/tables/mkt.md) |  | `mkt.Mkt06_Favorite.selectById` |
| `deleteFavoriteId` | delete | 20 | [`mkt06_favorite`](../../../db/tables/mkt.md) |  | `mkt.Mkt06_Favorite.deleteList` |
| `excelInsert` | insert | 26 | [`mkt06_favorite`](../../../db/tables/mkt.md) |  | - |
