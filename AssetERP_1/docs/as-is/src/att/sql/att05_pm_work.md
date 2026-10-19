# att05_pm_work

`server/att/mapper/att05_pm_work.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md) | `f_cdnm` | `att.Att05_PmWork.selectById` |
| `selectByPersonId` | select | 56 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md) | `f_cdnm` | `att.Att05_PmWork.selectByPersonId` |
| `selectByWorkDate` | select | 90 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md) | `f_cdnm` | `att.Att05_PmWork.selectByWorkDate` |
| `getWorkDateInfo` | select | 127 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md) | `f_cdnm` | `att.Att05_PmWork.getWorkDateInfo` |
| `notInPmWorkIdList` | select | 165 | [`att05_pm_work`](../../../db/tables/att.md) |  | `att.Att05_PmWork.notInPmWorkIdList` |
| `updateApprId` | update | 179 | [`att05_pm_work`](../../../db/tables/att.md) |  | `att.Att05_PmWork.updateApprId` |
