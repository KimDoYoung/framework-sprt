# tdm21_role_relate_task

`server/tdm/mapper/tdm21_role_relate_task.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm21_RoleRelateTask.selectById` |
| `selectByRoloId` | select | 32 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm21_RoleRelateTask.selectByRoloId` |
| `selectByRoloIdAndDate` | select | 46 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm21_RoleRelateTask.selectByRoloIdAndDate` |
