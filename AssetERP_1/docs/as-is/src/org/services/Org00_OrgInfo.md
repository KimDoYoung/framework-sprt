# org.Org00_OrgInfo

`server/org/Org00_OrgInfo.java`

서비스 키 `org.Org00_OrgInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByOrgCodeId` | 21 | [`org00_org_info.selectByOrgCodeId`](../../org/sql/org00_org_info.md) | `Crm01_Tab_ItemTreeGrid`, `Emp03_TabPage_Trans` |  |
| `selectByCheckParentId` | 35 | `org00_org_info.selectByCheckParentId`(없음) | - |  |
| `selectByKorName` | 53 | [`org00_org_info.selectByKorName`](../../org/sql/org00_org_info.md) | `Org00_Lookup_SelectMulti`, `Org00_Lookup_SelectSingle` |  |
| `selectByParentKorName` | 83 | [`org00_org_info.selectByParentKorName`](../../org/sql/org00_org_info.md) | `Org00_Lookup_SelectSingle` |  |
| `selectByScheduleOrg` | 104 | [`org00_org_info.selectByScheduleOrg`](../../org/sql/org00_org_info.md) | `Org00_Lookup_SelectSingle`, `ScheduleComboBox` |  |
| `selectByCheckAuthority` | 129 | [`org00_org_info.selectByCheckAuthority`](../../org/sql/org00_org_info.md) | - |  |
| `selectByIgnoreStamp` | 154 | [`org00_org_info.selectByIgnoreStamp`](../../org/sql/org00_org_info.md) | `Apr01_Tab_StampSeq` |  |
| `selectByTdmYn` | 167 | [`org00_org_info.selectByTdmYn`](../../org/sql/org00_org_info.md) | `Org00_Lookup_SelectTdm` |  |
