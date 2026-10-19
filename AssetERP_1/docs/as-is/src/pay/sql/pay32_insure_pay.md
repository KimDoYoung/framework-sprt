# pay32_insure_pay

`server/pay/mapper/pay32_insure_pay.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`emp01_person`](../../../db/tables/emp.md), [`pay32_insure_pay`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay32_InsurePay.selectById` |
| `selectByCompanyId` | select | 55 | [`emp01_person`](../../../db/tables/emp.md), [`pay32_insure_pay`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay32_InsurePay.selectByCompanyId` |
| `selectByPersonId` | select | 78 | [`emp01_person`](../../../db/tables/emp.md), [`pay32_insure_pay`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay32_InsurePay.selectByPersonId` |
| `createInsureAdjust` | select | 93 | - | `f_calc_4insure_adjust` | `pay.Pay31_InsureApply.insert3`, `pay.Pay31_InsureApply.updateList` |
| `deleteByDate` | delete | 97 | [`pay32_insure_pay`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.deleteAll` |
| `deleteByPersonId` | delete | 104 | [`pay32_insure_pay`](../../../db/tables/pay.md) |  | `pay.Pay31_InsureApply.deleteList` |
