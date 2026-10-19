# car02_user

`server/car/mapper/car02_user.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`car02_user`](../../../db/tables/car.md) | `f_emp_kor_nm` | `car.Car02_User.selectById` |
| `selectByInfoId` | select | 23 | [`car02_user`](../../../db/tables/car.md) | `f_emp_kor_nm` | `car.Car02_User.selectByInfoId` |
