# emp.License

`server/emp/License.java`

서비스 키 `emp.License.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`sys21_license_code.selectById`](../../sys/sql/sys21_license_code.md) | - |  |
| `selectByUserId` | 22 | `sys21_license_code.selectByUserId`(없음) | - |  |
| `selectByToday` | 28 | `sys21_license_code.selectByToday`(없음) | - |  |
| `update` | 35 | `UpdateDataModel(sys21_license_code)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 40 | `UpdateDataModel(sys21_license_code)` 동적 DELETE | - | `UpdateDataModel` |
