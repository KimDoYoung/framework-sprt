# emp57_addr_book_group

`server/emp/mapper/emp57_addr_book_group.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`emp01_person`](../../../db/tables/emp.md), [`emp10_addr_book`](../../../db/tables/emp.md), [`emp57_addr_book_group`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp57_AddrBookGroup.selectById` |
| `selectByParentId` | select | 78 | [`emp01_person`](../../../db/tables/emp.md), [`emp10_addr_book`](../../../db/tables/emp.md), [`emp57_addr_book_group`](../../../db/tables/emp.md) | `f_get_emptrans`, `f_sysdate` | `emp.Emp57_AddrBookGroup.selectByParentId` |
| `getPersonList` | select | 125 | [`emp01_person`](../../../db/tables/emp.md), [`emp57_addr_book_group`](../../../db/tables/emp.md) | `f_emp_kor_nm` | `emp.Emp57_AddrBookGroup.getPersonList` |
| `getList` | select | 157 | [`emp01_person`](../../../db/tables/emp.md), [`emp57_addr_book_group`](../../../db/tables/emp.md) |  | `emp.Emp57_AddrBookGroup.getList` |
| `deleteAll` | delete | 174 | [`emp57_addr_book_group`](../../../db/tables/emp.md) |  | `emp.Emp57_AddrBookGroup.deleteAll` |
