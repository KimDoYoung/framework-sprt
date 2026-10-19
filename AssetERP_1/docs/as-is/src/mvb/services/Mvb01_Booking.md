# mvb.Mvb01_Booking

`server/mvb/Mvb01_Booking.java`

서비스 키 `mvb.Mvb01_Booking.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByApprDate` | 23 | `mvb01_booking.selectByApprDate`(없음) | - |  |
| `selectByDate` | 36 | [`mvb01_booking.selectByDate`](../../mvb/sql/mvb01_booking.md) | - | `DateUtil` |
| `selectByDateUnion` | 60 | [`mvb01_booking.selectByDateUnion`](../../mvb/sql/mvb01_booking.md) | - | `DateUtil` |
| `deleteByBookingId` | 83 | `mvb01_booking.deleteByBookingId`(없음) | - |  |
| `checkAvailable` | 94 | `mvb01_booking.checkAvailable`(없음) | - |  |
| `checkAvailablePeriod` | 120 | - | - | `DateUtil` |
| `callProcedure` | 138 | `mvb01_booking.callProcedure`(없음) | - |  |
| `update` | 173 | - | - |  |
| `delete` | 176 | - | - |  |
