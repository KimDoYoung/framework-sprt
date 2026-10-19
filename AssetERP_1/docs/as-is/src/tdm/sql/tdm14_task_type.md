# tdm14_task_type

`server/tdm/mapper/tdm14_task_type.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`tdm14_task_type`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today` | `tdm.Tdm14_TaskType.delete`, `tdm.Tdm14_TaskType.selectById` |
| `selectByCompanyId` | select | 31 | [`tdm14_task_type`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today` | `tdm.Tdm14_TaskType.selectByCompanyId` |
| `selectTaskTypeCode` | select | 49 | [`tdm14_task_type`](../../../db/tables/tdm.md) |  | `tdm.Tdm14_TaskType.update` |
| `countDupByTaskTypeCode` | select | 55 | [`tdm14_task_type`](../../../db/tables/tdm.md) |  | `tdm.Tdm14_TaskType.update` |
| `countUseByTaskTypeCode` | select | 63 | [`tdm10_task`](../../../db/tables/tdm.md) |  | `tdm.Tdm14_TaskType.delete`, `tdm.Tdm14_TaskType.update` |
