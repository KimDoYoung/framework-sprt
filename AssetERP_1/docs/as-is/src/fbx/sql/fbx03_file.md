# fbx03_file

`server/fbx/mapper/fbx03_file.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`fbx01_box`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_sysdate` | `fbx.Fbx03_File.selectById`, `fbx.Fbx03_File.view` |
| `selectByDcrTreeId` | select | 40 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`fbx01_box`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_sysdate` | `fbx.Fbx03_File.selectByDcrTreeId` |
| `selectByOrgAuth` | select | 60 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fbx01_box`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_sysdate` | `fbx.Fbx03_File.selectByOrgAuth` |
| `selectByBoxId` | select | 87 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`fbx01_box`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_sysdate` | `fbx.Fbx03_File.selectByBoxId` |
| `insert` | insert | 118 | [`fbx03_file`](../../../db/tables/fbx.md) |  | - |
| `delete` | delete | 140 | [`fbx03_file`](../../../db/tables/fbx.md) |  | - |
