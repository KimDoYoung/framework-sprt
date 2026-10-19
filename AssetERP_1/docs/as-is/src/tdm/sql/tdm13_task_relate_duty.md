# tdm13_task_relate_duty

`server/tdm/mapper/tdm13_task_relate_duty.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md) |  | `tdm.Tdm13_TaskRelateDuty.selectById` |
| `selectByTaskRelateDetailId` | select | 30 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md) |  | `tdm.Tdm13_TaskRelateDuty.selectByTaskRelateDetailId` |
| `countByDutyId` | select | 41 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md) |  | `tdm.Tdm13_TaskRelateDuty.countByDutyId`, `tdm.Tdm13_TaskRelateDuty.delete` |
