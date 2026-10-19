# act.Act09_AccountNum

`server/act/Act09_AccountNum.java`

서비스 키 `act.Act09_AccountNum.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 39 | [`act09_account_num.selectById`](../../act/sql/act09_account_num.md) | - |  |
| `selectByRetrieve` | 58 | [`act09_account_num.selectByRetrieve`](../../act/sql/act09_account_num.md) | `Act09_Tab_AccountNum` |  |
| `update` | 72 | `UpdateDataModel(act09_account_num)` 동적 INSERT/UPDATE | `Act09_Tab_AccountNum` | `UpdateDataModel` |
| `delete` | 81 | `UpdateDataModel(act09_account_num)` 동적 DELETE | `Act09_Tab_AccountNum` | `UpdateDataModel` |
