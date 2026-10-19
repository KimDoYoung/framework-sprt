# bbs32_comment

`server/bbs/mapper/bbs32_comment.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`bbs32_comment`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `bbs.Bbs32_Comment.selectById` |
| `selectByContentId` | select | 47 | [`bbs32_comment`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `bbs.Bbs32_Comment.selectByContentId` |
| `getSize` | select | 79 | [`bbs32_comment`](../../../db/tables/bbs.md) |  | `bbs.Bbs32_Comment.getSize` |
