# dcr.Dcr21_RelateIcr

`server/dcr/Dcr21_RelateIcr.java`

서비스 키 `dcr.Dcr21_RelateIcr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`dcr21_relate_icr.selectById`](../../dcr/sql/dcr21_relate_icr.md) | - |  |
| `selectByDcrClassTreeId` | 26 | [`dcr21_relate_icr.selectByDcrClassTreeId`](../../dcr/sql/dcr21_relate_icr.md) | `Dcr21_Lookup_Icr` |  |
| `selectByClassTreeId` | 32 | [`dcr21_relate_icr.selectByClassTreeId`](../../dcr/sql/dcr21_relate_icr.md) | - |  |
| `update` | 38 | [`dcr01_class_tree.getAdminYn`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr21_relate_icr.insertAll`](../../dcr/sql/dcr21_relate_icr.md), `UpdateDataModel(dcr21_relate_icr)` 동적 INSERT/UPDATE | `Dcr21_Lookup_Icr` | `UpdateDataModel` |
| `delete` | 64 | [`dcr01_class_tree.getAdminYn`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr21_relate_icr.deleteAll`](../../dcr/sql/dcr21_relate_icr.md), `UpdateDataModel(dcr21_relate_icr)` 동적 DELETE | `Dcr21_Lookup_Icr` | `UpdateDataModel` |
