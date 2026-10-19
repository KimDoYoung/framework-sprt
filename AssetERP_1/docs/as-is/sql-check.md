# 매퍼 SQL ↔ DB 정합성 (EXPLAIN)

`yunhee sql-check`가 생성했다. 직접 수정하지 말고 명령어를 다시 실행한다.

- 소스: `/home/kdy987/work/IDMS-IC` (`application/src/main/java/myApp`)
- DB: `asseterpdb`
- SQL 3447개(`<sql>` 조각 제외): **통과 3136**, **스키마 차이 90**, DB 환경 차이 173, 펼치기 한계·기타 48

통과는 "그 DB에 그 SQL이 쓰는 테이블·컬럼·함수가 모두 있다"는 뜻이다(결과 정합성까지 보장하지 않음).

## 없는 DB 객체

| 오류 | SQL 수 | SQL |
|:---|---:|:---|
| `column "sch22_confirmer_id" does not exist` | 10 | `chk03_daily_list_write.selectDailyListStatusPaging`, `chk03_daily_list_write.selectDailyListStatusPagingTotal`, `ics11_checklist_company.selectByChecklistIdStatus`, `ics11_checklist_company.selectChecklistStatus`, `ics11_checklist_company.selectChecklistStatusPaging`, `ics11_checklist_company.selectChecklistStatusPagingTotal`, `ics16_relate_appr.selectByConfirmerId`, `sch22_write_group.selectByChecklistContentId`, `sch22_write_group.selectByCompanyId`, `sch22_write_group.selectById` |
| `relation "att13_overtime_req_hist" does not exist` | 6 | `att03_overtime_req.getConfirmList`, `att03_overtime_req.selectById`, `att13_overtime_req_hist.insert`, `att13_overtime_req_hist.selectById`, `att13_overtime_req_hist.selectByOvertimeReqId`, `att13_overtime_req_hist.updateInfo` |
| `column "tdm54_occ_ym" does not exist` | 5 | `tdm51_chck_org.selectApprContent`, `tdm51_chck_org.selectByOrgId`, `tdm54_chck_insuff.selectByChckApprCmntId`, `tdm54_chck_insuff.selectByRegDate`, `tdm54_chck_insuff.selectDashboardInsuff` |
| `relation "szm0fd" does not exist` | 3 | `adv02_account.selectIcamAccount`, `fnd01_fund_code.selectIcamFundInfo`, `icam06_fund_book.selectIcamFundBook` |
| `relation "uzm0ui" does not exist` | 3 | `adv10_book.selectIcamBook`, `ast01_class_tree.selectIcamItem`, `fnd10_book.selectIcamBook` |
| `relation "uzm0ac" does not exist` | 3 | `icam10_fee.selectFundMngFeeIcamData`, `icam10_fee.selectOfficeMngFeeIcamData`, `icam10_fee.selectOfficeMngFeeIcamDataRe` |
| `relation "mvb01_booking" does not exist` | 3 | `mvb01_booking.deleteBypickupId`, `mvb01_booking.selectByDate`, `mvb01_booking.selectById` |
| `relation "szx2mm" does not exist` | 2 | `adv02_account.selectIcamTrCorp`, `fnd09_trust_bank.selectIcamTrustBank` |
| `function f_apr_get_approval(unknown, timestamp without time zone, character varying) does not exist` | 2 | `apr06_appr_step_rule.selectByApprovalTypeCode`, `pln03_Resrch.selectDetailInit` |
| `missing FROM-clause entry for table "c"` | 2 | `apr20_relate_ics.selectByClassTreeId`, `apr22_relate_icr.selectByClassTreeId` |
| `missing FROM-clause entry for table "t6"` | 2 | `pln02_plan.selectByEmpPlanFundId`, `pln02_plan.selectByPlanFundId` |
| `column "tdm54_action_appr_ym" does not exist` | 2 | `tdm54_chck_insuff.countByChckApprCmntId`, `tdm59_chck_appr_cmnt.selectByApprEmpId` |
| `relation "act08_journal_upload" does not exist` | 1 | `act08_journal_upload.excelInsert` |
| `column "act11_tr_type" does not exist` | 1 | `act12_journal_map.selectByTrType` |
| `function f_apr_get_position_nm(numeric, timestamp without time zone) does not exist` | 1 | `apr01_appr.selectAplyListByEmpId` |
| `function to_date(timestamp without time zone, unknown) does not exist` | 1 | `apr01_appr.selectByEmpId` |
| `column "bbs01_write_user" does not exist` | 1 | `bbs01_board.selectByTypeCode` |
| `column "bbs02_send_type_cd" does not exist` | 1 | `bbs02_notice.selectByTabBorder` |
| `column "biz20_calc_start_date" does not exist` | 1 | `biz20_fee_charge.selectByContCorpId` |
| `column "biz50_start_date" does not exist` | 1 | `biz50_erp_setup.selectDefaultData` |
| `function f_check_use_relate_appr_id(unknown) does not exist` | 1 | `com01_relate_appr.checkUseRelateApprId` |
| `relation "cols" does not exist` | 1 | `dbConfig.getColumnList` |
| `column "org01_code_id" does not exist` | 1 | `dcr01_class_tree.selectByDcrDown1Bang` |
| `column "level" does not exist` | 1 | `dcr01_class_tree.selectByDcrTreeId` |
| `relation "sch05_relate_icr" does not exist` | 1 | `dcr21_relate_icr.selectByToDoList` |
| `function f_apr_get_approval(numeric, unknown, unknown) does not exist` | 1 | `emp00_trans_info.selectOrgLeaderByEmpId` |
| `column "emp01_company_id" does not exist` | 1 | `emp03_trans.selectByLoginId` |
| `relation "szx0st" does not exist` | 1 | `fnd03_consignment.selectIcamConsignment` |
| `relation "fnd05_memeco" does not exist` | 1 | `fnd05_memeco.selectByCodeName` |
| `relation "szx0gr" does not exist` | 1 | `fnd06_office_work.selectIcamOfficeWork` |
| `relation "szm0fd_yej" does not exist` | 1 | `icam00_common.selectICAM2700` |
| `relation "asseterp_gr" does not exist` | 1 | `icam01_data_info.selectIcamInfoData` |
| `relation "szx0dt" does not exist` | 1 | `icam10_fee.selectOfficeMngFeeIcamData2` |
| `relation "sat0fa" does not exist` | 1 | `icam10_fee.selectOfficeMngFeeIcamData3` |
| `relation "szx0aa" does not exist` | 1 | `icam10_fee.selectOfficeMngStartDate` |
| `relation "uzm0cd" does not exist` | 1 | `icam12_fee_book.selectLastDayFeeIcamData` |
| `relation "pzm1ti" does not exist` | 1 | `icam20_price.selectIcamFundPrice` |
| `relation "sjm0jj" does not exist` | 1 | `icam20_price.selectIcamStkItemByListDate` |
| `relation "oms9jj" does not exist` | 1 | `icam20_price.selectIcamStkPrice` |
| `relation "sjt1tg" does not exist` | 1 | `icam20_price.selectIcamStkPriceOld` |
| `relation "sjg1fc" does not exist` | 1 | `icam25_ipo.selectIcamIpo` |
| `column "line" does not exist` | 1 | `icam50_source.selectIcamAllSource` |
| `missing FROM-clause entry for table "a"` | 1 | `icr01_class_tree.selectByAll` |
| `function f_org_parent_org_id(numeric, timestamp without time zone, unknown) does not exist` | 1 | `msc01_schedule.selectById` |
| `function f_mvb01_booking_check(unknown, unknown, unknown, unknown) does not exist` | 1 | `mvb01_booking.selectByTimeCheck` |
| `function f_check_use_org_id(unknown) does not exist` | 1 | `org01_code.checkUseOrgId` |
| `column "pay03_pay_yn" does not exist` | 1 | `pay02_month.selectByTrans` |
| `relation "pay09_relate_note" does not exist` | 1 | `pay09_relate_note.insert` |
| `function f_pcd01_pickup_check(unknown, unknown, unknown, unknown) does not exist` | 1 | `pcd01_pickup.selectByTimeCheck` |
| `column t2.pln01_fund_nm does not exist` | 1 | `pln02_plan.selectByPlanFundName` |
| `column ics.confirm does not exist` | 1 | `sch04_list.selectByCheckList` |
| `relation "sys01_company" does not exist` | 1 | `sys01_company.updateJobDescEditable` |
| `column b.sys09_cd does not exist` | 1 | `sys09_code.selectByApplyDate` |
| `column "emp01_person_id" does not exist` | 1 | `sys95_manual.selectByCompanyId` |
| `column "sys95_person_id" does not exist` | 1 | `sys95_manual.selectByPersonId` |
| `relation "tdm30_role_allc" does not exist` | 1 | `tdm30_role_allc.updateApprId` |
| `column "tdm51_exct_appr_status_cd" does not exist` | 1 | `tdm53_chck_exct.selectByExctId` |
| `function f_get_tdminsuffpossibleyn(unknown) does not exist` | 1 | `tdm54_chck_insuff.selectPossibleYn` |
| `relation "tdm54_chck_insuff" does not exist` | 1 | `tdm54_chck_insuff.updateStatusCode2` |

## 스키마 차이

