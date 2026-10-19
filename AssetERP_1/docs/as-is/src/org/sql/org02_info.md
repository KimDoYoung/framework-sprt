# org02_info

`server/org/mapper/org02_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 33 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm` | `org.Org01_Code.update` |
| `selectCountByCodeId` | select | 42 | [`org02_info`](../../../db/tables/org.md) |  | `org.Org01_Code.delete` |
| `selectByOrgCodeId` | select | 48 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm` | - |
| `selectByParentId` | select | 61 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_org_parent_info_id` | - |
| `selectByOnlyOrgCodeId` | select | 81 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm` | `org.Org02_Info.selectByOnlyOrgCodeId` |
| `deleteOrgCheck` | select | 94 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) |  | `org.Org02_Info.deleteCheck` |
| `insertOrg02Info` | insert | 101 | [`org02_info`](../../../db/tables/org.md) |  | - |
| `deleteOrg` | delete | 135 | [`org02_info`](../../../db/tables/org.md) |  | `org.Org02_Info.deleteOrg` |
