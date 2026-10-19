# fnd.Fnd32_Account

`server/fnd/Fnd32_Account.java`

서비스 키 `fnd.Fnd32_Account.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`fnd32_account.selectById`](../../fnd/sql/fnd32_account.md) | - |  |
| `selectByText` | 26 | [`fnd32_account.selectByText`](../../fnd/sql/fnd32_account.md) | `Fnd32_Tab_Account` |  |
| `updateList` | 36 | [`fnd32_account.encrypts`](../../fnd/sql/fnd32_account.md), `UpdateDataModel(fnd32_account)` 동적 INSERT/UPDATE | `Fnd32_Tab_Account` | `UpdateDataModel` |
| `copyUpdate` | 50 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd32_account.encrypts`](../../fnd/sql/fnd32_account.md), `UpdateDataModel(fnd32_account)` 동적 INSERT/UPDATE | `Fnd32_Tab_Account` | `UpdateDataModel` |
| `update` | 66 | `UpdateDataModel(fnd32_account)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 71 | `UpdateDataModel(fnd32_account)` 동적 DELETE | `Fnd32_Tab_Account` | `UpdateDataModel` |
