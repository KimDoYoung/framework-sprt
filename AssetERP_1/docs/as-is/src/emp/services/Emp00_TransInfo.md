# emp.Emp00_TransInfo

`server/emp/Emp00_TransInfo.java`

서비스 키 `emp.Emp00_TransInfo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByText` | 33 | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) | `Apr04_Edit_ApprStep`, `Bbs20_Lookup_Message`, `Emp00_Lookup_PersonnelRecordCard`, `Emp00_Lookup_SelectMulti`, `Emp00_Lookup_SelectSingle`, `Emp00_Tab_RoleMenu`, `Emp00_Tab_TransInfo`, `Emp10_Lookup_List`, `Emp10_Lookup_MailAddress`, `Emp43_Lookup_SelectSingle`, `Pay01_Tab_Annual`, `Pay01_Tab_AnnualList`, `Pay02_Tab_PersonListManager`, `Pay10_Tab_PersonListManager`, `Pay31_TabPage_InsureApply1`, `Pay31_TabPage_InsureApply2`, `Pay31_TabPage_InsureApply3`, `Pay31_TabPage_InsureApply4`, `Pay32_Tab_InsurePay`, `Sms03_Page_UserList`, `Sys05_Tab_PersonRole` | `DateUtil` |
| `selectByEvalText` | 72 | [`emp00_trans_info.selectByEvalText`](../../emp/sql/emp00_trans_info.md) | `Emp43_Lookup_SelectMulti` |  |
| `selectByList` | 86 | [`emp00_trans_info.selectByList`](../../emp/sql/emp00_trans_info.md) | `Sms03_Lookup_SendList` |  |
| `selectByTitleCode` | 98 | [`emp00_trans_info.selectByTitleCode`](../../emp/sql/emp00_trans_info.md) | `Bbs20_Edit_FloralRequest` |  |
| `selectByOrgCodeId` | 110 | [`emp00_trans_info.selectByOrgCodeId`](../../emp/sql/emp00_trans_info.md) | `Apr04_Edit_ApprStep`, `Apr04_Edit_RetouchApprStep`, `Apr31_Edit_ApprStep`, `Emp00_RDR_OrgPerson`, `Scm02_Edit_ApprStep` |  |
| `selectByObseverOfficer` | 132 | [`emp00_trans_info.selectByObseverOfficer`](../../emp/sql/emp00_trans_info.md) | `Apr01_Edit_ApprDoc`, `Apr04_Edit_ApprStep` |  |
| `selectByComplianceOfficer` | 150 | [`emp00_trans_info.selectByComplianceOfficer`](../../emp/sql/emp00_trans_info.md) | `Apr01_Edit_ApprDoc` |  |
| `selectByRiskOfficer` | 167 | [`emp00_trans_info.selectByRiskOfficer`](../../emp/sql/emp00_trans_info.md) | `Apr01_Edit_ApprDoc` |  |
| `selectByManagementOfficer` | 183 | [`emp00_trans_info.selectByManagementOfficer`](../../emp/sql/emp00_trans_info.md) | `Apr01_Edit_ApprDoc` |  |
| `selectOneByPersonId` | 199 | [`emp00_trans_info.selectOneByPersonId`](../../emp/sql/emp00_trans_info.md) | `Emp00_Current_TransInfoModel` |  |
| `selectByTransId` | 210 | [`emp00_trans_info.selectById`](../../emp/sql/emp00_trans_info.md) | - |  |
| `selectByPersonId` | 221 | [`emp00_trans_info.selectByPersonId`](../../emp/sql/emp00_trans_info.md) | - |  |
| `selectOneEmpInfo` | 237 | [`emp00_trans_info.selectOneEmpInfo`](../../emp/sql/emp00_trans_info.md) | `Apr01_Edit_ApprDoc` |  |
| `selectByStampEmpId` | 249 | [`emp00_trans_info.selectByStampEmpId`](../../emp/sql/emp00_trans_info.md) | `Apr01_Edit_ApprDoc` |  |
| `selectByAuthEmp` | 264 | [`emp00_trans_info.selectByAuthEmp`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md), [`org01_code.selectByParentId`](../../org/sql/org01_code.md) | - |  |
| `getTransDate` | 356 | [`emp00_trans_info.getTransDate`](../../emp/sql/emp00_trans_info.md) | `Apr04_Edit_ApprStep` |  |
| `getPersonId` | 367 | [`emp00_trans_info.getPersonId`](../../emp/sql/emp00_trans_info.md) | `Apr04_Edit_ApprStep` |  |
| `getOrgCodeId` | 379 | [`emp00_trans_info.getOrgCodeId`](../../emp/sql/emp00_trans_info.md) | `Apr04_Edit_ApprStep` |  |
| `selectByStepTypeCode` | 393 | [`emp00_trans_info.selectByStepTypeCode`](../../emp/sql/emp00_trans_info.md) | - |  |
| `update` | 415 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp00_trans_info.selectById`](../../emp/sql/emp00_trans_info.md), [`emp02_others.insert`](../../emp/sql/emp02_others.md), [`emp35_deduct.insert`](../../emp/sql/emp35_deduct.md), [`emp36_add_deduct.insert`](../../emp/sql/emp36_add_deduct.md), [`sys09_code.selectByCodeName`](../../sys/sql/sys09_code.md), `UpdateDataModel(emp01_person)` 동적 INSERT/UPDATE, `UpdateDataModel(emp03_trans)` 동적 INSERT/UPDATE | `Emp03_Edit_Person` | `UpdateDataModel` |
| `selectByAllOrgCodeId` | 514 | [`emp00_trans_info.selectByAllOrgCodeId`](../../emp/sql/emp00_trans_info.md) | `Emp00_Tab_OrgEmpManager`, `Emp00_Tab_OrgPerson` |  |
| `selectByComplianceCheck` | 536 | [`emp00_trans_info.selectByComplianceCheck`](../../emp/sql/emp00_trans_info.md) | - |  |
| `getPersonInfo` | 546 | [`emp00_trans_info.getPersonInfo`](../../emp/sql/emp00_trans_info.md) | - |  |
| `Monitoring` | 552 | [`emp00_trans_info.Monitoring`](../../emp/sql/emp00_trans_info.md) | - |  |
| `getOnlineList` | 569 | [`emp00_trans_info.getOnlineList`](../../emp/sql/emp00_trans_info.md) | `Emp00_Lookup_SendMessage` | `BroadcastWebsocket` |
| `selectRetireEmpList` | 587 | [`emp00_trans_info.selectRetireEmpList`](../../emp/sql/emp00_trans_info.md) | `Pay07_Tab_Retire`, `Pay10_Tab_Retire` | `DateUtil` |
| `getHighInfo` | 610 | [`emp00_trans_info.getHighInfo`](../../emp/sql/emp00_trans_info.md) | `Emp43_Tab_EvalTarget` |  |
| `cookieLogin` | 625 | [`emp00_trans_info.cookieLogin`](../../emp/sql/emp00_trans_info.md) | `LoginPage` |  |
