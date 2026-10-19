# dcr.Dcr08_OftenUse

`server/dcr/Dcr08_OftenUse.java`

서비스 키 `dcr.Dcr08_OftenUse.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`dcr08_often_use.selectById`](../../dcr/sql/dcr08_often_use.md) | - |  |
| `selectByPersonId` | 24 | [`dcr08_often_use.selectByPersonId`](../../dcr/sql/dcr08_often_use.md) | `Dcr08_Lookup_SelectSingle` |  |
| `insertUpdate` | 34 | [`dcr08_often_use.insertUpdate`](../../dcr/sql/dcr08_often_use.md) | `Dcr01_Tab_DcrWrite` |  |
| `update` | 45 | `UpdateDataModel(dcr08_often_use)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 50 | `UpdateDataModel(dcr08_often_use)` 동적 DELETE | - | `UpdateDataModel` |
