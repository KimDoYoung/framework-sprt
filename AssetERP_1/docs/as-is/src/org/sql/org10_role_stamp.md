# org10_role_stamp

`server/org/mapper/org10_role_stamp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`org10_role_stamp`](../../../db/tables/org.md) | `f_org_nm`, `f_sysdate` | `org.Org10_RoleStamp.selectById` |
| `selectByStampId` | select | 23 | [`org10_role_stamp`](../../../db/tables/org.md) | `f_org_nm`, `f_sysdate` | `org.Org10_RoleStamp.selectByStampId` |
| `checkRole` | select | 30 | [`apr10_stamp`](../../../db/tables/apr.md), [`org10_role_stamp`](../../../db/tables/org.md) |  | `org.Org10_RoleStamp.checkRole` |
| `insert` | insert | 53 | [`org10_role_stamp`](../../../db/tables/org.md) | `f_create_seq` | - |
| `deleteByStampId` | delete | 71 | [`org10_role_stamp`](../../../db/tables/org.md) |  | `org.Org10_RoleStamp.deleteByStampId` |
