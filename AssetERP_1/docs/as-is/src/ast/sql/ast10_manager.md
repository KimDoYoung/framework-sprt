# ast10_manager

`server/ast/mapper/ast10_manager.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`ast10_manager`](../../../db/tables/ast.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `ast.Ast10_Manager.selectById` |
| `selectByLinkId` | select | 30 | [`ast10_manager`](../../../db/tables/ast.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `ast.Ast10_Manager.selectByLinkId` |
| `insert` | insert | 41 | [`ast10_manager`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.insert`, `ast.Ast01_ClassTree.insertIpo`, `ast.Ast01_ClassTree.pullData` |
| `deleteByLinkId` | delete | 64 | [`ast10_manager`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.delete` |
