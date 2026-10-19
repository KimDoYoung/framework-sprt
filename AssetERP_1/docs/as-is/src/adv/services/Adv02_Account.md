# adv.Adv02_Account

`server/adv/Adv02_Account.java`

서비스 키 `adv.Adv02_Account.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`adv02_account.selectById`](../../adv/sql/adv02_account.md) | `Apr03_Page_Relate` |  |
| `selectByCompanyId` | 26 | [`adv02_account.selectByCompanyId`](../../adv/sql/adv02_account.md) | `Fnd31_Edit_DemandOprFund`, `Fnd31_Edit_OprFund` |  |
| `selectByManageNamePaging` | 32 | [`adv02_account.selectByManageNamePaging`](../../adv/sql/adv02_account.md), [`adv02_account.selectByManageNamePagingTotal`](../../adv/sql/adv02_account.md) | `Adv02_Tab_Account`, `Adv05_Tab_OrgAuth` |  |
| `selectByOrgAuthPaging` | 38 | [`adv02_account.selectByOrgAuthPaging`](../../adv/sql/adv02_account.md), [`adv02_account.selectByOrgAuthPagingTotal`](../../adv/sql/adv02_account.md) | `Adv02_Lookup_SelectMulti`, `Adv02_Lookup_SelectSingle` |  |
| `update` | 44 | [`adv02_account.checkManageCode`](../../adv/sql/adv02_account.md), [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), `UpdateDataModel(adv02_account)` 동적 INSERT/UPDATE | `Adv02_Edit_Account` | `UpdateDataModel` |
| `delete` | 76 | `UpdateDataModel(adv02_account)` 동적 DELETE | `Adv02_Edit_Account`, `Adv02_Tab_Account` | `UpdateDataModel` |
