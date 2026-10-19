# biz10_cont_corp

`server/biz/mapper/biz10_cont_corp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md) | `f_cdnm`, `f_emp_kor_nm`, `f_today` | `biz.Biz10_ContCorp.selectById` |
| `selectByText` | select | 48 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md) | `f_cdnm`, `f_emp_kor_nm`, `f_today` | `biz.Biz10_ContCorp.selectByText`, `sys.Sys99_Print.insertRdContCorp` |
