# sch.Sch12_IpoCorp

`server/sch/Sch12_IpoCorp.java`

서비스 키 `sch.Sch12_IpoCorp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`sch12_ipo_corp.selectById`](../../sch/sql/sch12_ipo_corp.md) | - |  |
| `selectBySearchText` | 23 | [`sch12_ipo_corp.selectBySearchText`](../../sch/sql/sch12_ipo_corp.md) | `Sch12_Lookup_IpoCorp` |  |
| `selectByCorpName` | 33 | [`sch12_ipo_corp.selectByCorpName`](../../sch/sql/sch12_ipo_corp.md) | `Sch10_Tab_Ipo`, `Sch10_Tab_Ipo2` |  |
| `selectByCorpNameList` | 43 | [`sch12_ipo_corp.selectByCorpNameList`](../../sch/sql/sch12_ipo_corp.md) | `Sch12_Lookup_IpoCorpList` |  |
| `update` | 57 | `UpdateDataModel(sch12_ipo_corp)` 동적 INSERT/UPDATE | `Sch12_Lookup_IpoCorp` | `UpdateDataModel` |
| `delete` | 62 | `UpdateDataModel(sch12_ipo_corp)` 동적 DELETE | `Sch12_Lookup_IpoCorp` | `UpdateDataModel` |
