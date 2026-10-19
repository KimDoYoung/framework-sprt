# tdm35_role_allc_task

`server/tdm/mapper/tdm35_role_allc_task.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`tdm35_role_allc_task`](../../../db/tables/tdm.md) |  | `tdm.Tdm35_RoleAllcTask.selectById` |
| `selectTask` | select | 32 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md) |  | `tdm.Tdm35_RoleAllcTask.selectTask` |
| `selectTaskDetail` | select | 67 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md) |  | `tdm.Tdm35_RoleAllcTask.selectTaskDetail` |
| `selectByDate` | select | 101 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md) | `getperson`, `gettdm30roleallc` | `tdm.Tdm35_RoleAllcTask.selectByDate` |
| `insertByRoleAllcDetailId` | update | 116 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm34_RoleAllcDetail.updateApprId`, `tdm.Tdm35_RoleAllcTask.deleteInsert` |
| `deleteByRoleAllcDetailId` | delete | 145 | [`tdm35_role_allc_task`](../../../db/tables/tdm.md) |  | `tdm.Tdm34_RoleAllcDetail.updateApprId`, `tdm.Tdm35_RoleAllcTask.deleteInsert` |
