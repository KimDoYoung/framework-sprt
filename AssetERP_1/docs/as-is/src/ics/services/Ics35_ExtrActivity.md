# ics.Ics35_ExtrActivity

`server/ics/Ics35_ExtrActivity.java`

서비스 키 `ics.Ics35_ExtrActivity.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`ics35_extr_activity.selectById`](../../ics/sql/ics35_extr_activity.md) | - |  |
| `selectByCompanyId` | 26 | [`ics35_extr_activity.selectByCompanyId`](../../ics/sql/ics35_extr_activity.md) | `Ics35_Tab_ExtrActivityList` |  |
| `selectByPersonId` | 39 | [`ics35_extr_activity.selectByPersonId`](../../ics/sql/ics35_extr_activity.md) | `Ics35_Tab_ExtrActivity` |  |
| `updateApprId` | 52 | [`ics35_extr_activity.updateApprId`](../../ics/sql/ics35_extr_activity.md) | `Ics35_Tab_ExtrActivity` |  |
| `updateResultApprId` | 61 | [`ics35_extr_activity.updateResultApprId`](../../ics/sql/ics35_extr_activity.md) | `Ics35_Tab_ExtrActivity` |  |
| `modelUpdate` | 70 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics35_extr_activity)` 동적 INSERT/UPDATE | `Ics35_Edit_ExtrActivity` | `UpdateDataModel` |
| `update` | 83 | `UpdateDataModel(ics35_extr_activity)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 88 | `UpdateDataModel(ics35_extr_activity)` 동적 DELETE | `Ics35_Tab_ExtrActivity` | `UpdateDataModel` |
