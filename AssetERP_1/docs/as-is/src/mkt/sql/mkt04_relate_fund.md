# mkt04_relate_fund

`server/mkt/mapper/mkt04_relate_fund.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md) | `f_today` | `mkt.Mkt04_RelateFund.selectById` |
| `selectByHistoryId` | select | 30 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md) | `f_today` | `mkt.Mkt04_RelateFund.selectByHistoryId` |
| `deleteByHistoryId` | delete | 44 | [`mkt04_relate_fund`](../../../db/tables/mkt.md) |  | `mkt.Mkt03_History.delete`, `mkt.Mkt04_RelateFund.updateByList` |
