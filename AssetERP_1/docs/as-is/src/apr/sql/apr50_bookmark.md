# apr50_bookmark

`server/apr/mapper/apr50_bookmark.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`apr01_appr`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr50_Bookmark.selectById` |
| `selectByPersonId` | select | 42 | [`apr01_appr`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr50_Bookmark.selectByPersonId` |
| `selectByPersonIdPaging` | select | 68 | [`apr01_appr`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr50_Bookmark.selectByPersonIdPaging` |
| `selectByPersonIdPagingTotal` | select | 100 | [`apr01_appr`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr50_Bookmark.selectByPersonIdPaging` |
| `selectByApprId` | select | 129 | [`apr01_appr`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr50_Bookmark.selectByApprId` |
| `selectByPublicYn` | select | 151 | [`apr01_appr`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr50_Bookmark.selectByPublicYn` |
| `insertCheck` | select | 177 | [`apr50_bookmark`](../../../db/tables/apr.md) |  | `apr.Apr50_Bookmark.insert` |
| `insert` | insert | 184 | [`apr50_bookmark`](../../../db/tables/apr.md) | `f_create_seq` | `apr.Apr50_Bookmark.insert` |
| `updatePublicYn` | update | 194 | [`apr50_bookmark`](../../../db/tables/apr.md) |  | `apr.Apr50_Bookmark.insert` |
| `deleteByApprId` | delete | 201 | [`apr50_bookmark`](../../../db/tables/apr.md) |  | `apr.Apr50_Bookmark.deleteByApprId` |
