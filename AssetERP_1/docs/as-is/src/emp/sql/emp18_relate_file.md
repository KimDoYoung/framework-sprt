# emp18_relate_file

`server/emp/mapper/emp18_relate_file.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectByPersonId` | select | 22 | [`emp01_person`](../../../db/tables/emp.md), [`emp18_relate_file`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) |  | `emp.Emp18_RelateFile.selectByPersonId` |
| `selectById` | select | 35 | [`emp01_person`](../../../db/tables/emp.md), [`emp18_relate_file`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) |  | - |
