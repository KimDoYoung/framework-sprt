# sys92_management_team

`server/sys/mapper/sys92_management_team.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys92_management_team`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys92_ManagementTeam.selectById` |
| `selectByAll` | select | 53 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys92_management_team`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys92_ManagementTeam.selectByAll` |
