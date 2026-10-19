# fnd.Fnd01_FundCode

`server/fnd/Fnd01_FundCode.java`

서비스 키 `fnd.Fnd01_FundCode.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`fnd01_fund_code.selectById`](../../fnd/sql/fnd01_fund_code.md) | - |  |
| `selectByFundName` | 38 | [`fnd01_fund_code.selectByFundName`](../../fnd/sql/fnd01_fund_code.md) | `Fnd01_Tab_FundCode`, `Fnd01_Tab_FundSearch`, `Fnd01_Tab_FundSearchIcam`, `Fnd01_Tab_FundSearch_20240730`, `Fnd08_Tab_OrgAuth`, `Fnd08_Tab_OrgAuthTempFund` |  |
| `selectByFundOrgAuth` | 56 | [`fnd01_fund_code.selectByFundOrgAuth`](../../fnd/sql/fnd01_fund_code.md) | `Apr01_Tab_FundDocument`, `Fnd08_Tab_OrgAuth`, `Fnd08_Tab_OrgAuthTempFund` |  |
| `selectByWorkDate` | 71 | [`fnd01_fund_code.selectByWorkDate`](../../fnd/sql/fnd01_fund_code.md) | `Fnd01_Tab_FundInfoLoad` |  |
| `selectByFundPlan` | 83 | [`fnd01_fund_code.selectByFundPlan`](../../fnd/sql/fnd01_fund_code.md) | `Fnd01_Tab_FundPlan` |  |
| `selectByFundPlanEmp` | 106 | [`fnd01_fund_code.selectByFundPlanEmp`](../../fnd/sql/fnd01_fund_code.md) | `Pln02_Tab_PlanEmp` |  |
| `noteUpdate` | 125 | [`fnd01_fund_code.noteUpdate`](../../fnd/sql/fnd01_fund_code.md), [`fnd01_fund_code.selectById`](../../fnd/sql/fnd01_fund_code.md) | `Fnd01_Edit_FundCode` |  |
| `update` | 139 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd01_fund_code.selectOneFundCodeCheck`](../../fnd/sql/fnd01_fund_code.md), `UpdateDataModel(fnd02_fund_info)` 동적 INSERT/UPDATE, `UpdateDataModel(fnd01_fund_code)` 동적 INSERT/UPDATE | `Fnd01_Edit_FundCode`, `Fnd01_Edit_FundPlan` | `UpdateDataModel` |
| `delete` | 222 | `UpdateDataModel(fnd02_fund_info)` 동적 DELETE, `UpdateDataModel(fnd01_fund_code)` 동적 DELETE | `Fnd01_Edit_FundCode`, `Fnd01_Edit_FundPlan`, `Fnd01_Tab_FundCode`, `Fnd01_Tab_FundInfoLoad`, `Fnd01_Tab_FundPlan`, `Fnd08_Tab_OrgAuth`, `Fnd08_Tab_OrgAuthTempFund` | `UpdateDataModel` |
| `selectByLookupFundCode` | 251 | [`fnd01_fund_code.selectByLookupFundCode`](../../fnd/sql/fnd01_fund_code.md) | - |  |
| `getLastUploadDate` | 268 | [`fnd01_fund_code.selectLastUploadDate`](../../fnd/sql/fnd01_fund_code.md) | `Fnd01_Tab_FundInfoLoad` |  |
| `selectByOverlap` | 277 | [`fnd01_fund_code.selectByOverlap`](../../fnd/sql/fnd01_fund_code.md) | `Fnd01_Edit_FundPlan` |  |
| `selectIcamFundInfo` | 288 | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | - | `DatabaseFactoryICAM` |
| `selectByPlan` | 307 | [`fnd01_fund_code.selectByPlan`](../../fnd/sql/fnd01_fund_code.md) | `Fnd20_Tab_Plan`, `Fnd20_Tab_PlanEmp`, `Pln02_Tab_Plan` |  |
| `selectByCompanyId` | 326 | [`fnd01_fund_code.selectByCompanyId`](../../fnd/sql/fnd01_fund_code.md) | `Fnd10_Tab_RelateAst` |  |
| `selectByHistoryCompanyId` | 331 | [`fnd01_fund_code.selectByHistoryCompanyId`](../../fnd/sql/fnd01_fund_code.md) | `Fnd01_Tab_FundIcamHistory` |  |
