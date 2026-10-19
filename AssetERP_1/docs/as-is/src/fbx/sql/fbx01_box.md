# fbx01_box

`server/fbx/mapper/fbx01_box.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 23 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`fbx01_box`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `fbx.Fbx01_Box.selectById` |
| `selectByCompanyId` | select | 38 | [`fbx01_box`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `fbx.Fbx01_Box.selectByCompanyId` |
| `selectByDcrClassId` | select | 55 | [`fbx01_box`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `fbx.Fbx01_Box.selectByDcrClassId` |
