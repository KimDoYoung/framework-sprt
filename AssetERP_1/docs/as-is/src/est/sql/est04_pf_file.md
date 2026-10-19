# est04_pf_file

`server/est/mapper/est04_pf_file.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`est04_pf_file`](../../../db/tables/est.md), [`sys10_file`](../../../db/tables/sys.md) |  | `est.Est04_PfFile.selectById` |
| `selectByPfHistoryId` | select | 25 | [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md), [`sys10_file`](../../../db/tables/sys.md) |  | `est.Est04_PfFile.selectByPfHistoryId` |
