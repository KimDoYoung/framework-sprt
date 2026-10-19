# Tdm42_Tab_ManlOrgAppr

- 종류: 화면
- 메뉴: 책무 > 03. 부서책무매뉴얼 > 매뉴얼 보고(부서별) (#1423)
- 파일: `client/vi/tdm/Tdm42_Tab_ManlOrgAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr30_Link.selectByLinkCode` | Tdm42_Tab_ManlOrgAppr:506 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys10_File.checkFileStatus` | Tdm42_Tab_ManlOrgAppr:714 | [`Sys10_File.java:591`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.fileReName` | Tdm42_Tab_ManlOrgAppr:721 | [`Sys10_File.java:557`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.getServerPath` | Tdm42_Tab_ManlOrgAppr:668 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.selectByParentId` | Tdm42_Tab_ManlOrgAppr:822 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.CreateTdmManlOrg` | Tdm42_Tab_ManlOrgAppr:653, Tdm42_Tab_ManlOrgAppr:782 | [`Sys99_Print.java:180`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm42_ManlOrg.fileCheck` | Tdm42_Tab_ManlOrgAppr:632 | [`Tdm42_ManlOrg.java:246`](../../tdm/services/Tdm42_ManlOrg.md) | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `tdm.Tdm42_ManlOrg.notManlOrgList` | Tdm42_Tab_ManlOrgAppr:319 | [`Tdm42_ManlOrg.java:48`](../../tdm/services/Tdm42_ManlOrg.md) | [`tdm42_manl_org.notManlOrgList`](../../tdm/sql/tdm42_manl_org.md) |
| `tdm.Tdm42_ManlOrg.selectByText` | Tdm42_Tab_ManlOrgAppr:292 | [`Tdm42_ManlOrg.java:27`](../../tdm/services/Tdm42_ManlOrg.md) | [`tdm42_manl_org.selectByText`](../../tdm/sql/tdm42_manl_org.md) |
| `tdm.Tdm42_ManlOrg.update` | Tdm42_Tab_ManlOrgAppr:397 | [`Tdm42_ManlOrg.java:259`](../../tdm/services/Tdm42_ManlOrg.md) | `UpdateDataModel(tdm42_manl_org)` 동적 INSERT/UPDATE → [`tdm42_manl_org.selectById`](../../tdm/sql/tdm42_manl_org.md) |
| `tdm.Tdm42_ManlOrg.updateApprId` | Tdm42_Tab_ManlOrgAppr:548 | [`Tdm42_ManlOrg.java:143`](../../tdm/services/Tdm42_ManlOrg.md) | [`tdm42_manl_org.updateApprId`](../../tdm/sql/tdm42_manl_org.md) |
| `tdm.Tdm42_ManlOrg.updateLock` | Tdm42_Tab_ManlOrgAppr:469, Tdm42_Tab_ManlOrgAppr:603 | [`Tdm42_ManlOrg.java:216`](../../tdm/services/Tdm42_ManlOrg.md) | [`tdm42_manl_org.updateLockYn`](../../tdm/sql/tdm42_manl_org.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_company_nm`, `f_get_tdmorg_id2`, `f_org_nm`, `f_sysdate`, `f_today`, `getorg`, `tdm_create_data`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm42_Tab_ManlOrgAppr (`client/vi/tdm/Tdm42_Tab_ManlOrgAppr.java`, 858줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {useYn} {retrieveButton} {updateButton} {lockButton} {unLockButton}
- 입력·하위 화면: `searchText` TextField 빈칸="직책/임원", `useYn` CheckBox, `editor` Apr01_Edit_ApprDoc, `lookup` Dcr01_Lookup_Class, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - roleName 250 "직책" Text
  - exctName 100 "임원" TextCenter
  - taskCnt 90 "책무" LongCenter
  - taskRelateDetailCnt 90 "책무세부" LongCenter
  - taskRelateDutyCnt 90 "관리의무" LongCenter
  - manlCnt 90 "점검항목" LongCenter
  - manlDutyEndYn 70 "작성완료" BooleanYn2
  - manlDutyEndDate 100 "작성완료일" Date
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - endDate 100 "적용종료일" Date 편집:MyDateField
  - lockYn 90 "잠금" BooleanYn2
  - startDateYnStr 80 "책무매뉴얼" DynamicCell 편집:actionCell01
  - apprStatusCode 60 "결재요청" DynamicCell 편집:actionCell02
  - apprStatusName 100 "결재상태" TextStatus
  - apprStatusCode 60 "문서보기" DynamicCell 편집:actionCell03
  - jobName 200 "작업명" Text
  - getSource  "" BeforeStartEditHandler

#### 이벤트
[E0] 화면 열림 (생성자 L93-122) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L127) → retrieve()
[E2] retrieveButton[조회].Select (L138) → retrieve()
[E3] updateButton[저장].Select (L144) → updateChk()
[E4] lockButton[잠금].Select (L150) → updateLock()
       └ [E7] messageBox.DialogHide (L462) → createFile(), retrieve()
[E5] unLockButton[잠금해제].Select (L156) → updateLock()
[E6] gridBuilder.BeforeStartEdit [model != null] (L269) → 메시지 "수정할 수 없습니다. 잠금해제 후 저장하세요"
[E8] button01[닫기].Select (L581) → 인라인 L581-586 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L284-298 | 생성자,E1,E2,E7,buildGrid,update,insertLinkApproval,updateApprId,processRecreate | 서비스 tdm.Tdm42_ManlOrg.selectByText(companyId, orgId, searchText, useYn) | 업무 |
| private updateChk() | L300-393 | E3 | 서비스 tdm.Tdm42_ManlOrg.notManlOrgList(companyId, manlOrgList) | 업무 |
| private update() | L395-403 | updateChk | 서비스 tdm.Tdm42_ManlOrg.update | 업무 |
| private updateLock() | L405-495 | E4,E5 | 미선택 시 alert "저장되지 않은 데이터가 존재합니다. 저장 후 처리해 주세요" → 확인창 E7 | 업무 |
| private dcrChk() | L497-529 | buildGrid | 조회창 Dcr01_Lookup_Class 열기 → 콜백: unmask, 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) | 업무 |
| private insertLinkApproval() | L531-545 | dcrChk | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L547-561 | insertLinkApproval | 서비스 tdm.Tdm42_ManlOrg.updateApprId | 업무 |
| private createFile() | L563-593 | E7 | 확인창 표시 | 업무 |
| private processRecreate() | L595-648 | createFile | 확인창 표시, 서비스 tdm.Tdm42_ManlOrg.updateLock, tdm.Tdm42_ManlOrg.fileCheck(actionType, updName, parentId) | 업무 |
| private createRd() | L650-775 | processRecreate | 확인창 표시, 서비스 sys.Sys99_Print.CreateTdmManlOrg, sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName(companyId, personId, windowClassName, pJobTp, updDate, pId, companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType) | 업무 |
| private viewRd() | L778-819 | buildGrid,viewFile | 서비스 sys.Sys99_Print.CreateTdmManlOrg(companyId, personId, windowClassName, pJobTp, updDate, pId) | 업무 |
| private viewFile() | L821-841 | buildGrid | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L124-168 | 생성자 | 이벤트 연결, 초기값: useYn=false("사용 & 작성중인 매뉴얼만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L170-282 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "저장 후 진행해주세요", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlContentStyle() | L843-845 | createFile,processRecreate,createRd | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L847-849 | createFile | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L851-853 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L855-857 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L249 newHeaderGroupMap04newHeaderGroupConfig14 100 "건수" (tdm42_new_header_group_map04new_header_group_config14 컬럼 없음)
  gb.text('roleNm', 250, '직책'),  // L252 SQL 계산 컬럼(selectByText: COALESCE(role_nm, tdm20_role_nm))
  gb.textCenter('exctNm', 100, '임원'),  // L253 SQL 계산 컬럼(selectByText: f_emp_kor_nm(tdm42_exct_id))
  gb.longCenter('taskCnt', 90, '책무'),  // L254 SQL 계산 컬럼(selectByText: task_cnt)
  gb.longCenter('taskRelateDetailCnt', 90, '책무세부'),  // L255 SQL 계산 컬럼(selectByText: task_detail_cnt)
  gb.longCenter('taskRelateDutyCnt', 90, '관리의무'),  // L256 SQL 계산 컬럼(selectByText: task_duty_cnt)
  gb.longCenter('manlCnt', 90, '점검항목'),  // L257 SQL 계산 컬럼(selectByText: task_check_cnt)
  gb.booleanYn2('manlDutyEndYn', 70, '작성완료'),  // L258 SQL 계산 컬럼(selectByText: end_yn)
  gb.date('manlDutyEndDate', 100, '작성완료일'),  // L259 SQL 계산 컬럼(selectByText: CASE WHEN end_yn THEN end_date ELSE nul…)
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L260
  gb.date('endDate', 100, '적용종료일', { editor: 'date' }),  // L261
  gb.booleanYn2('lockYn', 90, '잠금'),  // L262
  // ⚠ 대응 없음 (GridBuilder L263) addDynamicCell
  // ⚠ 대응 없음 (GridBuilder L264) addDynamicCell
  gb.textStatus('apprStatusNm', 100, '결재상태'),  // L265 SQL 계산 컬럼(selectByText: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L266) addDynamicCell
  gb.text('jobNm', 200, '작업명'),  // L267 SQL 계산 컬럼(selectByText: tdm40_job_nm)
  // ⚠ 대응 없음 (GridBuilder L269) addBeforeStartEditHandler
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={updateChk}>저장</Button>
3. <Button type="save" onClick={updateLock}>잠금</Button>
4. <Button type="cancel" onClick={updateLock}>잠금해제</Button>
5. <Button type="unknown" onClick={() => /* 인라인 L581-586 (new SelectHandler() { @Override publi…) */}>닫기</Button>

