# emp50_transport_expense

`server/emp/mapper/emp50_transport_expense.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`emp50_transport_expense`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp50_TransportExpense.selectById` |
| `selectByYearMonth` | select | 46 | [`emp50_transport_expense`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `emp.Emp50_TransportExpense.selectByYearMonth` |
