# bbs05_history

`server/bbs/mapper/bbs05_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 13 | [`bbs05_history`](../../../db/tables/bbs.md) |  | - |
| `selectByNoticeId` | select | 19 | [`bbs05_history`](../../../db/tables/bbs.md) |  | `bbs.Bbs05_History.selectByNoticeId`, `bbs.Bbs05_History.updatePersonId` |
| `insert` | insert | 26 | [`bbs05_history`](../../../db/tables/bbs.md) |  | `bbs.Bbs05_History.updatePersonId` |
