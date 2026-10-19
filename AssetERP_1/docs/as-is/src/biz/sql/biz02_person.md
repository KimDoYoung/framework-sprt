# biz02_person

`server/biz/mapper/biz02_person.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`emp03_trans`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_org_nm` | `biz.Biz02_Person.selectById` |
| `selectByInternal` | select | 40 | [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_org_nm` | `biz.Biz02_Person.selectByInternal` |
| `selectByExternal` | select | 62 | [`biz02_person`](../../../db/tables/biz.md) |  | `biz.Biz01_Promo.updateAdd`, `biz.Biz02_Person.selectByExternal` |
| `selectByEntertmExpense` | select | 70 | [`act01_account_code`](../../../db/tables/act.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`biz90_limit`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md) | `f_nvl` | `biz.Biz02_Person.selectByEntertmExpense` |
| `selectByEmpId` | select | 171 | [`biz02_person`](../../../db/tables/biz.md) |  | `biz.Biz02_Person.insertEmpId` |
| `insert` | insert | 178 | [`biz02_person`](../../../db/tables/biz.md) |  | `biz.Biz01_Promo.updateAdd`, `biz.Biz02_Person.insertEmpId` |
| `update` | update | 224 | [`biz02_person`](../../../db/tables/biz.md) |  | `biz.Biz01_Promo.updateAdd` |
| `delete` | delete | 231 | [`biz02_person`](../../../db/tables/biz.md) |  | `biz.Biz01_Promo.delete` |
| `deleteByEmpId` | delete | 237 | [`biz02_person`](../../../db/tables/biz.md) |  | `biz.Biz02_Person.deleteByEmpId` |
