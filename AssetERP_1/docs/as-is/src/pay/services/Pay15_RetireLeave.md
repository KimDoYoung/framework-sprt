# pay.Pay15_RetireLeave

`server/pay/Pay15_RetireLeave.java`

서비스 키 `pay.Pay15_RetireLeave.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`pay15_retire_leave.selectById`](../../pay/sql/pay15_retire_leave.md) | - |  |
| `selectByMonthId` | 24 | [`pay15_retire_leave.selectByMonthId`](../../pay/sql/pay15_retire_leave.md) | `Pay10_Lookup_RemLeaveDays`, `Pay15_TabPage_RetireLeave` |  |
| `getRetireLeave` | 35 | [`pay15_retire_leave.getRetireLeave`](../../pay/sql/pay15_retire_leave.md) | `Pay15_TabPage_RetireLeave` |  |
| `calcRetireLeaveDays` | 48 | [`pay15_retire_leave.calcRemLeaveDays`](../../pay/sql/pay15_retire_leave.md) | `Pay10_Lookup_RemLeaveDays` |  |
| `selectRemLeaveDays` | 57 | [`pay15_retire_leave.selectRemLeaveDays`](../../pay/sql/pay15_retire_leave.md) | `Pay10_Lookup_RemLeaveDays` |  |
| `update` | 62 | `UpdateDataModel(pay15_retire_leave)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 67 | `UpdateDataModel(pay15_retire_leave)` 동적 DELETE | - | `UpdateDataModel` |
