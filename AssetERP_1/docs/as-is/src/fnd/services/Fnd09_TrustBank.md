# fnd.Fnd09_TrustBank

`server/fnd/Fnd09_TrustBank.java`

서비스 키 `fnd.Fnd09_TrustBank.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByCodeName` | 21 | [`fnd09_trust_bank.selectByCodeName`](../../fnd/sql/fnd09_trust_bank.md) | - |  |
| `selectByCompanyId` | 34 | [`fnd09_trust_bank.selectByCompanyId`](../../fnd/sql/fnd09_trust_bank.md) | `Fnd09_Tab_TrustBank` |  |
| `selectByCompanyId0` | 39 | [`fnd09_trust_bank.selectByCompanyId0`](../../fnd/sql/fnd09_trust_bank.md) | `Fnd09_Tab_TrustBankManager` |  |
| `selectByText` | 44 | [`fnd09_trust_bank.selectByText`](../../fnd/sql/fnd09_trust_bank.md) | `Fnd09_Lookup_TrustBank` |  |
| `preUpdate` | 53 | [`fnd09_trust_bank.selectByCd`](../../fnd/sql/fnd09_trust_bank.md), [`fnd09_trust_bank.selectById`](../../fnd/sql/fnd09_trust_bank.md) | `Fnd09_Tab_TrustBank` |  |
| `selectIcamTrustBank` | 93 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd09_trust_bank.insertUpdate`](../../fnd/sql/fnd09_trust_bank.md), [`fnd09_trust_bank.selectByTrustBankCode`](../../fnd/sql/fnd09_trust_bank.md), [`sys01_company.selectIcamCompanyCode`](../../sys/sql/sys01_company.md) | `Fnd09_Tab_TrustBank`, `Fnd09_Tab_TrustBankManager` | `DatabaseFactoryICAM` |
| `update` | 147 | `UpdateDataModel(fnd09_trust_bank)` 동적 INSERT/UPDATE | `Fnd09_Tab_TrustBank` | `UpdateDataModel` |
| `delete` | 152 | `UpdateDataModel(fnd09_trust_bank)` 동적 DELETE | `Fnd09_Tab_TrustBank` | `UpdateDataModel` |
