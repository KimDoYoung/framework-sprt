# crm13_relate_fund

`server/crm/mapper/crm13_relate_fund.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`crm13_relate_fund`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md) | `f_get_fund_nm`, `f_sysdate` | `crm.Crm13_RelateFund.selectById` |
| `selectByWorkDetailId` | select | 25 | [`crm13_relate_fund`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md) | `f_get_fund_nm`, `f_sysdate` | `crm.Crm13_RelateFund.selectByWorkDetailId` |
| `deleteByWorkDetailId` | delete | 35 | [`crm13_relate_fund`](../../../db/tables/crm.md) |  | `crm.Crm13_RelateFund.updateList` |
