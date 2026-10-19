# car04_journal

`server/car/mapper/car04_journal.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 54 | [`car04_journal`](../../../db/tables/car.md) |  | `car.Car04_Journal.selectById` |
| `selectByDate` | select | 61 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) | `f_emp_kor_nm` | `car.Car04_Journal.selectByDate` |
| `selectByPrivateJournal` | select | 130 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) | `f_emp_kor_nm` | `car.Car04_Journal.selectByPrivateJournal` |
| `selectByPublicJournal` | select | 178 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) |  | `car.Car04_Journal.selectByPublicJournal` |
| `selectByPublicJournalAdmin` | select | 215 | [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) | `f_emp_kor_nm` | `car.Car04_Journal.selectByPublicJournalAdmin` |
| `selectByJournal` | select | 325 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md), [`sys01_company`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `car.Car04_Journal.selectByJournal` |
| `selectByRdJournal` | select | 439 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md), [`sys01_company`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `sys.Sys99_Print.insertRdCarJournal` |
| `getAfterFixYn` | select | 556 | [`car01_info`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) |  | `car.Car04_Journal.getAfterFixYn` |
| `getBeforeCloseYn` | select | 566 | [`car01_info`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) |  | `car.Car04_Journal.getBeforeCloseYn` |
| `getAfterCloseYn` | select | 576 | [`car01_info`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) |  | `car.Car04_Journal.getAfterCloseYn` |
| `checkBookingId` | select | 586 | [`car01_info`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) |  | `car.Car04_Journal.checkBookingId` |
| `checkDate` | select | 594 | [`car01_info`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md) |  | `car.Car04_Journal.batch`, `car.Car04_Journal.checkDate` |
| `insert` | insert | 604 | [`car04_journal`](../../../db/tables/car.md) | `f_create_seq` | `car.Car04_Journal.batch` |
| `excelInsert` | insert | 626 | [`car04_journal`](../../../db/tables/car.md) | `f_create_seq` | - |
