# tdm.Tdm91_CompanySetup

`server/tdm/Tdm91_CompanySetup.java`

서비스 키 `tdm.Tdm91_CompanySetup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`tdm91_company_setup.selectById`](../../tdm/sql/tdm91_company_setup.md) | - |  |
| `selectByCompanyId` | 28 | [`tdm91_company_setup.selectByCompanyId`](../../tdm/sql/tdm91_company_setup.md) | `Tdm91_Tab_CompanySetup` |  |
| `update` | 73 | [`tdm91_company_setup.countByDate`](../../tdm/sql/tdm91_company_setup.md), `UpdateDataModel(tdm91_company_setup)` 동적 INSERT/UPDATE | `Tdm91_Tab_CompanySetup` | `UpdateDataModel` |
| `delete` | 108 | `UpdateDataModel(tdm91_company_setup)` 동적 DELETE | `Tdm91_Tab_CompanySetup` | `UpdateDataModel` |
