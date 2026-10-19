# apr42_comment

`server/apr/mapper/apr42_comment.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`apr42_comment`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `apr.Apr42_Comment.selectById` |
| `selectByApprId` | select | 47 | [`apr42_comment`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans` | `apr.Apr42_Comment.selectByApprId` |
| `getSize` | select | 80 | [`apr42_comment`](../../../db/tables/apr.md) |  | `apr.Apr42_Comment.getSize` |
