# cmp.Cmp10_MailBook

`server/cmp/Cmp10_MailBook.java`

서비스 키 `cmp.Cmp10_MailBook.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`cmp10_mail_book.selectById`](../../cmp/sql/cmp10_mail_book.md) | - |  |
| `selectByCompanyId` | 26 | [`cmp10_mail_book.selectByCompanyId`](../../cmp/sql/cmp10_mail_book.md) | `Cmp10_Tab_MailBook` |  |
| `selectByPersonId` | 32 | [`cmp10_mail_book.selectByPersonId`](../../cmp/sql/cmp10_mail_book.md) | `Dcr10_Lookup_MailSender` |  |
| `modelUpdate` | 38 | [`cmp10_mail_book.createPassword`](../../cmp/sql/cmp10_mail_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(cmp10_mail_book)` 동적 INSERT/UPDATE | `Cmp10_Edit_Tab_MailBook` | `UpdateDataModel` |
| `selectByText` | 54 | [`cmp10_mail_book.selectByText`](../../cmp/sql/cmp10_mail_book.md) | `Cmp10_Lookup_MailBook`, `Cmp10_Lookup_MailBookList` |  |
| `deleteByMailBookId` | 63 | `cmp10_mail_book.deleteByMailBookId`(없음) | - |  |
| `update` | 68 | `UpdateDataModel(cmp10_mail_book)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 73 | `UpdateDataModel(cmp10_mail_book)` 동적 DELETE | `Cmp10_Tab_MailBook` | `UpdateDataModel` |
