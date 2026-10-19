# tdm.Tdm58_ChckApprStep

`server/tdm/Tdm58_ChckApprStep.java`

서비스 키 `tdm.Tdm58_ChckApprStep.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`tdm58_chck_appr_step.selectById`](../../tdm/sql/tdm58_chck_appr_step.md) | - |  |
| `selectByChckOrgId` | 22 | [`tdm58_chck_appr_step.selectByChckOrgId`](../../tdm/sql/tdm58_chck_appr_step.md) | `Tdm58_Lookup_ChckApprStep` |  |
| `update` | 27 | `UpdateDataModel(tdm58_chck_appr_step)` 동적 INSERT/UPDATE | `Tdm58_Lookup_ChckApprStep` | `UpdateDataModel` |
| `delete` | 37 | `UpdateDataModel(tdm58_chck_appr_step)` 동적 DELETE | `Tdm58_Lookup_ChckApprStep` | `UpdateDataModel` |
