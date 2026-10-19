# apr91_disposal_history

`server/apr/mapper/apr91_disposal_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`apr91_disposal_history`](../../../db/tables/apr.md) |  | `apr.Apr91_DisposalHistory.selectById` |
| `insert` | insert | 24 | [`apr91_disposal_history`](../../../db/tables/apr.md) | `f_create_seq` | `apr.Apr90_DisposalList.modelUpdate`, `apr.Apr90_DisposalList.updateAppr`, `apr.Apr91_DisposalHistory.insert`, `apr.Apr99_ApprDel.restore` |
