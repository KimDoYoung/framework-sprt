# biz.Biz20_FeeCharge

`server/biz/Biz20_FeeCharge.java`

서비스 키 `biz.Biz20_FeeCharge.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 30 | [`biz20_fee_charge.selectById`](../../biz/sql/biz20_fee_charge.md) | - |  |
| `selectByChargeDate` | 35 | [`biz20_fee_charge.selectByChargeDate`](../../biz/sql/biz20_fee_charge.md) | `Biz20_Tab_FeeCharge` |  |
| `createFeeCharge` | 40 | [`ast33_fund_trans.selectFundTransByDate`](../../ast/sql/ast33_fund_trans.md), [`biz11_cont_history.selectByDate`](../../biz/sql/biz11_cont_history.md), [`biz11_cont_history.selectByStartDate`](../../biz/sql/biz11_cont_history.md), [`biz11_cont_history.selectContCorp`](../../biz/sql/biz11_cont_history.md), [`biz11_cont_history.updateDate`](../../biz/sql/biz11_cont_history.md), [`biz13_with_corp.selectByContCorpId2`](../../biz/sql/biz13_with_corp.md), [`biz13_with_corp.selectFirstStartDateIsNull`](../../biz/sql/biz13_with_corp.md), [`biz13_with_corp.updateFirstStartDate`](../../biz/sql/biz13_with_corp.md), [`biz17_dual_manage_fund.calcDualFundFee`](../../biz/sql/biz17_dual_manage_fund.md), [`biz20_fee_charge.insert`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.selectByContCorpId2`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.selectByCorpId`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.selectFeeInfo`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.updateFeeCalcInfo`](../../biz/sql/biz20_fee_charge.md), [`biz21_fee_charge_dtl.deleteByFeeChargeId`](../../biz/sql/biz21_fee_charge_dtl.md), [`biz21_fee_charge_dtl.insert`](../../biz/sql/biz21_fee_charge_dtl.md), [`biz21_fee_charge_dtl.selectOccFeeSum`](../../biz/sql/biz21_fee_charge_dtl.md), [`biz22_fee_charge_calc.deleteByContCorpId`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.deleteByFeeChargeCalcId`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.deleteTermLastCloseDate`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.insert`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.selectByContCorpId`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.selectTermStartDate`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.updateFeeInfo`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.updateTermCloseDate`](../../biz/sql/biz22_fee_charge_calc.md), [`biz29_account.insertNotAccount`](../../biz/sql/biz29_account.md), [`dbConfig.getQuarterStartDate`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Biz20_Tab_FeeCharge` | `DatabaseFactoryICAM`, `DatabaseFactoryICAM2` |
| `getHtmlContent` | 783 | [`biz20_fee_charge.getHtmlContent`](../../biz/sql/biz20_fee_charge.md) | `Apr01_Edit_ApprDoc` |  |
| `apprCheck` | 796 | [`biz20_fee_charge.getHtmlContent`](../../biz/sql/biz20_fee_charge.md) | `Biz20_Tab_FeeCharge` |  |
| `updateCheck` | 807 | [`biz20_fee_charge.updateCheck`](../../biz/sql/biz20_fee_charge.md) | `Biz20_Edit_FeeCharge` |  |
| `confirmUpdate` | 818 | [`biz20_fee_charge.confirmUpdate`](../../biz/sql/biz20_fee_charge.md) | `Biz20_Tab_FeeCharge` |  |
| `updateApprId` | 833 | [`biz20_fee_charge.updateApprId`](../../biz/sql/biz20_fee_charge.md) | `Biz20_Tab_FeeCharge` |  |
| `modelUpdate` | 842 | `UpdateDataModel(biz20_fee_charge)` 동적 INSERT/UPDATE | `Biz20_Edit_FeeCharge` | `UpdateDataModel` |
| `deleteList` | 851 | [`biz20_fee_charge.deleteByFeeChargeId`](../../biz/sql/biz20_fee_charge.md) | `Biz20_Tab_FeeCharge` |  |
| `update` | 864 | `UpdateDataModel(biz20_fee_charge)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 869 | `UpdateDataModel(biz20_fee_charge)` 동적 DELETE | - | `UpdateDataModel` |
