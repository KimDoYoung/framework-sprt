# apr.Apr07_AltAppr

`server/apr/Apr07_AltAppr.java`

서비스 키 `apr.Apr07_AltAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByText` | 24 | [`apr07_alt_appr.selectByText`](../../apr/sql/apr07_alt_appr.md) | `Apr07_Tab_AltApprMgr` |  |
| `selectByEmpId` | 42 | [`apr07_alt_appr.selectByEmpId`](../../apr/sql/apr07_alt_appr.md) | `Apr07_Tab_AltAppr` |  |
| `notAltApprIdList` | 56 | [`apr07_alt_appr.notAltApprIdList`](../../apr/sql/apr07_alt_appr.md) | `Apr07_Lookup_AltAppr`, `Apr07_Tab_AltAppr`, `Apr07_Tab_AltApprMgr` |  |
| `selectByToDay` | 69 | [`apr07_alt_appr.selectByToDay`](../../apr/sql/apr07_alt_appr.md) | `Apr07_Lookup_AltAppr` |  |
| `selectByLeaveId` | 79 | [`apr07_alt_appr.selectByLeaveId`](../../apr/sql/apr07_alt_appr.md) | `Emp20_Tab_Leave` |  |
| `deleteByLeaveId` | 89 | [`apr07_alt_appr.deleteByLeaveId`](../../apr/sql/apr07_alt_appr.md) | `Emp20_Tab_Leave` |  |
| `duplicateCheck` | 97 | [`apr07_alt_appr.duplicateCheck`](../../apr/sql/apr07_alt_appr.md), `UpdateDataModel(apr07_alt_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `modelUpdate` | 123 | [`apr07_alt_appr.duplicateCheck`](../../apr/sql/apr07_alt_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr07_alt_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 148 | `UpdateDataModel(apr07_alt_appr)` 동적 INSERT/UPDATE | `Apr07_Lookup_AltAppr`, `Apr07_Tab_AltAppr`, `Apr07_Tab_AltApprMgr` | `UpdateDataModel` |
| `delete` | 153 | `UpdateDataModel(apr07_alt_appr)` 동적 DELETE | `Apr07_Lookup_AltAppr`, `Apr07_Tab_AltAppr`, `Apr07_Tab_AltApprMgr` | `UpdateDataModel` |
