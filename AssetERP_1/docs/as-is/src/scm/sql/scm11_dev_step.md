# scm11_dev_step

`server/scm/mapper/scm11_dev_step.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 46 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_dev_status`, `f_sysdate` | `scm.Scm11_DevStep.selectById` |
| `selectByDevId` | select | 77 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_dev_status`, `f_sysdate` | `scm.Scm11_DevStep.selectByDevId` |
| `selectByPersonId` | select | 108 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_dev_status`, `f_sysdate`, `f_trunc` | `scm.Scm11_DevStep.selectByPersonId` |
| `selectByDeployPersonId` | select | 149 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_dev_status`, `f_sysdate`, `f_trunc` | `scm.Scm11_DevStep.selectByDeployPersonId` |
| `selectByMyTurnCheck` | select | 241 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_sysdate`, `f_trunc` | `scm.Scm11_DevStep.selectByMyTurnCheck` |
| `checkDevStep` | select | 298 | [`scm11_dev_step`](../../../db/tables/scm.md) |  | `scm.Scm10_Dev.updateList` |
| `checkMyTurn` | select | 305 | [`scm11_dev_step`](../../../db/tables/scm.md) |  | `scm.Scm11_DevStep.checkMyTurn`, `scm.Scm11_DevStep.updateResultCode`, `scm.Scm11_DevStep.updateStatus` |
| `updateResultCode` | update | 317 | [`scm11_dev_step`](../../../db/tables/scm.md) | `f_sysdate` | `scm.Scm11_DevStep.updateResultCode` |
| `updateResult` | update | 333 | [`scm11_dev_step`](../../../db/tables/scm.md) |  | `scm.Scm11_DevStep.updateResult` |
| `updateDevStatusCode` | update | 339 | [`scm11_dev_step`](../../../db/tables/scm.md) | `f_sysdate` | `scm.Scm11_DevStep.updateStatus` |
| `updateResultDeploy` | update | 355 | [`scm11_dev_step`](../../../db/tables/scm.md) | `f_sysdate` | `scm.Scm13_DevProgram.updateResultDeploy` |
| `updateResultDate` | update | 363 | [`scm11_dev_step`](../../../db/tables/scm.md) | `f_sysdate` | `scm.Scm11_DevStep.modelUpdate` |
| `inUpdateProgress` | insert | 379 | [`scm11_dev_step`](../../../db/tables/scm.md) | `f_create_seq` | `scm.Scm11_DevStep.inUpdateProgress` |
| `deleteByDevId` | delete | 420 | [`scm11_dev_step`](../../../db/tables/scm.md) |  | `scm.Scm11_DevStep.deleteByDevId` |
