# tdm.Tdm50_ChckJob

`server/tdm/Tdm50_ChckJob.java`

서비스 키 `tdm.Tdm50_ChckJob.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`tdm50_chck_job.selectById`](../../tdm/sql/tdm50_chck_job.md) | - |  |
| `selectByCheckYm` | 30 | [`tdm50_chck_job.selectByCheckYm`](../../tdm/sql/tdm50_chck_job.md) | `Tdm50_Tab_CheckJob`, `Tdm50_Tab_Dashboard`, `Tdm50_Tab_DashboardExct`, `Tdm50_Tab_DashboardOrg`, `Tdm51_Tab_CheckOrg`, `Tdm52_Tab_CheckManl` |  |
| `selectEndInfoByCheckerId` | 38 | `tdm50_chck_job.selectEndInfoByCheckerId`(없음) | - |  |
| `selectEndInfoByApprEmpId` | 43 | [`tdm50_chck_job.selectEndInfoByApprEmpId`](../../tdm/sql/tdm50_chck_job.md) | `Tdm59_Tab_CheckAppr` |  |
| `preCreateCheckManl` | 49 | [`tdm50_chck_job.selectCheckStatus`](../../tdm/sql/tdm50_chck_job.md) | `Tdm50_Tab_CheckJob` |  |
| `createCheckManl` | 82 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm42_manl_org.selectByStdDate`](../../tdm/sql/tdm42_manl_org.md), [`tdm50_chck_job.selectPreCheckYm`](../../tdm/sql/tdm50_chck_job.md), [`tdm51_chck_org.insert`](../../tdm/sql/tdm51_chck_org.md), [`tdm52_chck_manl.insertByTdm43`](../../tdm/sql/tdm52_chck_manl.md), [`tdm53_chck_exct.insertByTmd51`](../../tdm/sql/tdm53_chck_exct.md), [`tdm58_chck_appr_step.insertByTmd09`](../../tdm/sql/tdm58_chck_appr_step.md) | `Tdm50_Tab_CheckJob` |  |
| `updateEndYn` | 139 | [`tdm50_chck_job.updateEndYn`](../../tdm/sql/tdm50_chck_job.md), [`tdm51_chck_org.countUnCheckByChckJobId`](../../tdm/sql/tdm51_chck_org.md), [`tdm53_chck_exct.countUnLockByExctAppr`](../../tdm/sql/tdm53_chck_exct.md) | `Tdm50_Tab_CheckJob` |  |
| `deleteChckManl` | 161 | [`tdm51_chck_org.deleteChckManl`](../../tdm/sql/tdm51_chck_org.md), [`tdm52_chck_manl.deleteChckManl`](../../tdm/sql/tdm52_chck_manl.md), [`tdm53_chck_exct.deleteChckManl`](../../tdm/sql/tdm53_chck_exct.md), [`tdm58_chck_appr_step.deleteChckManl`](../../tdm/sql/tdm58_chck_appr_step.md) | `Tdm50_Tab_CheckJob` |  |
| `modelUpdate` | 176 | [`tdm50_chck_job.countCheckYm`](../../tdm/sql/tdm50_chck_job.md), [`tdm50_chck_job.selectById`](../../tdm/sql/tdm50_chck_job.md), `UpdateDataModel(tdm50_chck_job)` 동적 INSERT/UPDATE | `Tdm50_Edit_CheckJob` | `UpdateDataModel` |
| `update` | 200 | `UpdateDataModel(tdm50_chck_job)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 205 | `UpdateDataModel(tdm50_chck_job)` 동적 DELETE | - | `UpdateDataModel` |
