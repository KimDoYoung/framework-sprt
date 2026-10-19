# bmt.Bmt20_RelateAppr

`server/bmt/Bmt20_RelateAppr.java`

서비스 키 `bmt.Bmt20_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`bmt20_relate_appr.selectById`](../../bmt/sql/bmt20_relate_appr.md) | - |  |
| `selectByInfoId` | 25 | [`bmt20_relate_appr.selectByInfoId`](../../bmt/sql/bmt20_relate_appr.md) | `Bmt20_Lookup_RelateAppr` |  |
| `modelUpdate` | 34 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bmt20_relate_appr)` 동적 INSERT/UPDATE | `Bmt20_Lookup_RelateAppr` | `UpdateDataModel` |
| `update` | 47 | `UpdateDataModel(bmt20_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 52 | `UpdateDataModel(bmt20_relate_appr)` 동적 DELETE | `Bmt20_Lookup_RelateAppr` | `UpdateDataModel` |
