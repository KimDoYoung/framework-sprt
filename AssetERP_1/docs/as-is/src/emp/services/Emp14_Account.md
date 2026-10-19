# emp.Emp14_Account

`server/emp/Emp14_Account.java`

서비스 키 `emp.Emp14_Account.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 21 | [`emp14_account.selectByPersonId`](../../emp/sql/emp14_account.md) | `Emp14_TabPage_Account` |  |
| `update` | 32 | [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), `UpdateDataModel(emp14_account)` 동적 INSERT/UPDATE | `Emp14_TabPage_Account` | `UpdateDataModel` |
| `delete` | 46 | `UpdateDataModel(emp14_account)` 동적 DELETE | `Emp14_TabPage_Account` | `UpdateDataModel` |
