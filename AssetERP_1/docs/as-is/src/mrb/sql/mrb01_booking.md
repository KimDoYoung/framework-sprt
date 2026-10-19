# mrb01_booking

`server/mrb/mapper/mrb01_booking.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 37 | [`mrb01_booking`](../../../db/tables/mrb.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `mrb.Mrb01_Booking.selectById` |
| `selectByList` | select | 47 | [`mrb01_booking`](../../../db/tables/mrb.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `mrb.Mrb01_Booking.selectByList` |
| `selectByDate` | select | 61 | [`mrb01_booking`](../../../db/tables/mrb.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc` | `mrb.Mrb01_Booking.selectByDate` |
| `selectByDateUnion` | select | 82 | [`mrb01_booking`](../../../db/tables/mrb.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc` | `mrb.Mrb01_Booking.selectByDateUnion` |
| `selectByDateUnion1` | select | 134 | [`mrb01_booking`](../../../db/tables/mrb.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | - |
| `confirmUpdate` | select | 185 | - | `f_booking_check1` | `mrb.Mrb01_Booking.update`, `mrb.Mrb01_Booking.updateList` |
| `selectByBookingDate` | select | 197 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`mrb01_booking`](../../../db/tables/mrb.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` | `mrb.Mrb01_Booking.selectByBookingDate` |
| `selectByBookingDatePaging` | select | 207 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`mrb01_booking`](../../../db/tables/mrb.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` | `mrb.Mrb01_Booking.selectByBookingDatePaging` |
| `selectByBookingDatePagingTotal` | select | 218 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`mrb01_booking`](../../../db/tables/mrb.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` | `mrb.Mrb01_Booking.selectByBookingDatePaging` |
| `selectMyPageBooking` | sql | 227 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`mrb01_booking`](../../../db/tables/mrb.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans` |  |
| `deleteParentId` | delete | 268 | [`mrb01_booking`](../../../db/tables/mrb.md) |  | `mrb.Mrb01_Booking.deleteList`, `mrb.Mrb01_Booking.update`, `mrb.Mrb01_Booking.updateList` |
| `deleteByBookingId` | delete | 274 | [`mrb01_booking`](../../../db/tables/mrb.md) |  | `mrb.Mrb01_Booking.deleteByBookingId` |
