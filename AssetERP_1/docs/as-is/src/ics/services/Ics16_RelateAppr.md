# ics.Ics16_RelateAppr

`server/ics/Ics16_RelateAppr.java`

서비스 키 `ics.Ics16_RelateAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`ics16_relate_appr.selectById`](../../ics/sql/ics16_relate_appr.md) | - |  |
| `selectByCompanyId` | 27 | [`ics16_relate_appr.selectByCompanyId`](../../ics/sql/ics16_relate_appr.md) | - |  |
| `selectByConfirmerId` | 45 | [`ics16_relate_appr.selectByConfirmerId`](../../ics/sql/ics16_relate_appr.md) | `Ics16_Lookup_RelateAppr` |  |
| `updateApprId` | 63 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics16_relate_appr.selectByCompanyId`](../../ics/sql/ics16_relate_appr.md), [`ics16_relate_appr.updateApprId`](../../ics/sql/ics16_relate_appr.md), `UpdateDataModel(ics16_relate_appr)` 동적 INSERT/UPDATE | `Ics16_Lookup_RelateAppr` | `UpdateDataModel` |
| `update` | 118 | `UpdateDataModel(ics16_relate_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 123 | `UpdateDataModel(ics16_relate_appr)` 동적 DELETE | - | `UpdateDataModel` |
