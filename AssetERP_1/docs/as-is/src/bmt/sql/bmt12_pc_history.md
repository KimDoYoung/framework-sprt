# bmt12_pc_history

`server/bmt/mapper/bmt12_pc_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt12_pc_history`](../../../db/tables/bmt.md) |  | `bmt.Bmt12_PcHistory.selectById` |
| `selectByCompanyId` | select | 36 | [`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt11_history`](../../../db/tables/bmt.md), [`bmt12_pc_history`](../../../db/tables/bmt.md) | `f_emp_kor_nm` | `bmt.Bmt12_PcHistory.selectByCompanyId` |
| `selectByInfoId` | select | 65 | [`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt12_pc_history`](../../../db/tables/bmt.md) |  | `bmt.Bmt12_PcHistory.selectByInfoId` |
| `selectEmpICT` | select | 76 | [`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt11_history`](../../../db/tables/bmt.md), [`bmt12_pc_history`](../../../db/tables/bmt.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `bmt.Bmt12_PcHistory.selectEmpICT`, `sys.Sys99_Print.insertRdEmplct` |
| `deleteByInfoId` | delete | 109 | [`bmt12_pc_history`](../../../db/tables/bmt.md) |  | `bmt.Bmt12_PcHistory.deleteByInfoId` |
