# sys.Sys11_RelateFile

`server/sys/Sys11_RelateFile.java`

서비스 키 `sys.Sys11_RelateFile.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 22 | [`sys11_relate_file.selectByAll`](../../sys/sql/sys11_relate_file.md) | - |  |
| `selectById` | 27 | [`sys11_relate_file.selectById`](../../sys/sql/sys11_relate_file.md) | - |  |
| `selectByParentId` | 33 | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) | `Ics01_Lookup_IcsFile`, `Ics01_Page_IcsFile`, `Tdm43_Page_Relate`, `Tdm45_TabPage_Relate` |  |
| `selectByIcsFileAll` | 39 | [`sys11_relate_file.selectByIcsFileAll`](../../sys/sql/sys11_relate_file.md) | `Ics01_Grid_FileList` |  |
| `selectBySeachText` | 49 | [`sys11_relate_file.selectBySeachText`](../../sys/sql/sys11_relate_file.md) | `Ics01_Tab_FileList` |  |
| `checkFileDelete` | 59 | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) | `Act80_LookupGrid_RelateFile`, `Apr01_Grid_ApprFile`, `Apr01_Lookup_ApprFile`, `Apr42_Lookup_FileList`, `Bbs02_Lookup_File`, `Bbs07_Lookup_FileList`, `Bbs15_Lookup_File`, `Bbs20_Grid_RelateFile`, `Bbs32_Lookup_FileList`, `Biz05_Lookup_RelateFile`, `Biz11_Lookup_FileList`, `Biz20_Lookup_FileList`, `Biz60_Edit_FundPriceModi`, `Com01_Grid_RelateFile`, `Com01_Lookup_RelateFile`, `Crm02_Grid_ApprFile`, `Crm12_Lookup_WorkDetail`, `Emp17_TabPage_RelateFile`, `Emp18_TabPage_RelateFile`, `Emp50_Tab_TransportExpense`, `Est02_Grid_File`, `Est04_Grid_PfFile`, `Flt02_Lookup_Emp`, `Ics01_Tab_IcsFileUpload`, `Ics17_Grid_FileList`, `Mkt03_Lookup_History`, `Pay08_Tab_TaxWithholdingAdmin`, `Pay50_Lookup_ExpenseRequestInsert`, `Rpt02_Lookup_FileList`, `Sch01_Grid_RelateFile`, `Sys10_Grid_MultiFile`, `Sys10_Lookup_ListFileViewer`, `Sys10_Lookup_SelectMulti`, `Sys10_Tab_TrashFileList`, `Sys90_Grid_ApprFile`, `Sys95_Tab_ManualAdmin`, `Tdm43_Tab_RelateFormFileUpload`, `ics20_Grid_FileList` |  |
| `insert` | 143 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.insertCheck`](../../sys/sql/sys11_relate_file.md) | `Ics01_Lookup_IcsFile` |  |
| `insertTdmManlList` | 168 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md), [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) | `Tdm43_Tab_ManlItemList` |  |
| `update` | 194 | `UpdateDataModel(sys11_relate_file)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 199 | `UpdateDataModel(sys11_relate_file)` 동적 DELETE | `Ics01_Lookup_IcsFile`, `Tdm43_Page_Relate`, `Tdm45_TabPage_Relate` | `UpdateDataModel` |
