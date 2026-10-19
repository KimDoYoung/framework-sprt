# crm.Crm10_Comment

`server/crm/Crm10_Comment.java`

서비스 키 `crm.Crm10_Comment.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByItemId` | 18 | [`crm10_cmnt.selectByItemId`](../../crm/sql/crm10_cmnt.md) | `Crm01_Edit_Item` |  |
| `insert` | 26 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(crm10_cmnt)` 동적 INSERT/UPDATE | `Crm01_Edit_Item` | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(crm10_cmnt)` 동적 DELETE | `Crm01_Edit_Item` | `UpdateDataModel` |
