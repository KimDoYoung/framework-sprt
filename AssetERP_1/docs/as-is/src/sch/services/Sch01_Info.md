# sch.Sch01_Info

`server/sch/Sch01_Info.java`

서비스 키 `sch.Sch01_Info.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`sch01_info.selectById`](../../sch/sql/sch01_info.md) | `Sch01_Lookup_Info`, `Sch04_Lookup_SchList` |  |
| `selectByText` | 27 | [`sch01_info.selectByText`](../../sch/sql/sch01_info.md) | `Sch01_Tab_Info` |  |
| `selectByCloseDate` | 33 | [`sch01_info.selectByCloseDate`](../../sch/sql/sch01_info.md) | `Sch01_Tab_List` |  |
| `selectMyPageSchedule` | 39 | [`sch01_info.selectMyPageSchedule`](../../sch/sql/sch01_info.md) | `Monitoring_Page_Relate` |  |
| `selectMyPageSchedulePaging` | 45 | [`sch01_info.selectMyPageSchedulePaging`](../../sch/sql/sch01_info.md), [`sch01_info.selectMyPageSchedulePagingTotal`](../../sch/sql/sch01_info.md) | - |  |
| `selectMyPageOrgSchedule` | 51 | [`sch01_info.selectMyPageOrgSchedule`](../../sch/sql/sch01_info.md) | `Monitoring_Page_Relate` |  |
| `selectMyPageOrgSchedulePaging` | 57 | [`sch01_info.selectMyPageOrgSchedulePaging`](../../sch/sql/sch01_info.md), [`sch01_info.selectMyPageOrgSchedulePagingTotal`](../../sch/sql/sch01_info.md) | - |  |
| `selectByOrg` | 63 | [`sch01_info.selectByOrg`](../../sch/sql/sch01_info.md) | `Sch01_Tab_ListOrg` |  |
| `selectByDeadLineId` | 69 | [`sch01_info.selectByDeadLineId`](../../sch/sql/sch01_info.md) | `Sch01_Lookup_InfoView` |  |
| `selectByManagerId` | 75 | [`sch01_info.selectByManagerId`](../../sch/sql/sch01_info.md) | `Sch01_Lookup_ManagerModi` |  |
| `checkSchInfo` | 81 | [`sch04_list.checkSchInfo`](../../sch/sql/sch04_list.md) | `Sch01_Tab_Info` |  |
| `copySchedule` | 92 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch01_info.insertByInfoId`](../../sch/sql/sch01_info.md), [`sch01_info.selectByIdList`](../../sch/sql/sch01_info.md), [`sch01_info.updateUseYnByInfoId`](../../sch/sql/sch01_info.md), [`sch02_share.insertByInfoId`](../../sch/sql/sch02_share.md), [`sch03_deadline.insertByInfoId`](../../sch/sql/sch03_deadline.md), [`sch05_relate_ics.insertByInfoId`](../../sch/sql/sch05_relate_ics.md), [`sch06_alarm.insertByTargetId`](../../sch/sql/sch06_alarm.md), [`sch08_class.insertByClassId`](../../sch/sql/sch08_class.md) | `Sch01_Lookup_ManagerModiRun` | `Sys10_File` |
| `update` | 199 | `UpdateDataModel(sch01_info)` 동적 INSERT/UPDATE | `Sch01_Lookup_Info` | `UpdateDataModel` |
| `deleteByInfoId` | 207 | [`sch01_info.deleteByInfoId`](../../sch/sql/sch01_info.md) | `Sch01_Lookup_Info` |  |
| `delete` | 212 | `UpdateDataModel(sch01_info)` 동적 DELETE | `Sch01_Tab_Info` | `UpdateDataModel` |
