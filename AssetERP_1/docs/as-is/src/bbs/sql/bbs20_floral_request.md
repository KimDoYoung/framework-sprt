# bbs20_floral_request

`server/bbs/mapper/bbs20_floral_request.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 42 | [`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today` | `bbs.Bbs20_FloralRequest.selectById` |
| `selectByText` | select | 82 | [`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today` | `bbs.Bbs20_FloralRequest.selectByText` |
| `selectByTextAdmin` | select | 136 | [`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today` | `bbs.Bbs20_FloralRequest.selectByTextAdmin` |
