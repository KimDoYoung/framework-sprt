# sch12_ipo_corp

`server/sch/mapper/sch12_ipo_corp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`sch12_ipo_corp`](../../../db/tables/sch.md) |  | `sch.Sch12_IpoCorp.selectById` |
| `selectBySearchText` | select | 20 | [`sch12_ipo_corp`](../../../db/tables/sch.md) |  | `sch.Sch12_IpoCorp.selectBySearchText` |
| `selectByCorpName` | select | 26 | [`sch12_ipo_corp`](../../../db/tables/sch.md) |  | `sch.Sch12_IpoCorp.selectByCorpName` |
| `selectByCorpNameList` | select | 32 | [`sch12_ipo_corp`](../../../db/tables/sch.md) |  | `sch.Sch12_IpoCorp.selectByCorpNameList` |
| `insertCorpName` | insert | 38 | [`sch12_ipo_corp`](../../../db/tables/sch.md) | `f_create_seq` | - |
