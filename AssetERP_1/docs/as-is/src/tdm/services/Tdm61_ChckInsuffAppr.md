# tdm.Tdm61_ChckInsuffAppr

`server/tdm/Tdm61_ChckInsuffAppr.java`

서비스 키 `tdm.Tdm61_ChckInsuffAppr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm61_chck_insuff_appr.selectById`](../../tdm/sql/tdm61_chck_insuff_appr.md) | - |  |
| `updateApprCmnt` | 25 | [`tdm61_chck_insuff_appr.updateById`](../../tdm/sql/tdm61_chck_insuff_appr.md) | `Tdm54_Lookup_ChckInsuffCmnt` |  |
| `updateApprStatus` | 38 | [`tdm54_chck_insuff.updateStatusCode`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm61_chck_insuff_appr.updateById`](../../tdm/sql/tdm61_chck_insuff_appr.md) | `Tdm54_Lookup_ChckInsuffCmnt` | `Tdm91_CompanySetup` |
| `update` | 136 | `UpdateDataModel(tdm61_chck_insuff_appr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 141 | `UpdateDataModel(tdm61_chck_insuff_appr)` 동적 DELETE | - | `UpdateDataModel` |
