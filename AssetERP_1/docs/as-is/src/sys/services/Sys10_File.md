# sys.Sys10_File

`server/sys/Sys10_File.java`

서비스 키 `sys.Sys10_File.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 34 | `sys10_file.selectByAll`(없음) | - |  |
| `selectById` | 39 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | - |  |
| `selectByFileId` | 45 | [`sys10_file.selectById`](../../sys/sql/sys10_file.md) | `Sys10_Lookup_FileViewer`, `Sys10_Lookup_FileViewer_AView`, `Sys10_Lookup_FileViewer_Old` |  |
| `selectByParentId` | 51 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Apr01_Grid_ApprFile`, `Apr01_Lookup_ApprFileList`, `Apr42_Lookup_FileList`, `Bbs02_Edit_Notice`, `Bbs02_Edit_NoticeAdmin`, `Bbs02_Lookup_File`, `Bbs02_Popup_Notice`, `Bbs02_Popup_NoticeAdmin`, `Bbs07_Lookup_FileList`, `Bbs15_Edit_CompanyRuleManager`, `Bbs15_Lookup_Content`, `Bbs15_Lookup_File`, `Bbs20_Grid_RelateFile`, `Bbs20_Lookup_RelateFile`, `Bbs31_Edit_Content`, `Bbs31_Lookup_Content`, `Bbs32_Lookup_FileList`, `Biz05_Lookup_RelateFile`, `Biz11_Lookup_FileList`, `Biz60_Edit_FundPriceModi`, `Com01_Grid_RelateFile`, `Com01_Lookup_RelateFile`, `Crm02_Grid_ApprFile`, `Crm12_Lookup_WorkDetail`, `Emp17_TabPage_RelateFile`, `Est02_Grid_File`, `Est04_Grid_PfFile`, `Est04_Grid_PfFileConfirm`, `Fbx01_Grid_DocList`, `Fbx01_TabPage_DocList`, `Fnd25_Edit_FundTermsManager`, `Fnd25_Lookup_Content`, `Icr01_Lookup_IcrFile`, `Icr01_Page_IcrFile`, `Ics17_Grid_FileList`, `Ics20_Lookup_File`, `Ics35_Grid_FileList`, `Lookup_MultiFile`, `Mkt03_Lookup_History`, `Mrb01_Popup_MeetingRoomReg`, `PDFViewer`, `Pay50_Lookup_ExpenseRequestInsert`, `Sch01_Grid_RelateFile`, `Sch01_Lookup_InfoView`, `Sch04_Lookup_SchList`, `Scm01_Grid_ApprFile`, `Scm13_Edit_DevProgram`, `Scm30_Edit_Program`, `Sys10_Grid_MultiFile`, `Sys10_Lookup_File`, `Sys10_Lookup_ListFileViewer`, `Sys10_Lookup_SelectMulti`, `Sys54_Lookup_SpecificMenuHistory`, `Sys61_Lookup_FileList`, `Sys90_Grid_ApprFile`, `Tdm31_Tab_RoleDesc`, `Tdm31_Tab_RoleDescAdmin`, `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigmAdmin`, `Tdm32_Tab_RoleDigm_20260310`, `Tdm34_TabPage_RoleAllcDetail`, `Tdm36_TabPage_RoleReport`, `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlManagerAdmin`, `Tdm42_Tab_ManlOrgAppr`, `Tdm50_TabPage_CheckJob`, `Tdm54_Edit_ChckInsuffCmnt`, `ics20_Grid_FileList` |  |
| `selectByParentId2` | 57 | [`sys10_file.selectByParentId2`](../../sys/sql/sys10_file.md) | `Act80_LookupGrid_RelateFile` |  |
| `selectByDevId` | 63 | [`sys10_file.selectByDevId`](../../sys/sql/sys10_file.md) | `Scm01_Lookup_ApprFile`, `Scm11_Grid_ApprFile` |  |
| `selectByDevStepId` | 69 | [`sys10_file.selectByDevStepId`](../../sys/sql/sys10_file.md) | - |  |
| `selectByFeeChargeId` | 75 | [`sys10_file.selectByFeeChargeId`](../../sys/sql/sys10_file.md) | `Biz20_Lookup_FileList` |  |
| `getIcsFile` | 81 | [`sys10_file.getIcsFile`](../../sys/sql/sys10_file.md) | `Icr01_Lookup_IcrFileAdmin`, `Ics01_Lookup_IcsFileAdmin`, `Ics01_Tab_IcsFileUpload`, `Ics01_Tab_IcsFileUser` |  |
| `getTdmCheckFormFile` | 92 | [`sys10_file.getTdmCheckFormFile`](../../sys/sql/sys10_file.md) | `Tdm43_Tab_RelateFormFileUpload` |  |
| `selectUnConnTdmFormFile` | 97 | [`sys10_file.selectUnConnTdmFormFile`](../../sys/sql/sys10_file.md) | `Tdm43_Lookup_RelateFormFileList` |  |
| `selectByText` | 102 | [`sys10_file.selectByText`](../../sys/sql/sys10_file.md) | - |  |
| `selectByIcsFile` | 114 | [`sys10_file.selectByIcsFile`](../../sys/sql/sys10_file.md) | - |  |
| `selectByAdmin` | 121 | [`sys10_file.selectByAdmin`](../../sys/sql/sys10_file.md) | - |  |
| `selectByIcsFileAll` | 128 | [`sys10_file.selectByIcsFileAll`](../../sys/sql/sys10_file.md) | - |  |
| `selectByCheck` | 138 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | - |  |
| `selectByApprId` | 149 | `sys10_file.selectByApprId`(없음) | - |  |
| `selectApprRelateDoc` | 155 | [`sys10_file.selectApprRelateDoc`](../../sys/sql/sys10_file.md) | `Biz55_Tab_ErpFeeCharge`, `Dcr10_Lookup_MailSender` |  |
| `selectMailFileHistory` | 161 | [`sys10_file.selectMailFileHistory`](../../sys/sql/sys10_file.md) | `Dcr10_Lookup_MailViwer` |  |
| `selectByClassTreeId` | 167 | `sys10_file.selectByClassTreeId`(없음) | - |  |
| `selectByTotalSize` | 180 | [`sys10_file.selectByTotalSize`](../../sys/sql/sys10_file.md) | `Sys10_Tab_TotalSize` |  |
| `selectByTotalSizeYear` | 188 | [`sys10_file.selectByTotalSizeYear`](../../sys/sql/sys10_file.md) | `Sys10_TabPage_Detail` |  |
| `selectByTotalSizeMonth` | 196 | [`sys10_file.selectByTotalSizeMonth`](../../sys/sql/sys10_file.md) | `Sys10_TabPage_Detail` |  |
| `updateRelateApprId` | 205 | [`sys10_file.updateRelateApprId`](../../sys/sql/sys10_file.md) | `Apr01_Grid_ApprFile` |  |
| `selectOneFileName` | 218 | [`sys10_file.selectOneFileName`](../../sys/sql/sys10_file.md) | `Opr03_Lookup_FileUpDownLoad` |  |
| `getServerPath` | 231 | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Apr01_Grid_ApprFile`, `Flt10_Tab_CeoReport`, `Ics16_Lookup_RelateAppr`, `Ics31_Tab_ComplianceReport`, `Tdm31_Tab_RoleDesc`, `Tdm31_Tab_RoleDescAdmin`, `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigmAdmin`, `Tdm32_Tab_RoleDigm_20260310`, `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlManagerAdmin`, `Tdm42_Tab_ManlOrgAppr`, `Tdm50_TabPage_CheckJob` | `File` |
| `selectByFileYn` | 246 | [`sys10_file.selectByFileYn`](../../sys/sql/sys10_file.md) | `Apr01_Lookup_ApprFile`, `Rpt02_Lookup_FileList` |  |
| `selectByFamilyConsentId` | 252 | [`sys10_file.selectByFamilyConsentId`](../../sys/sql/sys10_file.md) | `Flt02_Lookup_Emp`, `Flt07_Lookup_FamilyConsent` |  |
| `findTrashFile` | 257 | [`sys10_file.findTrashFile`](../../sys/sql/sys10_file.md) | `Sys10_Tab_TrashFileList` |  |
| `fileRandomCopy` | 262 | - | `Sys10_Lookup_ListFileViewer` | `File`, `IdmsConfig`, `StrUtil` |
| `insertPayFile` | 356 | `sys10_file.insertPayFile`(없음) | - |  |
| `update` | 363 | `UpdateDataModel(sys10_file)` 동적 INSERT/UPDATE | `Apr01_Edit_ApprDoc`, `Apr01_Lookup_ApprFile`, `Ics01_Tab_IcsFileUpload`, `Tdm43_Tab_RelateFormFileUpload` | `UpdateDataModel` |
| `delete` | 368 | `UpdateDataModel(sys10_file)` 동적 DELETE | `Icr01_Lookup_IcrFile` | `UpdateDataModel` |
| `copyFile` | 417 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md) | `Apr01_Grid_ApprFile`, `Tdm31_Tab_RoleDescAdmin`, `Tdm32_Tab_RoleDigmAdmin`, `Tdm42_Tab_ManlManagerAdmin` |  |
| `copyFileAdminYn` | 436 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.selectByAdminYn`](../../sys/sql/sys10_file.md), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md) | `Apr01_Grid_ApprFile` |  |
| `copyPfResultReportFileSafe` | 461 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md), [`sys10_file.selectByPfFileId`](../../sys/sql/sys10_file.md) | - | `File` |
| `copySetFileName` | 502 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Apr01_Grid_ApprFile` | `File` |
| `fileReName` | 557 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) | `Apr01_Grid_ApprFile`, `Tdm31_Tab_RoleDesc`, `Tdm31_Tab_RoleDescAdmin`, `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigmAdmin`, `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlManagerAdmin`, `Tdm42_Tab_ManlOrgAppr`, `Tdm50_TabPage_CheckJob` | `File` |
| `checkFileStatus` | 591 | - | `Apr01_Grid_ApprFile`, `Tdm31_Tab_RoleDesc`, `Tdm31_Tab_RoleDescAdmin`, `Tdm32_Tab_RoleDigm`, `Tdm32_Tab_RoleDigmAdmin`, `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlManagerAdmin`, `Tdm42_Tab_ManlOrgAppr`, `Tdm50_TabPage_CheckJob` | `File` |
| `updateOthers` | 634 | [`sys10_file.updateOthers`](../../sys/sql/sys10_file.md) | `Apr01_Lookup_ApprFileList` |  |
