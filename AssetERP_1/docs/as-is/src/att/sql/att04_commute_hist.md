# att04_commute_hist

`server/att/mapper/att04_commute_hist.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`att04_commute_hist`](../../../db/tables/att.md) |  | `att.Att04_CommuteHist.selectById` |
| `selectByCommuteId` | select | 24 | [`att04_commute_hist`](../../../db/tables/att.md) |  | `att.Att04_CommuteHist.insert`, `att.Att04_CommuteHist.insertList`, `att.Att04_CommuteHist.updateAuto` |
| `insert` | insert | 30 | [`att02_commute`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md) | `f_create_seq`, `f_sysdate` | `att.Att04_CommuteHist.insert`, `att.Att04_CommuteHist.insertList` |
| `insertAuto` | insert | 56 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md) | `f_create_seq`, `f_sysdate` | `att.Att04_CommuteHist.updateAuto` |
| `updateTime` | update | 160 | [`att04_commute_hist`](../../../db/tables/att.md) | `f_sysdate` | `att.Att04_CommuteHist.insert`, `att.Att04_CommuteHist.insertList` |
| `updateTimeAuto` | update | 176 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md) | `f_sysdate` | `att.Att04_CommuteHist.updateAuto` |
