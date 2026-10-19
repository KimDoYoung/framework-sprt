# ics.Ics32_RelateAppr

`server/ics/Ics32_RelateAppr.java`

서비스 키 `ics.Ics32_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`ics32_relate_appr.selectById`](../../ics/sql/ics32_relate_appr.md) | - |  |
| `selectByCompanyId` | 25 | [`ics32_relate_appr.selectByCompanyId`](../../ics/sql/ics32_relate_appr.md) | `Ics31_Tab_ComplianceReport` |  |
| `selectByCount` | 37 | [`ics32_relate_appr.selectByCount`](../../ics/sql/ics32_relate_appr.md) | `Ics32_Lookup_RelateAppr` |  |
| `insert` | 48 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics32_relate_appr.insert`](../../ics/sql/ics32_relate_appr.md), [`ics32_relate_appr.selectByCompanyId`](../../ics/sql/ics32_relate_appr.md) | `Ics31_Tab_ComplianceReport`, `Ics32_Lookup_RelateAppr` |  |
| `updateApprId` | 77 | [`ics32_relate_appr.updateApprId`](../../ics/sql/ics32_relate_appr.md) | `Ics31_Tab_ComplianceReport`, `Ics32_Lookup_RelateAppr` |  |
| `update` | 86 | `UpdateDataModel(ics32_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 91 | `UpdateDataModel(ics32_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
