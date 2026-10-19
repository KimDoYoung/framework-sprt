# dcr.Dcr40_StampAuth

`server/dcr/Dcr40_StampAuth.java`

서비스 키 `dcr.Dcr40_StampAuth.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`dcr40_stamp_auth.selectById`](../../dcr/sql/dcr40_stamp_auth.md) | - |  |
| `selectByStampId` | 27 | [`dcr40_stamp_auth.selectByStampId`](../../dcr/sql/dcr40_stamp_auth.md) | - |  |
| `updateList` | 35 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr40_stamp_auth.selectByStampId`](../../dcr/sql/dcr40_stamp_auth.md), `UpdateDataModel(dcr40_stamp_auth)` 동적 INSERT/UPDATE | `Dcr40_Lookup_StampAuth` | `UpdateDataModel` |
| `update` | 73 | `UpdateDataModel(dcr40_stamp_auth)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 78 | `UpdateDataModel(dcr40_stamp_auth)` 동적 DELETE | - | `UpdateDataModel` |
