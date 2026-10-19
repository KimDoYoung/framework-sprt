# est.Est01_PfFeeType

`server/est/Est01_PfFeeType.java`

서비스 키 `est.Est01_PfFeeType.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`est01_pf_fee_type.selectById`](../../est/sql/est01_pf_fee_type.md) | - |  |
| `selectByCompanyId` | 24 | [`est01_pf_fee_type.selectByCompanyId`](../../est/sql/est01_pf_fee_type.md) | `Est01_Tab_PfFeeType` |  |
| `selectByText` | 30 | [`est01_pf_fee_type.selectByText`](../../est/sql/est01_pf_fee_type.md) | `Est01_Lookup_PfFeeType` |  |
| `update` | 42 | `UpdateDataModel(est01_pf_fee_type)` 동적 INSERT/UPDATE | `Est01_Tab_PfFeeType` | `UpdateDataModel` |
| `delete` | 47 | `UpdateDataModel(est01_pf_fee_type)` 동적 DELETE | `Est01_Tab_PfFeeType` | `UpdateDataModel` |
