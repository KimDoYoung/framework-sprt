# ics.Ics02_Manager

`server/ics/Ics02_Manager.java`

서비스 키 `ics.Ics02_Manager.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`ics02_manager.selectById`](../../ics/sql/ics02_manager.md) | - |  |
| `selectByCompanyId` | 28 | [`ics02_manager.selectByCompanyId`](../../ics/sql/ics02_manager.md) | `Icr01_Lookup_Manager`, `Icr02_Lookup_Manager`, `Ics01_Lookup_Manager`, `Ics02_Lookup_Manager`, `Ics02_Tab_Manager` |  |
| `selectByIcsList` | 38 | [`ics02_manager.selectByIcsList`](../../ics/sql/ics02_manager.md) | `Ics02_Tab_IcsList` |  |
| `getDefaultYn` | 54 | [`ics02_manager.getDefaultYn`](../../ics/sql/ics02_manager.md) | `Icr01_Lookup_Share`, `Ics01_Lookup_Share` |  |
| `checkRelateIcs` | 64 | [`ics05_relate_manager.checkRelateIcs`](../../ics/sql/ics05_relate_manager.md) | `Ics02_Tab_Manager` |  |
| `insert` | 77 | [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`ics05_relate_manager.selectByManagerId`](../../ics/sql/ics05_relate_manager.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) | `Ics02_Tab_Manager` |  |
| `modelUpdate` | 140 | `UpdateDataModel(ics02_manager)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 148 | `UpdateDataModel(ics02_manager)` 동적 INSERT/UPDATE | `Icr01_Lookup_Manager`, `Ics01_Lookup_Manager`, `Ics02_Tab_Manager` | `UpdateDataModel` |
| `delete` | 153 | `UpdateDataModel(ics02_manager)` 동적 DELETE | `Ics02_Tab_Manager` | `UpdateDataModel` |
