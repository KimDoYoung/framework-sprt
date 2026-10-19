# car01_info

`server/car/mapper/car01_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `car.Car01_Info.selectById` |
| `selectByCompanyId` | select | 43 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `car.Car01_Info.selectByCompanyId` |
| `selectByCarType1` | select | 67 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `car.Car01_Info.selectByCarType` |
| `selectByCarType2` | select | 98 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `car.Car01_Info.selectByCarType` |
| `selectByCarTypeAdmin` | select | 136 | [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `car.Car01_Info.selectByCarTypeAdmin` |
