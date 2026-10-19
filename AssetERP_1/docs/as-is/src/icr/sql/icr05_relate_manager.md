# icr05_relate_manager

`server/icr/mapper/icr05_relate_manager.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`icr05_relate_manager`](../../../db/tables/icr.md) |  | `icr.Icr05_RelateManager.selectById` |
| `selectByCompanyId` | select | 25 | [`icr05_relate_manager`](../../../db/tables/icr.md) |  | - |
| `selectByClassTreeId` | select | 32 | [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md) | `f_emp_kor_nm` | `icr.Icr05_RelateManager.selectByClassTreeId` |
| `selectByManagerId` | select | 42 | [`icr05_relate_manager`](../../../db/tables/icr.md) |  | - |
| `checkRelateIcs` | select | 50 | [`icr05_relate_manager`](../../../db/tables/icr.md) |  | - |
| `delete` | delete | 56 | [`icr05_relate_manager`](../../../db/tables/icr.md) |  | `icr.Icr05_RelateManager.relateUpdate`, `icr.Icr05_RelateManager.updateList` |
| `insert` | insert | 63 | [`icr05_relate_manager`](../../../db/tables/icr.md) | `f_create_seq` | `icr.Icr05_RelateManager.relateUpdate`, `icr.Icr05_RelateManager.updateList` |
