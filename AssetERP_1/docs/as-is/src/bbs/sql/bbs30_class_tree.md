# bbs30_class_tree

`server/bbs/mapper/bbs30_class_tree.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`bbs30_class_tree`](../../../db/tables/bbs.md), [`bbs31_content`](../../../db/tables/bbs.md) |  | `bbs.Bbs30_ClassTree.selectById` |
| `selectByCompanyId` | select | 37 | [`bbs30_class_tree`](../../../db/tables/bbs.md), [`bbs31_content`](../../../db/tables/bbs.md) |  | `bbs.Bbs30_ClassTree.selectByCompanyId` |
| `selectByTypeCode` | select | 54 | [`bbs30_class_tree`](../../../db/tables/bbs.md), [`bbs31_content`](../../../db/tables/bbs.md) |  | `bbs.Bbs30_ClassTree.selectByTypeCode` |
| `selectByUserTypeCode` | select | 72 | [`bbs30_class_tree`](../../../db/tables/bbs.md), [`bbs31_content`](../../../db/tables/bbs.md) |  | `bbs.Bbs30_ClassTree.selectByUserTypeCode` |
| `selectByRoleUserTypeCode` | select | 92 | [`bbs30_class_tree`](../../../db/tables/bbs.md), [`bbs31_content`](../../../db/tables/bbs.md), [`bbs33_role`](../../../db/tables/bbs.md) |  | `bbs.Bbs30_ClassTree.selectByRoleUserTypeCode` |
| `selectByParentTreeId` | select | 135 | [`bbs30_class_tree`](../../../db/tables/bbs.md), [`bbs31_content`](../../../db/tables/bbs.md) |  | `bbs.Bbs30_ClassTree.selectByParentTreeId` |
| `updateParentTreeId` | update | 154 | [`bbs30_class_tree`](../../../db/tables/bbs.md) |  | `bbs.Bbs30_ClassTree.updateParentTreeId` |
| `updatePublicYn` | update | 160 | [`bbs30_class_tree`](../../../db/tables/bbs.md) |  | `bbs.Bbs30_ClassTree.updatePublicYn` |
