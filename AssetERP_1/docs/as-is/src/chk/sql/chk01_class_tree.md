# chk01_class_tree

`server/chk/mapper/chk01_class_tree.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`chk01_class_tree`](../../../db/tables/chk.md) | `f_cdnm`, `f_sysdate` | `chk.Chk01_ClassTree.selectById` |
| `selectByLinkCode` | select | 26 | [`chk01_class_tree`](../../../db/tables/chk.md) | `f_cdnm`, `f_sysdate` | `chk.Chk01_ClassTree.selectByLinkCode` |
| `selectByParentId` | select | 35 | [`chk01_class_tree`](../../../db/tables/chk.md) | `f_cdnm`, `f_sysdate` | `chk.Chk01_ClassTree.selectByAll` |
| `selectByCompanyId` | select | 43 | [`chk01_class_tree`](../../../db/tables/chk.md) | `f_cdnm`, `f_sysdate` | `chk.Chk01_ClassTree.selectByCompanyId` |
