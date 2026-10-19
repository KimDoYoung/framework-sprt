# tdm.Tdm60_ChckManlAppr

`server/tdm/Tdm60_ChckManlAppr.java`

서비스 키 `tdm.Tdm60_ChckManlAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`tdm60_chck_manl_appr.selectById`](../../tdm/sql/tdm60_chck_manl_appr.md) | - |  |
| `updateApprCmnt` | 26 | [`tdm60_chck_manl_appr.updateById`](../../tdm/sql/tdm60_chck_manl_appr.md) | `Tdm52_Edit_ChckManlCmnt` |  |
| `updateApprStatus` | 39 | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.updateCheckStatusById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm60_chck_manl_appr.updateById`](../../tdm/sql/tdm60_chck_manl_appr.md) | `Tdm52_Edit_ChckManlCmnt` |  |
| `updateApprStatus2` | 141 | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.updateCheckStatusById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm60_chck_manl_appr.updateById`](../../tdm/sql/tdm60_chck_manl_appr.md) | `Tdm59_TabPage_CheckAppr` |  |
| `update` | 218 | `UpdateDataModel(tdm60_chck_manl_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 223 | `UpdateDataModel(tdm60_chck_manl_appr)` 동적 DELETE | - | `UpdateDataModel` |
