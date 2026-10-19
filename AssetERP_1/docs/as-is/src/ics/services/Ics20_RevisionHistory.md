# ics.Ics20_RevisionHistory

`server/ics/Ics20_RevisionHistory.java`

서비스 키 `ics.Ics20_RevisionHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`ics20_revision_history.selectById`](../../ics/sql/ics20_revision_history.md) | - |  |
| `selectByDate` | 26 | [`ics20_revision_history.selectByDate`](../../ics/sql/ics20_revision_history.md) | `Ics20_Tab_RevisionHistory`, `Ics20_Tab_RevisionHistoryAdmin` |  |
| `selectByClassTreeId` | 48 | [`ics20_revision_history.selectByClassTreeId`](../../ics/sql/ics20_revision_history.md) | `Ics01_Page_RevisionHistory`, `Ics20_Lookup_RevisionHistory` |  |
| `updateContent` | 60 | [`ics20_revision_history.updateContent`](../../ics/sql/ics20_revision_history.md) | `Ics20_Lookup_Content` |  |
| `update` | 71 | `UpdateDataModel(ics20_revision_history)` 동적 INSERT/UPDATE | `Ics20_Edit_RevisionHistoryAdmin` | `UpdateDataModel` |
| `delete` | 76 | `UpdateDataModel(ics20_revision_history)` 동적 DELETE | `Ics20_Edit_RevisionHistoryAdmin`, `Ics20_Tab_RevisionHistory`, `Ics20_Tab_RevisionHistoryAdmin` | `UpdateDataModel` |
