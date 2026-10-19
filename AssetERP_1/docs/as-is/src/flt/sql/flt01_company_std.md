# flt01_company_std

`server/flt/mapper/flt01_company_std.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `getLockUpDetailName` | sql | 36 | - | `f_cdnm` |  |
| `selectById` | select | 52 | [`flt01_company_std`](../../../db/tables/flt.md) | `f_cdnm` | `flt.Flt01_CompanyStd.selectById` |
| `selectByCompanyId` | select | 64 | [`flt01_company_std`](../../../db/tables/flt.md) | `f_cdnm` | `flt.Flt01_CompanyStd.selectByCompanyId` |
| `selectByDate` | select | 77 | [`flt01_company_std`](../../../db/tables/flt.md) | `f_cdnm` | `flt.Flt01_CompanyStd.getExpectTrDate`, `flt.Flt01_CompanyStd.selectByDate`, `flt.Flt08_BuyLockup.checkLockup` |
| `getExpectTrDate` | select | 92 | - | `f_get_biz_date` | `flt.Flt01_CompanyStd.getExpectTrDate` |
| `getExpectTrDate2` | select | 96 | [`flt01_company_std`](../../../db/tables/flt.md) | `f_get_biz_date` | `flt.Flt10_Tr.updateStatusCode` |
| `insert` | insert | 107 | [`flt01_company_std`](../../../db/tables/flt.md) |  | - |
| `insertFromFlt01` | insert | 120 | [`flt01_company_std`](../../../db/tables/flt.md) | `f_create_seq` | - |
