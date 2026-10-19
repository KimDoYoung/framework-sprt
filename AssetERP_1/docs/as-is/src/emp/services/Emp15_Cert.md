# emp.Emp15_Cert

`server/emp/Emp15_Cert.java`

서비스 키 `emp.Emp15_Cert.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`emp15_cert.selectById`](../../emp/sql/emp15_cert.md) | - |  |
| `selectByCompanyId` | 29 | [`emp15_cert.selectByCompanyId`](../../emp/sql/emp15_cert.md) | `Emp15_Tab_Cert` |  |
| `modelUpdate` | 40 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp15_cert)` 동적 INSERT/UPDATE | `Emp15_Lookup_Cert`, `Emp15_Lookup_StampDocCert` | `UpdateDataModel` |
| `updateApprId` | 53 | [`emp15_cert.updateApprId`](../../emp/sql/emp15_cert.md) | `Emp15_Lookup_Cert`, `Emp15_Lookup_StampDocCert` |  |
| `update` | 62 | `UpdateDataModel(emp15_cert)` 동적 INSERT/UPDATE | `Emp15_Tab_Cert` | `UpdateDataModel` |
| `delete` | 67 | `UpdateDataModel(emp15_cert)` 동적 DELETE | `Emp15_Tab_Cert` | `UpdateDataModel` |
