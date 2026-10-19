# sys.File

`server/sys/File.java`

서비스 키 `sys.File.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 22 | `sys10_file.selectByAll`(없음) | - |  |
| `selectById` | 31 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | - |  |
| `selectByParentId` | 42 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Grid_File`, `Grid_FileDownload` |  |
| `update` | 53 | `UpdateDataModel(sys10_file)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 58 | `UpdateDataModel(sys10_file)` 동적 DELETE | `Grid_File`, `Grid_FileDownload` | `UpdateDataModel` |
