# tdm.Tdm09_ApprStep

`server/tdm/Tdm09_ApprStep.java`

서비스 키 `tdm.Tdm09_ApprStep.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm09_appr_step.selectById`](../../tdm/sql/tdm09_appr_step.md) | - |  |
| `selectByCompanyId` | 25 | [`tdm09_appr_step.selectByCompanyId`](../../tdm/sql/tdm09_appr_step.md) | `Tdm09_Tab_ApprStep` |  |
| `selectByParentId` | 30 | [`tdm09_appr_step.selectByParentId`](../../tdm/sql/tdm09_appr_step.md) | `Tdm09_Tab_ApprStep` |  |
| `inUpdateData` | 40 | [`tdm09_appr_step.modelUpsert`](../../tdm/sql/tdm09_appr_step.md) | `Tdm09_Tab_ApprStep` |  |
| `modelUpdate` | 62 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm09_appr_step)` 동적 INSERT/UPDATE | `Tdm09_Tab_ApprStep` | `UpdateDataModel` |
| `update` | 75 | [`tdm09_appr_step.updateByParentId`](../../tdm/sql/tdm09_appr_step.md), `UpdateDataModel(tdm09_appr_step)` 동적 INSERT/UPDATE | `Tdm09_Tab_ApprStep` | `UpdateDataModel` |
| `deleteByParentId` | 85 | [`tdm09_appr_step.deleteByParentId`](../../tdm/sql/tdm09_appr_step.md), `UpdateDataModel(tdm09_appr_step)` 동적 DELETE | `Tdm09_Tab_ApprStep` | `UpdateDataModel` |
| `delete` | 94 | `UpdateDataModel(tdm09_appr_step)` 동적 DELETE | `Tdm09_Tab_ApprStep` | `UpdateDataModel` |
