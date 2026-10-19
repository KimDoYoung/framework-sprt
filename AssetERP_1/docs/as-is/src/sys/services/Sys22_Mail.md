# sys.Sys22_Mail

`server/sys/Sys22_Mail.java`

서비스 키 `sys.Sys22_Mail.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByCompanyId` | 17 | [`sys22_mail.selectByCompanyId`](../../sys/sql/sys22_mail.md) | `Sys22_Tab_Mail` |  |
| `modelUpdate` | 22 | [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys22_mail)` 동적 INSERT/UPDATE | `Sys22_Lookup_Mail` | `UpdateDataModel` |
| `update` | 36 | `UpdateDataModel(sys22_mail)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(sys22_mail)` 동적 DELETE | `Sys22_Tab_Mail` | `UpdateDataModel` |
