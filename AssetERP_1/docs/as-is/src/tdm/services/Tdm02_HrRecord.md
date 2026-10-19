# tdm.Tdm02_HrRecord

`server/tdm/Tdm02_HrRecord.java`

서비스 키 `tdm.Tdm02_HrRecord.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`tdm02_hr_record.selectById`](../../tdm/sql/tdm02_hr_record.md) | - |  |
| `selectByCompanyId` | 22 | [`tdm02_hr_record.selectByCompanyId`](../../tdm/sql/tdm02_hr_record.md) | `Tdm02_Lookup_HrRecord`, `Tdm30_Tab_RoleAllc` |  |
| `selectChangeList` | 27 | [`tdm02_hr_record.selectChangeList`](../../tdm/sql/tdm02_hr_record.md) | `Tdm00_Tab_ChangeList` |  |
| `updateApplyCode` | 32 | [`tdm02_hr_record.updateApplyCode`](../../tdm/sql/tdm02_hr_record.md) | `Tdm02_Lookup_HrRecord` |  |
| `delete` | 46 | `UpdateDataModel(tdm02_hr_record)` 동적 DELETE | - | `UpdateDataModel` |
