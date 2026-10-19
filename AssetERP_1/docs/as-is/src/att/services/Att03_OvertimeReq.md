# att.Att03_OvertimeReq

`server/att/Att03_OvertimeReq.java`

서비스 키 `att.Att03_OvertimeReq.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`att03_overtime_req.selectById`](../../att/sql/att03_overtime_req.md) | - |  |
| `selectByCompanyId` | 32 | `att03_overtime_req.selectByCompanyId`(없음) | - |  |
| `selectByPersonId` | 43 | [`att03_overtime_req.selectByPersonId`](../../att/sql/att03_overtime_req.md) | `Att03_Lookup_OvertimeReq`, `Att05_Lookup_PmWork` |  |
| `getConfirmList` | 54 | [`att03_overtime_req.getConfirmList`](../../att/sql/att03_overtime_req.md) | `Att03_Tab_OvertimeReq` |  |
| `getInfo` | 65 | [`att03_overtime_req.getInfo`](../../att/sql/att03_overtime_req.md) | `Att03_Lookup_OvertimeReq` |  |
| `selectByConfirmPersonId` | 76 | `att03_overtime_req.selectByConfirmPersonId`(없음) | `Att03_Tab_OvertimeReq_20260923` |  |
| `selectApprStepByType` | 88 | [`apr04_appr_step.selectApprStepByType`](../../apr/sql/apr04_appr_step.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md) | `Apr90_Lookup_ConfirmEmp` |  |
| `notInOvertimeReqIdList` | 110 | [`att03_overtime_req.notInOvertimeReqIdList`](../../att/sql/att03_overtime_req.md) | `Att03_Lookup_OvertimeReq` |  |
| `sendMessage` | 123 | [`emp01_person.selectById`](../../emp/sql/emp01_person.md) | - | `SendSMSAPIFunction` |
| `updateReqStatusCode` | 137 | `att03_overtime_req.updateReqStatusCode`(없음) | `Att03_Tab_OvertimeReq_20260923` |  |
| `checkWeekMaxTime` | 153 | - | `Att03_Lookup_OvertimeReq` |  |
| `update` | 183 | `UpdateDataModel(att03_overtime_req)` 동적 INSERT/UPDATE | `Att03_Lookup_OvertimeReq` | `UpdateDataModel` |
| `delete` | 188 | `UpdateDataModel(att03_overtime_req)` 동적 DELETE | `Att03_Lookup_OvertimeReq` | `UpdateDataModel` |
