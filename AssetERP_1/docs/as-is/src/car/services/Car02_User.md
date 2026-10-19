# car.Car02_User

`server/car/Car02_User.java`

서비스 키 `car.Car02_User.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`car02_user.selectById`](../../car/sql/car02_user.md) | - |  |
| `selectByInfoId` | 22 | [`car02_user.selectByInfoId`](../../car/sql/car02_user.md) | `Car02_Grid_User` |  |
| `update` | 28 | `UpdateDataModel(car02_user)` 동적 INSERT/UPDATE | `Car02_Grid_User` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(car02_user)` 동적 DELETE | `Car02_Grid_User` | `UpdateDataModel` |
