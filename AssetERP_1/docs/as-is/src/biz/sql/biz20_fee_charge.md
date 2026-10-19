# biz20_fee_charge

`server/biz/mapper/biz20_fee_charge.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 56 | [`apr01_appr`](../../../db/tables/apr.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm` | `biz.Biz20_FeeCharge.selectById` |
| `selectByCorpId` | select | 80 | [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `selectByContCorpId2` | select | 89 | [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `selectByChargeDate` | select | 103 | [`apr01_appr`](../../../db/tables/apr.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_quarter_date` | `biz.Biz20_FeeCharge.selectByChargeDate`, `sys.Sys99_Print.insertRdFeeCharge` |
| `getChargeDate` | select | 187 | [`biz20_fee_charge`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) |  | - |
| `calcChargeFee` | select | 238 | - | `f_calc_chargefee` | - |
| `selectByContCorpId` | select | 242 | [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md) |  | - |
| `selectByTrCode` | select | 283 | [`ast05_tr_code`](../../../db/tables/ast.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `act.Act02_Journal.createJournalBiz`, `act.Act02_Journal.deleteJournalBiz` |
| `updateCheck` | select | 306 | [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.updateCheck` |
| `getHtmlContent` | select | 315 | [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md), [`biz29_account`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz20_FeeCharge.apprCheck`, `biz.Biz20_FeeCharge.getHtmlContent` |
| `selectFeeInfo` | select | 339 | [`biz22_fee_charge_calc`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `insert` | insert | 554 | [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `confirmUpdate` | update | 586 | [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.confirmUpdate` |
| `updateFeeCalcInfo` | update | 592 | [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `updateApprId` | update | 638 | [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.updateApprId` |
| `updateTrId` | update | 644 | [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `act.Act02_Journal.createJournalBiz`, `act.Act02_Journal.deleteJournalBiz` |
| `deleteByFeeChargeId` | delete | 650 | [`biz20_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.deleteList` |
