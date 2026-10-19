# tdm.Tdm47_ManlRelateDcr

`server/tdm/Tdm47_ManlRelateDcr.java`

서비스 키 `tdm.Tdm47_ManlRelateDcr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`tdm47_manl_relate_dcr.selectById`](../../tdm/sql/tdm47_manl_relate_dcr.md) | - |  |
| `selectByManlId` | 26 | [`tdm47_manl_relate_dcr.selectByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) | `Tdm43_Page_Relate`, `Tdm45_TabPage_Relate` |  |
| `insertList` | 31 | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md), [`tdm47_manl_relate_dcr.insert`](../../tdm/sql/tdm47_manl_relate_dcr.md) | `Tdm43_Tab_ManlItemList` |  |
| `update` | 55 | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 60 | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 DELETE | `Tdm43_Page_Relate`, `Tdm45_TabPage_Relate` | `UpdateDataModel` |
