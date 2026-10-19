# emp.Emp57_AddrBookGroup

`server/emp/Emp57_AddrBookGroup.java`

서비스 키 `emp.Emp57_AddrBookGroup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`emp57_addr_book_group.selectById`](../../emp/sql/emp57_addr_book_group.md) | - |  |
| `selectByParentId` | 26 | [`emp57_addr_book_group.selectByParentId`](../../emp/sql/emp57_addr_book_group.md) | `Emp57_Lookup_DetailList`, `Emp57_Lookup_List`, `Emp57_TabPage_Insert` |  |
| `getPersonList` | 36 | [`emp57_addr_book_group.getPersonList`](../../emp/sql/emp57_addr_book_group.md) | `Emp57_Lookup_Insert` |  |
| `getList` | 46 | [`emp57_addr_book_group.getList`](../../emp/sql/emp57_addr_book_group.md) | `Emp57_Lookup_List` |  |
| `deleteAll` | 58 | [`emp57_addr_book_group.deleteAll`](../../emp/sql/emp57_addr_book_group.md) | `Emp57_Lookup_Insert` |  |
| `modelUpdate` | 64 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp57_addr_book_group)` 동적 INSERT/UPDATE | `Emp57_Edit_GroupName` | `UpdateDataModel` |
| `update` | 77 | `UpdateDataModel(emp57_addr_book_group)` 동적 INSERT/UPDATE | `Emp57_TabPage_Insert` | `UpdateDataModel` |
| `delete` | 82 | `UpdateDataModel(emp57_addr_book_group)` 동적 DELETE | `Emp57_TabPage_Insert` | `UpdateDataModel` |
