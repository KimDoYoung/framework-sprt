# ics.Ics41_DcrType

`server/ics/Ics41_DcrType.java`

서비스 키 `ics.Ics41_DcrType.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`ics41_dcr_type.selectById`](../../ics/sql/ics41_dcr_type.md) | - |  |
| `selectByText` | 24 | [`ics41_dcr_type.selectByText`](../../ics/sql/ics41_dcr_type.md) | `Ics41_Lookup_DcrType`, `Ics41_Lookup_SelectSingle` |  |
| `adYnCheck` | 36 | [`ics41_dcr_type.adYnCheck`](../../ics/sql/ics41_dcr_type.md) | `Ics40_Tab_DcrPreConfirm` |  |
| `notInDcrTypeIdList` | 47 | [`ics41_dcr_type.notInDcrTypeIdList`](../../ics/sql/ics41_dcr_type.md) | `Ics41_Lookup_DcrType` |  |
| `update` | 59 | `UpdateDataModel(ics41_dcr_type)` 동적 INSERT/UPDATE | `Ics41_Lookup_DcrType` | `UpdateDataModel` |
| `delete` | 64 | `UpdateDataModel(ics41_dcr_type)` 동적 DELETE | `Ics41_Lookup_DcrType` | `UpdateDataModel` |
