# scm.Scm30_Program

`server/scm/Scm30_Program.java`

서비스 키 `scm.Scm30_Program.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`scm30_program.selectById`](../../scm/sql/scm30_program.md) | - |  |
| `selectByCompanyId` | 26 | [`scm30_program.selectByCompanyId`](../../scm/sql/scm30_program.md) | - |  |
| `selectByPaging` | 40 | [`scm30_program.selectByCompanyIdPaging`](../../scm/sql/scm30_program.md), [`scm30_program.selectByCompanyIdTotal`](../../scm/sql/scm30_program.md) | `Scm30_Tab_Program` |  |
| `selectByText` | 46 | [`scm30_program.selectByText`](../../scm/sql/scm30_program.md) | - |  |
| `selectByTextPaging` | 58 | [`scm30_program.selectByTextPaging`](../../scm/sql/scm30_program.md), [`scm30_program.selectByTextPagingTotal`](../../scm/sql/scm30_program.md) | `Scm30_Lookup_SelectMulti` |  |
| `selectBySystemCode` | 64 | [`scm30_program.selectBySystemCode`](../../scm/sql/scm30_program.md) | `Scm30_Lookup_Program` |  |
| `updateUseYn` | 77 | [`scm30_program.updateUseYn`](../../scm/sql/scm30_program.md) | `Scm13_Grid_DevProgram` |  |
| `modelUpdate` | 86 | [`scm30_program.selectById`](../../scm/sql/scm30_program.md), [`scm30_program.selectByProgramCode`](../../scm/sql/scm30_program.md), [`scm30_program.updateRegDate`](../../scm/sql/scm30_program.md), `UpdateDataModel(scm30_program)` 동적 INSERT/UPDATE | `Scm30_Edit_Program` | `UpdateDataModel` |
| `update` | 143 | `UpdateDataModel(scm30_program)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 148 | `UpdateDataModel(scm30_program)` 동적 DELETE | - | `UpdateDataModel` |
