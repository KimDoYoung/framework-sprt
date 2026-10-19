# emp90_notice

`server/emp/mapper/emp90_notice.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`emp90_notice`](../../../db/tables/emp.md) |  | `emp.Emp90_Notice.selectById` |
| `selectByPersonId` | select | 22 | [`emp90_notice`](../../../db/tables/emp.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `emp.Emp90_Notice.selectByPersonId` |
| `selectByText` | select | 39 | [`emp90_notice`](../../../db/tables/emp.md) |  | `emp.Emp90_Notice.deleteList`, `emp.Emp90_Notice.updateList` |
| `insert` | insert | 46 | [`emp90_notice`](../../../db/tables/emp.md) | `f_create_seq` | `emp.Emp90_Notice.updateList` |
| `delete` | delete | 55 | [`emp90_notice`](../../../db/tables/emp.md) |  | `emp.Emp90_Notice.deleteList` |
