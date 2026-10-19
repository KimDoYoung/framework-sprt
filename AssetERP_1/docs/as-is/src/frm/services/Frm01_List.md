# frm.Frm01_List

`server/frm/Frm01_List.java`

서비스 키 `frm.Frm01_List.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectMonitorngAppr` | 22 | `frm01_list.selectMonitorngAppr`(없음) | - |  |
| `selectToDoList` | 33 | [`frm01_list.selectToDoList`](../../frm/sql/frm01_list.md) | `Monitoring_Page_DayList` |  |
| `selectIcsNotice` | 46 | [`frm01_list.selectIcsNotice`](../../frm/sql/frm01_list.md) | `Monitoring_Page_IcsNotice` |  |
| `getNoticeCnt` | 59 | [`frm01_list.getNoticeCnt`](../../frm/sql/frm01_list.md) | `Frm01_Lookup_CheckList`, `MainFrame` |  |
| `getWebsocketList` | 78 | - | `SocketList` | `BroadcastWebsocket` |
