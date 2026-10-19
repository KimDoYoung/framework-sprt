# cmp.Cmp11_MailRole

`server/cmp/Cmp11_MailRole.java`

서비스 키 `cmp.Cmp11_MailRole.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByRoleId` | 21 | [`cmp11_mail_role.selectByRoleId`](../../cmp/sql/cmp11_mail_role.md) | `Cmp10_Tab_MailBookList` |  |
| `deleteByMailBookId` | 28 | [`cmp11_mail_role.deleteByMailBookId`](../../cmp/sql/cmp11_mail_role.md) | `Cmp10_Tab_MailBook` |  |
| `updateList` | 33 | [`cmp11_mail_role.checkPerson`](../../cmp/sql/cmp11_mail_role.md), [`cmp11_mail_role.insert`](../../cmp/sql/cmp11_mail_role.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Cmp10_Tab_MailBookList` |  |
| `update` | 57 | `UpdateDataModel(cmp11_mail_role)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 62 | `UpdateDataModel(cmp11_mail_role)` 동적 DELETE | `Cmp10_Tab_MailBookList` | `UpdateDataModel` |
