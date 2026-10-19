# emp04_add_title

`server/emp/mapper/emp04_add_title.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 32 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm` | - |
| `selectByPersonId` | select | 47 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm` | `emp.Emp04_AddTitle.selectByPersonId`, `emp.Emp04_AddTitle.updateList` |
| `getAddTitleList` | select | 64 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_trunc` | `emp.Emp04_AddTitle.getAddTitleList` |
