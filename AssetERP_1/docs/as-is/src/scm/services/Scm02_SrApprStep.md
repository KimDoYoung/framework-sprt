# scm.Scm02_SrApprStep

`server/scm/Scm02_SrApprStep.java`

서비스 키 `scm.Scm02_SrApprStep.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`scm02_sr_appr_step.selectById`](../../scm/sql/scm02_sr_appr_step.md) | - |  |
| `selectBySrId` | 25 | [`scm02_sr_appr_step.selectBySrId`](../../scm/sql/scm02_sr_appr_step.md) | `Scm02_Grid_ApprStep` |  |
| `modelUpdate` | 37 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(scm02_sr_appr_step)` 동적 INSERT/UPDATE | `Scm01_Edit_Sr`, `Scm02_Edit_NoteMessage` | `UpdateDataModel` |
| `updateList` | 51 | [`scm02_sr_appr_step.deleteBySrId`](../../scm/sql/scm02_sr_appr_step.md), `UpdateDataModel(scm02_sr_appr_step)` 동적 INSERT/UPDATE | `Scm01_Edit_Sr` | `UpdateDataModel` |
| `update` | 63 | `UpdateDataModel(scm02_sr_appr_step)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 68 | `UpdateDataModel(scm02_sr_appr_step)` 동적 DELETE | - | `UpdateDataModel` |
