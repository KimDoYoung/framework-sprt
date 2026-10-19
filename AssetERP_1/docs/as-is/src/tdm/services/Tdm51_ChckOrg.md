# tdm.Tdm51_ChckOrg

`server/tdm/Tdm51_ChckOrg.java`

서비스 키 `tdm.Tdm51_ChckOrg.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | [`tdm51_chck_org.selectById`](../../tdm/sql/tdm51_chck_org.md) | - |  |
| `selectByOrgId` | 29 | [`tdm51_chck_org.selectByOrgId`](../../tdm/sql/tdm51_chck_org.md) | `Tdm51_Tab_CheckOrg`, `Tdm52_Tab_CheckManl` |  |
| `selectByRoleId` | 35 | [`tdm51_chck_org.selectByRoleId`](../../tdm/sql/tdm51_chck_org.md) | `Tdm50_TabPage_CheckJob` |  |
| `selectApprContent` | 46 | [`tdm51_chck_org.selectApprContent`](../../tdm/sql/tdm51_chck_org.md) | `Apr01_Edit_ApprDoc` |  |
| `selectDashboardProgress` | 56 | [`tdm51_chck_org.selectDashboardProgress`](../../tdm/sql/tdm51_chck_org.md) | `Tdm50_Tab_Dashboard`, `Tdm50_Tab_DashboardExct`, `Tdm50_Tab_DashboardOrg` |  |
| `selectDashboardExct` | 69 | [`tdm51_chck_org.selectDashboardExct`](../../tdm/sql/tdm51_chck_org.md) | `Tdm50_Tab_Dashboard`, `Tdm50_Tab_DashboardExct` |  |
| `selectDashboardOrg` | 81 | [`tdm51_chck_org.selectDashboardOrg`](../../tdm/sql/tdm51_chck_org.md) | `Tdm50_Tab_Dashboard`, `Tdm50_Tab_DashboardExct` |  |
| `getMessageList` | 93 | [`tdm51_chck_org.getMessageList`](../../tdm/sql/tdm51_chck_org.md) | `Tdm50_Tab_CheckJob` |  |
| `getTdmOrgId` | 98 | [`tdm51_chck_org.getTdmOrgId`](../../tdm/sql/tdm51_chck_org.md) | `Tdm54_Lookup_ChckInsuff` |  |
| `updateFix` | 103 | [`tdm52_chck_manl.countCheckerIdIsNull`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateCheckStatusByChckOrgId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm58_chck_appr_step.checkLastApprEmp`](../../tdm/sql/tdm58_chck_appr_step.md), [`tdm59_chck_appr_cmnt.createTdm59`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm60_chck_manl_appr.deleteByChckOrgId`](../../tdm/sql/tdm60_chck_manl_appr.md), [`tdm60_chck_manl_appr.insertByTdm58`](../../tdm/sql/tdm60_chck_manl_appr.md) | `Tdm51_TabPage_CheckOrg` |  |
| `updateApprStatus` | 173 | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.selectByCheckStatusCode`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateCheckStatusById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.selectApprTarget`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm54_chck_insuff.updateStatusCode2`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm58_chck_appr_step.selectApprStep`](../../tdm/sql/tdm58_chck_appr_step.md), [`tdm59_chck_appr_cmnt.selectByApprOrgId`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateApprStatus`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateApprStatusBySubCheckOrg`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm60_chck_manl_appr.updateApprStatusByChckOrgId`](../../tdm/sql/tdm60_chck_manl_appr.md), [`tdm61_chck_insuff_appr.deleteByChckInsuffId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm61_chck_insuff_appr.deleteByChckOrgId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm61_chck_insuff_appr.insertByTdm58`](../../tdm/sql/tdm61_chck_insuff_appr.md) | `Tdm51_Tab_CheckOrg` |  |
| `update` | 405 | `UpdateDataModel(tdm51_chck_org)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 410 | `UpdateDataModel(tdm51_chck_org)` 동적 DELETE | - | `UpdateDataModel` |
