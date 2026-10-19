# opr.Opr02_Fund

`server/opr/Opr02_Fund.java`

서비스 키 `opr.Opr02_Fund.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByCreateId` | 25 | [`opr02_fund.selectByCreateId`](../../opr/sql/opr02_fund.md) | `Opr02_Lookup_Fund`, `Opr02_Tabpage_Fund`, `Opr02_Tabpage_Fund_Manager` |  |
| `insert` | 48 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(opr02_fund)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 74 | `UpdateDataModel(opr02_fund)` 동적 INSERT/UPDATE | `Opr02_Tabpage_Fund_Manager` | `UpdateDataModel` |
| `delete` | 79 | `UpdateDataModel(opr02_fund)` 동적 DELETE | `Opr02_Tabpage_Fund_Manager` | `UpdateDataModel` |
