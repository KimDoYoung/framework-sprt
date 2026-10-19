# emp02_others

`server/emp/mapper/emp02_others.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 39 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `emp.Emp02_Others.selectById` |
| `selectByPersonId` | select | 53 | [`emp02_others`](../../../db/tables/emp.md) |  | `emp.Emp02_Others.selectByPersonId` |
| `updateHireDate` | update | 59 | [`emp02_others`](../../../db/tables/emp.md) |  | `emp.Emp02_Others.updateHireDate` |
| `upsert` | insert | 66 | [`emp02_others`](../../../db/tables/emp.md) | `f_create_seq`, `to_encrypts` | `emp.Emp02_Others.updateOne`, `emp.Emp02_Others.updatePerson` |
| `insert` | insert | 137 | [`emp02_others`](../../../db/tables/emp.md) |  | `emp.Emp00_TransInfo.update` |
| `insertCopy` | insert | 149 | [`emp02_others`](../../../db/tables/emp.md) |  | `emp.Emp04_AddTitle.updateList` |
| `deleteByPersonId` | delete | 199 | [`emp02_others`](../../../db/tables/emp.md) |  | - |
