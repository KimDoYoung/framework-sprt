# tdm.Tdm08_ManagerInfo

`server/tdm/Tdm08_ManagerInfo.java`

서비스 키 `tdm.Tdm08_ManagerInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`tdm08_manager_info.selectById`](../../tdm/sql/tdm08_manager_info.md) | - |  |
| `selectByCompanyId` | 23 | [`tdm08_manager_info.selectByCompanyId`](../../tdm/sql/tdm08_manager_info.md) | `Tdm08_Tab_Manager` |  |
| `selectByManagerType` | 32 | [`tdm08_manager_info.selectByManagerType`](../../tdm/sql/tdm08_manager_info.md) | `Tdm08_Lookup_ManagerInfo`, `Tdm08_Tab_Manager` |  |
| `checkIsManager` | 42 | [`tdm08_manager_info.checkIsManager`](../../tdm/sql/tdm08_manager_info.md) | `Tdm43_Tab_ManlItemReg`, `Tdm50_Tab_DashboardExct`, `Tdm50_Tab_DashboardOrg`, `Tdm51_Tab_CheckOrg`, `Tdm52_Tab_CheckManl` |  |
| `update` | 51 | `UpdateDataModel(tdm08_manager_info)` 동적 INSERT/UPDATE | `Tdm08_Lookup_ManagerInfo`, `Tdm08_Tab_Manager` | `UpdateDataModel` |
| `delete` | 56 | `UpdateDataModel(tdm08_manager_info)` 동적 DELETE | `Tdm08_Lookup_ManagerInfo`, `Tdm08_Tab_Manager` | `UpdateDataModel` |
