# flt09_fund_item

`server/flt/mapper/flt09_fund_item.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`flt09_fund_item`](../../../db/tables/flt.md) |  | - |
| `insertByIfi34` | insert | 21 | [`flt09_fund_item`](../../../db/tables/flt.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi34_stk`](../../../db/tables/ifi.md) | `f_create_seq` | - |
| `deleteByStdDate` | delete | 33 | [`flt09_fund_item`](../../../db/tables/flt.md) |  | - |
