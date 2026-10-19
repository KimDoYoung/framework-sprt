# tdm10_task

`server/tdm/mapper/tdm10_task.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm10_Task.selectById` |
| `selectByText` | select | 56 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm10_Task.selectByText` |
| `countUseByTaskId` | select | 104 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md) |  | `tdm.Tdm10_Task.countUseByTaskId`, `tdm.Tdm10_Task.delete` |
| `createCopy` | select | 124 | - | `f_create_tdm10copy` | `tdm.Tdm10_Task.modelUpdate` |
