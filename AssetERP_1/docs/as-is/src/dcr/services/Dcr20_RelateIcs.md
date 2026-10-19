# dcr.Dcr20_RelateIcs

`server/dcr/Dcr20_RelateIcs.java`

서비스 키 `dcr.Dcr20_RelateIcs.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`dcr20_relate_ics.selectById`](../../dcr/sql/dcr20_relate_ics.md) | - |  |
| `selectByDcrClassTreeId` | 26 | [`dcr20_relate_ics.selectByDcrClassTreeId`](../../dcr/sql/dcr20_relate_ics.md) | `Dcr20_Lookup_Ics` |  |
| `selectByClassTreeId` | 32 | [`dcr20_relate_ics.selectByClassTreeId`](../../dcr/sql/dcr20_relate_ics.md) | - |  |
| `update` | 38 | [`dcr01_class_tree.getAdminYn`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr20_relate_ics.insertAll`](../../dcr/sql/dcr20_relate_ics.md), `UpdateDataModel(dcr20_relate_ics)` 동적 INSERT/UPDATE | `Dcr20_Lookup_Ics` | `UpdateDataModel` |
| `delete` | 64 | [`dcr01_class_tree.getAdminYn`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr20_relate_ics.deleteAll`](../../dcr/sql/dcr20_relate_ics.md), `UpdateDataModel(dcr20_relate_ics)` 동적 DELETE | `Dcr20_Lookup_Ics` | `UpdateDataModel` |
