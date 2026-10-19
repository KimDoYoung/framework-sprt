# mvb01_booking

`server/mvb/mapper/mvb01_booking.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 41 | `mvb01_booking` ⚠DB없음 | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | - |
| `selectByTimeCheck` | select | 52 | - |  | - |
| `selectByDate` | select | 57 | `mvb01_booking` ⚠DB없음 | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `mvb.Mvb01_Booking.selectByDate` |
| `selectByDateUnion` | select | 79 | `mvb01_booking` ⚠DB없음, [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `mvb.Mvb01_Booking.selectByDateUnion` |
| `deleteBypickupId` | delete | 128 | `mvb01_booking` ⚠DB없음 |  | - |
