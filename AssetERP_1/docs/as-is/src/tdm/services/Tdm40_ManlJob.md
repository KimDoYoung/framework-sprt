# tdm.Tdm40_ManlJob

`server/tdm/Tdm40_ManlJob.java`

서비스 키 `tdm.Tdm40_ManlJob.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`tdm40_manl_job.selectById`](../../tdm/sql/tdm40_manl_job.md) | - |  |
| `selectByText` | 24 | [`tdm40_manl_job.selectByText`](../../tdm/sql/tdm40_manl_job.md) | `Tdm40_Lookup_SelectMulti`, `Tdm40_Lookup_SelectSingle`, `Tdm40_Tab_ManlJob`, `Tdm41_Tab_ManlDutyOrg`, `Tdm43_Tab_ManlItemReg` |  |
| `deleteAll` | 44 | [`tdm41_manl_duty.deleteByManlJobId`](../../tdm/sql/tdm41_manl_duty.md), [`tdm42_manl_org.deleteByManlJobId`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.deleteByManlJobId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.deleteByManlJobId`](../../tdm/sql/tdm44_manl_duty_org.md) | `Tdm40_Tab_ManlJob` |  |
| `createDuty` | 55 | [`tdm40_manl_job.createDuty`](../../tdm/sql/tdm40_manl_job.md), [`tdm44_manl_duty_org.createDutyOrg`](../../tdm/sql/tdm44_manl_duty_org.md) | `Tdm40_Tab_ManlJob` |  |
| `createDirectManl` | 76 | [`tdm40_manl_job.createDirectManl`](../../tdm/sql/tdm40_manl_job.md) | `Tdm40_Tab_ManlJob` |  |
| `update` | 102 | `UpdateDataModel(tdm40_manl_job)` 동적 INSERT/UPDATE | `Tdm40_Tab_ManlJob` | `UpdateDataModel` |
| `delete` | 107 | `UpdateDataModel(tdm40_manl_job)` 동적 DELETE | `Tdm40_Tab_ManlJob` | `UpdateDataModel` |
