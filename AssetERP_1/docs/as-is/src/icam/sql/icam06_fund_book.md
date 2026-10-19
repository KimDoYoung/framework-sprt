# icam06_fund_book

`server/icam/mapper/icam06_fund_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 40 | [`icam06_fund_book`](../../../db/tables/icam.md) |  | `icam.Icam06_FundBook.selectById` |
| `selectByStdDate` | select | 47 | [`icam06_fund_book`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi32_fund_price`](../../../db/tables/ifi.md), [`sys01_company`](../../../db/tables/sys.md) |  | `icam.Icam06_FundBook.selectByStdDate` |
| `selectFundBookAvg` | select | 97 | [`icam06_fund_book`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi32_fund_price`](../../../db/tables/ifi.md), [`sys01_company`](../../../db/tables/sys.md) | `f_calc_fundbookavg` | `icam.Icam06_FundBook.selectFundBookAvg`, `sys.Sys99_Print.insertRdFundOperateStatus` |
| `calcStartRow` | select | 147 | - | `f_get_datedif` | `icam.Icam06_FundBook.selectFundBookAvg`, `sys.Sys99_Print.insertRdFundOperateStatus` |
| `selectIcamFundBook` | select | 151 | `szm0fd` ⚠DB없음, `uzm0uh` ⚠DB없음 |  | - |
| `selectFundPrice` | select | 247 | [`icam06_fund_book`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi32_fund_price`](../../../db/tables/ifi.md), [`sys01_company`](../../../db/tables/sys.md) |  | `icam.Icam06_FundBook.selectIcamFundPrice`, `sys.Sys99_Print.insertRdFundPrice` |
| `insert` | insert | 337 | [`icam06_fund_book`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate` | - |
| `deleteByStdDate` | delete | 364 | [`icam06_fund_book`](../../../db/tables/icam.md) |  | - |
