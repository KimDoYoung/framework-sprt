# tdm.Tdm41_ManlDuty

`server/tdm/Tdm41_ManlDuty.java`

서비스 키 `tdm.Tdm41_ManlDuty.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm41_manl_duty.selectById`](../../tdm/sql/tdm41_manl_duty.md) | - |  |
| `selectByManlJobId` | 25 | [`tdm41_manl_duty.selectByManlJobId`](../../tdm/sql/tdm41_manl_duty.md) | `Tdm40_Tab_ManlJob` |  |
| `selectByTextPaging` | 33 | [`tdm41_manl_duty.selectByTextPaging`](../../tdm/sql/tdm41_manl_duty.md), [`tdm41_manl_duty.selectByTextPagingTotal`](../../tdm/sql/tdm41_manl_duty.md) | `Tdm41_TabPage_ManlDutyOrg` |  |
| `selectByOrgIdPaging` | 40 | [`tdm41_manl_duty.selectByOrgIdPaging`](../../tdm/sql/tdm41_manl_duty.md), [`tdm41_manl_duty.selectByOrgIdPagingTotal`](../../tdm/sql/tdm41_manl_duty.md) | `Tdm43_Tab_ManlItemReg` |  |
| `selectTaskAndOrg` | 47 | [`tdm41_manl_duty.selectTaskAndOrg`](../../tdm/sql/tdm41_manl_duty.md) | `Tdm41_Lookup_ChangeOrg_Tmp` |  |
| `groupByManlJobId` | 52 | [`tdm41_manl_duty.groupByManlJobId`](../../tdm/sql/tdm41_manl_duty.md) | `Tdm41_Tab_ManlDutyOrg` |  |
| `updateOrgCodeId` | 57 | `tdm41_manl_duty.updateOrgCodeId`(없음) | - |  |
| `changeOrgId` | 67 | [`tdm42_manl_org.countLockByRoleId`](../../tdm/sql/tdm42_manl_org.md), [`tdm42_manl_org.updateOrgId`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.updateOrgId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.updateOrgId`](../../tdm/sql/tdm44_manl_duty_org.md) | - |  |
| `changeOrgId2` | 96 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm42_manl_org.countLockByRoleId`](../../tdm/sql/tdm42_manl_org.md), [`tdm42_manl_org.deleteByTdm43`](../../tdm/sql/tdm42_manl_org.md), [`tdm42_manl_org.insert`](../../tdm/sql/tdm42_manl_org.md), [`tdm42_manl_org.selectByNewOrgId`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.updateOrgIdByTaskId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.updateOrgIdByTaskId`](../../tdm/sql/tdm44_manl_duty_org.md) | `Tdm41_Lookup_ChangeOrg_Tmp` |  |
| `updateEndYn` | 156 | [`tdm42_manl_org.selectById`](../../tdm/sql/tdm42_manl_org.md), [`tdm44_manl_duty_org.updateEndYn`](../../tdm/sql/tdm44_manl_duty_org.md) | `Tdm43_TabPage_ManlItemReg` |  |
| `update` | 185 | `UpdateDataModel(tdm41_manl_duty)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 190 | `UpdateDataModel(tdm41_manl_duty)` 동적 DELETE | - | `UpdateDataModel` |