| SQL | 파일:줄 | 화면 | 오류 |
|:---|:---|:---|:---|
| `act08_journal_upload.excelInsert` | `server/act/mapper/act08_journal_upload.xml:33` | - | ERROR:  column "act08_corp_cd" of relation "act08_journal_upload" does not exist — LINE 15:      ,  act08_corp_cd |
| `act12_journal_map.selectByTrType` | `server/act/mapper/act12_journal_map.xml:44` | - | ERROR:  column "act11_tr_type" does not exist — LINE 12:            AND act11_tr_type       = NULL |
| `adv02_account.selectIcamAccount` | `server/adv/mapper/adv02_account.xml:35` | - | ERROR:  relation "szm0fd" does not exist — LINE 8:       FROM szm0fd fd |
| `adv02_account.selectIcamTrCorp` | `server/adv/mapper/adv02_account.xml:52` | - | ERROR:  relation "szx2mm" does not exist — LINE 3:       FROM szx2mm |
| `adv10_book.selectIcamBook` | `server/adv/mapper/adv10_book.xml:30` | - | ERROR:  relation "uzm0ui" does not exist — LINE 21:       FROM uzm0ui book |
| `apr01_appr.selectAplyListByEmpId` | `server/apr/mapper/apr01_appr.xml:1077` | - | ERROR:  function f_apr_get_position_nm(numeric, timestamp without time zone) does not exist — LINE 4:      , f_apr_get_position_nm(apr04_step_emp_id, apr04_appr_d... |
| `apr01_appr.selectByEmpId` | `server/apr/mapper/apr01_appr.xml:925` | - | ERROR:  function to_date(timestamp without time zone, unknown) does not exist — LINE 7:    AND to_date(a.apr01_reg_date, 'yyyy-MM-dd') BETWEEN NULL ... |
| `apr06_appr_step_rule.selectByApprovalTypeCode` | `server/apr/mapper/apr06_appr_step_rule.xml:38` | - | ERROR:  function f_apr_get_approval(unknown, timestamp without time zone, character varying) does not exist — LINE 2:      , f_apr_get_approval(NULL, f_sysdate(), apr06_appr_line... |
| `apr20_relate_ics.selectByClassTreeId` | `server/apr/mapper/apr20_relate_ics.xml:87` | - | ERROR:  missing FROM-clause entry for table "c" — LINE 6:   , c.sch03_note           AS apr20_deadline_note |
| `apr22_relate_icr.selectByClassTreeId` | `server/apr/mapper/apr22_relate_icr.xml:65` | - | ERROR:  missing FROM-clause entry for table "c" — LINE 6:   , c.sch03_note           AS apr22_deadline_note |
| `ast01_class_tree.selectIcamItem` | `server/ast/mapper/ast01_class_tree.xml:422` | - | ERROR:  relation "uzm0ui" does not exist — LINE 48:       FROM uzm0ui a |
| `att03_overtime_req.getConfirmList` | `server/att/mapper/att03_overtime_req.xml:292` | Att03_Tab_OvertimeReq | ERROR:  relation "att13_overtime_req_hist" does not exist — LINE 114:   LEFT OUTER JOIN att13_overtime_req_hist a13 ON a13.att13_o... |
| `att03_overtime_req.selectById` | `server/att/mapper/att03_overtime_req.xml:36` | MainFrame | ERROR:  relation "att13_overtime_req_hist" does not exist — LINE 115:   LEFT OUTER JOIN att13_overtime_req_hist a13 ON a13.att13_o... |
| `att13_overtime_req_hist.insert` | `server/att/mapper/att13_overtime_req_hist.xml:29` | Att03_Tab_OvertimeReq | ERROR:  relation "att13_overtime_req_hist" does not exist — LINE 2:   INTO att13_overtime_req_hist |
| `att13_overtime_req_hist.selectById` | `server/att/mapper/att13_overtime_req_hist.xml:15` | - | ERROR:  relation "att13_overtime_req_hist" does not exist — LINE 2:   FROM  att13_overtime_req_hist |
| `att13_overtime_req_hist.selectByOvertimeReqId` | `server/att/mapper/att13_overtime_req_hist.xml:22` | Att03_Tab_OvertimeReq | ERROR:  relation "att13_overtime_req_hist" does not exist — LINE 2:   FROM  att13_overtime_req_hist |
| `att13_overtime_req_hist.updateInfo` | `server/att/mapper/att13_overtime_req_hist.xml:49` | Att03_Tab_OvertimeReq | ERROR:  relation "att13_overtime_req_hist" does not exist — LINE 1: EXPLAIN UPDATE att13_overtime_req_hist |
| `bbs01_board.selectByTypeCode` | `server/bbs/mapper/bbs01_board.xml:62` | - | ERROR:  column "bbs01_write_user" does not exist — LINE 6:  where bbs01_write_user = sys02_user_id |
| `bbs02_notice.selectByTabBorder` | `server/bbs/mapper/bbs02_notice.xml:772` | - | ERROR:  column "bbs02_send_type_cd" does not exist — LINE 15:    AND bbs02_send_type_cd = '전체공지' |
| `biz20_fee_charge.selectByContCorpId` | `server/biz/mapper/biz20_fee_charge.xml:242` | - | ERROR:  column "biz20_calc_start_date" does not exist — LINE 24: ...                            WHERE 'Y' = CASE WHEN biz20_calc... |
| `biz50_erp_setup.selectDefaultData` | `server/biz/mapper/biz50_erp_setup.xml:66` | - | ERROR:  column "biz50_start_date" does not exist — LINE 23:       ORDER BY biz50_start_date |
| `chk03_daily_list_write.selectDailyListStatusPaging` | `server/chk/mapper/chk03_daily_list_write.xml:128` | Chk03_Tab_DailyListConfirm, Chk03_Tab_DailyListStatus | ERROR:  column "sch22_confirmer_id" does not exist — LINE 4:                          ,  COALESCE(sch22_confirmer_id, f_g... |
| `chk03_daily_list_write.selectDailyListStatusPagingTotal` | `server/chk/mapper/chk03_daily_list_write.xml:168` | Chk03_Tab_DailyListConfirm, Chk03_Tab_DailyListStatus | ERROR:  column "sch22_confirmer_id" does not exist — LINE 4:                          ,  COALESCE(sch22_confirmer_id, f_g... |
| `com01_relate_appr.checkUseRelateApprId` | `server/com/mapper/com01_relate_appr.xml:53` | - | ERROR:  function f_check_use_relate_appr_id(unknown) does not exist — LINE 1: EXPLAIN SELECT f_check_use_relate_appr_id(NULL); |
| `dbConfig.getColumnList` | `server/utils/db/mapper/DBConfig.xml:95` | - | ERROR:  relation "cols" does not exist — LINE 5:   FROM cols |
| `dcr01_class_tree.selectByDcrDown1Bang` | `server/dcr/mapper/dcr01_class_tree.xml:739` | Fbx01_Tab_BoxDocument | ERROR:  column "org01_code_id" does not exist — LINE 111:      INNER JOIN dcr03_org_auth ON org01_code_id = dcr03_org_... |
| `dcr01_class_tree.selectByDcrTreeId` | `server/dcr/mapper/dcr01_class_tree.xml:669` | - | ERROR:  column "level" does not exist — LINE 14:   , level                     AS dcr01_level |
| `dcr21_relate_icr.selectByToDoList` | `server/dcr/mapper/dcr21_relate_icr.xml:81` | - | ERROR:  relation "sch05_relate_icr" does not exist — LINE 34:       FROM  sch05_relate_icr a |
| `emp00_trans_info.selectOrgLeaderByEmpId` | `server/emp/mapper/emp00_trans_info.xml:187` | - | ERROR:  function f_apr_get_approval(numeric, unknown, unknown) does not exist — LINE 8:           SELECT f_apr_get_approval(emp00_person_id, NULL, N... |
| `emp03_trans.selectByLoginId` | `server/emp/mapper/emp03_trans.xml:178` | - | ERROR:  column "emp01_company_id" does not exist — LINE 3: ...   INNER JOIN sys01_company ON sys01_company_id = emp01_comp... |
| `fnd01_fund_code.selectIcamFundInfo` | `server/fnd/mapper/fnd01_fund_code.xml:753` | - | ERROR:  relation "szm0fd" does not exist — LINE 12:       from szm0fd |
| `fnd03_consignment.selectIcamConsignment` | `server/fnd/mapper/fnd03_consignment.xml:107` | - | ERROR:  relation "szx0st" does not exist — LINE 3:       FROM szx0st |
| `fnd05_memeco.selectByCodeName` | `server/fnd/mapper/fnd05_memeco.xml:15` | - | ERROR:  relation "fnd05_memeco" does not exist — LINE 2:  from fnd05_memeco |
| `fnd06_office_work.selectIcamOfficeWork` | `server/fnd/mapper/fnd06_office_work.xml:110` | - | ERROR:  relation "szx0gr" does not exist — LINE 4:       FROM szx0gr |
| `fnd09_trust_bank.selectIcamTrustBank` | `server/fnd/mapper/fnd09_trust_bank.xml:107` | - | ERROR:  relation "szx2mm" does not exist — LINE 4:       FROM szx2mm |
| `fnd10_book.selectIcamBook` | `server/fnd/mapper/fnd10_book.xml:93` | - | ERROR:  relation "uzm0ui" does not exist — LINE 23:       FROM uzm0ui book |
| `icam00_common.selectICAM2700` | `server/icam/mapper/icam00_common.xml:17` | - | ERROR:  relation "szm0fd_yej" does not exist — LINE 12:           FROM szm0fd_yej |
| `icam01_data_info.selectIcamInfoData` | `server/icam/mapper/icam01_data_info.xml:45` | - | ERROR:  relation "asseterp_gr" does not exist — LINE 5:           FROM asseterp_gr; |
| `icam06_fund_book.selectIcamFundBook` | `server/icam/mapper/icam06_fund_book.xml:151` | - | ERROR:  relation "szm0fd" does not exist — LINE 20:       FROM szm0fd fund |
| `icam10_fee.selectFundMngFeeIcamData` | `server/icam/mapper/icam10_fee.xml:252` | - | ERROR:  relation "uzm0ac" does not exist — LINE 21:           FROM uzm0ac j |
| `icam10_fee.selectOfficeMngFeeIcamData` | `server/icam/mapper/icam10_fee.xml:172` | - | ERROR:  relation "uzm0ac" does not exist — LINE 21:           FROM uzm0ac j |
| `icam10_fee.selectOfficeMngFeeIcamData2` | `server/icam/mapper/icam10_fee.xml:292` | - | ERROR:  relation "szx0dt" does not exist — LINE 25:             FROM szx0dt dt |
| `icam10_fee.selectOfficeMngFeeIcamData3` | `server/icam/mapper/icam10_fee.xml:335` | - | ERROR:  relation "sat0fa" does not exist — LINE 15:                    FROM sat0fa t1 |
| `icam10_fee.selectOfficeMngFeeIcamDataRe` | `server/icam/mapper/icam10_fee.xml:210` | - | ERROR:  relation "uzm0ac" does not exist — LINE 21:           FROM uzm0ac j |
| `icam10_fee.selectOfficeMngStartDate` | `server/icam/mapper/icam10_fee.xml:359` | - | ERROR:  relation "szx0aa" does not exist — LINE 12:               FROM szx0aa a |
| `icam12_fee_book.selectLastDayFeeIcamData` | `server/icam/mapper/icam12_fee_book.xml:62` | - | ERROR:  relation "uzm0cd" does not exist — LINE 19:           FROM uzm0cd j |
| `icam20_price.selectIcamFundPrice` | `server/icam/mapper/icam20_price.xml:91` | - | ERROR:  relation "pzm1ti" does not exist — LINE 10:           FROM pzm1ti prc |
| `icam20_price.selectIcamStkItemByListDate` | `server/icam/mapper/icam20_price.xml:106` | - | ERROR:  relation "sjm0jj" does not exist — LINE 4:           FROM sjm0jj |
| `icam20_price.selectIcamStkPrice` | `server/icam/mapper/icam20_price.xml:54` | - | ERROR:  relation "oms9jj" does not exist — LINE 10:           FROM oms9jj |
| `icam20_price.selectIcamStkPriceOld` | `server/icam/mapper/icam20_price.xml:71` | - | ERROR:  relation "sjt1tg" does not exist — LINE 10:           FROM sjt1tg prc |
| `icam25_ipo.selectIcamIpo` | `server/icam/mapper/icam25_ipo.xml:28` | - | ERROR:  relation "sjg1fc" does not exist — LINE 3:                          FROM sjg1fc t1 |
| `icam50_source.selectIcamAllSource` | `server/icam/mapper/icam50_source.xml:67` | - | ERROR:  column "line" does not exist — LINE 4:              , line     as icam50_line |
| `icr01_class_tree.selectByAll` | `server/icr/mapper/icr01_class_tree.xml:278` | - | ERROR:  missing FROM-clause entry for table "a" — LINE 10:     WHERE icr01_class_tree_id = a.icr01_parent_tree_id |
| `ics11_checklist_company.selectByChecklistIdStatus` | `server/ics/mapper/ics11_checklist_company.xml:167` | Ics15_Tab_ChecklistStatus | ERROR:  column "sch22_confirmer_id" does not exist — LINE 3:                  , CASE WHEN sch22_confirmer_id IS NOT NULL ... |
| `ics11_checklist_company.selectChecklistStatus` | `server/ics/mapper/ics11_checklist_company.xml:215` | Ics15_Tab_ChecklistStatus | ERROR:  column "sch22_confirmer_id" does not exist — LINE 3:                  , CASE WHEN sch22_confirmer_id IS NOT NULL ... |
| `ics11_checklist_company.selectChecklistStatusPaging` | `server/ics/mapper/ics11_checklist_company.xml:130` | Ics15_Tab_ChecklistConfirm, Ics15_Tab_ChecklistStatusDetail | ERROR:  column "sch22_confirmer_id" does not exist — LINE 3:                  , CASE WHEN sch22_confirmer_id IS NOT NULL ... |
| `ics11_checklist_company.selectChecklistStatusPagingTotal` | `server/ics/mapper/ics11_checklist_company.xml:201` | Ics15_Tab_ChecklistConfirm, Ics15_Tab_ChecklistStatusDetail | ERROR:  column "sch22_confirmer_id" does not exist — LINE 3:                  , CASE WHEN sch22_confirmer_id IS NOT NULL ... |
| `ics16_relate_appr.selectByConfirmerId` | `server/ics/mapper/ics16_relate_appr.xml:46` | Ics15_Tab_ChecklistConfirm | ERROR:  column "sch22_confirmer_id" does not exist — LINE 3:                  , CASE WHEN sch22_confirmer_id IS NOT NULL ... |
| `msc01_schedule.selectById` | `server/msc/mapper/msc01_schedule.xml:45` | Msc01_HTML_Week, Msc01_Tab_Schedule | ERROR:  function f_org_parent_org_id(numeric, timestamp without time zone, unknown) does not exist — LINE 4:        , f_org_nm(f_org_parent_org_id(msc01_org_code_id, msc... |
| `mvb01_booking.deleteBypickupId` | `server/mvb/mapper/mvb01_booking.xml:128` | - | ERROR:  relation "mvb01_booking" does not exist — LINE 2:    from mvb01_booking |
| `mvb01_booking.selectByDate` | `server/mvb/mapper/mvb01_booking.xml:57` | - | ERROR:  relation "mvb01_booking" does not exist — LINE 9: from mvb01_booking t1 |
| `mvb01_booking.selectById` | `server/mvb/mapper/mvb01_booking.xml:41` | - | ERROR:  relation "mvb01_booking" does not exist — LINE 7:   from mvb01_booking t1 |
| `mvb01_booking.selectByTimeCheck` | `server/mvb/mapper/mvb01_booking.xml:52` | - | ERROR:  function f_mvb01_booking_check(unknown, unknown, unknown, unknown) does not exist — LINE 1: EXPLAIN select f_mvb01_booking_check(NULL, NULL, NULL, NULL)... |
| `org01_code.checkUseOrgId` | `server/org/mapper/org01_code.xml:338` | Org01_Tab_OrgCode | ERROR:  function f_check_use_org_id(unknown) does not exist — LINE 1: EXPLAIN SELECT f_check_use_org_id(NULL); |
| `pay02_month.selectByTrans` | `server/pay/mapper/pay02_month.xml:316` | - | ERROR:  column "pay03_pay_yn" does not exist — LINE 21:    AND  pay03_pay_yn = 'true' |
| `pay09_relate_note.insert` | `server/pay/mapper/pay09_relate_note.xml:49` | - | ERROR:  column "pay05_relate_appr_id" of relation "pay09_relate_note" does not exist — LINE 3:   (  pay05_relate_appr_id |
| `pcd01_pickup.selectByTimeCheck` | `server/pcd/mapper/pcd01_pickup.xml:52` | - | ERROR:  function f_pcd01_pickup_check(unknown, unknown, unknown, unknown) does not exist — LINE 1: EXPLAIN select f_pcd01_pickup_check(NULL, NULL, NULL, NULL) ... |
| `pln02_plan.selectByEmpPlanFundId` | `server/pln/mapper/pln02_plan.xml:146` | - | ERROR:  missing FROM-clause entry for table "t6" — LINE 6:   , t6.* |
| `pln02_plan.selectByPlanFundId` | `server/pln/mapper/pln02_plan.xml:77` | - | ERROR:  missing FROM-clause entry for table "t6" — LINE 6:   , t6.* |
| `pln02_plan.selectByPlanFundName` | `server/pln/mapper/pln02_plan.xml:58` | - | ERROR:  column t2.pln01_fund_nm does not exist — LINE 15:  and  t2.pln01_fund_nm  like NULL |
| `pln03_Resrch.selectDetailInit` | `server/pln/mapper/pln03_resrch.xml:217` | - | ERROR:  function f_apr_get_approval(unknown, timestamp without time zone, character varying) does not exist — LINE 12:     , f_apr_get_approval(NULL, f_trunc(f_sysdate()), apr06_a... |
| `sch04_list.selectByCheckList` | `server/sch/mapper/sch04_list.xml:395` | Sch04_Tab_CheckList | ERROR:  column ics.confirm does not exist — LINE 142:                         COALESCE(ics.confirm,'false') = 'fal... |
| `sch22_write_group.selectByChecklistContentId` | `server/sch/mapper/sch22_write_group.xml:35` | Sch20_Tab_AddChecklist | ERROR:  column "sch22_confirmer_id" does not exist — LINE 10: ...N emp01_person b           ON b.emp01_person_id = sch22_conf... |
| `sch22_write_group.selectByCompanyId` | `server/sch/mapper/sch22_write_group.xml:26` | - | ERROR:  column "sch22_confirmer_id" does not exist — LINE 4: ...      LEFT JOIN emp01_person ON emp01_person_id = sch22_conf... |
| `sch22_write_group.selectById` | `server/sch/mapper/sch22_write_group.xml:18` | Sch20_Tab_AddChecklist | ERROR:  column "sch22_confirmer_id" does not exist — LINE 4: ...      LEFT JOIN emp01_person ON emp01_person_id = sch22_conf... |
| `sys01_company.updateJobDescEditable` | `server/sys/mapper/sys01_company.xml:121` | - | ERROR:  column "sys01_jobdesc_editable" of relation "sys01_company" does not exist — LINE 2:    SET sys01_jobdesc_editable = NULL |
| `sys09_code.selectByApplyDate` | `server/sys/mapper/sys09_code.xml:158` | - | ERROR:  column b.sys09_cd does not exist — LINE 8:               AND b.sys09_cd = a.sys09_cd |
| `sys95_manual.selectByCompanyId` | `server/sys/mapper/sys95_manual.xml:32` | - | ERROR:  column "emp01_person_id" does not exist — LINE 9:  ORDER BY sys10_reg_date DESC, emp01_person_id; |
| `sys95_manual.selectByPersonId` | `server/sys/mapper/sys95_manual.xml:44` | - | ERROR:  column "sys95_person_id" does not exist — LINE 8:  WHERE  sys95_person_id = NULL |
| `tdm30_role_allc.updateApprId` | `server/tdm/mapper/tdm30_role_allc.xml:260` | - | ERROR:  column "tdm30_appr_id" of relation "tdm30_role_allc" does not exist — LINE 2:    SET tdm30_appr_id = NULL |
| `tdm51_chck_org.selectApprContent` | `server/tdm/mapper/tdm51_chck_org.xml:387` | - | ERROR:  column "tdm54_occ_ym" does not exist — LINE 30:                                AND tdm54_occ_ym    != tdm51_... |
| `tdm51_chck_org.selectByOrgId` | `server/tdm/mapper/tdm51_chck_org.xml:128` | Tdm51_Tab_CheckOrg, Tdm52_Tab_CheckManl | ERROR:  column "tdm54_occ_ym" does not exist — LINE 112:                                       AND tdm54_occ_ym < tdm... |
| `tdm53_chck_exct.selectByExctId` | `server/tdm/mapper/tdm53_chck_exct.xml:62` | - | ERROR:  column "tdm51_exct_appr_status_cd" does not exist — LINE 7: ...             , CASE WHEN COUNT(*) = SUM(CASE WHEN tdm51_exct... |
| `tdm54_chck_insuff.countByChckApprCmntId` | `server/tdm/mapper/tdm54_chck_insuff.xml:401` | Tdm59_Tab_CheckAppr | ERROR:  column "tdm54_action_appr_ym" does not exist — LINE 10:    AND tdm54_action_appr_ym = NULL |
| `tdm54_chck_insuff.selectByChckApprCmntId` | `server/tdm/mapper/tdm54_chck_insuff.xml:86` | Tdm59_Tab_CheckAppr | ERROR:  column "tdm54_occ_ym" does not exist — LINE 35: ...                                              AND tdm54_occ_... |
| `tdm54_chck_insuff.selectByRegDate` | `server/tdm/mapper/tdm54_chck_insuff.xml:264` | Tdm54_Tab_CheckInsuff | ERROR:  column "tdm54_occ_ym" does not exist — LINE 5:              , tdm54_occ_ym                                 ... |
| `tdm54_chck_insuff.selectDashboardInsuff` | `server/tdm/mapper/tdm54_chck_insuff.xml:324` | Tdm50_Tab_Dashboard, Tdm50_Tab_DashboardExct, Tdm50_Tab_DashboardOrg | ERROR:  column "tdm54_occ_ym" does not exist — LINE 2:      , tdm54_occ_ym                                         ... |
| `tdm54_chck_insuff.selectPossibleYn` | `server/tdm/mapper/tdm54_chck_insuff.xml:431` | Tdm54_Tab_CheckInsuff | ERROR:  function f_get_tdminsuffpossibleyn(unknown) does not exist — LINE 1: EXPLAIN SELECT f_get_tdmInsuffPossibleYn(NULL); |
| `tdm54_chck_insuff.updateStatusCode2` | `server/tdm/mapper/tdm54_chck_insuff.xml:445` | Tdm51_Tab_CheckOrg | ERROR:  column "tdm54_action_appr_ym" of relation "tdm54_chck_insuff" does not exist — LINE 3:      , tdm54_action_appr_ym = NULL |
| `tdm59_chck_appr_cmnt.selectByApprEmpId` | `server/tdm/mapper/tdm59_chck_appr_cmnt.xml:68` | Tdm59_Tab_CheckAppr | ERROR:  column "tdm54_action_appr_ym" does not exist — LINE 95: ... SELECT SUM(CASE WHEN tdm54_status_cd >= '19' AND tdm54_acti... |

## DB 환경 차이

| SQL | 파일:줄 | 화면 | 오류 |
|:---|:---|:---|:---|
| `apr01_appr.selectByApprDate` | `server/apr/mapper/apr01_appr.xml:1699` | Apr01_Tab_StampSeq | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 60:   ORDER BY apr01_stamp_seq COLLATE "ko_KR.utf8" DESC; |
| `apr01_appr.selectByClassTreeId2` | `server/apr/mapper/apr01_appr.xml:139` | Dcr01_Tab_DcrClassModify | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 139:         , apr01_title collate "ko_KR.utf8" asc |
| `apr01_appr.selectBySubList` | `server/apr/mapper/apr01_appr.xml:1803` | Apr01_Tab_SubList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 29:             , apr01_doc_type_nm collate "ko_KR.utf8" asc |
| `apr01_appr.selectByText2` | `server/apr/mapper/apr01_appr.xml:357` | Dcr00_Tab_DocList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 245:    , dcr01_class_tree_nm collate "ko_KR.utf8" asc |
| `apr01_appr.selectByText2ExcelDownload` | `server/apr/mapper/apr01_appr.xml:561` | Dcr00_Tab_DocList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 264:    , dcr01_class_tree_nm collate "ko_KR.utf8" asc |
| `apr01_appr.selectByTotalList` | `server/apr/mapper/apr01_appr.xml:1765` | Apr01_Tab_TotalList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 35:     ORDER BY org_cd, person_nm collate "ko_KR.utf8" asc; |
| `apr15_repr_corp.selectByCompanyId` | `server/apr/mapper/apr15_repr_corp.xml:30` | Apr15_Tab_ReprCorp, Apr16_Tab_StampDocAppl, Apr16_Tab_StampDocManager | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 36:  ORDER BY apr15_corp_type, apr15_corp_nm COLLATE "ko_KR.utf8... |
| `apr16_stamp_doc.selectByApplType` | `server/apr/mapper/apr16_stamp_doc.xml:162` | Apr16_Tab_StampDocManager | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...RDER BY apr16_appl_type, apr16_stamp_repr_corp_nm COLLATE "k... |
| `apr16_stamp_doc.selectDocGroupSum` | `server/apr/mapper/apr16_stamp_doc.xml:192` | Apr16_Tab_StampDocManager | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...RDER BY apr16_appl_type, apr16_stamp_repr_corp_nm COLLATE "k... |
| `ast01_class_tree.selectByAssetType` | `server/ast/mapper/ast01_class_tree.xml:515` | Fnd10_Tab_RelateFnd | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 14:      ORDER BY ast01_class_tree_full_nm collate "ko_KR.utf8" ... |
| `ast01_class_tree.selectCorpAccount` | `server/ast/mapper/ast01_class_tree.xml:532` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 45: ...m_class_cd, ast01_item_s_class_seq, ast01_corp_nm collate "k... |
| `ast06_tr.selectDepn` | `server/ast/mapper/ast06_tr.xml:616` | Ast06_Tab_EvalDepn | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 64:   ORDER BY ast06_item_class_type_nm collate "ko_KR.utf8" des... |
| `ast06_tr.selectEvalList` | `server/ast/mapper/ast06_tr.xml:438` | Ast06_Tab_EvalFinance | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 174:      ORDER BY ast06_corp_nm collate "ko_KR.utf8" asc |
| `ast06_tr.selectFxEvalList` | `server/ast/mapper/ast06_tr.xml:562` | Ast06_Tab_FxEvalDeposit | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 111:      ORDER BY sys15_corp_nm collate "ko_KR.utf8", ast_seq; |
| `ast09_book.getHoldDate` | `server/ast/mapper/ast09_book.xml:548` | Ast09_Tab_FinanceBook, Ast09_Tab_FinanceForBook | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 150:          ORDER BY t.ast09_ast_class_nm collate "ko_KR.utf8" ... |
| `ast09_book.selectFinanceByHoldDate` | `server/ast/mapper/ast09_book.xml:243` | Ast09_Tab_FinanceBookOpr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 135:          ORDER BY ast09_keep_account_nm collate "ko_KR.utf8"... |
| `ast09_book.selectNoFxEval` | `server/ast/mapper/ast09_book.xml:459` | Act04_Tab_Close, Act04_Tab_GenLedger | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 76:          ORDER BY ast01_class_tree_nm collate "ko_KR.utf8" a... |
| `ast09_book.selectPreDepositByHoldDate` | `server/ast/mapper/ast09_book.xml:368` | Ast09_Tab_PreDepositBook | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 81:          ORDER BY ast09_ast_s_class_nm collate "ko_KR.utf8" ... |
| `ast13_book_depn.selectByDepnDate2` | `server/ast/mapper/ast13_book_depn.xml:99` | Ast13_Tab_DepnBook | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 49:      ORDER BY ast13_account_type_nm collate "ko_KR.utf8" asc |
| `ast13_book_depn.selectOfficeAssets` | `server/ast/mapper/ast13_book_depn.xml:198` | Ast13_Tab_OfficeAssets | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 31:      ORDER BY ast13_item_type collate "ko_KR.utf8" DESC |
| `bbs02_notice.selectPersonNotice` | `server/bbs/mapper/bbs02_notice.xml:395` | TabBorder | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 124: ...) over(order by bbs02_from_date desc, bbs02_title COLLATE "k... |
| `bbs02_notice.selectPersonNoticePaging` | `server/bbs/mapper/bbs02_notice.xml:404` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 124: ...) over(order by bbs02_from_date desc, bbs02_title COLLATE "k... |
| `bbs02_notice.selectPersonNoticePagingTotal` | `server/bbs/mapper/bbs02_notice.xml:414` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 124: ...) over(order by bbs02_from_date desc, bbs02_title COLLATE "k... |
| `bbs10_biz_share.selectByText` | `server/bbs/mapper/bbs10_biz_share.xml:27` | Bbs10_Tab_BizShare | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 9:  ORDER BY bbs10_date DESC, bbs10_content COLLATE "ko_KR.utf8... |
| `bbs21_floral_request_share.selectByFloralRequestId` | `server/bbs/mapper/bbs21_floral_request_share.xml:26` | Bbs20_Tab_FloralRequest | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 12:         , bbs21_org_nm COLLATE "ko_KR.utf8" |
| `biz01_promo.getHtmlData` | `server/biz/mapper/biz01_promo.xml:1438` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 15:   ORDER BY biz01_html_card_nm collate "ko_KR.utf8" asc; |
| `biz01_promo.selectByAccountName` | `server/biz/mapper/biz01_promo.xml:1893` | Biz01_Tab_EntertmExpenseReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 61:  ORDER BY biz01_provide_date, biz01_franchise_nm collate "ko... |
| `biz01_promo.selectByCompanyYear` | `server/biz/mapper/biz01_promo.xml:389` | Biz01_Tab_LimitCheckList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 79: ...Y biz01_provide_rcv_type, biz01_target_company_nm collate "k... |
| `biz01_promo.selectByMonthEntertmExpense` | `server/biz/mapper/biz01_promo.xml:1500` | Biz01_Tab_EntertmExpenseReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 43:                     biz01_emp_nm COLLATE "ko_KR.utf8" |
| `biz01_promo.selectByPersonYear` | `server/biz/mapper/biz01_promo.xml:226` | Biz01_Tab_LimitCheckList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 84: ...                        , biz01_target_company_nm collate "k... |
| `biz01_promo.selectByTargetCompanyName` | `server/biz/mapper/biz01_promo.xml:1959` | Biz01_Tab_EntertmExpenseReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 64:  ORDER BY biz01_provide_date, biz01_franchise_nm collate "ko... |
| `biz01_promo.selectByYear` | `server/biz/mapper/biz01_promo.xml:2185` | Biz01_Tab_CardReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 24:                     biz01_real_person_nm COLLATE "ko_KR.utf8... |
| `biz01_promo.selectCardContents` | `server/biz/mapper/biz01_promo.xml:912` | Biz01_Tab_CardContents, Biz01_Tab_CardContentsSimple | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 40: ...  ORDER BY biz01_provide_date, crd02_franchise_nm collate "k... |
| `biz01_promo.selectCardContentsDownload` | `server/biz/mapper/biz01_promo.xml:1022` | Biz01_Tab_CardContents | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 39: ...  ORDER BY biz01_provide_date, crd02_franchise_nm collate "k... |
| `biz01_promo.selectCardContentsPaging` | `server/biz/mapper/biz01_promo.xml:957` | Biz01_Tab_CardContents, Biz01_Tab_CardContentsSimple | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 40: ...  ORDER BY biz01_provide_date, crd02_franchise_nm collate "k... |
| `biz01_promo.selectMonthAmt` | `server/biz/mapper/biz01_promo.xml:2027` | Biz01_Tab_CardReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 84:             , e.biz01_emp_nm COLLATE "ko_KR.utf8") t |
| `biz01_promo.selectMonthAmt2` | `server/biz/mapper/biz01_promo.xml:2120` | Biz01_Tab_CardReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 59:        , biz01_emp_nm COLLATE "ko_KR.utf8"; |
| `biz01_promo.selectProvideList` | `server/biz/mapper/biz01_promo.xml:537` | Biz01_Tab_PriorApproval | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 34: ...VER (ORDER BY biz01_provide_date, biz01_person_nm collate "k... |
| `biz01_promo.selectProvideListSimple` | `server/biz/mapper/biz01_promo.xml:666` | Biz01_Tab_PriorApprovalSimple | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 26: ...ORDER BY biz01_provide_rcv_type, biz01_reg_emp_nm collate "k... |
| `biz20_fee_charge.getChargeDate` | `server/biz/mapper/biz20_fee_charge.xml:187` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...N SELECT row_number() OVER(ORDER BY sys15_corp_nm collate "k... |
| `biz20_fee_charge.selectByChargeDate` | `server/biz/mapper/biz20_fee_charge.xml:103` | Biz20_Tab_FeeCharge | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...N SELECT row_number() OVER(ORDER BY sys15_corp_nm collate "k... |
| `bmt12_pc_history.selectByCompanyId` | `server/bmt/mapper/bmt12_pc_history.xml:36` | Bmt12_Tab_PcList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 25: ...erson_nm = '' THEN '히' ELSE bmt12_person_nm END) COLLATE "k... |
| `bmt12_pc_history.selectEmpICT` | `server/bmt/mapper/bmt12_pc_history.xml:76` | Bmt12_Tab_EmpIct | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...SELECT ROW_NUMBER() OVER(ORDER BY bmt12_person_nm COLLATE "k... |
| `chk01_class_tree.selectByCompanyId` | `server/chk/mapper/chk01_class_tree.xml:43` | Chk02_Tab_DailyList, Chk02_Tab_DailyListAdmin, Chk03_Tab_DailyListConfirm, Chk03_Tab_DailyListStatus, Chk03_Tab_DailyListWrite | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 8:  ORDER BY chk01_seq, chk01_class_tree_nm collate "ko_KR.utf8... |
| `chk01_class_tree.selectByParentId` | `server/chk/mapper/chk01_class_tree.xml:35` | Chk01_Tab_ClassTree | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 5:  ORDER BY chk01_seq, chk01_class_tree_nm collate "ko_KR.utf8... |
| `chk02_daily_list.selectByPersonId` | `server/chk/mapper/chk02_daily_list.xml:102` | Chk03_Tab_DailyListWrite | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 95:  ORDER BY chk01_seq, chk01_class_tree_nm collate "ko_KR.utf8... |
| `crd03_trans.selectByYear` | `server/crd/mapper/crd03_trans.xml:119` | Biz01_Tab_CardReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 13: ...on_nm = '공통' THEN 1 ELSE 0 END, crd03_person_nm COLLATE "k... |
| `crd10_excel_company.selectByCompanyId` | `server/crd/mapper/crd10_excel_company.xml:22` | Crd10_Tab_ExcelCompanyAdmin | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 5:  ORDER BY crd10_bank_cd collate "ko_KR.utf8" asc; |
| `crm09_contact.selectBiz02Company` | `server/crm/mapper/crm09_contact.xml:155` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...ROW_NUMBER() OVER (ORDER BY seq, crm09_contact_nm collate "k... |
| `crm09_contact.selectBiz02Emp` | `server/crm/mapper/crm09_contact.xml:174` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...ROW_NUMBER() OVER (ORDER BY seq, crm09_contact_nm collate "k... |
| `crm09_contact.selectByCompanyName` | `server/crm/mapper/crm09_contact.xml:134` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 8:  ORDER BY crm09_contact_nm collate "ko_KR.utf8" asc; |
| `crm09_contact.selectByName` | `server/crm/mapper/crm09_contact.xml:81` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 13:  ORDER BY crm09_item_type_cd, crm09_contact_nm collate "ko_K... |
| `crm09_contact.selectByNamePaging` | `server/crm/mapper/crm09_contact.xml:103` | Crm09_Tab_ContactPointTreeGrid | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 34:  ORDER BY crm09_contact_nm collate "ko_KR.utf8" asc |
| `crm09_contact.selectKeyInCompanyName` | `server/crm/mapper/crm09_contact.xml:145` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ... ROW_NUMBER() OVER(ORDER BY biz01_provide_company collate "k... |
| `crm12_work_detail.selectByContactId` | `server/crm/mapper/crm12_work_detail.xml:78` | Crm09_Tab_ContactPointTreeGrid | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 60:  ORDER BY crm12_work_date DESC, crm12_contact_nm COLLATE "ko... |
| `crm12_work_detail.selectByRegDate` | `server/crm/mapper/crm12_work_detail.xml:131` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 70:  ORDER BY crm12_work_nm COLLATE "ko_KR.utf8"; |
| `crm14_share_default.selectByContactId` | `server/crm/mapper/crm14_share_default.xml:28` | Crm09_Tab_ContactPointTreeGrid | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 11:         , crm14_org_nm COLLATE "ko_KR.utf8" |
| `crm15_share.selectByWorkDetailId` | `server/crm/mapper/crm15_share.xml:29` | Crm09_Tab_ContactPointTreeGrid | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 12:         , crm15_org_nm COLLATE "ko_KR.utf8" |
| `dcr00_doc_list.selectByText` | `server/dcr/mapper/dcr00_doc_list.xml:243` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 233:         , dcr01_class_tree_nm collate "ko_KR.utf8" asc |
| `emp01_person.selectByCompanyId` | `server/emp/mapper/emp01_person.xml:96` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 18:  ORDER BY emp01_company_nm collate "ko_KR.utf8" ASC |
| `emp01_person.selectByCompanyIdPaging` | `server/emp/mapper/emp01_person.xml:202` | Sms03_Tab_SendAdmin | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 3:    , ROW_NUMBER() OVER (ORDER BY sys01_company_nm COLLATE "k... |
| `emp01_person.selectByLoginUserPaging` | `server/emp/mapper/emp01_person.xml:251` | Sys86_Tab_Websocket | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 3:    , ROW_NUMBER() OVER (ORDER BY sys01_company_nm COLLATE "k... |
| `emp01_person.selectBySearchTextPaging` | `server/emp/mapper/emp01_person.xml:120` | Emp01_Tab_UserInfo | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 3:    , ROW_NUMBER() OVER (ORDER BY sys01_company_nm COLLATE "k... |
| `emp08_license.selectByHistory` | `server/emp/mapper/emp08_license.xml:49` | Emp00_Tab_ChangeHistory | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 42:  ORDER BY emp08_emp_kor_nm COLLATE "ko_KR.utf8" |
| `emp10_addr_book.selectByPublicText` | `server/emp/mapper/emp10_addr_book.xml:49` | Emp10_Tab_PublicAddrBook | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 15:  ORDER BY emp10_contacter_nm collate "ko_KR.utf8" asc; |
| `emp10_addr_book.selectByText` | `server/emp/mapper/emp10_addr_book.xml:36` | Emp10_Tab_AddrBook | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 10:  ORDER BY emp10_contacter_nm collate "ko_KR.utf8" asc; |
| `emp31_director.selectByTextReport` | `server/emp/mapper/emp31_director.xml:121` | Emp31_Tab_Director, RDViewer | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 39:               , tdm35_task_nm COLLATE "ko_KR.utf8" AS tdm35_... |
| `emp33_except_biz.selectByExceptBizCode` | `server/emp/mapper/emp33_except_biz.xml:31` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 9:  ORDER BY emp33_start_date, emp00_kor_nm COLLATE "ko_KR.utf8... |
| `emp43_eval_target.selectByTermCode` | `server/emp/mapper/emp43_eval_target.xml:204` | Emp43_Tab_EvalTarget | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 65:  ORDER BY emp43_org_nm COLLATE "ko_KR.utf8" |
| `emp43_eval_target.selectByTextAdmin` | `server/emp/mapper/emp43_eval_target.xml:400` | Emp43_Tab_EvalResult, Emp43_Tab_FinalAppr, Emp43_Tab_FirstAppr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 195:  ORDER BY emp43_org_nm COLLATE "ko_KR.utf8" |
| `emp43_eval_target.selectByTextAdminAll` | `server/emp/mapper/emp43_eval_target.xml:604` | Emp43_Tab_EvalResult | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 192:    , emp43_org_nm COLLATE "ko_KR.utf8" |
| `emp55_benefit_info.selectByCompanyId` | `server/emp/mapper/emp55_benefit_info.xml:47` | Emp17_Tab_BenefitManager | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 6:  ORDER BY emp55_benefit_cd collate "ko_KR.utf8" asc; |
| `emp90_notice.selectByPersonId` | `server/emp/mapper/emp90_notice.xml:22` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 14:  ORDER BY emp90_notice_keyword COLLATE "ko_KR.utf8" DESC; |
| `flt03_account.getFamilyAccount` | `server/flt/mapper/flt03_account.xml:119` | Flt10_Tab_RealTransaction | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 26:    ORDER BY flt03_setup_date, sys15_corp_nm collate "ko_KR.u... |
| `flt03_account.selectByAccountNo` | `server/flt/mapper/flt03_account.xml:245` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 19:    ORDER BY flt03_setup_date, sys15_corp_nm collate "ko_KR.u... |
| `flt03_account.selectByDate` | `server/flt/mapper/flt03_account.xml:149` | Flt00_Tab_Info, Flt02_Tab_EmpInfo, Flt03_Tab_AccountAdmin, Flt03_Tab_AccountReport, Flt10_Tab_AcntTransfer, Flt10_Tab_BuyReport, Flt10_Tab_RealTransaction, Flt10_Tab_RightsExercise, Flt10_Tab_SellReport, Flt11_Tab_BookList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 39:      , sys15_corp_nm collate "ko_KR.utf8" asc |
| `flt03_account.selectByPersonId` | `server/flt/mapper/flt03_account.xml:82` | Flt03_Tab_AccountReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 34:    ORDER BY flt03_setup_date, sys15_corp_nm collate "ko_KR.u... |
| `flt03_account.selectByStdDate` | `server/flt/mapper/flt03_account.xml:205` | Flt10_Tab_CeoReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 37:  ORDER BY emp00_kor_nm collate "ko_KR.utf8" asc, apr01_effec... |
| `flt06_account_close.selectByPersonId` | `server/flt/mapper/flt06_account_close.xml:45` | Flt03_Tab_AccountReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 19:  ORDER BY flt03_setup_date, sys15_corp_nm collate "ko_KR.utf... |
| `flt10_tr.selectByPeriod` | `server/flt/mapper/flt10_tr.xml:628` | Flt10_Tab_RealTransaction | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 103: ...10_tr_date) desc, flt10_account_no, flt10_item_nm collate "k... |
| `flt10_tr.selectByStdDate` | `server/flt/mapper/flt10_tr.xml:996` | Flt10_Tab_CeoReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 122:  ORDER BY emp01_kor_nm collate "ko_KR.utf8" asc; |
| `flt10_tr.selectByStdDate2` | `server/flt/mapper/flt10_tr.xml:1016` | Flt10_Tab_CeoReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 207:   order by flt10_person_nm collate "ko_KR.utf8" asc; |
| `flt10_tr.selectByTrList` | `server/flt/mapper/flt10_tr.xml:445` | Flt10_Tab_TrList, Flt10_Tab_TrListAdmin | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 115:      ORDER BY flt10_org_nm collate "ko_KR.utf8" asc |
| `flt10_tr.selectItemName` | `server/flt/mapper/flt10_tr.xml:378` | Flt00_Tab_Info, Flt03_Tab_AccountReport, Flt10_Tab_BuyReport, Flt10_Tab_RealTransaction, Flt10_Tab_RightsExercise, Flt11_Tab_BookList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: EXPLAIN SELECT ROW_NUMBER() OVER(ORDER BY item_nm collate "k... |
| `flt11_book.selectByBookList` | `server/flt/mapper/flt11_book.xml:242` | Flt11_Tab_BookList, Flt11_Tab_BookListAdmin | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 61:      ORDER BY flt11_org_nm collate "ko_KR.utf8" asc |
| `flt11_book.selectByDate` | `server/flt/mapper/flt11_book.xml:316` | Flt10_Tab_RealTransaction | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 56:      ORDER BY corp_nm collate "ko_KR.utf8" asc |
| `flt11_book.selectByText` | `server/flt/mapper/flt11_book.xml:72` | Flt10_Tab_AcntTransfer, Flt10_Tab_RealTransaction, Flt10_Tab_RightsExercise, Flt10_Tab_SellReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 45:      ORDER BY flt11_account_no, flt11_item_nm collate "ko_KR... |
| `flt11_book.selectByText2` | `server/flt/mapper/flt11_book.xml:122` | Flt10_Tab_AcntTransfer, Flt10_Tab_RealTransaction, Flt10_Tab_RightsExercise, Flt10_Tab_SellReport | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 117:      ORDER BY flt11_account_no, flt11_item_nm collate "ko_KR... |
| `flt12_book_month.selectByBookDate` | `server/flt/mapper/flt12_book_month.xml:49` | Flt10_Tab_RealTransaction | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 52: ..., flt12_book_date, flt12_item_type, flt12_item_nm collate "k... |
| `fnd01_fund_code.selectByCompanyId` | `server/fnd/mapper/fnd01_fund_code.xml:310` | Fnd10_Tab_RelateAst | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 34:      ORDER BY fnd02_fund_nm collate "ko_KR.utf8" asc; |
| `fnd10_book.selectByRelateAst` | `server/fnd/mapper/fnd10_book.xml:42` | Fnd10_Tab_RelateAst | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 14:  ORDER BY fnd10_item_full_nm collate "ko_KR.utf8" asc; |
| `fnd30_opr.selectByDate` | `server/fnd/mapper/fnd30_opr.xml:57` | Fnd30_Tab_Opr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 13: ...ER BY fnd30_subscription_date DESC, fnd30_item_nm collate "k... |
| `fnd30_opr.selectByDemandDate` | `server/fnd/mapper/fnd30_opr.xml:91` | Fnd30_Tab_DemandOpr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 14:         , fnd30_item_nm collate "ko_KR.utf8" asc; |
| `fnd30_opr.selectByDemandOprCode` | `server/fnd/mapper/fnd30_opr.xml:108` | Fnd30_Tab_Opr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 20: ...ER BY fnd30_subscription_date DESC, fnd30_item_nm collate "k... |
| `frm01_list.selectCalendar` | `server/frm/mapper/frm01_list.xml:107` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1172: ...) over(order by bbs02_from_date desc, bbs02_title COLLATE "k... |
| `frm01_list.selectIcsNotice` | `server/frm/mapper/frm01_list.xml:1779` | TabBorder | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 3:                                   , frm01_title collate "ko_... |
| `frm01_list.selectToDoList` | `server/frm/mapper/frm01_list.xml:1087` | TabBorder | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 2: ...                            , frm01_biz_notice_nm collate "k... |
| `mkt01_target_company.selectByCompanyIdPaging` | `server/mkt/mapper/mkt01_target_company.xml:109` | Mkt01_Tab_TargetCompany | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 36:  ORDER BY mkt01_target_company_nm collate "ko_KR.utf8" asc |
| `mkt01_target_company.selectBySearchText` | `server/mkt/mapper/mkt01_target_company.xml:133` | Mkt01_Tab_TargetCompany | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...ow_number() over(ORDER BY mkt01_target_company_nm collate "k... |
| `mkt01_target_company.selectBySearchTextPaging` | `server/mkt/mapper/mkt01_target_company.xml:157` | Mkt01_Tab_TargetCompany | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...ow_number() over(ORDER BY mkt01_target_company_nm collate "k... |
| `mkt01_target_company.selectFavoritePaging` | `server/mkt/mapper/mkt01_target_company.xml:215` | Mkt01_Tab_TargetCompany | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...ow_number() over(ORDER BY mkt01_target_company_nm collate "k... |
| `mkt01_target_company.selectManagerPaging` | `server/mkt/mapper/mkt01_target_company.xml:199` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 29:  ORDER BY mkt01_target_company_nm collate "ko_KR.utf8" asc |
| `mkt01_target_company.selectTargetCompanyPaging` | `server/mkt/mapper/mkt01_target_company.xml:185` | Mkt03_Tab_HistoryManager | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 13:  ORDER BY mkt01_target_company_nm collate "ko_KR.utf8" asc |
| `mkt02_manager.selectByTargetCompanyId` | `server/mkt/mapper/mkt02_manager.xml:25` | Mkt01_Tab_TargetCompany | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 4:  ORDER BY mkt02_manager_nm collate "ko_KR.utf8" asc; |
| `mkt03_history.selectByRegDate` | `server/mkt/mapper/mkt03_history.xml:166` | TabBorder | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 63:  ORDER BY mkt03_activity_title COLLATE "ko_KR.utf8"; |
| `mkt03_history.selectByTargetCompanyId` | `server/mkt/mapper/mkt03_history.xml:82` | Mkt01_Tab_TargetCompany, Mkt03_Tab_HistoryManager | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 65: ...mkt03_activity_date DESC, mkt03_target_company_nm COLLATE "k... |
| `pay50_expense.selectByDateConfirm` | `server/pay/mapper/pay50_expense.xml:229` | Pay50_Tab_ExpenseConfirm | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 56:  ORDER BY pay50_occ_date DESC, pay50_reg_emp_nm collate "ko_... |
| `pay50_expense.selectExpenseAccountSum` | `server/pay/mapper/pay50_expense.xml:1076` | Pay50_Tab_AccountSumList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 122: ... row_number() over(ORDER BY seq, pay50_account_nm COLLATE "k... |
| `pay50_expense.selectNewExpenseAppr` | `server/pay/mapper/pay50_expense.xml:458` | Pay50_Tab_ExpenseJournal, Pay50_Tab_ExpensePayWrite | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 436: ...ate, pay50_occ_date, pay50_expense_cd, pay50_desc collate "k... |
| `sch01_info.selectByCloseDate` | `server/sch/mapper/sch01_info.xml:553` | Sch01_Tab_List | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...ROW_NUMBER() OVER(ORDER BY close_date, seq, title COLLATE "k... |
| `sch01_info.selectByManagerId` | `server/sch/mapper/sch01_info.xml:1069` | Sch01_Tab_Info | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 13:  ORDER BY COALESCE(sch08_seq,999), sch01_title COLLATE "ko_K... |
| `sch01_info.selectByOrg` | `server/sch/mapper/sch01_info.xml:845` | Sch01_Tab_ListOrg | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 245:  ORDER BY sch01_close_date, sch01_org_nm COLLATE "ko_KR.utf8... |
| `sch01_info.selectByText` | `server/sch/mapper/sch01_info.xml:108` | Sch01_Tab_Info | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 83: ...08_seq,999), sch01_use_yn DESC, sch01_deadline_nm COLLATE "k... |
| `sch01_info.selectMyPageOrgSchedule` | `server/sch/mapper/sch01_info.xml:819` | TabBorder | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 247:  ORDER BY sch01_org_nm COLLATE "ko_KR.utf8", seq, sch01_titl... |
| `sch01_info.selectMyPageSchedule` | `server/sch/mapper/sch01_info.xml:243` | TabBorder | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...LAIN SELECT ROW_NUMBER() OVER(ORDER BY seq, title COLLATE "k... |
| `sch01_info.selectMyPageSchedulePaging` | `server/sch/mapper/sch01_info.xml:349` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...LAIN SELECT ROW_NUMBER() OVER(ORDER BY seq, title COLLATE "k... |
| `sch04_list.selectByIcs` | `server/sch/mapper/sch04_list.xml:792` | Sch04_Tab_IcsList, Sch04_Tab_IcsListManager | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 343:      ORDER BY sch04_close_date, sch04_title COLLATE "ko_KR.u... |
| `sch04_list.selectByManagerId` | `server/sch/mapper/sch04_list.xml:109` | MainFrame, Sch04_Tab_DailyCheckList, Sch04_Tab_List, Sch04_Tab_ToDoList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 227:         , title COLLATE "ko_KR.utf8"; |
| `sch04_list.selectCheckListStatus` | `server/sch/mapper/sch04_list.xml:360` | Sch04_Tab_DailyCheckListStatus | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 30:      ORDER BY sch04_manage_date, seq, sch04_title COLLATE "k... |
| `sch14_ipo_mismatch.selectByCheckYn` | `server/sch/mapper/sch14_ipo_mismatch.xml:35` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 6:      ORDER BY sch14_stk_nm COLLATE "ko_KR.utf8", sch14_inser... |
| `sys10_file.deleteCheck` | `server/sys/mapper/sys10_file.xml:123` | Icam55_Tab_UserRegAppr, Tdm52_Tab_CheckManl | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 4: ...ESCE(sys10_title_yn, 'false') DESC, sys10_file_nm COLLATE "k... |
| `sys10_file.getTdmCheckFormFile` | `server/sys/mapper/sys10_file.xml:258` | Tdm43_Tab_RelateFormFileUpload | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 8:         , sys10_file_nm COLLATE "ko_KR.utf8" |
| `sys10_file.selectByAdminYn` | `server/sys/mapper/sys10_file.xml:105` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 15: ...ESCE(sys10_title_yn, 'false') DESC, sys10_file_nm COLLATE "k... |
| `sys10_file.selectByParentId` | `server/sys/mapper/sys10_file.xml:85` | Bbs02_Tab_NoticeAdmin, Bbs02_Tab_NoticeManager, Bbs15_Tab_CompanyRule, Bbs15_Tab_CompanyRuleManager, Bbs20_Tab_FloralRequestMng, Bbs30_Tab_ClassTree, Biz01_Tab_Card, Biz01_Tab_CardContents, Biz01_Tab_CardContentsSimple, Biz01_Tab_CardManagement, Biz01_Tab_CardSimple, Biz01_Tab_Other, Biz01_Tab_OtherSimple, Biz10_Tab_ContCorp, Biz60_Tab_FundPriceModiReport, Crm02_Tab_Inspection, Crm02_Tab_InspectionManager, Crm09_Tab_ContactPointTreeGrid, Est02_Tab_PfContract, Est03_Tab_PfHistory, Est03_Tab_PfHistoryConfirm, Fbx01_Tab_Document, Fbx01_Tab_Search, Fnd25_Tab_FundTerms, Fnd25_Tab_FundTermsManager, Icr01_Tab_ClassTree, Icr01_Tab_ClassTreeView, Ics01_Tab_ClassTree, Ics01_Tab_ClassTreeUser, Ics01_Tab_ClassTreeUserView, Ics17_Tab_UserRequest, Ics17_Tab_UserRequestAdmin, Ics35_Tab_ExtrActivity, PDFViewer, Pay50_Tab_Expense, Pay50_Tab_ExpenseManager, Pay50_Tab_ExpenseRequest, Sch01_Tab_Info, Scm01_Tab_DevMng, Scm01_Tab_Sr, Scm10_Tab_Dev, Scm11_Tab_DevTest, Scm13_Tab_Deploy, Scm30_Tab_Program, Sys01_Tab_Company, Sys90_Tab_AfterService, Sys90_Tab_AfterServiceAdmin, Tdm30_Tab_RoleAllc, Tdm31_Tab_RoleDesc, Tdm31_Tab_RoleDescAdmin, Tdm32_Tab_RoleDigm, Tdm32_Tab_RoleDigmAdmin, Tdm36_Tab_RoleReport, Tdm42_Tab_ManlManager, Tdm42_Tab_ManlManagerAdmin, Tdm42_Tab_ManlOrgAppr, Tdm50_Tab_CheckJob | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 13: ...ESCE(sys10_title_yn, 'false') DESC, sys10_file_nm COLLATE "k... |
| `sys10_file.selectByParentId2` | `server/sys/mapper/sys10_file.xml:130` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 33: ...ESCE(sys10_title_yn, 'false') DESC, sys10_file_nm COLLATE "k... |
| `sys10_file.selectByPrintYn` | `server/sys/mapper/sys10_file.xml:166` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 13: ...ESCE(sys10_title_yn, 'false') DESC, sys10_file_nm COLLATE "k... |
| `sys10_file.selectUnConnTdmFormFile` | `server/sys/mapper/sys10_file.xml:271` | Tdm42_Tab_ManlManager, Tdm42_Tab_ManlManagerAdmin, Tdm43_Tab_ManlItemList, Tdm43_Tab_ManlItemReg, Tdm50_Tab_Dashboard, Tdm50_Tab_DashboardExct, Tdm50_Tab_DashboardOrg, Tdm51_Tab_CheckOrg, Tdm52_Tab_CheckManl, Tdm54_Tab_CheckInsuff, Tdm59_Tab_CheckAppr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 14:         , sys10_file_nm COLLATE "ko_KR.utf8" |
| `sys11_relate_file.selectByParentId` | `server/sys/mapper/sys11_relate_file.xml:25` | Ics01_Tab_ClassTree, Ics01_Tab_ClassTreeUser, Ics01_Tab_ClassTreeUserView, Ics01_Tab_PeriodList, Tdm42_Tab_ManlManager, Tdm42_Tab_ManlManagerAdmin, Tdm43_Tab_ManlItemList, Tdm43_Tab_ManlItemReg, Tdm50_Tab_Dashboard, Tdm50_Tab_DashboardExct, Tdm50_Tab_DashboardOrg, Tdm51_Tab_CheckOrg, Tdm52_Tab_CheckManl, Tdm54_Tab_CheckInsuff, Tdm59_Tab_CheckAppr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 7:  ORDER BY sys10_reg_date DESC, sys10_file_nm COLLATE "ko_KR.... |
| `sys15_corp.selectByCompanyId` | `server/sys/mapper/sys15_corp.xml:37` | Sys15_Tab_Corp | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 19: ...pe, COALESCE(sys15_seq, 999999999), sys15_corp_nm collate "k... |
| `sys15_corp.selectByKFS` | `server/sys/mapper/sys15_corp.xml:149` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 14:  ORDER BY sys15_corp_type, sys15_corp_nm COLLATE "ko_KR.utf8... |
| `sys15_corp.selectByUseYn` | `server/sys/mapper/sys15_corp.xml:61` | Act02_Tab_ForJournal, Act02_Tab_Journal, Act02_Tab_JournalSub | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 61: ...pe, COALESCE(sys15_seq, 999999999), sys15_corp_nm collate "k... |
| `sys99_print.selectByWindowClassName` | `server/sys/mapper/sys99_print.xml:283` | Tdm50_Tab_DutyProgress, Tdm50_Tab_DutyProgressAdmin, Tdm50_Tab_DutyRecon, Tdm50_Tab_DutyReconAdmin | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 11:   , sys99_string01 COLLATE "ko_KR.utf8" |
| `tdm01_hr.selectByCompanyId` | `server/tdm/mapper/tdm01_hr.xml:71` | Tdm01_Tab_Hr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 23:  ORDER BY tdm01_pos_cd, tdm01_person_nm COLLATE "ko_KR.utf8"... |
| `tdm01_hr.selectByEndDate` | `server/tdm/mapper/tdm01_hr.xml:99` | Tdm30_Tab_RoleAllc, Tdm50_Tab_DashboardExct | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 14:  ORDER BY tdm01_pos_cd, tdm01_person_nm COLLATE "ko_KR.utf8"... |
| `tdm01_hr.selectPersonModifyed` | `server/tdm/mapper/tdm01_hr.xml:116` | Tdm01_Tab_Hr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 17:                                 , tdm01_person_nm COLLATE "k... |
| `tdm02_hr_record.selectChangeList` | `server/tdm/mapper/tdm02_hr_record.xml:76` | Tdm00_Tab_ChangeList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 7: ...                             , tdm14_task_type_nm COLLATE "k... |
| `tdm03_add_title.selectByPersonId` | `server/tdm/mapper/tdm03_add_title.xml:24` | Tdm01_Tab_Hr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 5:         , tdm03_add_title_nm COLLATE "ko_KR.utf8"; |
| `tdm05_cncl.selectByCompanyId` | `server/tdm/mapper/tdm05_cncl.xml:40` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 6:  ORDER BY tdm05_cncl_nm COLLATE "ko_KR.utf8", tdm05_open_cyc... |
| `tdm05_cncl.selectByDate` | `server/tdm/mapper/tdm05_cncl.xml:49` | Tdm05_Tab_Cncl, Tdm20_Tab_Role | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 24:  ORDER BY tdm05_cncl_nm COLLATE "ko_KR.utf8", tdm05_open_cyc... |
| `tdm08_manager_info.selectByCompanyId` | `server/tdm/mapper/tdm08_manager_info.xml:36` | Tdm08_Tab_Manager | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...BER() OVER(ORDER BY manager_type_cd, tdm08_org_nm COLLATE "k... |
| `tdm09_appr_step.selectByCompanyId` | `server/tdm/mapper/tdm09_appr_step.xml:36` | Tdm09_Tab_ApprStep | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 25:  ORDER BY tdm09_role_nm COLLATE "ko_KR.utf8" |
| `tdm10_task.selectByText` | `server/tdm/mapper/tdm10_task.xml:56` | Tdm10_Tab_Task, Tdm20_Tab_Role, Tdm41_Tab_ManlDutyOrg, Tdm43_Tab_ManlItemReg | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 41:  ORDER BY tdm10_task_type_cd, tdm10_task_nm COLLATE "ko_KR.u... |
| `tdm12_task_relate_detail.selectByText` | `server/tdm/mapper/tdm12_task_relate_detail.xml:62` | Tdm13_Tab_TaskDuty | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 24:         , tdm10_task_nm COLLATE "ko_KR.utf8" |
| `tdm20_role.getCeoRoleList` | `server/tdm/mapper/tdm20_role.xml:184` | Tdm50_Tab_CheckJob | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 15:  ORDER BY tdm20_start_date, tdm20_role_nm COLLATE "ko_KR.utf... |
| `tdm20_role.selectByCompanyId` | `server/tdm/mapper/tdm20_role.xml:61` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 32:  ORDER BY tdm20_role_nm COLLATE "ko_KR.utf8" |
| `tdm20_role.selectByDate` | `server/tdm/mapper/tdm20_role.xml:99` | Tdm05_Tab_Cncl, Tdm09_Tab_ApprStep, Tdm20_Tab_Role, Tdm30_Tab_RoleAllc, Tdm40_Tab_ManlJob, Tdm41_Tab_ManlDutyOrg, Tdm43_Tab_ManlItemReg, Tdm54_Tab_CheckInsuff, Tdm59_Tab_CheckAppr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 48:  ORDER BY tdm20_role_nm COLLATE "ko_KR.utf8" |
| `tdm22_role_relate_cncl.selectByCnclId` | `server/tdm/mapper/tdm22_role_relate_cncl.xml:52` | Tdm05_Tab_Cncl | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 12:  ORDER BY tdm20_role_nm COLLATE "ko_KR.utf8", tdm22_start_da... |
| `tdm30_role_allc.notInRoleAllcIdList` | `server/tdm/mapper/tdm30_role_allc.xml:200` | Tdm30_Tab_RoleAllc | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 10:  ORDER BY tdm20_role_nm COLLATE "ko_KR.utf8" |
| `tdm30_role_allc.selectByText` | `server/tdm/mapper/tdm30_role_allc.xml:84` | Tdm30_Tab_RoleAllc | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 18:  ORDER BY tdm20_role_nm COLLATE "ko_KR.utf8" |
| `tdm30_role_allc.selectPerson` | `server/tdm/mapper/tdm30_role_allc.xml:177` | Tdm31_Tab_RoleDesc | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...SELECT row_number() over(ORDER BY tdm30_person_nm COLLATE "k... |
| `tdm31_role_desc.selectByRegDate` | `server/tdm/mapper/tdm31_role_desc.xml:70` | Tdm31_Tab_RoleDesc | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 30:  ORDER BY tdm31_reg_date DESC, tdm31_person_nm COLLATE "ko_K... |
| `tdm31_role_desc.selectByRegDateAdmin` | `server/tdm/mapper/tdm31_role_desc.xml:108` | Tdm31_Tab_RoleDescAdmin | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 34: ...tdm31_company_id, tdm31_reg_date, tdm31_person_nm COLLATE "k... |
| `tdm32_role_digm.selectByRegDateAdmin` | `server/tdm/mapper/tdm32_role_digm.xml:94` | Tdm32_Tab_RoleDigmAdmin | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 37:  ORDER BY tdm32_company_nm COLLATE "ko_KR.utf8", tdm32_reg_d... |
| `tdm35_role_allc_task.insertByRoleAllcDetailId` | `server/tdm/mapper/tdm35_role_allc_task.xml:116` | Tdm30_Tab_RoleAllc | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 26:  ORDER BY tdm10_task_nm COLLATE "ko_KR.utf8", tdm12_seq, tdm... |
| `tdm35_role_allc_task.selectByDate` | `server/tdm/mapper/tdm35_role_allc_task.xml:101` | Tdm35_Tab_TaskList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 10:  ORDER BY tdm20_role_nm COLLATE "ko_KR.utf8" |
| `tdm35_role_allc_task.selectTask` | `server/tdm/mapper/tdm35_role_allc_task.xml:32` | Tdm30_Tab_RoleAllc | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...N SELECT ROW_NUMBER() OVER(ORDER BY tdm35_task_nm COLLATE "k... |
| `tdm41_manl_duty.groupByManlJobId` | `server/tdm/mapper/tdm41_manl_duty.xml:96` | Tdm41_Tab_ManlDutyOrg | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ... SELECT  ROW_NUMBER() OVER(ORDER BY tdm20_role_nm COLLATE "k... |
| `tdm41_manl_duty.selectTaskAndOrg` | `server/tdm/mapper/tdm41_manl_duty.xml:166` | Tdm41_Tab_ManlDutyOrg | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...N SELECT ROW_NUMBER() OVER(ORDER BY tdm41_task_nm COLLATE "k... |
| `tdm42_manl_org.selectByText` | `server/tdm/mapper/tdm42_manl_org.xml:62` | Tdm42_Tab_ManlManager, Tdm42_Tab_ManlManagerAdmin, Tdm42_Tab_ManlOrgAppr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 74: ...RDER BY  tdm42_company_id, org_seq, tdm42_role_nm COLLATE "k... |
| `tdm43_manl.selectByDate` | `server/tdm/mapper/tdm43_manl.xml:530` | Tdm43_Tab_ManlItemList | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 42:  ORDER BY tdm43_role_nm COLLATE "ko_KR.utf8" |
| `tdm43_manl.selectByExceptIcsId` | `server/tdm/mapper/tdm43_manl.xml:580` | Ics01_Tab_ClassTree | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 12:  ORDER BY tdm43_role_nm COLLATE "ko_KR.utf8" |
| `tdm43_manl.selectByManlJobId` | `server/tdm/mapper/tdm43_manl.xml:415` | Tdm43_Tab_ManlItemReg | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 50:  ORDER BY tdm43_task_nm COLLATE "ko_KR.utf8" |
| `tdm43_manl.selectByManlOrgId` | `server/tdm/mapper/tdm43_manl.xml:210` | Tdm42_Tab_ManlManager, Tdm42_Tab_ManlManagerAdmin | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 81:  ORDER BY tdm43_task_nm COLLATE "ko_KR.utf8" |
| `tdm43_manl.selectByRoleId` | `server/tdm/mapper/tdm43_manl.xml:136` | Tdm43_Tab_ManlItemReg | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 37:  ORDER BY tdm43_task_nm COLLATE "ko_KR.utf8" |
| `tdm43_manl.selectByText` | `server/tdm/mapper/tdm43_manl.xml:114` | - | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 17:  ORDER BY tdm43_task_nm COLLATE "ko_KR.utf8" |
| `tdm45_manl_relate_ics.selectByIcsId` | `server/tdm/mapper/tdm45_manl_relate_ics.xml:41` | Ics01_Tab_ClassTree | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 16:  ORDER BY tdm43_role_nm COLLATE "ko_KR.utf8" |
| `tdm51_chck_org.selectByRoleId` | `server/tdm/mapper/tdm51_chck_org.xml:68` | Tdm50_Tab_CheckJob | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 55:  ORDER BY tdm51_org_nm COLLATE "ko_KR.utf8"; |
| `tdm51_chck_org.selectDashboardExct` | `server/tdm/mapper/tdm51_chck_org.xml:515` | Tdm50_Tab_Dashboard, Tdm50_Tab_DashboardExct | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 1: ...N SELECT ROW_NUMBER() OVER(ORDER BY tdm51_exct_nm COLLATE "k... |
| `tdm52_chck_manl.selectByChckApprCmntId` | `server/tdm/mapper/tdm52_chck_manl.xml:194` | Tdm59_Tab_CheckAppr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 63:  ORDER BY tdm52_org_nm COLLATE "ko_KR.utf8" |
| `tdm52_chck_manl.selectByChckOrgId` | `server/tdm/mapper/tdm52_chck_manl.xml:91` | Tdm51_Tab_CheckOrg | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 38:  ORDER BY tdm52_role_nm COLLATE "ko_KR.utf8" |
| `tdm52_chck_manl.selectByPersonId` | `server/tdm/mapper/tdm52_chck_manl.xml:140` | Tdm52_Tab_CheckManl | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 40:  ORDER BY tdm52_role_nm COLLATE "ko_KR.utf8" |
| `tdm53_chck_exct.selectByChckJobId` | `server/tdm/mapper/tdm53_chck_exct.xml:40` | Tdm50_Tab_CheckJob | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 19:  ORDER BY tdm20_role_nm COLLATE "ko_KR.utf8"; |
| `tdm64_chck_evid_extr.selectByTargetId` | `server/tdm/mapper/tdm64_chck_evid_extr.xml:25` | Tdm50_Tab_Dashboard, Tdm50_Tab_DashboardExct, Tdm50_Tab_DashboardOrg, Tdm51_Tab_CheckOrg, Tdm52_Tab_CheckManl, Tdm54_Tab_CheckInsuff, Tdm59_Tab_CheckAppr | ERROR:  collation "ko_KR.utf8" for encoding "UTF8" does not exist — LINE 5:         , tdm64_doc_nm COLLATE "ko_KR.utf8" |

## 펼치기 한계·기타 (직접 확인 필요)

| SQL | 파일:줄 | 화면 | 오류 |
|:---|:---|:---|:---|
| `act02_journal.selectMonthBiz` | `server/act/mapper/act02_journal.xml:187` | Act02_Tab_CreateJournalBiz | ERROR:  UNION types text and numeric cannot be matched — LINE 117:                       , biz20_company_id                    ... |
| `act03_journal_dtl.selectByCompanyId` | `server/act/mapper/act03_journal_dtl.xml:108` | Act02_Tab_ForJournal, Act02_Tab_Journal | ERROR:  syntax error at or near "ROLLBACK" — LINE 61: ROLLBACK; |
| `apr04_appr_step.confirmCheck` | `server/apr/mapper/apr04_appr_step.xml:312` | - | ERROR:  operator does not exist: numeric = text — LINE 9: ...     INNER JOIN current_step c ON a.apr04_appr_id = c.appr_i... |
| `apr04_appr_step.nextTurnCheck` | `server/apr/mapper/apr04_appr_step.xml:369` | - | ERROR:  operator does not exist: numeric = text — LINE 26:                    WHERE a.apr04_appr_id = c.appr_id |
| `apr04_appr_step.selectApprStep` | `server/apr/mapper/apr04_appr_step.xml:119` | - | ERROR:  operator does not exist: character varying = integer — LINE 9:    AND apr04_step_status_cd = 20; |
| `apr11_advert_book.getAdvertSeq` | `server/apr/mapper/apr11_advert_book.xml:77` | - | ERROR:  subquery in FROM must have an alias — LINE 5: from   ( |
| `dbConfig.isNewData` | `server/utils/db/mapper/DBConfig.xml:89` | - | ERROR:  syntax error at or near "1" — LINE 2:   FROM 1 |
| `dbm01_tab_comments.callByDDLRun` | `server/dbm/mapper/dbm01_tab_comments.xml:74` | Dbm01_Tab_TabComments | ERROR:  syntax error at or near "CALL" — LINE 1: EXPLAIN CALL sp_DDLRun(NULL); |
| `dbm03_tab_columns.selectByGridBuilder` | `server/dbm/mapper/dbm03_tab_columns.xml:33` | Dbm01_Tab_TabComments | ERROR:  syntax error at or near "CALL" — LINE 1: EXPLAIN CALL sp_JavaGridBuilder( |
| `dbm03_tab_columns.selectByModel` | `server/dbm/mapper/dbm03_tab_columns.xml:19` | Dbm01_Tab_TabComments | ERROR:  syntax error at or near "CALL" — LINE 1: EXPLAIN CALL sp_JavaModel( |
| `dbm03_tab_columns.selectByProperties` | `server/dbm/mapper/dbm03_tab_columns.xml:26` | Dbm01_Tab_TabComments | ERROR:  syntax error at or near "CALL" — LINE 1: EXPLAIN CALL sp_JavaProperties( |
| `dbm03_tab_columns.selectByXML` | `server/dbm/mapper/dbm03_tab_columns.xml:12` | Dbm01_Tab_TabComments | ERROR:  syntax error at or near "CALL" — LINE 1: EXPLAIN CALL sp_JavaXML( |
| `dcr00_doc_list.selectSearchDocId` | `server/dcr/mapper/dcr00_doc_list.xml:156` | Dcr00_Tab_Download | ERROR:  syntax error at or near "AMD" — LINE 66:    AMD COALESCE(dcr04_retrieve_yn, dcr03_retrieve_yn, 'true'... |
| `dcr01_class_tree.importDcr01FromAdmin` | `server/dcr/mapper/dcr01_class_tree.xml:1136` | - | ERROR:  syntax error at or near "{" — LINE 1: EXPLAIN { |
| `dcr01_class_tree.importDcr01FromDcr99` | `server/dcr/mapper/dcr01_class_tree.xml:1130` | - | ERROR:  syntax error at or near "{" — LINE 1: EXPLAIN { |
| `emp01_person.selectByCmpList` | `server/emp/mapper/emp01_person.xml:299` | - | ERROR:  subquery in FROM must have an alias — LINE 8:  ,( |
| `emp36_add_deduct.addDeductTypeInsert` | `server/emp/mapper/emp36_add_deduct.xml:44` | Emp00_Tab_TransInfo, Emp35_Tab_DeductPerson | ERROR:  column "emp36_deduct_id" is of type numeric but expression is of type text — LINE 12: SELECT f_create_seq(), NULL, emp36_add_deduct_type, emp36_ad... |
| `emp43_eval_target.selectByCompanyId` | `server/emp/mapper/emp43_eval_target.xml:155` | - | ERROR:  syntax error at or near "FROM" — LINE 45:   FROM emp43_eval_target |
| `flt02_emp.selectByCompanyId` | `server/flt/mapper/flt02_emp.xml:57` | Flt02_Tab_EmpInfo | ERROR:  syntax error at or near ")" — LINE 137:       FROM ( /* include selectViolate 없음 */ ) a |
| `flt02_emp.selectByCompanyId2` | `server/flt/mapper/flt02_emp.xml:95` | Flt02_Tab_EmpInfo | ERROR:  syntax error at or near ")" — LINE 144:       FROM ( /* include selectViolate 없음 */ ) a |
| `flt10_tr.selectViolate` | `server/flt/mapper/flt10_tr.xml:1823` | Flt02_Tab_EmpInfo, Flt10_Tab_Violate | ERROR:  syntax error at or near ")" — LINE 13:       FROM ( /* include selectViolate 없음 */ ) a |
| `fnd00_fund.selectByCodeName` | `server/fnd/mapper/fnd00_fund.xml:86` | - | ERROR:  unterminated quoted string at or near "'false ) ) |
| `fnd02_fund_info.insertUpdate` | `server/fnd/mapper/fnd02_fund_info.xml:193` | - | ERROR:  operator does not exist: numeric = text — LINE 105:          WHERE a.fnd02_fund_info_id = e.fundInfoId |
| `fnd07_issuing_entity.insertUpdate` | `server/fnd/mapper/fnd07_issuing_entity.xml:43` | - | ERROR:  syntax error at or near "fnd07_issuing_entity" — LINE 18:  INSERT fnd07_issuing_entity |
| `frm01_list.getNoticeCnt` | `server/frm/mapper/frm01_list.xml:2041` | MainFrame | ERROR:  UNION types numeric and text cannot be matched — LINE 128:                               SELECT * |
| `icam02_data.selectIcamData` | `server/icam/mapper/icam02_data.xml:130` | - | ERROR:  syntax error at or near ")" — LINE 28:          WHERE t1.corp_gr = t2.corp_gr(+) |
| `icam03_fund.selectIcamFund` | `server/icam/mapper/icam03_fund.xml:133` | - | ERROR:  subquery in FROM must have an alias — LINE 20: ...                                             FROM ( SELECT a... |
| `msc01_schedule.selectByFriDay` | `server/msc/mapper/msc01_schedule.xml:148` | - | ERROR:  operator does not exist: timestamp without time zone = text — LINE 6:  and  msc01_schedule_dt = to_char(NULL+4, 'YYYY-MM-DD'); |
| `msc01_schedule.selectByMonDay` | `server/msc/mapper/msc01_schedule.xml:111` | - | ERROR:  function to_char(unknown, unknown) is not unique — LINE 6:  and  msc01_schedule_dt = to_char(NULL, 'YYYY-MM-DD') |
| `msc01_schedule.selectByOrgCodeId` | `server/msc/mapper/msc01_schedule.xml:62` | - | ERROR:  syntax error at or near "start" — LINE 12:         start with a.org00_parent_code_id = 1010000 |
| `msc01_schedule.selectByThuDay` | `server/msc/mapper/msc01_schedule.xml:139` | - | ERROR:  operator does not exist: timestamp without time zone = text — LINE 6:  and  msc01_schedule_dt = to_char(NULL+3, 'YYYY-MM-DD'); |
| `msc01_schedule.selectByTueDay` | `server/msc/mapper/msc01_schedule.xml:121` | - | ERROR:  operator does not exist: timestamp without time zone = text — LINE 6:  and  msc01_schedule_dt = to_char(NULL+1, 'YYYY-MM-DD'); |
| `msc01_schedule.selectByWedDay` | `server/msc/mapper/msc01_schedule.xml:130` | - | ERROR:  operator does not exist: timestamp without time zone = text — LINE 6:  and  msc01_schedule_dt = to_char(NULL+2, 'YYYY-MM-DD'); |
| `msc01_schedule.selectByWeekDay` | `server/msc/mapper/msc01_schedule.xml:85` | - | ERROR:  syntax error at or near "start" — LINE 12:         start with a.org00_parent_code_id = 1010000 |
| `msc01_schedule.selectCalendar` | `server/msc/mapper/msc01_schedule.xml:230` | - | ERROR:  subquery in FROM must have an alias — LINE 5:      , ( |
| `msc01_schedule.selectCalendar2` | `server/msc/mapper/msc01_schedule.xml:412` | - | ERROR:  subquery in FROM must have an alias — LINE 5:      , ( |
| `mvb01_booking.selectByDateUnion` | `server/mvb/mapper/mvb01_booking.xml:79` | - | ERROR:  syntax error at or near "outer" — LINE 25:     , left outer join ( select  a.* |
| `opr03_reg.selectOnePreCancelCheck` | `server/opr/mapper/opr03_reg.xml:90` | Opr01_Tab_Create | ERROR:  subquery in FROM must have an alias — LINE 3:     from  ( |
| `org00_org_info.selectByCheckAuthority` | `server/org/mapper/org00_org_info.xml:182` | - | ERROR:  syntax error at or near "start" — LINE 9:       start with org00_org_code_id = NULL |
| `pcd01_pickup.selectByDateUnion` | `server/pcd/mapper/pcd01_pickup.xml:79` | Pcd01_Tab_Pickup | ERROR:  syntax error at or near "," — LINE 33:      ,   to_timestamp(to_char(f_trunc(pcd01_pickup_dt),'YYYY... |
| `pln03_Resrch.insert` | `server/pln/mapper/pln03_resrch.xml:254` | - | ERROR:  syntax error at or near "pln03_resrch" — LINE 22:  INSERT pln03_resrch |
| `sch02_share.insertByInfoId` | `server/sch/mapper/sch02_share.xml:155` | Sch01_Tab_Info | ERROR:  column "sch02_person_id" is of type numeric but expression is of type character varying — LINE 6:      , sch02_share_cd |
| `sch04_list.selectInsert` | `server/sch/mapper/sch04_list.xml:1297` | - | ERROR:  UNION types numeric and text cannot be matched — LINE 127:                            , company_id |
| `sys06_menu.selectByCompanyId1Bang` | `server/sys/mapper/sys06_menu.xml:238` | - | ERROR:  syntax error at or near "START" — LINE 7:  START WITH sys06_parent_id = 0 |
| `sys06_menu.selectUserMenu1Bang` | `server/sys/mapper/sys06_menu.xml:1003` | - | ERROR:  syntax error at or near "1" — LINE 113:    FROM  1"> |
| `sys12_calendar.insertFormSys12` | `server/sys/mapper/sys12_calendar.xml:211` | Sys01_Tab_Company, Sys30_Tab_LeaveYear | ERROR:  operator does not exist: numeric = text — LINE 31: ...FT OUTER JOIN sys14_holiday ON ( sys14_company_id = company_... |
| `sys12_calendar.selectByCloseCheck` | `server/sys/mapper/sys12_calendar.xml:26` | - | ERROR:  function to_char(unknown, unknown) is not unique — LINE 3:  WHERE to_char(sys12_day, 'yyyyMMdd') = to_char(NULL, 'yyyyM... |
| `sys21_license_code.selectByApplyDate` | `server/sys/mapper/sys21_license_code.xml:29` | - | ERROR:  syntax error at or near "and" — LINE 3:  and  a.sys21_apply_date |

## 스키마 차이가 있는 화면

| 화면 | SQL |
|:---|:---|
| `Att03_Tab_OvertimeReq` | `att03_overtime_req.getConfirmList`, `att13_overtime_req_hist.insert`, `att13_overtime_req_hist.selectByOvertimeReqId`, `att13_overtime_req_hist.updateInfo` |
| `Chk03_Tab_DailyListConfirm` | `chk03_daily_list_write.selectDailyListStatusPaging`, `chk03_daily_list_write.selectDailyListStatusPagingTotal` |
| `Chk03_Tab_DailyListStatus` | `chk03_daily_list_write.selectDailyListStatusPaging`, `chk03_daily_list_write.selectDailyListStatusPagingTotal` |
| `Fbx01_Tab_BoxDocument` | `dcr01_class_tree.selectByDcrDown1Bang` |
| `Ics15_Tab_ChecklistConfirm` | `ics11_checklist_company.selectChecklistStatusPaging`, `ics11_checklist_company.selectChecklistStatusPagingTotal`, `ics16_relate_appr.selectByConfirmerId` |
| `Ics15_Tab_ChecklistStatus` | `ics11_checklist_company.selectByChecklistIdStatus`, `ics11_checklist_company.selectChecklistStatus` |
| `Ics15_Tab_ChecklistStatusDetail` | `ics11_checklist_company.selectChecklistStatusPaging`, `ics11_checklist_company.selectChecklistStatusPagingTotal` |
| `MainFrame` | `att03_overtime_req.selectById` |
| `Msc01_HTML_Week` | `msc01_schedule.selectById` |
| `Msc01_Tab_Schedule` | `msc01_schedule.selectById` |
| `Org01_Tab_OrgCode` | `org01_code.checkUseOrgId` |
| `Sch04_Tab_CheckList` | `sch04_list.selectByCheckList` |
| `Sch20_Tab_AddChecklist` | `sch22_write_group.selectByChecklistContentId`, `sch22_write_group.selectById` |
| `Tdm50_Tab_Dashboard` | `tdm54_chck_insuff.selectDashboardInsuff` |
| `Tdm50_Tab_DashboardExct` | `tdm54_chck_insuff.selectDashboardInsuff` |
| `Tdm50_Tab_DashboardOrg` | `tdm54_chck_insuff.selectDashboardInsuff` |
| `Tdm51_Tab_CheckOrg` | `tdm51_chck_org.selectByOrgId`, `tdm54_chck_insuff.updateStatusCode2` |
| `Tdm52_Tab_CheckManl` | `tdm51_chck_org.selectByOrgId` |
| `Tdm54_Tab_CheckInsuff` | `tdm54_chck_insuff.selectByRegDate`, `tdm54_chck_insuff.selectPossibleYn` |
| `Tdm59_Tab_CheckAppr` | `tdm54_chck_insuff.countByChckApprCmntId`, `tdm54_chck_insuff.selectByChckApprCmntId`, `tdm59_chck_appr_cmnt.selectByApprEmpId` |
