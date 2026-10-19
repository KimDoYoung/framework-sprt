# emp.Emp60_Sign

`server/emp/Emp60_Sign.java`

서비스 키 `emp.Emp60_Sign.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`emp60_sign.selectById`](../../emp/sql/emp60_sign.md) | - |  |
| `selectByPersonId` | 25 | [`emp60_sign.selectByPersonId`](../../emp/sql/emp60_sign.md) | `Emp60_Tab_Sign` |  |
| `notSignIdList` | 35 | [`emp60_sign.notSignIdList`](../../emp/sql/emp60_sign.md) | `Emp60_Tab_Sign` |  |
| `deleteChk` | 48 | [`apr04_appr_step.signIdListChk`](../../apr/sql/apr04_appr_step.md) | `Emp60_Tab_Sign` |  |
| `update` | 65 | `UpdateDataModel(emp60_sign)` 동적 INSERT/UPDATE | `Emp60_Tab_Sign` | `UpdateDataModel` |
| `delete` | 70 | `UpdateDataModel(emp60_sign)` 동적 DELETE | `Emp60_Tab_Sign` | `UpdateDataModel` |
