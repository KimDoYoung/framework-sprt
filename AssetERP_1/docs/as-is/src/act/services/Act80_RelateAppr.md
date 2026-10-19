# act.Act80_RelateAppr

`server/act/Act80_RelateAppr.java`

서비스 키 `act.Act80_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`act80_relate_appr.selectById`](../../act/sql/act80_relate_appr.md) | - |  |
| `selectByJournalId` | 25 | [`act80_relate_appr.selectByJournalId`](../../act/sql/act80_relate_appr.md) | `Act80_Lookup_RelateAppr` |  |
| `selectByTrId` | 33 | [`act80_relate_appr.selectByTrId`](../../act/sql/act80_relate_appr.md) | `Act80_Lookup_RelateAppr` |  |
| `modelUpdate` | 41 | [`act80_relate_appr.selectJournalId`](../../act/sql/act80_relate_appr.md), [`act80_relate_appr.selectTrId`](../../act/sql/act80_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(act80_relate_appr)` 동적 INSERT/UPDATE | `Act80_Lookup_RelateAppr` | `UpdateDataModel` |
| `update` | 61 | `UpdateDataModel(act80_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 66 | `UpdateDataModel(act80_relate_appr)` 동적 DELETE | `Act80_Lookup_RelateAppr` | `UpdateDataModel` |
