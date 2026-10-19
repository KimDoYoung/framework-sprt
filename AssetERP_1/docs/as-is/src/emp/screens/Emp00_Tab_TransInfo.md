# Emp00_Tab_TransInfo

- 종류: 화면
- 메뉴: 경영관리 > 01. 조직 및 사원관리 > 사원정보 관리 (#1029)
- 메뉴: 기본정보 > 기본정보 > 사원정보 등록 (#1452)
- 파일: `client/vi/emp/Emp00_Tab_TransInfo.java`
- 함께 쓰는 클래스 28개:
  - `Emp35_TabPage_DeductDate` `client/vi/emp/Emp35_TabPage_DeductDate.java`
  - `Emp35_TabPage_DeductInsert` `client/vi/emp/Emp35_TabPage_DeductInsert.java`
  - `Emp36_Popup_AddDeduct` `client/vi/emp/Emp36_Popup_AddDeduct.java`
  - `Emp35_Popup_DeductCreate` `client/vi/emp/Emp35_Popup_DeductCreate.java`
  - `Emp19_TabPage_education` `client/vi/emp/Emp19_TabPage_education.java`
  - `Emp18_TabPage_RelateFile` `client/vi/emp/Emp18_TabPage_RelateFile.java`
  - `Emp14_TabPage_Account` `client/vi/emp/Emp14_TabPage_Account.java`
  - `Emp13_TabPage_Project` `client/vi/emp/Emp13_TabPage_Project.java`
  - `Emp12_TabPage_Event` `client/vi/emp/Emp12_TabPage_Event.java`
  - `Emp11_TabPage_Reward` `client/vi/emp/Emp11_TabPage_Reward.java`
  - `Emp09_TabPage_Evaluation` `client/vi/emp/Emp09_TabPage_Evaluation.java`
  - `Emp08_TabPage_License` `client/vi/emp/Emp08_TabPage_License.java`
  - `Emp32_TabPage_RelateLicense` `client/vi/emp/Emp32_TabPage_RelateLicense.java`
  - `Emp07_TabPage_Career` `client/vi/emp/Emp07_TabPage_Career.java`
  - `Emp06_TabPage_Family` `client/vi/emp/Emp06_TabPage_Family.java`
  - `Emp05_TabPage_Academic` `client/vi/emp/Emp05_TabPage_Academic.java`
  - `Emp04_TabPage_AddTitle` `client/vi/emp/Emp04_TabPage_AddTitle.java`
  - `Emp04_Edit_AddTitle` `client/vi/emp/Emp04_Edit_AddTitle.java`
  - `Emp03_TabPage_Trans` `client/vi/emp/Emp03_TabPage_Trans.java`
  - `Emp03_Lookup_Grade` `client/vi/emp/Emp03_Lookup_Grade.java`
  - `Emp00_Current_TransInfoModel` `client/vi/emp/Emp00_Current_TransInfoModel.java`
  - `Emp03_Edit_Person` `client/vi/emp/Emp03_Edit_Person.java`
  - `Emp02_TabPage_Others` `client/vi/emp/Emp02_TabPage_Others.java`
  - `Emp02_Edit_CtzNo` `client/vi/emp/Emp02_Edit_CtzNo.java`
  - `Emp01_TabPage_Person` `client/vi/emp/Emp01_TabPage_Person.java`
  - `Emp02_Lookup_HireDate` `client/vi/emp/Emp02_Lookup_HireDate.java`
  - `Emp00_Lookup_PersonnelRecordCard` `client/vi/emp/Emp00_Lookup_PersonnelRecordCard.java`
  - `Emp00_Rd_PersonnelRecordCard` `client/vi/emp/Emp00_Rd_PersonnelRecordCard.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md), [`Pay31_Popup_InsureApply`](../../pay/components/Pay31_Popup_InsureApply.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Emp00_Lookup_PersonnelRecordCard:167, Emp00_Tab_TransInfo:418 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectOneByPersonId` | Emp00_Current_TransInfoModel:16 | [`Emp00_TransInfo.java:199`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectOneByPersonId`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.update` | Emp03_Edit_Person:358 | [`Emp00_TransInfo.java:415`](../../emp/services/Emp00_TransInfo.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp00_trans_info.selectById`](../../emp/sql/emp00_trans_info.md), [`emp02_others.insert`](../../emp/sql/emp02_others.md), [`emp35_deduct.insert`](../../emp/sql/emp35_deduct.md), [`emp36_add_deduct.insert`](../../emp/sql/emp36_add_deduct.md), [`sys09_code.selectByCodeName`](../../sys/sql/sys09_code.md), `UpdateDataModel(emp01_person)` 동적 INSERT/UPDATE → [`emp01_person.selectById`](../../emp/sql/emp01_person.md), `UpdateDataModel(emp03_trans)` 동적 INSERT/UPDATE → [`emp03_trans.selectById`](../../emp/sql/emp03_trans.md) |
| `emp.Emp01_Person.checkUsePersonId` | Emp01_TabPage_Person:213 | [`Emp01_Person.java:97`](../../emp/services/Emp01_Person.md) | [`emp01_person.checkUsePersonId`](../../emp/sql/emp01_person.md) |
| `emp.Emp01_Person.deleteTarget` | Emp01_TabPage_Person:304 | [`Emp01_Person.java:165`](../../emp/services/Emp01_Person.md) | [`emp01_person.insertEmpDel`](../../emp/sql/emp01_person.md), `UpdateDataModel(emp01_person)` 동적 DELETE |
| `emp.Emp01_Person.empNoCheck` | Emp03_Edit_Person:315 | [`Emp01_Person.java:115`](../../emp/services/Emp01_Person.md) | [`emp01_person.empNoCheck`](../../emp/sql/emp01_person.md) |
| `emp.Emp01_Person.update` | Emp01_TabPage_Person:193 | [`Emp01_Person.java:140`](../../emp/services/Emp01_Person.md) | `UpdateDataModel(emp01_person)` 동적 INSERT/UPDATE → [`emp01_person.selectById`](../../emp/sql/emp01_person.md) |
| `emp.Emp02_Others.selectByPersonId` | Emp02_Lookup_HireDate:63 | [`Emp02_Others.java:24`](../../emp/services/Emp02_Others.md) | [`emp02_others.selectByPersonId`](../../emp/sql/emp02_others.md) |
| `emp.Emp02_Others.updateHireDate` | Emp02_Lookup_HireDate:96 | [`Emp02_Others.java:49`](../../emp/services/Emp02_Others.md) | [`emp02_others.updateHireDate`](../../emp/sql/emp02_others.md) |
| `emp.Emp02_Others.updateOne` | Emp02_TabPage_Others:173 | [`Emp02_Others.java:43`](../../emp/services/Emp02_Others.md) | [`emp02_others.upsert`](../../emp/sql/emp02_others.md) |
| `emp.Emp03_Trans.delete` | Emp03_TabPage_Trans:369 | [`Emp03_Trans.java:200`](../../emp/services/Emp03_Trans.md) | `UpdateDataModel(emp03_trans)` 동적 DELETE |
| `emp.Emp03_Trans.deleteCheck` | Emp03_TabPage_Trans:346 | [`Emp03_Trans.java:179`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.deleteCheck`](../../emp/sql/emp03_trans.md) |
| `emp.Emp03_Trans.selectByGrade` | Emp03_Lookup_Grade:161 | [`Emp03_Trans.java:68`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByGrade`](../../emp/sql/emp03_trans.md) |
| `emp.Emp03_Trans.selectByPersonId` | Emp03_TabPage_Trans:208 | [`Emp03_Trans.java:23`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByPersonId`](../../emp/sql/emp03_trans.md) |
| `emp.Emp03_Trans.update` | Emp03_Lookup_Grade:228, Emp03_TabPage_Trans:242 | [`Emp03_Trans.java:195`](../../emp/services/Emp03_Trans.md) | `UpdateDataModel(emp03_trans)` 동적 INSERT/UPDATE → [`emp03_trans.selectById`](../../emp/sql/emp03_trans.md) |
| `emp.Emp04_AddTitle.delete` | Emp04_TabPage_AddTitle:174 | [`Emp04_AddTitle.java:150`](../../emp/services/Emp04_AddTitle.md) | `UpdateDataModel(emp04_add_title)` 동적 DELETE |
| `emp.Emp04_AddTitle.deleteList` | Emp04_TabPage_AddTitle:163 | [`Emp04_AddTitle.java:120`](../../emp/services/Emp04_AddTitle.md) | [`apr01_appr.selectByPersonId`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.selectByPersonId`](../../apr/sql/apr04_appr_step.md), [`emp01_person.deleteByPersonId`](../../emp/sql/emp01_person.md), [`emp01_person.insertEmpDel`](../../emp/sql/emp01_person.md) |
| `emp.Emp04_AddTitle.selectByPersonId` | Emp01_TabPage_Person:249, Emp04_TabPage_AddTitle:76 | [`Emp04_AddTitle.java:28`](../../emp/services/Emp04_AddTitle.md) | [`emp04_add_title.selectByPersonId`](../../emp/sql/emp04_add_title.md) |
| `emp.Emp04_AddTitle.updateList` | Emp04_Edit_AddTitle:236 | [`Emp04_AddTitle.java:46`](../../emp/services/Emp04_AddTitle.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.insert`](../../emp/sql/emp01_person.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp02_others.insertCopy`](../../emp/sql/emp02_others.md), [`emp03_trans.insertAddTitle`](../../emp/sql/emp03_trans.md), [`emp03_trans.updateAddTitle`](../../emp/sql/emp03_trans.md), [`emp04_add_title.selectByPersonId`](../../emp/sql/emp04_add_title.md), `UpdateDataModel(emp04_add_title)` 동적 INSERT/UPDATE → [`emp04_add_title.selectById`](../../emp/sql/emp04_add_title.md) |
| `emp.Emp05_Academic.delete` | Emp05_TabPage_Academic:188 | [`Emp05_Academic.java:35`](../../emp/services/Emp05_Academic.md) | `UpdateDataModel(emp05_academic)` 동적 DELETE |
| `emp.Emp05_Academic.selectByPersonId` | Emp05_TabPage_Academic:124 | [`Emp05_Academic.java:19`](../../emp/services/Emp05_Academic.md) | [`emp05_academic.selectByPersonId`](../../emp/sql/emp05_academic.md) |
| `emp.Emp05_Academic.update` | Emp05_TabPage_Academic:148 | [`Emp05_Academic.java:30`](../../emp/services/Emp05_Academic.md) | `UpdateDataModel(emp05_academic)` 동적 INSERT/UPDATE → [`emp05_academic.selectById`](../../emp/sql/emp05_academic.md) |
| `emp.Emp06_Family.delete` | Emp06_TabPage_Family:165 | [`Emp06_Family.java:37`](../../emp/services/Emp06_Family.md) | `UpdateDataModel(emp06_family)` 동적 DELETE |
| `emp.Emp06_Family.selectByPersonId` | Emp06_TabPage_Family:119 | [`Emp06_Family.java:20`](../../emp/services/Emp06_Family.md) | [`emp06_family.selectByPersonId`](../../emp/sql/emp06_family.md) |
| `emp.Emp06_Family.update` | Emp06_TabPage_Family:125 | [`Emp06_Family.java:32`](../../emp/services/Emp06_Family.md) | `UpdateDataModel(emp06_family)` 동적 INSERT/UPDATE → [`emp06_family.selectById`](../../emp/sql/emp06_family.md) |
| `emp.Emp07_Career.delete` | Emp07_TabPage_Career:226 | [`Emp07_Career.java:38`](../../emp/services/Emp07_Career.md) | `UpdateDataModel(emp07_career)` 동적 DELETE |
| `emp.Emp07_Career.selectByPersonId` | Emp07_TabPage_Career:118 | [`Emp07_Career.java:20`](../../emp/services/Emp07_Career.md) | [`emp07_career.selectByPersonId`](../../emp/sql/emp07_career.md) |
| `emp.Emp07_Career.update` | Emp07_TabPage_Career:186 | [`Emp07_Career.java:33`](../../emp/services/Emp07_Career.md) | `UpdateDataModel(emp07_career)` 동적 INSERT/UPDATE → [`emp07_career.selectById`](../../emp/sql/emp07_career.md) |
| `emp.Emp08_License.delete` | Emp08_TabPage_License:186 | [`Emp08_License.java:33`](../../emp/services/Emp08_License.md) | `UpdateDataModel(emp08_license)` 동적 DELETE |
| `emp.Emp08_License.selectByPersonId` | Emp08_TabPage_License:132 | [`Emp08_License.java:16`](../../emp/services/Emp08_License.md) | [`emp08_license.selectByPersonId`](../../emp/sql/emp08_license.md) |
| `emp.Emp08_License.update` | Emp08_TabPage_License:147 | [`Emp08_License.java:28`](../../emp/services/Emp08_License.md) | `UpdateDataModel(emp08_license)` 동적 INSERT/UPDATE → [`emp08_license.selectById`](../../emp/sql/emp08_license.md) |
| `emp.Emp09_Evaluation.delete` | Emp09_TabPage_Evaluation:186 | [`Emp09_Evaluation.java:36`](../../emp/services/Emp09_Evaluation.md) | `UpdateDataModel(emp09_evaluation)` 동적 DELETE |
| `emp.Emp09_Evaluation.selectByPersonId` | Emp09_TabPage_Evaluation:141 | [`Emp09_Evaluation.java:20`](../../emp/services/Emp09_Evaluation.md) | [`emp09_evaluation.selectByPersonId`](../../emp/sql/emp09_evaluation.md) |
| `emp.Emp09_Evaluation.update` | Emp09_TabPage_Evaluation:147 | [`Emp09_Evaluation.java:31`](../../emp/services/Emp09_Evaluation.md) | `UpdateDataModel(emp09_evaluation)` 동적 INSERT/UPDATE → [`emp09_evaluation.selectById`](../../emp/sql/emp09_evaluation.md) |
| `emp.Emp11_Reward.delete` | Emp11_TabPage_Reward:145 | [`Emp11_Reward.java:42`](../../emp/services/Emp11_Reward.md) | `UpdateDataModel(emp11_reward)` 동적 DELETE |
| `emp.Emp11_Reward.selectByPersonId` | Emp11_TabPage_Reward:100 | [`Emp11_Reward.java:20`](../../emp/services/Emp11_Reward.md) | [`emp11_reward.selectByPersonId`](../../emp/sql/emp11_reward.md) |
| `emp.Emp11_Reward.update` | Emp11_TabPage_Reward:106 | [`Emp11_Reward.java:37`](../../emp/services/Emp11_Reward.md) | `UpdateDataModel(emp11_reward)` 동적 INSERT/UPDATE → [`emp11_reward.selectById`](../../emp/sql/emp11_reward.md) |
| `emp.Emp12_Event.delete` | Emp12_TabPage_Event:137 | [`Emp12_Event.java:37`](../../emp/services/Emp12_Event.md) | `UpdateDataModel(emp12_event)` 동적 DELETE |
| `emp.Emp12_Event.selectByPersonId` | Emp12_TabPage_Event:92 | [`Emp12_Event.java:20`](../../emp/services/Emp12_Event.md) | [`emp12_event.selectByPersonId`](../../emp/sql/emp12_event.md) |
| `emp.Emp12_Event.update` | Emp12_TabPage_Event:98 | [`Emp12_Event.java:32`](../../emp/services/Emp12_Event.md) | `UpdateDataModel(emp12_event)` 동적 INSERT/UPDATE → [`emp12_event.selectById`](../../emp/sql/emp12_event.md) |
| `emp.Emp13_Project.delete` | Emp13_TabPage_Project:132 | [`Emp13_Project.java:36`](../../emp/services/Emp13_Project.md) | `UpdateDataModel(emp13_project)` 동적 DELETE |
| `emp.Emp13_Project.selectByPersonId` | Emp13_TabPage_Project:86 | [`Emp13_Project.java:20`](../../emp/services/Emp13_Project.md) | [`emp13_project.selectByPersonId`](../../emp/sql/emp13_project.md) |
| `emp.Emp13_Project.update` | Emp13_TabPage_Project:92 | [`Emp13_Project.java:31`](../../emp/services/Emp13_Project.md) | `UpdateDataModel(emp13_project)` 동적 INSERT/UPDATE → [`emp13_project.selectById`](../../emp/sql/emp13_project.md) |
| `emp.Emp14_Account.delete` | Emp14_TabPage_Account:149 | [`Emp14_Account.java:46`](../../emp/services/Emp14_Account.md) | `UpdateDataModel(emp14_account)` 동적 DELETE |
| `emp.Emp14_Account.selectByPersonId` | Emp14_TabPage_Account:102 | [`Emp14_Account.java:21`](../../emp/services/Emp14_Account.md) | [`emp14_account.selectByPersonId`](../../emp/sql/emp14_account.md) |
| `emp.Emp14_Account.update` | Emp14_TabPage_Account:108 | [`Emp14_Account.java:32`](../../emp/services/Emp14_Account.md) | [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), `UpdateDataModel(emp14_account)` 동적 INSERT/UPDATE → [`emp14_account.selectById`](../../emp/sql/emp14_account.md) |
| `emp.Emp18_RelateFile.delete` | Emp18_TabPage_RelateFile:216 | [`Emp18_RelateFile.java:28`](../../emp/services/Emp18_RelateFile.md) | `UpdateDataModel(emp18_relate_file)` 동적 DELETE |
| `emp.Emp18_RelateFile.selectByPersonId` | Emp18_TabPage_RelateFile:159 | [`Emp18_RelateFile.java:16`](../../emp/services/Emp18_RelateFile.md) | [`emp18_relate_file.selectByPersonId`](../../emp/sql/emp18_relate_file.md) |
| `emp.Emp18_RelateFile.update` | Emp18_TabPage_RelateFile:187 | [`Emp18_RelateFile.java:23`](../../emp/services/Emp18_RelateFile.md) | `UpdateDataModel(emp18_relate_file)` 동적 INSERT/UPDATE → [`emp18_relate_file.selectById`](../../emp/sql/emp18_relate_file.md) |
| `emp.Emp19_Education.delete` | Emp19_TabPage_education:197 | [`Emp19_Education.java:58`](../../emp/services/Emp19_Education.md) | `UpdateDataModel(emp19_education)` 동적 DELETE |
| `emp.Emp19_Education.multiUpdate` | Emp19_TabPage_education:230 | [`Emp19_Education.java:35`](../../emp/services/Emp19_Education.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp19_education)` 동적 INSERT/UPDATE → [`emp19_education.selectById`](../../emp/sql/emp19_education.md) |
| `emp.Emp19_Education.selectByPersonId` | Emp19_TabPage_education:149 | [`Emp19_Education.java:23`](../../emp/services/Emp19_Education.md) | [`emp19_education.selectByPersonId`](../../emp/sql/emp19_education.md) |
| `emp.Emp19_Education.update` | Emp19_TabPage_education:159 | [`Emp19_Education.java:53`](../../emp/services/Emp19_Education.md) | `UpdateDataModel(emp19_education)` 동적 INSERT/UPDATE → [`emp19_education.selectById`](../../emp/sql/emp19_education.md) |
| `emp.Emp25_MypageNotice.updateList` | Emp03_Lookup_Grade:231 | [`Emp25_MypageNotice.java:26`](../../emp/services/Emp25_MypageNotice.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp25_mypage_notice.selectByPersonId`](../../emp/sql/emp25_mypage_notice.md), `UpdateDataModel(emp25_mypage_notice)` 동적 INSERT/UPDATE → [`emp25_mypage_notice.selectById`](../../emp/sql/emp25_mypage_notice.md) |
| `emp.Emp32_RelateLicense.delete` | Emp32_TabPage_RelateLicense:180 | [`Emp32_RelateLicense.java:33`](../../emp/services/Emp32_RelateLicense.md) | `UpdateDataModel(emp32_relate_license)` 동적 DELETE |
| `emp.Emp32_RelateLicense.selectByLicenseId` | Emp32_TabPage_RelateLicense:109 | [`Emp32_RelateLicense.java:22`](../../emp/services/Emp32_RelateLicense.md) | [`emp32_relate_license.selectByLicenseId`](../../emp/sql/emp32_relate_license.md) |
| `emp.Emp32_RelateLicense.update` | Emp32_TabPage_RelateLicense:145 | [`Emp32_RelateLicense.java:28`](../../emp/services/Emp32_RelateLicense.md) | `UpdateDataModel(emp32_relate_license)` 동적 INSERT/UPDATE → [`emp32_relate_license.selectById`](../../emp/sql/emp32_relate_license.md) |
| `emp.Emp35_Deduct.deleteAll` | Emp35_TabPage_DeductInsert:254 | [`Emp35_Deduct.java:128`](../../emp/services/Emp35_Deduct.md) | [`emp35_deduct.deleteByDeductId`](../../emp/sql/emp35_deduct.md), [`emp36_add_deduct.deleteByDeductId`](../../emp/sql/emp36_add_deduct.md) |
| `emp.Emp35_Deduct.insert` | Emp35_Popup_DeductCreate:94 | [`Emp35_Deduct.java:60`](../../emp/services/Emp35_Deduct.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp35_deduct.deleteByDeductId`](../../emp/sql/emp35_deduct.md), [`emp35_deduct.insert`](../../emp/sql/emp35_deduct.md), [`emp35_deduct.selectByCompanyId`](../../emp/sql/emp35_deduct.md), [`emp36_add_deduct.addDeductTypeInsert`](../../emp/sql/emp36_add_deduct.md), [`emp36_add_deduct.deleteByDeductId`](../../emp/sql/emp36_add_deduct.md) |
| `emp.Emp35_Deduct.selectByPersonId` | Emp35_TabPage_DeductDate:121 | [`Emp35_Deduct.java:28`](../../emp/services/Emp35_Deduct.md) | [`emp35_deduct.selectByPersonId`](../../emp/sql/emp35_deduct.md) |
| `emp.Emp35_Deduct.update` | Emp35_TabPage_DeductInsert:223 | [`Emp35_Deduct.java:138`](../../emp/services/Emp35_Deduct.md) | `UpdateDataModel(emp35_deduct)` 동적 INSERT/UPDATE → [`emp35_deduct.selectById`](../../emp/sql/emp35_deduct.md) |
| `emp.Emp36_AddDeduct.selectByDeductId` | Emp36_Popup_AddDeduct:104 | [`Emp36_AddDeduct.java:27`](../../emp/services/Emp36_AddDeduct.md) | [`emp36_add_deduct.selectByDeductId`](../../emp/sql/emp36_add_deduct.md) |
| `emp.Emp36_AddDeduct.updateDeductCnt` | Emp36_Popup_AddDeduct:117 | [`Emp36_AddDeduct.java:33`](../../emp/services/Emp36_AddDeduct.md) | `UpdateDataModel(emp36_add_deduct)` 동적 INSERT/UPDATE → [`emp36_add_deduct.selectById`](../../emp/sql/emp36_add_deduct.md) |
| `org.Org00_OrgInfo.selectByOrgCodeId` | Emp03_TabPage_Trans:298 | [`Org00_OrgInfo.java:21`](../../org/services/Org00_OrgInfo.md) | [`org00_org_info.selectByOrgCodeId`](../../org/sql/org00_org_info.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Emp18_TabPage_RelateFile:245 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys99_Print.insertRdPersonnelRecordCard` | Emp00_Lookup_PersonnelRecordCard:177, Emp00_Lookup_PersonnelRecordCard:208 | [`Sys99_Print.java:4701`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp05_academic`](../../../db/tables/emp.md), [`emp06_family`](../../../db/tables/emp.md), [`emp07_career`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`emp09_evaluation`](../../../db/tables/emp.md), [`emp11_reward`](../../../db/tables/emp.md), [`emp12_event`](../../../db/tables/emp.md), [`emp13_project`](../../../db/tables/emp.md), [`emp14_account`](../../../db/tables/emp.md), [`emp18_relate_file`](../../../db/tables/emp.md), [`emp19_education`](../../../db/tables/emp.md), [`emp25_mypage_notice`](../../../db/tables/emp.md), [`emp32_relate_license`](../../../db/tables/emp.md), [`emp35_deduct`](../../../db/tables/emp.md), [`emp36_add_deduct`](../../../db/tables/emp.md), [`emp99_person_del`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_check_use_person_id`, `f_create_seq`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_Tab_TransInfo (`client/vi/emp/Emp00_Tab_TransInfo.java`, 446줄)

- 레이아웃: center=vlc, south=cp
- 툴바 `buttonBar`: 조회일자: {transDate} 조직/사번/성명: {searchText} 재직구분: {transName} {retrieveButton} {insertButton} {downloadForm} {excelUploadButton} {uploadExcelForm} {excelDownloadForm} {excelDownloadButton} {downLoadButton}
- 입력·하위 화면: `searchText` TextField, `transDate` MyDateField, `transName` StringComboBox, `tabPagePerson` Emp01_TabPage_Person, `othersPage` Emp02_TabPage_Others, `transPage` Emp03_TabPage_Trans, `deductPage` Emp35_TabPage_DeductDate, `addAccountPage` Emp14_TabPage_Account, `familyPage` Emp06_TabPage_Family, `careerPage` Emp07_TabPage_Career, `academicPage` Emp05_TabPage_Academic, `licensePage` Emp08_TabPage_License, `rewardPage` Emp11_TabPage_Reward, `evaluationPage` Emp09_TabPage_Evaluation, `eventPage` Emp12_TabPage_Event, `projectPage` Emp13_TabPage_Project, `addTitlePage` Emp04_TabPage_AddTitle, `relateFilePage` Emp18_TabPage_RelateFile, `educationPage` Emp19_TabPage_education, `lookupYearList` Emp00_Lookup_PersonnelRecordCard
- 그리드 `grid` (buildGrid()):
  - parentFullName 240 "본부(부서)" Text
  - empKorName 100 "성명" Text
  - empNo 80 "사번" Text
  - officerYn 70 "등기임원" BooleanYn2
  - tdmTargetYn 70 "책무임원" BooleanYn2
  - posName 80 "직위" Text
  - titleName 100 "직책" Text
  - kindName 80 "구분" Text
  - financeProYn 70 "전문인력" BooleanYn2
  - hireDate 100 "입사일" Date
  - retireDate 100 "퇴사일" Date
  - expiryDate 100 "계약만료일" Date
  - officeDetail 80 "내선번호" Text
  - mobileTelNo 120 "휴대폰" Text
  - emailAddress 240 "이메일" Text
  - birthday 100 "생년월일" Date
  - genderName 60 "성별" TextCenter
  - orderSeq 80 "출력순서" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L77-128) → settings(), retrieve()
[E1] uploadExcelForm.SubmitComplete (L200) → retrieve()
[E2] searchText.KeyPress [Enter] (L209) → retrieve()
[E3] transName[재직].Collapse (L225) → retrieve()
[E4] retrieveButton[조회].Select (L231) → retrieve()
[E5] insertButton[등록].Select (L237) → insert()
[E6] tempDownloadButton[템플릿].Select (L243) → 인라인 L243-248 (new SelectHandler(){ @Override public…)
[E7] excelUploadButton[엑셀업로드].Select (L249) → excelUpload()
[E8] excelDownloadForm.SubmitComplete (L256) → 인라인 L256-261 (new SubmitCompleteHandler() { @Overri…)
[E9] excelDownloadButton[다운로드].Select (L262) → excelDownload()
[E10] downLoadButton[인사기록카드].Select (L269) → 인라인 L269-276 (new SelectHandler() { @Override publi…)
[E11] tabPanel.Selection [arg0 != null] (L277) → retrieveTabpage()
[E12] grid.SelectionChanged [선택>0] (L285) → retrieveTabpage()
[E13] fileUploadField.Change (L334) → 인라인 L334-339 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private excelDownload() | L297-323 | E9 | 상태 처리 | 업무 |
| private excelUpload() | L325-342 | E7 | 상태 처리 | 업무 |
| private retrieveTabpage() | L382-392 | E11,E12 | 선택 회사로 탭페이지 retrieve | 업무 |
| public retrieve() | L394-432 | 생성자,E1,E2,E3,E4,insert | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, isSeparateAddTitle, transCode), 선택 회사로 탭페이지 retrieve(companyId, searchText, transDate, isSeparateAddTitle, transCode) | 업무 |
| public insert() | L434-441 | E5 | 팝업 Emp03_Edit_Person 열기 | 업무 |
| private settings() | L130-295 | 생성자 | 조회창 Emp00_Lookup_PersonnelRecordCard 열기, 미선택 시 alert, 이벤트 연결, 초기값: transDate=CalendarUtil.copyDate(LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L344-380 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L443-445 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 240, '본부(부서)'),  // L349
  gb.text('korNm', 100, '성명'),  // L350
  gb.text('empNo', 80, '사번'),  // L351
  gb.booleanYn2('officerYn', 70, '등기임원'),  // L352
  gb.booleanYn2('tdmTargetYn', 70, '책무임원'),  // L353
  gb.text('posNm', 80, '직위'),  // L354
  gb.text('titleNm', 100, '직책'),  // L355
  gb.text('kindNm', 80, '구분'),  // L356
  gb.booleanYn2('financeProYn', 70, '전문인력'),  // L357
  gb.date('hireDate', 100, '입사일'),  // L358
  gb.date('retireDate', 100, '퇴사일'),  // L359
  gb.date('expiryDate', 100, '계약만료일'),  // L360
  gb.text('officeDetail', 80, '내선번호'),  // L363
  gb.text('mobileTelno', 120, '휴대폰'),  // L364
  gb.text('emailAddr', 240, '이메일'),  // L365
  gb.date('birthday', 100, '생년월일'),  // L366
  gb.textCenter('genderNm', 60, '성별'),  // L367
  gb.textCenter('orderSeq', 80, '출력순서'),  // L368
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
4. <Button type="download" onClick={excelDownload}>다운로드</Button>
5. <Button type="unknown" onClick={() => /* 인라인 L269-276 (new SelectHandler() { @Override publi…) */}>인사기록카드</Button>
6. <Button type="download" onClick={() => /* 인라인 L243-248 (new SelectHandler(){ @Override public…) */}>템플릿</Button>

### Emp35_TabPage_DeductDate (`client/vi/emp/Emp35_TabPage_DeductDate.java`, 157줄)

- 레이아웃: north=buttonBar, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton}
- 입력·하위 화면: `DeductInsertPage` Emp35_TabPage_DeductInsert, `popUp` Emp35_Popup_DeductCreate
- 그리드 `grid` (buildGrid()):
  - startDate 190 "적용시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L38-42) → settings()
[E1] retrieveButton[조회].Select (L52) → retrieve()
[E2] insertButton[등록].Select (L58) → insert()
[E3] grid.SelectionChanged (L88) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L106-109 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L112-114 | E1,init,insert | 상태 처리 | 업무 |
| private retrieve() | L116-130 | E1,init,insert | 서비스 emp.Emp35_Deduct.selectByPersonId(companyId, personId) | 업무 |
| private retrievePage() | L132-140 | E3,retrieve | 상태 처리 | 업무 |
| private insert() | L142-150 | E2 | 팝업 Emp35_Popup_DeductCreate 열기 | 업무 |
| public getGrid() | L153-156 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L44-96 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L98-103 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),  // L101
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>

### Emp35_TabPage_DeductInsert (`client/vi/emp/Emp35_TabPage_DeductInsert.java`, 283줄)

- 입력·하위 화면: `startDate` MyDateField, `basicDeductCnt` LongField, `withHoldRate` LongField, `childDeductCnt` LongField, `addDeductYn` CheckBox, `insureYn` CheckBox, `reprYn` CheckBox, `popupAddDeduct` Emp36_Popup_AddDeduct, `insureApply` Pay31_Popup_InsureApply

#### 이벤트
[E0] 화면 열림 (생성자 L73-102) → getEditor()
[E1] updateButton[저장].Select (L83) → update()
[E2] deleteButton[삭제].Select (L89) → deleteChk()
       └ [E5] messageBox.DialogHide [YES] (L240) → delete()
[E3] anchor.MouseDown (L108) → 메시지 "추가인적공제 체크후 등록가능합니다"
[E4] anchor2.MouseDown (L139) → 인라인 L139-149 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L104-201 | 생성자 | 팝업 Emp36_Popup_AddDeduct 열기, 팝업 Pay31_Popup_InsureApply 열기 | 업무 |
| public retrieve() | L203-215 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L217-235 | E1 | 서비스 emp.Emp35_Deduct.update | 업무 |
| public deleteChk() | L237-249 | E2 | ConfirmBox → E5 | 업무 |
| public delete() | L251-265 | E5 | 서비스 emp.Emp35_Deduct.deleteAll(deductId) | 업무 |
| public init() | L267-269 | delete | 상태 처리 | 업무 |
| public init2() | L271-274 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L276-278 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L279-281 | 생성자,getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Emp36_Popup_AddDeduct (`client/vi/emp/Emp36_Popup_AddDeduct.java`, 128줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton}
- 그리드 `grid` (buildGrid()):
  - addDeductTypeName 150 "구분" TextCenter
  - addDeductCnt 120 "인원수" LongCenter 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L46-68) → settings(), show()
[E1] retrieveButton[조회].Select (L71) → retrieve()
[E2] updateButton[저장].Select (L77) → update()
[E3] closeButton[닫기].Select (L83) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-44 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L100-113 | E1,open,update | 서비스 emp.Emp36_AddDeduct.selectByDeductId(deductId) | 업무 |
| public update() | L115-123 | E2 | 서비스 emp.Emp36_AddDeduct.updateDeductCnt | 업무 |
| private settings() | L70-90 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L92-98 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L125-127 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('addDeductTypeNm', 150, '구분'),  // L95 SQL 계산 컬럼(selectByDeductId: f_cdnm('AddDeductType', emp36_add_deduc…)
  gb.longCenter('addDeductCnt', 120, '인원수', { editor: 'number' }),  // L96
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp35_Popup_DeductCreate (`client/vi/emp/Emp35_Popup_DeductCreate.java`, 117줄)

- 입력·하위 화면: `year` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L47-76) → show()
[E1] updateButton[생성].Select (L59) → update()
[E2] closeButton[닫기].Select (L65) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-45 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L78-86 | open | 상태 처리 | 업무 |
| public update() | L88-106 | E1 | 서비스 emp.Emp35_Deduct.insert(companyId, personId, startDate) | 업무 |
| private setHtmlStyle() | L109-111 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L113-115 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp19_TabPage_education (`client/vi/emp/Emp19_TabPage_education.java`, 254줄)

- 툴바 `buttonBar`: 교육사항: {retrieveButton} {insertButton} {deleteButton} {updateButton} {multiInsertButton}
- 입력·하위 화면: `popup` Emp01_Lookup_PersonModel
- 그리드 `grid` (buildGrid(), 체크박스):
  - issueDate 100 "교육일자" Date 편집:MyDateField
  - educationCorpName 200 "교육기관" Text 편집:TextField
  - content 450 "교육내용" Text 편집:TextField
  - educationYn 80 "수료여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L62-85) → settings()
[E1] retrieveButton[조회].Select (L88) → retrieve()
[E2] insertButton[등록].Select (L94) → insertRow()
[E3] deleteButton[삭제].Select (L100) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L191) → 서비스 emp.Emp19_Education.delete
[E4] updateButton[저장].Select (L106) → update()
[E5] multiInsertButton[일괄등록].Select (L112) → multiInsert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L135-137 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L140-142 | E1 | 상태 처리 | 업무 |
| public retrieve() | L144-155 | E1 | 서비스 emp.Emp19_Education.selectByPersonId(personId) | 업무 |
| public update() | L157-170 | E4 | 서비스 emp.Emp19_Education.update | 업무 |
| public insertRow() | L172-185 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L188-203 | E3 | ConfirmBox → E6 | 업무 |
| public multiInsert() | L205-243 | E5 | 조회창 Emp01_Lookup_PersonModel 열기, 미선택 시 alert "사원을 먼저 선택해주세요", 서비스 emp.Emp19_Education.multiUpdate | 업무 |
| public getGrid() | L250-253 | 공개 메서드 | 상태 처리 | 업무 |
| public settings() | L87-118 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L120-132 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L245-247 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('issueDate', 100, '교육일자', { editor: 'date' }),  // L125
  gb.text('educationCorpNm', 200, '교육기관', { editor: 'text' }),  // L126
  gb.text('content', 450, '교육내용', { editor: 'text' }),  // L127
  gb.boolean('educationYn', 80, '수료여부'),  // L128
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="register" onClick={multiInsert}>일괄등록</Button>

### Emp18_TabPage_RelateFile (`client/vi/emp/Emp18_TabPage_RelateFile.java`, 278줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "등록일" Date
  - fileName 350 "파일명" Text
  - size 100 "용량(KB)" Double
  - note 450 "상세설명" Text 편집:TextField
  - actionCell 80 "업로드" Cell 편집:uploadCell
  - actionCell 80 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L60-91) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L65) → retrieve()
[E2] searchBarBuilder[등록].Insert (L66) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L67) → deleteRow()
       └ [E8] messageBox.DialogHide [YES] (L204) → checkFileDelete()
[E4] searchBarBuilder[저장].Update (L68) → update()
[E5] fileDeleteForm.SubmitComplete (L78) → retrieve()
[E6] fileUploadForm.SubmitComplete (L84) → resetFileUpload(), retrieve()
[E7] fileUpload.Change (L104) → 인라인 L104-111 (new ChangeHandler() { @Override publi…)
[E9] fileUpload.Change (L232) → 인라인 L232-239 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L145-147 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L150-152 | E1,E5,E6,checkFileDelete | 상태 처리 | 업무 |
| public retrieve() | L155-160 | E1,E5,E6,checkFileDelete | 서비스 emp.Emp18_RelateFile.selectByPersonId(personId) | 업무 |
| public insertRow() | L163-182 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public update() | L185-198 | E4,insertRow | 서비스 emp.Emp18_RelateFile.update | 업무 |
| public deleteRow() | L201-223 | E3 | ConfirmBox → E8 | 업무 |
| private resetFileUpload() | L225-240 | E6 | 상태 처리 | 업무 |
| private checkFileDelete() | L242-267 | E8 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public getGrid() | L274-277 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L93-142 | 필드 초기화 | 미선택 시 alert "등록된 파일이 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L269-271 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L134 SQL 계산 컬럼(selectByPersonId: sys10_reg_date)
  gb.text('fileNm', 350, '파일명'),  // L135 SQL 계산 컬럼(selectByPersonId: sys10_file_nm)
  gb.double('size', 100, '용량(KB)'),  // L136 SQL 계산 컬럼(selectByPersonId: sys10_size)
  gb.text('note', 450, '상세설명', { editor: 'text' }),  // L137
  // ⚠ 대응 없음 (GridBuilder L138) addCell
  // ⚠ 대응 없음 (GridBuilder L139) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp14_TabPage_Account (`client/vi/emp/Emp14_TabPage_Account.java`, 166줄)

- 입력·하위 화면: `bankCodeComboBox` ComboBoxField("BankCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 100 "시작일" Date 편집:MyDateField
  - bankName 150 "은행" Text 편집:bankCodeComboBox
  - accountNoDec 200 "계좌번호" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L51-64) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L57) → retrieve()
[E2] searchBarBuilder[등록].Insert (L58) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L59) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L143) → 서비스 emp.Emp14_Account.delete
[E4] searchBarBuilder[저장].Update (L60) → update()
[E5] bankCodeComboBox[BankCode].Collapse (L70) → 인라인 L70-76 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L88-90 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L93-95 | E1 | 상태 처리 | 업무 |
| public retrieve() | L98-103 | E1 | 서비스 emp.Emp14_Account.selectByPersonId(personId), 건수 표시 | 업무 |
| public update() | L106-119 | E4 | 서비스 emp.Emp14_Account.update | 업무 |
| public insertRow() | L122-136 | E2 | 미선택 시 alert "은행을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L140-155 | E3 | ConfirmBox → E6 | 업무 |
| public getGrid() | L162-165 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L66-85 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L157-159 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L80
  gb.text('bankNm', 150, '은행', { editor: 'select' }),  // L81 SQL 계산 컬럼(selectByPersonId: f_cdnm('BankCode', emp14_bank_cd, emp14…)
  gb.text('accountNoDec', 200, '계좌번호', { editor: 'text' }),  // L82 SQL 계산 컬럼(selectByPersonId: TO_DECRYPTS(emp14_account_no))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp13_TabPage_Project (`client/vi/emp/Emp13_TabPage_Project.java`, 149줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - fromYearMonth 80 "시작년월" Text 편집:TextField
  - toYearMonth 80 "종료년월" Text 편집:TextField
  - projectName 340 "프로젝트명" Text 편집:TextField
  - note 580 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L42-56) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L49) → retrieve()
[E2] searchBarBuilder[등록].Insert (L50) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L51) → deleteRow()
       └ [E5] messageBox.DialogHide [YES] (L126) → 서비스 emp.Emp13_Project.delete
[E4] searchBarBuilder[저장].Update (L52) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L72-74 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L77-79 | E1 | 상태 처리 | 업무 |
| public retrieve() | L82-87 | E1 | 서비스 emp.Emp13_Project.selectByPersonId(personId) | 업무 |
| public update() | L90-103 | E4 | 서비스 emp.Emp13_Project.update | 업무 |
| public insertRow() | L106-119 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L123-138 | E3 | ConfirmBox → E5 | 업무 |
| public getGrid() | L145-148 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L58-69 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L140-142 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('frYm', 80, '시작년월', { editor: 'text' }),  // L63
  gb.text('toYm', 80, '종료년월', { editor: 'text' }),  // L64
  gb.text('projectNm', 340, '프로젝트명', { editor: 'text' }),  // L65
  gb.text('note', 580, '비고', { editor: 'text' }),  // L66
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp12_TabPage_Event (`client/vi/emp/Emp12_TabPage_Event.java`, 154줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - eventDt 100 "행사일자" Date 편집:MyDateField
  - eventName 240 "행사명" Text 편집:TextField
  - eventPart 240 "행사참여담당내용" Text 편집:TextField
  - eventDesc 240 "행사내용" Text 편집:TextField
  - note 240 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L47-61) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L54) → retrieve()
[E2] searchBarBuilder[등록].Insert (L55) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L56) → deleteRow()
       └ [E5] messageBox.DialogHide [YES] (L131) → 서비스 emp.Emp12_Event.delete
[E4] searchBarBuilder[저장].Update (L57) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L78-80 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L83-85 | E1 | 상태 처리 | 업무 |
| public retrieve() | L88-93 | E1 | 서비스 emp.Emp12_Event.selectByPersonId(personId) | 업무 |
| public update() | L96-109 | E4 | 서비스 emp.Emp12_Event.update | 업무 |
| public insertRow() | L112-125 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L128-143 | E3 | ConfirmBox → E5 | 업무 |
| public getGrid() | L150-153 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L63-75 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L145-147 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('eventDt', 100, '행사일자', { editor: 'date' }),  // L68
  gb.text('eventNm', 240, '행사명', { editor: 'text' }),  // L69
  gb.text('eventPart', 240, '행사참여담당내용', { editor: 'text' }),  // L70
  gb.text('eventDesc', 240, '행사내용', { editor: 'text' }),  // L71
  gb.text('note', 240, '비고', { editor: 'text' }),  // L72
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp11_TabPage_Reward (`client/vi/emp/Emp11_TabPage_Reward.java`, 162줄)

- 입력·하위 화면: `rewardComboBox` ComboBoxField("EmpRewardCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - rewardCodeName 80 "상벌구분" Text 편집:rewardComboBox
  - rewardDt 100 "상벌일자" Date 편집:MyDateField
  - rewardGroup 160 "상벌단체" Text 편집:TextField
  - rewardName 320 "수상(징계)사유" Text 편집:TextField
  - rewardDesc 320 "수상(징계)처분" Text 편집:TextField
  - note 240 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L45-59) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L52) → retrieve()
[E2] searchBarBuilder[등록].Insert (L53) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L54) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L139) → 서비스 emp.Emp11_Reward.delete
[E4] searchBarBuilder[저장].Update (L55) → update()
[E5] rewardComboBox[EmpRewardCode].Collapse (L66) → 인라인 L66-72 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L86-88 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L91-93 | E1 | 상태 처리 | 업무 |
| public retrieve() | L96-101 | E1 | 서비스 emp.Emp11_Reward.selectByPersonId(personId) | 업무 |
| public update() | L104-117 | E4 | 서비스 emp.Emp11_Reward.update | 업무 |
| public insertRow() | L120-133 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L136-151 | E3 | ConfirmBox → E6 | 업무 |
| public getGrid() | L158-161 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L61-83 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L153-155 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('rewardCdNm', 80, '상벌구분', { editor: 'select' }),  // L75 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpRewardCode', emp11_reward_cd…)
  gb.date('rewardDt', 100, '상벌일자', { editor: 'date' }),  // L76
  gb.text('rewardGroup', 160, '상벌단체', { editor: 'text' }),  // L77
  gb.text('rewardNm', 320, '수상(징계)사유', { editor: 'text' }),  // L78
  gb.text('rewardDesc', 320, '수상(징계)처분', { editor: 'text' }),  // L79
  gb.text('note', 240, '비고', { editor: 'text' }),  // L80
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp09_TabPage_Evaluation (`client/vi/emp/Emp09_TabPage_Evaluation.java`, 203줄)

- 입력·하위 화면: `lookupOrg` LookupTriggerField, `searchPopup` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - evaluationDt 100 "평가일자" Date 편집:MyDateField
  - evaluationOrg 240 "평가부서" Text 편집:lookupOrg
  - evaluationEmp 80 "평가담당자" Text 편집:lookupOrg
  - evaluationGrade 80 "평가등급" Text 편집:TextField
  - evaluationDesc 240 "평가내용" Text 편집:TextField
  - note 240 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L48-62) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L55) → retrieve()
[E2] searchBarBuilder[등록].Insert (L56) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L57) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L180) → 서비스 emp.Emp09_Evaluation.delete
[E4] searchBarBuilder[저장].Update (L58) → update()
[E5] lookupOrg.TriggerClick (L70) → lookupOrg()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupOrg() | L106-124 | E5 | 조회창 Emp00_Lookup_SelectSingle 열기, 미선택 시 alert "평가일자를 등록해주세요" | 업무 |
| public init() | L127-129 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L132-134 | E1 | 상태 처리 | 업무 |
| public retrieve() | L137-142 | E1 | 서비스 emp.Emp09_Evaluation.selectByPersonId(personId) | 업무 |
| public update() | L145-158 | E4 | 서비스 emp.Emp09_Evaluation.update | 업무 |
| public insertRow() | L161-174 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L177-192 | E3 | ConfirmBox → E6 | 업무 |
| public getGrid() | L199-202 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L64-86 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('evaluationDt', 100, '평가일자', { editor: 'date' }),  // L78
  gb.text('evaluationOrg', 240, '평가부서'),  // L79
  gb.text('evaluationEmp', 80, '평가담당자'),  // L80
  gb.text('evaluationGrade', 80, '평가등급', { editor: 'text' }),  // L81
  gb.text('evaluationDesc', 240, '평가내용', { editor: 'text' }),  // L82
  gb.text('note', 240, '비고', { editor: 'text' }),  // L83
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp08_TabPage_License (`client/vi/emp/Emp08_TabPage_License.java`, 203줄)

- 입력·하위 화면: `tabPage` Emp32_TabPage_RelateLicense
- 그리드 `grid` (buildGrid(), 체크박스):
  - certifiedDt 100 "취득일자" Date 편집:MyDateField
  - certifiedName 240 "자격증명" Text 편집:TextField
  - licenseNumber 240 "자격증번호(협회등록번호)" Text 편집:TextField
  - issuingAgency 240 "발급기관" Text 편집:TextField
  - issuingGrade 80 "발급등급" Text 편집:TextField
  - financeRelateYn 120 "금융관련자격증" Boolean
  - kofiaRegDate 100 "협회등록일" Date 편집:MyDateField
  - note 240 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L54-88) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L60) → retrieve()
[E2] searchBarBuilder[등록].Insert (L61) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L62) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L180) → 서비스 emp.Emp08_License.delete
[E4] searchBarBuilder[저장].Update (L63) → update()
[E5] grid.RowClick (L82) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrievePage() | L107-113 | E5,retrieve | 상태 처리 | 업무 |
| public init() | L116-119 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L122-125 | E1 | 상태 처리 | 업무 |
| public retrieve() | L128-142 | E1 | 서비스 emp.Emp08_License.selectByPersonId(personId) | 업무 |
| public update() | L145-158 | E4 | 서비스 emp.Emp08_License.update | 업무 |
| public insertRow() | L161-174 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L177-192 | E3 | ConfirmBox → E6 | 업무 |
| public getGrid() | L199-202 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L90-105 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('certifiedDt', 100, '취득일자', { editor: 'date' }),  // L95
  gb.text('certifiedNm', 240, '자격증명', { editor: 'text' }),  // L96
  gb.text('licenseNo', 240, '자격증번호(협회등록번호)', { editor: 'text' }),  // L97
  gb.text('issuingAgency', 240, '발급기관', { editor: 'text' }),  // L98
  gb.text('issuingGrade', 80, '발급등급', { editor: 'text' }),  // L99
  gb.boolean('financeRelateYn', 120, '금융관련자격증'),  // L100
  gb.date('kofiaRegDate', 100, '협회등록일', { editor: 'date' }),  // L101
  gb.text('note', 240, '비고', { editor: 'text' }),  // L102
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp32_TabPage_RelateLicense (`client/vi/emp/Emp32_TabPage_RelateLicense.java`, 187줄)

- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `financeProType` ComboBoxField("FinanceProType")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - financeProTypeName 180 "금융투자전문인력구분" Text 편집:financeProType
  - titleYn 80 "대표여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L49-61) → settings()
[E1] insertButton[등록].Select (L64) → insertRow()
[E2] updateButton[저장].Select (L70) → updateCheck()
[E3] deleteButton[삭제].Select (L76) → deleteRow()
       └ [E5] messageBox.DialogHide [YES] (L174) → 서비스 emp.Emp32_RelateLicense.delete
[E4] financeProType[FinanceProType].Collapse (L86) → 인라인 L86-93 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L103-114 | 공개 메서드 | 서비스 emp.Emp32_RelateLicense.selectByLicenseId(licenseId) | 업무 |
| public init() | L116-119 | 공개 메서드 | 상태 처리 | 업무 |
| private updateCheck() | L121-141 | E2 | 상태 처리 | 업무 |
| public update() | L143-156 | updateCheck | 서비스 emp.Emp32_RelateLicense.update | 업무 |
| public insertRow() | L158-169 | E1 | 상태 처리 | 업무 |
| public deleteRow() | L171-186 | E3 | ConfirmBox → E5 | 업무 |
| private settings() | L63-82 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L84-101 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('financeProTypeNm', 180, '금융투자전문인력구분'),  // L97 SQL 계산 컬럼(selectByLicenseId: f_cdnm('FinanceProType', emp32_finance_…)
  gb.boolean('titleYn', 80, '대표여부'),  // L98
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={updateCheck}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Emp07_TabPage_Career (`client/vi/emp/Emp07_TabPage_Career.java`, 243줄)

- 입력·하위 화면: `careerTypeComboBox` ComboBoxField("EmpCareerTypeCode"), `fromYM` TextField 빈칸="YYYY.MM", `toYM` TextField 빈칸="YYYY.MM"
- 그리드 `grid` (buildGrid(), 체크박스):
  - fromYearMonth 80 "시작년월" TextCenter 편집:fromYM
  - toYearMonth 80 "종료년월" TextCenter 편집:toYM
  - companyName 220 "회사명" Text 편집:TextField
  - industry 150 "업종" Text 편집:TextField
  - finalOrg 100 "근무부서" Text 편집:TextField
  - finalTitle 100 "최종직위" Text 편집:TextField
  - careerTypeName 100 "고용형태" Text 편집:careerTypeComboBox
  - finalRole 240 "업무(역활,권한)" Text 편집:TextField
  - financeRelateYn 110 "금융관련경력" Boolean
  - mainCareerYn 100 "주요경력" Boolean
  - extrAddTitleYn 100 "대외겸직" Boolean
  - note 200 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L51-65) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L58) → retrieve()
[E2] searchBarBuilder[등록].Insert (L59) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L60) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L220) → 서비스 emp.Emp07_Career.delete
[E4] searchBarBuilder[저장].Update (L61) → update()
[E5] careerTypeComboBox[EmpCareerTypeCode].Collapse (L72) → 인라인 L72-78 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L104-106 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L109-111 | E1 | 상태 처리 | 업무 |
| public retrieve() | L114-119 | E1 | 서비스 emp.Emp07_Career.selectByPersonId(personId) | 업무 |
| public update() | L122-197 | E4 | 서비스 emp.Emp07_Career.update | 업무 |
| public insertRow() | L200-213 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L217-232 | E3 | ConfirmBox → E6 | 업무 |
| public getGrid() | L239-242 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L67-101 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L234-236 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('frYm', 80, '시작년월'),  // L87
  gb.textCenter('toYm', 80, '종료년월'),  // L88
  gb.text('companyNm', 220, '회사명', { editor: 'text' }),  // L89
  gb.text('industry', 150, '업종', { editor: 'text' }),  // L90
  gb.text('finalOrg', 100, '근무부서', { editor: 'text' }),  // L91
  gb.text('finalTitle', 100, '최종직위', { editor: 'text' }),  // L92
  gb.text('careerTyNm', 100, '고용형태', { editor: 'select' }),  // L93 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpCareerTypeCode', emp07_caree…)
  gb.text('finalRole', 240, '업무(역활,권한)', { editor: 'text' }),  // L94
  gb.boolean('financeRelateYn', 110, '금융관련경력'),  // L95
  gb.boolean('mainCareerYn', 100, '주요경력'),  // L96
  gb.boolean('extrAddTitleYn', 100, '대외겸직'),  // L97
  gb.text('note', 200, '비고', { editor: 'text' }),  // L98
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp06_TabPage_Family (`client/vi/emp/Emp06_TabPage_Family.java`, 182줄)

- 입력·하위 화면: `locationComboBox` ComboBoxField("EmpLocationCode"), `relateComboBox` ComboBoxField("FamilyRelateCode2")
- 그리드 `grid` (buildGrid(), 체크박스):
  - familyName 100 "가족성명" Text 편집:TextField
  - relationName 100 "가족관계" Text 편집:relateComboBox
  - birthday 100 "생년월일" Date 편집:MyDateField
  - familySchool 240 "출신학교" Text 편집:TextField
  - familyJob 120 "직업" Text 편집:TextField
  - schoolLocation 240 "학교소재지" Text 편집:TextField
  - familyLocation 120 "가족거주지" Text 편집:TextField
  - locateName 80 "동거여부" Text 편집:locationComboBox
  - disabilityGrade 80 "장애등급" Text 편집:TextField
  - note 220 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L50-64) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L57) → retrieve()
[E2] searchBarBuilder[등록].Insert (L58) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L59) → deleteRow()
       └ [E7] messageBox.DialogHide [YES] (L159) → 서비스 emp.Emp06_Family.delete
[E4] searchBarBuilder[저장].Update (L60) → update()
[E5] locationComboBox[EmpLocationCode].Collapse (L71) → 인라인 L71-77 (new CollapseHandler() { @Override pub…)
[E6] relateComboBox[FamilyRelateCode2].Collapse (L80) → 인라인 L80-86 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L105-107 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L110-112 | E1 | 상태 처리 | 업무 |
| public retrieve() | L115-120 | E1 | 서비스 emp.Emp06_Family.selectByPersonId(personId) | 업무 |
| public update() | L123-136 | E4 | 서비스 emp.Emp06_Family.update | 업무 |
| public insertRow() | L139-152 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L156-171 | E3 | ConfirmBox → E7 | 업무 |
| public getGrid() | L178-181 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L66-102 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L173-175 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('familyNm', 100, '가족성명', { editor: 'text' }),  // L89
  gb.text('relationNm', 100, '가족관계', { editor: 'select' }),  // L91 SQL 계산 컬럼(selectByPersonId: f_cdnm('FamilyRelateCode2', emp06_relat…)
  gb.date('birthday', 100, '생년월일', { editor: 'date' }),  // L92
  gb.text('familySchool', 240, '출신학교', { editor: 'text' }),  // L93
  gb.text('familyJob', 120, '직업', { editor: 'text' }),  // L94
  gb.text('schoolLocation', 240, '학교소재지', { editor: 'text' }),  // L95
  gb.text('familyLocation', 120, '가족거주지', { editor: 'text' }),  // L96
  gb.text('locateNm', 80, '동거여부', { editor: 'select' }),  // L97 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpLocationCode', emp06_locate_…)
  gb.text('disabilityGrade', 80, '장애등급', { editor: 'text' }),  // L98
  gb.text('note', 220, '비고', { editor: 'text' }),  // L99
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp05_TabPage_Academic (`client/vi/emp/Emp05_TabPage_Academic.java`, 205줄)

- 입력·하위 화면: `bachelorDegreeComboBox` ComboBoxField("EmpBachelorDegree"), `graduateDegreeComboBox` ComboBoxField("EmpGraduateDegree"), `fromYM` TextField 빈칸="YYYY.MM", `toYM` TextField 빈칸="YYYY.MM"
- 그리드 `grid` (buildGrid(), 체크박스):
  - fromYearMonth 80 "입학년월" TextCenter 편집:fromYM
  - toYearMonth 80 "졸업년월" TextCenter 편집:toYM
  - schoolName 240 "학교 및 과정" Text 편집:TextField
  - bachelorDegreeName 80 "학력등급" Text 편집:bachelorDegreeCombo…
  - financeRelateYn 110 "금융관련학력" Boolean
  - degreeCredit 80 "학점" Text 편집:TextField
  - graduateDegreeName 80 "수료여부" Text 편집:graduateDegreeCombo…
  - schoolLocation 140 "소재지" Text 편집:TextField
  - note 360 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L51-65) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L58) → retrieve()
[E2] searchBarBuilder[등록].Insert (L59) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L60) → deleteRow()
       └ [E7] messageBox.DialogHide [YES] (L182) → 서비스 emp.Emp05_Academic.delete
[E4] searchBarBuilder[저장].Update (L61) → update()
[E5] bachelorDegreeComboBox[EmpBachelorDegree].Collapse (L72) → 인라인 L72-78 (new CollapseHandler() { @Override pub…)
[E6] graduateDegreeComboBox[EmpGraduateDegree].Collapse (L81) → 인라인 L81-87 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L110-112 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L115-117 | E1 | 상태 처리 | 업무 |
| public retrieve() | L120-125 | E1 | 서비스 emp.Emp05_Academic.selectByPersonId(personId) | 업무 |
| public update() | L128-159 | E4 | 서비스 emp.Emp05_Academic.update | 업무 |
| public insertRow() | L162-175 | E2 | 미선택 시 alert "사원을 먼저 선택해주세요" | 업무 |
| public deleteRow() | L179-194 | E3 | ConfirmBox → E7 | 업무 |
| public getGrid() | L201-204 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L67-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L196-198 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('frYm', 80, '입학년월'),  // L96
  gb.textCenter('toYm', 80, '졸업년월'),  // L97
  gb.text('schoolName', 240, '학교 및 과정', { editor: 'text' }),  // L98
  gb.text('bachelorDegreeNm', 80, '학력등급', { editor: 'select' }),  // L99 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpBachelorDegree', emp05_bache…)
  gb.boolean('financeRelateYn', 110, '금융관련학력'),  // L100
  gb.text('degreeCredit', 80, '학점', { editor: 'text' }),  // L101
  gb.text('graduateDegreeNm', 80, '수료여부', { editor: 'select' }),  // L102 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpGraduateDegree', emp05_gradu…)
  gb.text('schoolLocation', 140, '소재지', { editor: 'text' }),  // L103
  gb.text('note', 360, '비고', { editor: 'text' }),  // L104
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Emp04_TabPage_AddTitle (`client/vi/emp/Emp04_TabPage_AddTitle.java`, 192줄)

- 입력·하위 화면: `lookup` Emp04_Edit_AddTitle
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 100 "겸직시작일" Date
  - closeDate 100 "종료일" Date
  - orgName 200 "조직" Text
  - titleName 100 "직책" Text
  - transReason 600 "겸직사유" Text
  - actionCell 60 "수정" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L50-62) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L56) → retrieve()
[E2] searchBarBuilder[등록].Insert (L57) → insertRow()
[E3] searchBarBuilder[삭제].Delete (L58) → deleteRow()
       └ [E4] msgBox.DialogHide [YES] (L145) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L95-97 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L100-102 | E1 | 상태 처리 | 업무 |
| public retrieve() | L105-114 | E1 | 미선택 시 alert "사원을 먼저 선택해주세요", 서비스 emp.Emp04_AddTitle.selectByPersonId(personId) | 업무 |
| public update() | L117-119 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L122-139 | E2 | 팝업 Emp04_Edit_AddTitle 열기, 미선택 시 alert "사원을 먼저 선택해주세요", 서비스 emp.Emp04_AddTitle.selectByPersonId(personId) | 업무 |
| public deleteRow() | L142-160 | E3 | ConfirmBox → E4 | 업무 |
| public delete() | L162-181 | E4 | GridDeleteData emp.Emp04_AddTitle.deleteList, emp.Emp04_AddTitle.delete(체크된 행 목록) | 업무 |
| public getGrid() | L188-191 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L64-92 | 필드 초기화 | 팝업 Emp04_Edit_AddTitle 열기, 서비스 emp.Emp04_AddTitle.selectByPersonId(personId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L183-185 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '겸직시작일'),  // L84
  gb.date('closeDate', 100, '종료일'),  // L85
  gb.text('orgNm', 200, '조직'),  // L86 SQL 계산 컬럼(selectByPersonId: f_org_nm(emp04_org_code_id, emp04_start…)
  gb.text('titleNm', 100, '직책'),  // L87 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpTitleCode', emp04_title_cd, …)
  gb.text('transReason', 600, '겸직사유'),  // L88
  // ⚠ 대응 없음 (GridBuilder L89) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Emp04_Edit_AddTitle (`client/vi/emp/Emp04_Edit_AddTitle.java`, 258줄)

- 입력·하위 화면: `posCode` TextField, `posName` ComboBoxField("EmpPosCode"), `orgHeadYn` CheckBox, `orgName` LookupTriggerField, `orgCodeId` LongField, `startDate` MyDateField, `closeDate` MyDateField, `titleCode` TextField, `titleName` ComboBoxField("EmpTitleCode"), `transReason` MyTextArea, `orgSearch` Org00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L100-115) → settings(), getEditor()
[E1] updateButton[저장].Select (L118) → update()
[E2] closeButton[닫기].Select (L124) → hide()
[E3] posName[직위].Collapse (L133) → 인라인 L133-138 (new CollapseHandler() { @Override pub…)
[E4] titleName[직책].Collapse (L139) → 인라인 L139-144 (new CollapseHandler() { @Override pub…)
[E5] orgName[조직].TriggerClick (L148) → 메시지 "발령일을 먼저 등록해야 합니다."

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L76-88 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L90-98 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L132-201 | 생성자 | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| public update() | L203-249 | E1 | 서비스 emp.Emp04_AddTitle.updateList(transModel, personId) | 업무 |
| private settings() | L117-130 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L251-253 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L255-257 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp03_TabPage_Trans (`client/vi/emp/Emp03_TabPage_Trans.java`, 422줄)

- 입력·하위 화면: `kindNameComboBox` ComboBoxField("EmpKindCode"), `transNameComboBox` ComboBoxField("EmpTransCode"), `lookupOrgCode` LookupTriggerField, `titleNameComboBox` ComboBoxField("EmpTitleCode"), `posNameComboBox` ComboBoxField("EmpPosCode"), `gradeNameComboBox` ComboBoxField("EmpGradeCode"), `lookupGradeCode` Emp03_Lookup_Grade
- 그리드 `grid` (buildGrid(), 체크박스):
  - transDate 90 "발령일" Date 편집:MyDateField
  - transName 70 "발령구분" Text 편집:transNameComboBox
  - kindName 100 "사원구분" Text 편집:kindNameComboBox
  - orgName 200 "발령조직" Text 편집:lookupOrgCode
  - titleName 100 "발령직책" Text 편집:titleNameComboBox
  - posName 100 "발령직위" Text 편집:posNameComboBox
  - gradeName 100 "특정직위" Text
  - duty 150 "담당업무" Text 편집:TextField
  - expiryDate 90 "계약만료일" Date 편집:MyDateField
  - orgHeadYn 70 "조직장" Boolean
  - directorYn 70 "임원" Boolean
  - officerYn 70 "등기임원" Boolean
  - tdmTargetYn 70 "책무임원" Boolean
  - nonStayYn 70 "비상근" Boolean
  - transReason 200 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L64-86) → 초기화
[E1] gradeCodeButton[특정직위 및 알림설정].Select (L68) → lookupGradeCode()
[E2] searchBarBuilder[조회].Retrieve (L78) → retrieve()
[E3] searchBarBuilder[등록].Insert (L79) → insertRow()
[E4] searchBarBuilder[삭제].Delete (L80) → deleteRow()
[E5] searchBarBuilder[저장].Update (L81) → update()
[E6] kindNameComboBox[EmpKindCode].Collapse (L93) → 인라인 L93-99 (new CollapseHandler() { @Override pub…)
[E7] transNameComboBox[EmpTransCode].Collapse (L101) → 인라인 L101-107 (new CollapseHandler() { @Override pub…)
[E8] lookupOrgCode.TriggerClick (L110) → lookupOrgCode()
[E9] titleNameComboBox[EmpTitleCode].Collapse (L117) → 인라인 L117-123 (new CollapseHandler() { @Override pub…)
[E10] posNameComboBox[EmpPosCode].Collapse (L125) → 인라인 L125-131 (new CollapseHandler() { @Override pub…)
[E11] gradeNameComboBox[EmpGradeCode].Collapse (L134) → 인라인 L134-140 (new CollapseHandler() { @Override pub…)
[E12] messageBox.DialogHide [YES] (L363) → updateTransInfoGrid()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupOrgCode() | L163-180 | E8 | 조회창 Org00_Lookup_SelectSingle 열기, 미선택 시 alert "발령일을 먼저 등록해주세요" | 업무 |
| private lookupGradeCode() | L182-190 | E1 | 조회창 Emp03_Lookup_Grade 열기 | 업무 |
| public init() | L193-195 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L198-200 | E2,lookupGradeCode | 상태 처리 | 업무 |
| public retrieve() | L203-209 | E2,lookupGradeCode | 서비스 emp.Emp03_Trans.selectByPersonId(personId, companyId) | 업무 |
| public update() | L212-248 | E5 | 서비스 emp.Emp03_Trans.update | 업무 |
| private updateTransInfoGrid() | L250-274 | E12,update | 상태 처리 | 업무 |
| public insertRow() | L277-338 | E3 | 미선택 시 alert "사원을 먼저 선택해주세요", 서비스 org.Org00_OrgInfo.selectByOrgCodeId(orgCodeId, companyId, baseDate) | 업무 |
| public deleteRow() | L341-358 | E4 | 서비스 emp.Emp03_Trans.deleteCheck(personId) | 업무 |
| public delete() | L360-379 | deleteRow | 확인창 표시, GridDeleteData emp.Emp03_Trans.delete(체크된 행 목록) | 업무 |
| private getLatestTransModel() | L381-398 | insertRow | 상태 처리 | 업무 |
| private moveToFirst() | L400-411 | insertRow | 상태 처리 | 업무 |
| public getGrid() | L418-421 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L88-161 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L413-415 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('transDate', 90, '발령일', { editor: 'date' }),  // L143
  gb.text('transNm', 70, '발령구분', { editor: 'select' }),  // L144 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpTransCode', emp03_trans_cd, …)
  gb.text('kindNm', 100, '사원구분', { editor: 'select' }),  // L145 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpKindCode', emp03_kind_cd, em…)
  gb.text('korNm', 200, '발령조직'),  // L146
  gb.text('titleNm', 100, '발령직책', { editor: 'select' }),  // L147 SQL 계산 컬럼(selectByPersonId: f_get_empTrans(emp03_person_id, emp03_t…)
  gb.text('posNm', 100, '발령직위', { editor: 'select' }),  // L148 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpPosCode', emp03_pos_cd, emp0…)
  gb.text('gradeNm', 100, '특정직위'),  // L150 SQL 계산 컬럼(selectByPersonId: f_cdnm('EmpGradeCode', emp03_grade_cd, …)
  gb.text('duty', 150, '담당업무', { editor: 'text' }),  // L151
  gb.date('expiryDate', 90, '계약만료일', { editor: 'date' }),  // L152
  gb.boolean('orgHeadYn', 70, '조직장'),  // L153
  gb.boolean('directorYn', 70, '임원'),  // L154
  gb.boolean('officerYn', 70, '등기임원'),  // L155
  gb.boolean('tdmTargetYn', 70, '책무임원'),  // L156
  gb.boolean('nonStayYn', 70, '비상근'),  // L157
  gb.text('transReason', 200, '비고', { editor: 'text' }),  // L158
];
```

#### 사용된 버튼들
1. <Button type="org" onClick={lookupGradeCode}>특정직위 및 알림설정</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="save" onClick={update}>저장</Button>

### Emp03_Lookup_Grade (`client/vi/emp/Emp03_Lookup_Grade.java`, 255줄)

- 툴바 `searchBar`: 기준일: {baseDate} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `personName` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `gradeName` ComboBoxField("EmpGradeCode", "(선택안함)")
- 그리드 `grid` (buildGrid()):
  - orgFullName 200 "부서명" Text
  - titleName 110 "직책" TextCenter
  - empNo 70 "사원번호" TextCenter
  - empKorName 100 "사원명" TextCenter
  - gradeName 150 "특정직위" TextCenter 편집:gradeName
  - icsYn 100 "법규 알림" Boolean
  - apprYn 100 "상신문서 알림" Boolean

#### 이벤트
[E1] personName.TriggerClick (L91) → 인라인 L91-106 (new TriggerClickHandler(){ @Override …)
[E2] gradeName[EmpGradeCode].Collapse (L109) → 인라인 L109-116 (new CollapseHandler() { @Override pub…)
[E3] retrieveButton[조회].Select (L135) → retrieve()
[E4] updateButton[저장].Select (L141) → update()
[E5] closeButton[닫기].Select (L147) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-85 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L155-167 | E3,open,update | 서비스 emp.Emp03_Trans.selectByGrade(companyId, baseDate) | 업무 |
| public update() | L169-245 | E4 | 서비스 emp.Emp03_Trans.update, emp.Emp25_MypageNotice.updateList | 업무 |
| public settings() | L130-153 | open | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L87-128 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L247-249 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L251-253 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgFullNm', 200, '부서명'),  // L119 SQL 계산 컬럼(selectByGrade: f_org_parent_full_nm(emp03_org_code_id,…)
  gb.textCenter('titleNm', 110, '직책'),  // L120 SQL 계산 컬럼(selectByGrade: f_get_empTrans(emp03_person_id, emp03_t…)
  gb.textCenter('empNo', 70, '사원번호'),  // L121
  gb.textCenter('korNm', 100, '사원명'),  // L122
  gb.textCenter('gradeNm', 150, '특정직위'),  // L123 SQL 계산 컬럼(selectByGrade: f_cdnm('EmpGradeCode', emp03_grade_cd, …)
  gb.boolean('icsYn', 100, '법규 알림'),  // L124
  gb.boolean('apprYn', 100, '상신문서 알림'),  // L125
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp00_Current_TransInfoModel (`client/vi/emp/Emp00_Current_TransInfoModel.java`, 37줄)


#### 이벤트

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L15-35 | 공개 메서드 | 서비스 emp.Emp00_TransInfo.selectOneByPersonId | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Emp03_Edit_Person (`client/vi/emp/Emp03_Edit_Person.java`, 390줄)

- 입력·하위 화면: `empNo` TextField, `korName` TextField, `mobileTelNo` TextField, `officeTelNo` TextField, `officeDetail` TextField, `emailAddress` TextField, `note` MyTextArea, `hireDate` MyDateField, `hireCode` TextField, `hireName` ComboBoxField("HireCode"), `homeTelNo` TextField, `zipCode` TextField, `zipAddress` TextField, `zipDetail` TextField, `chnName` TextField, `engName` TextField, `nationCode` TextField, `nationName` ComboBoxField("EmpNationCode"), `genderCode` TextField, `genderName` ComboBoxField("EmpGenderCode"), `birthday` MyDateField, `decCtzNo` TextField, `transDate` MyDateField, `kindCode` TextField, `posCode` TextField, `titleCode` TextField, `transCode` TextField, `kindName` ComboBoxField("EmpKindCode"), `posName` ComboBoxField("EmpPosCode"), `titleName` ComboBoxField("EmpTitleCode"), `transName` ComboBoxField("EmpTransCode"), `orgCodeId` LongField, `expiryDate` MyDateField, `orgKorName` LookupTriggerField, `orgSearch` Org00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L145-179) → getEditor(), show()
[E1] updateButton[저장].Select (L154) → update()
[E2] closeButton[닫기].Select (L162) → hide()
[E3] kindName[사원구분].Collapse (L182) → 인라인 L182-187 (new CollapseHandler() { @Override pub…)
[E4] transName[EmpTransCode].Collapse (L189) → 인라인 L189-194 (new CollapseHandler() { @Override pub…)
[E5] posName[직위].Collapse (L196) → 인라인 L196-201 (new CollapseHandler() { @Override pub…)
[E6] titleName[직책].Collapse (L203) → 인라인 L203-208 (new CollapseHandler() { @Override pub…)
[E7] hireName[채용구분].Collapse (L210) → 인라인 L210-215 (new CollapseHandler() { @Override pub…)
[E8] orgKorName[조직].TriggerClick (L219) → 메시지 "입사일을 먼저 등록해야 합니다."

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L181-293 | 생성자 | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| private spaceDelete() | L295-300 | update | 상태 처리 | 업무 |
| public update() | L303-376 | E1 | 서비스 emp.Emp01_Person.empNoCheck, emp.Emp00_TransInfo.update(companyId, empNo, expiryDate) | 업무 |
| private setHtmlStyle() | L378-380 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L382-384 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L386-388 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp02_TabPage_Others (`client/vi/emp/Emp02_TabPage_Others.java`, 418줄)

- 입력·하위 화면: `engName` TextField, `chnName` TextField, `ctzNo` TextField, `decCtzNo` TextField, `nationCode` TextField, `genderCode` TextField, `homeTelNo` TextField, `zipCode` TextField, `zipAddress` TextField, `zipDetail` TextField, `emailOther` TextField, `familyDscr` TextField, `lunarCode` TextField, `militaryCode` TextField, `marriageCode` TextField, `korAge` TextField 빈칸="생년월일 미입력", `age` TextField 빈칸="생년월일 미입력", `note` MyTextArea, `birthday` MyDateField 빈칸="0000-00-00", `nationName` ComboBoxField("EmpNationCode"), `genderName` ComboBoxField("EmpGenderCode"), `lunarName` ComboBoxField("EmpLunarCode"), `militaryName` ComboBoxField("EmpMilitaryCode"), `marriageName` ComboBoxField("EmpMaritalStatus"), `maskCtzNo` TextField, `lookup` Emp02_Edit_CtzNo

#### 이벤트
[E0] 화면 열림 (생성자 L103-161) → getEditor()
[E1] image.Click (L104) → 인라인 L104-122 (new ClickHandler() { @Override public…)
[E2] fileUploadField.Change (L114) → 인라인 L114-119 (new ChangeHandler() { @Override publi…)
[E3] picUploadForm.SubmitComplete (L126) → 인라인 L126-132 (new SubmitCompleteHandler() { @Overri…)
[E4] updateButton[저장].Select (L138) → update(), autodecCtzNo(), update()
[E5] lunarName[음력구분].Collapse (L197) → 인라인 L197-202 (new CollapseHandler() { @Override pub…)
[E6] genderName[성별].Collapse (L204) → 인라인 L204-209 (new CollapseHandler() { @Override pub…)
[E7] nationName[국적].Collapse (L211) → 인라인 L211-216 (new CollapseHandler() { @Override pub…)
[E8] militaryName[병역구분].Collapse (L222) → 인라인 L222-227 (new CollapseHandler() { @Override pub…)
[E9] marriageName[결혼여부].Collapse (L232) → 인라인 L232-237 (new CollapseHandler() { @Override pub…)
[E10] anchorHire.MouseDown (L261) → setMaskCtzNo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L164-166 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L168-194 | E4 | 서비스 emp.Emp02_Others.updateOne | 업무 |
| private getEditor() | L196-326 | 생성자 | 팝업 Emp02_Edit_CtzNo 열기 | 업무 |
| private setMaskCtzNo() | L328-350 | E10,retrieve | 상태 처리 | 업무 |
| private autodecCtzNo() | L352-396 | E4 | 미선택 시 alert "주민등록번호를 형식에 맞게 입력하세요." | 업무 |
| public retrieve() | L400-407 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L414-417 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L409-411 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={() => /* update(), autodecCtzNo(), update() */}>저장</Button>

### Emp02_Edit_CtzNo (`client/vi/emp/Emp02_Edit_CtzNo.java`, 248줄)


#### 이벤트
[E0] 화면 열림 (생성자 L40-54) → settings(), makeLayout(), show()
[E1] field.KeyPress [key >= '0' && key <= '9'] (L111) → 인라인 L111-143 (new KeyPressHandler() { @Override pub…)
[E2] field.KeyUp (L144) → 인라인 L144-179 (new KeyUpHandler() { @Override public…)
[E3] confirmButton[확인].Select (L185) → confirm()
[E4] closeButton[닫기].Select (L191) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L56-77 | 공개 메서드 | 상태 처리 | 업무 |
| private createCtzNoField() | L106-182 | makeLayout | 상태 처리 | 업무 |
| private confirm() | L199-212 | E3 | 상태 처리 | 업무 |
| private getCtzNo() | L214-239 | confirm | 상태 처리 | 업무 |
| private makeLayout() | L79-103 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private settings() | L184-197 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L241-243 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L245-247 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp01_TabPage_Person (`client/vi/emp/Emp01_TabPage_Person.java`, 419줄)

- 입력·하위 화면: `empNo` TextField, `password` TextField, `korName` TextField, `mobileTelNo` TextField, `officeTelNo` TextField, `officeDetail` TextField, `emailAddress` TextField, `orderSeq` TextField 빈칸="미입력시 자동정렬", `applyCode` TextField, `hireCode` TextField, `thYear` TextField, `workYear` TextField, `note` MyTextArea, `hireDate` MyDateField, `applyName` ComboBoxField("EmpApplyCode"), `hireName` ComboBoxField("HireCode")

#### 이벤트
[E0] 화면 열림 (생성자 L104-121) → settings(), getEditor()
[E1] hireName[채용구분].Collapse (L128) → 인라인 L128-133 (new CollapseHandler() { @Override pub…)
[E2] applyName[지원경로].Collapse (L134) → 인라인 L134-139 (new CollapseHandler() { @Override pub…)
[E3] image.Click (L140) → 인라인 L140-158 (new ClickHandler() { @Override public…)
[E4] fileUploadField.Change (L150) → 인라인 L150-155 (new ChangeHandler() { @Override publi…)
[E5] picUploadForm.SubmitComplete (L162) → 인라인 L162-168 (new SubmitCompleteHandler() { @Overri…)
[E6] updateButton[저장].Select (L169) → update()
[E7] deleteButton[삭제].Select (L175) → deleteConfirm01()
[E8] button01[닫기].Select (L230) → 인라인 L230-235 (new SelectHandler() { @Override publi…)
[E9] messageBox.DialogHide [YES] (L265) → delete()
[E10] anchorHire.MouseDown (L327) → 인라인 L327-332 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L184-186 | delete | 상태 처리 | 업무 |
| public update() | L188-210 | E6 | 서비스 emp.Emp01_Person.update | 업무 |
| private deleteConfirm01() | L212-246 | E7 | 확인창 표시, 서비스 emp.Emp01_Person.checkUsePersonId(personId) | 업무 |
| private deleteConfirm02() | L248-279 | deleteConfirm01 | 확인창 표시, 서비스 emp.Emp04_AddTitle.selectByPersonId(personId) | 업무 |
| private delete() | L299-322 | E9 | 서비스 emp.Emp01_Person.deleteTarget(personId, empId) | 업무 |
| private getEditor() | L324-392 | 생성자 | 조회창 Emp02_Lookup_HireDate 열기 | 업무 |
| public retrieve() | L395-400 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L407-410 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L123-181 | 생성자 | 이벤트 연결, 초기값: hireCode=hireName.getCode(, applyCode=applyName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L402-404 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlContentStyle() | L412-414 | deleteConfirm01 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L416-418 | deleteConfirm01 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="delete" onClick={deleteConfirm01}>삭제</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L230-235 (new SelectHandler() { @Override publi…) */}>닫기</Button>

### Emp02_Lookup_HireDate (`client/vi/emp/Emp02_Lookup_HireDate.java`, 123줄)

- 입력·하위 화면: `groupHireDate` MyDateField, `leaveCalcHireDate` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L35-60) → setDate(), settings(), show()
[E1] updateButton[저장].Select (L80) → update()
[E2] closeButton[닫기].Select (L87) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setDate() | L62-77 | 생성자 | 서비스 emp.Emp02_Others.selectByPersonId(personId) | 업무 |
| private update() | L95-113 | E1 | 서비스 emp.Emp02_Others.updateHireDate(othersId, hireDateGroup, hireDateLeaveCalc) | 업무 |
| private settings() | L79-93 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L115-117 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L119-121 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp00_Lookup_PersonnelRecordCard (`client/vi/emp/Emp00_Lookup_PersonnelRecordCard.java`, 270줄)

- 레이아웃: west=grid, center=rdForm
- 툴바 `buttonBar`: {searchText} {retrieveButton} {downloadButton} {rdFileDownloadForm}
- 입력·하위 화면: `searchText` TextField 빈칸="조직/직책/사번/성명"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - parentFullName 200 "조직" Text
  - titleName 120 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 100 "성명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-139) → show()
[E1] searchText.KeyPress [Enter] (L77) → retrieve()
[E2] retrieveButton[조회].Select (L85) → retrieve()
[E3] closeButton[닫기].Select (L91) → hide()
[E4] downloadButton[다운로드].Select (L97) → createRdExcel()
[E5] grid.CellClick (L104) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-58 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L155-174 | E1,E2,open | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle, orgCodeId) | 업무 |
| private retrieveEditPage() | L176-195 | E5 | 서비스 sys.Sys99_Print.insertRdPersonnelRecordCard(companyId, personId, windowClassName) | 업무 |
| private createRdExcel() | L197-256 | E4 | 미선택 시 alert, 서비스 sys.Sys99_Print.insertRdPersonnelRecordCard(companyId, personId, windowClassName) | 업무 |
| private getSelectList() | L258-264 | retrieveEditPage,createRdExcel | 상태 처리 | 업무 |
| private buildGrid() | L141-153 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L266-268 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L147
  gb.text('titleNm', 120, '직책'),  // L148
  gb.text('empNo', 80, '사번'),  // L149
  gb.text('korNm', 100, '성명'),  // L150
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>다운로드</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp00_Rd_PersonnelRecordCard (`client/vi/emp/Emp00_Rd_PersonnelRecordCard.java`, 45줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setRd() | L27-43 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

