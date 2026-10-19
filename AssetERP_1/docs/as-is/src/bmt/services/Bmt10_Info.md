# bmt.Bmt10_Info

`server/bmt/Bmt10_Info.java`

서비스 키 `bmt.Bmt10_Info.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`bmt10_info.selectById`](../../bmt/sql/bmt10_info.md) | - |  |
| `selectByCompanyId` | 25 | [`bmt10_info.selectByCompanyId`](../../bmt/sql/bmt10_info.md) | `Bmt10_Lookup_InfoList`, `Bmt10_Tab_Info` |  |
| `selectByBaseDate` | 30 | [`bmt10_info.selectByBaseDate`](../../bmt/sql/bmt10_info.md) | `Bmt10_Tab_Info` |  |
| `modelUpdate` | 35 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bmt10_info)` 동적 INSERT/UPDATE | `Bmt10_Edit_Info` | `UpdateDataModel` |
| `modelDelete` | 49 | `UpdateDataModel(bmt10_info)` 동적 DELETE | `Bmt10_Edit_Info` | `UpdateDataModel` |
| `update` | 58 | `UpdateDataModel(bmt10_info)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 63 | `UpdateDataModel(bmt10_info)` 동적 DELETE | - | `UpdateDataModel` |
