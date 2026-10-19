# com.Com01_RelateAppr

`server/com/Com01_RelateAppr.java`

서비스 키 `com.Com01_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`com01_relate_appr.selectById`](../../com/sql/com01_relate_appr.md) | - |  |
| `selectByKeyTableId` | 24 | [`com01_relate_appr.selectByKeyTableId`](../../com/sql/com01_relate_appr.md) | `Com01_Lookup_RelateAppr`, `Pay50_Lookup_ExpenseRequestInsert` |  |
| `selectByExpenseIdList` | 31 | [`com01_relate_appr.selectByExpenseIdList`](../../com/sql/com01_relate_appr.md) | `Apr03_Page_Relate` |  |
| `modelUpdate` | 46 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com01_relate_appr)` 동적 INSERT/UPDATE | `Com01_Lookup_RelateAppr`, `Pay50_Lookup_ExpenseRequestInsert` | `UpdateDataModel` |
| `listUpdate` | 59 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com01_relate_appr)` 동적 INSERT/UPDATE | `Com01_Lookup_RelateAppr` | `UpdateDataModel` |
| `update` | 73 | `UpdateDataModel(com01_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 78 | `UpdateDataModel(com01_relate_appr)` 동적 DELETE | `Com01_Lookup_RelateAppr`, `Pay50_Lookup_ExpenseRequestInsert` | `UpdateDataModel` |
