# apr09_appr_agree

`server/apr/mapper/apr09_appr_agree.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`apr09_appr_agree`](../../../db/tables/apr.md) |  | `apr.Apr09_ApprAgree.selectById` |
| `selectByAll` | select | 27 | [`apr09_appr_agree`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_trunc` | `apr.Apr09_ApprAgree.selectByAll` |
| `selectByAll2` | select | 44 | [`apr09_appr_agree`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | - |
