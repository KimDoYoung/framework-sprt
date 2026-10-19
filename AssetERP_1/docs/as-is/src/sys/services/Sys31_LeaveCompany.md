# sys.Sys31_LeaveCompany

`server/sys/Sys31_LeaveCompany.java`

서비스 키 `sys.Sys31_LeaveCompany.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sys31_leave_company.selectById`](../../sys/sql/sys31_leave_company.md) | - |  |
| `selectByCompanyId` | 24 | [`sys31_leave_company.selectByCompanyId`](../../sys/sql/sys31_leave_company.md) | `Emp20_Edit_Leave`, `Sys31_Lookup_LeaveCompany` |  |
| `update` | 30 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys31_leave_company.selectById`](../../sys/sql/sys31_leave_company.md), `UpdateDataModel(sys31_leave_company)` 동적 INSERT/UPDATE | `Sys31_Lookup_LeaveCompany` | `UpdateDataModel` |
| `delete` | 47 | `UpdateDataModel(sys31_leave_company)` 동적 DELETE | - | `UpdateDataModel` |
