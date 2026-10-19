# act11_tr_map

`server/act/mapper/act11_tr_map.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`act10_repr_account`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_cdnm`, `f_sysdate` | `act.Act11_TrMap.selectById` |
| `selectByCompanyId` | select | 35 | [`act10_repr_account`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_cdnm`, `f_sysdate` | `act.Act11_TrMap.selectByCompanyId` |
| `insertInitData` | insert | 51 | [`act11_tr_map`](../../../db/tables/act.md) | `f_create_seq` | `act.Act11_TrMap.insertInitData` |
| `insertFormAct11` | insert | 68 | [`act11_tr_map`](../../../db/tables/act.md) | `f_create_seq` | - |
| `deleteByJournalGroup` | delete | 83 | [`act11_tr_map`](../../../db/tables/act.md) |  | `act.Act11_TrMap.insertInitData` |
