# emp.Emp10_AddrBook

`server/emp/Emp10_AddrBook.java`

서비스 키 `emp.Emp10_AddrBook.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 38 | [`emp10_addr_book.selectByPersonId`](../../emp/sql/emp10_addr_book.md) | - |  |
| `selectByText` | 43 | [`emp10_addr_book.selectByText`](../../emp/sql/emp10_addr_book.md) | `Emp10_Lookup_List`, `Emp10_Lookup_MailAddress`, `Emp10_Tab_AddrBook` |  |
| `selectByPublicText` | 52 | [`emp10_addr_book.selectByPublicText`](../../emp/sql/emp10_addr_book.md) | `Emp10_Lookup_List`, `Emp10_Lookup_MailAddress`, `Emp10_Tab_PublicAddrBook` |  |
| `update` | 61 | `UpdateDataModel(emp10_addr_book)` 동적 INSERT/UPDATE | `Emp10_Tab_AddrBook`, `Emp10_Tab_PublicAddrBook` | `UpdateDataModel` |
| `delete` | 70 | `UpdateDataModel(emp10_addr_book)` 동적 DELETE | `Emp10_Tab_AddrBook`, `Emp10_Tab_PublicAddrBook` | `UpdateDataModel` |
