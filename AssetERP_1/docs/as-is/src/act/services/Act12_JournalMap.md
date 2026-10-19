# act.Act12_JournalMap

`server/act/Act12_JournalMap.java`

서비스 키 `act.Act12_JournalMap.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`act12_journal_map.selectById`](../../act/sql/act12_journal_map.md) | - |  |
| `selectByCompanyId` | 22 | `act12_journal_map.selectByCompanyId`(없음) | - |  |
| `selectByJournalGroup` | 28 | [`act12_journal_map.selectByJournalGroup`](../../act/sql/act12_journal_map.md) | `Act11_Grid_TrJournalMap` |  |
| `update` | 34 | `UpdateDataModel(act12_journal_map)` 동적 INSERT/UPDATE | `Act11_Grid_TrJournalMap` | `UpdateDataModel` |
| `delete` | 39 | `UpdateDataModel(act12_journal_map)` 동적 DELETE | `Act11_Grid_TrJournalMap` | `UpdateDataModel` |
