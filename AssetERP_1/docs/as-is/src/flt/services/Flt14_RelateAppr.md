# flt.Flt14_RelateAppr

`server/flt/Flt14_RelateAppr.java`

서비스 키 `flt.Flt14_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`flt14_relate_appr.selectById`](../../flt/sql/flt14_relate_appr.md) | - |  |
| `selectByStdDate` | 25 | [`flt14_relate_appr.selectByStdDate`](../../flt/sql/flt14_relate_appr.md) | `Flt10_Tab_RealTransaction`, `Flt14_Lookup_RelateAppr` |  |
| `insertApprId` | 34 | [`flt14_relate_appr.insertApprId`](../../flt/sql/flt14_relate_appr.md) | `Flt10_Tab_RealTransaction` |  |
| `update` | 51 | `UpdateDataModel(flt14_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 59 | `UpdateDataModel(flt14_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
