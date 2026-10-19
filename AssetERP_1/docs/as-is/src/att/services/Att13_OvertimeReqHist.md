# att.Att13_OvertimeReqHist

`server/att/Att13_OvertimeReqHist.java`

서비스 키 `att.Att13_OvertimeReqHist.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`att13_overtime_req_hist.selectById`](../../att/sql/att13_overtime_req_hist.md) | - |  |
| `updateInfo` | 27 | [`att13_overtime_req_hist.insert`](../../att/sql/att13_overtime_req_hist.md), [`att13_overtime_req_hist.selectByOvertimeReqId`](../../att/sql/att13_overtime_req_hist.md), [`att13_overtime_req_hist.updateInfo`](../../att/sql/att13_overtime_req_hist.md) | `Att03_Tab_OvertimeReq` |  |
| `update` | 57 | `UpdateDataModel(att13_overtime_req_hist)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 62 | `UpdateDataModel(att13_overtime_req_hist)` 동적 DELETE | - | `UpdateDataModel` |
