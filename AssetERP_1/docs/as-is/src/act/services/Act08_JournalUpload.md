# act.Act08_JournalUpload

`server/act/Act08_JournalUpload.java`

서비스 키 `act.Act08_JournalUpload.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`act08_journal_upload.selectById`](../../act/sql/act08_journal_upload.md) | - |  |
| `deleteByCompanyId` | 25 | [`act08_journal_upload.deleteByCompanyId`](../../act/sql/act08_journal_upload.md) | `Act02_Tab_CreateJournal` |  |
| `journalWork` | 32 | [`act08_journal_upload.journalWork`](../../act/sql/act08_journal_upload.md) | `Act02_Tab_CreateJournal` |  |
| `update` | 51 | `UpdateDataModel(act08_journal_upload)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 56 | `UpdateDataModel(act08_journal_upload)` 동적 DELETE | - | `UpdateDataModel` |
