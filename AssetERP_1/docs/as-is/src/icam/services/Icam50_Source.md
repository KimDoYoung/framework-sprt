# icam.Icam50_Source

`server/icam/Icam50_Source.java`

서비스 키 `icam.Icam50_Source.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`icam50_source.selectById`](../../icam/sql/icam50_source.md) | - |  |
| `selectByServerTypePaging` | 22 | [`icam50_source.selectByServerTypePaging`](../../icam/sql/icam50_source.md), [`icam50_source.selectByServerTypePagingTotal`](../../icam/sql/icam50_source.md) | `Icam50_Tab_DbSource` |  |
| `insertIcamDbSource` | 28 | [`icam50_source.countByStdDate`](../../icam/sql/icam50_source.md), [`icam50_source.insertIcam50`](../../icam/sql/icam50_source.md), [`icam50_source.insertIcamDbSource`](../../icam/sql/icam50_source.md) | `Icam50_Tab_DbSource` | `DatabaseFactoryICAM` |
