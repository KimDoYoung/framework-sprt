# sch22_write_group

`server/sch/mapper/sch22_write_group.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`emp01_person`](../../../db/tables/emp.md), [`sch22_write_group`](../../../db/tables/sch.md) |  | `sch.Sch22_WriteGroup.selectById` |
| `selectByCompanyId` | select | 26 | [`emp01_person`](../../../db/tables/emp.md), [`sch22_write_group`](../../../db/tables/sch.md) |  | `sch.Sch22_WriteGroup.selectByCompanyId` |
| `selectByChecklistContentId` | select | 35 | [`emp01_person`](../../../db/tables/emp.md), [`sch02_share`](../../../db/tables/sch.md), [`sch21_checklist_content`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md) | `f_cdnm`, `f_sysdate`, `f_today`, `getorg` | `sch.Sch22_WriteGroup.selectByChecklistContentId` |
| `checkByWriteGroupId` | select | 50 | [`chk02_daily_list`](../../../db/tables/chk.md), [`ics11_checklist_company`](../../../db/tables/ics.md) |  | `sch.Sch22_WriteGroup.checkByWriteGroupId` |
