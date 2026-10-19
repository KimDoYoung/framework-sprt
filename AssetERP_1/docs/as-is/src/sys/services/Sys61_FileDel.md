# sys.Sys61_FileDel

`server/sys/Sys61_FileDel.java`

서비스 키 `sys.Sys61_FileDel.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`sys61_file_del.selectById`](../../sys/sql/sys61_file_del.md) | - |  |
| `selectByParentId` | 28 | [`sys61_file_del.selectByParentId`](../../sys/sql/sys61_file_del.md) | `Sys61_Lookup_DelList`, `Sys61_TabPage_DelList` |  |
| `insert` | 34 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.updateParentId`](../../sys/sql/sys10_file.md), [`sys61_file_del.insert`](../../sys/sql/sys61_file_del.md) | `Sys61_Lookup_FileList` |  |
| `recovery` | 59 | [`sys10_file.updateParentId`](../../sys/sql/sys10_file.md), [`sys61_file_del.deleteByFileDelId`](../../sys/sql/sys61_file_del.md) | `Sys61_TabPage_DelList` |  |
| `update` | 77 | `UpdateDataModel(sys61_file_del)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 82 | `UpdateDataModel(sys61_file_del)` 동적 DELETE | - | `UpdateDataModel` |
