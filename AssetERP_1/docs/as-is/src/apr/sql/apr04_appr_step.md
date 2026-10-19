# apr04_appr_step

`server/apr/mapper/apr04_appr_step.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 40 | [`apr04_appr_step`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today` | - |
| `selectByIn` | select | 48 | [`apr04_appr_step`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today` | - |
| `selectByPersonId` | select | 66 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `emp.Emp04_AddTitle.deleteList` |
| `selectByApprId` | select | 73 | [`apr04_appr_step`](../../../db/tables/apr.md), [`apr92_appr_modi`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`, `f_today` | `apr.Apr04_ApprStep.cancelUpdate`, `apr.Apr04_ApprStep.confirmUpdate`, `apr.Apr04_ApprStep.selectByApprId`, `emp.Emp20_Leave.cancelUpdate` |
| `selectByLastApprCheck` | select | 100 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | - |
| `selectByLastAppr` | select | 107 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | - |
| `selectApprStep` | select | 119 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr01_Appr.appr` |
| `lastStepList` | select | 131 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md) | `f_sysdate` | `apr.Apr04_ApprStep.confirmUpdate` |
| `lastStepOne` | select | 159 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.confirmUpdate` |
| `valid_org_code_tibero` | sql | 171 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_sysdate`, `f_to_number` |  |
| `valid_org_code_postgresql` | sql | 191 | [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_sysdate`, `f_to_number`, `f_trunc` |  |
| `selectApprStepByType` | select | 252 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc` | `apr.Apr04_ApprStep.selectByApprovalTypeCd`, `apr.Apr04_ApprStep.selectByApprovalTypeCd02`, `att.Att03_OvertimeReq.selectApprStepByType` |
| `lastCheck` | select | 272 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate` |
| `nextCheck` | select | 281 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate` |
| `cancelCheck` | select | 290 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.cancelCheck` |
| `getApprStepList` | select | 297 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.getApprStepList` |
| `checkApprId` | select | 305 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.checkApprId` |
| `confirmCheck` | select | 312 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.confirmCheck` |
| `nextTurnCheck` | select | 369 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.nextTurnCheck` |
| `signIdListChk` | select | 426 | [`apr04_appr_step`](../../../db/tables/apr.md), [`emp60_sign`](../../../db/tables/emp.md) |  | `emp.Emp60_Sign.deleteChk` |
| `deleteByApprId` | delete | 441 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr01_Appr.deleteByApprId`, `apr.Apr01_Appr.update`, `fnd.Fnd20_Plan.delete`, `fnd.Fnd30_Opr.deleteApprId`, `opr.Opr01_Create.delete`, `pln.Pln02_Plan.delete` |
| `confirmUpdate` | update | 447 | [`apr04_appr_step`](../../../db/tables/apr.md), [`emp60_sign`](../../../db/tables/emp.md) | `f_sysdate` | `apr.Apr04_ApprStep.confirmUpdate` |
| `nextConfirmUpdate` | update | 471 | [`apr04_appr_step`](../../../db/tables/apr.md), [`emp60_sign`](../../../db/tables/emp.md) | `f_sysdate` | `apr.Apr04_ApprStep.confirmUpdate` |
| `addMessage` | update | 493 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.addMessage` |
| `clearApprStepId` | update | 501 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.clearApprStepId` |
| `cancelUpdate` | delete | 512 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `apr.Apr04_ApprStep.cancelUpdate` |
| `insertApproval` | insert | 523 | [`apr04_appr_step`](../../../db/tables/apr.md) |  | `emp.Emp21_UnLeave.insertAppr`, `emp.Emp21_UnLeave.insertAppr2`, `tdm.Tdm30_RoleAllc.insertAppr` |
