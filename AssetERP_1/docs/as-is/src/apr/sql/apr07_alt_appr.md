# apr07_alt_appr

`server/apr/mapper/apr07_alt_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 34 | [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans` | - |
| `selectByEmpId` | select | 52 | [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans` | `apr.Apr07_AltAppr.selectByEmpId` |
| `notAltApprIdList` | select | 71 | [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans` | `apr.Apr07_AltAppr.notAltApprIdList` |
| `selectByToDay` | select | 110 | [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans`, `f_sysdate` | `apr.Apr07_AltAppr.selectByToDay` |
| `getToDay` | select | 135 | [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_sysdate`, `to_decrypts` | - |
| `selectCountByEmpId` | select | 153 | [`apr07_alt_appr`](../../../db/tables/apr.md) | `f_today` | `apr.Apr04_ApprStep.selectByApprId`, `apr.Apr04_ApprStep.selectByApprovalTypeCd`, `apr.Apr04_ApprStep.selectByApprovalTypeCd02` |
| `selectOneByEmpId` | select | 160 | [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans`, `f_today` | `apr.Apr04_ApprStep.changeByApproval`, `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate`, `apr.Apr04_ApprStep.selectByApprId`, `apr.Apr04_ApprStep.selectByApprovalTypeCd`, `apr.Apr04_ApprStep.selectByApprovalTypeCd02` |
| `selectOneByOrgEmpId` | select | 180 | [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans`, `f_today` | `apr.Apr04_ApprStep.selectByApprId`, `apr.Apr04_ApprStep.selectByApprovalTypeCd`, `apr.Apr04_ApprStep.selectByApprovalTypeCd02` |
| `selectByText` | select | 205 | [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_get_emptrans`, `f_trunc` | `apr.Apr07_AltAppr.selectByText` |
| `selectByAltApprId` | select | 231 | [`apr07_alt_appr`](../../../db/tables/apr.md) |  | - |
| `selectByLeaveId` | select | 237 | [`apr07_alt_appr`](../../../db/tables/apr.md) |  | `apr.Apr07_AltAppr.selectByLeaveId` |
| `deleteByLeaveId` | delete | 243 | [`apr07_alt_appr`](../../../db/tables/apr.md) |  | `apr.Apr07_AltAppr.deleteByLeaveId` |
| `duplicateCheck` | select | 249 | [`apr07_alt_appr`](../../../db/tables/apr.md) |  | `apr.Apr07_AltAppr.duplicateCheck`, `apr.Apr07_AltAppr.modelUpdate` |
