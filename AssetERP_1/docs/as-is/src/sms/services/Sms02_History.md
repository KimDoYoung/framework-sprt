# sms.Sms02_History

`server/sms/Sms02_History.java`

서비스 키 `sms.Sms02_History.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`sms02_history.selectById`](../../sms/sql/sms02_history.md) | - |  |
| `selectByDate` | 31 | [`sms02_history.selectByDate`](../../sms/sql/sms02_history.md) | `Sms02_Lookup_History` |  |
| `selectByTotalCount` | 43 | [`sms02_history.selectByTotalCount`](../../sms/sql/sms02_history.md) | `Sms02_Tab_TotalCount` |  |
| `selectByTotalCountYear` | 51 | [`sms02_history.selectByTotalCountYear`](../../sms/sql/sms02_history.md) | `Sms02_TabPage_Detail` |  |
| `selectByTotalCountMonth` | 59 | [`sms02_history.selectByTotalCountMonth`](../../sms/sql/sms02_history.md) | `Sms02_TabPage_Detail` |  |
| `sendTagetMessage` | 68 | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`sms02_history.insert`](../../sms/sql/sms02_history.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | - | `SendSMSAPIFunction` |
| `sendMessage` | 100 | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`sms02_history.insert`](../../sms/sql/sms02_history.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Bbs11_Tab_Application`, `Bbs11_Tab_ApplicationMng`, `Emp20_Edit_Leave` | `SendSMSAPIFunction` |
| `update` | 141 | `UpdateDataModel(sms02_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 146 | `UpdateDataModel(sms02_history)` 동적 DELETE | - | `UpdateDataModel` |
