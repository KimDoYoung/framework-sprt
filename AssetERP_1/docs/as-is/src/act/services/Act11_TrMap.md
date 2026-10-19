# act.Act11_TrMap

`server/act/Act11_TrMap.java`

서비스 키 `act.Act11_TrMap.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`act11_tr_map.selectById`](../../act/sql/act11_tr_map.md) | - |  |
| `selectByCompanyId` | 25 | [`act11_tr_map.selectByCompanyId`](../../act/sql/act11_tr_map.md) | `Act11_Tab_TrJournalMap` |  |
| `insertInitData` | 31 | [`act11_tr_map.deleteByJournalGroup`](../../act/sql/act11_tr_map.md), [`act11_tr_map.insertInitData`](../../act/sql/act11_tr_map.md), [`act12_journal_map.deleteByJournalGroup`](../../act/sql/act12_journal_map.md), [`act12_journal_map.insertInitData`](../../act/sql/act12_journal_map.md) | `Act11_Tab_TrJournalMap` |  |
| `update` | 52 | `UpdateDataModel(act11_tr_map)` 동적 INSERT/UPDATE | `Act11_Tab_TrJournalMap` | `UpdateDataModel` |
| `delete` | 57 | `UpdateDataModel(act11_tr_map)` 동적 DELETE | `Act11_Tab_TrJournalMap` | `UpdateDataModel` |
