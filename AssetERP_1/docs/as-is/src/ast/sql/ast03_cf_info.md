# ast03_cf_info

`server/ast/mapper/ast03_cf_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast03_cf_info`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `ast.Ast03_CfInfo.selectById` |
| `selectByClassTreeId` | select | 44 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast03_cf_info`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `ast.Ast03_CfInfo.selectByClassTreeId` |
