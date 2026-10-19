# act08_journal_upload

`server/act/mapper/act08_journal_upload.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 23 | [`act08_journal_upload`](../../../db/tables/act.md) |  | `act.Act08_JournalUpload.selectById` |
| `journalWork` | select | 29 | - | `f_create_journal_upload` | `act.Act08_JournalUpload.journalWork` |
| `excelInsert` | insert | 33 | [`act08_journal_upload`](../../../db/tables/act.md) | `f_sysdate` | - |
| `deleteByCompanyId` | delete | 67 | [`act08_journal_upload`](../../../db/tables/act.md) |  | `act.Act08_JournalUpload.deleteByCompanyId` |
