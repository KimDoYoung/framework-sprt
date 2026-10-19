# bbs07_comment

`server/bbs/mapper/bbs07_comment.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`bbs07_comment`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `bbs.Bbs07_Comment.selectById` |
| `selectByNoticeId` | select | 48 | [`bbs07_comment`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `bbs.Bbs07_Comment.selectByNoticeId` |
| `getSize` | select | 82 | [`bbs07_comment`](../../../db/tables/bbs.md) |  | `bbs.Bbs07_Comment.getSize` |
