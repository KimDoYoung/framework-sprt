# tdm.Tdm46_ManlRelateIcr

`server/tdm/Tdm46_ManlRelateIcr.java`

서비스 키 `tdm.Tdm46_ManlRelateIcr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`tdm46_manl_relate_icr.selectById`](../../tdm/sql/tdm46_manl_relate_icr.md) | - |  |
| `selectByManlId` | 26 | [`tdm46_manl_relate_icr.selectByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md) | `Tdm43_Page_Relate`, `Tdm45_TabPage_Relate` |  |
| `insertList` | 34 | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md), [`tdm46_manl_relate_icr.insert`](../../tdm/sql/tdm46_manl_relate_icr.md) | `Tdm43_Tab_ManlItemList` |  |
| `update` | 58 | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 63 | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 DELETE | `Tdm43_Page_Relate`, `Tdm45_TabPage_Relate` | `UpdateDataModel` |
