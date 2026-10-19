# car.Car03_Booking

`server/car/Car03_Booking.java`

서비스 키 `car.Car03_Booking.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | [`car03_booking.selectById`](../../car/sql/car03_booking.md) | `Car03_Popup_BookingReg` |  |
| `selectByList` | 29 | [`car03_booking.selectByList`](../../car/sql/car03_booking.md) | `Car03_Tab_List` |  |
| `selectByDate` | 39 | [`car03_booking.selectByDate`](../../car/sql/car03_booking.md) | `Car03_Tab_DayofMonth` | `DateUtil` |
| `selectByInfoId` | 53 | [`car03_booking.selectByInfoId`](../../car/sql/car03_booking.md) | `Car01_Tab_Info` |  |
| `selectByDateUnion` | 62 | [`car03_booking.selectByDateUnion`](../../car/sql/car03_booking.md) | `Car03_Popup_BookingReg` | `DateUtil` |
| `update` | 76 | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE | `Car03_Popup_BookingReg` | `DateUtil`, `UpdateDataModel` |
| `updateList` | 114 | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE | `Car03_Popup_BookingReg` | `Calendar`, `DateUtil`, `UpdateDataModel` |
| `updateAdmin` | 177 | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE, `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE | `Car04_Lookup_PublicJournalAdmin` | `DateUtil`, `UpdateDataModel` |
| `updateListAdmin` | 227 | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE, `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE | `Car04_Lookup_PublicJournalAdmin` | `Calendar`, `DateUtil`, `UpdateDataModel` |
| `updateJournalModel` | 302 | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE, `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE | `Car04_Edit_PublicJournalAdmin` | `DateUtil`, `UpdateDataModel` |
| `deleteByBookingId` | 348 | [`car03_booking.deleteByBookingId`](../../car/sql/car03_booking.md) | - |  |
| `deleteByJournalList` | 357 | [`car03_booking.deleteByBookingId`](../../car/sql/car03_booking.md) | `Car04_Tab_PublicJournalAdmin` |  |
| `delete` | 367 | `UpdateDataModel(car03_booking)` 동적 DELETE | `Car03_Tab_DayofMonth` | `UpdateDataModel` |
| `deleteList` | 372 | [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), `UpdateDataModel(car03_booking)` 동적 DELETE | `Car03_Tab_List` | `UpdateDataModel` |
