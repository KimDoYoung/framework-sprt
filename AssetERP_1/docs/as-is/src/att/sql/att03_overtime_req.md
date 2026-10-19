# att03_overtime_req

`server/att/mapper/att03_overtime_req.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 36 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md), `att13_overtime_req_hist` ⚠DB없음, [`emp01_person`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay34_work_time_config`](../../../db/tables/pay.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `att.Att03_OvertimeReq.selectById` |
| `selectByPersonId` | select | 156 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay34_work_time_config`](../../../db/tables/pay.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `att.Att03_OvertimeReq.selectByPersonId` |
| `getConfirmList` | select | 292 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md), `att13_overtime_req_hist` ⚠DB없음, [`emp01_person`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay34_work_time_config`](../../../db/tables/pay.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `att.Att03_OvertimeReq.getConfirmList` |
| `notInOvertimeReqIdList` | select | 424 | [`att03_overtime_req`](../../../db/tables/att.md) | `f_cdnm`, `f_sysdate` | `att.Att03_OvertimeReq.notInOvertimeReqIdList` |
| `getInfo` | select | 441 | [`apr01_appr`](../../../db/tables/apr.md), [`att03_overtime_req`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay34_work_time_config`](../../../db/tables/pay.md) |  | `att.Att03_OvertimeReq.getInfo` |
