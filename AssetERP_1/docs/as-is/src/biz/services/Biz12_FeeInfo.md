# biz.Biz12_FeeInfo

`server/biz/Biz12_FeeInfo.java`

서비스 키 `biz.Biz12_FeeInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`biz12_fee_info.selectById`](../../biz/sql/biz12_fee_info.md) | - |  |
| `modelUpdate` | 23 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz12_fee_info)` 동적 INSERT/UPDATE | `Biz12_Edit_FeeInfo` | `UpdateDataModel` |
| `update` | 36 | `UpdateDataModel(biz12_fee_info)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(biz12_fee_info)` 동적 DELETE | - | `UpdateDataModel` |
