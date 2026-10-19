# car03_booking

`server/car/mapper/car03_booking.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 33 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md) | `f_emp_kor_nm` | `car.Car03_Booking.selectById` |
| `selectByInfoId` | select | 43 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md) | `f_emp_kor_nm` | `car.Car03_Booking.selectByInfoId` |
| `selectByList` | select | 53 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md) | `f_emp_kor_nm`, `f_sysdate` | `car.Car03_Booking.selectByList` |
| `selectByDate` | select | 68 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md) | `f_emp_kor_nm`, `f_trunc` | `car.Car03_Booking.selectByDate` |
| `selectByDateUnion` | select | 90 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md) | `f_emp_kor_nm`, `f_trunc` | `car.Car03_Booking.selectByDateUnion` |
| `confirmUpdate` | select | 124 | - | `f_booking_car_check` | `car.Car03_Booking.update`, `car.Car03_Booking.updateAdmin`, `car.Car03_Booking.updateJournalModel`, `car.Car03_Booking.updateList`, `car.Car03_Booking.updateListAdmin` |
| `deleteParentId` | delete | 135 | [`car03_booking`](../../../db/tables/car.md) |  | `car.Car03_Booking.deleteList`, `car.Car03_Booking.update`, `car.Car03_Booking.updateAdmin`, `car.Car03_Booking.updateList`, `car.Car03_Booking.updateListAdmin` |
| `deleteByBookingId` | delete | 141 | [`car03_booking`](../../../db/tables/car.md) |  | `car.Car03_Booking.deleteByBookingId`, `car.Car03_Booking.deleteByJournalList` |
