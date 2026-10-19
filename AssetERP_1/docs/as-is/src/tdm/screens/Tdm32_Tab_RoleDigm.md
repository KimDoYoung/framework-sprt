# Tdm32_Tab_RoleDigm

- 종류: 화면
- 메뉴: 책무 > 02. 책무구조도 > 책무체계도 (#1419)
- 파일: `client/vi/tdm/Tdm32_Tab_RoleDigm.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr30_Link.selectByLinkCode` | Tdm32_Tab_RoleDigm:553 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys10_File.checkFileStatus` | Tdm32_Tab_RoleDigm:762 | [`Sys10_File.java:591`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.fileReName` | Tdm32_Tab_RoleDigm:769 | [`Sys10_File.java:557`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.getServerPath` | Tdm32_Tab_RoleDigm:675, Tdm32_Tab_RoleDigm:746 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.selectByParentId` | Tdm32_Tab_RoleDigm:275, Tdm32_Tab_RoleDigm:908 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.CreateTdmRoleDigm` | Tdm32_Tab_RoleDigm:663, Tdm32_Tab_RoleDigm:803 | [`Sys99_Print.java:151`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm32_RoleDigm.delete` | Tdm32_Tab_RoleDigm:533 | [`Tdm32_RoleDigm.java:71`](../../tdm/services/Tdm32_RoleDigm.md) | `UpdateDataModel(tdm32_role_digm)` 동적 DELETE |
| `tdm.Tdm32_RoleDigm.selectByRegDate` | Tdm32_Tab_RoleDigm:650 | [`Tdm32_RoleDigm.java:25`](../../tdm/services/Tdm32_RoleDigm.md) | [`tdm32_role_digm.selectByRegDate`](../../tdm/sql/tdm32_role_digm.md) |
| `tdm.Tdm32_RoleDigm.update` | Tdm32_Tab_RoleDigm:492 | [`Tdm32_RoleDigm.java:66`](../../tdm/services/Tdm32_RoleDigm.md) | `UpdateDataModel(tdm32_role_digm)` 동적 INSERT/UPDATE → [`tdm32_role_digm.selectById`](../../tdm/sql/tdm32_role_digm.md) |
| `tdm.Tdm32_RoleDigm.updateApprId` | Tdm32_Tab_RoleDigm:616 | [`Tdm32_RoleDigm.java:57`](../../tdm/services/Tdm32_RoleDigm.md) | [`tdm32_role_digm.updateApprId`](../../tdm/sql/tdm32_role_digm.md) |
| `tdm.Tdm32_RoleDigm.updateUseFileType` | Tdm32_Tab_RoleDigm:587 | [`Tdm32_RoleDigm.java:48`](../../tdm/services/Tdm32_RoleDigm.md) | [`tdm32_role_digm.updateUseFileType`](../../tdm/sql/tdm32_role_digm.md) |
| `tdm.Tdm33_RoleDigmFile.deleteByRoleDigmId` | Tdm32_Tab_RoleDigm:874 | [`Tdm33_RoleDigmFile.java:56`](../../tdm/services/Tdm33_RoleDigmFile.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm33_role_digm_file.deleteByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) |
| `tdm.Tdm33_RoleDigmFile.fileCheck` | Tdm32_Tab_RoleDigm:633 | [`Tdm33_RoleDigmFile.java:103`](../../tdm/services/Tdm33_RoleDigmFile.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm32_role_digm.selectByRegDate`](../../tdm/sql/tdm32_role_digm.md), [`tdm33_role_digm_file.deleteByRoleDigmFileId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) |
| `tdm.Tdm33_RoleDigmFile.insertByRoleDigmId` | Tdm32_Tab_RoleDigm:858 | [`Tdm33_RoleDigmFile.java:72`](../../tdm/services/Tdm33_RoleDigmFile.md) | [`tdm33_role_digm_file.insertByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) |
| `tdm.Tdm33_RoleDigmFile.selectByFileType` | Tdm32_Tab_RoleDigm:264, Tdm32_Tab_RoleDigm:310, Tdm32_Tab_RoleDigm:889 | [`Tdm33_RoleDigmFile.java:32`](../../tdm/services/Tdm33_RoleDigmFile.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm33_role_digm_file.deleteByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) |
| `tdm.Tdm33_RoleDigmFile.upsertByRoleDigmId` | Tdm32_Tab_RoleDigm:322 | [`Tdm33_RoleDigmFile.java:83`](../../tdm/services/Tdm33_RoleDigmFile.md) | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.upsertByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm32_role_digm`](../../../db/tables/tdm.md), [`tdm33_role_digm_file`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_sysdate`, `f_today`, `tdm_create_data`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm32_Tab_RoleDigm (`client/vi/tdm/Tdm32_Tab_RoleDigm.java`, 930줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {notPeriodYn} {notEndYn} {retrieveButton} {insertButton} {updateButton} {deleteButton} {rdFileDownloadForm} {fileDeleteForm}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `notEndYn` CheckBox, `notPeriodYn` CheckBox, `reasonComboBox` ComboBoxField("TdmDescRegReason") 빈칸="선택하세요", `lookupViewer` Sys10_Lookup_FileViewer, `editor` Apr01_Edit_ApprDoc, `lookup` Dcr01_Lookup_Class
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 120 "생성일" Date 편집:MyDateField
  - allcStdDate 120 "책무배분기준일" Date 편집:MyDateField
  - reasonName 300 "생성사유" Text 편집:reasonComboBox
  - actionCell 80 "책무체계도" Cell 편집:actionCell01
  - fileTypeName02 40 "" DynamicCell 편집:actionCell02
  - fileTypeName02 40 "" DynamicCell 편집:actionCell05
  - apprStatusCode 80 "결재요청" DynamicCell 편집:actionCell03
  - apprStatusName 80 "결재상태" TextStatus
  - apprStatusCode 80 "문서보기" DynamicCell 편집:actionCell04

#### 이벤트
[E0] 화면 열림 (생성자 L105-139) → settings(), retrieve()
[E1] notPeriodYn[전체보기].ValueChange [event.getValue()] (L151) → retrieve()
[E2] notEndYn[미처리건만 조회].Change (L167) → retrieve()
[E3] retrieveButton[조회].Select (L174) → retrieve()
[E4] insertButton[등록].Select (L180) → insertRow()
[E5] updateButton[저장].Select (L186) → updateChk()
[E6] deleteButton[삭제].Select (L192) → deleteChk()
       └ [E12] msgBox.DialogHide [YES] (L512) → deleteRow()
[E7] fileDeleteForm.SubmitComplete (L200) → retrieve()
[E8] fileUpdownForm.Change (L208) → retrieve()
[E9] rdFileDownloadForm.SubmitComplete (L228) → relateRdFile()
[E10] reasonComboBox[TdmDescRegReason].Collapse (L240) → 인라인 L240-247 (new CollapseHandler() { @Override pub…)
[E11] msgBox.DialogHide [YES] (L397) → deleteRoleDigmFile()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertRow() | L432-446 | E4 | 상태 처리 | 업무 |
| private updateChk() | L448-488 | E5 | 상태 처리 | 업무 |
| private update() | L490-493 | updateChk | 서비스 tdm.Tdm32_RoleDigm.update | 업무 |
| private deleteChk() | L495-527 | E6 | ConfirmBox → E12 | 업무 |
| private deleteRow() | L529-543 | E12 | GridDeleteData tdm.Tdm32_RoleDigm.delete(체크된 행 목록) | 업무 |
| private dcrChk() | L545-584 | updateUseFileType | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) | 업무 |
| private updateUseFileType() | L586-598 | buildGrid | 서비스 tdm.Tdm32_RoleDigm.updateUseFileType(roleDigmId, useFileType) | 업무 |
| private insertLinkApproval() | L600-613 | dcrChk,createRd,relateRdFile | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L615-628 | insertLinkApproval | 서비스 tdm.Tdm32_RoleDigm.updateApprId(roleDigmId, apprId) | 업무 |
| private retrieve() | L630-658 | 생성자,E1,E2,E3,E7,E8,updateApprId,deleteRoleDigmFile | 서비스 tdm.Tdm33_RoleDigmFile.fileCheck, tdm.Tdm32_RoleDigm.selectByRegDate(companyId, startDate, closeDate, notEndYn, notPeriodYn, companyId, startDate, closeDate, notEndYn, notPeriodYn) | 업무 |
| private createRd() | L660-743 | dcrChk | 서비스 sys.Sys99_Print.CreateTdmRoleDigm, sys.Sys10_File.getServerPath(companyId, personId, windowClassName, pJobTp, allcStdDate, pId, companyId) | 업무 |
| private relateRdFile() | L745-797 | E9 | 서비스 sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName(companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType) | 업무 |
| private viewRd() | L799-841 | buildGrid,openRelateFile01 | 서비스 sys.Sys99_Print.CreateTdmRoleDigm(companyId, personId, windowClassName, pJobTp, allcStdDate, pId) | 업무 |
| private fileUploadChk() | L843-853 | buildGrid | 상태 처리 | 업무 |
| private fileUpload() | L855-871 | fileUploadChk | 서비스 tdm.Tdm33_RoleDigmFile.insertByRoleDigmId(roleDigmId, fileType) | 업무 |
| private deleteRoleDigmFile() | L873-886 | E11 | 서비스 tdm.Tdm33_RoleDigmFile.deleteByRoleDigmId(roleDigmId, fileType) | 업무 |
| private openRelateFile01() | L888-905 | buildGrid | 서비스 tdm.Tdm33_RoleDigmFile.selectByFileType(roleDigmId, fileType) | 업무 |
| private openRelateFile02() | L907-921 | openRelateFile01 | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L141-234 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, notPeriodYn=true("전체보기"), notEndYn=false("미처리건만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L236-430 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시, 서비스 tdm.Tdm33_RoleDigmFile.selectByFileType, sys.Sys10_File.selectByParentId, tdm.Tdm33_RoleDigmFile.selectByFileType, tdm.Tdm33_RoleDigmFile.upsertByRoleDigmId(roleDigmId, fileType, parentId, roleDigmId, fileType, roleDigmId, fileType), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L923-925 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L927-929 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 120, '생성일', { editor: 'date' }),  // L419
  gb.date('allcStdDate', 120, '책무배분기준일', { editor: 'date' }),  // L420
  gb.text('reasonNm', 300, '생성사유', { editor: 'select' }),  // L421 SQL 계산 컬럼(selectByRegDate: f_cdnm('TdmDescRegReason', tdm32_reason…)
  // ⚠ 대응 없음 (GridBuilder L422) addCell
  // ⚠ 대응 없음 (GridBuilder L423) addDynamicCell
  // ⚠ 대응 없음 (GridBuilder L424) addDynamicCell
  // ⚠ 대응 없음 (GridBuilder L425) addDynamicCell
  gb.textStatus('apprStatusNm', 80, '결재상태'),  // L426 SQL 계산 컬럼(selectByRegDate: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L427) addDynamicCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={updateChk}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

