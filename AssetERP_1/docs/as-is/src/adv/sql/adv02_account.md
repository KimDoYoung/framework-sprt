# adv02_account

`server/adv/mapper/adv02_account.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`adv02_account`](../../../db/tables/adv.md) | `to_decrypts` | `adv.Adv02_Account.selectById` |
| `selectByCompanyId` | select | 29 | [`adv02_account`](../../../db/tables/adv.md) |  | `adv.Adv02_Account.selectByCompanyId` |
| `selectIcamAccount` | select | 35 | `szm0fd` ⚠DB없음, `szm0ia` ⚠DB없음, `szx2mm` ⚠DB없음 | `to_decrypts` | - |
| `selectIcamTrCorp` | select | 52 | `szx2mm` ⚠DB없음 |  | - |
| `selectByManageCode` | select | 61 | [`adv02_account`](../../../db/tables/adv.md) | `to_decrypts` | - |
| `checkManageCode` | select | 69 | [`adv02_account`](../../../db/tables/adv.md) |  | `adv.Adv02_Account.update` |
| `selectByManageNamePaging` | select | 77 | [`adv02_account`](../../../db/tables/adv.md) | `to_decrypts` | `adv.Adv02_Account.selectByManageNamePaging` |
| `selectByManageNamePagingTotal` | select | 88 | [`adv02_account`](../../../db/tables/adv.md) |  | `adv.Adv02_Account.selectByManageNamePaging` |
| `conditionByOrgAuth` | sql | 95 | [`adv05_org_auth`](../../../db/tables/adv.md) |  |  |
| `selectByOrgAuthPaging` | select | 106 | [`adv02_account`](../../../db/tables/adv.md), [`adv05_org_auth`](../../../db/tables/adv.md) | `to_decrypts` | `adv.Adv02_Account.selectByOrgAuthPaging` |
| `selectByOrgAuthPagingTotal` | select | 117 | [`adv02_account`](../../../db/tables/adv.md), [`adv05_org_auth`](../../../db/tables/adv.md) |  | `adv.Adv02_Account.selectByOrgAuthPaging` |
| `insert` | insert | 124 | [`adv02_account`](../../../db/tables/adv.md) | `f_create_seq`, `f_sysdate`, `to_encrypts` | - |
| `update` | update | 140 | [`adv02_account`](../../../db/tables/adv.md) | `f_sysdate`, `to_encrypts` | - |
