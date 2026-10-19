# biz.Biz04_ProvideSetup

`server/biz/Biz04_ProvideSetup.java`

서비스 키 `biz.Biz04_ProvideSetup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 15 | [`biz04_provide_setup.selectById`](../../biz/sql/biz04_provide_setup.md) | - |  |
| `selectByProvidePurCode` | 21 | [`biz04_provide_setup.selectByProvidePurCode`](../../biz/sql/biz04_provide_setup.md) | `Biz04_Lookup_EmpSetup` |  |
| `selectByProvideContentCode` | 26 | [`biz04_provide_setup.selectByProvideContentCode`](../../biz/sql/biz04_provide_setup.md) | `Biz01_Edit_Card`, `Biz01_Edit_Other`, `Biz01_Lookup_CardManagement` |  |
| `upsert` | 38 | [`biz04_provide_setup.upsert`](../../biz/sql/biz04_provide_setup.md) | `Biz04_Lookup_EmpSetup` |  |
