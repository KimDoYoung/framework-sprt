# biz.Biz02_Person

`server/biz/Biz02_Person.java`

서비스 키 `biz.Biz02_Person.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`biz02_person.selectById`](../../biz/sql/biz02_person.md) | - |  |
| `selectByInternal` | 26 | [`biz02_person.selectByInternal`](../../biz/sql/biz02_person.md) | `Biz02_Grid_InternalList` |  |
| `selectByExternal` | 32 | [`biz02_person.selectByExternal`](../../biz/sql/biz02_person.md) | `Biz02_Grid_ExternalList` |  |
| `selectByEntertmExpense` | 38 | [`biz02_person.selectByEntertmExpense`](../../biz/sql/biz02_person.md) | `Biz02_TabPage_CompanyEntertmExpense` |  |
| `insertEmpId` | 59 | [`biz02_person.insert`](../../biz/sql/biz02_person.md), [`biz02_person.selectByEmpId`](../../biz/sql/biz02_person.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) | `Biz01_Edit_Card`, `Biz01_Edit_Other`, `Biz01_Lookup_CardManagement` |  |
| `deleteByEmpId` | 86 | [`biz02_person.deleteByEmpId`](../../biz/sql/biz02_person.md) | - |  |
| `modelUpdate` | 99 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz02_person)` 동적 INSERT/UPDATE | `Biz02_Grid_ExternalList`, `Biz02_Grid_InternalList` | `UpdateDataModel` |
| `update` | 113 | `UpdateDataModel(biz02_person)` 동적 INSERT/UPDATE | `Biz02_Grid_ExternalList`, `Biz02_Grid_InternalList` | `UpdateDataModel` |
| `delete` | 118 | `UpdateDataModel(biz02_person)` 동적 DELETE | `Biz02_Grid_ExternalList`, `Biz02_Grid_InternalList` | `UpdateDataModel` |
