# ics.Ics03_CompanyInfo

`server/ics/Ics03_CompanyInfo.java`

서비스 키 `ics.Ics03_CompanyInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`ics03_company_info.selectById`](../../ics/sql/ics03_company_info.md) | - |  |
| `selectByClassTreeId` | 26 | [`ics03_company_info.selectByClassTreeId`](../../ics/sql/ics03_company_info.md) | `Ics01_Lookup_Except`, `Ics01_Tab_ClassTreeUser` |  |
| `modelUpdate` | 37 | `UpdateDataModel(ics03_company_info)` 동적 INSERT/UPDATE | `Ics01_Lookup_Except`, `Ics01_Tab_ClassTreeUser` | `UpdateDataModel` |
| `update` | 45 | `UpdateDataModel(ics03_company_info)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 50 | `UpdateDataModel(ics03_company_info)` 동적 DELETE | - | `UpdateDataModel` |
