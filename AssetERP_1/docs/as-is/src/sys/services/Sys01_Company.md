# sys.Sys01_Company

`server/sys/Sys01_Company.java`

서비스 키 `sys.Sys01_Company.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) | `Apr01_Edit_ApprDoc`, `Apr04_Edit_ApprStep`, `Dcr03_TabPage_DcrAuth`, `Dcr03_TabPage_OrgAuth`, `Emp20_Edit_Leave`, `Emp43_Tab_EvalExecute`, `Emp43_Tab_EvalResult`, `Emp43_Tab_EvalTarget`, `Emp43_Tab_FinalAppr`, `Emp43_Tab_FirstAppr`, `Ics15_Tab_ChecklistConfirm`, `Ics15_Tab_ChecklistStatus`, `Ics15_Tab_ChecklistStatusDetail`, `Ics15_Tab_ChecklistWrite`, `Ics31_Tab_ComplianceConfirm`, `Ics31_Tab_ComplianceReport`, `Ics31_Tab_ComplianceWrite`, `MyInfoPopup`, `Org01_Edit_OrgCode`, `Org02_Edit_Info`, `Sys01_Page_Logo`, `Sys01_TabPage_Info01`, `Sys01_TabPage_Info02`, `Sys01_TabPage_Info03`, `Sys01_TabPage_Info04`, `Sys30_Tab_LeaveYear` |  |
| `selectByCompanyCode` | 31 | [`sys01_company.selectByCompanyCode`](../../sys/sql/sys01_company.md) | `LoginPage` |  |
| `selectByAll` | 36 | [`sys01_company.selectByAll`](../../sys/sql/sys01_company.md) | `Lookup_Company`, `Popup_Company` |  |
| `selectByName` | 41 | [`sys01_company.selectByName`](../../sys/sql/sys01_company.md) | `Dcr30_TabPage_Company`, `Sys01_Tab_Company`, `Sys03_Tab_CompanyMenu`, `Sys04_Tab_RoleAdmin`, `Sys07_Tab_InCompany`, `Sys07_Tab_OutCompany` |  |
| `selectCompany` | 58 | [`sys01_company.selectCompany`](../../sys/sql/sys01_company.md) | `Sys01_Lookup_Company`, `Sys01_Lookup_SelectMulti`, `Sys01_Lookup_SelectSingle` |  |
| `selectByMenuId` | 75 | [`sys01_company.selectByMenuId`](../../sys/sql/sys01_company.md) | - |  |
| `selectByCode` | 81 | [`sys01_company.selectByCode`](../../sys/sql/sys01_company.md) | `Sys01_Grid_CompanyMenu` |  |
| `selectByCopyList` | 92 | [`sys01_company.selectByCopyList`](../../sys/sql/sys01_company.md) | `Sys06_Lookup_CopyMulti` |  |
| `selectByUseYn` | 103 | [`sys01_company.selectByUseYn`](../../sys/sql/sys01_company.md) | `Act01_Lookup_CopyAdmin`, `Dcr01_Lookup_DcrCopyAdmin` |  |
| `getCorpRegNo` | 109 | [`sys01_company.getCorpRegNo`](../../sys/sql/sys01_company.md) | `Sys01_TabPage_Info02` |  |
| `updateCorpRegNo` | 117 | [`sys01_company.updateCorpRegNo`](../../sys/sql/sys01_company.md) | - |  |
| `updateNote` | 126 | [`sys01_company.updateNote`](../../sys/sql/sys01_company.md) | `Sys01_Edit_Note` |  |
| `updateByMenuYn` | 135 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys03_company_menu)` 동적 INSERT/UPDATE, `UpdateDataModel(sys03_company_menu)` 동적 DELETE | `Sys01_Grid_CompanyMenu` | `UpdateDataModel` |
| `apprStepLockChk` | 172 | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | - |  |
| `update` | 182 | `UpdateDataModel(sys01_company)` 동적 INSERT/UPDATE | `Sys01_Edit_Company`, `Sys01_TabPage_Info01`, `Sys01_TabPage_Info02`, `Sys01_TabPage_Info03`, `Sys01_TabPage_Info04`, `Sys30_Tab_LeaveYear`, `TabPage_Company` | `UpdateDataModel` |
| `delete` | 206 | `UpdateDataModel(sys01_company)` 동적 DELETE | `Sys01_Tab_Company`, `TabPage_Company` | `UpdateDataModel` |
