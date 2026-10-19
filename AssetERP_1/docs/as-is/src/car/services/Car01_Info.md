# car.Car01_Info

`server/car/Car01_Info.java`

서비스 키 `car.Car01_Info.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`car01_info.selectById`](../../car/sql/car01_info.md) | - |  |
| `selectByCompanyId` | 24 | [`car01_info.selectByCompanyId`](../../car/sql/car01_info.md) | `Car01_Tab_Info` |  |
| `selectByCarType` | 36 | [`car01_info.selectByCarType1`](../../car/sql/car01_info.md), [`car01_info.selectByCarType2`](../../car/sql/car01_info.md) | `Car01_Lookup_Info`, `Car04_Tab_PrivateJournal` |  |
| `selectByCarTypeAdmin` | 56 | [`car01_info.selectByCarTypeAdmin`](../../car/sql/car01_info.md) | `Car01_Lookup_Info` |  |
| `update` | 69 | `UpdateDataModel(car01_info)` 동적 INSERT/UPDATE | `Car01_Edit_Info` | `UpdateDataModel` |
| `delete` | 74 | `UpdateDataModel(car01_info)` 동적 DELETE | `Car01_Tab_Info` | `UpdateDataModel` |
