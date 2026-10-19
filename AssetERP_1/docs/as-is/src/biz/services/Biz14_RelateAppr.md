# biz.Biz14_RelateAppr

`server/biz/Biz14_RelateAppr.java`

서비스 키 `biz.Biz14_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`biz14_relate_appr.selectById`](../../biz/sql/biz14_relate_appr.md) | - |  |
| `selectByContHistoryId` | 23 | [`biz14_relate_appr.selectByContHistoryId`](../../biz/sql/biz14_relate_appr.md) | `Biz14_Lookup_RelateAppr` |  |
| `modelUpdate` | 29 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz14_relate_appr)` 동적 INSERT/UPDATE | `Biz14_Lookup_RelateAppr` | `UpdateDataModel` |
| `update` | 42 | `UpdateDataModel(biz14_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 47 | `UpdateDataModel(biz14_relate_appr)` 동적 DELETE | `Biz14_Lookup_RelateAppr` | `UpdateDataModel` |
