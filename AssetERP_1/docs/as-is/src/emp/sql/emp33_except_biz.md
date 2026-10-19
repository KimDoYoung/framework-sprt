# emp33_except_biz

`server/emp/mapper/emp33_except_biz.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`emp33_except_biz`](../../../db/tables/emp.md) | `f_cdnm`, `f_today`, `getperson` | `emp.Emp33_ExceptBiz.selectById` |
| `selectByExceptBizCode` | select | 31 | [`emp33_except_biz`](../../../db/tables/emp.md) | `f_cdnm`, `f_today`, `getperson` | `emp.Emp33_ExceptBiz.selectByExceptBizCode` |
