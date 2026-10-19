# mkt.Mkt01_TargetCompany

`server/mkt/Mkt01_TargetCompany.java`

서비스 키 `mkt.Mkt01_TargetCompany.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`mkt01_target_company.selectById`](../../mkt/sql/mkt01_target_company.md) | `Mkt01_Lookup_TargetCompany` |  |
| `selectByCompanyId` | 23 | `mkt01_target_company.selectByCompanyId`(없음) | - |  |
| `selectByCompanyIdPaging` | 28 | [`mkt01_target_company.selectByCompanyIdPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectByCompanyIdTotal`](../../mkt/sql/mkt01_target_company.md) | `Mkt01_Grid_TargetCompany`, `Mkt01_Lookup_SelectCompany` |  |
| `selectBySearchTextPaging` | 34 | [`mkt01_target_company.selectBySearchTextPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectBySearchTextTotal`](../../mkt/sql/mkt01_target_company.md) | `Mkt01_Lookup_FavoriteInsert`, `Mkt01_Lookup_Select` |  |
| `selectTargetCompanyPaging` | 40 | [`mkt01_target_company.selectTargetCompanyPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectTargetCompanyTotal`](../../mkt/sql/mkt01_target_company.md) | `Mkt01_Lookup_Select2`, `Mkt01_Lookup_TargetCompany2` |  |
| `selectManagerPaging` | 46 | [`mkt01_target_company.selectManagerPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectManagerTotal`](../../mkt/sql/mkt01_target_company.md) | `Mkt01_Lookup_Select2` |  |
| `selectFavoritePaging` | 52 | [`mkt01_target_company.selectFavoritePaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectFavoriteTotal`](../../mkt/sql/mkt01_target_company.md) | `Mkt01_Lookup_Favorite` |  |
| `updateOne` | 58 | `UpdateDataModel(mkt01_target_company)` 동적 INSERT/UPDATE | `Mkt01_Lookup_TargetCompany` | `UpdateDataModel` |
| `update` | 66 | `UpdateDataModel(mkt01_target_company)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 71 | [`mkt02_manager.deleteByTargetCompanyId`](../../mkt/sql/mkt02_manager.md), [`mkt05_share.deleteByParentId`](../../mkt/sql/mkt05_share.md), `UpdateDataModel(mkt01_target_company)` 동적 DELETE | `Mkt01_Grid_TargetCompany` | `UpdateDataModel` |
