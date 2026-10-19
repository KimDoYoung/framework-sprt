# adv10_book

`server/adv/mapper/adv10_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`adv10_book`](../../../db/tables/adv.md) |  | `adv.Adv10_Book.selectById` |
| `selectIcamBook` | select | 30 | `sjm0jj` ⚠DB없음, `szm0fd` ⚠DB없음, `szx0gr` ⚠DB없음, `uzm0ui` ⚠DB없음 |  | - |
| `insert` | insert | 61 | [`adv10_book`](../../../db/tables/adv.md) | `f_sysdate` | - |
| `delete` | delete | 81 | [`adv10_book`](../../../db/tables/adv.md) |  | - |
