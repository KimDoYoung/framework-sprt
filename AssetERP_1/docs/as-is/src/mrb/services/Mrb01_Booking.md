# mrb.Mrb01_Booking

`server/mrb/Mrb01_Booking.java`

서비스 키 `mrb.Mrb01_Booking.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`mrb01_booking.selectById`](../../mrb/sql/mrb01_booking.md) | `Mrb01_Popup_MeetingRoomReg` |  |
| `selectByApprDate` | 28 | `mrb01_booking.selectByApprDate`(없음) | - |  |
| `selectByList` | 38 | [`mrb01_booking.selectByList`](../../mrb/sql/mrb01_booking.md) | `Mrb01_Tab_List` |  |
| `selectByDate` | 48 | [`mrb01_booking.selectByDate`](../../mrb/sql/mrb01_booking.md) | `Mrb01_Tab_DayofMonth` | `DateUtil` |
| `selectByDateUnion` | 62 | [`mrb01_booking.selectByDateUnion`](../../mrb/sql/mrb01_booking.md) | `Mrb01_Popup_MeetingRoomReg` | `DateUtil` |
| `selectByBookingDate` | 76 | [`mrb01_booking.selectByBookingDate`](../../mrb/sql/mrb01_booking.md) | `Monitoring_Page_Relate` |  |
| `selectByBookingDatePaging` | 81 | [`mrb01_booking.selectByBookingDatePaging`](../../mrb/sql/mrb01_booking.md), [`mrb01_booking.selectByBookingDatePagingTotal`](../../mrb/sql/mrb01_booking.md) | - |  |
| `deleteByBookingId` | 87 | [`mrb01_booking.deleteByBookingId`](../../mrb/sql/mrb01_booking.md) | - |  |
| `update` | 95 | [`mrb01_booking.confirmUpdate`](../../mrb/sql/mrb01_booking.md), [`mrb01_booking.deleteParentId`](../../mrb/sql/mrb01_booking.md), `UpdateDataModel(mrb01_booking)` 동적 INSERT/UPDATE | `Mrb01_Popup_MeetingRoomReg` | `DateUtil`, `UpdateDataModel` |
| `updateList` | 134 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`mrb01_booking.confirmUpdate`](../../mrb/sql/mrb01_booking.md), [`mrb01_booking.deleteParentId`](../../mrb/sql/mrb01_booking.md), `UpdateDataModel(mrb01_booking)` 동적 INSERT/UPDATE | `Mrb01_Popup_MeetingRoomReg` | `Calendar`, `DateUtil`, `UpdateDataModel` |
| `delete` | 198 | `UpdateDataModel(mrb01_booking)` 동적 DELETE | `Mrb01_Tab_DayofMonth` | `UpdateDataModel` |
| `deleteList` | 203 | [`mrb01_booking.deleteParentId`](../../mrb/sql/mrb01_booking.md), `UpdateDataModel(mrb01_booking)` 동적 DELETE | `Mrb01_Tab_List` | `UpdateDataModel` |
