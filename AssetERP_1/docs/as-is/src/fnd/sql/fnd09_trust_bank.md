# fnd09_trust_bank

`server/fnd/mapper/fnd09_trust_bank.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | `fnd.Fnd09_TrustBank.preUpdate` |
| `selectByCd` | select | 32 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | `fnd.Fnd09_TrustBank.preUpdate` |
| `selectByCodeName` | select | 39 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | `fnd.Fnd09_TrustBank.selectByCodeName` |
| `selectByText` | select | 46 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | `fnd.Fnd09_TrustBank.selectByText` |
| `selectByTrustBankName` | select | 53 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | - |
| `selectByCompanyId0` | select | 60 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | `fnd.Fnd09_TrustBank.selectByCompanyId0` |
| `selectByCompanyId` | select | 72 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | `fnd.Fnd09_TrustBank.selectByCompanyId` |
| `selectIcamTrustBank` | select | 107 | `szx2mm` ⚠DB없음 |  | - |
| `selectByTrustBankCode` | select | 116 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | `fnd.Fnd09_TrustBank.selectIcamTrustBank` |
| `insertUpdate` | insert | 123 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | `fnd.Fnd09_TrustBank.selectIcamTrustBank` |
| `insert` | insert | 186 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | - |
| `insert2` | insert | 224 | [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`icam03_fund`](../../../db/tables/icam.md) | `f_create_seq` | - |
| `confirmUpdate` | update | 246 | [`fnd09_trust_bank`](../../../db/tables/fnd.md) |  | - |
