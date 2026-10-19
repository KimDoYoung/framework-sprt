# sch.Sch22_WriteGroup

`server/sch/Sch22_WriteGroup.java`

서비스 키 `sch.Sch22_WriteGroup.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sch22_write_group.selectById`](../../sch/sql/sch22_write_group.md) | `Sch21_Edit_ChecklistContent` |  |
| `selectByCompanyId` | 23 | [`sch22_write_group.selectByCompanyId`](../../sch/sql/sch22_write_group.md) | `Sch22_Lookup_WriteGroup` |  |
| `selectByParentId` | 31 | `sch22_write_group.selectByParentId`(없음) | - |  |
| `selectByChecklistContentId` | 39 | [`sch22_write_group.selectByChecklistContentId`](../../sch/sql/sch22_write_group.md) | `Sch22_Page_AddWriteGroup` |  |
| `checkByWriteGroupId` | 47 | [`sch22_write_group.checkByWriteGroupId`](../../sch/sql/sch22_write_group.md) | `Sch22_Lookup_WriteGroup` |  |
| `update` | 52 | `UpdateDataModel(sch22_write_group)` 동적 INSERT/UPDATE | `Sch22_Lookup_WriteGroup` | `UpdateDataModel` |
| `delete` | 57 | `UpdateDataModel(sch22_write_group)` 동적 DELETE | `Sch22_Lookup_WriteGroup` | `UpdateDataModel` |
