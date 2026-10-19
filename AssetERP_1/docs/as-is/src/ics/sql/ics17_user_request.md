# ics17_user_request

`server/ics/mapper/ics17_user_request.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`ics17_user_request`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_company_nm`, `f_sysdate` | `ics.Ics17_UserRequest.selectById` |
| `selectBySearchText` | select | 38 | [`ics17_user_request`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc` | `ics.Ics17_UserRequest.selectBySearchText` |
| `selectBySearchTextAdmin` | select | 58 | [`ics17_user_request`](../../../db/tables/ics.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc` | `ics.Ics17_UserRequest.selectBySearchTextAdmin` |
| `updateLawContent` | update | 82 | [`ics17_user_request`](../../../db/tables/ics.md) |  | `ics.Ics17_UserRequest.updateLawContent` |
