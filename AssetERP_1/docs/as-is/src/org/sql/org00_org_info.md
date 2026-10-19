# org00_org_info

`server/org/mapper/org00_org_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 33 | [`org00_org_info`](../../../db/views.md) |  | - |
| `selectByCompanyId` | select | 39 | [`org00_org_info`](../../../db/views.md) |  | - |
| `selectByKorName` | select | 51 | [`org00_org_info`](../../../db/views.md) | `f_cdnm` | `ast.Ast01_ClassTree.pullData`, `org.Org00_OrgInfo.selectByKorName` |
| `selectByParentKorName` | select | 65 | [`org00_org_info`](../../../db/views.md) |  | `org.Org00_OrgInfo.selectByParentKorName` |
| `selectByScheduleOrg` | select | 88 | [`org00_org_info`](../../../db/views.md) |  | `org.Org00_OrgInfo.selectByScheduleOrg` |
| `selectByOrgCode` | select | 126 | [`org00_org_info`](../../../db/views.md) |  | - |
| `selectByOrgCodeId` | select | 138 | [`org00_org_info`](../../../db/views.md) |  | `org.Org00_OrgInfo.selectByOrgCodeId` |
| `selectCountByCodeId` | select | 149 | [`org02_info`](../../../db/tables/org.md) |  | - |
| `selectByParentId` | select | 155 | [`org00_org_info`](../../../db/views.md) |  | `sys.Sys02_User.getLoginInfo`, `sys.Sys02_User.getMobiLoginInfo` |
| `selectByIgnoreStamp` | select | 175 | [`org00_org_info`](../../../db/views.md) |  | `org.Org00_OrgInfo.selectByIgnoreStamp` |
| `selectByCheckAuthority` | select | 182 | [`org00_org_info`](../../../db/views.md) |  | `org.Org00_OrgInfo.selectByCheckAuthority` |
| `selectByTdmYn` | select | 241 | [`tdm23_role_relate_org`](../../../db/tables/tdm.md) | `getorg`, `getsuborg` | `org.Org00_OrgInfo.selectByTdmYn` |
