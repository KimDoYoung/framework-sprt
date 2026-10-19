# sys.Sys91_AdviceMember

`server/sys/Sys91_AdviceMember.java`

서비스 키 `sys.Sys91_AdviceMember.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`sys91_advice_member.selectById`](../../sys/sql/sys91_advice_member.md) | - |  |
| `selectByAll` | 22 | [`sys91_advice_member.selectByAll`](../../sys/sql/sys91_advice_member.md) | `Sys91_Tab_AdviceMember` |  |
| `update` | 28 | `UpdateDataModel(sys91_advice_member)` 동적 INSERT/UPDATE | `Sys91_Tab_AdviceMember` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(sys91_advice_member)` 동적 DELETE | `Sys91_Tab_AdviceMember` | `UpdateDataModel` |
