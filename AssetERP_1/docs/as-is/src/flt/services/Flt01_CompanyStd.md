# flt.Flt01_CompanyStd

`server/flt/Flt01_CompanyStd.java`

서비스 키 `flt.Flt01_CompanyStd.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | [`flt01_company_std.selectById`](../../flt/sql/flt01_company_std.md) | - |  |
| `selectByCompanyId` | 30 | [`flt01_company_std.selectByCompanyId`](../../flt/sql/flt01_company_std.md) | `Flt01_Tab_CompanyStd` |  |
| `selectByDate` | 36 | [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md) | `Apr01_Edit_ApprDoc`, `Flt02_Tab_EmpInfo`, `Flt10_Tab_PreApprove`, `Flt11_Lookup_BookList` |  |
| `getExpectTrDate` | 41 | [`flt01_company_std.getExpectTrDate`](../../flt/sql/flt01_company_std.md), [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md) | `Flt10_Tab_BuyReport`, `Flt10_Tab_SellReport` |  |
| `updateOne` | 60 | `UpdateDataModel(flt01_company_std)` 동적 INSERT/UPDATE | `Flt01_Lookup_LockUpCheckType` | `UpdateDataModel` |
| `update` | 68 | `UpdateDataModel(flt01_company_std)` 동적 INSERT/UPDATE | `Flt01_Tab_CompanyStd` | `UpdateDataModel` |
| `delete` | 73 | `UpdateDataModel(flt01_company_std)` 동적 DELETE | `Flt01_Tab_CompanyStd` | `UpdateDataModel` |
