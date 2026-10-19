# crd.Crd10_ExcelCompany

`server/crd/Crd10_ExcelCompany.java`

서비스 키 `crd.Crd10_ExcelCompany.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`crd10_excel_company.selectById`](../../crd/sql/crd10_excel_company.md) | - |  |
| `selectByCompanyId` | 25 | [`crd10_excel_company.selectByCompanyId`](../../crd/sql/crd10_excel_company.md) | `Crd10_Tab_ExcelCompanyAdmin` |  |
| `update` | 33 | `UpdateDataModel(crd10_excel_company)` 동적 INSERT/UPDATE | `Crd10_Tab_ExcelCompanyAdmin` | `UpdateDataModel` |
| `delete` | 38 | `UpdateDataModel(crd10_excel_company)` 동적 DELETE | `Crd10_Tab_ExcelCompanyAdmin` | `UpdateDataModel` |
