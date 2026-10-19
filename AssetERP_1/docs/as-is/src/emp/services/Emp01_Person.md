# emp.Emp01_Person

`server/emp/Emp01_Person.java`

서비스 키 `emp.Emp01_Person.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | [`emp01_person.selectById`](../../emp/sql/emp01_person.md) | - |  |
| `selectByText` | 37 | [`emp01_person.selectByText`](../../emp/sql/emp01_person.md) | - |  |
| `selectByCompanyId` | 52 | [`emp01_person.selectByCompanyId`](../../emp/sql/emp01_person.md) | - |  |
| `selectByPaging` | 57 | [`emp01_person.selectByCompanyIdPaging`](../../emp/sql/emp01_person.md), [`emp01_person.selectByCompanyIdTotal`](../../emp/sql/emp01_person.md) | `Sms03_Page_UserListAdmin` |  |
| `selectBySearchTextPaging` | 63 | [`emp01_person.selectBySearchTextPaging`](../../emp/sql/emp01_person.md), [`emp01_person.selectBySearchTextTotal`](../../emp/sql/emp01_person.md) | `Emp01_Tab_UserInfo` |  |
| `selectByLoginUserPaging` | 69 | [`emp01_person.selectByLoginUserPaging`](../../emp/sql/emp01_person.md), [`emp01_person.selectByLoginUserTotal`](../../emp/sql/emp01_person.md) | `Sys86_Tab_Websocket` | `BroadcastWebsocket` |
| `selectByPersonId` | 81 | [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md) | `AlarmPopup`, `Dcr10_Lookup_MailSender`, `Emp10_Lookup_MailRetrieve` |  |
| `checkUsePersonId` | 97 | [`emp01_person.checkUsePersonId`](../../emp/sql/emp01_person.md) | `Emp01_TabPage_Person` |  |
| `empNoCheck` | 115 | [`emp01_person.empNoCheck`](../../emp/sql/emp01_person.md) | `Emp03_Edit_Person` |  |
| `updatePerson` | 130 | `UpdateDataModel(emp01_person)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 140 | `UpdateDataModel(emp01_person)` 동적 INSERT/UPDATE | `Emp01_TabPage_Person` | `UpdateDataModel` |
| `deleteTarget` | 165 | [`emp01_person.insertEmpDel`](../../emp/sql/emp01_person.md), `UpdateDataModel(emp01_person)` 동적 DELETE | `Emp01_TabPage_Person` | `UpdateDataModel` |
| `delete` | 172 | `UpdateDataModel(emp01_person)` 동적 DELETE | - | `UpdateDataModel` |
| `changeMail` | 177 | [`emp01_person.changeMail`](../../emp/sql/emp01_person.md), [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md) | `Emp10_Lookup_MailRetrieve` |  |
| `resetMail` | 209 | [`emp01_person.resetMail`](../../emp/sql/emp01_person.md) | `Emp10_Lookup_MailRetrieve` |  |
| `selectByYearList` | 215 | [`emp01_person.selectByYearList`](../../emp/sql/emp01_person.md) | `Emp20_Tab_YearList` |  |
| `updateLocation` | 229 | [`emp01_person.updateLocation`](../../emp/sql/emp01_person.md) | - |  |
| `updateTheme` | 236 | [`emp01_person.updateTheme`](../../emp/sql/emp01_person.md) | `MyThemePopup` |  |
| `updateLockYn` | 243 | [`emp01_person.updateLockYn`](../../emp/sql/emp01_person.md) | `Sys25_Tab_ResetPassword` |  |
| `updateMenuFixYn` | 248 | [`emp01_person.updateMenuFixYn`](../../emp/sql/emp01_person.md) | `MenuGrid` |  |
