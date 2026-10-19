# icam10_fee

`server/icam/mapper/icam10_fee.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 69 | [`icam10_fee`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.selectById` |
| `selectFundList` | select | 76 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`icam10_fee`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.selectFundList` |
| `whereCondition` | sql | 97 | - |  |  |
| `selectByFeeTypePaging` | select | 114 | [`icam10_fee`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.selectByFeeTypePaging` |
| `selectByFeeTypePagingTotal` | select | 125 | [`icam10_fee`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.selectByFeeTypePaging` |
| `selectByFeeType` | select | 132 | [`icam10_fee`](../../../db/tables/icam.md) |  | `sys.Sys99_Print.insertRdFundMngFee` |
| `selectByFundCode` | select | 154 | [`icam10_fee`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_calc_dual_fund_fee` | `icam.Icam10_Fee.selectByFundCode` |
| `selectOfficeMngFeeIcamData` | select | 172 | [`icam10_fee`](../../../db/tables/icam.md), `syx0hy` ⚠DB없음, `szm0bs` ⚠DB없음, `szm0fd` ⚠DB없음, `szx0aa` ⚠DB없음, `uzm0ac` ⚠DB없음 |  | - |
| `selectOfficeMngFeeIcamDataRe` | select | 210 | [`icam10_fee`](../../../db/tables/icam.md), `syx0hy` ⚠DB없음, `szm0bs` ⚠DB없음, `szm0fd` ⚠DB없음, `szx0aa` ⚠DB없음, `uzm0ac` ⚠DB없음 |  | - |
| `selectFundMngFeeIcamData` | select | 252 | [`icam10_fee`](../../../db/tables/icam.md), `syx0hy` ⚠DB없음, `szm0bs` ⚠DB없음, `szm0fd` ⚠DB없음, `uzm0ac` ⚠DB없음 |  | - |
| `selectOfficeMngFeeIcamData2` | select | 292 | [`icam10_fee`](../../../db/tables/icam.md), `szx0dt` ⚠DB없음, `uzm0cd` ⚠DB없음 |  | - |
| `selectOfficeMngFeeIcamData3` | select | 335 | [`icam10_fee`](../../../db/tables/icam.md), `sat0fa` ⚠DB없음 |  | - |
| `selectOfficeMngStartDate` | select | 359 | `szx0aa` ⚠DB없음, `uzm0cd` ⚠DB없음 |  | - |
| `getCurrentFeeByFund` | select | 376 | [`ast33_fund_trans`](../../../db/tables/ast.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`icam10_fee`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi31_fund_fee`](../../../db/tables/ifi.md) |  | `icam.Icam10_Fee.getCurrentFeeByFund`, `sys.Sys99_Print.insertRdCurrentFeeByFund` |
| `createFundFeeBook` | select | 456 | - | `f_create_fundfeebook` | `ast.Ast30_BookFundFee.reprocFundFee`, `icam.Icam10_Fee.createFeeBook` |
| `createFundFeeBook2` | select | 460 | - | `f_create_fundfeebook2` | `ast.Ast30_BookFundFee.updateEvalFundFee`, `ast.Ast33_FundTrans.delete`, `ast.Ast33_FundTrans.update`, `icam.Icam10_Fee.createFeeBook` |
| `createFundFeeRcvTr` | select | 464 | - | `f_create_fundfeercvtr` | `icam.Icam10_Fee.createFeeRcvTr` |
| `createFundFeeRcvTr2` | select | 468 | - | `f_create_fundfeercvtr_officemng` | `icam.Icam10_Fee.createFeeRcvTr` |
| `insert` | insert | 472 | [`icam10_fee`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate` | `icam.Icam10_Fee.getICAMFundFee` |
| `updateFee` | update | 497 | [`icam10_fee`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.updateFee` |
| `deleteByFeeId` | delete | 503 | [`icam10_fee`](../../../db/tables/icam.md) |  | - |
| `deleteByFeeType` | delete | 509 | [`icam10_fee`](../../../db/tables/icam.md) |  | - |
| `deleteOfficeMngFee` | delete | 517 | [`icam10_fee`](../../../db/tables/icam.md) |  | - |
| `deleteOfficeMngFeeByFundCode` | delete | 525 | [`icam10_fee`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.getICAMFundFee` |
| `deleteFundMngFee` | delete | 535 | [`icam10_fee`](../../../db/tables/icam.md) |  | `icam.Icam10_Fee.getICAMFundFee` |
