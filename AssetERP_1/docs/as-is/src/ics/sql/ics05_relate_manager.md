# ics05_relate_manager

`server/ics/mapper/ics05_relate_manager.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`ics05_relate_manager`](../../../db/tables/ics.md) |  | `ics.Ics05_RelateManager.selectById` |
| `selectByCompanyId` | select | 25 | [`ics05_relate_manager`](../../../db/tables/ics.md) |  | - |
| `selectByClassTreeId` | select | 32 | [`ics02_manager`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md) | `f_emp_kor_nm` | `ics.Ics05_RelateManager.selectByClassTreeId` |
| `selectByManagerId` | select | 42 | [`ics05_relate_manager`](../../../db/tables/ics.md) |  | `ics.Ics02_Manager.insert` |
| `checkRelateIcs` | select | 50 | [`ics05_relate_manager`](../../../db/tables/ics.md) |  | `ics.Ics02_Manager.checkRelateIcs` |
| `delete` | delete | 56 | [`ics05_relate_manager`](../../../db/tables/ics.md) |  | `ics.Ics05_RelateManager.relateUpdate`, `ics.Ics05_RelateManager.updateList` |
| `insert` | insert | 63 | [`ics05_relate_manager`](../../../db/tables/ics.md) | `f_create_seq` | `ics.Ics05_RelateManager.relateUpdate`, `ics.Ics05_RelateManager.updateList` |
