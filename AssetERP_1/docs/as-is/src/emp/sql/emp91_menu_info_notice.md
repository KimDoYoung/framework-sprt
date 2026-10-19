# emp91_menu_info_notice

`server/emp/mapper/emp91_menu_info_notice.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`emp91_menu_info_notice`](../../../db/tables/emp.md) |  | `emp.Emp91_MenuInfoNotice.selectById` |
| `selectByPersonId` | select | 22 | [`emp91_menu_info_notice`](../../../db/tables/emp.md), [`sys06_menu`](../../../db/tables/sys.md) |  | `emp.Emp91_MenuInfoNotice.selectByPersonId` |
| `selectByText` | select | 32 | [`emp91_menu_info_notice`](../../../db/tables/emp.md), [`sys06_menu`](../../../db/tables/sys.md) |  | `emp.Emp91_MenuInfoNotice.selectByText` |
| `selectByMenuId` | select | 43 | [`emp91_menu_info_notice`](../../../db/tables/emp.md) |  | `emp.Emp91_MenuInfoNotice.updatePersonId` |
| `getList` | select | 50 | [`emp91_menu_info_notice`](../../../db/tables/emp.md) |  | `emp.Emp91_MenuInfoNotice.getList` |
| `insert` | insert | 57 | [`emp91_menu_info_notice`](../../../db/tables/emp.md) |  | `emp.Emp91_MenuInfoNotice.updatePersonId` |
| `deletePersonId` | delete | 73 | [`emp91_menu_info_notice`](../../../db/tables/emp.md) |  | `emp.Emp91_MenuInfoNotice.deletePersonId` |
