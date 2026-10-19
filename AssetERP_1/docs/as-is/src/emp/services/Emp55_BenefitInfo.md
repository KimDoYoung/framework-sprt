# emp.Emp55_BenefitInfo

`server/emp/Emp55_BenefitInfo.java`

서비스 키 `emp.Emp55_BenefitInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`emp55_benefit_info.selectById`](../../emp/sql/emp55_benefit_info.md) | - |  |
| `selectBySearchText` | 25 | [`emp55_benefit_info.selectBySearchText`](../../emp/sql/emp55_benefit_info.md) | `Emp55_Tab_benefitInfoManager` |  |
| `selectByBenefitCode` | 39 | [`emp55_benefit_info.selectByBenefitCode`](../../emp/sql/emp55_benefit_info.md) | `Emp17_Lookup_Benefit`, `Emp17_Tab_BenefitManager` |  |
| `selectByCompanyId` | 53 | [`emp55_benefit_info.selectByCompanyId`](../../emp/sql/emp55_benefit_info.md) | `Emp55_Lookup_account` |  |
| `selectAccountName` | 65 | [`emp55_benefit_info.selectAccountName`](../../emp/sql/emp55_benefit_info.md) | `Emp17_Tab_BenefitManager` |  |
| `insertInitData` | 83 | [`emp55_benefit_info.insertInitData`](../../emp/sql/emp55_benefit_info.md) | `Emp55_Tab_benefitInfoManager` |  |
| `update` | 98 | `UpdateDataModel(emp55_benefit_info)` 동적 INSERT/UPDATE | `Emp55_Lookup_account`, `Emp55_Tab_benefitInfoManager` | `UpdateDataModel` |
| `delete` | 103 | `UpdateDataModel(emp55_benefit_info)` 동적 DELETE | `Emp55_Tab_benefitInfoManager` | `UpdateDataModel` |
