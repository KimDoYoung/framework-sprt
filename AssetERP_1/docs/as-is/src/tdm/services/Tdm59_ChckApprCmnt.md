# tdm.Tdm59_ChckApprCmnt

`server/tdm/Tdm59_ChckApprCmnt.java`

서비스 키 `tdm.Tdm59_ChckApprCmnt.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`tdm59_chck_appr_cmnt.selectById`](../../tdm/sql/tdm59_chck_appr_cmnt.md) | - |  |
| `selectByApprEmpId` | 26 | [`tdm59_chck_appr_cmnt.selectByApprEmpId`](../../tdm/sql/tdm59_chck_appr_cmnt.md) | `Tdm59_Tab_CheckAppr` |  |
| `selectPreNextOrg` | 31 | [`tdm59_chck_appr_cmnt.selectChild`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.selectParent`](../../tdm/sql/tdm59_chck_appr_cmnt.md) | `Tdm59_Tab_CheckAppr` |  |
| `updateApprCmnt` | 53 | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm51_chck_org.selectUnCheckOrg`](../../tdm/sql/tdm51_chck_org.md), [`tdm52_chck_manl.countByChckApprCmntId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.countByChckApprCmntId`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm59_chck_appr_cmnt.selectChild`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.selectChildApprYn`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateByApprInfo`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateSubmit`](../../tdm/sql/tdm59_chck_appr_cmnt.md) | `Tdm59_Edit_Cmnt`, `Tdm59_Edit_ReportCmnt` | `Tdm91_CompanySetup` |
| `updateSubmit` | 301 | [`tdm53_chck_exct.updateExctApprYn`](../../tdm/sql/tdm53_chck_exct.md), [`tdm59_chck_appr_cmnt.checkTdmSubmitPossibleYn`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.countChild`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.selectChild`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.selectParent`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateApprStatus`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateSubmit`](../../tdm/sql/tdm59_chck_appr_cmnt.md) | `Tdm59_Tab_CheckAppr` |  |
| `update` | 424 | `UpdateDataModel(tdm59_chck_appr_cmnt)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 429 | `UpdateDataModel(tdm59_chck_appr_cmnt)` 동적 DELETE | - | `UpdateDataModel` |
