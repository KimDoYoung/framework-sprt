# biz51_erp_cont_corp

`server/biz/mapper/biz51_erp_cont_corp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 38 | [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz52_erp_fee`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz51_ErpContCorp.selectById` |
| `selectByContStatusCode` | select | 65 | [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz52_erp_fee`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz51_ErpContCorp.selectByContStatusCode` |
| `selectErpCompany` | select | 100 | [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz52_erp_fee`](../../../db/tables/biz.md), [`biz55_erp_fee_charge`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `biz.Biz51_ErpContCorp.selectErpCompany` |
| `deleteById` | delete | 143 | [`biz51_erp_cont_corp`](../../../db/tables/biz.md) |  | `biz.Biz51_ErpContCorp.deleteList` |
