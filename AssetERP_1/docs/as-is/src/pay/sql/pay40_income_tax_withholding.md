# pay40_income_tax_withholding

`server/pay/mapper/pay40_income_tax_withholding.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`apr01_appr`](../../../db/tables/apr.md), [`pay40_income_tax_withholding`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `pay.Pay40_IncomeTaxWithholding.selectById`, `pay.Pay40_IncomeTaxWithholding.updateList` |
| `selectByCompanyId` | select | 36 | [`apr01_appr`](../../../db/tables/apr.md), [`pay40_income_tax_withholding`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `pay.Pay40_IncomeTaxWithholding.selectByCompanyId` |
| `updateApprId` | update | 49 | [`pay40_income_tax_withholding`](../../../db/tables/pay.md) |  | `pay.Pay40_IncomeTaxWithholding.updateApprId` |
| `insert` | insert | 61 | [`pay40_income_tax_withholding`](../../../db/tables/pay.md) |  | `pay.Pay40_IncomeTaxWithholding.updateList` |
