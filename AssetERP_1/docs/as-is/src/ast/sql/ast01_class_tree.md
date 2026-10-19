# ast01_class_tree

`server/ast/mapper/ast01_class_tree.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 63 | [`ast01_class_tree`](../../../db/tables/ast.md) | `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `ast.Ast01_ClassTree.insert`, `ast.Ast01_ClassTree.insertIpo`, `ast.Ast01_ClassTree.selectById`, `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.updateDepositSellBookAmt` |
| `selectByCompanyId_postgresql` | sql | 87 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md) | `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_sysdate` |  |
| `selectByCompanyId` | select | 162 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md) | `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `ast.Ast01_ClassTree.selectByCompanyId` |
| `selectByTrCode` | select | 175 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `ast.Ast01_ClassTree.selectByTrCode` |
| `selectByParentId` | select | 339 | [`ast01_class_tree`](../../../db/tables/ast.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `ast.Ast01_ClassTree.selectByParentId` |
| `selectBySearchParentId` | select | 365 | [`ast01_class_tree`](../../../db/tables/ast.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `ast.Ast01_ClassTree.selectBySearchParentId` |
| `getAstInfo` | select | 393 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | - |
| `checkParentId` | select | 400 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.updateParentId` |
| `createCode` | select | 406 | - | `f_create_ast_class_tree_cd` | `ast.Ast01_ClassTree.createCode`, `ast.Ast01_ClassTree.insert`, `ast.Ast01_ClassTree.insertIpo` |
| `createCodeOne` | select | 411 | - | `f_create_ast_class_tree_cd` | - |
| `createSeq` | select | 415 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | - |
| `selectIcamItem` | select | 422 | `sbm0jm` ⚠DB없음, `szx0gm` ⚠DB없음, `szx0gr` ⚠DB없음, `uzm0ui` ⚠DB없음 |  | - |
| `selectByClassTreeName` | select | 483 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | - |
| `selectByIsin` | select | 493 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | - |
| `selectByDetailCode` | select | 504 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | - |
| `selectByAssetType` | select | 515 | [`ast01_class_tree`](../../../db/tables/ast.md), [`fnd10_book`](../../../db/tables/fnd.md) | `f_ast_class_tree_nm_allpath2` | `ast.Ast01_ClassTree.selectByAssetType` |
| `selectCorpAccount` | select | 532 | [`ast01_class_tree`](../../../db/tables/ast.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate`, `f_today`, `to_decrypts` | `ast.Ast01_ClassTree.selectCorpAccount` |
| `selectIpoAssignClassTreeId` | select | 587 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.insertIpo` |
| `selectPullData` | select | 597 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.pullData` |
| `checkAstClassTreeName` | select | 606 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.insertIpo` |
| `selectSeqByParentId` | select | 616 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.insertIpo` |
| `checkUseAstId` | select | 625 | - | `f_check_use_ast_id` | `ast.Ast01_ClassTree.delete` |
| `updateParentId` | update | 629 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.updateParentId` |
| `infoUpdate` | update | 638 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.insert` |
| `modelUpdate` | update | 650 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.modelUpdate` |
| `insert` | insert | 673 | [`ast01_class_tree`](../../../db/tables/ast.md) |  | `ast.Ast01_ClassTree.insert`, `ast.Ast01_ClassTree.insertIpo`, `ast.Ast01_ClassTree.pullData` |
