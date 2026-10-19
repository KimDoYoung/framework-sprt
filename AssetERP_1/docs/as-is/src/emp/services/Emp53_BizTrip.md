# emp.Emp53_BizTrip

`server/emp/Emp53_BizTrip.java`

서비스 키 `emp.Emp53_BizTrip.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`emp53_biz_trip.selectById`](../../emp/sql/emp53_biz_trip.md) | - |  |
| `selectByCompanyId` | 27 | [`emp53_biz_trip.selectByCompanyId`](../../emp/sql/emp53_biz_trip.md) | `Emp53_Tab_BizTripManager` |  |
| `selectByPersonId` | 41 | [`emp53_biz_trip.selectByPersonId`](../../emp/sql/emp53_biz_trip.md) | `Emp53_Tab_BizTrip` |  |
| `updateShareInfo` | 61 | [`emp53_biz_trip.selectById`](../../emp/sql/emp53_biz_trip.md), [`emp53_biz_trip.updatePublicYn`](../../emp/sql/emp53_biz_trip.md) | `Emp53_Lookup_BizTripShare` |  |
| `modelUpdate` | 68 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp53_biz_trip)` 동적 INSERT/UPDATE | `Emp53_Lookup_BizTrip` | `UpdateDataModel` |
| `update` | 81 | `UpdateDataModel(emp53_biz_trip)` 동적 INSERT/UPDATE | `Emp53_Tab_BizTrip`, `Emp53_Tab_BizTripManager` | `UpdateDataModel` |
| `delete` | 86 | `UpdateDataModel(emp53_biz_trip)` 동적 DELETE | `Emp53_Tab_BizTrip` | `UpdateDataModel` |
