# biz52_erp_fee

`server/biz/mapper/biz52_erp_fee.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 41 | [`biz52_erp_fee`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz52_ErpFee.selectById` |
| `selectByErpContCorpId` | select | 52 | [`biz52_erp_fee`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz52_ErpFee.selectByErpContCorpId` |
| `selectByStartDate` | select | 64 | [`biz52_erp_fee`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz52_ErpFee.selectByStartDate` |
| `selectByDate` | select | 78 | [`biz52_erp_fee`](../../../db/tables/biz.md) |  | `biz.Biz55_ErpFeeCharge.updateErpCompany` |
| `selectDefaultData` | select | 134 | [`biz52_erp_fee`](../../../db/tables/biz.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) | `f_today` | `biz.Biz52_ErpFee.selectDefaultData` |
| `deleteByErpContCorpId` | delete | 220 | [`biz52_erp_fee`](../../../db/tables/biz.md) |  | `biz.Biz51_ErpContCorp.deleteList` |
