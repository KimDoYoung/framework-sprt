# tdm95_change_history

`server/tdm/mapper/tdm95_change_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`tdm95_change_history`](../../../db/tables/tdm.md) |  | `tdm.Tdm95_ChangeHistory.selectById` |
| `selectByTargetId` | select | 27 | [`tdm95_change_history`](../../../db/tables/tdm.md), [`tdm96_change_detail`](../../../db/tables/tdm.md) |  | `tdm.Tdm95_ChangeHistory.selectByTargetId` |
