# tdm.Tdm01_Hr

`server/tdm/Tdm01_Hr.java`

서비스 키 `tdm.Tdm01_Hr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`tdm01_hr.selectById`](../../tdm/sql/tdm01_hr.md) | - |  |
| `selectByCompanyId` | 27 | [`tdm01_hr.selectByCompanyId`](../../tdm/sql/tdm01_hr.md) | `Tdm01_Tab_Hr` |  |
| `selectByEndDate` | 32 | [`tdm01_hr.selectByEndDate`](../../tdm/sql/tdm01_hr.md) | `Tdm01_Lookup_SelectSingle` |  |
| `selectPersonModifyed` | 37 | [`tdm01_hr.selectPersonModifyed`](../../tdm/sql/tdm01_hr.md) | `Tdm01_Lookup_HrChangeInfo` |  |
| `updateHrInfo` | 42 | [`emp00_trans_info.selectGetPersonByPersonId`](../../emp/sql/emp00_trans_info.md), [`tdm01_hr.insert`](../../tdm/sql/tdm01_hr.md), [`tdm01_hr.selectByPersonId`](../../tdm/sql/tdm01_hr.md), [`tdm01_hr.updateEndDate`](../../tdm/sql/tdm01_hr.md), [`tdm01_hr.updateHrChange`](../../tdm/sql/tdm01_hr.md), [`tdm02_hr_record.insert`](../../tdm/sql/tdm02_hr_record.md) | `Tdm01_Lookup_HrChangeInfo` |  |
| `update` | 217 | `UpdateDataModel(tdm01_hr)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
