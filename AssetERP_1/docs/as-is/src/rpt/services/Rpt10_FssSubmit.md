# rpt.Rpt10_FssSubmit

`server/rpt/Rpt10_FssSubmit.java`

서비스 키 `rpt.Rpt10_FssSubmit.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`rpt10_fss_submit.selectById`](../../rpt/sql/rpt10_fss_submit.md) | - |  |
| `selectBySearchText` | 23 | [`rpt10_fss_submit.selectBySearchText`](../../rpt/sql/rpt10_fss_submit.md) | `Rpt10_Tab_FssSubmit` |  |
| `selectByReportCode` | 32 | [`rpt10_fss_submit.selectByReportCode`](../../rpt/sql/rpt10_fss_submit.md) | `Emp01_Rd_FinanceProState`, `Emp01_Rd_OfficerState`, `Emp01_Rd_PersonState`, `Emp01_Rd_ProPersonState`, `Org02_Rd_OrgState`, `Sys01_Rd_CompanyState` |  |
| `modelUpdate` | 41 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(rpt10_fss_submit)` 동적 INSERT/UPDATE | `Rpt10_Edit_WriteGuide` | `UpdateDataModel` |
| `update` | 54 | `UpdateDataModel(rpt10_fss_submit)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 59 | `UpdateDataModel(rpt10_fss_submit)` 동적 DELETE | `Rpt10_Tab_FssSubmit` | `UpdateDataModel` |
