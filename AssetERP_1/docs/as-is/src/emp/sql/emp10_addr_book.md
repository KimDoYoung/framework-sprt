# emp10_addr_book

`server/emp/mapper/emp10_addr_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`emp10_addr_book`](../../../db/tables/emp.md) | `f_emp_kor_nm` | - |
| `selectByPersonId` | select | 29 | [`emp10_addr_book`](../../../db/tables/emp.md) |  | `emp.Emp10_AddrBook.selectByPersonId` |
| `selectByText` | select | 36 | [`emp10_addr_book`](../../../db/tables/emp.md) |  | `emp.Emp10_AddrBook.selectByText` |
| `selectByPublicText` | select | 49 | [`emp01_person`](../../../db/tables/emp.md), [`emp10_addr_book`](../../../db/tables/emp.md) | `f_emp_kor_nm` | `emp.Emp10_AddrBook.selectByPublicText` |
