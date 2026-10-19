# Sys01_Tab_Company

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 고객별 시스템정보 관리 (#1075)
- 파일: `client/vi/sys/Sys01_Tab_Company.java`
- 함께 쓰는 클래스 14개:
  - `Sys50_TabPage_SpecificMenu` `client/vi/sys/Sys50_TabPage_SpecificMenu.java`
  - `Sys54_Lookup_SpecificMenuHistory` `client/vi/sys/Sys54_Lookup_SpecificMenuHistory.java`
  - `Sys54_Edit_Note` `client/vi/sys/Sys54_Edit_Note.java`
  - `Sys52_Lookup_SpecificMenuLink` `client/vi/sys/Sys52_Lookup_SpecificMenuLink.java`
  - `Sys51_Lookup_SpecificMenuPerson` `client/vi/sys/Sys51_Lookup_SpecificMenuPerson.java`
  - `Sys06_Lookup_SelectMulti` `client/vi/sys/Sys06_Lookup_SelectMulti.java`
  - `Sys03_Lookup_CompanyMenu` `client/vi/sys/Sys03_Lookup_CompanyMenu.java`
  - `Sys01_TabPage_Info04` `client/vi/sys/Sys01_TabPage_Info04.java`
  - `Sys01_TabPage_Info03` `client/vi/sys/Sys01_TabPage_Info03.java`
  - `Sys01_TabPage_Info02` `client/vi/sys/Sys01_TabPage_Info02.java`
  - `Sys01_TabPage_Info01` `client/vi/sys/Sys01_TabPage_Info01.java`
  - `Sys29_Lookup_PublicIpList` `client/vi/sys/Sys29_Lookup_PublicIpList.java`
  - `Sys01_Edit_Note` `client/vi/sys/Sys01_Edit_Note.java`
  - `Sys01_Edit_Company` `client/vi/sys/Sys01_Edit_Company.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Sys02_Tab_User`](../../sys/screens/Sys02_Tab_User.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.commentInsert` | Sys01_Tab_Company:325 | [`Dcr01_ClassTree.java:273`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.commentInsert`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.selectByCompanyId`](../../dcr/sql/dcr01_class_tree.md) |
| `getSeq` | Sys01_Edit_Company:86 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys00_Common.selectByKindGroupCode` | Sys01_TabPage_Info04:178 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectLocName` | Sys03_Lookup_CompanyMenu:35 | [`Sys00_Common.java:31`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectLocName`](../../sys/sql/sys00_common.md) |
| `sys.Sys00_Common.selectLocName2` | Sys03_Lookup_CompanyMenu:34 | [`Sys00_Common.java:36`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectLocName2`](../../sys/sql/sys00_common.md) |
| `sys.Sys01_Company.delete` | Sys01_Tab_Company:297 | [`Sys01_Company.java:206`](../../sys/services/Sys01_Company.md) | `UpdateDataModel(sys01_company)` 동적 DELETE |
| `sys.Sys01_Company.getCorpRegNo` | Sys01_TabPage_Info02:98 | [`Sys01_Company.java:109`](../../sys/services/Sys01_Company.md) | [`sys01_company.getCorpRegNo`](../../sys/sql/sys01_company.md) |
| `sys.Sys01_Company.selectById` | Sys01_TabPage_Info01:153, Sys01_TabPage_Info02:85, Sys01_TabPage_Info03:135, Sys01_TabPage_Info04:252 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys01_Company.selectByName` | Sys01_Tab_Company:264 | [`Sys01_Company.java:41`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByName`](../../sys/sql/sys01_company.md) |
| `sys.Sys01_Company.update` | Sys01_Edit_Company:228, Sys01_TabPage_Info01:158, Sys01_TabPage_Info02:119, Sys01_TabPage_Info03:140, Sys01_TabPage_Info04:257 | [`Sys01_Company.java:182`](../../sys/services/Sys01_Company.md) | `UpdateDataModel(sys01_company)` 동적 INSERT/UPDATE → [`sys01_company.selectById`](../../sys/sql/sys01_company.md) ; 부수 효과: 아래 "저장 시 부수 효과" |
| `sys.Sys01_Company.updateNote` | Sys01_Edit_Note:77 | [`Sys01_Company.java:126`](../../sys/services/Sys01_Company.md) | [`sys01_company.updateNote`](../../sys/sql/sys01_company.md) |
| `sys.Sys03_CompanyMenu.insert` | Sys03_Lookup_CompanyMenu:110 | [`Sys03_CompanyMenu.java:21`](../../sys/services/Sys03_CompanyMenu.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys03_company_menu.insert`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.selectByCompanyId`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.selectByMenu`](../../sys/sql/sys03_company_menu.md), [`sys04_role.copyRole`](../../sys/sql/sys04_role.md), [`sys04_role.selectByCompanyId`](../../sys/sql/sys04_role.md), [`sys04_role.selectByName`](../../sys/sql/sys04_role.md), [`sys07_role_menu.insert`](../../sys/sql/sys07_role_menu.md), [`sys07_role_menu.selectByMenuId`](../../sys/sql/sys07_role_menu.md), [`sys07_role_menu.selectByRoleName`](../../sys/sql/sys07_role_menu.md) |
| `sys.Sys06_Menu.getAllMenuList` | Sys06_Lookup_SelectMulti:142 | [`Sys06_Menu.java:493`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.getAllMenuList`](../../sys/sql/sys06_menu.md) |
| `sys.Sys10_File.selectByParentId` | Sys54_Lookup_SpecificMenuHistory:277 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys29_LoginSecure.delete` | Sys29_Lookup_PublicIpList:153 | [`Sys29_LoginSecure.java:43`](../../sys/services/Sys29_LoginSecure.md) | `UpdateDataModel(sys29_login_secure)` 동적 DELETE |
| `sys.Sys29_LoginSecure.selectByCompanyId` | Sys29_Lookup_PublicIpList:127 | [`Sys29_LoginSecure.java:23`](../../sys/services/Sys29_LoginSecure.md) | [`sys29_login_secure.selectByCompanyId`](../../sys/sql/sys29_login_secure.md) |
| `sys.Sys29_LoginSecure.update` | Sys29_Lookup_PublicIpList:167 | [`Sys29_LoginSecure.java:38`](../../sys/services/Sys29_LoginSecure.md) | `UpdateDataModel(sys29_login_secure)` 동적 INSERT/UPDATE → [`sys29_login_secure.selectById`](../../sys/sql/sys29_login_secure.md) |
| `sys.Sys50_SpecificMenu.delete` | Sys50_TabPage_SpecificMenu:304 | [`Sys50_SpecificMenu.java:45`](../../sys/services/Sys50_SpecificMenu.md) | `UpdateDataModel(sys50_specific_menu)` 동적 DELETE |
| `sys.Sys50_SpecificMenu.selectBySpecificWorkCode` | Sys50_TabPage_SpecificMenu:255 | [`Sys50_SpecificMenu.java:31`](../../sys/services/Sys50_SpecificMenu.md) | [`sys50_specific_menu.selectBySpecificWorkCode`](../../sys/sql/sys50_specific_menu.md) |
| `sys.Sys50_SpecificMenu.update` | Sys50_TabPage_SpecificMenu:277 | [`Sys50_SpecificMenu.java:40`](../../sys/services/Sys50_SpecificMenu.md) | `UpdateDataModel(sys50_specific_menu)` 동적 INSERT/UPDATE → [`sys50_specific_menu.selectById`](../../sys/sql/sys50_specific_menu.md) |
| `sys.Sys51_SpecificMenuPerson.delete` | Sys51_Lookup_SpecificMenuPerson:202 | [`Sys51_SpecificMenuPerson.java:60`](../../sys/services/Sys51_SpecificMenuPerson.md) | `UpdateDataModel(sys51_specific_menu_person)` 동적 DELETE |
| `sys.Sys51_SpecificMenuPerson.selectBySpecificMenuId` | Sys51_Lookup_SpecificMenuPerson:157 | [`Sys51_SpecificMenuPerson.java:24`](../../sys/services/Sys51_SpecificMenuPerson.md) | [`sys51_specific_menu_person.selectBySpecificMenuId`](../../sys/sql/sys51_specific_menu_person.md) |
| `sys.Sys51_SpecificMenuPerson.update` | Sys51_Lookup_SpecificMenuPerson:217 | [`Sys51_SpecificMenuPerson.java:55`](../../sys/services/Sys51_SpecificMenuPerson.md) | `UpdateDataModel(sys51_specific_menu_person)` 동적 INSERT/UPDATE → [`sys51_specific_menu_person.selectById`](../../sys/sql/sys51_specific_menu_person.md) |
| `sys.Sys51_SpecificMenuPerson.updateGroup` | Sys51_Lookup_SpecificMenuPerson:247 | [`Sys51_SpecificMenuPerson.java:33`](../../sys/services/Sys51_SpecificMenuPerson.md) | [`sys51_specific_menu_person.deleteSpecificMenuPerson`](../../sys/sql/sys51_specific_menu_person.md), [`sys51_specific_menu_person.insertSpecificMenuPerson`](../../sys/sql/sys51_specific_menu_person.md), [`sys51_specific_menu_person.selectBySpecificMenuId`](../../sys/sql/sys51_specific_menu_person.md) |
| `sys.Sys52_SpecificMenuLink.delete` | Sys52_Lookup_SpecificMenuLink:163 | [`Sys52_SpecificMenuLink.java:37`](../../sys/services/Sys52_SpecificMenuLink.md) | `UpdateDataModel(sys52_specific_menu_link)` 동적 DELETE |
| `sys.Sys52_SpecificMenuLink.selectBySpecificWorkCode` | Sys52_Lookup_SpecificMenuLink:138 | [`Sys52_SpecificMenuLink.java:23`](../../sys/services/Sys52_SpecificMenuLink.md) | [`sys52_specific_menu_link.selectBySpecificWorkCode`](../../sys/sql/sys52_specific_menu_link.md) |
| `sys.Sys52_SpecificMenuLink.update` | Sys52_Lookup_SpecificMenuLink:178 | [`Sys52_SpecificMenuLink.java:32`](../../sys/services/Sys52_SpecificMenuLink.md) | `UpdateDataModel(sys52_specific_menu_link)` 동적 INSERT/UPDATE → [`sys52_specific_menu_link.selectById`](../../sys/sql/sys52_specific_menu_link.md) |
| `sys.Sys54_SpecificMenuHistory.delete` | Sys54_Lookup_SpecificMenuHistory:263 | [`Sys54_SpecificMenuHistory.java:61`](../../sys/services/Sys54_SpecificMenuHistory.md) | `UpdateDataModel(sys54_specific_menu_history)` 동적 DELETE |
| `sys.Sys54_SpecificMenuHistory.deleteFile` | Sys54_Lookup_SpecificMenuHistory:327 | [`Sys54_SpecificMenuHistory.java:34`](../../sys/services/Sys54_SpecificMenuHistory.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(sys10_file)` 동적 DELETE |
| `sys.Sys54_SpecificMenuHistory.selectByCompanyId` | Sys54_Lookup_SpecificMenuHistory:227 | [`Sys54_SpecificMenuHistory.java:26`](../../sys/services/Sys54_SpecificMenuHistory.md) | [`sys54_specific_menu_history.selectByCompanyId`](../../sys/sql/sys54_specific_menu_history.md) |
| `sys.Sys54_SpecificMenuHistory.update` | Sys54_Lookup_SpecificMenuHistory:250 | [`Sys54_SpecificMenuHistory.java:56`](../../sys/services/Sys54_SpecificMenuHistory.md) | `UpdateDataModel(sys54_specific_menu_history)` 동적 INSERT/UPDATE → [`sys54_specific_menu_history.selectById`](../../sys/sql/sys54_specific_menu_history.md) |
| `sys.Sys54_SpecificMenuHistory.updateByNote` | Sys54_Edit_Note:88 | [`Sys54_SpecificMenuHistory.java:51`](../../sys/services/Sys54_SpecificMenuHistory.md) | [`sys54_specific_menu_history.updateByNote`](../../sys/sql/sys54_specific_menu_history.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act09_account_num`](../../../db/tables/act.md), [`act10_repr_account`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act12_journal_map`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`bbs12_application_form`](../../../db/tables/bbs.md), [`biz90_limit`](../../../db/tables/biz.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`com11_form_mapping_multi`](../../../db/tables/com.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), [`emp55_benefit_info`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics33_compliance_answer`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay04_formula`](../../../db/tables/pay.md), [`pay06_act_mapping`](../../../db/tables/pay.md), [`pay30_basic_setup`](../../../db/tables/pay.md), [`pay51_expense_form`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys14_holiday`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys29_login_secure`](../../../db/tables/sys.md), [`sys30_leave_year`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys52_specific_menu_link`](../../../db/tables/sys.md), [`sys54_specific_menu_history`](../../../db/tables/sys.md)

## DB 함수

`dcr01_import_from_admin`, `f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_company_nm`, `f_get_emptrans`, `f_menu_nm_allpath`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`, `to_encrypts`

## 저장 시 부수 효과 (UpdateDataModel)

`sys01_company`를 새로 INSERT하면 (UpdateDataModel.java L92-319) 이어서:

1. [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) → [`org01_code.insertOrg01Code`](../../org/sql/org01_code.md) (L106, [`org01_code`](../../../db/tables/org.md))
2. [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) → [`org02_info.insertOrg02Info`](../../org/sql/org02_info.md) (L123, [`org02_info`](../../../db/tables/org.md))
3. [`sys09_code.insertFromSys09`](../../sys/sql/sys09_code.md) (L129, [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md))
4. `call dcr01_import_from_admin(?)` (L152, DB 프로시저 → [dcr01_import_from_admin](../../../db/functions/dcr01_import_from_admin.md))
5. [`ast02_detail.insertFromAst02`](../../ast/sql/ast02_detail.md) (L162, [`ast02_detail`](../../../db/tables/ast.md))
6. [`sys30_leave_year.insertFromSys30`](../../sys/sql/sys30_leave_year.md) (L167, [`sys30_leave_year`](../../../db/tables/sys.md))
7. [`pay04_formula.insertFromAdmin`](../../pay/sql/pay04_formula.md) (L173, [`pay04_formula`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md))
8. [`ics02_manager.insertFromIcs02`](../../ics/sql/ics02_manager.md) (L178, [`ics02_manager`](../../../db/tables/ics.md))
9. [`act01_account_code.insertFromAct01`](../../act/sql/act01_account_code.md) (L183, [`act01_account_code`](../../../db/tables/act.md))
10. [`ics30_compliance.insertFormIcs30`](../../ics/sql/ics30_compliance.md) (L193, [`ics30_compliance`](../../../db/tables/ics.md))
11. [`ics33_compliance_answer.insertFormIcs30`](../../ics/sql/ics33_compliance_answer.md) (L198, [`ics33_compliance_answer`](../../../db/tables/ics.md))
12. [`bbs12_application_form.insertFormBbs12`](../../bbs/sql/bbs12_application_form.md) (L203, [`bbs12_application_form`](../../../db/tables/bbs.md))
13. [`pay51_expense_form.insertFormPay51`](../../pay/sql/pay51_expense_form.md) (L208, [`pay51_expense_form`](../../../db/tables/pay.md))
14. [`com11_form_mapping_multi.insertFormCom11`](../../com/sql/com11_form_mapping_multi.md) (L213, [`com11_form_mapping_multi`](../../../db/tables/com.md))
15. [`pay06_act_mapping.insertFormPay06`](../../pay/sql/pay06_act_mapping.md) (L218, [`pay06_act_mapping`](../../../db/tables/pay.md))
16. [`pay04_formula.insertFormPay04`](../../pay/sql/pay04_formula.md) (L223, [`pay04_formula`](../../../db/tables/pay.md))
17. [`dcr05_doc_type.insertFormDcr05`](../../dcr/sql/dcr05_doc_type.md) (L228, [`dcr05_doc_type`](../../../db/tables/dcr.md))
18. [`sys15_corp.insertFormSys15`](../../sys/sql/sys15_corp.md) (L233, [`sys15_corp`](../../../db/tables/sys.md))
19. [`sys14_holiday.insertFormSys14`](../../sys/sql/sys14_holiday.md) (L238, [`sys14_holiday`](../../../db/tables/sys.md))
20. [`sys12_calendar.insertFormSys12`](../../sys/sql/sys12_calendar.md) (L243, [`sys12_calendar`](../../../db/tables/sys.md), [`sys14_holiday`](../../../db/tables/sys.md))
21. [`act10_repr_account.insertFormAct10`](../../act/sql/act10_repr_account.md) (L248, [`act10_repr_account`](../../../db/tables/act.md))
22. [`ast05_tr_code.insertFormAst05`](../../ast/sql/ast05_tr_code.md) (L253, [`ast05_tr_code`](../../../db/tables/ast.md))
23. [`ast15_tr_code_window.insertFormAst15`](../../ast/sql/ast15_tr_code_window.md) (L258, [`ast15_tr_code_window`](../../../db/tables/ast.md))
24. [`act11_tr_map.insertFormAct11`](../../act/sql/act11_tr_map.md) (L263, [`act11_tr_map`](../../../db/tables/act.md))
25. [`act12_journal_map.insertFormAct12`](../../act/sql/act12_journal_map.md) (L268, [`act12_journal_map`](../../../db/tables/act.md))
26. [`act13_real_account_map.insertFormAct13`](../../act/sql/act13_real_account_map.md) (L273, [`act13_real_account_map`](../../../db/tables/act.md))
27. [`chk02_daily_list.insertFromChk02`](../../chk/sql/chk02_daily_list.md) (L278, [`chk02_daily_list`](../../../db/tables/chk.md))
28. [`act09_account_num.insertFromAct09`](../../act/sql/act09_account_num.md) (L283, [`act09_account_num`](../../../db/tables/act.md))
29. [`pay30_basic_setup.insertFromPay30`](../../pay/sql/pay30_basic_setup.md) (L288, [`pay30_basic_setup`](../../../db/tables/pay.md))
30. [`flt01_company_std.insertFromFlt01`](../../flt/sql/flt01_company_std.md) (L293, [`flt01_company_std`](../../../db/tables/flt.md))
31. [`flt05_item_type.insertFromFlt05`](../../flt/sql/flt05_item_type.md) (L298, [`flt05_item_type`](../../../db/tables/flt.md))
32. [`biz90_limit.insertFromBiz90`](../../biz/sql/biz90_limit.md) (L303, [`biz90_limit`](../../../db/tables/biz.md))
33. [`emp55_benefit_info.insertFromEmp55`](../../emp/sql/emp55_benefit_info.md) (L308, [`emp55_benefit_info`](../../../db/tables/emp.md))

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys01_Tab_Company (`client/vi/sys/Sys01_Tab_Company.java`, 353줄)

- 레이아웃: center=vlc, south=cp
- 툴바 `buttonBar`: 고객명: {companyName} {useYnBox} {retrieveButton} {insertButton} {deleteButton} {copyMenuButton} {addDcrComment}
- 입력·하위 화면: `companyName` TextField, `useYnBox` CheckBox, `lookup` Sys01_Edit_Note
- 그리드 `grid` (buildGrid()):
  - loginSecureYn 100 "보안로그인" BooleanYn2
  - companyName 200 "고객명" Text
  - locationName 120 "Sub-Domain" TextCenter
  - erpProductCode 65 "적용상품" TextCenter
  - icamCompanyCode 80 "ICAM<br>운용사코드" TextCenter
  - icamAdvisCompanyCode 80 "ICAM<br>자문사코드" TextCenter
  - useYn 80 "사용여부" BooleanYn2
  - note 250 "비고" Text
  - empInfo 150 "담당자(이름/부서/직책)" Text
  - mobileTelNo 120 "비상전화" Text
  - officeTelNo 120 "대표전화" Text
  - fullAddress 350 "주소" Text
  - companyRepName 150 "대외문서(대표이사)" TextCenter
  - mailInfo 120 "메일서버정보" TextCenter
  - mailLogYn 80 "메일기록" BooleanYn2
  - apprStepLockYn 80 "결재선<br>Lock" BooleanYn2
  - dcrNumberingName 100 "문서번호<br>채번방식" Text
  - dcrDetailUseYn 80 "문서세부<br>분류사용" BooleanYn2
  - aprManagerInfoYn 120 "대외문서<br>담당자정보포함" BooleanYn2
  - leaveMonthName 80 "휴가결산<br>(월)" Text
  - leaveYn 80 "휴가<br>초과허용" BooleanYn2
  - leaveCompulsionRt 80 "휴가의무<br>사용율(%)" LongCenter
  - icsCheckCycleName 80 "내부통제<br>체크주기" TextCenter
  - icsComplyCycleName 100 "임직원준수점검<br>체크주기" TextCenter
  - taxTypeName 80 "과세구분" Text
  - accountCloseMonthName 80 "회계결산<br>(월)" Text
  - ownerCapitalApplyName 80 "자기자본<br>적용일" Text
  - astManagerAutoYn 120 "고유자산담당자<br>자동설정" BooleanYn2
  - icsGuideYn 120 "법규 연결<br>가이드" BooleanYn2
  - noticeDate 100 "시스템사용<br>시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L66-110) → settings(), retrieve()
[E1] companyName.KeyDown [Enter] (L116) → retrieve()
[E2] retrieveButton[조회].Select (L124) → retrieve()
[E3] insertButton[등록].Select (L130) → insert()
[E4] deleteButton[삭제].Select (L136) → delete()
       └ [E10] messageBox.DialogHide [YES] (L283) → deleteCompany()
[E5] copyMenuButton[매뉴권한복사(초기)].Select (L142) → copyMenu()
[E6] addDcrComment[문서개요복사].Select (L148) → commentUpdate()
       └ [E11] msgBox.DialogHide [YES] (L320) → 서비스 dcr.Dcr01_ClassTree.commentInsert(companyId), 메시지 "문서분류의 개요가 복사완료되었습니다"
[E7] grid.SelectionChanged [선택>0] (L154) → retrieveTabpage()
[E8] tabPanel.Selection [arg0 != null] (L162) → retrieveTabpage()
[E9] grid.CellDoubleClick [colIndex == 8] (L171) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L195-205 | E7,E8,E9 | 선택 회사로 탭페이지 retrieve (탭: Sys01_TabPage_Info01[관리정보], Sys01_TabPage_Info02[기본정보], Sys01_TabPage_Info03[전자결재·내부통제], Sys01_TabPage_Info04[경영·회계], Sys02_Tab_User[고객별 관리자], Sys50_TabPage_SpecificMenu[특정매뉴 권한]) | 업무 |
| public retrieve() | L259-274 | 생성자,E1,E2 | 서비스 sys.Sys01_Company.selectByName(companyName, useYn) | 업무 |
| public insert() | L276-278 | E3 | 팝업 Sys01_Edit_Company 열기 | 업무 |
| public delete() | L280-292 | E4 | ConfirmBox → E10 | 업무 |
| private deleteCompany() | L294-298 | E10 | GridDeleteData sys.Sys01_Company.delete(체크된 행 목록) | 업무 |
| private copyMenu() | L300-310 | E5 | 조회창 Sys03_Lookup_CompanyMenu 열기 → 콜백: unmask | 업무 |
| private commentUpdate() | L312-344 | E6 | 미선택 시 alert "회사를 선택해주세요" → 확인창 E11 | 업무 |
| private settings() | L112-193 | 생성자 | 팝업 Sys01_Edit_Note 열기, 이벤트 연결, 초기값: useYnBox=true("사용고객만 보기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L207-257 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L346-348 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L350-352 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.booleanYn2('loginSecureYn', 100, '보안로그인'),  // L211
  gb.text('companyNm', 200, '고객명'),  // L212
  gb.textCenter('locNm', 120, 'Sub-Domain'),  // L213
  gb.textCenter('erpProductCd', 65, '적용상품'),  // L217
  gb.textCenter('icamCompanyCd', 80, 'ICAM<br>운용사코드'),  // L218
  gb.textCenter('icamAdvisCompanyCd', 80, 'ICAM<br>자문사코드'),  // L219
  gb.booleanYn2('useYn', 80, '사용여부'),  // L220
  gb.text('note', 250, '비고'),  // L221
  gb.text('empInfo', 150, '담당자(이름/부서/직책)'),  // L225
  gb.text('mobileTelNo', 120, '비상전화'),  // L226
  gb.text('officeTelNo', 120, '대표전화'),  // L227
  gb.text('fullAddress', 350, '주소'),  // L231 SQL 계산 컬럼(selectByName: CONCAT(sys01_zip_addr , ' '||sys01_zip_…)
  gb.textCenter('companyRepNm', 150, '대외문서(대표이사)'),  // L233
  gb.textCenter('mailInfo', 120, '메일서버정보'),  // L235
  gb.booleanYn2('mailLogYn', 80, '메일기록'),  // L236
  gb.booleanYn2('apprStepLockYn', 80, '결재선<br>Lock'),  // L237
  gb.text('dcrNumberingNm', 100, '문서번호<br>채번방식'),  // L238 SQL 계산 컬럼(selectByName: f_cdnm('DcrNumberingCode', sys01_dcr_nu…)
  gb.booleanYn2('dcrDetailUseYn', 80, '문서세부<br>분류사용'),  // L239
  gb.booleanYn2('aprManagerInfoYn', 120, '대외문서<br>담당자정보포함'),  // L240
  gb.text('leaveMonthNm', 80, '휴가결산<br>(월)'),  // L242 SQL 계산 컬럼(selectByName: f_cdnm('MonthsCode', sys01_leave_month_…)
  gb.booleanYn2('leaveYn', 80, '휴가<br>초과허용'),  // L243
  gb.longCenter('leaveCompulsionRt', 80, '휴가의무<br>사용율(%)'),  // L244
  gb.textCenter('icsCheckCycleNm', 80, '내부통제<br>체크주기'),  // L245 SQL 계산 컬럼(selectByName: f_cdnm('IcsCheckListCycleType', sys01_i…)
  gb.textCenter('icsComplyCycleNm', 100, '임직원준수점검<br>체크주기'),  // L246 SQL 계산 컬럼(selectByName: f_cdnm('IcsCheckListCycleType', sys01_i…)
  gb.text('taxTypeNm', 80, '과세구분'),  // L248 SQL 계산 컬럼(selectByName: f_cdnm('TaxType', sys01_tax_type, sys01…)
  gb.text('accountCloseMonthNm', 80, '회계결산<br>(월)'),  // L249 SQL 계산 컬럼(selectByName: f_cdnm('MonthsCode', sys01_account_clos…)
  gb.text('ownerCapitalApplyNm', 80, '자기자본<br>적용일'),  // L250 SQL 계산 컬럼(selectByName: f_cdnm('OwnerCapitalApplyDateType', sys…)
  gb.booleanYn2('astManagerAutoYn', 120, '고유자산담당자<br>자동설정'),  // L251
  gb.booleanYn2('icsGuideYn', 120, '법규 연결<br>가이드'),  // L253
  gb.date('noticeDate', 100, '시스템사용<br>시작일'),  // L254
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="change" onClick={copyMenu}>매뉴권한복사(초기)</Button>
5. <Button type="change" onClick={commentUpdate}>문서개요복사</Button>

### Sys50_TabPage_SpecificMenu (`client/vi/sys/Sys50_TabPage_SpecificMenu.java`, 337줄)

- 툴바 `buttonBar`: 구분: {specificWorkComboBoxField} {retrieveButton} {updateButton} {insertButton} {deleteButton} {historyButton}
- 입력·하위 화면: `specificWorkComboBoxField` ComboBoxField("SpecificWorkCode", "%", "전체"), `specificWorkComboBox` ComboBoxField("SpecificWorkCode"), `lookupMenuInfo` LookupTriggerField, `lookup` Sys52_Lookup_SpecificMenuLink
- 그리드 `grid` (buildGrid()):
  - specificWorkName 200 "특정업무" Text 편집:specificWorkComboBox
  - actionCell 100 "문서권한" Cell 편집:actionCell01
  - menuName 500 "매뉴명" Text 편집:lookupMenuInfo
  - actionCell 100 "사원권한" Cell 편집:actionCell02
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L64-115) → 초기화
[E1] retrieveButton[조회].Select (L69) → retrieve()
[E2] updateButton[저장].Select (L75) → update()
[E3] insertButton[등록].Select (L81) → insertRow()
[E4] deleteButton[삭제].Select (L87) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L297) → 서비스 sys.Sys50_SpecificMenu.delete
[E5] historyButton[요청이력].Select (L93) → openHistory()
[E6] specificWorkComboBox[SpecificWorkCode].Collapse (L119) → 인라인 L119-126 (new CollapseHandler() { @Override pub…)
[E7] lookupMenuInfo.TriggerClick (L128) → openLookupMenuInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private openLookupMenuInfo() | L176-233 | E7 | 조회창 Sys06_Lookup_SelectMulti 열기, 미선택 시 alert "특정업무 구분은 필수선택 항목입니다" | 업무 |
| public retrieve() | L235-238 | E1 | 상태 처리 | 업무 |
| private openHistory() | L240-248 | E5 | 조회창 Sys54_Lookup_SpecificMenuHistory 열기 | 업무 |
| public retrieve() | L251-256 | E1 | 서비스 sys.Sys50_SpecificMenu.selectBySpecificWorkCode(companyId, specificWorkCode) | 업무 |
| public update() | L259-278 | E2 | 서비스 sys.Sys50_SpecificMenu.update | 업무 |
| public insertRow() | L281-291 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L294-315 | E4 | ConfirmBox → E8 | 업무 |
| public retrieve() | L318-321 | E1 | 상태 처리 | 업무 |
| public init() | L324-326 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L333-336 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L117-174 | 필드 초기화 | 조회창 Sys52_Lookup_SpecificMenuLink 열기, 조회창 Sys51_Lookup_SpecificMenuPerson 열기, 미선택 시 alert "저장 후 권한설정을 진행해주세요", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L328-330 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('specificWordNm', 200, '특정업무', { editor: 'select' }),  // L167 SQL 계산 컬럼(selectBySpecificWorkCode: f_cdnm('SpecificWorkCode', sys50_specif…)
  // ⚠ 대응 없음 (GridBuilder L168) addCell
  gb.text('menuNm', 500, '매뉴명'),  // L169 SQL 계산 컬럼(selectBySpecificWorkCode: f_menu_nm_allpath(sys06_menu_id))
  // ⚠ 대응 없음 (GridBuilder L170) addCell
  gb.text('note', 500, '비고', { editor: 'text' }),  // L171
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="view" onClick={openHistory}>요청이력</Button>

### Sys54_Lookup_SpecificMenuHistory (`client/vi/sys/Sys54_Lookup_SpecificMenuHistory.java`, 343줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton} {insertButton} {deleteButton} {fileDeleteForm} {fileDownloadForm}
- 입력·하위 화면: `lookup` Sys54_Edit_Note
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "요청일" Date 편집:MyDateField
  - confirmDate 100 "처리일" Date 편집:MyDateField
  - confirmName 150 "처리(확인)자" Text 편집:TextField
  - fileName 300 "파일명" Text
  - actionCell 30 "등록" Cell 편집:actionCell01
  - actionCell 30 "받기" Cell 편집:actionCell02
  - noteYnStr 100 "참고내용" TextCenter
  - actionCell 30 "등록" Cell 편집:actionCell03

#### 이벤트
[E0] 화면 열림 (생성자 L79-105) → settings()
[E1] retrieveButton[조회].Select (L108) → retrieve()
[E2] updateButton[저장].Select (L114) → update()
[E3] insertButton[등록].Select (L120) → insert()
[E4] deleteButton[삭제].Select (L126) → delete()
       └ [E8] msgBox.DialogHide [YES] (L256) → 서비스 sys.Sys54_SpecificMenuHistory.delete
[E5] closeButton[닫기].Select (L132) → hide()
[E6] fileDeleteForm.SubmitComplete (L139) → retrieve()
[E7] fileUpdownForm.Change (L146) → retrieve()
[E9] msgBox.DialogHide [YES] (L307) → deleteFile()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L73-77 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L222-233 | E1,E6,E7,open,buildGrid | 서비스 sys.Sys54_SpecificMenuHistory.selectByCompanyId(companyId) | 업무 |
| private insert() | L235-246 | E3 | 상태 처리 | 업무 |
| public update() | L248-251 | E2 | 서비스 sys.Sys54_SpecificMenuHistory.update | 업무 |
| private delete() | L253-274 | E4 | ConfirmBox → E8 | 업무 |
| private fileDownload() | L276-295 | buildGrid | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private fileUploadChk() | L297-324 | buildGrid | 확인창 표시 | 업무 |
| private deleteFile() | L326-338 | E9 | 서비스 sys.Sys54_SpecificMenuHistory.deleteFile(parentId) | 업무 |
| private settings() | L107-166 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L168-220 | 필드 초기화 | 팝업 Sys54_Edit_Note 열기, 미선택 시 alert "작업중인 내용을 저장 후 이용해주세요", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L340-342 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '요청일', { editor: 'date' }),  // L211
  gb.date('confirmDate', 100, '처리일', { editor: 'date' }),  // L212
  gb.text('confirmNm', 150, '처리(확인)자', { editor: 'text' }),  // L213
  gb.text('fileNm', 300, '파일명'),  // L214 SQL 계산 컬럼(selectByCompanyId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L215) addCell
  // ⚠ 대응 없음 (GridBuilder L216) addCell
  gb.textCenter('noteYnStr', 100, '참고내용'),  // L217 SQL 계산 컬럼(selectByCompanyId: ( CASE WHEN sys54_note IS NOT NULL THEN…)
  // ⚠ 대응 없음 (GridBuilder L218) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insert}>등록</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys54_Edit_Note (`client/vi/sys/Sys54_Edit_Note.java`, 123줄)


#### 이벤트
[E1] updateButton[저장].Select (L64) → update()
[E2] closeButton[닫기].Select (L70) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-80 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L82-100 | E1 | 서비스 sys.Sys54_SpecificMenuHistory.updateByNote(specificMenuHistoryId, note) | 업무 |
| private setHtmlHeaderStyle() | L102-104 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys52_Lookup_SpecificMenuLink (`client/vi/sys/Sys52_Lookup_SpecificMenuLink.java`, 184줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `linkCodeComboBox` ComboBoxField("LinkCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - linkName 300 "Link명" Text 편집:linkCodeComboBox
  - note 480 "비고" Text 편집:TextField

#### 이벤트
[E1] retrieveButton[조회].Select (L83) → retrieve()
[E2] insertButton[등록].Select (L89) → insertRow()
[E3] updateButton[저장].Select (L95) → update()
[E4] deleteButton[삭제].Select (L101) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L156) → 서비스 sys.Sys52_SpecificMenuLink.delete
[E5] closeButton[닫기].Select (L107) → hide()
[E6] linkCodeComboBox[LinkCode].Collapse (L117) → 인라인 L117-124 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L82-113 | open | 상태 처리 | 업무 |
| public retrieve() | L133-143 | E1,open | 서비스 sys.Sys52_SpecificMenuLink.selectBySpecificWorkCode(specificWorkCode, companyId) | 업무 |
| private insertRow() | L145-151 | E2 | 상태 처리 | 업무 |
| private deleteRow() | L153-174 | E4 | ConfirmBox → E7 | 업무 |
| private update() | L176-179 | E3 | 서비스 sys.Sys52_SpecificMenuLink.update | 업무 |
| package buildGrid() | L115-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L181-183 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('linkNm', 300, 'Link명', { editor: 'select' }),  // L127 SQL 계산 컬럼(selectBySpecificWorkCode: f_cdnm('LinkCode', sys52_link_cd, sys52…)
  gb.text('note', 480, '비고', { editor: 'text' }),  // L128
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys51_Lookup_SpecificMenuPerson (`client/vi/sys/Sys51_Lookup_SpecificMenuPerson.java`, 264줄)

- 툴바 `buttonBar01`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBar02`: {updateGroupButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스):
  - personName 300 "사원명" Text
  - useYn 100 "사용여부" Boolean
  - note 380 "비고" Text 편집:TextField

#### 이벤트
[E1] retrieveButton[조회].Select (L104) → retrieve()
[E2] insertButton[등록].Select (L110) → insertRow()
[E3] updateButton[저장].Select (L116) → update()
[E4] deleteButton[삭제].Select (L122) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L195) → 서비스 sys.Sys51_SpecificMenuPerson.delete
[E5] updateGroupButton[일괄 권한설정].Select (L128) → updateGroupCheck()
       └ [E8] msgBox.DialogHide [YES] (L228) → updateGroup()
[E6] closeButton[닫기].Select (L134) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-101 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L103-140 | open | 상태 처리 | 업무 |
| public retrieve() | L152-162 | E1,open | 서비스 sys.Sys51_SpecificMenuPerson.selectBySpecificMenuId(specificWorkCode, specificMenuId) | 업무 |
| private insertRow() | L164-190 | E2 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow() | L192-213 | E4 | ConfirmBox → E7 | 업무 |
| private update() | L215-218 | E3 | 서비스 sys.Sys51_SpecificMenuPerson.update | 업무 |
| private updateGroupCheck() | L220-244 | E5 | ConfirmBox → E8 | 업무 |
| private updateGroup() | L246-259 | E8 | 서비스 sys.Sys51_SpecificMenuPerson.updateGroup(companyId, specificWorkCode, specificMenuId) | 업무 |
| package buildGrid() | L142-150 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L261-263 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personNm', 300, '사원명'),  // L145 SQL 계산 컬럼(selectBySpecificMenuId: f_get_empTrans(sys51_person_id, f_sysda…)
  gb.boolean('useYn', 100, '사용여부'),  // L146
  gb.text('note', 380, '비고', { editor: 'text' }),  // L147
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="save" onClick={updateGroupCheck}>일괄 권한설정</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys06_Lookup_SelectMulti (`client/vi/sys/Sys06_Lookup_SelectMulti.java`, 173줄)

- 툴바 `buttonBar`: 매뉴명: {menuName} {retrieveButton} {menuNameYn}
- 입력·하위 화면: `menuName` TextField, `menuNameYn` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - parentPathName 300 "경로" Text
  - menuName 200 "매뉴명" Text

#### 이벤트
[E1] menuName.KeyPress [Enter] (L92) → retrieve()
[E2] retrieveButton[조회].Select (L100) → retrieve()
[E3] confirmButton[확인].Select (L106) → confirm()
[E4] closeButton[닫기].Select (L112) → hide()
[E5] grid.CellDoubleClick (L119) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-52 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L54-84 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L136-148 | E1,E2,open | 서비스 sys.Sys06_Menu.getAllMenuList(searchText, menuNameYn) | 업무 |
| public confirm() | L150-160 | E3,E5 | 상태 처리 | 업무 |
| private settings() | L86-125 | open | 이벤트 연결, 초기값: menuNameYn=false("매뉴명만 검색") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L127-134 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L162-164 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L166-168 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L170-172 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentPathNm', 300, '경로'),  // L131 SQL 계산 컬럼(getAllMenuList: TRIM(TRAILING sys06_menu_nm FROM f_menu…)
  gb.text('menuNm', 200, '매뉴명'),  // L132
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys03_Lookup_CompanyMenu (`client/vi/sys/Sys03_Lookup_CompanyMenu.java`, 136줄)

- 입력·하위 화면: `outPutCombo` CommonComboBoxField("sys.Sys00_Common.selectLocName2"), `inPutCombo` CommonComboBoxField("sys.Sys00_Common.selectLocName")

#### 이벤트
[E1] insertButton[복사].Select (L57) → insertCheck()
       └ [E3] msgBox.DialogHide [YES] (L91) → insert()
[E2] closeButton[닫기].Select (L64) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-76 | 공개 메서드 | 상태 처리 | 업무 |
| private insertCheck() | L78-107 | E1 | ConfirmBox → E3 | 업무 |
| public insert() | L109-127 | E3 | 서비스 sys.Sys03_CompanyMenu.insert(outPut, inPut) | 업무 |
| private setHtmlStyle() | L129-131 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L133-135 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={insertCheck}>복사</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys01_TabPage_Info04 (`client/vi/sys/Sys01_TabPage_Info04.java`, 279줄)

- 툴바 `buttonBar`: {updateButton}
- 입력·하위 화면: `monthComboBox` ComboBoxField("MonthsCode"), `taxComboBox` ComboBoxField("TaxType"), `incomeTaxFilingComboBox` ComboBoxField("IncomeTaxFilingCode"), `accountCloseMonthComboBox` ComboBoxField("MonthsCode"), `ownerCapitalApplyComboBox` ComboBoxField("OwnerCapitalApplyDateType"), `astEvalCycleComboBox` ComboBoxField("AssetEvalCycleCode"), `empEvalCycleComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `empEvalMonthComboBox` ComboBoxField("MonthsCode")
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - leaveMonthName 120 "휴가결산(월)" TextCenter 편집:"0069B4"
  - leaveYn 120 "초과사용허용" Boolean
  - leaveConfirmYn 140 "초과사용<br>상신전 승인요청" Boolean
  - leaveCompulsionRt 140 "의무사용율(%)" LongCenter 편집:LongField
  - commuteLockYn 120 "근태<br>잠금사용" Boolean
  - commutePopupYn 120 "근태<br>팝업사용" Boolean
  - taxTypeName 100 "과세구분" TextCenter 편집:"0069B4"
  - cardRealUserYn 120 "법인카드<br>실사용자관리" Boolean
  - incomeTaxFilingName 100 "소득세신고<br>주기구분" TextCenter 편집:"0069B4"
  - accountCloseMonthName 120 "회계결산(월)" TextCenter 편집:"0069B4"
  - ownerCapitalApplyName 120 "자기자본<br>적용일" TextCenter 편집:ownerCapitalApplyCo…
  - astManagerAutoYn 150 "종목별 담당자<br>자동설정" Boolean
  - astEvalCycleName 120 "평가주기" TextCenter 편집:astEvalCycleComboBox
  - empEvalMonthName 120 "시작월" TextCenter 편집:"107C41"
  - empEvalCycleName 120 "평가기간" TextCenter 편집:"107C41"

#### 이벤트
[E0] 화면 열림 (생성자 L42-59) → 초기화
[E1] updateButton[저장].Select (L45) → update()
[E2] monthComboBox[MonthsCode].ValueChange (L74) → 인라인 L74-81 (new ValueChangeHandler<String>() { @O…)
[E3] taxComboBox[TaxType].ValueChange (L92) → 인라인 L92-99 (new ValueChangeHandler<String>() { @O…)
[E4] incomeTaxFilingComboBox[IncomeTaxFilingCode].ValueChange (L110) → 인라인 L110-117 (new ValueChangeHandler<String>() { @O…)
[E5] accountCloseMonthComboBox[MonthsCode].ValueChange (L128) → 인라인 L128-135 (new ValueChangeHandler<String>() { @O…)
[E6] ownerCapitalApplyComboBox[OwnerCapitalApplyDateType].ValueChange (L146) → 인라인 L146-153 (new ValueChangeHandler<String>() { @O…)
[E7] astEvalCycleComboBox[AssetEvalCycleCode].ValueChange (L164) → 인라인 L164-171 (new ValueChangeHandler<String>() { @O…)
[E8] empEvalCycleComboBox[sys.Sys00_Common.selectByKindGroupCode].ValueChange (L187) → 인라인 L187-194 (new ValueChangeHandler<String>() { @O…)
[E9] empEvalMonthComboBox[MonthsCode].ValueChange (L205) → 인라인 L205-212 (new ValueChangeHandler<String>() { @O…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L244-247 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L249-253 | 공개 메서드 | 서비스 sys.Sys01_Company.selectById(companyId) | 업무 |
| public update() | L255-258 | E1 | 서비스 sys.Sys01_Company.update | 업무 |
| public retrieve() | L260-263 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L266-268 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L271-274 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L61-242 | 필드 초기화 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlGridStyle() | L276-278 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L217 newHeaderGroupMap00newHeaderGroupConfig15 100 "휴가" (sys01_new_header_group_map00new_header_group_config15 컬럼 없음)
  // ⚠DB없음 L218 newHeaderGroupMap010newHeaderGroupConfig14 100 "고유자산" (sys01_new_header_group_map010new_header_group_config14 컬럼 없음)
  // ⚠DB없음 L219 newHeaderGroupMap014newHeaderGroupConfigsetHtmlGridStyle12 100 "인사평가" (sys01_new_header_group_map014new_header_group_configset_html_grid_style12 컬럼 없음)
  gb.textCenter('leaveMonthNm', 120, '휴가결산(월)', { editor: 'select' }),  // L221 SQL 계산 컬럼(selectById: f_cdnm('MonthsCode', sys01_leave_month_…)
  gb.boolean('leaveYn', 120, '초과사용허용'),  // L222
  gb.boolean('leaveConfirmYn', 140, '초과사용<br>상신전 승인요청'),  // L223
  gb.longCenter('leaveCompulsionRt', 140, '의무사용율(%)', { editor: 'number' }),  // L224
  gb.boolean('commuteLockYn', 120, '근태<br>잠금사용'),  // L226
  gb.boolean('commutePopupYn', 120, '근태<br>팝업사용'),  // L227
  gb.textCenter('taxTypeNm', 100, '과세구분', { editor: 'select' }),  // L229 SQL 계산 컬럼(selectById: f_cdnm('TaxType', sys01_tax_type, sys01…)
  gb.boolean('cardRealUserYn', 120, '법인카드<br>실사용자관리'),  // L230
  gb.textCenter('incomeTaxFilingNm', 100, '소득세신고<br>주기구분', { editor: 'select' }),  // L231 SQL 계산 컬럼(selectById: f_cdnm('IncomeTaxFilingCode', sys01_inc…)
  gb.textCenter('accountCloseMonthNm', 120, '회계결산(월)', { editor: 'select' }),  // L233 SQL 계산 컬럼(selectById: f_cdnm('MonthsCode', sys01_account_clos…)
  gb.textCenter('ownerCapitalApplyNm', 120, '자기자본<br>적용일', { editor: 'select' }),  // L234 SQL 계산 컬럼(selectById: f_cdnm('OwnerCapitalApplyDateType', sys…)
  gb.boolean('astManagerAutoYn', 150, '종목별 담당자<br>자동설정'),  // L235
  gb.textCenter('astEvalCycleNm', 120, '평가주기', { editor: 'select' }),  // L236 SQL 계산 컬럼(selectById: f_cdnm('AssetEvalCycleCode', sys01_ast_…)
  gb.textCenter('empEvalMonthNm', 120, '시작월', { editor: 'select' }),  // L238 SQL 계산 컬럼(selectById: f_cdnm('MonthsCode', sys01_emp_eval_mon…)
  gb.textCenter('empEvalCycleNm', 120, '평가기간', { editor: 'select' }),  // L239 SQL 계산 컬럼(selectById: f_cdnm('CycleCode', sys01_emp_eval_cycl…)
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

### Sys01_TabPage_Info03 (`client/vi/sys/Sys01_TabPage_Info03.java`, 161줄)

- 툴바 `buttonBar`: {updateButton}
- 입력·하위 화면: `dcrNumberingComboBox` ComboBoxField("DcrNumberingCode"), `icsCheckCycleComboBox` ComboBoxField("IcsCheckListCycleType"), `icsComplyCycleComboBox` ComboBoxField("IcsCheckListCycleType"), `icsCheckConfirmerComboBox` ComboBoxField("IcsCheckListConfirmerType")
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - apprStepLockYn 120 "결재선 잠금" Boolean
  - companyRepName 200 "(대외문서)<br>대표이사" TextCenter 편집:TextField
  - aprManagerInfoYn 130 "(대외문서)<br>담당자정보 포함" Boolean
  - dcrNumberingName 120 "문서번호<br>채번방식" TextCenter 편집:dcrNumberingComboBox
  - dcrDetailUseYn 120 "세부문서분류<br>사용" Boolean
  - dcrPreconfirmSkipYn 100 "심사필번호<br>즉시부여" Boolean 편집:"107C41"
  - icsCheckConfirmerTypeName 100 "체크리스트<br>확인자" TextCenter 편집:"107C41"
  - icsCheckCycleName 100 "체크리스트<br>체크주기" TextCenter 편집:"107C41"
  - icsComplyCycleName 120 "임직원준수점검<br>체크주기" TextCenter 편집:"107C41"
  - icsNonStayYn 120 "비상근인력 체크" Boolean 편집:"107C41"
  - fltOnlyCurrYn 150 "임직원매매 사전신고<br>소급 미사용" Boolean 편집:"107C41"
  - icsGuideYn 120 "문서-연관법규<br>자동반영 사용" Boolean 편집:"107C41"
  - tdmStartDate 100 "책무이행점검<br>기산일" Date 편집:MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L41-58) → 초기화
[E1] updateButton[저장].Select (L44) → update()
[E2] dcrNumberingComboBox[DcrNumberingCode].ValueChange (L65) → 인라인 L65-72 (new ValueChangeHandler<String>() { @O…)
[E3] icsCheckCycleComboBox[IcsCheckListCycleType].ValueChange (L74) → 인라인 L74-81 (new ValueChangeHandler<String>() { @O…)
[E4] icsComplyCycleComboBox[IcsCheckListCycleType].ValueChange (L84) → 인라인 L84-91 (new ValueChangeHandler<String>() { @O…)
[E5] icsCheckConfirmerComboBox[IcsCheckListConfirmerType].ValueChange (L94) → 인라인 L94-101 (new ValueChangeHandler<String>() { @O…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L127-130 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L132-136 | 공개 메서드 | 서비스 sys.Sys01_Company.selectById(companyId) | 업무 |
| public update() | L138-141 | E1 | 서비스 sys.Sys01_Company.update | 업무 |
| public retrieve() | L143-146 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L149-151 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L154-157 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L60-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlGridStyle() | L158-160 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L103 newHeaderGroupMap00newHeaderGroupConfig16 100 "전자결재" (sys01_new_header_group_map00new_header_group_config16 컬럼 없음)
  // ⚠DB없음 L104 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle17 100 "내부통제" (sys01_new_header_group_map06new_header_group_configset_html_grid_style17 컬럼 없음)
  gb.boolean('apprStepLockYn', 120, '결재선 잠금'),  // L108
  gb.textCenter('companyRepNm', 200, '(대외문서)<br>대표이사', { editor: 'text' }),  // L109
  gb.boolean('aprManagerInfoYn', 130, '(대외문서)<br>담당자정보 포함'),  // L110
  gb.textCenter('dcrNumberingNm', 120, '문서번호<br>채번방식', { editor: 'select' }),  // L111 SQL 계산 컬럼(selectById: f_cdnm('DcrNumberingCode', sys01_dcr_nu…)
  gb.boolean('dcrDetailUseYn', 120, '세부문서분류<br>사용'),  // L112
  gb.boolean('dcrPreconfirmSkipYn', 100, '심사필번호<br>즉시부여'),  // L114
  gb.textCenter('icsCheckConfirmerTypeNm', 100, '체크리스트<br>확인자', { editor: 'select' }),  // L115 SQL 계산 컬럼(selectById: f_cdnm('IcsCheckListConfirmerType', sys…)
  gb.textCenter('icsCheckCycleNm', 100, '체크리스트<br>체크주기', { editor: 'select' }),  // L116 SQL 계산 컬럼(selectById: f_cdnm('IcsCheckListCycleType', sys01_i…)
  gb.textCenter('icsComplyCycleNm', 120, '임직원준수점검<br>체크주기', { editor: 'select' }),  // L117 SQL 계산 컬럼(selectById: f_cdnm('IcsCheckListCycleType', sys01_i…)
  gb.boolean('icsNonStayYn', 120, '비상근인력 체크'),  // L118
  gb.boolean('fltOnlyCurrYn', 150, '임직원매매 사전신고<br>소급 미사용'),  // L119
  gb.boolean('icsGuideYn', 120, '문서-연관법규<br>자동반영 사용'),  // L120
  gb.date('tdmStartDate', 100, '책무이행점검<br>기산일', { editor: 'date' }),  // L122
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

### Sys01_TabPage_Info02 (`client/vi/sys/Sys01_TabPage_Info02.java`, 137줄)

- 툴바 `buttonBar`: {updateButton}
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - startDate 100 "설립일" Date 편집:"0069B4"
  - bizNo 120 "사업자등록번호" TextCenter 편집:"0069B4"
  - decCorpRegNo 120 "법인등록번호" TextCenter 편집:"0069B4"
  - empInfo 200 "담당자(이름/부서/직책)" TextCenter 편집:TextField
  - mobileTelNo 120 "비상전화" TextCenter 편집:TextField
  - officeTelNo 120 "대표전화" TextCenter 편집:TextField
  - officeFaxNo 120 "FAX번호" TextCenter 편집:TextField
  - emailAddress 150 "이메일주소" Text 편집:TextField
  - zipCode 80 "우편번호" TextCenter 편집:TextField
  - zipAddress 350 "주소" Text 편집:TextField
  - zipDetail 150 "상세주소" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L38-55) → 초기화
[E1] updateButton[저장].Select (L41) → updateCorpRegNo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L77-80 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L82-86 | 공개 메서드 | 서비스 sys.Sys01_Company.selectById(companyId) | 업무 |
| public updateCorpRegNo() | L88-115 | E1 | 서비스 sys.Sys01_Company.getCorpRegNo(companyId, decCorpRegNo) | 업무 |
| public update() | L117-120 | updateCorpRegNo | 서비스 sys.Sys01_Company.update | 업무 |
| public retrieve() | L122-125 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L128-130 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L133-136 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L57-75 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '설립일', { editor: 'date' }),  // L62
  gb.textCenter('bizNo', 120, '사업자등록번호', { editor: 'text' }),  // L63
  gb.textCenter('decCorpRegNo', 120, '법인등록번호', { editor: 'text' }),  // L64 SQL 계산 컬럼(selectById: to_decrypts(sys01_corp_reg_no))
  gb.textCenter('empInfo', 200, '담당자(이름/부서/직책)', { editor: 'text' }),  // L65
  gb.textCenter('mobileTelNo', 120, '비상전화', { editor: 'text' }),  // L66
  gb.textCenter('officeTelNo', 120, '대표전화', { editor: 'text' }),  // L67
  gb.textCenter('officeFaxNo', 120, 'FAX번호', { editor: 'text' }),  // L68
  gb.text('emailAddr', 150, '이메일주소', { editor: 'text' }),  // L69
  gb.textCenter('zipCd', 80, '우편번호', { editor: 'text' }),  // L70
  gb.text('zipAddr', 350, '주소', { editor: 'text' }),  // L71
  gb.text('zipDetail', 150, '상세주소', { editor: 'text' }),  // L72
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={updateCorpRegNo}>저장</Button>

### Sys01_TabPage_Info01 (`client/vi/sys/Sys01_TabPage_Info01.java`, 186줄)

- 툴바 `buttonBar`: {updateButton} {clipBoardButton}
- 입력·하위 화면: `lookup` Sys29_Lookup_PublicIpList, `erpProductComboBox` ComboBoxField("ErpProductCode")
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - loginSecureYn 100 "보안로그인" Boolean
  - actionCell 30 " " Cell 편집:actionCell01
  - companyName 200 "고객명" TextCenter 편집:"0069B4"
  - locationName 120 "서브도메인" TextCenter 편집:"0069B4"
  - mailInfo 100 "메일서버" TextCenter 편집:"0069B4"
  - mailLogYn 80 "메일기록" Boolean
  - emgrcyPasswd 100 "회사암호" TextCenter 편집:"0069B4"
  - erpProductName 120 "적용상품" TextCenter 편집:"0069B4"
  - secondaryAuthYn 100 "2차인증" Boolean 편집:"0069B4"
  - contractType 100 "계약유형" TextCenter 편집:TextField
  - noticeDate 140 "시스템사용<br>시작일" Date 편집:MyDateField
  - closeDate 100 "계약종료일" Date 편집:MyDateField
  - icamCompanyCode 80 "ICAM<br>운용사코드" TextCenter 편집:TextField
  - icamAdvisCompanyCode 80 "ICAM<br>자문사코드" TextCenter 편집:TextField
  - assetYn 80 "운용사" Boolean
  - advisYn 80 "자문사" Boolean
  - pbsYn 80 "PBS" Boolean
  - useYn 80 "사용여부" Boolean
  - note 250 "비고" Text
  - actionCell 30 " " Cell 편집:actionCell02
  - companyId 150 "companyId" Long

#### 이벤트
[E0] 화면 열림 (생성자 L44-68) → 초기화
[E1] updateButton[저장].Select (L47) → update()
[E2] clipBoardButton[회사ID 복사].Select (L53) → 인라인 L53-58 (new SelectHandler() { @Override publi…)
[E3] erpProductComboBox[ErpProductCode].ValueChange (L88) → 인라인 L88-95 (new ValueChangeHandler<String>() { @O…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L145-148 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L150-154 | 공개 메서드 | 서비스 sys.Sys01_Company.selectById(companyId) | 업무 |
| public update() | L156-159 | E1 | 서비스 sys.Sys01_Company.update | 업무 |
| public retrieve() | L161-164 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L167-169 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L182-185 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L70-143 | 필드 초기화 | 조회창 Sys29_Lookup_PublicIpList 열기, 팝업 Sys01_Edit_Note 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.boolean('loginSecureYn', 100, '보안로그인'),  // L120
  // ⚠ 대응 없음 (GridBuilder L121) addCell
  gb.textCenter('companyNm', 200, '고객명', { editor: 'text' }),  // L122
  gb.textCenter('locNm', 120, '서브도메인', { editor: 'text' }),  // L123
  gb.textCenter('mailInfo', 100, '메일서버', { editor: 'text' }),  // L124
  gb.boolean('mailLogYn', 80, '메일기록'),  // L125
  gb.textCenter('emgrcyPasswd', 100, '회사암호', { editor: 'text' }),  // L126
  gb.textCenter('erpProductNm', 120, '적용상품', { editor: 'select' }),  // L127 SQL 계산 컬럼(selectById: f_cdnm('ErpProductCode', sys01_erp_prod…)
  gb.boolean('secondaryAuthYn', 100, '2차인증'),  // L128
  gb.textCenter('contType', 100, '계약유형', { editor: 'text' }),  // L129
  gb.date('noticeDate', 140, '시스템사용<br>시작일', { editor: 'date' }),  // L130
  gb.date('closeDate', 100, '계약종료일', { editor: 'date' }),  // L131
  gb.textCenter('icamCompanyCd', 80, 'ICAM<br>운용사코드', { editor: 'text' }),  // L132
  gb.textCenter('icamAdvisCompanyCd', 80, 'ICAM<br>자문사코드', { editor: 'text' }),  // L133
  gb.boolean('assetYn', 80, '운용사'),  // L134
  gb.boolean('advisYn', 80, '자문사'),  // L135
  gb.boolean('pbsYn', 80, 'PBS'),  // L136
  gb.boolean('useYn', 80, '사용여부'),  // L137
  gb.text('note', 250, '비고'),  // L138
  // ⚠ 대응 없음 (GridBuilder L139) addCell
  gb.long('companyId', 150, 'companyId'),  // L140
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L53-58 (new SelectHandler() { @Override publi…) */}>회사ID 복사</Button>

### Sys29_Lookup_PublicIpList (`client/vi/sys/Sys29_Lookup_PublicIpList.java`, 173줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - startDate 100 "시작일" Date 편집:MyDateField
  - closeDate 100 "종료일" Date 편집:MyDateField
  - publicIp 200 "공인IP" Text 편집:TextField
  - note 200 "비고" Text 편집:TextField

#### 이벤트
[E1] retrieveButton[조회].Select (L81) → retrieve()
[E2] insertButton[등록].Select (L87) → insertRow()
[E3] updateButton[저장].Select (L93) → update()
[E4] deleteButton[삭제].Select (L99) → delete()
       └ [E6] msgBox.DialogHide [YES] (L146) → 서비스 sys.Sys29_LoginSecure.delete
[E5] closeButton[닫기].Select (L105) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-78 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L124-133 | E1,open | 서비스 sys.Sys29_LoginSecure.selectByCompanyId(companyId) | 업무 |
| private insertRow() | L135-141 | E2 | 상태 처리 | 업무 |
| private delete() | L143-163 | E4 | ConfirmBox → E6 | 업무 |
| private update() | L165-168 | E3 | 서비스 sys.Sys29_LoginSecure.update | 업무 |
| private settings() | L80-111 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L113-122 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L170-172 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L117
  gb.date('closeDate', 100, '종료일', { editor: 'date' }),  // L118
  gb.text('publicIp', 200, '공인IP', { editor: 'text' }),  // L119
  gb.text('note', 200, '비고', { editor: 'text' }),  // L120
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys01_Edit_Note (`client/vi/sys/Sys01_Edit_Note.java`, 94줄)

- 입력·하위 화면: `note` TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L40-59) → settings()
[E1] updateButton[저장].Select (L62) → update()
[E2] closeButton[닫기].Select (L68) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L32-38 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L76-89 | E1 | 서비스 sys.Sys01_Company.updateNote(companyId, note) | 업무 |
| private settings() | L61-74 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L91-93 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys01_Edit_Company (`client/vi/sys/Sys01_Edit_Company.java`, 250줄)

- 입력·하위 화면: `companyName` TextField, `locationName` TextField, `emgrcyPasswd` TextField, `bizNo` TextField, `mailInfo` TextField, `startDate` MyDateField, `leaveMonthCode` TextField, `taxType` TextField, `accountCloseMonth` TextField, `leaveMonthName` ComboBoxField("MonthsCode"), `taxTypeName` ComboBoxField("TaxType"), `accountCloseMonthName` ComboBoxField("MonthsCode")

#### 이벤트
[E0] 화면 열림 (생성자 L69-101) → settings(), getEditor(), show()
[E1] leaveMonthName[MonthsCode].Collapse (L104) → 인라인 L104-109 (new CollapseHandler() { @Override pub…)
[E2] taxTypeName[과세구분].Collapse (L110) → 인라인 L110-115 (new CollapseHandler() { @Override pub…)
[E3] accountCloseMonthName[MonthsCode].Collapse (L116) → 인라인 L116-121 (new CollapseHandler() { @Override pub…)
[E4] updateButton[등록].Select (L122) → updateChk()
       └ [E6] msgBox.DialogHide [YES] (L206) → update()
[E5] closeButton[닫기].Select (L128) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L136-170 | 생성자 | 상태 처리 | 업무 |
| private spaceDelete() | L172-178 | updateChk | 상태 처리 | 업무 |
| private updateChk() | L180-222 | E4 | ConfirmBox → E6 | 업무 |
| private update() | L224-241 | E6 | 서비스 sys.Sys01_Company.update | 업무 |
| private settings() | L103-134 | 생성자 | 이벤트 연결, 초기값: leaveMonthCode=leaveMonthName.getCode(, taxType=taxTypeName.getCode(, accountCloseMonth=accountCloseMonthName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L243-245 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L247-249 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={updateChk}>등록</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

