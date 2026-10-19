# tdm.Tdm43_Manl

`server/tdm/Tdm43_Manl.java`

서비스 키 `tdm.Tdm43_Manl.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) | `Tdm45_TabPage_Relate`, `Tdm52_Edit_ChckManl`, `Tdm52_Edit_ChckManlCmnt` |  |
| `selectByManlDutyId` | 25 | [`tdm43_manl.selectByManlDutyId`](../../tdm/sql/tdm43_manl.md) | `Tdm43_TabPage_ManlItemReg` |  |
| `selectByText` | 34 | [`tdm43_manl.selectByText`](../../tdm/sql/tdm43_manl.md) | - |  |
| `selectByRoleId` | 43 | [`tdm43_manl.selectByRoleId`](../../tdm/sql/tdm43_manl.md) | `Tdm43_Lookup_ManlItemRegList` |  |
| `selectByTaskRelateDutyId` | 48 | [`tdm43_manl.selectByTaskRelateDutyId`](../../tdm/sql/tdm43_manl.md) | `Tdm43_Lookup_ManlItemRegList`, `Tdm43_Lookup_ManlItemRegList2` |  |
| `selectByManlOrgId` | 53 | [`tdm43_manl.selectByManlOrgId`](../../tdm/sql/tdm43_manl.md) | `Tdm43_Lookup_ManlItem` |  |
| `selectByDate` | 58 | [`tdm43_manl.selectByDate`](../../tdm/sql/tdm43_manl.md) | `Tdm43_Tab_ManlItemList` |  |
| `selectByExceptIcsId` | 63 | [`tdm43_manl.selectByExceptIcsId`](../../tdm/sql/tdm43_manl.md) | `Ics01_Lookup_SelectTdm` |  |
| `selectByManlJobId` | 68 | [`tdm43_manl.selectByManlJobId`](../../tdm/sql/tdm43_manl.md) | `Tdm43_Lookup_ManlItemRegList2` |  |
| `countByManlJobId` | 73 | [`tdm43_manl.countByManlJobId`](../../tdm/sql/tdm43_manl.md) | `Tdm40_Tab_ManlJob` |  |
| `copyManlList` | 79 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insertByParentId`](../../sys/sql/sys11_relate_file.md), [`tdm43_manl.checkByManlCode`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.insertByManlId`](../../tdm/sql/tdm43_manl.md), [`tdm45_manl_relate_ics.insertByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md), [`tdm46_manl_relate_icr.insertByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md), [`tdm47_manl_relate_dcr.insertByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) | `Tdm43_TabPage_ManlItemReg` |  |
| `copyDutyList` | 144 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insertByParentId`](../../sys/sql/sys11_relate_file.md), [`tdm43_manl.checkByManlCode`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.getNewManlCode`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.insertByModel`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.selectByDutyId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.updateEndYn`](../../tdm/sql/tdm44_manl_duty_org.md), [`tdm45_manl_relate_ics.insertByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md), [`tdm46_manl_relate_icr.insertByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md), [`tdm47_manl_relate_dcr.insertByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) | `Tdm43_Tab_ManlItemReg` |  |
| `modelUpdate` | 230 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm43_manl.getNewManlCode`](../../tdm/sql/tdm43_manl.md), `UpdateDataModel(tdm45_manl_relate_ics)` 동적 INSERT/UPDATE, `UpdateDataModel(tdm46_manl_relate_icr)` 동적 INSERT/UPDATE, `UpdateDataModel(sys11_relate_file)` 동적 INSERT/UPDATE, `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 INSERT/UPDATE, `UpdateDataModel(tdm43_manl)` 동적 INSERT/UPDATE | `Tdm43_Edit_Manl`, `Tdm43_Edit_Manl_20260309` | `UpdateDataModel` |
| `updateRefBasis` | 287 | [`tdm43_manl.updateRefBasis`](../../tdm/sql/tdm43_manl.md) | `Tdm43_Lookup_RefBasis` |  |
| `updateEtc` | 292 | [`tdm43_manl.selectByDate`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.updateEtc`](../../tdm/sql/tdm43_manl.md) | `Tdm43_Lookup_EtcModify` |  |
| `update` | 316 | `UpdateDataModel(tdm43_manl)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 321 | [`sys11_relate_file.deleteByParentId`](../../sys/sql/sys11_relate_file.md), [`tdm45_manl_relate_ics.deleteByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md), [`tdm46_manl_relate_icr.deleteByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md), [`tdm47_manl_relate_dcr.deleteByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md), `UpdateDataModel(tdm43_manl)` 동적 DELETE | `Tdm43_Lookup_ManlItem`, `Tdm43_TabPage_ManlItemReg` | `UpdateDataModel` |
