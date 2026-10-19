# sys.Sys09_Code

`server/sys/Sys09_Code.java`

서비스 키 `sys.Sys09_Code.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 27 | [`sys09_code.selectByAll`](../../sys/sql/sys09_code.md) | `Sys09_Grid_CodeList` |  |
| `selectByCodeKindId` | 32 | [`sys09_code.selectByCodeKindId`](../../sys/sql/sys09_code.md) | `Sys09_Grid_Code`, `Sys09_Grid_SuperUser`, `Sys09_Lookup_CodeKind` |  |
| `selectByCompanyId` | 42 | [`sys09_code.selectByCompanyId`](../../sys/sql/sys09_code.md) | `Sys08_Tab_SuperUser` |  |
| `selectByStringComboBox` | 65 | [`sys09_code.selectByStringComboBox`](../../sys/sql/sys09_code.md) | - |  |
| `selectByCodeKind` | 82 | [`sys09_code.selectByCodeKind`](../../sys/sql/sys09_code.md) | `Bbs15_Edit_CompanyRuleManager`, `Biz03_Lookup_AccountMap`, `Biz04_Lookup_EmpSetup`, `ComboBoxCode`, `ComboBoxField`, `Fnd25_Edit_FundTermsManager`, `Fnd25_Lookup_FundTermsManager`, `Sys09_Lookup_Code`, `Sys09_Lookup_CodeList` |  |
| `selectByCode` | 100 | [`sys09_code.selectByCode`](../../sys/sql/sys09_code.md) | `Mkt01_Tab_TargetCompany`, `Sys09_Tree_Code` |  |
| `selectByKindGroupCode` | 110 | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) | `Flt05_Lookup_ItemTypeConfirm` |  |
| `selectByCode3` | 115 | [`sys09_code.selectByCode3`](../../sys/sql/sys09_code.md) | `Bbs02_Edit_Notice`, `Bbs02_Lookup_LoadBbs`, `Bbs02_Tab_NoticeAdmin`, `Bbs02_Tab_NoticeManager`, `Bbs02_Tab_NoticeView` |  |
| `selectByApplyDate` | 120 | [`sys09_code.selectByCodeKindId`](../../sys/sql/sys09_code.md) | - | `Calendar` |
| `selectByKindCode` | 128 | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) | `Act01_Edit_AccountCode`, `Act14_Lookup_LinkProvideContent`, `Ast01_Lookup_ItemClass`, `Ast02_Grid_Detail`, `Bbs02_Tab_NoticeViewLaw`, `Bbs02_Tab_NoticeViewMgt`, `Biz01_Edit_Account`, `Biz01_Edit_Card`, `Biz01_Edit_CardSimple`, `Biz01_Edit_Other`, `Biz01_Edit_OtherSimple`, `Biz01_Lookup_CardManagement`, `Icam01_Tab_DataInfo` |  |
| `insert` | 141 | [`sys09_code.delete`](../../sys/sql/sys09_code.md), [`sys09_code.insert`](../../sys/sql/sys09_code.md), [`sys09_code.selectByCompanyId`](../../sys/sql/sys09_code.md) | `Sys08_Tab_SuperUser` |  |
| `selectByChecklistCode` | 200 | [`sys09_code.selectByChecklistCode`](../../sys/sql/sys09_code.md) | - |  |
| `selectByIcs21` | 213 | [`sys09_code.selectByIcs21`](../../sys/sql/sys09_code.md) | `Ics10_Edit_Checklist`, `Ics10_Lookup_UseYn`, `Ics10_Tab_Checklist`, `Ics10_Tab_ChecklistAdmin`, `Ics15_Tab_ChecklistConfirm`, `Ics15_Tab_ChecklistStatus`, `Ics15_Tab_ChecklistStatusDetail`, `Ics15_Tab_ChecklistWrite` |  |
| `selectByIcs23` | 222 | [`sys09_code.selectByIcs23`](../../sys/sql/sys09_code.md) | `Ics10_Edit_Checklist`, `Ics10_Lookup_UseYn`, `Ics10_Tab_Checklist`, `Ics10_Tab_ChecklistAdmin`, `Ics15_Tab_ChecklistConfirm`, `Ics15_Tab_ChecklistStatus`, `Ics15_Tab_ChecklistStatusDetail`, `Ics15_Tab_ChecklistWrite` |  |
| `selectByDcrLv1` | 232 | [`sys09_code.selectByDcr01`](../../sys/sql/sys09_code.md) | `Dcr01_Tab_DcrWrite` |  |
| `selectByDcrLv2` | 243 | [`sys09_code.selectByDcr01`](../../sys/sql/sys09_code.md) | `Dcr01_Tab_DcrWrite` |  |
| `selectByDcrLv3` | 255 | [`sys09_code.selectByDcr01`](../../sys/sql/sys09_code.md) | `Dcr01_Tab_DcrWrite` |  |
| `selectByDcrDetail` | 267 | [`sys09_code.selectByDcrDetail`](../../sys/sql/sys09_code.md) | `Dcr01_Tab_DcrWrite` |  |
| `codeInsert` | 276 | [`sys09_code.codeInsert`](../../sys/sql/sys09_code.md) | `Sys08_Tab_CodeKindClient` |  |
| `checkCode` | 317 | [`dcr05_doc_type.checkDocFormClassCode`](../../dcr/sql/dcr05_doc_type.md), [`emp20_leave.checkSpcLeaveCode`](../../emp/sql/emp20_leave.md), [`rpt03_week.checkWeekBizType`](../../rpt/sql/rpt03_week.md), [`sys09_code.checkByCode`](../../sys/sql/sys09_code.md), [`sys09_code.selectById`](../../sys/sql/sys09_code.md), [`sys95_manual.checkManualType`](../../sys/sql/sys95_manual.md) | `Sys09_Lookup_Code` |  |
| `update` | 386 | `UpdateDataModel(sys09_code)` 동적 INSERT/UPDATE | `Sys09_Grid_Code`, `Sys09_Grid_SuperUser`, `Sys09_Lookup_Code`, `Sys09_Lookup_CodeList` | `UpdateDataModel` |
| `delete` | 391 | `UpdateDataModel(sys09_code)` 동적 DELETE | `Sys09_Grid_Code`, `Sys09_Grid_SuperUser`, `Sys09_Lookup_Code`, `Sys09_Lookup_CodeList` | `UpdateDataModel` |
