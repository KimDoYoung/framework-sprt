# opr02_fund

`server/opr/mapper/opr02_fund.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`opr02_fund`](../../../db/tables/opr.md) |  | - |
| `selectByCreateId` | select | 23 | [`emp00_trans_info`](../../../db/views.md), [`fnd00_fund`](../../../db/views.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`opr02_fund`](../../../db/tables/opr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_max_workdate`, `f_org_nm`, `f_sysdate`, `f_trunc` | `opr.Opr02_Fund.selectByCreateId` |
