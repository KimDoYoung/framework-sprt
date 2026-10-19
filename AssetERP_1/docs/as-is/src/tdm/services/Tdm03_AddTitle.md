# tdm.Tdm03_AddTitle

`server/tdm/Tdm03_AddTitle.java`

서비스 키 `tdm.Tdm03_AddTitle.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`tdm03_add_title.selectById`](../../tdm/sql/tdm03_add_title.md) | - |  |
| `selectByPersonId` | 21 | [`tdm03_add_title.selectByPersonId`](../../tdm/sql/tdm03_add_title.md) | `Tdm03_Lookup_AddTitle` |  |
| `update` | 26 | `UpdateDataModel(tdm03_add_title)` 동적 INSERT/UPDATE | `Tdm03_Lookup_AddTitle` | `UpdateDataModel` |
| `delete` | 31 | `UpdateDataModel(tdm03_add_title)` 동적 DELETE | `Tdm03_Lookup_AddTitle` | `UpdateDataModel` |
