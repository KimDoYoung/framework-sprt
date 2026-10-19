# sch.Sch15_IpoItemMatching

`server/sch/Sch15_IpoItemMatching.java`

서비스 키 `sch.Sch15_IpoItemMatching.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`sch15_ipo_item_matching.selectById`](../../sch/sql/sch15_ipo_item_matching.md) | - |  |
| `selectByText` | 21 | [`sch15_ipo_item_matching.selectByText`](../../sch/sql/sch15_ipo_item_matching.md) | `Sch15_Lookup_IpoItemMatching` |  |
| `update` | 26 | `UpdateDataModel(sch15_ipo_item_matching)` 동적 INSERT/UPDATE | `Sch15_Lookup_IpoItemMatching` | `UpdateDataModel` |
| `delete` | 31 | `UpdateDataModel(sch15_ipo_item_matching)` 동적 DELETE | `Sch15_Lookup_IpoItemMatching` | `UpdateDataModel` |
