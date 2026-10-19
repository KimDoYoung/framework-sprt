# act15_close_check

`server/act/mapper/act15_close_check.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`act15_close_check`](../../../db/tables/act.md) | `f_get_company_nm` | `act.Act15_CloseCheck.selectById`, `act.Act15_CloseCheck.update` |
| `selectByText` | select | 33 | [`act15_close_check`](../../../db/tables/act.md), [`sys01_company`](../../../db/tables/sys.md) |  | `act.Act04_GenLedger.insertClose`, `act.Act15_CloseCheck.selectByText` |
