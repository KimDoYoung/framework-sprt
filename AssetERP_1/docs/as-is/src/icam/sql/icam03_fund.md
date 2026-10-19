# icam03_fund

`server/icam/mapper/icam03_fund.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 61 | [`icam03_fund`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `icam.Icam03_Fund.selectById` |
| `selectByCompanyId` | select | 77 | [`icam03_fund`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `icam.Icam03_Fund.selectByCompanyId` |
| `selectRecentFund` | select | 94 | [`icam03_fund`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `icam.Icam03_Fund.selectRecentFund` |
| `selectByFundCode` | select | 115 | [`icam03_fund`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `icam.Icam03_Fund.selectByFundCode` |
| `selectIcamFund` | select | 133 | `sjm0sm_mc` ⚠DB없음, `skt0gi` ⚠DB없음, `szm0fd` ⚠DB없음, `szm0fd_excode` ⚠DB없음, `szt0fd` ⚠DB없음, `szx0bs` ⚠DB없음, `szx2mm` ⚠DB없음 |  | - |
| `selectByNamePaging` | select | 249 | [`icam03_fund`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `icam.Icam03_Fund.selectByPaging` |
| `selectByNameTotal` | select | 268 | [`icam03_fund`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) |  | `icam.Icam03_Fund.selectByPaging` |
| `insert` | insert | 277 | [`icam03_fund`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate` | - |
| `delete` | delete | 323 | [`icam03_fund`](../../../db/tables/icam.md) |  | - |
