# sys11_relate_file

`server/sys/mapper/sys11_relate_file.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys11_RelateFile.selectById` |
| `selectByParentId` | select | 25 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys11_RelateFile.selectByParentId` |
| `selectByAll` | select | 35 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys11_RelateFile.selectByAll` |
| `selectByIcsFileAll` | select | 43 | [`ics01_class_tree`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) | `f_ics_class_tree_nm_allpath` | `sys.Sys11_RelateFile.selectByIcsFileAll` |
| `selectBySeachText` | select | 54 | [`ics01_class_tree`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) | `f_ics_class_tree_nm_allpath` | `sys.Sys11_RelateFile.selectBySeachText` |
| `checkFileDelete01` | select | 65 | [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys11_RelateFile.checkFileDelete` |
| `checkFileDelete02` | select | 72 | [`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys11_RelateFile.checkFileDelete` |
| `checkFileDelete03` | select | 90 | [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys11_RelateFile.checkFileDelete` |
| `deleteRelateFile` | delete | 97 | [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys11_RelateFile.checkFileDelete` |
| `deleteByParentId` | delete | 104 | [`sys11_relate_file`](../../../db/tables/sys.md) |  | `tdm.Tdm43_Manl.delete` |
| `insertCheck` | select | 110 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys11_RelateFile.insert` |
| `insertByParentId` | insert | 120 | [`sys11_relate_file`](../../../db/tables/sys.md) | `f_create_seq` | `tdm.Tdm43_Manl.copyDutyList`, `tdm.Tdm43_Manl.copyManlList` |
| `insert` | insert | 131 | [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.copyFile`, `sys.Sys10_File.copyFileAdminYn`, `sys.Sys11_RelateFile.insert`, `sys.Sys11_RelateFile.insertTdmManlList` |
