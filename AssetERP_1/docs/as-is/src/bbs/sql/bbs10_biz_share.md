# bbs10_biz_share

`server/bbs/mapper/bbs10_biz_share.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`bbs10_biz_share`](../../../db/tables/bbs.md) |  | `bbs.Bbs10_BizShare.selectById` |
| `selectByText` | select | 27 | [`bbs10_biz_share`](../../../db/tables/bbs.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `bbs.Bbs10_BizShare.selectByText` |
