# scm.Scm10_Dev

`server/scm/Scm10_Dev.java`

서비스 키 `scm.Scm10_Dev.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`scm10_dev.selectById`](../../scm/sql/scm10_dev.md) | - |  |
| `selectByText` | 27 | [`scm10_dev.selectByText`](../../scm/sql/scm10_dev.md) | `Scm10_Tab_Dev` |  |
| `selectBySrId` | 42 | [`scm10_dev.selectBySrId`](../../scm/sql/scm10_dev.md) | `Scm10_Grid_Dev` |  |
| `updateList` | 50 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`scm11_dev_step.checkDevStep`](../../scm/sql/scm11_dev_step.md), [`scm12_dev_step_rule.getList`](../../scm/sql/scm12_dev_step_rule.md), `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE, `UpdateDataModel(scm10_dev)` 동적 INSERT/UPDATE | `Scm10_Grid_Dev` | `UpdateDataModel` |
| `update` | 91 | `UpdateDataModel(scm10_dev)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 96 | `UpdateDataModel(scm10_dev)` 동적 DELETE | `Scm10_Grid_Dev` | `UpdateDataModel` |
