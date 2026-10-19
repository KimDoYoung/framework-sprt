# 도메인: att

화면 4개, 컴포넌트 0개, 서버 클래스 6개, 매퍼 6개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Att02_Tab_CommuteAdmin`](screens/Att02_Tab_CommuteAdmin.md) | 경영관리 > 06. 근태관리 > 근태관리(관리자) | 6 | 12 |
| [`Att02_Tab_CommuteStatus`](screens/Att02_Tab_CommuteStatus.md) | 경영관리 > 06. 근태관리 > 근태현황(관리자) | 2 | 1 |
| [`Att02_Tab_PersonStatus`](screens/Att02_Tab_PersonStatus.md) | 경영관리 > 06. 근태관리 > 근태현황 | 2 | 1 |
| [`Att03_Tab_OvertimeReq`](screens/Att03_Tab_OvertimeReq.md) | 경영관리 > 06. 근태관리 > 연장근무관리 | 1 | 2 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`att.Att01_WorkPolicy`](../att/services/Att01_WorkPolicy.md) | 6 |
| [`att.Att02_Commute`](../att/services/Att02_Commute.md) | 14 |
| [`att.Att03_OvertimeReq`](../att/services/Att03_OvertimeReq.md) | 13 |
| [`att.Att04_CommuteHist`](../att/services/Att04_CommuteHist.md) | 7 |
| [`att.Att05_PmWork`](../att/services/Att05_PmWork.md) | 8 |
| [`att.Att13_OvertimeReqHist`](../att/services/Att13_OvertimeReqHist.md) | 4 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`att01_work_policy`](sql/att01_work_policy.md) | 4 |
| [`att02_commute`](sql/att02_commute.md) | 14 |
| [`att03_overtime_req`](sql/att03_overtime_req.md) | 5 |
| [`att04_commute_hist`](sql/att04_commute_hist.md) | 6 |
| [`att05_pm_work`](sql/att05_pm_work.md) | 6 |
| [`att13_overtime_req_hist`](sql/att13_overtime_req_hist.md) | 4 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Att02_Edit_CheckOutTime` | `client/vi/att/Att02_Edit_CheckOutTime.java` | `att.Att02_Commute.updateCheckOutTime` |
| `Att02_Edit_Reason` | `client/vi/att/Att02_Edit_Reason.java` | `att.Att02_Commute.updateReason` |
| `Att02_Lookup_Commute` | `client/vi/att/Att02_Lookup_Commute.java` | `att.Att01_WorkPolicy.getModel`, `att.Att02_Commute.getLastInfo`, `att.Att02_Commute.insertOffWork`, `att.Att02_Commute.insert`, `att.Att02_Commute.selectByDate` |
| `Att03_Lookup_OvertimeReq` | `client/vi/att/Att03_Lookup_OvertimeReq.java` | `att.Att01_WorkPolicy.getModel`, `att.Att03_OvertimeReq.checkWeekMaxTime`, `att.Att03_OvertimeReq.delete`, `att.Att03_OvertimeReq.getInfo`, `att.Att03_OvertimeReq.notInOvertimeReqIdList`, `att.Att03_OvertimeReq.selectByPersonId`, `att.Att03_OvertimeReq.update`, `att.Att05_PmWork.getWorkDateInfo`, `dcr.Dcr30_Link.selectByLinkCode`, `pay.Pay34_WorkTimeConfig.getModel` |
| `Att03_Tab_OvertimeReq_20260923` | `client/vi/att/Att03_Tab_OvertimeReq_20260923.java` | `att.Att03_OvertimeReq.selectByConfirmPersonId`, `att.Att03_OvertimeReq.updateReqStatusCode` |
| `Att05_Lookup_PmWork` | `client/vi/att/Att05_Lookup_PmWork.java` | `att.Att03_OvertimeReq.selectByPersonId`, `att.Att05_PmWork.delete`, `att.Att05_PmWork.notInPmWorkIdList`, `att.Att05_PmWork.selectByWorkDate`, `att.Att05_PmWork.update`, `dcr.Dcr30_Link.selectByLinkCode` |
