# crm.Crm13_RelateFund

`server/crm/Crm13_RelateFund.java`

서비스 키 `crm.Crm13_RelateFund.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`crm13_relate_fund.selectById`](../../crm/sql/crm13_relate_fund.md) | - |  |
| `selectByWorkDetailId` | 22 | [`crm13_relate_fund.selectByWorkDetailId`](../../crm/sql/crm13_relate_fund.md) | `Crm12_Lookup_WorkDetail` |  |
| `updateList` | 30 | [`crm13_relate_fund.deleteByWorkDetailId`](../../crm/sql/crm13_relate_fund.md), `UpdateDataModel(crm13_relate_fund)` 동적 INSERT/UPDATE | `Crm12_Lookup_WorkDetail` | `UpdateDataModel` |
| `update` | 37 | `UpdateDataModel(crm13_relate_fund)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 42 | `UpdateDataModel(crm13_relate_fund)` 동적 DELETE | `Crm12_Lookup_WorkDetail` | `UpdateDataModel` |
