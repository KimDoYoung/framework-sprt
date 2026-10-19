# act.Act14_Link

`server/act/Act14_Link.java`

서비스 키 `act.Act14_Link.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`act14_link.selectById`](../../act/sql/act14_link.md) | - |  |
| `selectByAccountCode` | 24 | [`act14_link.selectByAccountCode`](../../act/sql/act14_link.md) | `Act01_Edit_AccountCode` |  |
| `selectByProvideContentCode` | 30 | [`act14_link.selectByProvideContentCode`](../../act/sql/act14_link.md) | `Act14_Lookup_LinkProvideContent` |  |
| `insert` | 36 | [`act14_link.insert`](../../act/sql/act14_link.md) | `Act01_Edit_AccountCode` |  |
| `modelUpdate` | 41 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(act14_link)` 동적 INSERT/UPDATE | `Act14_Lookup_LinkProvideContent` | `UpdateDataModel` |
| `updateList` | 54 | `UpdateDataModel(act14_link)` 동적 INSERT/UPDATE | `Act01_Edit_AccountCode`, `Act14_Lookup_LinkProvideContent` | `UpdateDataModel` |
| `update` | 61 | `UpdateDataModel(act14_link)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 66 | `UpdateDataModel(act14_link)` 동적 DELETE | `Act01_Edit_AccountCode`, `Act14_Lookup_LinkProvideContent` | `UpdateDataModel` |
