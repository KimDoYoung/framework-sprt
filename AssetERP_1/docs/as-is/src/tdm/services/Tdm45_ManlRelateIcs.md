# tdm.Tdm45_ManlRelateIcs

`server/tdm/Tdm45_ManlRelateIcs.java`

서비스 키 `tdm.Tdm45_ManlRelateIcs.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`tdm45_manl_relate_ics.selectById`](../../tdm/sql/tdm45_manl_relate_ics.md) | - |  |
| `selectByManlId` | 26 | [`tdm45_manl_relate_ics.selectByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md) | `Tdm43_Page_Relate`, `Tdm45_TabPage_Relate` |  |
| `selectByIcsId` | 34 | [`tdm45_manl_relate_ics.selectByIcsId`](../../tdm/sql/tdm45_manl_relate_ics.md) | `Ics01_Lookup_RelateTdm` |  |
| `insertList` | 39 | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md), [`tdm45_manl_relate_ics.insert`](../../tdm/sql/tdm45_manl_relate_ics.md) | `Ics01_Lookup_RelateTdm`, `Tdm43_Tab_ManlItemList` |  |
| `update` | 63 | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 68 | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE | `Ics01_Lookup_RelateTdm`, `Tdm43_Page_Relate`, `Tdm45_TabPage_Relate` | `UpdateDataModel` |
