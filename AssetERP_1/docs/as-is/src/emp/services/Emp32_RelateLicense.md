# emp.Emp32_RelateLicense

`server/emp/Emp32_RelateLicense.java`

서비스 키 `emp.Emp32_RelateLicense.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`emp32_relate_license.selectById`](../../emp/sql/emp32_relate_license.md) | - |  |
| `selectByLicenseId` | 22 | [`emp32_relate_license.selectByLicenseId`](../../emp/sql/emp32_relate_license.md) | `Emp32_TabPage_RelateLicense` |  |
| `update` | 28 | `UpdateDataModel(emp32_relate_license)` 동적 INSERT/UPDATE | `Emp32_TabPage_RelateLicense` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(emp32_relate_license)` 동적 DELETE | `Emp32_TabPage_RelateLicense` | `UpdateDataModel` |
