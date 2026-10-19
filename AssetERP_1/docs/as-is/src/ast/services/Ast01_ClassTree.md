# ast.Ast01_ClassTree

`server/ast/Ast01_ClassTree.java`

서비스 키 `ast.Ast01_ClassTree.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 26 | [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md) | `Ast06_Lookup_TrDeposit`, `Ast06_Lookup_TrFinance`, `Ast06_Lookup_TrForFinance`, `Ast06_Lookup_TrIPO`, `Ast06_Lookup_TrIntrinsic` |  |
| `selectByCompanyId` | 32 | [`ast01_class_tree.selectByCompanyId`](../../ast/sql/ast01_class_tree.md) | `Apr01_Tab_ItemDocument`, `Ast01_Lookup_ClassTree`, `Ast01_Move_ClassTree`, `Ast01_Tab_ClassTreeIntrinsic`, `Ast01_Tab_ClassTreeManagement`, `Ast01_Tab_InfoIntrinsic`, `Ast01_Tab_InfoManagement` | `TreeUtil` |
| `selectByTrCode` | 57 | [`ast01_class_tree.selectByTrCode`](../../ast/sql/ast01_class_tree.md), [`ast05_tr_code.selectByTrCode`](../../ast/sql/ast05_tr_code.md) | `Ast01_Lookup_Info` | `TreeUtil` |
| `selectByParentId` | 113 | [`ast01_class_tree.selectByParentId`](../../ast/sql/ast01_class_tree.md) | `Ast01_Grid_AstTypeManagement` |  |
| `selectBySearchParentId` | 129 | [`ast01_class_tree.selectBySearchParentId`](../../ast/sql/ast01_class_tree.md) | `Ast01_Grid_AstType` |  |
| `selectByAssetType` | 147 | [`ast01_class_tree.selectByAssetType`](../../ast/sql/ast01_class_tree.md) | `Fnd10_Tab_RelateFnd` |  |
| `selectCorpAccount` | 153 | [`ast01_class_tree.selectCorpAccount`](../../ast/sql/ast01_class_tree.md) | `Ast01_Lookup_CorpAccount` |  |
| `createCode` | 159 | [`ast01_class_tree.createCode`](../../ast/sql/ast01_class_tree.md) | `Ast01_Tab_ClassTreeIntrinsic`, `Ast01_Tab_ClassTreeManagement` |  |
| `modelUpdate` | 174 | [`ast01_class_tree.modelUpdate`](../../ast/sql/ast01_class_tree.md) | `Ast01_Lookup_ItemClass`, `Ast02_Grid_Detail`, `Ast02_Grid_DetailManagement` |  |
| `insert` | 199 | [`ast01_class_tree.createCode`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.infoUpdate`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.insert`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast10_manager.insert`](../../ast/sql/ast10_manager.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org01_code.selectByCompanyId`](../../org/sql/org01_code.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Ast01_Grid_AstType`, `Ast01_Grid_AstTypeManagement` |  |
| `insertIpo` | 272 | [`ast01_class_tree.checkAstClassTreeName`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.createCode`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.insert`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectIpoAssignClassTreeId`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectSeqByParentId`](../../ast/sql/ast01_class_tree.md), [`ast10_manager.insert`](../../ast/sql/ast10_manager.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org01_code.selectByCompanyId`](../../org/sql/org01_code.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Ast06_Lookup_CreateIpoAstClass` |  |
| `pullData` | 362 | [`ast01_class_tree.insert`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectPullData`](../../ast/sql/ast01_class_tree.md), [`ast10_manager.insert`](../../ast/sql/ast10_manager.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org00_org_info.selectByKorName`](../../org/sql/org00_org_info.md) | `Ast01_Tab_ClassTreeIntrinsic` |  |
| `updateParentId` | 443 | [`ast01_class_tree.checkParentId`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.updateParentId`](../../ast/sql/ast01_class_tree.md) | `Ast01_Lookup_MoveClassTree` |  |
| `update` | 459 | `UpdateDataModel(ast01_class_tree)` 동적 INSERT/UPDATE | `Ast01_Edit_ClassTree` | `UpdateDataModel` |
| `delete` | 464 | [`ast01_class_tree.checkUseAstId`](../../ast/sql/ast01_class_tree.md), [`ast02_detail.deleteByAstClassTreeId`](../../ast/sql/ast02_detail.md), [`ast10_manager.deleteByLinkId`](../../ast/sql/ast10_manager.md), `UpdateDataModel(ast01_class_tree)` 동적 DELETE | `Ast01_Edit_ClassTree`, `Ast01_Grid_AstType`, `Ast01_Grid_AstTypeManagement` | `UpdateDataModel` |
