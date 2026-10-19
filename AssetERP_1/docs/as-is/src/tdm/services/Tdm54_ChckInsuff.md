# tdm.Tdm54_ChckInsuff

`server/tdm/Tdm54_ChckInsuff.java`

서비스 키 `tdm.Tdm54_ChckInsuff.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`tdm54_chck_insuff.selectById`](../../tdm/sql/tdm54_chck_insuff.md) | `Tdm54_Lookup_ChckInsuffCmnt` |  |
| `selectByChckManlId` | 28 | [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md) | `Tdm54_Edit_ChckInsuff`, `Tdm54_Edit_ChckInsuffCmnt` |  |
| `selectByRegDate` | 33 | [`tdm54_chck_insuff.selectByRegDate`](../../tdm/sql/tdm54_chck_insuff.md) | `Tdm54_Tab_CheckInsuff` |  |
| `selectByChckApprCmntId` | 38 | [`tdm54_chck_insuff.selectByChckApprCmntId`](../../tdm/sql/tdm54_chck_insuff.md) | `Tdm59_TabPage_CheckAppr` |  |
| `selectDashboardInsuff` | 43 | [`tdm54_chck_insuff.selectDashboardInsuff`](../../tdm/sql/tdm54_chck_insuff.md) | `Tdm50_Tab_Dashboard`, `Tdm50_Tab_DashboardExct`, `Tdm50_Tab_DashboardOrg` |  |
| `modelUpdate` | 54 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), `UpdateDataModel(tdm54_chck_insuff)` 동적 INSERT/UPDATE | `Tdm54_Edit_ChckInsuff`, `Tdm54_Edit_ChckInsuffCmnt` | `UpdateDataModel` |
| `updateComplete` | 88 | [`tdm54_chck_insuff.selectPossibleYn`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm61_chck_insuff_appr.selectByChckInsuffId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm63_chck_insuff_record.countEvid`](../../tdm/sql/tdm63_chck_insuff_record.md), [`tdm91_company_setup.selectByDate`](../../tdm/sql/tdm91_company_setup.md), `UpdateDataModel(tdm54_chck_insuff)` 동적 INSERT/UPDATE | `Tdm54_Lookup_ChckInsuff` | `Tdm91_CompanySetup`, `UpdateDataModel` |
| `update` | 175 | `UpdateDataModel(tdm54_chck_insuff)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 180 | `UpdateDataModel(tdm54_chck_insuff)` 동적 DELETE | - | `UpdateDataModel` |
