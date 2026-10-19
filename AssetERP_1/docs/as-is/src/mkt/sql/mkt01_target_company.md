# mkt01_target_company

`server/mkt/mapper/mkt01_target_company.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectShareInfo` | sql | 32 | [`mkt05_share`](../../../db/tables/mkt.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` |  |
| `selectById` | select | 47 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `mkt.Mkt01_TargetCompany.selectById` |
| `selectTargetCompany` | sql | 60 | [`mkt01_target_company`](../../../db/tables/mkt.md) |  |  |
| `selectTargetCompanyAndManager` | sql | 73 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md) |  |  |
| `selectBytargetCompanyName` | select | 102 | [`mkt01_target_company`](../../../db/tables/mkt.md) |  | - |
| `selectByCompanyIdPaging` | select | 109 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `mkt.Mkt01_TargetCompany.selectByCompanyIdPaging` |
| `selectByCompanyIdTotal` | select | 128 | [`mkt01_target_company`](../../../db/tables/mkt.md) |  | `mkt.Mkt01_TargetCompany.selectByCompanyIdPaging` |
| `selectBySearchText` | select | 133 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `sys.Sys99_Print.insertRdTargetCompany` |
| `selectBySearchTextPaging` | select | 157 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `mkt.Mkt01_TargetCompany.selectBySearchTextPaging` |
| `selectBySearchTextTotal` | select | 180 | [`mkt01_target_company`](../../../db/tables/mkt.md) |  | `mkt.Mkt01_TargetCompany.selectBySearchTextPaging` |
| `selectTargetCompanyPaging` | select | 185 | [`mkt01_target_company`](../../../db/tables/mkt.md) | `f_cdnm`, `f_today` | `mkt.Mkt01_TargetCompany.selectTargetCompanyPaging` |
| `selectTargetCompanyTotal` | select | 194 | [`mkt01_target_company`](../../../db/tables/mkt.md) |  | `mkt.Mkt01_TargetCompany.selectTargetCompanyPaging` |
| `selectManagerPaging` | select | 199 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md) | `f_cdnm`, `f_today` | `mkt.Mkt01_TargetCompany.selectManagerPaging` |
| `selectManagerTotal` | select | 210 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md) |  | `mkt.Mkt01_TargetCompany.selectManagerPaging` |
| `selectFavoritePaging` | select | 215 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md) | `f_cdnm`, `f_today` | `mkt.Mkt01_TargetCompany.selectFavoritePaging` |
| `selectFavoriteTotal` | select | 249 | [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md) |  | `mkt.Mkt01_TargetCompany.selectFavoritePaging` |
| `excelInsert` | insert | 260 | [`mkt01_target_company`](../../../db/tables/mkt.md) |  | - |
