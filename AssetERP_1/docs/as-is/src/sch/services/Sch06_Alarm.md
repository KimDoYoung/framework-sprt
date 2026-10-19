# sch.Sch06_Alarm

`server/sch/Sch06_Alarm.java`

서비스 키 `sch.Sch06_Alarm.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`sch06_alarm.selectById`](../../sch/sql/sch06_alarm.md) | - |  |
| `selectByTargetId` | 23 | [`sch06_alarm.selectByTargetId`](../../sch/sql/sch06_alarm.md) | `Bbs02_Edit_Notice`, `Bbs02_Edit_NoticeAdmin`, `Sch06_Lookup_AlarmSetup` |  |
| `update` | 28 | `UpdateDataModel(sch06_alarm)` 동적 INSERT/UPDATE | `Sch06_Lookup_AlarmSetup` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(sch06_alarm)` 동적 DELETE | `Sch06_Lookup_AlarmSetup` | `UpdateDataModel` |
