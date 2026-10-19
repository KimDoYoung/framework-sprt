# bbs31_content

`server/bbs/mapper/bbs31_content.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 23 | [`bbs31_content`](../../../db/tables/bbs.md) | `f_emp_kor_nm` | `bbs.Bbs31_Content.selectById` |
| `selectByClassTreeId` | select | 35 | [`bbs31_content`](../../../db/tables/bbs.md) | `f_emp_kor_nm` | `bbs.Bbs31_Content.selectByClassTreeId` |
| `selectByParentTreeId` | select | 48 | [`bbs30_class_tree`](../../../db/tables/bbs.md), [`bbs31_content`](../../../db/tables/bbs.md) |  | `bbs.Bbs31_Content.selectByParentTreeId` |
| `selectByClassTreeIdPaging` | select | 58 | [`bbs31_content`](../../../db/tables/bbs.md) | `f_emp_kor_nm` | `bbs.Bbs31_Content.selectByClassTreeIdPaging` |
| `selectByClassTreeIdPagingTotal` | select | 84 | [`bbs31_content`](../../../db/tables/bbs.md) | `f_emp_kor_nm` | `bbs.Bbs31_Content.selectByClassTreeIdPaging` |
