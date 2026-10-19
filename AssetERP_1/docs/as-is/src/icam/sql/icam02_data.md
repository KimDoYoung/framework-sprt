# icam02_data

`server/icam/mapper/icam02_data.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 37 | [`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md) |  | `icam.Icam02_Data.selectById` |
| `selectByCompanyId` | select | 49 | [`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) |  | `icam.Icam02_Data.selectByCompanyId` |
| `selectByTgtDate1` | select | 64 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) |  | `icam.Icam02_Data.selectByTgtDate1` |
| `selectByTgtDate2` | select | 90 | [`ast01_class_tree`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) |  | `icam.Icam02_Data.selectByTgtDate2` |
| `selectByCompanyIdString` | select | 115 | [`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md) |  | `icam.Icam02_Data.selectByCompanyIdString` |
| `selectIcamData` | select | 130 | `uzm0ui` ⚠DB없음 |  | - |
| `insert` | insert | 164 | [`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate` | - |
