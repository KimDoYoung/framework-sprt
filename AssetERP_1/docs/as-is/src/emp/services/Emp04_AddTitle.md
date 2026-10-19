# emp.Emp04_AddTitle

`server/emp/Emp04_AddTitle.java`

서비스 키 `emp.Emp04_AddTitle.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 28 | [`emp04_add_title.selectByPersonId`](../../emp/sql/emp04_add_title.md) | `Emp01_TabPage_Person`, `Emp04_TabPage_AddTitle` |  |
| `getAddTitleList` | 39 | [`emp04_add_title.getAddTitleList`](../../emp/sql/emp04_add_title.md) | `Emp04_Lookup_AddTitleList`, `LoginPage` |  |
| `updateList` | 46 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.insert`](../../emp/sql/emp01_person.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp02_others.insertCopy`](../../emp/sql/emp02_others.md), [`emp03_trans.insertAddTitle`](../../emp/sql/emp03_trans.md), [`emp03_trans.updateAddTitle`](../../emp/sql/emp03_trans.md), [`emp04_add_title.selectByPersonId`](../../emp/sql/emp04_add_title.md), `UpdateDataModel(emp04_add_title)` 동적 INSERT/UPDATE | `Emp04_Edit_AddTitle` | `UpdateDataModel` |
| `deleteList` | 120 | [`apr01_appr.selectByPersonId`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.selectByPersonId`](../../apr/sql/apr04_appr_step.md), [`emp01_person.deleteByPersonId`](../../emp/sql/emp01_person.md), [`emp01_person.insertEmpDel`](../../emp/sql/emp01_person.md) | `Emp04_TabPage_AddTitle` |  |
| `update` | 145 | `UpdateDataModel(emp04_add_title)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 150 | `UpdateDataModel(emp04_add_title)` 동적 DELETE | `Emp04_TabPage_AddTitle` | `UpdateDataModel` |
