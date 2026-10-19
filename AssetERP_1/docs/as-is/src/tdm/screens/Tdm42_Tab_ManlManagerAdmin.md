# Tdm42_Tab_ManlManagerAdmin

- 종류: 화면
- 메뉴: 기초자료 > 10. 책무 > 책무매뉴얼 재생성 (#1502)
- 파일: `client/vi/tdm/Tdm42_Tab_ManlManagerAdmin.java`
- 함께 쓰는 클래스 5개:
  - `Tdm43_Lookup_ManlItem` `client/vi/tdm/Tdm43_Lookup_ManlItem.java`
  - `Tdm43_Edit_Manl` `client/vi/tdm/Tdm43_Edit_Manl.java`
  - `Tdm43_Page_Relate` `client/vi/tdm/Tdm43_Page_Relate.java`
  - `Tdm43_Lookup_RelateFormFileList` `client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`
  - `Tdm43_Lookup_ExctDuty` `client/vi/tdm/Tdm43_Lookup_ExctDuty.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr01_Lookup_SelectMulti`](../../dcr/components/Dcr01_Lookup_SelectMulti.md), [`Icr01_Lookup_ClassTreeDetail`](../../icr/components/Icr01_Lookup_ClassTreeDetail.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Org00_Lookup_SelectTdm`](../../org/components/Org00_Lookup_SelectTdm.md), [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectByKindGroupCode` | Tdm43_Edit_Manl:240 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.checkFileStatus` | Tdm42_Tab_ManlManagerAdmin:515 | [`Sys10_File.java:591`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.copyFile` | Tdm42_Tab_ManlManagerAdmin:577 | [`Sys10_File.java:417`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys10_File.fileReName` | Tdm42_Tab_ManlManagerAdmin:522 | [`Sys10_File.java:557`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.getServerPath` | Tdm42_Tab_ManlManagerAdmin:469 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.selectByParentId` | Tdm42_Tab_ManlManagerAdmin:363 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectUnConnTdmFormFile` | Tdm43_Lookup_RelateFormFileList:174 | [`Sys10_File.java:97`](../../sys/services/Sys10_File.md) | [`sys10_file.selectUnConnTdmFormFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Tdm43_Page_Relate:458 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.selectByParentId` | Tdm43_Page_Relate:295 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys99_Print.CreateTdmManlOrg` | Tdm42_Tab_ManlManagerAdmin:322, Tdm42_Tab_ManlManagerAdmin:454 | [`Sys99_Print.java:180`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm42_ManlOrg.fileCheck` | Tdm42_Tab_ManlManagerAdmin:433 | [`Tdm42_ManlOrg.java:246`](../../tdm/services/Tdm42_ManlOrg.md) | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `tdm.Tdm42_ManlOrg.selectByText` | Tdm42_Tab_ManlManagerAdmin:297 | [`Tdm42_ManlOrg.java:27`](../../tdm/services/Tdm42_ManlOrg.md) | [`tdm42_manl_org.selectByText`](../../tdm/sql/tdm42_manl_org.md) |
| `tdm.Tdm43_Manl.delete` | Tdm43_Lookup_ManlItem:257 | [`Tdm43_Manl.java:321`](../../tdm/services/Tdm43_Manl.md) | [`sys11_relate_file.deleteByParentId`](../../sys/sql/sys11_relate_file.md), [`tdm45_manl_relate_ics.deleteByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md), [`tdm46_manl_relate_icr.deleteByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md), [`tdm47_manl_relate_dcr.deleteByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md), `UpdateDataModel(tdm43_manl)` 동적 DELETE |
| `tdm.Tdm43_Manl.modelUpdate` | Tdm43_Edit_Manl:487 | [`Tdm43_Manl.java:230`](../../tdm/services/Tdm43_Manl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm43_manl.getNewManlCode`](../../tdm/sql/tdm43_manl.md), `UpdateDataModel(tdm45_manl_relate_ics)` 동적 INSERT/UPDATE → [`tdm45_manl_relate_ics.selectById`](../../tdm/sql/tdm45_manl_relate_ics.md), `UpdateDataModel(tdm46_manl_relate_icr)` 동적 INSERT/UPDATE → [`tdm46_manl_relate_icr.selectById`](../../tdm/sql/tdm46_manl_relate_icr.md), `UpdateDataModel(sys11_relate_file)` 동적 INSERT/UPDATE → [`sys11_relate_file.selectById`](../../sys/sql/sys11_relate_file.md), `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 INSERT/UPDATE → [`tdm47_manl_relate_dcr.selectById`](../../tdm/sql/tdm47_manl_relate_dcr.md), `UpdateDataModel(tdm43_manl)` 동적 INSERT/UPDATE → [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.selectByManlOrgId` | Tdm43_Lookup_ManlItem:185 | [`Tdm43_Manl.java:53`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectByManlOrgId`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm45_ManlRelateIcs.delete` | Tdm43_Page_Relate:386 | [`Tdm45_ManlRelateIcs.java:68`](../../tdm/services/Tdm45_ManlRelateIcs.md) | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE |
| `tdm.Tdm45_ManlRelateIcs.selectByManlId` | Tdm43_Page_Relate:271 | [`Tdm45_ManlRelateIcs.java:26`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm45_manl_relate_ics.selectByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm46_ManlRelateIcr.delete` | Tdm43_Page_Relate:422 | [`Tdm46_ManlRelateIcr.java:63`](../../tdm/services/Tdm46_ManlRelateIcr.md) | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 DELETE |
| `tdm.Tdm46_ManlRelateIcr.selectByManlId` | Tdm43_Page_Relate:283 | [`Tdm46_ManlRelateIcr.java:26`](../../tdm/services/Tdm46_ManlRelateIcr.md) | [`tdm46_manl_relate_icr.selectByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md) |
| `tdm.Tdm47_ManlRelateDcr.delete` | Tdm43_Page_Relate:487 | [`Tdm47_ManlRelateDcr.java:60`](../../tdm/services/Tdm47_ManlRelateDcr.md) | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 DELETE |
| `tdm.Tdm47_ManlRelateDcr.selectByManlId` | Tdm43_Page_Relate:307 | [`Tdm47_ManlRelateDcr.java:26`](../../tdm/services/Tdm47_ManlRelateDcr.md) | [`tdm47_manl_relate_dcr.selectByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_company_nm`, `f_get_exctdutymap_nm`, `f_get_tdmcheckcycle`, `f_get_tdmorg_id2`, `f_sysdate`, `f_today`, `f_trunc`, `getorg`, `tdm_create_data`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm42_Tab_ManlManagerAdmin (`client/vi/tdm/Tdm42_Tab_ManlManagerAdmin.java`, 616줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 고객사: {companyField} 부서: {orgLookup} 조회기간(적용시작일): {startDate} ~: {closeDate} {notPeriodYn} 검색: {searchText} {retrieveButton} {reCreateButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="직책/임원", `notPeriodYn` CheckBox, `companyField` LookupTriggerField, `orgLookup` LookupTriggerField 빈칸="전체", `orgSearch` Org00_Lookup_SelectTdm, `lookupCompany` Sys01_Lookup_Company, `lookup` Tdm43_Lookup_ManlItem, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - companyName 180 "회사명" Text
  - orgName 200 "지원부서" Text
  - roleName 200 "직책" Text
  - exctName 100 "임원" TextCenter
  - manlDutyEndYn 70 "작성완료" BooleanYn2
  - manlDutyEndDate 100 "작성완료일" Date
  - taskCnt 80 "책무" LongCenter
  - taskRelateDetailCnt 80 "책무세부" LongCenter
  - taskRelateDutyCnt 80 "관리의무" LongCenter
  - manlCnt 80 "점검항목" LongCenter
  - actionCell 30 " " Cell 편집:editCell
  - startDate 100 "적용시작일" Date
  - endDate 100 "적용종료일" Date
  - startDateYnStr 80 "책무매뉴얼" DynamicCell 편집:viewCell
  - apprStatusName 100 "결재상태" TextStatus
  - jobName 200 "작업명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L88-125) → settings()
[E1] notPeriodYn[전체보기].ValueChange [event.getValue()] (L140) → retrieve()
[E2] orgLookup.TriggerClick [result != null] (L157) → 인라인 L157-176 (new TriggerClickHandler(){ @Override …)
[E3] companyField[ADMIN].TriggerClick [result != null] (L178) → 인라인 L178-197 (new TriggerClickHandler() { @Override…)
[E4] searchText.KeyPress [Enter] (L201) → retrieve()
[E5] retrieveButton[조회].Select (L210) → retrieve()
[E6] reCreateButton[재생성].Select (L217) → reCreateFile()
[E7] button01[닫기].Select (L404) → 인라인 L404-409 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L268-304 | E1,E4,E5 | 서비스 tdm.Tdm42_ManlOrg.selectByText(companyId, orgId, searchText, useYn, adminYn, notPeriodYn, startDate, closeDate) | 업무 |
| private lookupDetail() | L306-316 | buildGrid | 조회창 Tdm43_Lookup_ManlItem 열기 | 업무 |
| private viewRd() | L318-360 | buildGrid,viewFile | 서비스 sys.Sys99_Print.CreateTdmManlOrg(companyId, personId, windowClassName, pJobTp, updDate, pId) | 업무 |
| private viewFile() | L362-382 | buildGrid | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private reCreateFile() | L384-416 | E6 | 확인창 표시 | 업무 |
| private processRecreate() | L418-449 | reCreateFile | 확인창 표시, 서비스 tdm.Tdm42_ManlOrg.fileCheck(parentId) | 업무 |
| private createRd() | L451-572 | processRecreate | 확인창 표시, 서비스 sys.Sys99_Print.CreateTdmManlOrg, sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName(companyId, personId, windowClassName, pJobTp, updDate, pId, companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType) | 업무 |
| private relateRdFile() | L574-601 | createRd | 확인창 표시, 서비스 sys.Sys10_File.copyFile(apprId, companyId, parentId, tableName) | 업무 |
| private settings() | L127-224 | 생성자 | 조회창 Org00_Lookup_SelectTdm 열기, 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, notPeriodYn=true("전체보기"), companyField=companyModel.getCompanyName(("ADMIN"), companyField="전체"("ADMIN") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L226-266 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L603-605 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L606-608 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlContentStyle() | L609-611 | reCreateFile,processRecreate,createRd,relateRdFile | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L612-614 | reCreateFile | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L246 newHeaderGroupMap07newHeaderGroupConfig15 100 "건수" (tdm42_new_header_group_map07new_header_group_config15 컬럼 없음)
  gb.text('companyNm', 180, '회사명'),  // L248 SQL 계산 컬럼(selectByText: f_get_company_nm(tdm42_company_id))
  gb.text('orgNm', 200, '지원부서'),  // L249 SQL 계산 컬럼(selectByText: org00_kor_nm)
  gb.text('roleNm', 200, '직책'),  // L250 SQL 계산 컬럼(selectByText: COALESCE(role_nm, tdm20_role_nm))
  gb.textCenter('exctNm', 100, '임원'),  // L251 SQL 계산 컬럼(selectByText: f_emp_kor_nm(tdm42_exct_id))
  gb.booleanYn2('manlDutyEndYn', 70, '작성완료'),  // L252 SQL 계산 컬럼(selectByText: end_yn)
  gb.date('manlDutyEndDate', 100, '작성완료일'),  // L253 SQL 계산 컬럼(selectByText: CASE WHEN end_yn THEN end_date ELSE nul…)
  gb.longCenter('taskCnt', 80, '책무'),  // L254 SQL 계산 컬럼(selectByText: task_cnt)
  gb.longCenter('taskRelateDetailCnt', 80, '책무세부'),  // L255 SQL 계산 컬럼(selectByText: task_detail_cnt)
  gb.longCenter('taskRelateDutyCnt', 80, '관리의무'),  // L256 SQL 계산 컬럼(selectByText: task_duty_cnt)
  gb.longCenter('manlCnt', 80, '점검항목'),  // L257 SQL 계산 컬럼(selectByText: task_check_cnt)
  // ⚠ 대응 없음 (GridBuilder L258) addCell
  gb.date('startDate', 100, '적용시작일'),  // L259
  gb.date('endDate', 100, '적용종료일'),  // L260
  // ⚠ 대응 없음 (GridBuilder L261) addDynamicCell
  gb.textStatus('apprStatusNm', 100, '결재상태'),  // L262 SQL 계산 컬럼(selectByText: f_cdnm('AprStatusCode', apr01_status_cd…)
  gb.text('jobNm', 200, '작업명'),  // L263 SQL 계산 컬럼(selectByText: tdm40_job_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="reset" onClick={reCreateFile}>재생성</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L404-409 (new SelectHandler() { @Override publi…) */}>닫기</Button>

### Tdm43_Lookup_ManlItem (`client/vi/tdm/Tdm43_Lookup_ManlItem.java`, 280줄)

- 툴바 `buttonBar`: 검색: {searchText} 사용여부: {useComboBox} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `useComboBox` ComboBoxField("UseYnCode", "%", "전체"), `searchText` TextField 빈칸="책무/책무세부/관리의무/점검항목", `lookup` Tdm43_Edit_Manl
- 그리드 `grid` (buildGrid(), 체크박스):
  - taskName 250 "책무" TextArea
  - taskDetailAddSeq 300 "책무세부" TextArea
  - taskDutyAddSeq 300 "관리의무" TextArea
  - checkItemAddCode 300 "점검항목" TextArea
  - checkItemAddCode 35 "" DynamicCell 편집:viewCell
  - checkHowLimit 350 "점검방법" TextArea
  - checkCycleName 60 "점검주기" Text
  - checkEvidDocName 150 "증빙자료" TextArea
  - unuseYn 50 "미사용" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L60-66) → 초기화
[E1] useComboBox[UseYnCode].Collapse (L110) → retrieve()
[E2] searchText.KeyPress [Enter] (L119) → retrieve()
[E3] retrieveButton[조회].Select (L128) → retrieve()
[E4] insertButton[등록].Select (L134) → insert()
[E5] deleteButton[삭제].Select (L140) → delete()
       └ [E7] messageBox.DialogHide (L252) → 서비스 tdm.Tdm43_Manl.delete
[E6] closeButton[닫기].Select (L146) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L68-105 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L178-191 | E1,E2,E3,open,lookupManl,insert | 서비스 tdm.Tdm43_Manl.selectByManlOrgId(manlOrgId, useYn, searchText) | 업무 |
| private lookupManl() | L193-206 | buildGrid | 팝업 Tdm43_Edit_Manl 열기 | 업무 |
| private insert() | L208-236 | E4 | 팝업 Tdm43_Edit_Manl 열기 | 업무 |
| private delete() | L238-272 | E5 | 미선택 시 alert "삭제할 점점항목을 선택하세요" → 확인창 E7 | 업무 |
| private settings() | L107-152 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L154-176 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L274-276 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L277-279 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('taskNm', 250, '책무'),  // L165
  // ⚠DB없음 L166 taskDetailAddSeq 300 "책무세부" (tdm45_task_detail_add_seq 컬럼 없음)
  // ⚠DB없음 L167 taskDutyAddSeq 300 "관리의무" (tdm45_task_duty_add_seq 컬럼 없음)
  // ⚠DB없음 L168 checkItemAddCode 300 "점검항목" (tdm45_check_item_add_code 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L169) addDynamicCell
  gb.textArea('checkHowLimit', 350, '점검방법'),  // L170
  gb.text('checkCycleNm', 60, '점검주기'),  // L171
  gb.textArea('checkEvidDocNm', 150, '증빙자료'),  // L172
  gb.booleanYn2('unuseYn', 50, '미사용'),  // L173
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Edit_Manl (`client/vi/tdm/Tdm43_Edit_Manl.java`, 637줄)

- 입력·하위 화면: `roleName` TextField, `taskName` TextField, `taskRelateDetailName` MyTextArea, `taskRelateDutyName` MyTextArea, `checkItem` MyTextArea 빈칸="점검항목명을 입력하세요", `checkCycleCode` TextField, `checkMonth` TextField, `ceoDutyCode` TextField, `ceoDutyName` ComboBoxField("TdmCeoDutyCode", "(해당없음)") 빈칸="선택하세요", `exctDutyMap` TextField, `exctDutyName` LookupTriggerField 빈칸="선택하세요", `importLevelCode` TextField, `importLevelName` ComboBoxField("TdmImportLevelCode", "(선택안함)") 빈칸="선택하세요", `checkMonth01Yn` CheckBox, `checkMonth02Yn` CheckBox, `checkMonth03Yn` CheckBox, `checkMonth04Yn` CheckBox, `checkMonth05Yn` CheckBox, `checkMonth06Yn` CheckBox, `checkMonth07Yn` CheckBox, `checkMonth08Yn` CheckBox, `checkMonth09Yn` CheckBox, `checkMonth10Yn` CheckBox, `checkMonth11Yn` CheckBox, `checkMonth12Yn` CheckBox, `checkEvidDocName` MyTextArea 빈칸="증빙자료명을 입력하세요", `checkHow` MyTextArea 빈칸="점검방법을 입력하세요", `refBasis` MyTextArea, `startDate` MyDateField, `relateList` Tdm43_Page_Relate, `checkCycleName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택하세요"

#### 이벤트
[E0] 화면 열림 (생성자 L184-195) → settings(), show()
[E1] exctDutyName[임원의무].TriggerClick (L211) → lookupExctDuty()
[E2] unUseButton[미사용].Select (L218) → 서비스 yyyy.MM.dd
[E3] updateButton[저장].Select (L224) → update()
[E4] closeButton[닫기].Select (L230) → hide()
[E5] checkCycleName[점검주기].Collapse (L243) → setCheckMonthBox()
[E6] checkMonth01Yn.ValueChange (L250) → getCheckMonth()
[E7] checkMonth02Yn.ValueChange (L256) → getCheckMonth()
[E8] checkMonth03Yn.ValueChange (L262) → getCheckMonth()
[E9] checkMonth04Yn.ValueChange (L268) → getCheckMonth()
[E10] checkMonth05Yn.ValueChange (L274) → getCheckMonth()
[E11] checkMonth06Yn.ValueChange (L280) → getCheckMonth()
[E12] checkMonth07Yn.ValueChange (L286) → getCheckMonth()
[E13] checkMonth08Yn.ValueChange (L292) → getCheckMonth()
[E14] checkMonth09Yn.ValueChange (L298) → getCheckMonth()
[E15] checkMonth10Yn.ValueChange (L304) → getCheckMonth()
[E16] checkMonth11Yn.ValueChange (L310) → getCheckMonth()
[E17] checkMonth12Yn.ValueChange (L316) → getCheckMonth()
[E18] anchor.MouseDown (L328) → 인라인 L328-334 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L114-147 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L149-166 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L168-182 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L324-426 | insert,edit,view | 상태 처리 | 업무 |
| private getCheckMonthForm() | L428-464 | getEditor | 상태 처리 | 업무 |
| public update() | L466-511 | E3 | 서비스 tdm.Tdm43_Manl.modelUpdate(relateIcsList, relateIcrList, relateFormList, relateDcrList) | 업무 |
| private setCheckMonthBox() | L513-582 | E5 | 상태 처리 | 업무 |
| private getCheckMonth() | L584-601 | E6,E7,E8,E9,E10,E11,E12,E13,E14,E15,E16,E17,setCheckMonthBox | 상태 처리 | 업무 |
| private lookupExctDuty() | L603-620 | E1 | 조회창 Tdm43_Lookup_ExctDuty 열기 | 업무 |
| private settings() | L197-322 | 생성자 | 서비스 yyyy.MM.dd, sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: startDate=DateTimeFormat.getFormat("yyyy.MM.dd"("사용시작일"), checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L622-624 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L625-627 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L628-630 | getCheckMonthForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L631-633 | insert,edit,view | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L634-636 | getCheckMonthForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={() => /* 서비스 yyyy.MM.dd */}>미사용</Button>

### Tdm43_Page_Relate (`client/vi/tdm/Tdm43_Page_Relate.java`, 774줄)

- 툴바 `buttonBar`: {insertButton}
- 입력·하위 화면: `relateRefBasisArea` TextArea, `lookupIcs` Ics01_Lookup_ClassTreeDetail, `lookupIcr` Icr01_Lookup_ClassTreeDetail, `lookupForm` Sys10_Lookup_FileViewer, `lookup` Ics01_Lookup_SelectMulti
- 그리드 `relateIcsGrid` (buildRelateIcsGrid()):
  - icsClassTreeName 350 "법규명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateIcrGrid` (buildRelateIcrGrid()):
  - icrClassTreeName 350 "내규명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateFormGrid` (buildRelateFormGrid()):
  - fileName 350 "파일명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateDcrGrid` (buildRelateDcrGrid()):
  - dcrClassTreeFullName 450 "문서분류명" TextArea
  - actionCell 35 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L90-121) → settings()
[E1] plainTabPanel.Selection [arg0 != null] (L163) → buttonSettings()
[E2] insertButton[추가].Select (L181) → insert()
[E3] relateIcsGrid.getStore().StoreAdd (L189) → clearPanel()
[E4] relateIcsGrid.getStore().StoreRemove (L195) → clearPanel()
[E5] relateIcrGrid.getStore().StoreAdd (L203) → clearPanel()
[E6] relateIcrGrid.getStore().StoreRemove (L209) → clearPanel()
[E7] relateFormGrid.getStore().StoreAdd (L217) → clearPanel()
[E8] relateFormGrid.getStore().StoreRemove (L223) → clearPanel()
[E9] relateDcrGrid.getStore().StoreAdd (L231) → clearPanel()
[E10] relateDcrGrid.getStore().StoreRemove (L237) → clearPanel()
[E11] messageBox.DialogHide [YES] (L380) → 서비스 tdm.Tdm45_ManlRelateIcs.delete
[E12] messageBox.DialogHide [YES] (L416) → 서비스 tdm.Tdm46_ManlRelateIcr.delete
[E13] messageBox.DialogHide [YES] (L452) → 서비스 sys.Sys11_RelateFile.delete
[E14] messageBox.DialogHide [YES] (L481) → 서비스 tdm.Tdm47_ManlRelateDcr.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public updateYn() | L123-125 | 공개 메서드 | 상태 처리 | 업무 |
| private buttonSettings() | L127-135 | E1,settings | 상태 처리 | 업무 |
| private setGridColumn() | L137-157 | buttonSettings | 상태 처리 | 업무 |
| private insert() | L245-255 | E2 | 상태 처리 | 업무 |
| public retrieve() | L257-265 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveRelateIcsGrid() | L268-277 | retrieve | 서비스 tdm.Tdm45_ManlRelateIcs.selectByManlId(manlId) | 업무 |
| public retrieveRelateIcrGrid() | L280-289 | retrieve | 서비스 tdm.Tdm46_ManlRelateIcr.selectByManlId(manlId) | 업무 |
| public retrieveRelateFormGrid() | L292-301 | retrieve | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |
| public retrieveRelateDcrGrid() | L304-313 | retrieve | 서비스 tdm.Tdm47_ManlRelateDcr.selectByManlId(manlId) | 업무 |
| public inputIcsLine() | L315-326 | 공개 메서드 | 상태 처리 | 업무 |
| public inputIcrLine() | L328-339 | 공개 메서드 | 상태 처리 | 업무 |
| public inputFormLine() | L341-352 | 공개 메서드 | 상태 처리 | 업무 |
| public inputDcrLine() | L354-365 | 공개 메서드 | 상태 처리 | 업무 |
| private buildRelateIcsGrid() | L367-401 | 필드 초기화 | 조회창 Ics01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm45_ManlRelateIcs.delete(체크된 행 목록) | 업무 |
| private buildRelateIcrGrid() | L403-437 | 필드 초기화 | 조회창 Icr01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm46_ManlRelateIcr.delete(체크된 행 목록) | 업무 |
| private buildRelateFormGrid() | L439-473 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, GridDeleteData sys.Sys11_RelateFile.delete(체크된 행 목록) | 업무 |
| private buildRelateDcrGrid() | L475-502 | 필드 초기화 | 확인창 표시, GridDeleteData tdm.Tdm47_ManlRelateDcr.delete(체크된 행 목록) | 업무 |
| public getRelateIcsList() | L505-518 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateIcrList() | L520-533 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateFormList() | L535-548 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateDcrList() | L550-563 | 공개 메서드 | 상태 처리 | 업무 |
| public getRefBasis() | L565-567 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRelateIcsList() | L569-602 | insert | 조회창 Ics01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateIcrList() | L604-637 | insert | 조회창 Icr01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateFormList() | L639-672 | insert | 조회창 Tdm43_Lookup_RelateFormFileList 열기 | 업무 |
| public insertRelateDcrList() | L674-708 | insert | 조회창 Dcr01_Lookup_SelectMulti 열기 | 업무 |
| public clearPanel() | L709-767 | E3,E4,E5,E6,E7,E8,E9,E10,retrieveRelateIcsGrid,retrieveRelateIcrGrid,retrieveRelateFormGrid,retrieveRelateDcrGrid | 상태 처리 | 업무 |
| private specialCharacters() | L769-773 | clearPanel | 상태 처리 | 업무 |
| private settings() | L159-243 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildRelateIcsGrid = () => [
  gb.text('icsClassTreeNm', 350, '법규명'),  // L396 SQL 계산 컬럼(selectByManlId: ics01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L397) addCell
  // ⚠ 대응 없음 (GridBuilder L398) addCell
];

const buildRelateIcrGrid = () => [
  gb.text('icrClassTreeNm', 350, '내규명'),  // L432 SQL 계산 컬럼(selectByManlId: icr01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L433) addCell
  // ⚠ 대응 없음 (GridBuilder L434) addCell
];

const buildRelateFormGrid = () => [
  gb.text('fileNm', 350, '파일명'),  // L468 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L469) addCell
  // ⚠ 대응 없음 (GridBuilder L470) addCell
];

const buildRelateDcrGrid = () => [
  gb.textArea('dcrClassTreeFNm', 450, '문서분류명'),  // L498 SQL 계산 컬럼(selectByManlId: f_class_tree_nm_allpath(tdm47_dcr_class…)
  // ⚠ 대응 없음 (GridBuilder L499) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insert}>추가</Button>

### Tdm43_Lookup_RelateFormFileList (`client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`, 203줄)

- 툴바 `buttonBar`: 구분: {typeComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `typeComboBox` ComboBoxField("TdmCheckFormType", "%", "전체", "전체"), `searchText` TextField 빈칸="파일명/비고"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - tdmCheckFormTypeName 200 "구분" Text
  - fileName 500 "파일명" Text
  - note 200 "비고" Text
  - regDate 100 "등록일" Date
  - actionCell 70 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-69) → 초기화
[E1] typeComboBox[TdmCheckFormType].Collapse (L101) → retrieve()
[E2] searchText.KeyPress [Enter] (L110) → retrieve()
[E3] retrieveButton[조회].Select (L121) → retrieve()
[E4] confirmButton[확인].Select (L127) → confirm()
[E5] closeButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L47-50 | buildGrid,retrieve | 상태 처리 | 업무 |
| public open() | L71-97 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L99-139 | open | 상태 처리 | 업무 |
| private retrieve() | L166-180 | E1,E2,E3,execute | 서비스 sys.Sys10_File.selectUnConnTdmFormFile(companyId, tdmCheckFormType, searchText, relateId) | 업무 |
| private confirm() | L182-194 | E4 | 미선택 시 alert "선택한 파일이 없습니다" | 업무 |
| private buildGrid() | L141-164 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L196-198 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L199-201 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('tdmCheckFormTypeNm', 200, '구분'),  // L157 SQL 계산 컬럼(selectUnConnTdmFormFile: f_cdnm('TdmCheckFormType', sys10_tdm_ch…)
  gb.text('fileNm', 500, '파일명'),  // L158
  gb.text('note', 200, '비고'),  // L159
  gb.date('regDate', 100, '등록일'),  // L160
  // ⚠ 대응 없음 (GridBuilder L161) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Lookup_ExctDuty (`client/vi/tdm/Tdm43_Lookup_ExctDuty.java`, 239줄)

- 입력·하위 화면: `checkBox01` CheckBox, `checkBox02` CheckBox, `checkBox03` CheckBox, `checkBox04` CheckBox, `checkBox05` CheckBox, `checkBox06` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L83-148) → show()
[E1] selectButton[선택완료].Select (L120) → select()
[E2] closeButton[닫기].Select (L126) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L36-43 | 공개 메서드 | 상태 처리 | 업무 |
| private checkBox() | L45-81 | open | 상태 처리 | 업무 |
| public select() | L150-234 | E1 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L236-238 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={select}>선택완료</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

