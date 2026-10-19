# pay31_insure_apply

`server/pay/mapper/pay31_insure_apply.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 35 | [`emp01_person`](../../../db/tables/emp.md), [`pay31_insure_apply`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay31_InsureApply.selectById` |
| `selectByPersonId` | select | 47 | [`emp01_person`](../../../db/tables/emp.md), [`pay31_insure_apply`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay31_InsureApply.selectByPersonId` |
| `selectByCompanyId` | select | 62 | [`emp01_person`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay31_insure_apply`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate`, `f_trunc` | `pay.Pay31_InsureApply.selectByCompanyId` |
| `insert1` | insert | 105 | [`pay31_insure_apply`](../../../db/tables/pay.md) | `f_create_seq` | `pay.Pay31_InsureApply.insert1` |
| `insert3-2` | insert | 128 | [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay31_insure_apply`](../../../db/tables/pay.md) | `f_create_seq`, `f_get_datedif` | `pay.Pay31_InsureApply.insert3` |
| `insert3-4` | insert | 162 | [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay31_insure_apply`](../../../db/tables/pay.md) | `f_create_seq`, `f_get_datedif` | `pay.Pay31_InsureApply.insert3` |
| `excelInsert` | insert | 228 | [`pay31_insure_apply`](../../../db/tables/pay.md) | `f_create_seq` | - |
| `updateModel` | update | 252 | [`pay31_insure_apply`](../../../db/tables/pay.md) |  | `pay.Pay31_InsureApply.updateList` |
| `delete3` | delete | 261 | [`pay31_insure_apply`](../../../db/tables/pay.md) |  | `pay.Pay31_InsureApply.insert3` |
