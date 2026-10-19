# sch.Sch08_Class

`server/sch/Sch08_Class.java`

서비스 키 `sch.Sch08_Class.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`sch08_class.selectById`](../../sch/sql/sch08_class.md) | - |  |
| `selectByPersonId` | 22 | [`sch08_class.selectByPersonId`](../../sch/sql/sch08_class.md) | `Sch08_Lookup_Class` |  |
| `checkClassId` | 27 | [`sch01_info.checkClassId`](../../sch/sql/sch01_info.md) | `Sch08_Lookup_Class` |  |
| `update` | 36 | `UpdateDataModel(sch08_class)` 동적 INSERT/UPDATE | `Sch08_Lookup_Class` | `UpdateDataModel` |
| `delete` | 41 | `UpdateDataModel(sch08_class)` 동적 DELETE | `Sch08_Lookup_Class` | `UpdateDataModel` |
