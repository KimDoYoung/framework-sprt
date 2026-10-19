# dcr.Dcr07_ClassDetail

`server/dcr/Dcr07_ClassDetail.java`

서비스 키 `dcr.Dcr07_ClassDetail.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`dcr07_class_detail.selectById`](../../dcr/sql/dcr07_class_detail.md) | `Dcr01_Tab_DcrWrite` |  |
| `selectByClassTreeId` | 24 | [`dcr07_class_detail.selectByClassTreeId`](../../dcr/sql/dcr07_class_detail.md) | `Dcr07_Lookup_ClassDetail` |  |
| `update` | 34 | `UpdateDataModel(dcr07_class_detail)` 동적 INSERT/UPDATE | `Dcr07_Lookup_ClassDetail` | `UpdateDataModel` |
| `delete` | 39 | `UpdateDataModel(dcr07_class_detail)` 동적 DELETE | `Dcr07_Lookup_ClassDetail` | `UpdateDataModel` |
