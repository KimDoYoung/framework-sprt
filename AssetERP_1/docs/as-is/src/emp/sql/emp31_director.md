# emp31_director

`server/emp/mapper/emp31_director.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 36 | [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp31_director`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `to_decrypts` | `emp.Emp31_Director.selectById` |
| `selectByPersonId` | select | 58 | [`emp31_director`](../../../db/tables/emp.md) |  | `emp.Emp31_Director.updateList` |
| `selectByText` | select | 64 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp07_career`](../../../db/tables/emp.md), [`emp31_director`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `to_decrypts` | `emp.Emp31_Director.selectByText`, `sys.Sys99_Print.insertRdDirector02` |
| `selectByTextReport` | select | 121 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp07_career`](../../../db/tables/emp.md), [`emp31_director`](../../../db/tables/emp.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `gettdm30roleallc`, `to_decrypts` | `emp.Emp31_Director.selectByTextReport`, `sys.Sys99_Print.insertRdDirector01` |
