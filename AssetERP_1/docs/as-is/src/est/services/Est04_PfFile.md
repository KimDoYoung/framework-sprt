# est.Est04_PfFile

`server/est/Est04_PfFile.java`

서비스 키 `est.Est04_PfFile.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`est04_pf_file.selectById`](../../est/sql/est04_pf_file.md) | - |  |
| `selectByPfHistoryId` | 22 | [`est04_pf_file.selectByPfHistoryId`](../../est/sql/est04_pf_file.md) | `Est04_Grid_PfFile`, `Est04_Grid_PfFileConfirm`, `Est04_Lookup_PfFile` |  |
| `update` | 28 | `UpdateDataModel(est04_pf_file)` 동적 INSERT/UPDATE | `Est04_Grid_PfFile` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(est04_pf_file)` 동적 DELETE | `Est04_Grid_PfFile` | `UpdateDataModel` |
