# ast04_cf

`server/ast/mapper/ast04_cf.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`ast04_cf`](../../../db/tables/ast.md) |  | `ast.Ast04_Cf.selectById` |
| `selectByRelateId` | select | 29 | [`ast03_cf_info`](../../../db/tables/ast.md), [`ast04_cf`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md) | `f_get_corp_nm` | `ast.Ast04_Cf.selectByRelateId` |
| `selectByCfInfoId` | select | 39 | [`ast04_cf`](../../../db/tables/ast.md) |  | `ast.Ast04_Cf.selectByCfInfoId` |
| `bizDate` | select | 46 | - | `f_get_biz_date` | `ast.Ast03_CfInfo.bacthUpdate` |
| `lastDate` | select | 50 | - | `f_get_last_day` | `ast.Ast03_CfInfo.bacthUpdate` |
| `deleteByCfInfoId` | delete | 55 | [`ast04_cf`](../../../db/tables/ast.md) |  | `ast.Ast03_CfInfo.bacthUpdate` |
| `insert` | insert | 61 | [`ast04_cf`](../../../db/tables/ast.md) |  | `ast.Ast03_CfInfo.bacthUpdate` |
