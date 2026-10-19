# scm.Scm13_DevProgram

`server/scm/Scm13_DevProgram.java`

서비스 키 `scm.Scm13_DevProgram.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`scm13_dev_program.selectById`](../../scm/sql/scm13_dev_program.md) | - |  |
| `selectByDevId` | 27 | [`scm13_dev_program.selectByDevId`](../../scm/sql/scm13_dev_program.md) | `Scm13_Grid_DevProgram`, `Scm13_Lookup_DevProgram` |  |
| `selectByDeployTgtDevId` | 32 | [`scm13_dev_program.selectByDeployTgtDevId`](../../scm/sql/scm13_dev_program.md) | `Scm13_Page_Deploy` |  |
| `modelUpdate` | 37 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`scm30_program.selectByProgramCode`](../../scm/sql/scm30_program.md), [`scm30_program.updateRegDate`](../../scm/sql/scm30_program.md), `UpdateDataModel(scm13_dev_program)` 동적 INSERT/UPDATE, `UpdateDataModel(scm30_program)` 동적 INSERT/UPDATE | `Scm13_Edit_DevProgram` | `UpdateDataModel` |
| `updateNote` | 105 | [`scm13_dev_program.updateNote`](../../scm/sql/scm13_dev_program.md) | `Scm13_Lookup_Note` |  |
| `updateDeploy` | 116 | [`scm13_dev_program.updateDeploy`](../../scm/sql/scm13_dev_program.md) | `Scm13_Page_Deploy` |  |
| `updateResultDeploy` | 132 | [`scm11_dev_step.updateResultDeploy`](../../scm/sql/scm11_dev_step.md) | `Scm13_Page_Deploy` |  |
| `update` | 137 | `UpdateDataModel(scm13_dev_program)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 142 | `UpdateDataModel(scm13_dev_program)` 동적 DELETE | `Scm13_Grid_DevProgram` | `UpdateDataModel` |
