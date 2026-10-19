# emp.Hire

`server/emp/Hire.java`

서비스 키 `emp.Hire.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | `emp01_hire.selectById`(없음) | - |  |
| `selectByUserId` | 29 | `emp01_hire.selectByUserId`(없음) | - |  |
| `selectByPayTarget` | 35 | `emp01_hire.selectByPayTarget`(없음) | - |  |
| `selectByKorName` | 52 | `emp01_hire.selectByKorName`(없음) | - |  |
| `selectByUserName` | 67 | `emp01_hire.selectByUserName`(없음) | - |  |
| `update` | 75 | `UpdateDataModel(emp01_hire)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 80 | `UpdateDataModel(emp01_hire)` 동적 DELETE | - | `UpdateDataModel` |
