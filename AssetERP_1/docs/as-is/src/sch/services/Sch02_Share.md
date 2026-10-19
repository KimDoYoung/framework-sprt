# sch.Sch02_Share

`server/sch/Sch02_Share.java`

서비스 키 `sch.Sch02_Share.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`sch02_share.selectById`](../../sch/sql/sch02_share.md) | - |  |
| `selectByClassTreeId` | 25 | [`sch02_share.selectByClassTreeId`](../../sch/sql/sch02_share.md) | - |  |
| `selectByInfoId` | 35 | [`sch02_share.selectByInfoId`](../../sch/sql/sch02_share.md) | `Sch01_Lookup_Info` |  |
| `selectByInfoId2` | 45 | [`sch02_share.selectByInfoId2`](../../sch/sql/sch02_share.md) | `Sch02_Page_Share`, `Sch21_Edit_ChecklistContent` |  |
| `selectByInfoId3` | 51 | [`sch02_share.selectByInfoId3`](../../sch/sql/sch02_share.md) | `Sch02_Lookup_Share` |  |
| `selectShareInto` | 62 | [`sch02_share.selectShareInto`](../../sch/sql/sch02_share.md) | `Sch02_Lookup_Share` |  |
| `deleteByInfoId` | 69 | [`sch02_share.deleteByInfoId`](../../sch/sql/sch02_share.md) | `Sch22_Lookup_WriteGroup` |  |
| `checkWriteGroup` | 78 | [`sch02_share.checkWriteGroup`](../../sch/sql/sch02_share.md) | `Sch02_Page_Share` |  |
| `update` | 90 | `UpdateDataModel(sch02_share)` 동적 INSERT/UPDATE | `Sch01_Lookup_Info`, `Sch02_Lookup_Share`, `Sch02_Page_Share` | `UpdateDataModel` |
| `delete` | 95 | `UpdateDataModel(sch02_share)` 동적 DELETE | `Sch01_Lookup_Info`, `Sch02_Lookup_Share`, `Sch02_Page_Share` | `UpdateDataModel` |
