# sys31_leave_company

`server/sys/mapper/sys31_leave_company.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`sys31_leave_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `sys.Sys31_LeaveCompany.selectById`, `sys.Sys31_LeaveCompany.update` |
| `selectByCompanyId` | select | 30 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys31_leave_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `sys.Sys31_LeaveCompany.selectByCompanyId` |
