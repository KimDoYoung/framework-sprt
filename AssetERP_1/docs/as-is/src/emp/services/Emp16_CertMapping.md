# emp.Emp16_CertMapping

`server/emp/Emp16_CertMapping.java`

서비스 키 `emp.Emp16_CertMapping.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`emp16_cert_mapping.selectById`](../../emp/sql/emp16_cert_mapping.md) | - |  |
| `selectByCompanyId` | 25 | [`emp16_cert_mapping.selectByCompanyId`](../../emp/sql/emp16_cert_mapping.md) | `Emp16_Lookup_CertList`, `Emp16_TabPage_CertMapping` |  |
| `selectByLinkCode` | 37 | [`emp16_cert_mapping.selectByLinkCode`](../../emp/sql/emp16_cert_mapping.md) | - |  |
| `updateModel` | 51 | `UpdateDataModel(emp16_cert_mapping)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 61 | `UpdateDataModel(emp16_cert_mapping)` 동적 INSERT/UPDATE | `Emp16_Lookup_CertList`, `Emp16_TabPage_CertMapping` | `UpdateDataModel` |
| `delete` | 66 | `UpdateDataModel(emp16_cert_mapping)` 동적 DELETE | `Emp16_Lookup_CertList`, `Emp16_TabPage_CertMapping` | `UpdateDataModel` |
