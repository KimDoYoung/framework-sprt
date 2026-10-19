# tdm.Tdm42_ManlOrg

`server/tdm/Tdm42_ManlOrg.java`

서비스 키 `tdm.Tdm42_ManlOrg.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`tdm42_manl_org.selectById`](../../tdm/sql/tdm42_manl_org.md) | - |  |
| `selectByText` | 27 | [`tdm42_manl_org.selectByText`](../../tdm/sql/tdm42_manl_org.md) | `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlManagerAdmin`, `Tdm42_Tab_ManlOrgAppr` |  |
| `notManlOrgList` | 48 | [`tdm42_manl_org.notManlOrgList`](../../tdm/sql/tdm42_manl_org.md) | `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlOrgAppr` |  |
| `confirmChk` | 60 | [`tdm41_manl_duty.countNullOrgId`](../../tdm/sql/tdm41_manl_duty.md), [`tdm42_manl_org.confirmChk`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.countByManlJobId`](../../tdm/sql/tdm43_manl.md) | `Tdm41_Tab_ManlDutyOrg` |  |
| `updateApprId` | 143 | [`tdm42_manl_org.updateApprId`](../../tdm/sql/tdm42_manl_org.md) | `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlOrgAppr` |  |
| `insertManlOrg` | 153 | [`tdm40_manl_job.selectSimpleById`](../../tdm/sql/tdm40_manl_job.md), [`tdm42_manl_org.insertByManlJobId`](../../tdm/sql/tdm42_manl_org.md) | `Tdm41_Tab_ManlDutyOrg` |  |
| `deleteByManlJobId` | 203 | [`tdm42_manl_org.deleteByManlJobId`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.deleteByManlJobId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.clearEndYn`](../../tdm/sql/tdm44_manl_duty_org.md) | `Tdm41_Tab_ManlDutyOrg` |  |
| `updateLock` | 216 | [`tdm42_manl_org.updateLockYn`](../../tdm/sql/tdm42_manl_org.md) | `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlOrgAppr` |  |
| `fileCheck` | 246 | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlManagerAdmin`, `Tdm42_Tab_ManlOrgAppr` | `File` |
| `update` | 259 | `UpdateDataModel(tdm42_manl_org)` 동적 INSERT/UPDATE | `Tdm42_Tab_ManlManager`, `Tdm42_Tab_ManlOrgAppr` | `UpdateDataModel` |
| `delete` | 264 | `UpdateDataModel(tdm42_manl_org)` 동적 DELETE | - | `UpdateDataModel` |
