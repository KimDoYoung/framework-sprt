# act12_journal_map

`server/act/mapper/act12_journal_map.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`act10_repr_account`](../../../db/tables/act.md), [`act12_journal_map`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | `act.Act12_JournalMap.selectById` |
| `selectByJournalGroup` | select | 33 | [`act10_repr_account`](../../../db/tables/act.md), [`act12_journal_map`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | `act.Act12_JournalMap.selectByJournalGroup` |
| `selectByTrType` | select | 44 | [`act11_tr_map`](../../../db/tables/act.md), [`act12_journal_map`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | - |
| `insertInitData` | insert | 62 | [`act12_journal_map`](../../../db/tables/act.md) | `f_create_seq` | `act.Act11_TrMap.insertInitData` |
| `insertFormAct12` | insert | 80 | [`act12_journal_map`](../../../db/tables/act.md) | `f_create_seq` | - |
| `deleteByJournalGroup` | delete | 97 | [`act12_journal_map`](../../../db/tables/act.md) |  | `act.Act11_TrMap.insertInitData` |
