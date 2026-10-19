# biz11_cont_history

`server/biz/mapper/biz11_cont_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 52 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md) | `f_cdnm`, `f_emp_kor_nm` | `biz.Biz11_ContHistory.selectById` |
| `selectByDate` | select | 67 | [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `selectByContCorpId` | select | 90 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md) | `f_cdnm`, `f_emp_kor_nm` | `biz.Biz11_ContHistory.selectByContCorpId` |
| `selectContCorp` | select | 114 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md) | `f_get_datedif`, `f_get_last_day`, `f_get_quarter_date` | `biz.Biz20_FeeCharge.createFeeCharge` |
| `selectContCorpDtl` | select | 183 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md) | `f_get_quarter_date` | - |
| `selectByStartDate` | select | 242 | [`biz11_cont_history`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `deleteCheck` | select | 251 | [`biz11_cont_history`](../../../db/tables/biz.md) |  | `biz.Biz11_ContHistory.deleteCheck` |
| `updateDate` | update | 258 | [`biz11_cont_history`](../../../db/tables/biz.md) | `f_get_date`, `f_today` | `biz.Biz20_FeeCharge.createFeeCharge` |
| `deleteContCorpId` | delete | 271 | [`biz11_cont_history`](../../../db/tables/biz.md) |  | `biz.Biz11_ContHistory.deleteContCorpId` |
