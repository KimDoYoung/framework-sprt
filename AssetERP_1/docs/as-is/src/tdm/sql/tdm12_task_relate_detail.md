# tdm12_task_relate_detail

`server/tdm/mapper/tdm12_task_relate_detail.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 23 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md) |  | `tdm.Tdm12_TaskRelateDetail.selectById` |
| `selectByTaskId` | select | 42 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md) |  | `tdm.Tdm12_TaskRelateDetail.selectByTaskId` |
| `selectByText` | select | 62 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md) |  | `tdm.Tdm12_TaskRelateDetail.selectByText` |
| `getHtmlData` | select | 93 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md) |  | `tdm.Tdm12_TaskRelateDetail.getHtmlData`, `tdm.Tdm30_RoleAllc.insertAppr` |
| `countByTaskDetailId` | select | 107 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md) |  | `tdm.Tdm12_TaskRelateDetail.countByTaskDetailId`, `tdm.Tdm12_TaskRelateDetail.delete` |
