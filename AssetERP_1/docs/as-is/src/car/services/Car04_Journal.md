# car.Car04_Journal

`server/car/Car04_Journal.java`

서비스 키 `car.Car04_Journal.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`car04_journal.selectById`](../../car/sql/car04_journal.md) | - |  |
| `selectByDate` | 27 | [`car04_journal.selectByDate`](../../car/sql/car04_journal.md) | `Car04_Lookup_PrivateJournal` |  |
| `selectByPrivateJournal` | 40 | [`car04_journal.selectByPrivateJournal`](../../car/sql/car04_journal.md) | `Car04_Lookup_PrivateJournal`, `Car04_Tab_PrivateJournal`, `Car04_Tab_PrivateJournalAdmin` |  |
| `selectByPublicJournal` | 52 | [`car04_journal.selectByPublicJournal`](../../car/sql/car04_journal.md) | `Car04_Tab_PublicJournal` |  |
| `selectByPublicJournalAdmin` | 65 | [`car04_journal.selectByPublicJournalAdmin`](../../car/sql/car04_journal.md) | `Car04_Tab_PublicJournalAdmin` |  |
| `selectByJournal` | 78 | [`car04_journal.selectByJournal`](../../car/sql/car04_journal.md) | `Car04_Tab_Journal` |  |
| `getAfterFixYn` | 90 | [`car04_journal.getAfterFixYn`](../../car/sql/car04_journal.md) | `Car04_Lookup_PrivateJournal` |  |
| `getBeforeCloseYn` | 100 | [`car04_journal.getBeforeCloseYn`](../../car/sql/car04_journal.md) | `Car04_Tab_Journal` |  |
| `getAfterCloseYn` | 110 | [`car04_journal.getAfterCloseYn`](../../car/sql/car04_journal.md) | `Car04_Lookup_PrivateJournal`, `Car04_Tab_Journal` |  |
| `batch` | 120 | [`car04_journal.checkDate`](../../car/sql/car04_journal.md), [`car04_journal.insert`](../../car/sql/car04_journal.md), [`sys12_calendar.getWorkDay`](../../sys/sql/sys12_calendar.md) | `Car04_Lookup_Batch` |  |
| `modelUpdate` | 148 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE | `Car04_Tab_Journal`, `Car04_Tab_PrivateJournal`, `Car04_Tab_PrivateJournalAdmin`, `Car04_Tab_PublicJournal`, `Car04_Tab_PublicJournalAdmin` | `UpdateDataModel` |
| `checkBookingId` | 161 | [`car04_journal.checkBookingId`](../../car/sql/car04_journal.md) | `Car04_Tab_PublicJournal`, `Car04_Tab_PublicJournalAdmin` |  |
| `checkDate` | 171 | [`car04_journal.checkDate`](../../car/sql/car04_journal.md) | `Car04_Lookup_PrivateJournal` |  |
| `update` | 183 | `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE | `Car04_Tab_Journal`, `Car04_Tab_PrivateJournal`, `Car04_Tab_PrivateJournalAdmin` | `UpdateDataModel` |
| `delete` | 188 | `UpdateDataModel(car04_journal)` 동적 DELETE | `Car04_Tab_PrivateJournal`, `Car04_Tab_PrivateJournalAdmin`, `Car04_Tab_PublicJournalAdmin` | `UpdateDataModel` |
