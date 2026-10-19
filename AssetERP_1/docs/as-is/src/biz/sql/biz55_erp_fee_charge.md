# biz55_erp_fee_charge

`server/biz/mapper/biz55_erp_fee_charge.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 61 | [`biz55_erp_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz55_ErpFeeCharge.selectById` |
| `selectByStartDate` | select | 67 | [`apr01_appr`](../../../db/tables/apr.md), [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz55_erp_fee_charge`](../../../db/tables/biz.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm` | `biz.Biz55_ErpFeeCharge.selectByStartDate` |
| `selectByStdDate` | select | 94 | [`apr01_appr`](../../../db/tables/apr.md), [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz52_erp_fee`](../../../db/tables/biz.md), [`biz55_erp_fee_charge`](../../../db/tables/biz.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz55_ErpFeeCharge.selectByStdDate` |
| `selectByChargeDate` | select | 155 | [`ast05_tr_code`](../../../db/tables/ast.md), [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz55_erp_fee_charge`](../../../db/tables/biz.md) |  | `act.Act02_Journal.createJournalBiz`, `act.Act02_Journal.deleteJournalBiz` |
| `updateTrId` | update | 169 | [`biz55_erp_fee_charge`](../../../db/tables/biz.md) |  | `act.Act02_Journal.createJournalBiz`, `act.Act02_Journal.deleteJournalBiz` |
| `updateApprId` | update | 175 | [`biz55_erp_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz55_ErpFeeCharge.updateApprId` |
| `confirmUpdate` | update | 181 | [`biz55_erp_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz55_ErpFeeCharge.confirmUpdate` |
| `insertErpFeeCharge` | insert | 187 | [`biz55_erp_fee_charge`](../../../db/tables/biz.md) |  | `biz.Biz55_ErpFeeCharge.updateErpCompany` |
