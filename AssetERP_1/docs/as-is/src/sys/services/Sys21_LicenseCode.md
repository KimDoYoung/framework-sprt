# sys.Sys21_LicenseCode

`server/sys/Sys21_LicenseCode.java`

서비스 키 `sys.Sys21_LicenseCode.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByName` | 24 | [`sys21_license_code.selectByName`](../../sys/sql/sys21_license_code.md) | `Sys21_Tab_LicenseCode` |  |
| `selectByApplyDate` | 29 | `sys21_license_code.selectByCodeKindId`(없음) | - | `Calendar` |
| `update` | 41 | `UpdateDataModel(sys21_license_code)` 동적 INSERT/UPDATE | `Sys21_Tab_LicenseCode` | `UpdateDataModel` |
| `delete` | 46 | `UpdateDataModel(sys21_license_code)` 동적 DELETE | `Sys21_Tab_LicenseCode` | `UpdateDataModel` |
