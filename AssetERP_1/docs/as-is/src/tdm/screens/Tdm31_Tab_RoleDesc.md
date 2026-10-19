# Tdm31_Tab_RoleDesc

- 종류: 화면
- 메뉴: 책무 > 02. 책무구조도 > 임원별 책무기술서 (#1418)
- 파일: `client/vi/tdm/Tdm31_Tab_RoleDesc.java`
- 함께 쓰는 클래스 1개:
  - `Tdm30_Lookup_SelectMulti` `client/vi/tdm/Tdm30_Lookup_SelectMulti.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr30_Link.selectByLinkCode` | Tdm31_Tab_RoleDesc:621 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys10_File.checkFileStatus` | Tdm31_Tab_RoleDesc:738 | [`Sys10_File.java:591`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.fileReName` | Tdm31_Tab_RoleDesc:745 | [`Sys10_File.java:557`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.getServerPath` | Tdm31_Tab_RoleDesc:546, Tdm31_Tab_RoleDesc:726 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.selectByParentId` | Tdm31_Tab_RoleDesc:776 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.CreateTdmRoleDesc` | Tdm31_Tab_RoleDesc:534, Tdm31_Tab_RoleDesc:686 | [`Sys99_Print.java:122`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm30_RoleAllc.selectPerson` | Tdm30_Lookup_SelectMulti:170 | [`Tdm30_RoleAllc.java:54`](../../tdm/services/Tdm30_RoleAllc.md) | [`tdm30_role_allc.selectPerson`](../../tdm/sql/tdm30_role_allc.md) |
| `tdm.Tdm31_RoleDesc.aprWorkCheck` | Tdm31_Tab_RoleDesc:290 | [`Tdm31_RoleDesc.java:81`](../../tdm/services/Tdm31_RoleDesc.md) | [`tdm31_role_desc.selectByParentId`](../../tdm/sql/tdm31_role_desc.md) |
| `tdm.Tdm31_RoleDesc.delete` | Tdm31_Tab_RoleDesc:519 | [`Tdm31_RoleDesc.java:129`](../../tdm/services/Tdm31_RoleDesc.md) | `UpdateDataModel(tdm31_role_desc)` 동적 DELETE |
| `tdm.Tdm31_RoleDesc.fileCheck` | Tdm31_Tab_RoleDesc:798 | [`Tdm31_RoleDesc.java:66`](../../tdm/services/Tdm31_RoleDesc.md) | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `tdm.Tdm31_RoleDesc.selectByRegDate` | Tdm31_Tab_RoleDesc:385 | [`Tdm31_RoleDesc.java:27`](../../tdm/services/Tdm31_RoleDesc.md) | [`tdm31_role_desc.selectByRegDate`](../../tdm/sql/tdm31_role_desc.md) |
| `tdm.Tdm31_RoleDesc.update` | Tdm31_Tab_RoleDesc:479 | [`Tdm31_RoleDesc.java:117`](../../tdm/services/Tdm31_RoleDesc.md) | `UpdateDataModel(tdm31_role_desc)` 동적 INSERT/UPDATE → [`tdm31_role_desc.selectById`](../../tdm/sql/tdm31_role_desc.md) |
| `tdm.Tdm31_RoleDesc.updateApprId` | Tdm31_Tab_RoleDesc:667 | [`Tdm31_RoleDesc.java:42`](../../tdm/services/Tdm31_RoleDesc.md) | [`tdm31_role_desc.updateApprId`](../../tdm/sql/tdm31_role_desc.md) |
| `tdm.Tdm31_RoleDesc.updateWorkDate` | Tdm31_Tab_RoleDesc:303, Tdm31_Tab_RoleDesc:812 | [`Tdm31_RoleDesc.java:51`](../../tdm/services/Tdm31_RoleDesc.md) | [`tdm31_role_desc.updateWorkDate1`](../../tdm/sql/tdm31_role_desc.md), [`tdm31_role_desc.updateWorkDate2`](../../tdm/sql/tdm31_role_desc.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_emptrans`, `f_get_tdmpersoninfo`, `f_sysdate`, `f_today`, `gettdm30roleallc`, `tdm_create_data`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm31_Tab_RoleDesc (`client/vi/tdm/Tdm31_Tab_RoleDesc.java`, 832줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {notPeriodYn} 검색: {searchText} {notEndYn} {retrieveButton} {insertButton} {updateButton} {deleteButton} {rdFileDownloadForm}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="직책/담당임원", `notEndYn` CheckBox, `notPeriodYn` CheckBox, `reasonComboBox` ComboBoxField("TdmDescRegReason") 빈칸="선택하세요", `editor` Apr01_Edit_ApprDoc, `lookup` Tdm30_Lookup_SelectMulti, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "생성일" Date 편집:MyDateField
  - reasonName 180 "생성사유" Text 편집:reasonComboBox
  - personName 90 "임원명" TextCenter
  - allcStdDate 90 "임원의 최종<br>책무배분일" Date
  - roleName 200 "(본)직책" Text
  - addTitle 300 "겸직사항" Text
  - actionCell 80 "책무기술서" Cell 편집:actionCell01
  - apprStatusCode 60 "결재요청" DynamicCell 편집:actionCell02
  - apprStatusName 80 "결재상태" TextStatus
  - apprStatusCode 60 "문서보기" DynamicCell 편집:actionCell03

#### 이벤트
[E0] 화면 열림 (생성자 L107-145) → settings(), retrieve()
[E1] notPeriodYn[전체보기].ValueChange [event.getValue()] (L157) → retrieve()
[E2] notEndYn[미처리건만 조회].Change (L173) → retrieve()
[E3] searchText.KeyPress [Enter] (L182) → retrieve()
[E4] retrieveButton[조회].Select (L191) → retrieve()
[E5] insertButton[등록].Select (L197) → insertRow()
[E6] updateButton[저장].Select (L203) → updateChk()
[E7] deleteButton[삭제].Select (L209) → deleteChk()
       └ [E11] msgBox.DialogHide [YES] (L498) → deleteRow()
[E8] rdFileDownloadForm.SubmitComplete (L227) → relateRdFile()
[E9] reasonComboBox[TdmDescRegReason].Expand (L242) → 메시지 "문서 진행 상태로 인해 수정이 제한됩니다."
[E10] reasonComboBox[TdmDescRegReason].ValueChange [selectModel != null] (L252) → 인라인 L252-261 (new ValueChangeHandler<String>() { @O…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L375-391 | 생성자,E1,E2,E3,E4,insertLinkApproval,updateApprId | 서비스 tdm.Tdm31_RoleDesc.selectByRegDate(companyId, startDate, closeDate, searchText, notEndYn, notPeriodYn) | 업무 |
| private insertRow() | L393-438 | E5 | 조회창 Tdm30_Lookup_SelectMulti 열기 | 업무 |
| private updateChk() | L440-475 | E6 | 상태 처리 | 업무 |
| private update() | L477-480 | updateChk | 서비스 tdm.Tdm31_RoleDesc.update | 업무 |
| private deleteChk() | L482-513 | E7 | ConfirmBox → E11 | 업무 |
| private deleteRow() | L515-529 | E11 | GridDeleteData tdm.Tdm31_RoleDesc.delete(체크된 행 목록) | 업무 |
| private createRd() | L531-609 | dcrChk | 서비스 sys.Sys99_Print.CreateTdmRoleDesc, sys.Sys10_File.getServerPath(companyId, personId, windowClassName, pJobTp, allcStdDate, pId, companyId) | 업무 |
| private dcrChk() | L611-646 | fileCheck | 조회창 Dcr01_Lookup_Class 열기 → 콜백: unmask, 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) | 업무 |
| private insertLinkApproval() | L648-664 | createRd,relateRdFile | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L666-679 | insertLinkApproval | 서비스 tdm.Tdm31_RoleDesc.updateApprId(roleDescId, apprId) | 업무 |
| private viewRd() | L682-723 | buildGrid,viewFile | 서비스 sys.Sys99_Print.CreateTdmRoleDesc(companyId, personId, windowClassName, pJobTp, allcStdDate, pId) | 업무 |
| private relateRdFile() | L725-773 | E8 | 서비스 sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName(companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType) | 업무 |
| private viewFile() | L775-795 | buildGrid | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private fileCheck() | L797-808 | buildGrid | 서비스 tdm.Tdm31_RoleDesc.fileCheck(parentId) | 업무 |
| private rollBackWorkDate() | L810-823 | dcrChk,insertLinkApproval,updateApprId | 서비스 tdm.Tdm31_RoleDesc.updateWorkDate(roleDescId, workStatus) | 업무 |
| private settings() | L147-234 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, notPeriodYn=true("전체보기"), notEndYn=false("미처리건만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L236-373 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "문서 진행 상태로 인해 수정이 제한됩니다.", 서비스 tdm.Tdm31_RoleDesc.aprWorkCheck, tdm.Tdm31_RoleDesc.updateWorkDate(parentId, roleDescId, workStatus), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L825-827 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L829-831 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '생성일', { editor: 'date' }),  // L357
  gb.text('reasonNm', 180, '생성사유', { editor: 'select' }),  // L358 SQL 계산 컬럼(selectByRegDate: f_cdnm('TdmDescRegReason', tdm31_reason…)
  gb.textCenter('personNm', 90, '임원명'),  // L359 SQL 계산 컬럼(selectByRegDate: tdm01_person_nm)
  gb.date('allcStdDate', 90, '임원의 최종<br>책무배분일'),  // L360
  gb.text('roleNm', 200, '(본)직책'),  // L361 SQL 계산 컬럼(selectByRegDate: tdm20_role_nm)
  gb.text('addTitle', 300, '겸직사항'),  // L364 SQL 계산 컬럼(selectByRegDate: f_get_tdmPersonInfo(tdm31_person_id, td…)
  // ⚠ 대응 없음 (GridBuilder L367) addCell
  // ⚠ 대응 없음 (GridBuilder L368) addDynamicCell
  gb.textStatus('apprStatusNm', 80, '결재상태'),  // L369 SQL 계산 컬럼(selectByRegDate: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L370) addDynamicCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={updateChk}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Tdm30_Lookup_SelectMulti (`client/vi/tdm/Tdm30_Lookup_SelectMulti.java`, 213줄)

- 툴바 `buttonBar`: 기준일: {stdDate} 검색: {searchText} {retrieveButton} ※ 생성사유 일괄적용: {reasonName}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="임원/직책/겸직사항", `reasonName` ComboBoxField("TdmDescRegReason") 빈칸="선택하세요"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personName 100 "임원명" TextCenter
  - roleName 250 "직책" Text
  - addTitle 350 "겸직사항" Text
  - allcStdDate 90 "최종<br>책무배분일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L66-96) → settings(), show()
[E1] searchText.KeyPress [Enter] (L111) → retrieve()
[E2] reasonName[TdmDescRegReason].Collapse (L120) → 인라인 L120-125 (new CollapseHandler() { @Override pub…)
[E3] grid.CellDoubleClick (L126) → confirm()
[E4] retrieveButton[조회].Select (L132) → retrieve()
[E5] updateButton[저장].Select (L138) → confirm()
[E6] closeButton[닫기].Select (L144) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-64 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L163-176 | E1,E4,open | 서비스 tdm.Tdm30_RoleAllc.selectPerson(companyId, stdDate, searchText) | 업무 |
| private confirm() | L178-200 | E3,E5 | 미선택 시 alert "선택된 임원이 없습니다" | 업무 |
| private settings() | L98-150 | 생성자 | 서비스 yyyy.MM.dd, 이벤트 연결, 초기값: stdDate=tmpDate, stdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L152-161 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L206-208 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L210-212 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNm', 100, '임원명'),  // L155
  gb.text('roleNm', 250, '직책'),  // L156
  gb.text('addTitle', 350, '겸직사항'),  // L158
  gb.date('allcStdDate', 90, '최종<br>책무배분일'),  // L159
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

