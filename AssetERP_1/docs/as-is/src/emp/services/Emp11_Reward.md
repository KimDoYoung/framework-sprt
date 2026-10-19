# emp.Emp11_Reward

`server/emp/Emp11_Reward.java`

서비스 키 `emp.Emp11_Reward.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 20 | [`emp11_reward.selectByPersonId`](../../emp/sql/emp11_reward.md) | `Emp11_TabPage_Reward` |  |
| `selectByHistory` | 31 | [`emp11_reward.selectByHistory`](../../emp/sql/emp11_reward.md) | `Emp00_Tab_ChangeHistory` |  |
| `update` | 37 | `UpdateDataModel(emp11_reward)` 동적 INSERT/UPDATE | `Emp11_TabPage_Reward` | `UpdateDataModel` |
| `delete` | 42 | `UpdateDataModel(emp11_reward)` 동적 DELETE | `Emp11_TabPage_Reward` | `UpdateDataModel` |
