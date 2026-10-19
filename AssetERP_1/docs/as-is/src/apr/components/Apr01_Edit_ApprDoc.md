# Apr01_Edit_ApprDoc

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `act`, `ast`, `att`, `biz`, `bmt`, `car`, `com`, `dcr`, `emp`, `est`, `flt`, `fnd`, `frm`, `icam`, `ics`, `opr`, `pay`, `pln`, `sch`, `sys`, `tdm`
- 파일: `client/vi/apr/Apr01_Edit_ApprDoc.java`
- 함께 쓰는 클래스 30개:
  - `Apr90_Lookup_DisposalList` `client/vi/apr/Apr90_Lookup_DisposalList.java`
  - `Apr90_Lookup_ConfirmEmp` `client/vi/apr/Apr90_Lookup_ConfirmEmp.java`
  - `Apr50_Lookup_PersonList` `client/vi/apr/Apr50_Lookup_PersonList.java`
  - `Apr42_Lookup_Comment` `client/vi/apr/Apr42_Lookup_Comment.java`
  - `Apr42_Lookup_FileList` `client/vi/apr/Apr42_Lookup_FileList.java`
  - `Apr41_Lookup_OpenHistory` `client/vi/apr/Apr41_Lookup_OpenHistory.java`
  - `Apr22_Lookup_SelectIcr` `client/vi/apr/Apr22_Lookup_SelectIcr.java`
  - `Apr22_Lookup_RelateIcr` `client/vi/apr/Apr22_Lookup_RelateIcr.java`
  - `Apr22_Lookup_RelateIcrList` `client/vi/apr/Apr22_Lookup_RelateIcrList.java`
  - `Apr20_Lookup_SelectIcs` `client/vi/apr/Apr20_Lookup_SelectIcs.java`
  - `Apr20_Lookup_RelateIcs` `client/vi/apr/Apr20_Lookup_RelateIcs.java`
  - `Apr20_Lookup_RelateIcsList` `client/vi/apr/Apr20_Lookup_RelateIcsList.java`
  - `Apr13_Lookup_PersonAuth` `client/vi/apr/Apr13_Lookup_PersonAuth.java`
  - `Apr03_Page_Relate` `client/vi/apr/Apr03_Page_Relate.java`
  - `Apr21_Lookup_RelateAppr` `client/vi/apr/Apr21_Lookup_RelateAppr.java`
  - `Apr16_Grid_StampDoc` `client/vi/apr/Apr16_Grid_StampDoc.java`
  - `Apr16_Grid_StampApplList` `client/vi/apr/Apr16_Grid_StampApplList.java`
  - `Apr16_Lookup_StampApplQty` `client/vi/apr/Apr16_Lookup_StampApplQty.java`
  - `Apr15_Lookup_ReprCorp` `client/vi/apr/Apr15_Lookup_ReprCorp.java`
  - `Apr04_Edit_RetouchApprStep` `client/vi/apr/Apr04_Edit_RetouchApprStep.java`
  - `Apr04_Edit_ApprStep` `client/vi/apr/Apr04_Edit_ApprStep.java`
  - `Apr01_Lookup_ApprList` `client/vi/apr/Apr01_Lookup_ApprList.java`
  - `Apr01_Grid_ApprFile` `client/vi/apr/Apr01_Grid_ApprFile.java`
  - `Apr01_Edit_Message` `client/vi/apr/Apr01_Edit_Message.java`
  - `Apr01_Lookup_RelateFund` `client/vi/apr/Apr01_Lookup_RelateFund.java`
  - `Apr01_Lookup_RelateAppr` `client/vi/apr/Apr01_Lookup_RelateAppr.java`
  - `Apr01_Lookup_ApprFile` `client/vi/apr/Apr01_Lookup_ApprFile.java`
  - `Apr01_Edit_RejectMessage` `client/vi/apr/Apr01_Edit_RejectMessage.java`
  - `Apr01_Edit_NoteMessage` `client/vi/apr/Apr01_Edit_NoteMessage.java`
  - `Apr01_Edit_ApprModi` `client/vi/apr/Apr01_Edit_ApprModi.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Adv02_Lookup_SelectMulti`](../../adv/components/Adv02_Lookup_SelectMulti.md), [`Apr01_Lookup_ApprFileList`](../../apr/components/Apr01_Lookup_ApprFileList.md), [`Apr05_Lookup_LoadDoc2`](../../apr/components/Apr05_Lookup_LoadDoc2.md), [`Apr10_Lookup_DocStamp`](../../apr/components/Apr10_Lookup_DocStamp.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md), [`Dcr01_Lookup_DcrClass`](../../dcr/components/Dcr01_Lookup_DcrClass.md), [`Dcr05_Lookup_FormView`](../../dcr/components/Dcr05_Lookup_FormView.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Fnd01_Lookup_SelectMulti`](../../fnd/components/Fnd01_Lookup_SelectMulti.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Icr01_Page_IcrFile`](../../icr/components/Icr01_Page_IcrFile.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Ics01_Move_IcsClass`](../../ics/components/Ics01_Move_IcsClass.md), [`Ics01_Page_IcsFile`](../../ics/components/Ics01_Page_IcsFile.md), [`Org01_Tree_OrgCode`](../../org/components/Org01_Tree_OrgCode.md), [`Pay06_Lookup_LinkContent`](../../pay/components/Pay06_Lookup_LinkContent.md), [`Sms03_Lookup_SendList`](../../sms/components/Sms03_Lookup_SendList.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys61_Lookup_DelList`](../../sys/components/Sys61_Lookup_DelList.md), [`Sys61_Lookup_FileList`](../../sys/components/Sys61_Lookup_FileList.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `adv.Adv02_Account.selectById` | Apr03_Page_Relate:473 | [`Adv02_Account.java:20`](../../adv/services/Adv02_Account.md) | [`adv02_account.selectById`](../../adv/sql/adv02_account.md) |
| `apr.Apr01_Appr.deleteByApprId` | Apr01_Edit_ApprDoc:1376 | [`Apr01_Appr.java:996`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`apr11_advert_book.deleteByApprId`](../../apr/sql/apr11_advert_book.md), [`opr01_create.updateApprIdByApprId`](../../opr/sql/opr01_create.md), [`pln02_plan.updateApprIdByApprId`](../../pln/sql/pln02_plan.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.deleteCheck`](../../sys/sql/sys10_file.md) |
| `apr.Apr01_Appr.getApprIdList` | Apr03_Page_Relate:548 | [`Apr01_Appr.java:109`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.getApprIdList`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.modelUpdate` | Apr01_Edit_ApprModi:333 | [`Apr01_Appr.java:1263`](../../apr/services/Apr01_Appr.md) | [`apr92_appr_modi.insert`](../../apr/sql/apr92_appr_modi.md), [`apr92_appr_modi.selectByPersonId`](../../apr/sql/apr92_appr_modi.md), [`apr92_appr_modi.updateReason`](../../apr/sql/apr92_appr_modi.md), `UpdateDataModel(apr01_appr)` 동적 INSERT/UPDATE → [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectByDcrGroup` | Apr01_Lookup_ApprList:164 | [`Apr01_Appr.java:985`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByDcrGroup`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectById` | Apr01_Edit_ApprDoc:534, Apr01_Edit_ApprDoc:627, Apr03_Page_Relate:1444 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectByWeek` | Apr01_Lookup_ApprList:161 | [`Apr01_Appr.java:974`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByWeek`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.update` | Apr01_Edit_ApprDoc:4832, Apr01_Edit_ApprDoc:4987 | [`Apr01_Appr.java:362`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.getDcrIdWord`](../../apr/sql/apr01_appr.md), [`apr01_appr.getStampSeq`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`apr11_advert_book.getAdvertSeq`](../../apr/sql/apr11_advert_book.md), [`apr11_advert_book.insertAdvertHistory`](../../apr/sql/apr11_advert_book.md), [`apr16_stamp_doc.updateByApprId`](../../apr/sql/apr16_stamp_doc.md), [`apr21_relate_appr.deleteByApprId`](../../apr/sql/apr21_relate_appr.md), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp60_sign.getSignId`](../../emp/sql/emp60_sign.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(apr01_appr)` 동적 INSERT/UPDATE → [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE → [`apr04_appr_step.selectById`](../../apr/sql/apr04_appr_step.md), `UpdateDataModel(apr03_relate_fund)` 동적 INSERT/UPDATE → [`apr03_relate_fund.selectById`](../../apr/sql/apr03_relate_fund.md), `UpdateDataModel(apr12_relate_adv)` 동적 INSERT/UPDATE → [`apr12_relate_adv.selectById`](../../apr/sql/apr12_relate_adv.md), `UpdateDataModel(apr21_relate_appr)` 동적 INSERT/UPDATE → [`apr21_relate_appr.selectById`](../../apr/sql/apr21_relate_appr.md), `UpdateDataModel(apr20_relate_ics)` 동적 INSERT/UPDATE → [`apr20_relate_ics.selectById`](../../apr/sql/apr20_relate_ics.md), `UpdateDataModel(apr22_relate_icr)` 동적 INSERT/UPDATE → [`apr22_relate_icr.selectById`](../../apr/sql/apr22_relate_icr.md), `UpdateDataModel(sys10_file)` 동적 INSERT/UPDATE → [`sys10_file.selectById`](../../sys/sql/sys10_file.md) |
| `apr.Apr01_ApprTemp.insert` | Apr01_Edit_ApprDoc:5440, Apr03_Page_Relate:1453 | [`Apr01_ApprTemp.java:38`](../../apr/services/Apr01_ApprTemp.md) | [`apr01_appr_temp.insert`](../../apr/sql/apr01_appr_temp.md), [`apr03_relate_fund.conflict`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md) |
| `apr.Apr03_RelateFund.delete` | Apr03_Page_Relate:1391 | [`Apr03_RelateFund.java:140`](../../apr/services/Apr03_RelateFund.md) | `UpdateDataModel(apr03_relate_fund)` 동적 DELETE |
| `apr.Apr03_RelateFund.insert` | Apr01_Lookup_RelateFund:192 | [`Apr03_RelateFund.java:118`](../../apr/services/Apr03_RelateFund.md) | [`apr03_relate_fund.deleteByAfterYn`](../../apr/sql/apr03_relate_fund.md), `UpdateDataModel(apr03_relate_fund)` 동적 INSERT/UPDATE → [`apr03_relate_fund.selectById`](../../apr/sql/apr03_relate_fund.md) |
| `apr.Apr03_RelateFund.selectByAfterYn` | Apr01_Lookup_RelateFund:178 | [`Apr03_RelateFund.java:109`](../../apr/services/Apr03_RelateFund.md) | [`apr03_relate_fund.selectByAfterYn`](../../apr/sql/apr03_relate_fund.md) |
| `apr.Apr03_RelateFund.selectByApprId` | Apr03_Page_Relate:1090 | [`Apr03_RelateFund.java:22`](../../apr/services/Apr03_RelateFund.md) | [`apr03_relate_fund.selectByApprId`](../../apr/sql/apr03_relate_fund.md) |
| `apr.Apr04_ApprStep.cancelCheck` | Apr01_Edit_ApprDoc:1206 | [`Apr04_ApprStep.java:1133`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.cancelCheck`](../../apr/sql/apr04_appr_step.md) |
| `apr.Apr04_ApprStep.cancelUpdate` | Apr01_Edit_ApprDoc:1263 | [`Apr04_ApprStep.java:1147`](../../apr/services/Apr04_ApprStep.md) | [`apr01_appr.cancelUpdate`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.cancelUpdate`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.selectByApprId`](../../apr/sql/apr04_appr_step.md) |
| `apr.Apr04_ApprStep.changeByApproval` | Apr01_Edit_ApprDoc:5587, Apr04_Edit_ApprStep:467, Apr04_Edit_RetouchApprStep:314 | [`Apr04_ApprStep.java:345`](../../apr/services/Apr04_ApprStep.md) | [`apr07_alt_appr.selectOneByEmpId`](../../apr/sql/apr07_alt_appr.md) |
| `apr.Apr04_ApprStep.checkApprId` | Apr16_Grid_StampDoc:254 | [`Apr04_ApprStep.java:2110`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.checkApprId`](../../apr/sql/apr04_appr_step.md) |
| `apr.Apr04_ApprStep.clearApprStepId` | Apr01_Edit_ApprDoc:789 | [`Apr04_ApprStep.java:960`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.clearApprStepId`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.lastCheck`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.nextCheck`](../../apr/sql/apr04_appr_step.md), [`apr07_alt_appr.selectOneByEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr10_stamp.selectByAlt`](../../apr/sql/apr10_stamp.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `apr.Apr04_ApprStep.confirmCheck` | Apr01_Edit_ApprDoc:1132 | [`Apr04_ApprStep.java:362`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.confirmCheck`](../../apr/sql/apr04_appr_step.md) |
| `apr.Apr04_ApprStep.confirmUpdate` | Apr01_Edit_ApprDoc:1150, Apr01_Edit_ApprDoc:1177 | [`Apr04_ApprStep.java:394`](../../apr/services/Apr04_ApprStep.md) | [`apr01_appr.confirmUpdate`](../../apr/sql/apr01_appr.md), [`apr01_appr.getStampSeq`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.confirmUpdate`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.lastCheck`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.lastStepList`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.lastStepOne`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.nextCheck`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.nextConfirmUpdate`](../../apr/sql/apr04_appr_step.md), [`apr04_appr_step.selectByApprId`](../../apr/sql/apr04_appr_step.md), [`apr07_alt_appr.selectOneByEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr10_stamp.selectByAlt`](../../apr/sql/apr10_stamp.md), [`apr11_advert_book.getAdvertSeq`](../../apr/sql/apr11_advert_book.md), [`apr11_advert_book.insertAdvertHistory`](../../apr/sql/apr11_advert_book.md), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `apr.Apr04_ApprStep.getApprStepList` | Apr01_Lookup_ApprList:209 | [`Apr04_ApprStep.java:2105`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.getApprStepList`](../../apr/sql/apr04_appr_step.md) |
| `apr.Apr04_ApprStep.nextTurnCheck` | Apr01_Edit_ApprDoc:753 | [`Apr04_ApprStep.java:378`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.nextTurnCheck`](../../apr/sql/apr04_appr_step.md) |
| `apr.Apr04_ApprStep.selectByApprId` | Apr03_Page_Relate:1157, Apr42_Lookup_Comment:153 | [`Apr04_ApprStep.java:69`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.selectByApprId`](../../apr/sql/apr04_appr_step.md), [`apr07_alt_appr.selectCountByEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr07_alt_appr.selectOneByEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr07_alt_appr.selectOneByOrgEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr10_stamp.selectByApprId`](../../apr/sql/apr10_stamp.md), [`emp00_trans_info.selectOneEmpInfo`](../../emp/sql/emp00_trans_info.md) |
| `apr.Apr04_ApprStep.selectByApprovalTypeCd` | Apr03_Page_Relate:1343 | [`Apr04_ApprStep.java:353`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.selectApprStepByType`](../../apr/sql/apr04_appr_step.md), [`apr07_alt_appr.selectCountByEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr07_alt_appr.selectOneByEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr07_alt_appr.selectOneByOrgEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr31_appr_step_group_member.selectByClassTreeId`](../../apr/sql/apr31_appr_step_group_member.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp00_trans_info.selectByComplianceOfficer`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByManagementOfficer`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByObseverOfficer`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByPersonId`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByRiskManager`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByRiskOfficer`](../../emp/sql/emp00_trans_info.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `apr.Apr04_ApprStep.selectByApprovalTypeCd02` | Apr03_Page_Relate:1371 | [`Apr04_ApprStep.java:358`](../../apr/services/Apr04_ApprStep.md) | [`apr04_appr_step.selectApprStepByType`](../../apr/sql/apr04_appr_step.md), [`apr07_alt_appr.selectCountByEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr07_alt_appr.selectOneByEmpId`](../../apr/sql/apr07_alt_appr.md), [`apr07_alt_appr.selectOneByOrgEmpId`](../../apr/sql/apr07_alt_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp00_trans_info.selectByObseverOfficer`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByPersonId`](../../emp/sql/emp00_trans_info.md) |
| `apr.Apr04_ApprStep.updateList` | Apr04_Edit_RetouchApprStep:231 | [`Apr04_ApprStep.java:2125`](../../apr/services/Apr04_ApprStep.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(apr04_appr_step)` 동적 DELETE, `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE → [`apr04_appr_step.selectById`](../../apr/sql/apr04_appr_step.md) |
| `apr.Apr10_Stamp.selectById` | Apr01_Edit_ApprDoc:4587 | [`Apr10_Stamp.java:23`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectById`](../../apr/sql/apr10_stamp.md) |
| `apr.Apr10_Stamp.selectByPDFId` | Apr01_Edit_ApprDoc:5406 | [`Apr10_Stamp.java:121`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectByPDFId`](../../apr/sql/apr10_stamp.md) |
| `apr.Apr12_RelateAdv.delete` | Apr03_Page_Relate:1416 | [`Apr12_RelateAdv.java:30`](../../apr/services/Apr12_RelateAdv.md) | `UpdateDataModel(apr12_relate_adv)` 동적 DELETE |
| `apr.Apr12_RelateAdv.selectByApprId` | Apr03_Page_Relate:1103 | [`Apr12_RelateAdv.java:17`](../../apr/services/Apr12_RelateAdv.md) | [`apr12_relate_adv.selectByApprId`](../../apr/sql/apr12_relate_adv.md) |
| `apr.Apr13_PersonAuth.delete` | Apr13_Lookup_PersonAuth:164 | [`Apr13_PersonAuth.java:33`](../../apr/services/Apr13_PersonAuth.md) | `UpdateDataModel(apr13_person_auth)` 동적 DELETE |
| `apr.Apr13_PersonAuth.selectByApprId` | Apr13_Lookup_PersonAuth:116 | [`Apr13_PersonAuth.java:22`](../../apr/services/Apr13_PersonAuth.md) | [`apr13_person_auth.selectByApprId`](../../apr/sql/apr13_person_auth.md) |
| `apr.Apr13_PersonAuth.update` | Apr13_Lookup_PersonAuth:161 | [`Apr13_PersonAuth.java:28`](../../apr/services/Apr13_PersonAuth.md) | `UpdateDataModel(apr13_person_auth)` 동적 INSERT/UPDATE → [`apr13_person_auth.selectById`](../../apr/sql/apr13_person_auth.md) |
| `apr.Apr15_ReprCorp.selectByCompanyId` | Apr15_Lookup_ReprCorp:156 | [`Apr15_ReprCorp.java:23`](../../apr/services/Apr15_ReprCorp.md) | [`apr15_repr_corp.selectByCompanyId`](../../apr/sql/apr15_repr_corp.md) |
| `apr.Apr16_StampDoc.delete` | Apr16_Grid_StampApplList:84 | [`Apr16_StampDoc.java:147`](../../apr/services/Apr16_StampDoc.md) | `UpdateDataModel(apr16_stamp_doc)` 동적 DELETE |
| `apr.Apr16_StampDoc.deleteByApprId` | Apr01_Edit_ApprDoc:1286 | [`Apr16_StampDoc.java:142`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.deleteByApprId`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.modelUpdate` | Apr16_Lookup_StampApplQty:168 | [`Apr16_StampDoc.java:107`](../../apr/services/Apr16_StampDoc.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr16_stamp_doc)` 동적 INSERT/UPDATE → [`apr16_stamp_doc.selectById`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.selectByApprId` | Apr01_Edit_ApprDoc:1274, Apr16_Grid_StampApplList:50 | [`Apr16_StampDoc.java:61`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectByApprId`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.selectProvideCoByApprId` | Apr16_Grid_StampDoc:234 | [`Apr16_StampDoc.java:66`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectProvideCoByApprId`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr20_RelateIcs.check` | Apr20_Lookup_RelateIcsList:205 | [`Apr20_RelateIcs.java:212`](../../apr/services/Apr20_RelateIcs.md) | [`apr20_relate_ics.selectByApprId`](../../apr/sql/apr20_relate_ics.md), [`bbs02_notice.insert`](../../bbs/sql/bbs02_notice.md), [`bbs03_target.insert`](../../bbs/sql/bbs03_target.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr20_relate_ics)` 동적 DELETE, `UpdateDataModel(apr20_relate_ics)` 동적 INSERT/UPDATE → [`apr20_relate_ics.selectById`](../../apr/sql/apr20_relate_ics.md) |
| `apr.Apr20_RelateIcs.delete` | Apr03_Page_Relate:1523, Apr20_Lookup_SelectIcs:161 | [`Apr20_RelateIcs.java:332`](../../apr/services/Apr20_RelateIcs.md) | `UpdateDataModel(apr20_relate_ics)` 동적 DELETE |
| `apr.Apr20_RelateIcs.deleteList` | Apr20_Lookup_RelateIcsList:223 | [`Apr20_RelateIcs.java:308`](../../apr/services/Apr20_RelateIcs.md) | [`sch04_list.codeUpdate`](../../sch/sql/sch04_list.md), [`sch04_list.selectByInfoId`](../../sch/sql/sch04_list.md), `UpdateDataModel(apr20_relate_ics)` 동적 DELETE |
| `apr.Apr20_RelateIcs.getCloseDate` | Apr20_Lookup_RelateIcs:356 | [`Apr20_RelateIcs.java:203`](../../apr/services/Apr20_RelateIcs.md) | [`apr20_relate_ics.getCloseDate`](../../apr/sql/apr20_relate_ics.md) |
| `apr.Apr20_RelateIcs.insertIcs` | Apr20_Lookup_SelectIcs:101 | [`Apr20_RelateIcs.java:149`](../../apr/services/Apr20_RelateIcs.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr20_relate_ics.insertIcs`](../../dcr/sql/dcr20_relate_ics.md) |
| `apr.Apr20_RelateIcs.insertToDoList` | Apr20_Lookup_SelectIcs:118 | [`Apr20_RelateIcs.java:87`](../../apr/services/Apr20_RelateIcs.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr20_relate_ics.selectByToDoList`](../../dcr/sql/dcr20_relate_ics.md) |
| `apr.Apr20_RelateIcs.selectByApprId` | Apr03_Page_Relate:1129, Apr20_Lookup_RelateIcsList:170 | [`Apr20_RelateIcs.java:32`](../../apr/services/Apr20_RelateIcs.md) | [`apr20_relate_ics.selectByApprId`](../../apr/sql/apr20_relate_ics.md) |
| `apr.Apr20_RelateIcs.selectByDcrClassTreeId` | Apr03_Page_Relate:1165 | [`Apr20_RelateIcs.java:44`](../../apr/services/Apr20_RelateIcs.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr20_relate_ics.selectByClassTreeId`](../../dcr/sql/dcr20_relate_ics.md) |
| `apr.Apr21_RelateAppr.insert` | Apr01_Lookup_RelateAppr:156 | [`Apr21_RelateAppr.java:31`](../../apr/services/Apr21_RelateAppr.md) | [`apr21_relate_appr.deleteByApprId`](../../apr/sql/apr21_relate_appr.md), `UpdateDataModel(apr21_relate_appr)` 동적 INSERT/UPDATE → [`apr21_relate_appr.selectById`](../../apr/sql/apr21_relate_appr.md) |
| `apr.Apr21_RelateAppr.selectByApprId` | Apr01_Lookup_RelateAppr:142, Apr03_Page_Relate:1116 | [`Apr21_RelateAppr.java:23`](../../apr/services/Apr21_RelateAppr.md) | [`apr21_relate_appr.selectByApprId`](../../apr/sql/apr21_relate_appr.md) |
| `apr.Apr22_RelateIcr.check` | Apr22_Lookup_RelateIcrList:205 | [`Apr22_RelateIcr.java:206`](../../apr/services/Apr22_RelateIcr.md) | [`apr22_relate_icr.selectByApprId`](../../apr/sql/apr22_relate_icr.md), [`bbs02_notice.insert`](../../bbs/sql/bbs02_notice.md), [`bbs03_target.insert`](../../bbs/sql/bbs03_target.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr22_relate_icr)` 동적 DELETE, `UpdateDataModel(apr22_relate_icr)` 동적 INSERT/UPDATE → [`apr22_relate_icr.selectById`](../../apr/sql/apr22_relate_icr.md) |
| `apr.Apr22_RelateIcr.delete` | Apr03_Page_Relate:1571, Apr22_Lookup_SelectIcr:161 | [`Apr22_RelateIcr.java:326`](../../apr/services/Apr22_RelateIcr.md) | `UpdateDataModel(apr22_relate_icr)` 동적 DELETE |
| `apr.Apr22_RelateIcr.deleteList` | Apr22_Lookup_RelateIcrList:220 | [`Apr22_RelateIcr.java:302`](../../apr/services/Apr22_RelateIcr.md) | [`sch04_list.codeUpdate`](../../sch/sql/sch04_list.md), [`sch04_list.selectByInfoId`](../../sch/sql/sch04_list.md), `UpdateDataModel(apr22_relate_icr)` 동적 DELETE |
| `apr.Apr22_RelateIcr.getCloseDate` | Apr22_Lookup_RelateIcr:331 | [`Apr22_RelateIcr.java:197`](../../apr/services/Apr22_RelateIcr.md) | [`apr22_relate_icr.getCloseDate`](../../apr/sql/apr22_relate_icr.md) |
| `apr.Apr22_RelateIcr.insertIcr` | Apr22_Lookup_SelectIcr:101 | [`Apr22_RelateIcr.java:143`](../../apr/services/Apr22_RelateIcr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr21_relate_icr.insertIcr`](../../dcr/sql/dcr21_relate_icr.md) |
| `apr.Apr22_RelateIcr.insertToDoList` | Apr22_Lookup_SelectIcr:118 | [`Apr22_RelateIcr.java:81`](../../apr/services/Apr22_RelateIcr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr21_relate_icr.selectByToDoList`](../../dcr/sql/dcr21_relate_icr.md) |
| `apr.Apr22_RelateIcr.selectByApprId` | Apr03_Page_Relate:1142, Apr22_Lookup_RelateIcrList:170 | [`Apr22_RelateIcr.java:32`](../../apr/services/Apr22_RelateIcr.md) | [`apr22_relate_icr.selectByApprId`](../../apr/sql/apr22_relate_icr.md) |
| `apr.Apr22_RelateIcr.selectByDcrClassTreeId` | Apr03_Page_Relate:1182 | [`Apr22_RelateIcr.java:44`](../../apr/services/Apr22_RelateIcr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr21_relate_icr.selectByClassTreeId`](../../dcr/sql/dcr21_relate_icr.md) |
| `apr.Apr41_OpenHistory.insert` | Apr01_Edit_ApprDoc:581 | [`Apr41_OpenHistory.java:33`](../../apr/services/Apr41_OpenHistory.md) | [`apr41_open_history.insert`](../../apr/sql/apr41_open_history.md) |
| `apr.Apr41_OpenHistory.selectByApprIdPaging` | Apr41_Lookup_OpenHistory:65 | [`Apr41_OpenHistory.java:27`](../../apr/services/Apr41_OpenHistory.md) | [`apr41_open_history.selectByApprIdPaging`](../../apr/sql/apr41_open_history.md), [`apr41_open_history.selectByApprIdTotal`](../../apr/sql/apr41_open_history.md) |
| `apr.Apr42_Comment.delete` | Apr42_Lookup_Comment:263 | [`Apr42_Comment.java:84`](../../apr/services/Apr42_Comment.md) | `UpdateDataModel(apr42_comment)` 동적 DELETE |
| `apr.Apr42_Comment.getSize` | Apr01_Edit_ApprDoc:5735, Apr42_Lookup_Comment:224 | [`Apr42_Comment.java:39`](../../apr/services/Apr42_Comment.md) | [`apr42_comment.getSize`](../../apr/sql/apr42_comment.md) |
| `apr.Apr42_Comment.modelUpdate` | Apr42_Lookup_Comment:240 | [`Apr42_Comment.java:50`](../../apr/services/Apr42_Comment.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr42_comment)` 동적 INSERT/UPDATE → [`apr42_comment.selectById`](../../apr/sql/apr42_comment.md) |
| `apr.Apr42_Comment.selectByApprId` | Apr42_Lookup_Comment:214 | [`Apr42_Comment.java:27`](../../apr/services/Apr42_Comment.md) | [`apr42_comment.selectByApprId`](../../apr/sql/apr42_comment.md) |
| `apr.Apr50_Bookmark.delete` | Apr50_Lookup_PersonList:349 | [`Apr50_Bookmark.java:91`](../../apr/services/Apr50_Bookmark.md) | `UpdateDataModel(apr50_bookmark)` 동적 DELETE |
| `apr.Apr50_Bookmark.deleteByApprId` | Apr50_Lookup_PersonList:214 | [`Apr50_Bookmark.java:60`](../../apr/services/Apr50_Bookmark.md) | [`apr50_bookmark.deleteByApprId`](../../apr/sql/apr50_bookmark.md) |
| `apr.Apr50_Bookmark.insert` | Apr50_Lookup_PersonList:298 | [`Apr50_Bookmark.java:69`](../../apr/services/Apr50_Bookmark.md) | [`apr50_bookmark.insert`](../../apr/sql/apr50_bookmark.md), [`apr50_bookmark.insertCheck`](../../apr/sql/apr50_bookmark.md), [`apr50_bookmark.updatePublicYn`](../../apr/sql/apr50_bookmark.md) |
| `apr.Apr50_Bookmark.selectByApprId` | Apr50_Lookup_PersonList:274 | [`Apr50_Bookmark.java:40`](../../apr/services/Apr50_Bookmark.md) | [`apr50_bookmark.selectByApprId`](../../apr/sql/apr50_bookmark.md) |
| `apr.Apr50_Bookmark.selectByPublicYn` | Apr01_Edit_ApprDoc:561 | [`Apr50_Bookmark.java:49`](../../apr/services/Apr50_Bookmark.md) | [`apr50_bookmark.selectByPublicYn`](../../apr/sql/apr50_bookmark.md) |
| `apr.Apr50_Bookmark.update` | Apr50_Lookup_PersonList:314 | [`Apr50_Bookmark.java:86`](../../apr/services/Apr50_Bookmark.md) | `UpdateDataModel(apr50_bookmark)` 동적 INSERT/UPDATE → [`apr50_bookmark.selectById`](../../apr/sql/apr50_bookmark.md) |
| `apr.Apr90_DisposalList.checkDisposal` | Apr01_Edit_ApprDoc:4113 | [`Apr90_DisposalList.java:53`](../../apr/services/Apr90_DisposalList.md) | [`apr90_disposal_list.checkDisposal`](../../apr/sql/apr90_disposal_list.md), [`com01_relate_appr.checkUseRelateApprId`](../../com/sql/com01_relate_appr.md), [`pay50_expense.selectByExpenseApprId`](../../pay/sql/pay50_expense.md) |
| `apr.Apr90_DisposalList.modelUpdate` | Apr90_Lookup_DisposalList:136 | [`Apr90_DisposalList.java:123`](../../apr/services/Apr90_DisposalList.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr91_disposal_history.insert`](../../apr/sql/apr91_disposal_history.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(apr90_disposal_list)` 동적 INSERT/UPDATE → [`apr90_disposal_list.selectById`](../../apr/sql/apr90_disposal_list.md) |
| `apr.Apr92_ApprModi.deleteByApprId` | Apr01_Edit_ApprDoc:1250 | [`Apr92_ApprModi.java:55`](../../apr/services/Apr92_ApprModi.md) | [`apr92_appr_modi.deleteByApprId`](../../apr/sql/apr92_appr_modi.md) |
| `apr.Apr92_ApprModi.selectByPersonId` | Apr01_Edit_ApprModi:169, Apr03_Page_Relate:1635 | [`Apr92_ApprModi.java:23`](../../apr/services/Apr92_ApprModi.md) | [`apr92_appr_modi.selectByPersonId`](../../apr/sql/apr92_appr_modi.md) |
| `ast.Ast21_Tr4Insure.selectExpenseAppr` | Apr01_Edit_ApprDoc:2297 | [`Ast21_Tr4Insure.java:23`](../../ast/services/Ast21_Tr4Insure.md) | [`ast21_tr_4insure.selectExpenseAppr`](../../ast/sql/ast21_tr_4insure.md) |
| `att.Att03_OvertimeReq.selectApprStepByType` | Apr90_Lookup_ConfirmEmp:114 | [`Att03_OvertimeReq.java:88`](../../att/services/Att03_OvertimeReq.md) | [`apr04_appr_step.selectApprStepByType`](../../apr/sql/apr04_appr_step.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md) |
| `biz.Biz01_Promo.getHtmlData` | Apr01_Edit_ApprDoc:3117 | [`Biz01_Promo.java:177`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.getHtmlData`](../../biz/sql/biz01_promo.md) |
| `biz.Biz05_RelateAppr.selectByPromoIdList` | Apr03_Page_Relate:590 | [`Biz05_RelateAppr.java:33`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectByPromoIdList`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz20_FeeCharge.getHtmlContent` | Apr01_Edit_ApprDoc:2012 | [`Biz20_FeeCharge.java:783`](../../biz/services/Biz20_FeeCharge.md) | [`biz20_fee_charge.getHtmlContent`](../../biz/sql/biz20_fee_charge.md) |
| `biz.Biz52_ErpFee.selectByStartDate` | Apr01_Edit_ApprDoc:3489 | [`Biz52_ErpFee.java:32`](../../biz/services/Biz52_ErpFee.md) | [`biz52_erp_fee.selectByStartDate`](../../biz/sql/biz52_erp_fee.md) |
| `com.Com01_RelateAppr.selectByExpenseIdList` | Apr03_Page_Relate:662 | [`Com01_RelateAppr.java:31`](../../com/services/Com01_RelateAppr.md) | [`com01_relate_appr.selectByExpenseIdList`](../../com/sql/com01_relate_appr.md) |
| `com.Com10_FormMapping.selectByLinkCode` | Apr01_Edit_ApprDoc:1606, Apr01_Edit_ApprDoc:1646, Apr01_Edit_ApprDoc:1701, Apr01_Edit_ApprDoc:2131, Apr01_Edit_ApprDoc:2180, Apr01_Edit_ApprDoc:2426, Apr01_Edit_ApprDoc:2459, Apr01_Edit_ApprDoc:2492, Apr01_Edit_ApprDoc:2523, Apr01_Edit_ApprDoc:2554, Apr01_Edit_ApprDoc:2592, Apr01_Edit_ApprDoc:2620 | [`Com10_FormMapping.java:35`](../../com/services/Com10_FormMapping.md) | [`com10_form_mapping.selectByLinkCode`](../../com/sql/com10_form_mapping.md) |
| `com.Com11_FormMappingMulti.selectByDetailCode` | Apr01_Edit_ApprDoc:2211, Apr01_Edit_ApprDoc:2243 | [`Com11_FormMappingMulti.java:46`](../../com/services/Com11_FormMappingMulti.md) | [`com11_form_mapping_multi.selectByDetailCode`](../../com/sql/com11_form_mapping_multi.md) |
| `dcr.Dcr00_DocList.selectByText` | Apr21_Lookup_RelateAppr:214 | [`Dcr00_DocList.java:123`](../../dcr/services/Dcr00_DocList.md) | [`dcr00_doc_list.selectByText`](../../dcr/sql/dcr00_doc_list.md) |
| `dcr.Dcr05_DocType.selectByDefaultClassTreeId` | Apr01_Edit_ApprDoc:1400, Apr01_Edit_ApprDoc:1429, Apr01_Edit_ApprDoc:1496, Apr01_Edit_ApprDoc:2900, Apr01_Edit_ApprDoc:3920, Apr01_Edit_ApprDoc:4013, Apr01_Edit_ApprDoc:4035 | [`Dcr05_DocType.java:87`](../../dcr/services/Dcr05_DocType.md) | [`dcr05_doc_type.selectByDefaultClassTreeId`](../../dcr/sql/dcr05_doc_type.md) |
| `dcr.Dcr30_Link.selectByClassTreeId` | Apr01_Edit_ApprDoc:5463 | [`Dcr30_Link.java:67`](../../dcr/services/Dcr30_Link.md) | [`dcr30_link.selectByClassTreeId`](../../dcr/sql/dcr30_link.md) |
| `emp.Emp00_TransInfo.getOrgCodeId` | Apr04_Edit_ApprStep:670 | [`Emp00_TransInfo.java:379`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.getOrgCodeId`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.getPersonId` | Apr04_Edit_ApprStep:607 | [`Emp00_TransInfo.java:367`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.getPersonId`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.getTransDate` | Apr04_Edit_ApprStep:630 | [`Emp00_TransInfo.java:356`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.getTransDate`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByComplianceOfficer` | Apr01_Edit_ApprDoc:5277 | [`Emp00_TransInfo.java:150`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByComplianceOfficer`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByManagementOfficer` | Apr01_Edit_ApprDoc:5229 | [`Emp00_TransInfo.java:183`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByManagementOfficer`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByObseverOfficer` | Apr01_Edit_ApprDoc:5180, Apr04_Edit_ApprStep:568 | [`Emp00_TransInfo.java:132`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByObseverOfficer`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByOrgCodeId` | Apr04_Edit_ApprStep:128, Apr04_Edit_RetouchApprStep:88 | [`Emp00_TransInfo.java:110`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByOrgCodeId`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByRiskManager` | Apr01_Edit_ApprDoc:5205 | **(없음)** | - |
| `emp.Emp00_TransInfo.selectByRiskOfficer` | Apr01_Edit_ApprDoc:5253 | [`Emp00_TransInfo.java:167`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByRiskOfficer`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByStampEmpId` | Apr01_Edit_ApprDoc:5140 | [`Emp00_TransInfo.java:249`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByStampEmpId`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByText` | Apr04_Edit_ApprStep:403 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectOneEmpInfo` | Apr01_Edit_ApprDoc:5599 | [`Emp00_TransInfo.java:237`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectOneEmpInfo`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp03_Trans.selectByDate` | Apr01_Edit_ApprDoc:1803 | [`Emp03_Trans.java:113`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByDate`](../../emp/sql/emp03_trans.md) |
| `emp.Emp21_UnLeave.getHtmlContent02_1` | Apr01_Edit_ApprDoc:1931 | [`Emp21_UnLeave.java:603`](../../emp/services/Emp21_UnLeave.md) | - |
| `emp.Emp21_UnLeave.getHtmlContent02_2` | Apr01_Edit_ApprDoc:1950 | [`Emp21_UnLeave.java:609`](../../emp/services/Emp21_UnLeave.md) | - |
| `emp.Emp23_EtcLeavePerson.selectByEtcLeaveId` | Apr01_Edit_ApprDoc:2046 | [`Emp23_EtcLeavePerson.java:37`](../../emp/services/Emp23_EtcLeavePerson.md) | [`emp23_etc_leave_person.selectByEtcLeaveId`](../../emp/sql/emp23_etc_leave_person.md) |
| `flt.Flt01_CompanyStd.selectByDate` | Apr01_Edit_ApprDoc:3037, Apr01_Edit_ApprDoc:3074 | [`Flt01_CompanyStd.java:36`](../../flt/services/Flt01_CompanyStd.md) | [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md) |
| `fnd.Fnd00_Fund.selectById` | Apr03_Page_Relate:445 | [`Fnd00_Fund.java:20`](../../fnd/services/Fnd00_Fund.md) | [`fnd00_fund.selectById`](../../fnd/sql/fnd00_fund.md) |
| `fnd.Fnd31_OprFund.selectByDistinctOprId` | Apr01_Edit_ApprDoc:2779, Apr01_Edit_ApprDoc:2801 | [`Fnd31_OprFund.java:32`](../../fnd/services/Fnd31_OprFund.md) | [`fnd31_opr_fund.selectByDistinctOprId`](../../fnd/sql/fnd31_opr_fund.md) |
| `fnd.Fnd31_OprFund.selectByOprId` | Apr01_Edit_ApprDoc:2077, Apr01_Edit_ApprDoc:2647, Apr01_Edit_ApprDoc:2691 | [`Fnd31_OprFund.java:25`](../../fnd/services/Fnd31_OprFund.md) | [`fnd31_opr_fund.selectByOprId`](../../fnd/sql/fnd31_opr_fund.md) |
| `org.Org10_RoleStamp.checkRole` | Apr01_Edit_ApprDoc:4554 | [`Org10_RoleStamp.java:31`](../../org/services/Org10_RoleStamp.md) | [`apr10_stamp.checkCloseDate`](../../apr/sql/apr10_stamp.md), [`org10_role_stamp.checkRole`](../../org/sql/org10_role_stamp.md) |
| `pay.Pay06_ActMapping.selectByLinkCode` | Apr01_Edit_ApprDoc:1814 | [`Pay06_ActMapping.java:51`](../../pay/services/Pay06_ActMapping.md) | [`pay06_act_mapping.selectByLinkCode`](../../pay/sql/pay06_act_mapping.md) |
| `pay.Pay10_Month.getHtmlData10` | Apr01_Edit_ApprDoc:1734, Apr01_Edit_ApprDoc:1745 | [`Pay10_Month.java:177`](../../pay/services/Pay10_Month.md) | [`pay10_month.getHtmlData10`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.selectByRetirePayCode` | Apr01_Edit_ApprDoc:1873, Apr01_Edit_ApprDoc:1878 | [`Pay10_Month.java:121`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByRetirePayCode`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.selectBypayCode` | Apr01_Edit_ApprDoc:1740 | [`Pay10_Month.java:195`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectBypayCode`](../../pay/sql/pay10_month.md) |
| `pay.Pay50_Expense.selectByExpenseApprIdList` | Apr03_Page_Relate:705 | [`Pay50_Expense.java:58`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectByExpenseApprIdList`](../../pay/sql/pay50_expense.md) |
| `sys.Sys01_Company.selectById` | Apr01_Edit_ApprDoc:2585, Apr04_Edit_ApprStep:307 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.checkFileStatus` | Apr01_Grid_ApprFile:307, Apr01_Grid_ApprFile:365, Apr01_Grid_ApprFile:423, Apr01_Grid_ApprFile:508, Apr01_Grid_ApprFile:576, Apr01_Grid_ApprFile:645 | [`Sys10_File.java:591`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.copyFile` | Apr01_Grid_ApprFile:186 | [`Sys10_File.java:417`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys10_File.copyFileAdminYn` | Apr01_Grid_ApprFile:216 | [`Sys10_File.java:436`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.selectByAdminYn`](../../sys/sql/sys10_file.md), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys10_File.copyPfResultReportFile` | Apr01_Grid_ApprFile:244 | **(없음)** | - |
| `sys.Sys10_File.copySetFileName` | Apr01_Grid_ApprFile:273 | [`Sys10_File.java:502`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.fileReName` | Apr01_Grid_ApprFile:323 | [`Sys10_File.java:557`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.getServerPath` | Apr01_Grid_ApprFile:299, Apr01_Grid_ApprFile:357, Apr01_Grid_ApprFile:415, Apr01_Grid_ApprFile:496, Apr01_Grid_ApprFile:564, Apr01_Grid_ApprFile:633 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.selectByFileYn` | Apr01_Lookup_ApprFile:187 | [`Sys10_File.java:246`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByFileYn`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByParentId` | Apr01_Grid_ApprFile:120, Apr42_Lookup_FileList:213 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.update` | Apr01_Edit_ApprDoc:4297, Apr01_Lookup_ApprFile:266 | [`Sys10_File.java:363`](../../sys/services/Sys10_File.md) | `UpdateDataModel(sys10_file)` 동적 INSERT/UPDATE → [`sys10_file.selectById`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.updateRelateApprId` | Apr01_Grid_ApprFile:157 | [`Sys10_File.java:205`](../../sys/services/Sys10_File.md) | [`sys10_file.updateRelateApprId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Apr01_Grid_ApprFile:744, Apr01_Lookup_ApprFile:240, Apr42_Lookup_FileList:224 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys99_Print.getHtmlContent` | Apr01_Edit_ApprDoc:1983 | [`Sys99_Print.java:111`](../../sys/services/Sys99_Print.md) | [`sys99_print.selectByDepositIoList`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm30_RoleAllc.selectByAllcStdDate` | Apr01_Edit_ApprDoc:2369 | [`Tdm30_RoleAllc.java:45`](../../tdm/services/Tdm30_RoleAllc.md) | [`tdm30_role_allc.selectByAllcStdDate`](../../tdm/sql/tdm30_role_allc.md) |
| `tdm.Tdm30_RoleAllc.selectByPersonId` | Apr01_Edit_ApprDoc:2339 | [`Tdm30_RoleAllc.java:35`](../../tdm/services/Tdm30_RoleAllc.md) | [`tdm30_role_allc.selectByPersonId`](../../tdm/sql/tdm30_role_allc.md) |
| `tdm.Tdm51_ChckOrg.selectApprContent` | Apr01_Edit_ApprDoc:3600 | [`Tdm51_ChckOrg.java:46`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm51_chck_org.selectApprContent`](../../tdm/sql/tdm51_chck_org.md) |
| `utils.excel.ExcelCreate.createCardExcel` | Apr01_Edit_ApprDoc:3705 | [`ExcelCreate.java:37`](../../utils/services/excel.ExcelCreate.md) | - |
| `utils.excel.ExcelCreate.createCardExcel2` | Apr01_Edit_ApprDoc:2818 | [`ExcelCreate.java:48`](../../utils/services/excel.ExcelCreate.md) | - |
| `utils.excel.ExcelCreate.createTotalFeeExcel` | Apr01_Edit_ApprDoc:2756 | [`ExcelCreate.java:27`](../../utils/services/excel.ExcelCreate.md) | - |
| `utils.pdf.PDFCreate.createPDF7` | Apr01_Edit_ApprDoc:5302, Apr01_Edit_ApprDoc:5417 | [`PDFCreate.java:38`](../../utils/services/pdf.PDFCreate.md) | - |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr01_appr_temp`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr11_advert_book`](../../../db/tables/apr.md), [`apr12_relate_adv`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr14_relate_ast`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), `apr20_relate_icr` ⚠DB없음, [`apr20_relate_ics`](../../../db/tables/apr.md), [`apr21_relate_appr`](../../../db/tables/apr.md), [`apr22_relate_icr`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`apr31_appr_step_group_member`](../../../db/tables/apr.md), [`apr41_open_history`](../../../db/tables/apr.md), [`apr42_comment`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md), [`apr90_disposal_list`](../../../db/tables/apr.md), [`apr91_disposal_history`](../../../db/tables/apr.md), [`apr92_appr_modi`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`bbs02_notice`](../../../db/tables/bbs.md), [`bbs03_target`](../../../db/tables/bbs.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md), [`biz29_account`](../../../db/tables/biz.md), [`biz52_erp_fee`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`com10_form_mapping`](../../../db/tables/com.md), [`com11_form_mapping_multi`](../../../db/tables/com.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md), [`emp60_sign`](../../../db/tables/emp.md), [`emp92_sms_notice`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`fnd00_fund`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`fnd31_opr_fund`](../../../db/tables/fnd.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`opr01_create`](../../../db/tables/opr.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`org10_role_stamp`](../../../db/tables/org.md), [`pay06_act_mapping`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay50_expense`](../../../db/tables/pay.md), [`pln02_plan`](../../../db/tables/pln.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), `sch05_relate_icr` ⚠DB없음, [`sch05_relate_ics`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys52_specific_menu_link`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md)

## DB 함수

`f_add_day`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_code_seq`, `f_create_seq`, `f_emp_kor_nm`, `f_get_crdmanagerid`, `f_get_dcr_no`, `f_get_deadline_nm`, `f_get_emptrans`, `f_get_fund_nm2`, `f_get_std_date`, `f_icr_class_tree_nm_allpath`, `f_ics_class_tree_nm_allpath`, `f_max_workdate`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_org_seq`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc`, `gettdm30roleallc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Edit_ApprDoc (`client/vi/apr/Apr01_Edit_ApprDoc.java`, 5790줄)

- 레이아웃: north=cp01, center=cp02, south=line
- 툴바 `headerBar`: {historyButton} {commentButton}
- 툴바 `bar`: {copyButton} {formButton}
- 입력·하위 화면: `relateList` Apr03_Page_Relate, `radioInType` Radio, `radioOutType` Radio, `title` TextField, `content` TextField, `statusCode` TextField, `regEmpInfo` TextField, `receiveName` TextField, `referenceName` TextField, `inOutTypeCode` TextField, `classTreeNameAllPath` TextField 빈칸="자동입력", `formType` TextField, `linkCode` TextField, `signCompany` TextField 빈칸="대외문서 하단표기", `signCeo` TextField 빈칸="대외문서 하단표기", `apprId` LongField, `stampId` LongField, `regEmpId` LongField, `stampFileId` LongField, `note` MyTextArea, `effectDate` MyDateField, `regDate` MyDateField, `stampName` LookupTriggerField, `stampPosition` TextField, `stampPositionName` ComboBoxField("StampLocation"), `lookup` Apr41_Lookup_OpenHistory, `noteMessage` Apr01_Edit_NoteMessage, `rejectMessage` Apr01_Edit_RejectMessage, `lookupApprFile` Apr01_Lookup_ApprFile, `lookupRelateAppr` Apr01_Lookup_RelateAppr, `lookupRelateFund` Apr01_Lookup_RelateFund, `lookupPersonAuth` Apr13_Lookup_PersonAuth, `lookupIcsList` Apr20_Lookup_RelateIcsList, `lookupIcrList` Apr22_Lookup_RelateIcrList, `lookup1` Apr20_Lookup_SelectIcs, `lookup2` Apr22_Lookup_SelectIcr, `popup` Apr20_Lookup_SelectIcs, `lookupStamp` Apr10_Lookup_DocStamp, `editor` Apr05_Lookup_LoadDoc2

#### 이벤트
[E0] 화면 열림 (생성자 L337-505) → getCommentSize(), getApprovalForm01(), getApprovalForm02(), getHtmlForm()
[E1] historyButton[열람기록].Select (L346) → 인라인 L346-352 (new SelectHandler(){ @Override public…)
[E2] commentButton[댓글].Select (L353) → getCommentSize()
[E3] header.Dom (L378) → 인라인 L378-383 (new ClickHandler() { @Override public…)
[E4] pdfButton[미리보기].Select [YES] (L459) → makePreviewPDF()
[E5] msgBox.DialogHide [YES] (L466) → makePreviewPDF()
[E6] bookMarkAnchor.MouseDown (L491) → getApprBookmark()
[E7] cancelApprovalButton[승인취소].Select [YES] (L730) → getServiceResult(), cancleApprStep()
[E8] msgBox.DialogHide [YES] (L733) → getServiceResult(), cancleApprStep()
[E9] confirmButton[승인].Select (L1097) → confirmCheck()
[E10] rejectButton[반려].Select (L1103) → confirmCheck()
[E11] closeButton[닫기].Select [callback != null] (L1119) → hide()
[E12] msgBox.DialogHide [YES] (L1226) → deleteChk01()
[E13] cancelButton[상신취소].Select (L4062) → cancelCheck01()
[E14] deleteButton[삭제].Select (L4072) → deleteChk01()
[E15] makeFileAddButton[결재완료후 첨부파일등록].Select (L4083) → fileAdd()
[E16] makeApprAddButton[연관문서설정].Select (L4090) → apprAdd()
[E17] makeFundAddButton[연관펀드설정].Select (L4097) → fundAdd()
[E18] makeDisposalListButton[문서폐기 신청].Select [result.getStatus() == -1] (L4110) → getServiceResult()
[E19] makePersonAuthAddButton[공람설정].Select (L4141) → personAuthAdd()
[E20] makeIcsEditButton[연관법규 추가/수정/삭제].Select (L4152) → icsEdit()
[E21] makeTypoButton[오타수정].Select (L4230) → setHtmlText()
[E22] fileUpload.Change (L4260) → 인라인 L4260-4267 (new ChangeHandler() { @Override publi…)
[E23] fileUploadForm.SubmitComplete [result != null] (L4270) → resetFileUpload()
[E24] updateButton[결재요청].Select [선택>0] (L4293) → getServiceResult(), apprStepLockChk01()
       └ [E28] msgBox.DialogHide [YES] (L4377) → beforePDFChk()
[E25] saveButton[저장].Select (L4312) → save()
[E26] closeButton[닫기].Select [callback != null] (L4326) → hide()
[E27] msgBox.DialogHide [YES] (L4351) → 인라인 L4351-4364 (YES: next.run();, NO: break;)
[E29] toggleInOutType.ValueChange (L4622) → 인라인 L4622-4634 (new ValueChangeHandler<HasValue<Boole…)
[E30] copyButton[불러오기].Select (L4640) → loadDoc()
[E31] formButton[양식].Select (L4646) → loadForm()
[E32] stampName[인감종류].TriggerClick (L4687) → findLookupStamp()
[E33] fileUpload.Change (L5718) → 인라인 L5718-5725 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieveApproval() | L508-512 | getApprModel,retrieveAltApproval | 상태 처리 | 업무 |
| public retrieveApproval() | L515-523 | getApprModel,retrieveAltApproval | 상태 처리 | 업무 |
| public retrieveLinkApproval() | L526-531 | 공개 메서드 | 상태 처리 | 업무 |
| private getApprModel() | L533-558 | retrieveApproval,retrieveLinkApproval | 서비스 apr.Apr01_Appr.selectById(apprId) | 업무 |
| private getApprBookmark() | L560-578 | E6,getApprModel | 서비스 apr.Apr50_Bookmark.selectByPublicYn(companyId, personId, apprId, publicYn) | 업무 |
| private insertHistory() | L580-594 | getApprModel | 서비스 apr.Apr41_OpenHistory.insert(companyId, personId, apprId, loginMode) | 업무 |
| public getApprDelModel() | L596-623 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveAltApproval() | L626-637 | 미사용 후보 | 서비스 apr.Apr01_Appr.selectById(apprId) | 업무 |
| private retrieveApproval() | L641-726 | getApprModel,retrieveAltApproval | 상태 처리 | 업무 |
| private makeCancelApprovalButton() | L728-786 | retrieveApproval | 확인창 표시, 서비스 apr.Apr04_ApprStep.nextTurnCheck(personId, companyId, apprId, stepTypeCode, seq) | 업무 |
| private cancleApprStep() | L788-811 | E7,E8 | 서비스 apr.Apr04_ApprStep.clearApprStepId(apprId, apprStepId, classTreeName, titleName, name, companyId, personId) | 업무 |
| private setReadOnly() | L813-822 | retrieveApproval | 상태 처리 | 업무 |
| private getAppr() | L824-834 | getApprModel,getApprDelModel | 상태 처리 | 업무 |
| private fileDownloadCheck() | L837-854 | myTurnCheck | 상태 처리 | 업무 |
| private myCancelApprovalCheck() | L857-1028 | retrieveApproval | 상태 처리 | 업무 |
| private myTurnCheck() | L1030-1129 | retrieveApproval | 상태 처리 | 업무 |
| private confirmCheck() | L1131-1197 | E9,E10 | 팝업 Apr01_Edit_NoteMessage 열기, 팝업 Apr01_Edit_RejectMessage 열기, 서비스 apr.Apr04_ApprStep.confirmCheck, apr.Apr04_ApprStep.confirmUpdate, apr.Apr04_ApprStep.confirmUpdate(personId, companyId, apprId, stepTypeCode, seq, personId, apprId, baseDate, apprEmpId, stepEmpId, noteMessage, apprStatusCode, advertYn, companyId, stampId, stepTypeCode, seq, personId, apprId, apprEmpId, stepEmpId, rejectMessage, apprStatusCode, companyId, stepTypeCode, seq) | 업무 |
| private confirm() | L1199-1203 | confirmCheck | 상태 처리 | 업무 |
| private cancelCheck01() | L1205-1220 | E13 | 서비스 apr.Apr04_ApprStep.cancelCheck(apprId) | 업무 |
| private cancelCheck02() | L1222-1245 | cancelCheck01 | 확인창 표시 | 업무 |
| private cancel() | L1247-1260 | cancelCheck02 | 서비스 apr.Apr92_ApprModi.deleteByApprId(apprId) | 업무 |
| private cancel2() | L1262-1271 | cancel | 서비스 apr.Apr04_ApprStep.cancelUpdate(apprId, baseDate, apprEmpId, companyId) | 업무 |
| private deleteChk01() | L1273-1298 | E12,E14 | 서비스 apr.Apr16_StampDoc.selectByApprId, apr.Apr16_StampDoc.deleteByApprId(apprId, regCheckYn, apprId) | 업무 |
| private fileAdd() | L1320-1328 | E15 | 조회창 Apr01_Lookup_ApprFile 열기 | 업무 |
| private apprAdd() | L1330-1338 | E16 | 조회창 Apr01_Lookup_RelateAppr 열기 | 업무 |
| private fundAdd() | L1340-1348 | E17 | 조회창 Apr01_Lookup_RelateFund 열기 | 업무 |
| private personAuthAdd() | L1350-1353 | E19 | 조회창 Apr13_Lookup_PersonAuth 열기 | 업무 |
| private icsEdit() | L1355-1363 | E20 | 조회창 Apr20_Lookup_RelateIcsList 열기 | 업무 |
| private icrEdit() | L1365-1373 | 미사용 후보 | 조회창 Apr22_Lookup_RelateIcrList 열기 | 업무 |
| private delete() | L1375-1382 | deleteChk01 | 서비스 apr.Apr01_Appr.deleteByApprId | 업무 |
| public insertApproval() | L1384-1388 | insertWriteApproval | 상태 처리 | 업무 |
| public insertApproval() | L1390-1420 | insertWriteApproval | 서비스 dcr.Dcr05_DocType.selectByDefaultClassTreeId(companyId, classTreeId, defaultYn) | 업무 |
| public insertWriteApproval() | L1422-1487 | 공개 메서드 | 서비스 dcr.Dcr05_DocType.selectByDefaultClassTreeId(companyId, classTreeId, defaultYn) | 업무 |
| public insertApproval() | L1489-1519 | insertWriteApproval | 서비스 dcr.Dcr05_DocType.selectByDefaultClassTreeId(companyId, classTreeId, defaultYn) | 업무 |
| public insertLinkApproval() | L1522-2919 | 공개 메서드 | 조회창 Pay06_Lookup_LinkContent 열기, 서비스 com.Com10_FormMapping.selectByLinkCode, com.Com10_FormMapping.selectByLinkCode, com.Com10_FormMapping.selectByLinkCode, pay.Pay10_Month.getHtmlData10, pay.Pay10_Month.selectBypayCode, pay.Pay10_Month.getHtmlData10, emp.Emp03_Trans.selectByDate, pay.Pay06_ActMapping.selectByLinkCode, pay.Pay10_Month.selectByRetirePayCode, pay.Pay10_Month.selectByRetirePayCode, emp.Emp21_UnLeave.getHtmlContent02_1, emp.Emp21_UnLeave.getHtmlContent02_2, sys.Sys99_Print.getHtmlContent, biz.Biz20_FeeCharge.getHtmlContent, yyyy.MM.dd, yyyy.MM.dd, emp.Emp23_EtcLeavePerson.selectByEtcLeaveId, fnd.Fnd31_OprFund.selectByOprId, com.Com10_FormMapping.selectByLinkCode, com.Com10_FormMapping.selectByLinkCode, com.Com11_FormMappingMulti.selectByDetailCode, com.Com11_FormMappingMulti.selectByDetailCode, ast.Ast21_Tr4Insure.selectExpenseAppr, tdm.Tdm30_RoleAllc.selectByPersonId, tdm.Tdm30_RoleAllc.selectByAllcStdDate, com.Com10_FormMapping.selectByLinkCode, com.Com10_FormMapping.selectByLinkCode, com.Com10_FormMapping.selectByLinkCode, com.Com10_FormMapping.selectByLinkCode, com.Com10_FormMapping.selectByLinkCode, sys.Sys01_Company.selectById, com.Com10_FormMapping.selectByLinkCode, com.Com10_FormMapping.selectByLinkCode, fnd.Fnd31_OprFund.selectByOprId, fnd.Fnd31_OprFund.selectByOprId, fnd.Fnd31_OprFund.selectByDistinctOprId, fnd.Fnd31_OprFund.selectByDistinctOprId, dcr.Dcr05_DocType.selectByDefaultClassTreeId(feeChargeModel, companyId, companyId, chargeDate, quarterStr, apprId, companyId, personId, apprId, startDate, closeDate, searchText, companyId, classTreeId, defaultYn) | 업무 |
| public insertLinkApprovals() | L2922-3836 | 공개 메서드 | 서비스 flt.Flt01_CompanyStd.selectByDate, flt.Flt01_CompanyStd.selectByDate, biz.Biz01_Promo.getHtmlData, biz.Biz52_ErpFee.selectByStartDate, tdm.Tdm51_ChckOrg.selectApprContent(companyId, dataYm, managerId, providePurCode, searchText, apprId) | 업무 |
| public insertScheduleApproval() | L3838-3937 | 공개 메서드 | 조회창 Apr20_Lookup_SelectIcs 열기, 조회창 Apr22_Lookup_SelectIcr 열기, 서비스 dcr.Dcr05_DocType.selectByDefaultClassTreeId(companyId, classTreeId, defaultYn) | 업무 |
| public insertIcsApproval() | L3939-4030 | 공개 메서드 | 조회창 Apr20_Lookup_SelectIcs 열기, 서비스 dcr.Dcr05_DocType.selectByDefaultClassTreeId(companyId, classTreeId, defaultYn) | 업무 |
| private checkContent() | L4032-4058 | insertLinkApproval,insertLinkApprovals | 서비스 dcr.Dcr05_DocType.selectByDefaultClassTreeId(companyId, classTreeId, defaultYn) | 업무 |
| private makeCancelButton() | L4060-4069 | myTurnCheck | 상태 처리 | 업무 |
| private makeDeleteButton() | L4071-4079 | retrieveApproval,insertLinkApproval,insertLinkApprovals,insertScheduleApproval,insertIcsApproval,insertPayApproval | 상태 처리 | 업무 |
| private makeAfterAddButton() | L4081-4106 | retrieveApproval,insertLinkApproval,insertLinkApprovals,insertScheduleApproval,insertIcsApproval,insertApproval,insertPayApproval | 상태 처리 | 업무 |
| private makeDisposalListButton() | L4108-4137 | retrieveApproval,insertLinkApproval,insertLinkApprovals,insertScheduleApproval,insertIcsApproval,insertApproval,insertPayApproval | 조회창 Apr90_Lookup_DisposalList 열기, 서비스 apr.Apr90_DisposalList.checkDisposal | 업무 |
| private makePersonAuthAddButton() | L4139-4148 | retrieveApproval,insertLinkApproval,insertLinkApprovals,insertScheduleApproval,insertIcsApproval,insertApproval,insertPayApproval | 상태 처리 | 업무 |
| private makeIcsEditButton() | L4150-4159 | retrieveApproval | 상태 처리 | 업무 |
| private makeTypoButton() | L4161-4252 | retrieveApproval,insertLinkApproval,insertLinkApprovals,insertScheduleApproval,insertIcsApproval,insertApproval,insertPayApproval | 팝업 Apr01_Edit_ApprModi 열기 | 업무 |
| public makeButton() | L4254-4340 | getApprDelModel,retrieveApproval,insertLinkApproval,insertLinkApprovals,insertScheduleApproval,insertIcsApproval,insertApproval,insertPayApproval | 서비스 sys.Sys10_File.update | 업무 |
| private apprStepLockChk() | L4342-4371 | update,save | 확인창 표시 | 업무 |
| private apprStepLockChk01() | L4373-4396 | E24 | ConfirmBox → E28 | 업무 |
| private beforePDFChk() | L4398-4425 | E28,apprStepLockChk01 | 상태 처리 | 업무 |
| public insertApproval() | L4427-4485 | insertWriteApproval | 상태 처리 | 업무 |
| public insertPayApproval() | L4487-4550 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveRoleStamp() | L4552-4584 | insertLinkApprovals,insertScheduleApproval,insertIcsApproval,insertApproval,insertPayApproval | 서비스 org.Org10_RoleStamp.checkRole(stampId, orgId) | 업무 |
| private retrieveStamp() | L4586-4612 | insertLinkApproval,retrieveRoleStamp | 서비스 apr.Apr10_Stamp.selectById(stampId) | 업무 |
| private getApprovalForm01() | L4614-4670 | 생성자 | 상태 처리 | 업무 |
| private getApprovalForm02() | L4672-4720 | 생성자 | 상태 처리 | 업무 |
| private getHtmlForm() | L4722-4743 | 생성자 | 상태 처리 | 업무 |
| private setRadio() | L4751-4760 | getAppr | 상태 처리 | 업무 |
| private updateChk() | L4762-4816 | beforePDFChk | 상태 처리 | 업무 |
| private updateContinue() | L4818-4827 | updateChk | 팝업 Apr01_Edit_NoteMessage 열기 | 업무 |
| private update() | L4830-4923 | updateContinue | 서비스 apr.Apr01_Appr.update(companyId, personId, updateApprModel, relateFundList, relateAdvList, relateApprList, relateIcsList, relateIcrList, relateFileList, stampDocMap, apprStepList, sms) | 업무 |
| private checkStamp() | L4925-4931 | save,resetApprStep,findStampEmpId,makePreviewPDF | 상태 처리 | 업무 |
| private save() | L4933-5054 | E25 | 서비스 apr.Apr01_Appr.update(updateApprModel, relateFundList, relateAdvList, relateApprList, relateIcsList, relateIcrList, relateFileList, stampDocMap, apprStepList, sms) | 업무 |
| private getStampDocMap() | L5056-5084 | update,save | 상태 처리 | 업무 |
| private findLookupStamp() | L5086-5120 | E32 | 조회창 Apr10_Lookup_DocStamp 열기 | 업무 |
| private resetApprStep() | L5123-5136 | findLookupStamp | 상태 처리 | 업무 |
| private findStampEmpId() | L5139-5171 | retrieveStamp,resetApprStep | 서비스 emp.Emp00_TransInfo.selectByStampEmpId(personId) | 업무 |
| private setStampStepTypeCode() | L5174-5176 | findStampEmpId | 상태 처리 | 업무 |
| private setObseverOfficer() | L5179-5201 | findStampEmpId | 서비스 emp.Emp00_TransInfo.selectByObseverOfficer(companyId, classTreeId) | 업무 |
| private setRiskManager() | L5204-5225 | 미사용 후보 | 서비스 emp.Emp00_TransInfo.selectByRiskManager(companyId) | 업무 |
| private setManagementOfficer() | L5228-5249 | 미사용 후보 | 서비스 emp.Emp00_TransInfo.selectByManagementOfficer(companyId) | 업무 |
| private setRiskOfficer() | L5252-5273 | 미사용 후보 | 서비스 emp.Emp00_TransInfo.selectByRiskOfficer(companyId) | 업무 |
| private setComplianceOfficer() | L5276-5298 | findStampEmpId | 서비스 emp.Emp00_TransInfo.selectByComplianceOfficer(companyId, classTreeId) | 업무 |
| private makePDF() | L5301-5313 | getServiceResult | 상태 처리 | 업무 |
| private preCheck() | L5315-5363 | updateChk,makePreviewPDF | 상태 처리 | 업무 |
| private makePreviewPDF() | L5365-5504 | E4,E5,beforePDFChk | 서비스 apr.Apr10_Stamp.selectByPDFId, apr.Apr01_ApprTemp.insert, dcr.Dcr30_Link.selectByClassTreeId(keyId, companyId, keyId, companyId, updateApprModel, relateFundList) | 업무 |
| private loadDoc() | L5506-5517 | E30 | 조회창 Apr05_Lookup_LoadDoc2 열기 | 업무 |
| private loadForm() | L5519-5527 | E31 | 조회창 Dcr05_Lookup_FormView 열기 | 업무 |
| private viewPDF() | L5529-5539 | E4,E5,makePreviewPDF | 상태 처리 | 업무 |
| private changeStep() | L5541-5656 | setStampStepTypeCode,setObseverOfficer,setRiskManager,setManagementOfficer,setRiskOfficer,setComplianceOfficer | 서비스 apr.Apr04_ApprStep.changeByApproval, emp.Emp00_TransInfo.selectOneEmpInfo(personId, empId) | 업무 |
| private apprStempInsertRow() | L5658-5669 | changeStep | 상태 처리 | 업무 |
| public moveIcsClass() | L5671-5682 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L5685-5709 | E7,E8,E18,E24,getApprModel,getApprBookmark,insertHistory,retrieveAltApproval,cancleApprStep,confirmCheck,cancelCheck01,cancel,deleteChk01,insertApproval,insertWriteApproval,insertLinkApproval,insertLinkApprovals,insertScheduleApproval,insertIcsApproval,checkContent,retrieveRoleStamp,retrieveStamp,findStampEmpId,setObseverOfficer,setRiskManager,setManagementOfficer,setRiskOfficer,setComplianceOfficer,makePDF,makePreviewPDF,changeStep,getCommentSize | 상태 처리 | 업무 |
| private resetFileUpload() | L5711-5726 | E23 | 상태 처리 | 업무 |
| private specialCharacters() | L5728-5732 | getCommentSize | 상태 처리 | 업무 |
| private getCommentSize() | L5734-5746 | 생성자,E2 | 서비스 apr.Apr42_Comment.getSize(companyId, apprId), LabelHtml 래퍼 | 업무 |
| private masking() | L5748-5750 | makePreviewPDF | 상태 처리 | 업무 |
| private unmasking() | L5751-5753 | makePreviewPDF | 상태 처리 | 업무 |
| private setHtml() | L4745-4748 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L5755-5757 | getApprovalForm02 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L5759-5761 | 생성자,retrieveApproval,insertApproval,insertWriteApproval,insertLinkApproval,insertLinkApprovals,insertScheduleApproval,insertIcsApproval,getApprovalForm02 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlText() | L5768-5779 | 생성자,E21,insertLinkApproval,loadDoc,loadForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="cancel" onClick={() => /* getServiceResult(), cancleApprStep() */}>승인취소</Button>
2. <Button type="save" onClick={confirmCheck}>승인</Button>
3. <Button type="cancel" onClick={confirmCheck}>반려</Button>
4. <Button type="unknown" onClick={makePreviewPDF}>미리보기</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>
6. <Button type="delete" onClick={deleteChk01}>삭제</Button>
7. <Button type="unknown" onClick={fileAdd}>결재완료후 첨부파일등록</Button>
8. <Button type="unknown" onClick={apprAdd}>연관문서설정</Button>
9. <Button type="unknown" onClick={fundAdd}>연관펀드설정</Button>
10. <Button type="delete" onClick={getServiceResult}>문서폐기 신청</Button>
11. <Button type="unknown" onClick={personAuthAdd}>공람설정</Button>
12. <Button type="unknown" onClick={icsEdit}>연관법규 추가/수정/삭제</Button>
13. <Button type="view" onClick={setHtmlText}>오타수정</Button>
14. <Button type="register" onClick={() => /* getServiceResult(), apprStepLockChk01() */}>결재요청</Button>
15. <Button type="save" onClick={save}>저장</Button>
16. <Button type="register" onClick={loadDoc}>불러오기</Button>
17. <Button type="unknown" onClick={loadForm}>양식</Button>
18. <Button type="unknown" onClick={() => /* 인라인 L346-352 (new SelectHandler(){ @Override public…) */}>열람기록</Button>
19. <Button type="unknown" onClick={getCommentSize}>댓글</Button>
20. <Button type="unknown" onClick={undefined}>결재</Button>
21. <Button type="unknown" onClick={cancelCheck01}>상신취소</Button>

### Apr90_Lookup_DisposalList (`client/vi/apr/Apr90_Lookup_DisposalList.java`, 163줄)

- 입력·하위 화면: `reason` MyTextArea, `lookup` Apr90_Lookup_ConfirmEmp

#### 이벤트
[E0] 화면 열림 (생성자 L63-81) → init(), getEditor(), show()
[E1] updateButton[제출].Select (L94) → updateChk()
[E2] closeButton[닫기].Select (L100) → hide()
[E3] msgBox.DialogHide [YES] (L131) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-61 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L83-91 | 생성자 | 상태 처리 | 업무 |
| private init() | L93-106 | 생성자 | 상태 처리 | 업무 |
| private updateChk() | L108-123 | E1 | 조회창 Apr90_Lookup_ConfirmEmp 열기 | 업무 |
| private update() | L125-158 | updateChk | 확인창 표시, 서비스 apr.Apr90_DisposalList.modelUpdate | 업무 |
| private setHtmlHeaderStyle() | L160-162 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateChk}>제출</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr90_Lookup_ConfirmEmp (`client/vi/apr/Apr90_Lookup_ConfirmEmp.java`, 151줄)

- 입력·하위 화면: `confirmEmpName` LookupTriggerField, `confirmEmpId` LongField, `lookup` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L51-69) → settings(), getEditor(), show()
[E1] confirmEmpName.TriggerClick (L85) → 인라인 L85-98 (new TriggerClickHandler(){ @Override …)
[E2] updateButton[확인].Select (L99) → updateChk()
[E3] closeButton[닫기].Select (L105) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L47-49 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L71-79 | 생성자 | 상태 처리 | 업무 |
| private getApprStep() | L113-132 | settings | 서비스 att.Att03_OvertimeReq.selectApprStepByType(companyId, personId, orgId) | 업무 |
| private updateChk() | L134-141 | E2 | 상태 처리 | 업무 |
| private update() | L143-146 | updateChk | 상태 처리 | 업무 |
| private settings() | L81-111 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: confirmEmpId=resultModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L148-150 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateChk}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr50_Lookup_PersonList (`client/vi/apr/Apr50_Lookup_PersonList.java`, 404줄)

- 툴바 `buttonBar`: {radioHlc} {insertRowButton} {updateButton} {deleteButton} {anchor}
- 툴바 `buttonBar02`: 12:
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personInfo 500 "사원정보" Text

#### 이벤트
[E1] anchor.MouseDown (L99) → retrieve()
[E2] toggle.ValueChange (L142) → update01()
[E3] insertRowButton[등록].Select (L163) → insertRow()
[E4] updateButton[저장].Select (L169) → update02()
[E5] deleteButton[삭제].Select (L175) → deleteChk()
       └ [E9] msgBox.DialogHide [YES] (L329) → delete()
[E6] clearButton[초기화].Select [YES] (L181) → allClear()
[E7] msgBox.DialogHide [YES] (L186) → allClear()
[E8] closeButton[닫기].Select (L204) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L79-133 | 공개 메서드 | 상태 처리 | 업무 |
| private allClear() | L213-227 | E6,E7 | 서비스 apr.Apr50_Bookmark.deleteByApprId(companyId, apprId) | 업무 |
| private insertRow() | L237-264 | E3 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private retrieve() | L266-295 | E1,open,allClear,update01 | 서비스 apr.Apr50_Bookmark.selectByApprId(companyId, apprId) | 업무 |
| private update01() | L297-310 | E2 | 서비스 apr.Apr50_Bookmark.insert(companyId, apprId, publicYn) | 업무 |
| private update02() | L312-324 | E4 | 서비스 apr.Apr50_Bookmark.update | 업무 |
| private deleteChk() | L326-344 | E5 | ConfirmBox → E9 | 업무 |
| private delete() | L346-359 | E9 | GridDeleteData apr.Apr50_Bookmark.delete(체크된 행 목록) | 업무 |
| private buttonSettings() | L361-381 | retrieve | 상태 처리 | 업무 |
| private headingSettings() | L383-391 | retrieve,update02,delete | 상태 처리 | 업무 |
| private settings() | L135-211 | open | 확인창 표시, 이벤트 연결, 초기값: radio01=true("전체 중요표시"), radio02=false("개별 중요표시"), radio01=true("전체 중요표시"), radio02=false("개별 중요표시"), radio01=false("전체 중요표시"), radio02=true("개별 중요표시") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L229-235 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L393-395 | open,headingSettings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L397-399 | open,settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L401-403 | open,settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personInfo', 500, '사원정보'),  // L232 SQL 계산 컬럼(selectByApprId: ( f_emp_kor_nm(apr50_person_id) ||' (' …)
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update02}>저장</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>
4. <Button type="reset" onClick={allClear}>초기화</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr42_Lookup_Comment (`client/vi/apr/Apr42_Lookup_Comment.java`, 269줄)

- 툴바 `buttonBar`: {sendButton}
- 입력·하위 화면: `commentField` MyTextArea 빈칸="내용을 입력하세요", `lookup` Sms03_Lookup_SendList

#### 이벤트
[E0] 화면 열림 (생성자 L85-101) → 초기화
[E1] sendButton[알림발송].Select [선택>0] (L106) → 인라인 L106-117 (new SelectHandler(){ @Override public…)
[E2] insertButton[등 록].Select (L120) → update()
[E3] grid.CellClick [event.getCellIndex() == 3] (L130) → retrieve(), deleteChk()
       └ [E4] msgBox.DialogHide [YES] (L185) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-83 | 공개 메서드 | 상태 처리 | 업무 |
| private getApprStepList() | L150-171 | settings | 서비스 apr.Apr04_ApprStep.selectByApprId(apprId, companyId, baseDate, personId) | 업무 |
| private deleteChk() | L181-205 | E3 | ConfirmBox → E4 | 업무 |
| public retrieve() | L207-221 | E3,open,update | 서비스 apr.Apr42_Comment.selectByApprId(companyId, personId, apprId) | 업무 |
| private getSize() | L223-237 | retrieve | 서비스 apr.Apr42_Comment.getSize(companyId, apprId) | 업무 |
| private update() | L239-258 | E2 | 서비스 apr.Apr42_Comment.modelUpdate(companyId, personId, apprId, comment) | 업무 |
| private delete() | L260-264 | E4 | GridDeleteData apr.Apr42_Comment.delete(체크된 행 목록) | 업무 |
| private settings() | L103-148 | open | 조회창 Sms03_Lookup_SendList 열기, 조회창 Apr42_Lookup_FileList 열기, 미선택 시 alert "내용을 입력해주세요", 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L173-179 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L266-268 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L175) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L176) addTextSmall
  // ⚠ 대응 없음 (GridBuilder L177) addTextSmall
];
```

#### 사용된 버튼들
1. <Button type="send" onClick={() => /* 인라인 L106-117 (new SelectHandler(){ @Override public…) */}>알림발송</Button>
2. <Button type="unknown" onClick={update}>등 록</Button>

### Apr42_Lookup_FileList (`client/vi/apr/Apr42_Lookup_FileList.java`, 255줄)

- 툴바 `buttonBar`: {uploadFileButton} {fileUploadForm}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid()):
  - fileName 440 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L76-128) → settings(), show()
[E1] fileUpload.Change (L91) → 인라인 L91-98 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L101) → retrieve()
[E3] uploadFileButton[파일업로드].Select (L131) → 인라인 L131-136 (new SelectHandler() { @Override publi…)
[E4] fileDeleteForm.SubmitComplete (L139) → retrieve()
[E5] closeButton[닫기].Select (L145) → hide()
[E6] msgBox.DialogHide [YES] (L173) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L63-74 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFileGrid() | L154-208 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| public retrieve() | L210-219 | E2,E4,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L221-246 | E6 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public clear() | L252-254 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L130-152 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L248-250 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.text('fileNm', 440, '첨부파일'),  // L202
  // ⚠ 대응 없음 (GridBuilder L203) addCell
  // ⚠ 대응 없음 (GridBuilder L204) addCell
  // ⚠ 대응 없음 (GridBuilder L205) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L131-136 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr41_Lookup_OpenHistory (`client/vi/apr/Apr41_Lookup_OpenHistory.java`, 122줄)

- 툴바 `buttonBar`: {anchor}
- 그리드 `grid` (buildGrid()):
  - openDateStr 200 "열람일시" TextCenter
  - orgName 200 "부서명" Text
  - personName 100 "사원명" TextCenter
  - loginModeName 100 "구분" TextCenter

#### 이벤트
[E1] anchor.MouseDown (L49) → retrieve()
[E2] closeButton[닫기].Select (L75) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-86 | 공개 메서드 | 서비스 apr.Apr41_OpenHistory.selectByApprIdPaging | 업무 |
| private retrieve() | L99-117 | E1,open | 상태 처리 | 업무 |
| private buildGrid() | L88-97 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L119-121 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('openDateStr', 200, '열람일시'),  // L91 SQL 계산 컬럼(selectByApprIdPaging: TO_CHAR(apr41_open_date, 'YYYY.MM.DD HH…)
  gb.text('orgNm', 200, '부서명'),  // L92 SQL 계산 컬럼(selectByApprIdPaging: f_get_empTrans(apr41_person_id, apr41_o…)
  gb.textCenter('personNm', 100, '사원명'),  // L93 SQL 계산 컬럼(selectByApprIdPaging: f_emp_kor_nm(apr41_person_id))
  gb.textCenter('loginModeNm', 100, '구분'),  // L94 SQL 계산 컬럼(selectByApprIdPaging: f_cdnm('LoginModeCode', apr41_login_mod…)
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr22_Lookup_SelectIcr (`client/vi/apr/Apr22_Lookup_SelectIcr.java`, 188줄)

- 입력·하위 화면: `lookup` Apr22_Lookup_RelateIcr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - scheduleCodeCheck 50 "" TextCenter
  - classTreeFullName 450 "내규" TextArea
  - cycleName 80 "주기" Text
  - actionCell 60 "상세보기" Cell 편집:viewCell
  - actionCell 60 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L59-93) → show()
[E1] updateButton[확인].Select (L66) → update()
[E2] cancleButton[닫기].Select (L72) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L43-46 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L49-57 | 공개 메서드 | 상태 처리 | 업무 |
| private retriveIcrLine() | L95-108 | open | 서비스 apr.Apr22_RelateIcr.insertIcr(apprId, dcrClassTreeId, icrClassTreeId) | 업무 |
| public retriveIcrLine() | L110-124 | open | 서비스 apr.Apr22_RelateIcr.insertToDoList(listId, infoId, apprId, classTreeId, scheduleCode) | 업무 |
| public createIcrLine() | L126-141 | open | 서비스 apr.Apr22_RelateIcr.insertToDoList(listId, infoId, apprId, classTreeId, scheduleCode) | 업무 |
| private update() | L175-183 | E1 | 상태 처리 | 업무 |
| private buildGrid() | L144-173 | 필드 초기화 | 조회창 Apr22_Lookup_RelateIcr 열기, GridDeleteData apr.Apr22_RelateIcr.delete(체크된 행 목록), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L185-187 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L166 scheduleCodeCheck 50 "" (apr22_schedule_cd_check 컬럼 없음)
  gb.textArea('classTreeFullNm', 450, '내규'),  // L167 SQL 계산 컬럼(selectById: f_icr_class_tree_nm_allpath(b.icr01_cla…)
  gb.text('cycleNm', 80, '주기'),  // L168 SQL 계산 컬럼(selectById: f_cdnm('CycleCode', c.sch03_cycle_cd, c…)
  // ⚠ 대응 없음 (GridBuilder L169) addCell
  // ⚠ 대응 없음 (GridBuilder L170) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr22_Lookup_RelateIcr (`client/vi/apr/Apr22_Lookup_RelateIcr.java`, 419줄)

- 입력·하위 화면: `classTreeName` MyTextArea, `content` MyTextArea, `relatedLaw` MyTextArea, `deadlineFullName` TextField, `deadlineNote` TextField, `submitTo` TextField, `standCode` TextField, `standName` TextField, `standYn` TextField, `standDate` MyDateField, `closeDate` MyDateField, `pageIcrFile` Icr01_Page_IcrFile, `radio01` Radio, `radio02` Radio

#### 이벤트
[E0] 화면 열림 (생성자 L165-180) → getEditor(), show()
[E1] toggleType.ValueChange (L262) → 인라인 L262-283 (new ValueChangeHandler<HasValue<Boole…)
[E2] closeDate.Change (L285) → 인라인 L285-290 (new ChangeHandler() { @Override publi…)
[E3] closeDate.TriggerClick (L291) → 인라인 L291-296 (new TriggerClickHandler() { @Override…)
[E4] calculateButton[계산하기].Select [radio01.getValue()] (L297) → closeDateCheck()
[E5] updateButton[저장].Select (L313) → updateCheck()
       └ [E7] msgBox.DialogHide [YES] (L378) → update()
[E6] closeButton[닫기].Select (L319) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L90-130 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L132-163 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L182-237 | 생성자 | 상태 처리 | 업무 |
| private init() | L239-325 | open,view | 상태 처리 | 업무 |
| private closeDateCheck() | L327-352 | E4 | 서비스 apr.Apr22_RelateIcr.getCloseDate(deadlineId, standDate, companyId) | 업무 |
| private updateCheck() | L354-403 | E5 | ConfirmBox → E7 | 업무 |
| private update() | L405-410 | E7,updateCheck | 상태 처리 | 업무 |
| private setHtmlStyle() | L412-414 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L416-418 | open,view | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateCheck}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="calculate" onClick={closeDateCheck}>계산하기</Button>

### Apr22_Lookup_RelateIcrList (`client/vi/apr/Apr22_Lookup_RelateIcrList.java`, 304줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookup` Apr22_Lookup_RelateIcr
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeFullName 510 "내규" TextArea
  - cycleName 80 "주기" Text
  - closeDate 100 "마감일" Date
  - actionCell 80 "설정" Cell 편집:editCell

#### 이벤트
[E1] anchor.MouseDown (L76) → retrieve()
[E2] insertButton[행 추가].Select (L82) → insertCheck()
[E3] deleteButton[행 삭제].Select (L88) → deleteCheck()
[E4] updateButton[저장].Select (L95) → update()
[E5] closeButton[닫기].Select (L101) → close()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L65-132 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L164-171 | E1,open | 서비스 apr.Apr22_RelateIcr.selectByApprId(companyId, apprId) | 업무 |
| private update() | L173-231 | E4 | GridDeleteData apr.Apr22_RelateIcr.check, apr.Apr22_RelateIcr.deleteList | 업무 |
| private close() | L233-236 | E5 | 상태 처리 | 업무 |
| private deleteCheck() | L238-245 | E3 | 상태 처리 | 업무 |
| private deleteRow() | L247-253 | deleteCheck | 상태 처리 | 업무 |
| private insertCheck() | L255-262 | E2 | 상태 처리 | 업무 |
| private insertRow() | L264-299 | insertCheck | 조회창 Icr01_Lookup_SelectMulti 열기 | 업무 |
| private buildGrid() | L134-162 | 필드 초기화 | 조회창 Apr22_Lookup_RelateIcr 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L301-303 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('classTreeFullNm', 510, '내규'),  // L156 SQL 계산 컬럼(selectByApprId: f_icr_class_tree_nm_allpath(b.icr01_cla…)
  gb.text('cycleNm', 80, '주기'),  // L157 SQL 계산 컬럼(selectByApprId: f_cdnm('CycleCode', c.sch03_cycle_cd, c…)
  gb.date('closeDate', 100, '마감일'),  // L158
  // ⚠ 대응 없음 (GridBuilder L159) addCell
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertCheck}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteCheck}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={close}>닫기</Button>

### Apr20_Lookup_SelectIcs (`client/vi/apr/Apr20_Lookup_SelectIcs.java`, 188줄)

- 입력·하위 화면: `lookup` Apr20_Lookup_RelateIcs
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - scheduleCodeCheck 50 "" TextCenter
  - classTreeFullName 450 "법규" TextArea
  - cycleName 80 "주기" Text
  - actionCell 60 "상세보기" Cell 편집:viewCell
  - actionCell 60 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L59-93) → show()
[E1] updateButton[확인].Select (L66) → update()
[E2] cancleButton[닫기].Select (L72) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L43-46 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L49-57 | 공개 메서드 | 상태 처리 | 업무 |
| private retriveIcsLine() | L95-108 | open | 서비스 apr.Apr20_RelateIcs.insertIcs(apprId, dcrClassTreeId, icsClassTreeId) | 업무 |
| public retriveIcsLine() | L110-124 | open | 서비스 apr.Apr20_RelateIcs.insertToDoList(listId, infoId, apprId, classTreeId, scheduleCode) | 업무 |
| public createIcsLine() | L126-141 | open | 서비스 apr.Apr20_RelateIcs.insertToDoList(listId, infoId, apprId, classTreeId, scheduleCode) | 업무 |
| private update() | L175-183 | E1 | 상태 처리 | 업무 |
| private buildGrid() | L144-173 | 필드 초기화 | 조회창 Apr20_Lookup_RelateIcs 열기, GridDeleteData apr.Apr20_RelateIcs.delete(체크된 행 목록), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L185-187 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L166 scheduleCodeCheck 50 "" (apr20_schedule_cd_check 컬럼 없음)
  gb.textArea('classTreeFullNm', 450, '법규'),  // L167 SQL 계산 컬럼(selectById: f_ics_class_tree_nm_allpath(b.ics01_cla…)
  gb.text('cycleNm', 80, '주기'),  // L168 SQL 계산 컬럼(selectById: f_cdnm('CycleCode', c.sch03_cycle_cd, c…)
  // ⚠ 대응 없음 (GridBuilder L169) addCell
  // ⚠ 대응 없음 (GridBuilder L170) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr20_Lookup_RelateIcs (`client/vi/apr/Apr20_Lookup_RelateIcs.java`, 444줄)

- 입력·하위 화면: `classTreeName` MyTextArea, `content` MyTextArea, `relatedLaw` MyTextArea, `deadlineFullName` TextField, `deadlineNote` TextField, `submitTo` TextField, `standCode` TextField, `standName` TextField, `standYn` TextField, `standDate` MyDateField, `closeDate` MyDateField, `pageIcsFile` Ics01_Page_IcsFile, `radio01` Radio, `radio02` Radio

#### 이벤트
[E0] 화면 열림 (생성자 L190-205) → getEditor(), show()
[E1] toggleType.ValueChange (L287) → 인라인 L287-308 (new ValueChangeHandler<HasValue<Boole…)
[E2] closeDate.Change (L310) → 인라인 L310-315 (new ChangeHandler() { @Override publi…)
[E3] closeDate.TriggerClick (L316) → 인라인 L316-321 (new TriggerClickHandler() { @Override…)
[E4] calculateButton[계산하기].Select [radio01.getValue()] (L322) → closeDateCheck()
[E5] updateButton[저장].Select (L338) → updateCheck()
       └ [E7] msgBox.DialogHide [YES] (L403) → update()
[E6] closeButton[닫기].Select (L344) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L91-144 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L146-188 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L207-262 | 생성자 | 상태 처리 | 업무 |
| private init() | L264-350 | open,view | 상태 처리 | 업무 |
| private closeDateCheck() | L352-377 | E4 | 서비스 apr.Apr20_RelateIcs.getCloseDate(deadlineId, standDate, companyId) | 업무 |
| private updateCheck() | L379-428 | E5 | ConfirmBox → E7 | 업무 |
| private update() | L430-435 | E7,updateCheck | 상태 처리 | 업무 |
| private setHtmlStyle() | L437-439 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L441-443 | open,view | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateCheck}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="calculate" onClick={closeDateCheck}>계산하기</Button>

### Apr20_Lookup_RelateIcsList (`client/vi/apr/Apr20_Lookup_RelateIcsList.java`, 307줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookup` Apr20_Lookup_RelateIcs
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeFullName 510 "법규" TextArea
  - cycleName 80 "주기" Text
  - closeDate 100 "마감일" Date
  - actionCell 80 "설정" Cell 편집:editCell

#### 이벤트
[E1] anchor.MouseDown (L76) → retrieve()
[E2] insertButton[행 추가].Select (L82) → insertCheck()
[E3] deleteButton[행 삭제].Select (L88) → deleteCheck()
[E4] updateButton[저장].Select (L95) → update()
[E5] closeButton[닫기].Select (L101) → close()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L65-132 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L164-171 | E1,open | 서비스 apr.Apr20_RelateIcs.selectByApprId(companyId, apprId) | 업무 |
| private update() | L173-234 | E4 | GridDeleteData apr.Apr20_RelateIcs.check, apr.Apr20_RelateIcs.deleteList | 업무 |
| private close() | L236-239 | E5 | 상태 처리 | 업무 |
| private deleteCheck() | L241-248 | E3 | 상태 처리 | 업무 |
| private deleteRow() | L250-256 | deleteCheck | 상태 처리 | 업무 |
| private insertCheck() | L258-265 | E2 | 상태 처리 | 업무 |
| private insertRow() | L267-302 | insertCheck | 조회창 Ics01_Lookup_SelectMulti 열기 | 업무 |
| private buildGrid() | L134-162 | 필드 초기화 | 조회창 Apr20_Lookup_RelateIcs 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L304-306 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('classTreeFullNm', 510, '법규'),  // L156 SQL 계산 컬럼(selectByApprId: f_ics_class_tree_nm_allpath(b.ics01_cla…)
  gb.text('cycleNm', 80, '주기'),  // L157 SQL 계산 컬럼(selectByApprId: f_cdnm('CycleCode', c.sch03_cycle_cd, c…)
  gb.date('closeDate', 100, '마감일'),  // L158
  // ⚠ 대응 없음 (GridBuilder L159) addCell
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertCheck}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteCheck}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={close}>닫기</Button>

### Apr13_Lookup_PersonAuth (`client/vi/apr/Apr13_Lookup_PersonAuth.java`, 176줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 120 "사원번호" TextCenter
  - personName 120 "사원명" TextCenter

#### 이벤트
[E1] insertButton[행 추가].Select (L75) → insertRow()
[E2] deleteButton[행 삭제].Select (L81) → deleteRow()
[E3] updateButton[저장].Select (L87) → update()
[E4] closeButton[닫기].Select (L93) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-69 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L71-99 | open | 상태 처리 | 업무 |
| private retrieve() | L111-122 | open | 서비스 apr.Apr13_PersonAuth.selectByApprId(apprId) | 업무 |
| private insertRow() | L124-149 | E1 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow() | L151-157 | E2 | 상태 처리 | 업무 |
| private update() | L159-170 | E3 | GridDeleteData apr.Apr13_PersonAuth.update, apr.Apr13_PersonAuth.delete | 업무 |
| private buildGrid() | L101-109 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L172-174 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 120, '사원번호'),  // L105 SQL 계산 컬럼(selectByApprId: emp01_emp_no)
  gb.textCenter('personNm', 120, '사원명'),  // L106 SQL 계산 컬럼(selectByApprId: emp01_kor_nm)
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr03_Page_Relate (`client/vi/apr/Apr03_Page_Relate.java`, 2162줄)

- 툴바 `stepLineBar01`: {apprStepLineButton} {reArrangeButton}
- 툴바 `stepLineBar02`: 나란히 설정된 합의권자는 순서와 상관없이 결재 가능합니다.:
- 툴바 `button`: {insertButton} {optionsButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc, `lookupFundInfo` Fnd01_Lookup_SelectMulti, `lookup` Adv02_Lookup_SelectMulti
- 그리드 `relateFundGrid` (buildRelateFundGrid(), 체크박스):
  - fundTypeName 80 "펀드유형" Text
  - fundCode 80 "코드" Text
  - fundName 310 "연관펀드명" Text
  - afterYn 80 "결재이후" BooleanYn2
  - actionCell 80 "삭제" Cell 편집:editDocCell
  - printYn 80 "출력" Boolean
- 그리드 `relateAdvGrid` (buildRelateAdvGrid(), 체크박스):
  - manageCode 130 "코드" Text
  - manageName 500 "일임계좌명" Text
  - actionCell 80 "삭제" Cell 편집:editDocCell
- 그리드 `relateApprGrid` (buildRelateApprGrid(), 체크박스):
  - inOutTypeName 50 "구분" TextCenter
  - targetRegDate 100 "등록일" Date
  - targetTitle 400 "문서명" Text
  - actionCell 80 "미리보기" Cell 편집:viewCell
  - actionCell 80 "삭제" Cell 편집:deleteCell
- 그리드 `relateIcsGrid` (buildRelateIcsGrid(), 체크박스):
  - classTreeFullName 405 "법규명" TextArea
  - cycleName 80 "주기" Text
  - closeDate 100 "마감일" Date
  - actionCell 60 "설정" Cell 편집:editCell
  - actionCell 60 "삭제" Cell 편집:deleteCell
  - actionCell 60 "상세보기" Cell 편집:viewCell
- 그리드 `relateIcrGrid` (buildRelateIcrGrid(), 체크박스):
  - classTreeFullName 405 "내규명" TextArea
  - cycleName 80 "주기" Text
  - closeDate 100 "마감일" Date
  - actionCell 60 "설정" Cell 편집:editCell
  - actionCell 60 "삭제" Cell 편집:deleteCell
  - actionCell 60 "상세보기" Cell 편집:viewCell
- 그리드 `apprStepGrid` (buildApprStepGrid()):
  - stepTypeName 65 "구분" ApprStep
  - stepStatusName 65 "결재상태" ApprStep
  - apprDate 100 "결재일" DateNotSort
  - actionCell 25 "" CellNotSort 편집:upButton
  - stepApprName 280 "결재자" TextNotSort
  - actionCell 25 "" CellNotSort 편집:downButton
  - opinionYnStr 45 " " TextCenterNotSort
  - actionCell 25 " " CellNotSort 편집:opinionCell
  - typoYnStr 45 " " TextCenterNotSort
  - actionCell 25 " " CellNotSort 편집:typoCell

#### 이벤트
[E0] 화면 열림 (생성자 L200-336) → pannelEvents()
[E1] optionsButton[첨부파일 옵션설정].Select (L244) → options()
[E2] insertButton[등록].Select (L250) → insert()
[E3] reArrangeButton[직급순 재정렬].Select [YES] (L256) → arrayStepTypeCode()
[E4] msgBox.DialogHide [YES] (L261) → arrayStepTypeCode()
[E5] apprStepLineButton[결재선 설정].Select [apprStepLineButtonYn] (L279) → execute()
[E6] relateIcsGrid.getStore().StoreAdd (L339) → clearPanel()
[E7] relateIcsGrid.getStore().StoreRemove (L345) → clearPanel()
[E8] relateIcrGrid.getStore().StoreAdd (L352) → clearPanel()
[E9] relateIcrGrid.getStore().StoreRemove (L358) → clearPanel()
[E10] relateFundGrid.getStore().StoreAdd (L365) → clearPanel()
[E11] relateFundGrid.getStore().StoreRemove (L371) → clearPanel()
[E12] relateAdvGrid.getStore().StoreAdd (L378) → clearPanel()
[E13] relateAdvGrid.getStore().StoreRemove (L384) → clearPanel()
[E14] relateApprGrid.getStore().StoreAdd (L391) → clearPanel()
[E15] relateApprGrid.getStore().StoreRemove (L397) → clearPanel()
[E16] fileUpload.Change (L1026) → 인라인 L1026-1033 (new ChangeHandler() { @Override publi…)
[E17] fileUploadForm.SubmitComplete [result != null] (L1036) → resetFileUpload(), execute(), clearPanel()
[E18] fileUpload.Change (L1973) → 인라인 L1973-1980 (new ChangeHandler() { @Override publi…)
[E19] plainTabPanel.Selection [arg0 != null] (L2014) → 인라인 L2014-2026 (new SelectionHandler<Widget>(){ @Over…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L138-145 | E5,E17,setApprFileList,insertRelateFundList,insertRelateAdvList,insertRelateIcsList,insertRelateIcrList,options,insert,retrieveRelateFundGrid,retrieveRelateAdvGrid,retrieveRelateApprGrid,retrieveRelateIcsGrid,retrieveRelateIcrGrid,createIcsLine,createIcrLine,retrieveFileLine,createApprStepLine,createApprStepLine02,buildRelateFundGrid,buildRelateAdvGrid,buildRelateApprGrid,buildRelateIcsGrid,buildRelateIcrGrid,buildApprStepGrid | 상태 처리 | 업무 |
| public getRelateApprGrid() | L171-173 | 공개 메서드 | 상태 처리 | 업무 |
| public setRelateFundList() | L175-178 | 공개 메서드 | 상태 처리 | 업무 |
| public setRelateApprList() | L180-183 | 공개 메서드 | 상태 처리 | 업무 |
| public setApprFileList() | L185-193 | 공개 메서드 | 상태 처리 | 업무 |
| public setCorpDocList() | L195-198 | 공개 메서드 | 상태 처리 | 업무 |
| private pannelEvents() | L338-403 | 생성자 | 상태 처리 | 업무 |
| public insertRelateFundList() | L405-440 | insert | 조회창 Fnd01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateFundList() | L442-505 | insert | 서비스 fnd.Fnd00_Fund.selectById, adv.Adv02_Account.selectById(fundId, accountId) | 업무 |
| public insertRelateApprList() | L507-542 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRelateApprIdList() | L544-585 | 공개 메서드 | 서비스 apr.Apr01_Appr.getApprIdList(companyId, apprIdList) | 업무 |
| public insertBiz01RelateApprList() | L587-628 | 공개 메서드 | 서비스 biz.Biz05_RelateAppr.selectByPromoIdList | 업무 |
| public insertEmp17RelateApprList() | L630-657 | 공개 메서드 | 상태 처리 | 업무 |
| public insertPay50RelateApprList() | L659-700 | 공개 메서드 | 서비스 com.Com01_RelateAppr.selectByExpenseIdList | 업무 |
| public insertPay50PayRelateApprList() | L702-743 | 공개 메서드 | 서비스 pay.Pay50_Expense.selectByExpenseApprIdList | 업무 |
| private processModel() | L745-753 | insertRelateApprList,insertRelateApprIdList,insertBiz01RelateApprList,insertEmp17RelateApprList,insertPay50RelateApprList,insertPay50PayRelateApprList | 상태 처리 | 업무 |
| public insertFileList() | L756-762 | 공개 메서드 | 상태 처리 | 업무 |
| public insertBiz01FileList() | L764-776 | 공개 메서드 | 상태 처리 | 업무 |
| public insertPay50FileList() | L778-784 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRelateAdvList() | L786-821 | insert | 조회창 Adv02_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateIcsList() | L823-867 | insert | 조회창 Ics01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateIcrList() | L869-913 | insert | 조회창 Icr01_Lookup_SelectMulti 열기 | 업무 |
| public retrieve() | L915-987 | 공개 메서드 | LabelHtml 래퍼 | 업무 |
| private options() | L989-1017 | E1 | 조회창 Sys61_Lookup_FileList 열기, 조회창 Sys61_Lookup_DelList 열기, 조회창 Apr01_Lookup_ApprFileList 열기 | 업무 |
| private insert() | L1019-1083 | E2 | 조회창 Apr21_Lookup_RelateAppr 열기 | 업무 |
| private retrieveRelateFundGrid() | L1086-1097 | setRelateFundList,retrieve | 서비스 apr.Apr03_RelateFund.selectByApprId(apprId) | 업무 |
| private retrieveRelateAdvGrid() | L1100-1109 | retrieve | 서비스 apr.Apr12_RelateAdv.selectByApprId(apprId) | 업무 |
| private retrieveRelateApprGrid() | L1112-1122 | setRelateApprList,retrieve | 서비스 apr.Apr21_RelateAppr.selectByApprId(companyId, apprId) | 업무 |
| public retrieveRelateIcsGrid() | L1125-1135 | retrieve | 서비스 apr.Apr20_RelateIcs.selectByApprId(companyId, apprId) | 업무 |
| public retrieveRelateIcrGrid() | L1138-1148 | retrieve | 서비스 apr.Apr22_RelateIcr.selectByApprId(companyId, apprId) | 업무 |
| private retrieveApprStepGrid() | L1151-1158 | retrieve | 서비스 apr.Apr04_ApprStep.selectByApprId(personId, apprId, baseDate, companyId) | 업무 |
| public createIcsLine() | L1160-1175 | 공개 메서드 | 서비스 apr.Apr20_RelateIcs.selectByDcrClassTreeId(classTreeId, apprId) | 업무 |
| public createIcrLine() | L1177-1192 | 공개 메서드 | 서비스 apr.Apr22_RelateIcr.selectByDcrClassTreeId(classTreeId, apprId) | 업무 |
| public inputIcsLine() | L1194-1205 | 공개 메서드 | 상태 처리 | 업무 |
| public inputIcsLine() | L1207-1225 | 공개 메서드 | 상태 처리 | 업무 |
| public inputIcrLine() | L1227-1238 | 공개 메서드 | 상태 처리 | 업무 |
| public inputIcrLine() | L1240-1258 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveApprStepLine() | L1261-1268 | 공개 메서드 | 서비스 apr.Apr04_ApprStep.selectByApprId(personId, apprId, baseDate, companyId) | 업무 |
| public retrieveFileLine() | L1270-1278 | 공개 메서드 | 상태 처리 | 업무 |
| public createFileLine() | L1280-1283 | 공개 메서드 | 상태 처리 | 업무 |
| public copyFileLine() | L1285-1288 | 공개 메서드 | 상태 처리 | 업무 |
| public copyFileLineAdminYn() | L1290-1293 | 공개 메서드 | 상태 처리 | 업무 |
| public copyPfResultReportFileLine() | L1295-1298 | 공개 메서드 | 상태 처리 | 업무 |
| public tdmRoleDescSetting() | L1301-1304 | 공개 메서드 | 상태 처리 | 업무 |
| public tdmRoleDescSetting() | L1306-1309 | 공개 메서드 | 상태 처리 | 업무 |
| public tdmManlOrgApprSetting() | L1311-1314 | 공개 메서드 | 상태 처리 | 업무 |
| public ceoReportSetting() | L1316-1319 | 공개 메서드 | 상태 처리 | 업무 |
| public ics16RelateApprSetting() | L1320-1323 | 공개 메서드 | 상태 처리 | 업무 |
| public ics32RelateApprSetting() | L1324-1327 | 공개 메서드 | 상태 처리 | 업무 |
| public createApprStepLine() | L1331-1355 | 공개 메서드 | 서비스 apr.Apr04_ApprStep.selectByApprovalTypeCd(companyId, personId, approvalTypeCode, apprId, orgId, classTreeId) | 업무 |
| public createApprStepLine02() | L1358-1377 | 공개 메서드 | 서비스 apr.Apr04_ApprStep.selectByApprovalTypeCd02(companyId, personId, approvalTypeCode, apprId, orgId, classTreeId, taskGubun, exctId) | 업무 |
| private buildRelateFundGrid() | L1380-1402 | 필드 초기화 | GridDeleteData apr.Apr03_RelateFund.delete(체크된 행 목록) | 업무 |
| private buildRelateAdvGrid() | L1405-1424 | 필드 초기화 | GridDeleteData apr.Apr12_RelateAdv.delete(체크된 행 목록) | 업무 |
| private buildRelateApprGrid() | L1427-1493 | 필드 초기화 | 서비스 apr.Apr01_Appr.selectById, apr.Apr01_ApprTemp.insert(updateApprModel) | 업무 |
| private buildRelateIcsGrid() | L1496-1541 | 필드 초기화 | 조회창 Apr20_Lookup_RelateIcs 열기, GridDeleteData apr.Apr20_RelateIcs.delete(체크된 행 목록) | 업무 |
| private buildRelateIcrGrid() | L1544-1589 | 필드 초기화 | 조회창 Apr22_Lookup_RelateIcr 열기, GridDeleteData apr.Apr22_RelateIcr.delete(체크된 행 목록) | 업무 |
| private buildApprStepGrid() | L1592-1670 | 필드 초기화 | 팝업 Apr01_Edit_Message 열기, 팝업 Apr01_Edit_ApprModi 열기, 미선택 시 alert "해당 문서에 대한 의견이 없습니다", 서비스 apr.Apr92_ApprModi.selectByPersonId(personId, apprId) | 업무 |
| public changeRow() | L1672-1715 | buildApprStepGrid | 미선택 시 alert "상신자는 수정할 수 없습니다" | 업무 |
| public getSeq() | L1717-1724 | changeRow | 상태 처리 | 업무 |
| public getApprStepGrid() | L1726-1728 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateFundList() | L1730-1746 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateAdvList() | L1748-1755 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateApprList() | L1757-1764 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateIcsList() | L1766-1773 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateIcrList() | L1775-1782 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateFileList() | L1784-1787 | 공개 메서드 | 상태 처리 | 업무 |
| public getCorpDocInfo() | L1789-1791 | 공개 메서드 | 상태 처리 | 업무 |
| public getStampList() | L1793-1795 | 공개 메서드 | 상태 처리 | 업무 |
| public stampQtyChk() | L1797-1799 | 공개 메서드 | 상태 처리 | 업무 |
| public fieldChk() | L1801-1803 | 공개 메서드 | 상태 처리 | 업무 |
| public checkStampId() | L1809-1811 | 공개 메서드 | 상태 처리 | 업무 |
| public checkRelateIcs() | L1813-1831 | 공개 메서드 | 상태 처리 | 업무 |
| public checkRelateIcr() | L1833-1850 | 공개 메서드 | 상태 처리 | 업무 |
| public setApprModel() | L1852-1856 | 공개 메서드 | 상태 처리 | 업무 |
| public checkPrintFundYn() | L1858-1860 | 공개 메서드 | 상태 처리 | 업무 |
| public checkStepLine() | L1862-1875 | 공개 메서드 | 상태 처리 | 업무 |
| public openButton() | L1877-1900 | 공개 메서드 | 상태 처리 | 업무 |
| public hideDown() | L1902-1908 | 공개 메서드 | 상태 처리 | 업무 |
| public arrayStepTypeCode() | L1910-1940 | E3,E4 | 상태 처리 | 업무 |
| public arrayPosCode() | L1942-1964 | arrayStepTypeCode | 상태 처리 | 업무 |
| private resetFileUpload() | L1966-1981 | E17 | 상태 처리 | 업무 |
| public clearApprStep() | L1983-1987 | createApprStepLine | 상태 처리 | 업무 |
| public setStampEmpId() | L1989-1991 | 공개 메서드 | 상태 처리 | 업무 |
| public setStampId() | L1993-1996 | 공개 메서드 | 상태 처리 | 업무 |
| public enableButton() | L1998-2004 | 공개 메서드 | LabelHtml 래퍼 | 업무 |
| public enableFileButton() | L2006-2027 | 공개 메서드 | LabelHtml 래퍼 | 업무 |
| public clearPanelOnly() | L2029-2077 | execute | 상태 처리 | 업무 |
| public clearPanel() | L2079-2151 | E6,E7,E8,E9,E10,E11,E12,E13,E14,E15,E17,execute,setApprFileList,retrieveRelateFundGrid,retrieveRelateAdvGrid,retrieveRelateApprGrid,retrieveRelateIcsGrid,retrieveRelateIcrGrid,createIcsLine,createIcrLine,retrieveFileLine | 상태 처리 | 업무 |
| private specialCharacters() | L2153-2157 | clearPanelOnly,clearPanel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L2159-2161 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildRelateFundGrid = () => [
  gb.text('kofiaFundTypeNm', 80, '펀드유형'),  // L1394
  gb.text('fundCd', 80, '코드'),  // L1395
  gb.text('fundNm', 310, '연관펀드명'),  // L1396
  gb.booleanYn2('afterYn', 80, '결재이후'),  // L1397
  // ⚠ 대응 없음 (GridBuilder L1398) addCell
  gb.boolean('printYn', 80, '출력'),  // L1399
];

const buildRelateAdvGrid = () => [
  gb.text('manageCd', 130, '코드'),  // L1419
  gb.text('manageNm', 500, '일임계좌명'),  // L1420
  // ⚠ 대응 없음 (GridBuilder L1421) addCell
];

const buildRelateApprGrid = () => [
  gb.textCenter('inoutNm', 50, '구분'),  // L1486 SQL 계산 컬럼(selectById: CASE WHEN b.apr01_inout_cd = '10' THEN …)
  gb.date('targerRegDate', 100, '등록일'),  // L1487 SQL 계산 컬럼(selectById: b.apr01_reg_date)
  gb.text('targerTitle', 400, '문서명'),  // L1488 SQL 계산 컬럼(selectById: b.apr01_title)
  // ⚠ 대응 없음 (GridBuilder L1489) addCell
  // ⚠ 대응 없음 (GridBuilder L1490) addCell
];

const buildRelateIcsGrid = () => [
  gb.textArea('classTreeFullNm', 405, '법규명'),  // L1533 SQL 계산 컬럼(selectById: f_ics_class_tree_nm_allpath(b.ics01_cla…)
  gb.text('cycleNm', 80, '주기'),  // L1534 SQL 계산 컬럼(selectById: f_cdnm('CycleCode', c.sch03_cycle_cd, c…)
  gb.date('closeDate', 100, '마감일'),  // L1535
  // ⚠ 대응 없음 (GridBuilder L1536) addCell
  // ⚠ 대응 없음 (GridBuilder L1537) addCell
  // ⚠ 대응 없음 (GridBuilder L1538) addCell
];

const buildRelateIcrGrid = () => [
  gb.textArea('classTreeFullNm', 405, '내규명'),  // L1581 SQL 계산 컬럼(selectById: f_icr_class_tree_nm_allpath(b.icr01_cla…)
  gb.text('cycleNm', 80, '주기'),  // L1582 SQL 계산 컬럼(selectById: f_cdnm('CycleCode', c.sch03_cycle_cd, c…)
  gb.date('closeDate', 100, '마감일'),  // L1583
  // ⚠ 대응 없음 (GridBuilder L1584) addCell
  // ⚠ 대응 없음 (GridBuilder L1585) addCell
  // ⚠ 대응 없음 (GridBuilder L1586) addCell
];

const buildApprStepGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L1658) addApprStep
  // ⚠ 대응 없음 (GridBuilder L1659) addApprStep
  // ⚠ 대응 없음 (GridBuilder L1660) addDateNotSort
  // ⚠ 대응 없음 (GridBuilder L1661) addCellNotSort
  // ⚠ 대응 없음 (GridBuilder L1662) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L1663) addCellNotSort
  // ⚠ 대응 없음 (GridBuilder L1664) addTextCenterNotSort
  // ⚠ 대응 없음 (GridBuilder L1665) addCellNotSort
  // ⚠ 대응 없음 (GridBuilder L1666) addTextCenterNotSort
  // ⚠ 대응 없음 (GridBuilder L1667) addCellNotSort
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insert}>등록</Button>
2. <Button type="unknown" onClick={options}>첨부파일 옵션설정</Button>
3. <Button type="unknown" onClick={execute}>결재선 설정</Button>
4. <Button type="unknown" onClick={arrayStepTypeCode}>직급순 재정렬</Button>

### Apr21_Lookup_RelateAppr (`client/vi/apr/Apr21_Lookup_RelateAppr.java`, 258줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 등록기간: {regDate} ~: {endRegDate} 문서구분: {classTreeName} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `regDate` MyDateField, `endRegDate` MyDateField, `searchText` TextField 빈칸="상신제목/펀드코드/펀드명/등록자/부서명", `classTreeName` LookupTriggerField 빈칸="전체", `searchPopup` Dcr01_Lookup_DcrClass
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "등록일" Date
  - classTreeName 300 "문서구분" Text
  - aprTitle 300 "상신제목" Text
  - fundDisplayName 250 "펀드" Text
  - empName 55 "등록자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L72-74) → init()
[E1] classTreeName.TriggerClick [result == null] (L139) → 인라인 L139-158 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L159) → retrieve()
[E3] retrieveButton[조회].Select (L167) → retrieve()
[E4] insertButton[확인].Select (L173) → insert()
[E5] closeButton[닫기].Select (L179) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L83-128 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L202-220 | E2,E3 | 서비스 dcr.Dcr00_DocList.selectByText(companyId, orgId, empId, classTreeId, regDate, endRegDate, searchText, admin) | 업무 |
| private insert() | L222-249 | E4 | 상태 처리 | 업무 |
| private settings() | L130-185 | init | 조회창 Dcr01_Lookup_DcrClass 열기, 이벤트 연결, 초기값: classTreeName="전체", classTreeName=classTreeModel.getClassTreeFullName( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L187-200 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L251-253 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L255-257 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L190
  gb.text('classTreeNm', 300, '문서구분'),  // L191
  gb.text('title', 300, '상신제목'),  // L192
  // ⚠DB없음 L193 fundDisplayName 250 "펀드" (apr01_fund_display_name 컬럼 없음)
  gb.text('korNm', 55, '등록자'),  // L194
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={insert}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr16_Grid_StampDoc (`client/vi/apr/Apr16_Grid_StampDoc.java`, 282줄)

- 입력·하위 화면: `provideCo` TextField, `purpose` TextField, `note` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L56-71) → settings(), getEditor()
[E1] insertButton[+].Select (L75) → 인라인 L75-84 (new SelectHandler() { @Override publi…)
[E2] deleteButton[-].Select (L85) → 인라인 L85-90 (new SelectHandler() { @Override publi…)
[E3] stampDocButton[법인인감증명서].Select (L91) → 인라인 L91-96 (new SelectHandler() { @Override publi…)
[E4] corpRegDocButton[법인등기부등본].Select (L97) → 인라인 L97-102 (new SelectHandler() { @Override publi…)
[E5] stampButton[인감날인].Select (L103) → 인라인 L103-108 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L111-167 | 생성자 | 상태 처리 | 업무 |
| public getCorpDocInfo() | L169-176 | 공개 메서드 | 상태 처리 | 업무 |
| public getList() | L178-180 | 공개 메서드 | 상태 처리 | 업무 |
| public stampQtyChk() | L182-190 | 공개 메서드 | 상태 처리 | 업무 |
| public fieldChk() | L192-202 | 공개 메서드 | 상태 처리 | 업무 |
| public setApprModel() | L204-207 | 공개 메서드 | 상태 처리 | 업무 |
| public setStampId() | L213-216 | 공개 메서드 | 상태 처리 | 업무 |
| public checkStampId() | L218-228 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L230-251 | 공개 메서드 | 서비스 apr.Apr16_StampDoc.selectProvideCoByApprId(apprId) | 업무 |
| private chkYn() | L253-273 | retrieve | 서비스 apr.Apr04_ApprStep.checkApprId(apprId) | 업무 |
| private settings() | L73-109 | 생성자 | 팝업 SettingPopup 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L275-277 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlGrayStyle() | L279-281 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="plus" onClick={() => /* 인라인 L75-84 (new SelectHandler() { @Override publi…) */}>+</Button>
2. <Button type="minus" onClick={() => /* 인라인 L85-90 (new SelectHandler() { @Override publi…) */}>-</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L91-96 (new SelectHandler() { @Override publi…) */}>법인인감증명서</Button>
4. <Button type="unknown" onClick={() => /* 인라인 L97-102 (new SelectHandler() { @Override publi…) */}>법인등기부등본</Button>
5. <Button type="unknown" onClick={() => /* 인라인 L103-108 (new SelectHandler() { @Override publi…) */}>인감날인</Button>

### Apr16_Grid_StampApplList (`client/vi/apr/Apr16_Grid_StampApplList.java`, 113줄)

- 입력·하위 화면: `lookup` Apr16_Lookup_StampApplQty
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - applTypeName 110 "구분" Text
  - stampReprCorpName 220 "인감 및 대표명의" Text
  - applQty 40 "부수" LongCenter
  - stampOutYn 40 "반출" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L26-29) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L43-56 | insertRow | 서비스 apr.Apr16_StampDoc.selectByApprId(apprId) | 업무 |
| public retrieve() | L58-69 | insertRow | 서비스 apr.Apr16_StampDoc.selectByApprId(apprId) | 업무 |
| public insertRow() | L71-79 | 공개 메서드 | 조회창 Apr16_Lookup_StampApplQty 열기 | 업무 |
| public deleteRow() | L81-85 | 공개 메서드 | GridDeleteData apr.Apr16_StampDoc.delete(체크된 행 목록) | 업무 |
| public getModiList() | L87-103 | 공개 메서드 | 상태 처리 | 업무 |
| public getList() | L105-107 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L31-41 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('applTypeNm', 110, '구분'),  // L35 SQL 계산 컬럼(selectByApprId: f_cdnm('CorpDocStampApplType', apr16_ap…)
  gb.text('stampReprCorpNm', 220, '인감 및 대표명의'),  // L36 SQL 계산 컬럼(selectByApprId: CASE WHEN apr16_appl_type = '2' THEN CO…)
  gb.longCenter('applQty', 40, '부수'),  // L37 SQL 계산 컬럼(selectByApprId: CASE WHEN apr16_appl_type = '3' THEN ap…)
  gb.booleanYn2('stampOutYn', 40, '반출'),  // L38
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Apr16_Lookup_StampApplQty (`client/vi/apr/Apr16_Lookup_StampApplQty.java`, 240줄)

- 입력·하위 화면: `stampQty` LongField, `outYn` CheckBox, `stampReprCorpName` LookupTriggerField 빈칸="선택하세요", `stampReprCorpId` LongField, `lookup` Apr15_Lookup_ReprCorp

#### 이벤트
[E0] 화면 열림 (생성자 L51-91) → show()
[E1] stampReprCorpName[인감].TriggerClick ["2".equals(applType)] (L108) → lookupReprCorp(), lookupStamp()
       └ [E3] messageBox.DialogHide (L211) → hide()
[E2] updateButton[저장].Select (L121) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L93-144 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L146-181 | E2 | 서비스 apr.Apr16_StampDoc.modelUpdate | 업무 |
| private lookupReprCorp() | L183-198 | E1 | 조회창 Apr15_Lookup_ReprCorp 열기 | 업무 |
| private lookupStamp() | L200-231 | E1 | 조회창 Apr10_Lookup_Stamp 열기, ConfirmBox → E3 | 업무 |
| private setHtmlStyle() | L233-235 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L237-239 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

### Apr15_Lookup_ReprCorp (`client/vi/apr/Apr15_Lookup_ReprCorp.java`, 184줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - corpTypeName 80 "구분" TextCenter
  - corpName 250 "대표회사" Text
  - reprName 170 "대표자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L49-54) → 초기화
[E1] searchText.KeyPress [Enter] (L84) → retrieve()
[E2] retrieveButton[조회].Select (L93) → retrieve()
[E3] confirmButton[확인].Select (L99) → confirm()
[E4] nullButton[해당사항 없음].Select [callback != null] (L105) → hide()
[E5] closeButton[닫기].Select (L114) → hide()
[E6] grid.CellDoubleClick (L121) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L82-127 | open | 상태 처리 | 업무 |
| private retrieve() | L141-162 | E1,E2,open | 서비스 apr.Apr15_ReprCorp.selectByCompanyId(companyId, searchText, corpRegYn, useYn, companyAddYn) | 업무 |
| private confirm() | L164-175 | E3,E6 | 미선택 시 alert "선택된 대표회사가 없습니다" | 업무 |
| private buildGrid() | L129-139 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L177-179 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L181-183 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('corpTypeNm', 80, '구분'),  // L134 SQL 계산 컬럼(selectByCompanyId: f_cdnm('ReprCorpType', apr15_corp_type,…)
  gb.text('corpNm', 250, '대표회사'),  // L135
  gb.text('reprNm', 170, '대표자'),  // L136
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>해당사항 없음</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr04_Edit_RetouchApprStep (`client/vi/apr/Apr04_Edit_RetouchApprStep.java`, 429줄)

- 레이아웃: west=treePanel, center=empPanel
- 입력·하위 화면: `buildTree` Org01_Tree_OrgCode
- 그리드 `empGrid` (buildEmpGrid(), 체크박스):
  - orgKorName 200 "부서명" Text
  - titleName2 80 "직책" Text
  - empKorName 80 "성명" Text
  - actionCell 80 "결재" Cell 편집:approveCell
  - actionCell 80 "합의" Cell 편집:consentButton
  - actionCell 80 "참조" Cell 편집:referenceButton
- 그리드 `apprStepGrid` (buildApprStepGrid(), 체크박스):
  - stepTypeName 100 "구분" TextFixCenter
  - apprDate 100 "결재일" Date
  - titleName 100 "직책" TextFix
  - empKorName 100 "성명" TextFixCenter
  - actionCell 70 "위로" Cell 편집:upButton
  - actionCell 70 "아래로" Cell 편집:downButton
  - actionCell 70 "삭제" Cell 편집:deleteButton

#### 이벤트
[E0] 화면 열림 (생성자 L64-149) → show()
[E1] orgTree.SelectionChanged [orgCodeModel != null] (L80) → 서비스 emp.Emp00_TransInfo.selectByOrgCodeId(orgCodeId, companyId)
[E2] confirmButton[저장].Select (L125) → update()
[E3] closeButton[닫기].Select (L132) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildEmpGrid() | L151-184 | 필드 초기화 | 상태 처리 | 업무 |
| public buildApprStepGrid() | L186-219 | 필드 초기화 | 상태 처리 | 업무 |
| public update() | L221-251 | E2 | 서비스 apr.Apr04_ApprStep.updateList(senderId, deleteList) | 업무 |
| public insertApprovalEmp() | L253-264 | buildEmpGrid | 상태 처리 | 업무 |
| public insertApprovalEmp() | L266-361 | buildEmpGrid | 서비스 apr.Apr04_ApprStep.changeByApproval(personId) | 업무 |
| public changeRow() | L363-411 | buildApprStepGrid | 미선택 시 alert "상신자는 수정할 수 없습니다" | 업무 |
| public getSeq() | L413-420 | insertApprovalEmp,changeRow | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L422-424 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L426-428 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildEmpGrid = () => [
  gb.text('korNm', 200, '부서명'),  // L176
  gb.text('titleNm2', 80, '직책'),  // L177
  gb.text('korNm', 80, '성명'),  // L178
  // ⚠ 대응 없음 (GridBuilder L179) addCell
  // ⚠ 대응 없음 (GridBuilder L180) addCell
  // ⚠ 대응 없음 (GridBuilder L181) addCell
];

const buildApprStepGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L210) addTextFixCenter
  gb.date('apprDate', 100, '결재일'),  // L211
  // ⚠ 대응 없음 (GridBuilder L212) addTextFix
  // ⚠ 대응 없음 (GridBuilder L213) addTextFixCenter
  // ⚠ 대응 없음 (GridBuilder L214) addCell
  // ⚠ 대응 없음 (GridBuilder L215) addCell
  // ⚠ 대응 없음 (GridBuilder L216) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr04_Edit_ApprStep (`client/vi/apr/Apr04_Edit_ApprStep.java`, 729줄)

- 레이아웃: west=treePanel, center=empPanel
- 툴바 `buttonBar`: {searchField} {searchButton}
- 입력·하위 화면: `buildTree` Org01_Tree_OrgCode, `searchField` TextField 빈칸="사원명/조직명/사원번호", `lookup` Apr01_Lookup_ApprList, `checkBox` CheckBox
- 그리드 `empGrid` (buildEmpGrid()):
  - orgKorName 200 "부서명" Text
  - titleName2 80 "직책" Text
  - empKorName 80 "성명" Text
  - actionCell 80 "결재" Cell 편집:approveCell
  - actionCell 80 "합의" Cell 편집:consentButton
  - actionCell 80 "참조" Cell 편집:referenceButton
- 그리드 `apprStepGrid` (buildApprStepGrid()):
  - stepTypeName 40 "구분" TextFix
  - orgKorName 200 "부서명" TextFix
  - titleName 80 "직책" TextFix
  - empKorName 80 "성명" TextFix
  - actionCell 70 "위로" Cell 편집:upButton
  - actionCell 70 "아래로" Cell 편집:downButton
  - actionCell 70 "삭제" Cell 편집:deleteButton

#### 이벤트
[E0] 화면 열림 (생성자 L107-304) → selectObseverOfficer(), apprStepLockYnChk()
[E1] orgTree.SelectionChanged [orgCodeModel != null] (L120) → 서비스 emp.Emp00_TransInfo.selectByOrgCodeId(orgCodeId, companyId)
[E2] searchField.KeyPress [Enter] (L134) → retrieveTransInfo()
[E3] recentLoad.Click (L165) → recentLoad()
[E4] reference.Click [YES] (L187) → allReference(), setHtmlCheckBoxLabelStyle(), orgReference()
[E5] msgBox.DialogHide [YES] (L196) → allReference()
[E6] msgBox.DialogHide [YES] (L225) → orgReference()
[E7] confirmButton[확인].Select (L267) → hide()
[E8] closeButton[닫기].Select (L277) → hide()
[E9] searchButton[검색].Select (L283) → retrieveTransInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setStampEmpId() | L99-101 | 공개 메서드 | 상태 처리 | 업무 |
| public setStampId() | L103-105 | 공개 메서드 | 상태 처리 | 업무 |
| private apprStepLockYnChk() | L306-320 | 생성자 | 서비스 sys.Sys01_Company.selectById(companyId) | 업무 |
| public buildEmpGrid() | L322-356 | 필드 초기화 | 상태 처리 | 업무 |
| public buildApprStepGrid() | L358-393 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieveTransInfo() | L395-404 | E2,E9 | 서비스 emp.Emp00_TransInfo.selectByText(transDate, transCode, searchText, companyId, isSeparateAddTitle) | 업무 |
| public insertApprovalEmp() | L406-417 | buildEmpGrid,processNextApprovalEmp,allReference,orgReference | 상태 처리 | 업무 |
| public insertApprovalEmp() | L419-514 | buildEmpGrid,processNextApprovalEmp,allReference,orgReference | 서비스 apr.Apr04_ApprStep.changeByApproval(personId) | 업무 |
| public changeRow() | L516-562 | buildApprStepGrid | 상태 처리 | 업무 |
| private selectObseverOfficer() | L566-580 | 생성자 | 서비스 emp.Emp00_TransInfo.selectByObseverOfficer(companyId) | 업무 |
| private recentLoad() | L582-595 | E3 | 상태 처리 | 업무 |
| private processNextApprovalEmp() | L598-625 | recentLoad | 서비스 emp.Emp00_TransInfo.getPersonId(companyId, personId, transDate) | 업무 |
| private allReference() | L627-665 | E4,E5 | 서비스 emp.Emp00_TransInfo.getTransDate(companyId, transDate) | 업무 |
| private orgReference() | L667-707 | E4,E6 | 서비스 emp.Emp00_TransInfo.getOrgCodeId(companyId, transDate, orgCodeId, includeYn) | 업무 |
| public getSeq() | L709-716 | insertApprovalEmp,changeRow | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L718-720 | 생성자,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L722-724 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L726-728 | E4 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildEmpGrid = () => [
  gb.text('korNm', 200, '부서명'),  // L347
  gb.text('titleNm2', 80, '직책'),  // L348
  gb.text('korNm', 80, '성명'),  // L350
  // ⚠ 대응 없음 (GridBuilder L351) addCell
  // ⚠ 대응 없음 (GridBuilder L352) addCell
  // ⚠ 대응 없음 (GridBuilder L353) addCell
];

const buildApprStepGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L383) addTextFix
  // ⚠ 대응 없음 (GridBuilder L384) addTextFix
  // ⚠ 대응 없음 (GridBuilder L385) addTextFix
  // ⚠ 대응 없음 (GridBuilder L386) addTextFix
  // ⚠ 대응 없음 (GridBuilder L388) addCell
  // ⚠ 대응 없음 (GridBuilder L389) addCell
  // ⚠ 대응 없음 (GridBuilder L390) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveTransInfo}>검색</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr01_Lookup_ApprList (`client/vi/apr/Apr01_Lookup_ApprList.java`, 238줄)

- 툴바 `buttonBar`: 제목: {searchField} {retrieveButton} {radio01} {radio02}
- 입력·하위 화면: `searchField` TextField, `radio01` Radio, `radio02` Radio
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - statusName 80 "결재상태" TextCenterNotSort
  - regDate 100 "등록일" Date
  - classTreeNameAllPath 360 "문서분류" Text
  - title 360 "제목" Text

#### 이벤트
[E1] toggle.ValueChange (L113) → retrieve()
[E2] retrieveButton[조회].Select (L119) → retrieve()
[E3] searchField.KeyPress [Enter] (L125) → retrieve()
[E4] updateButton[확인].Select (L133) → updateChk()
       └ [E6] msgBox.DialogHide [YES] (L187) → update()
[E5] closeButton[닫기].Select (L139) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-99 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L160-182 | E1,E2,E3,open | 서비스 apr.Apr01_Appr.selectByWeek, apr.Apr01_Appr.selectByDcrGroup(searchText, companyId, personId, toDay) | 업무 |
| private updateChk() | L184-203 | E4 | ConfirmBox → E6 | 업무 |
| private update() | L205-225 | E6 | 서비스 apr.Apr04_ApprStep.getApprStepList(apprId) | 업무 |
| private settings() | L101-146 | open | 이벤트 연결, 초기값: radio01=true("최근 7일간 상신문서"), radio02=false("문서분류별 최근상신문서") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L148-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L227-229 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlRadioLabelStyle12() | L231-233 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L235-237 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L152) addTextCenterNotSort
  gb.date('regDate', 100, '등록일'),  // L153
  gb.text('treeNmAllpath', 360, '문서분류'),  // L154
  gb.text('title', 360, '제목'),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={updateChk}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr01_Grid_ApprFile (`client/vi/apr/Apr01_Grid_ApprFile.java`, 861줄)

- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 405 "첨부파일" TextNotSort
  - fileYnCheck 65 " " TextNotSort
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell
  - actionCell 50 "보기" Cell 편집:viewCell
  - printYn 50 "출력" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L70-99) → initDropPanel()
[E1] fileDeleteForm.SubmitComplete (L76) → retrieve()
[E2] button01[닫기].Select (L470) → 인라인 L470-475 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L101-103 | E1,dragRetrieve,checkFileDelete | 상태 처리 | 업무 |
| private dragRetrieve() | L105-107 | 미사용 후보 | 상태 처리 | 업무 |
| public retrieve() | L109-143 | E1,dragRetrieve,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| public retrieve() | L145-170 | E1,dragRetrieve,checkFileDelete | 서비스 sys.Sys10_File.updateRelateApprId, sys.Sys10_File.selectByParentId(apprId, relateApprId, parentId) | 업무 |
| public copyFile() | L172-199 | 공개 메서드 | 서비스 sys.Sys10_File.copyFile, sys.Sys10_File.selectByParentId(apprId, companyId, parentId, tableName, parentId) | 업무 |
| public copyFile() | L201-229 | 공개 메서드 | 서비스 sys.Sys10_File.copyFileAdminYn, sys.Sys10_File.selectByParentId(apprId, companyId, parentId, adminYn, tableName, parentId) | 업무 |
| public copyPfResultReportFile() | L231-257 | 공개 메서드 | 서비스 sys.Sys10_File.copyPfResultReportFile, sys.Sys10_File.selectByParentId(apprId, companyId, parentId, parentId) | 업무 |
| public copySetFileName() | L259-286 | 공개 메서드 | 서비스 sys.Sys10_File.copySetFileName, sys.Sys10_File.selectByParentId(apprId, companyId, parentId, fileName, parentId) | 업무 |
| public tdmRoleDescFileSetting() | L288-344 | 공개 메서드 | 서비스 sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName, sys.Sys10_File.selectByParentId(companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType, parentId) | 업무 |
| public tdmRoleDigmFileSetting() | L346-402 | 공개 메서드 | 서비스 sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName, sys.Sys10_File.selectByParentId(companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType, parentId) | 업무 |
| public tdmManlOrgApprFileSetting() | L404-478 | 공개 메서드 | 확인창 표시, 서비스 sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName, sys.Sys10_File.selectByParentId(companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType, parentId) | 업무 |
| public ceoReportFileSetting() | L480-547 | 공개 메서드 | 서비스 sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName, sys.Sys10_File.selectByParentId(companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType, parentId) | 업무 |
| public ics16RelateApprFileSetting() | L549-616 | 공개 메서드 | 서비스 sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName, sys.Sys10_File.selectByParentId(companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType, parentId) | 업무 |
| public ics32RelateApprFileSetting() | L618-684 | 공개 메서드 | 서비스 sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName, sys.Sys10_File.selectByParentId(companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType, parentId) | 업무 |
| private buildApprFileGrid() | L686-727 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| public getFileList() | L729-739 | 공개 메서드 | 상태 처리 | 업무 |
| private checkFileDelete() | L741-767 | buildApprFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public getSize() | L769-771 | 공개 메서드 | 상태 처리 | 업무 |
| public hideDown() | L773-776 | 공개 메서드 | 상태 처리 | 업무 |
| public showDelete() | L778-783 | 공개 메서드 | 상태 처리 | 업무 |
| private initDropPanel() | L793-800 | 생성자 | 상태 처리 | 업무 |
| public passChk() | L843-852 | 공개 메서드 | 상태 처리 | 업무 |
| public getParentId() | L854-856 | 공개 메서드 | 상태 처리 | 업무 |
| public setApprModel() | L858-860 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlContentStyle() | L785-787 | tdmManlOrgApprFileSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L789-791 | tdmManlOrgApprFileSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L719) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L720) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L721) addCell
  // ⚠ 대응 없음 (GridBuilder L722) addCell
  // ⚠ 대응 없음 (GridBuilder L723) addCell
  gb.booleanYn2('printYn', 50, '출력'),  // L724
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* 인라인 L470-475 (new SelectHandler() { @Override publi…) */}>닫기</Button>

### Apr01_Edit_Message (`client/vi/apr/Apr01_Edit_Message.java`, 52줄)

- 입력·하위 화면: `rejectMessage` TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L19-32) → 초기화
[E1] closeButton[닫기].Select (L37) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setMessage() | L34-47 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L49-51 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr01_Lookup_RelateFund (`client/vi/apr/Apr01_Lookup_RelateFund.java`, 209줄)

- 툴바 `buttonBar`: {insertButton} {updateButton} {retrieveButton}
- 입력·하위 화면: `lookupFundInfo` Fnd01_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundTypeName 80 "펀드유형" Text
  - fundCode 90 "코드" Text
  - fundName 350 "연관펀드명" Text
  - actionCell 35 "삭제" Cell 편집:deleteCell
  - afterYn 70 "결재이후" BooleanYn2

#### 이벤트
[E1] insertButton[등록].Select [선택>0] (L65) → 인라인 L65-104 (new SelectHandler(){ @Override public…)
[E2] retrieveButton[새로고침].Select (L105) → retrieve()
[E3] updateButton[확정].Select (L111) → update()
[E4] closeButton[닫기].Select (L117) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-145 | 공개 메서드 | 조회창 Fnd01_Lookup_SelectMulti 열기 | 업무 |
| private retrieve() | L173-184 | E2,open | 서비스 apr.Apr03_RelateFund.selectByAfterYn(apprId, afterYn) | 업무 |
| private update() | L186-204 | E3 | 서비스 apr.Apr03_RelateFund.insert(updateList, apprId) | 업무 |
| private buildGrid() | L147-171 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L206-208 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('kofiaFundTypeNm', 80, '펀드유형'),  // L164
  gb.text('fundCd', 90, '코드'),  // L165
  gb.text('fundNm', 350, '연관펀드명'),  // L166
  // ⚠ 대응 없음 (GridBuilder L167) addCell
  gb.booleanYn2('afterYn', 70, '결재이후'),  // L168
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* 인라인 L65-104 (new SelectHandler(){ @Override public…) */}>등록</Button>
2. <Button type="save" onClick={update}>확정</Button>
3. <Button type="reset" onClick={retrieve}>새로고침</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr01_Lookup_RelateAppr (`client/vi/apr/Apr01_Lookup_RelateAppr.java`, 173줄)

- 툴바 `buttonBar`: {insertButton} {updateButton} {retrieveButton}
- 입력·하위 화면: `editor` Apr21_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스):
  - inOutTypeName 50 "구분" TextCenter
  - targetRegDate 100 "등록일" Date
  - targetTitle 400 "문서명" Text
  - actionCell 80 "삭제" Cell 편집:deleteCell

#### 이벤트
[E1] insertButton[등록].Select (L62) → 인라인 L62-74 (new SelectHandler(){ @Override public…)
[E2] retrieveButton[새로고침].Select (L75) → retrieve()
[E3] updateButton[확정].Select (L81) → update()
[E4] closeButton[닫기].Select (L87) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-115 | 공개 메서드 | 조회창 Apr21_Lookup_RelateAppr 열기 | 업무 |
| private retrieve() | L137-148 | E2,open | 서비스 apr.Apr21_RelateAppr.selectByApprId(companyId, apprId) | 업무 |
| private update() | L150-168 | E3 | 서비스 apr.Apr21_RelateAppr.insert(updateList, apprId) | 업무 |
| private buildGrid() | L117-135 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L170-172 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('inoutNm', 50, '구분'),  // L129 SQL 계산 컬럼(selectByApprId: CASE WHEN b.apr01_inout_cd = '10' THEN …)
  gb.date('targerRegDate', 100, '등록일'),  // L130 SQL 계산 컬럼(selectByApprId: b.apr01_reg_date)
  gb.text('targerTitle', 400, '문서명'),  // L131 SQL 계산 컬럼(selectByApprId: b.apr01_title)
  // ⚠ 대응 없음 (GridBuilder L132) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* 인라인 L62-74 (new SelectHandler(){ @Override public…) */}>등록</Button>
2. <Button type="save" onClick={update}>확정</Button>
3. <Button type="reset" onClick={retrieve}>새로고침</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr01_Lookup_ApprFile (`client/vi/apr/Apr01_Lookup_ApprFile.java`, 276줄)

- 툴바 `buttonBar`: {updateButton} {uploadButton} ※ 인감날인본을 사후에 첨부인 경우, 반드시 인감날인본 항목에 체크후 [저장]해주세요:
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 500 "첨부파일" TextNotSort
  - stampYn 70 "인감날인본" Boolean
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E1] fileUpload.Change (L76) → 인라인 L76-83 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete [result != null] (L85) → resetFileUpload(), retrieve()
[E3] fileDeleteForm.SubmitComplete (L108) → retrieve()
[E4] updateButton[저장].Select (L140) → update()
[E5] uploadButton[파일업로드].Select (L146) → 인라인 L146-151 (new SelectHandler(){ @Override public…)
[E6] okButton[닫기].Select (L152) → confirm()
[E7] fileUpload.Change (L227) → 인라인 L227-234 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-137 | 공개 메서드 | 상태 처리 | 업무 |
| private buildApprFileGrid() | L160-180 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L182-202 | E2,E3,open,checkFileDelete | 서비스 sys.Sys10_File.selectByFileYn(parentId) | 업무 |
| private confirm() | L204-207 | E6 | 상태 처리 | 업무 |
| public getServiceResult() | L210-218 | checkFileDelete | 상태 처리 | 업무 |
| private resetFileUpload() | L220-235 | E2 | 상태 처리 | 업무 |
| private checkFileDelete() | L237-262 | buildApprFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private update() | L264-267 | E4 | 서비스 sys.Sys10_File.update | 업무 |
| private settings() | L139-158 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L269-271 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L273-275 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L175) addTextNotSort
  gb.boolean('stampYn', 70, '인감날인본'),  // L176
  // ⚠ 대응 없음 (GridBuilder L177) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="upload" onClick={() => /* 인라인 L146-151 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>
3. <Button type="unknown" onClick={confirm}>닫기</Button>

### Apr01_Edit_RejectMessage (`client/vi/apr/Apr01_Edit_RejectMessage.java`, 84줄)

- 입력·하위 화면: `rejectMessage` TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L22-35) → 초기화
[E1] closeButton[닫기].Select (L40) → hide()
[E2] rejectButton[반려].Select (L56) → reject()
[E3] closeButton[닫기].Select (L65) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setMessage() | L37-50 | 공개 메서드 | 상태 처리 | 업무 |
| public editMessage() | L52-74 | 공개 메서드 | 상태 처리 | 업무 |
| private reject() | L76-79 | E2 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L81-83 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="cancel" onClick={reject}>반려</Button>

### Apr01_Edit_NoteMessage (`client/vi/apr/Apr01_Edit_NoteMessage.java`, 111줄)

- 입력·하위 화면: `noteMessage` TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L22-35) → 초기화
[E1] closeButton[닫기].Select (L40) → hide()
[E2] noteButton[결재].Select (L58) → note()
[E3] closeButton[닫기].Select (L67) → hide()
[E4] noteButton[결재].Select (L83) → note()
[E5] closeButton[닫기].Select (L92) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setMessage() | L37-50 | 공개 메서드 | 상태 처리 | 업무 |
| public editMessage() | L53-76 | 공개 메서드 | 상태 처리 | 업무 |
| public addMessage() | L78-101 | 공개 메서드 | 상태 처리 | 업무 |
| private note() | L103-106 | E2,E4 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L108-110 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={note}>저장</Button>

### Apr01_Edit_ApprModi (`client/vi/apr/Apr01_Edit_ApprModi.java`, 365줄)

- 레이아웃: north=cp01, center=cp02, south=line
- 입력·하위 화면: `title` TextField, `content` TextField, `receiveName` TextField, `referenceName` TextField, `signCompany` TextField 빈칸="대외문서 하단표기", `signCeo` TextField 빈칸="대외문서 하단표기", `note` MyTextArea, `reason` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L80-122) → settings(), getApprovalForm(), getHtmlForm()
[E1] saveButton[저장].Select (L127) → save()
[E2] messageBox.DialogHide (L132) → save()
[E3] closeButton[닫기].Select (L144) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L152-186 | 공개 메서드 | 서비스 apr.Apr92_ApprModi.selectByPersonId(personId, apprId) | 업무 |
| public open() | L188-213 | 공개 메서드 | 상태 처리 | 업무 |
| private readOnly() | L215-221 | edit,open | 상태 처리 | 업무 |
| private getApprovalForm() | L223-247 | 생성자 | 상태 처리 | 업무 |
| private getHtmlForm() | L249-286 | 생성자 | 상태 처리 | 업무 |
| private save() | L293-346 | E1,E2 | 서비스 apr.Apr01_Appr.modelUpdate(personId, reason, updateModel) | 업무 |
| private settings() | L124-150 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtml() | L288-291 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L348-350 | getApprovalForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L352-354 | 생성자,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={save}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

