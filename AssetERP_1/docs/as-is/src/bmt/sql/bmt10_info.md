# bmt10_info

`server/bmt/mapper/bmt10_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md) |  | `bmt.Bmt10_Info.selectById` |
| `selectByCompanyId` | select | 32 | [`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt11_history`](../../../db/tables/bmt.md) | `f_emp_kor_nm` | `bmt.Bmt10_Info.selectByCompanyId` |
| `selectByBaseDate` | select | 58 | [`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt11_history`](../../../db/tables/bmt.md) | `f_emp_kor_nm` | `bmt.Bmt10_Info.selectByBaseDate` |
| `selectByAstClassTreeId` | select | 76 | [`bmt10_info`](../../../db/tables/bmt.md) |  | - |
| `insert` | insert | 84 | [`bmt10_info`](../../../db/tables/bmt.md) |  | - |
