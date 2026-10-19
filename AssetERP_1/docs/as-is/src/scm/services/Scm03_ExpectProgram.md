# scm.Scm03_ExpectProgram

`server/scm/Scm03_ExpectProgram.java`

서비스 키 `scm.Scm03_ExpectProgram.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`scm03_expect_program.selectById`](../../scm/sql/scm03_expect_program.md) | - |  |
| `selectBySrId` | 23 | [`scm03_expect_program.selectBySrId`](../../scm/sql/scm03_expect_program.md) | `Scm03_Grid_ExpectProgram`, `Scm03_Lookup_ExpectProgram` |  |
| `update` | 31 | `UpdateDataModel(scm03_expect_program)` 동적 INSERT/UPDATE | `Scm03_Grid_ExpectProgram` | `UpdateDataModel` |
| `delete` | 36 | `UpdateDataModel(scm03_expect_program)` 동적 DELETE | `Scm03_Grid_ExpectProgram` | `UpdateDataModel` |
