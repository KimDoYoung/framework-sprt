# sys53_specific_menu_request

`server/sys/mapper/sys53_specific_menu_request.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`apr01_appr`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys53_specific_menu_request`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `sys.Sys53_SpecificMenuRequest.selectById` |
| `selectByText` | select | 39 | [`apr01_appr`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys53_specific_menu_request`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `sys.Sys53_SpecificMenuRequest.selectByText` |
| `selectByTextAdmin` | select | 56 | [`apr01_appr`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys53_specific_menu_request`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `sys.Sys53_SpecificMenuRequest.selectByTextAdmin` |
