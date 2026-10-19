# act13_real_account_map

`server/act/mapper/act13_real_account_map.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 23 | [`act01_account_code`](../../../db/tables/act.md), [`act10_repr_account`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md) |  | `act.Act13_RealAccountMap.selectById` |
| `selectByCompanyId` | select | 33 | [`act01_account_code`](../../../db/tables/act.md), [`act10_repr_account`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md) |  | `act.Act13_RealAccountMap.selectByCompanyId` |
| `selectByAstClassTreeId` | select | 47 | [`act01_account_code`](../../../db/tables/act.md), [`act10_repr_account`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md) |  | `act.Act13_RealAccountMap.selectByAstClassTreeId` |
| `getAccountName` | select | 66 | [`act13_real_account_map`](../../../db/tables/act.md) | `f_get_account_nm` | `act.Act13_RealAccountMap.getAccountName` |
| `insertInitData` | insert | 75 | [`act13_real_account_map`](../../../db/tables/act.md) | `f_create_seq` | `act.Act13_RealAccountMap.insertInitData` |
| `insertFormAct13` | insert | 90 | [`act13_real_account_map`](../../../db/tables/act.md) | `f_create_seq` | - |
| `deleteByAccountMap` | delete | 103 | [`act13_real_account_map`](../../../db/tables/act.md) |  | `act.Act13_RealAccountMap.insertInitData` |
