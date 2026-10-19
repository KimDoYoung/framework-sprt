# crd.Crd11_ExcelCode

`server/crd/Crd11_ExcelCode.java`

서비스 키 `crd.Crd11_ExcelCode.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`crd11_excel_code.selectById`](../../crd/sql/crd11_excel_code.md) | - |  |
| `selectByCompanyId` | 26 | [`crd11_excel_code.selectByCompanyId`](../../crd/sql/crd11_excel_code.md) | `Crd11_Lookup_ExcelCode`, `Crd11_Lookup_ExcelCodeAdmin` |  |
| `copyData` | 35 | [`crd11_excel_code.copyData`](../../crd/sql/crd11_excel_code.md) | `Crd11_Lookup_ExcelCode` |  |
| `update` | 55 | `UpdateDataModel(crd11_excel_code)` 동적 INSERT/UPDATE | `Crd11_Lookup_ExcelCode`, `Crd11_Lookup_ExcelCodeAdmin` | `UpdateDataModel` |
| `delete` | 60 | `UpdateDataModel(crd11_excel_code)` 동적 DELETE | `Crd11_Lookup_ExcelCode`, `Crd11_Lookup_ExcelCodeAdmin` | `UpdateDataModel` |
