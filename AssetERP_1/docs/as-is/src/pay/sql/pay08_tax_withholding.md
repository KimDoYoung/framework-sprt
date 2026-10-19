# pay08_tax_withholding

`server/pay/mapper/pay08_tax_withholding.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`emp01_person`](../../../db/tables/emp.md), [`pay08_tax_withholding`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md) |  | `pay.Pay08_TaxWithholding.selectById` |
| `selectByCompanyId` | select | 31 | [`emp01_person`](../../../db/tables/emp.md), [`pay08_tax_withholding`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md) |  | `pay.Pay08_TaxWithholding.selectByCompanyId` |
| `selectByPersonId` | select | 44 | [`emp01_person`](../../../db/tables/emp.md), [`pay08_tax_withholding`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md) |  | `pay.Pay08_TaxWithholding.selectByPersonId` |
| `insert` | insert | 57 | [`pay08_tax_withholding`](../../../db/tables/pay.md) | `f_sysdate` | - |
