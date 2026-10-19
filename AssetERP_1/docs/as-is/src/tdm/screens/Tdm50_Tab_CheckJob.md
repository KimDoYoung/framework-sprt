# Tdm50_Tab_CheckJob

- 종류: 화면
- 메뉴: 책무 > 04. 책무이행점검 > 이행점검 작업지시 및 보고 (#1455)
- 파일: `client/vi/tdm/Tdm50_Tab_CheckJob.java`
- 함께 쓰는 클래스 3개:
  - `Tdm50_TabPage_CheckJob` `client/vi/tdm/Tdm50_TabPage_CheckJob.java`
  - `Tdm55_Lookup_ChckRecord` `client/vi/tdm/Tdm55_Lookup_ChckRecord.java`
  - `Tdm50_Edit_CheckJob` `client/vi/tdm/Tdm50_Edit_CheckJob.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr01_Lookup_ApprLink`](../../apr/components/Apr01_Lookup_ApprLink.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sms03_Lookup_SendList`](../../sms/components/Sms03_Lookup_SendList.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr30_Link.selectByLinkCode` | Tdm50_TabPage_CheckJob:448 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys10_File.checkFileStatus` | Tdm50_TabPage_CheckJob:718 | [`Sys10_File.java:591`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.fileReName` | Tdm50_TabPage_CheckJob:725 | [`Sys10_File.java:557`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.getServerPath` | Tdm50_TabPage_CheckJob:632 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.selectByParentId` | Tdm50_TabPage_CheckJob:841 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.CreateTdmCheckJob` | Tdm50_TabPage_CheckJob:647, Tdm50_TabPage_CheckJob:791 | [`Sys99_Print.java:209`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm20_Role.getCeoRoleList` | Tdm50_Tab_CheckJob:193 | [`Tdm20_Role.java:48`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.getCeoRoleList`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm50_ChckJob.createCheckManl` | Tdm50_Tab_CheckJob:371 | [`Tdm50_ChckJob.java:82`](../../tdm/services/Tdm50_ChckJob.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm42_manl_org.selectByStdDate`](../../tdm/sql/tdm42_manl_org.md), [`tdm50_chck_job.selectPreCheckYm`](../../tdm/sql/tdm50_chck_job.md), [`tdm51_chck_org.insert`](../../tdm/sql/tdm51_chck_org.md), [`tdm52_chck_manl.insertByTdm43`](../../tdm/sql/tdm52_chck_manl.md), [`tdm53_chck_exct.insertByTmd51`](../../tdm/sql/tdm53_chck_exct.md), [`tdm58_chck_appr_step.insertByTmd09`](../../tdm/sql/tdm58_chck_appr_step.md) |
| `tdm.Tdm50_ChckJob.deleteChckManl` | Tdm50_Tab_CheckJob:356 | [`Tdm50_ChckJob.java:161`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm51_chck_org.deleteChckManl`](../../tdm/sql/tdm51_chck_org.md), [`tdm52_chck_manl.deleteChckManl`](../../tdm/sql/tdm52_chck_manl.md), [`tdm53_chck_exct.deleteChckManl`](../../tdm/sql/tdm53_chck_exct.md), [`tdm58_chck_appr_step.deleteChckManl`](../../tdm/sql/tdm58_chck_appr_step.md) |
| `tdm.Tdm50_ChckJob.modelUpdate` | Tdm50_Edit_CheckJob:122 | [`Tdm50_ChckJob.java:176`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm50_chck_job.countCheckYm`](../../tdm/sql/tdm50_chck_job.md), [`tdm50_chck_job.selectById`](../../tdm/sql/tdm50_chck_job.md), `UpdateDataModel(tdm50_chck_job)` 동적 INSERT/UPDATE → [`tdm50_chck_job.selectById`](../../tdm/sql/tdm50_chck_job.md) |
| `tdm.Tdm50_ChckJob.preCreateCheckManl` | Tdm50_Tab_CheckJob:323 | [`Tdm50_ChckJob.java:49`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm50_chck_job.selectCheckStatus`](../../tdm/sql/tdm50_chck_job.md) |
| `tdm.Tdm50_ChckJob.selectByCheckYm` | Tdm50_Tab_CheckJob:233 | [`Tdm50_ChckJob.java:30`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm50_chck_job.selectByCheckYm`](../../tdm/sql/tdm50_chck_job.md) |
| `tdm.Tdm50_ChckJob.updateEndYn` | Tdm50_Tab_CheckJob:288 | [`Tdm50_ChckJob.java:139`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm50_chck_job.updateEndYn`](../../tdm/sql/tdm50_chck_job.md), [`tdm51_chck_org.countUnCheckByChckJobId`](../../tdm/sql/tdm51_chck_org.md), [`tdm53_chck_exct.countUnLockByExctAppr`](../../tdm/sql/tdm53_chck_exct.md) |
| `tdm.Tdm51_ChckOrg.getMessageList` | Tdm50_Tab_CheckJob:390 | [`Tdm51_ChckOrg.java:93`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm51_chck_org.getMessageList`](../../tdm/sql/tdm51_chck_org.md) |
| `tdm.Tdm51_ChckOrg.selectByRoleId` | Tdm50_TabPage_CheckJob:276 | [`Tdm51_ChckOrg.java:35`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm51_chck_org.selectByRoleId`](../../tdm/sql/tdm51_chck_org.md) |
| `tdm.Tdm53_ChckExct.deleteList` | Tdm50_TabPage_CheckJob:868 | [`Tdm53_ChckExct.java:79`](../../tdm/services/Tdm53_ChckExct.md) | [`sys10_file.deleteById`](../../sys/sql/sys10_file.md) |
| `tdm.Tdm53_ChckExct.fileCheck` | Tdm50_TabPage_CheckJob:611 | [`Tdm53_ChckExct.java:35`](../../tdm/services/Tdm53_ChckExct.md) | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `tdm.Tdm53_ChckExct.selectByChckJobId` | Tdm50_TabPage_CheckJob:250 | [`Tdm53_ChckExct.java:26`](../../tdm/services/Tdm53_ChckExct.md) | [`tdm53_chck_exct.selectByChckJobId`](../../tdm/sql/tdm53_chck_exct.md) |
| `tdm.Tdm53_ChckExct.updateLockYn` | Tdm50_TabPage_CheckJob:326, Tdm50_TabPage_CheckJob:761 | [`Tdm53_ChckExct.java:60`](../../tdm/services/Tdm53_ChckExct.md) | `UpdateDataModel(tdm53_chck_exct)` 동적 INSERT/UPDATE → [`tdm53_chck_exct.selectById`](../../tdm/sql/tdm53_chck_exct.md) |
| `tdm.Tdm55_ChckRecord.selectByChckOrgId` | Tdm55_Lookup_ChckRecord:114 | [`Tdm55_ChckRecord.java:27`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByChckOrgId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByInsuffId` | Tdm55_Lookup_ChckRecord:118 | [`Tdm55_ChckRecord.java:33`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByInsuffId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByRelateId` | Tdm55_Lookup_ChckRecord:122 | [`Tdm55_ChckRecord.java:21`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByRelateId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm56_ChckRelateAppr.insertApprId` | Tdm50_TabPage_CheckJob:501 | [`Tdm56_ChckRelateAppr.java:41`](../../tdm/services/Tdm56_ChckRelateAppr.md) | [`tdm56_chck_relate_appr.insertApprId`](../../tdm/sql/tdm56_chck_relate_appr.md) |
| `tdm.Tdm56_ChckRelateAppr.selectApprStatus` | Tdm50_TabPage_CheckJob:354 | [`Tdm56_ChckRelateAppr.java:32`](../../tdm/services/Tdm56_ChckRelateAppr.md) | [`tdm56_chck_relate_appr.selectApprStatus`](../../tdm/sql/tdm56_chck_relate_appr.md) |
| `tdm.Tdm56_ChckRelateAppr.selectByCeoRoleId` | Tdm50_TabPage_CheckJob:517 | [`Tdm56_ChckRelateAppr.java:23`](../../tdm/services/Tdm56_ChckRelateAppr.md) | [`tdm56_chck_relate_appr.selectByCeoRoleId`](../../tdm/sql/tdm56_chck_relate_appr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm09_appr_step`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm55_chck_record`](../../../db/tables/tdm.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md), [`tdm91_company_setup`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_last_day`, `f_get_quarter_date`, `f_get_tdmorg_id`, `f_sysdate`, `f_today`, `getorg`, `getperson`, `tdm_create_data`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm50_Tab_CheckJob (`client/vi/tdm/Tdm50_Tab_CheckJob.java`, 461줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 점검년월: {quickMoveField} {retrieveButton} {createButton} {sendButton} {endButton} {cancelButton}
- 입력·하위 화면: `quickMoveField` QuickMoveField, `tabPage` Tdm50_TabPage_CheckJob, `lookup` Tdm50_Edit_CheckJob

#### 이벤트
[E0] 화면 열림 (생성자 L78-113) → settings()
[E1] retrieveButton[조회].Select (L116) → retrieve()
[E2] createButton[점검항목생성].Select (L122) → createListChk()
[E3] messageBox.DialogHide (L128) → createListChk()
[E4] sendButton[알림발송].Select (L140) → sendMessage()
[E5] endButton[(회사전체 당월)점검마감].Select (L146) → updateEndYnChk()
       └ [E8] messageBox.DialogHide (L275) → updateEndYn()
[E6] cancelButton[마감취소].Select (L152) → updateEndYnChk()
[E7] anchor.MouseDown [chckJobModel.getEndYn()] (L161) → execute(), retrieve()
[E9] messageBox.DialogHide (L336) → deleteChckManl()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L53-56 | E7 | 상태 처리 | 업무 |
| public execute() | L60-63 | E7 | 상태 처리 | 업무 |
| private retrievePanel() | L188-230 | retrieve | 서비스 tdm.Tdm20_Role.getCeoRoleList(companyId, checkYm, baseDate) | 업무 |
| public retrieve() | L232-253 | E1,E7,execute,updateEndYn,createCheckManl | 서비스 tdm.Tdm50_ChckJob.selectByCheckYm(companyId, checkYm, defaultYn) | 업무 |
| private updateEndYnChk() | L255-285 | E5,E6 | ConfirmBox → E8 | 업무 |
| private updateEndYn() | L287-313 | E8 | 서비스 tdm.Tdm50_ChckJob.updateEndYn(chckJobId, endYn) | 업무 |
| private createListChk() | L315-353 | E2,E3 | 확인창 표시, 서비스 tdm.Tdm50_ChckJob.preCreateCheckManl | 업무 |
| private deleteChckManl() | L355-366 | E9 | 서비스 tdm.Tdm50_ChckJob.deleteChckManl | 업무 |
| private createCheckManl() | L368-382 | createListChk,deleteChckManl | 서비스 tdm.Tdm50_ChckJob.createCheckManl | 업무 |
| private sendMessage() | L384-413 | E4 | 조회창 Sms03_Lookup_SendList 열기, 서비스 tdm.Tdm51_ChckOrg.getMessageList(companyId, checkYm, baseDate, chckJobId) | 업무 |
| private getMessage() | L415-419 | sendMessage | 상태 처리 | 업무 |
| private setButtonEnable() | L421-433 | retrieve | 상태 처리 | 업무 |
| private getDateStr() | L435-441 | retrieve | 상태 처리 | 업무 |
| private getString() | L443-445 | retrieve | 상태 처리 | 업무 |
| private getBooleanStr() | L447-453 | retrieve | 상태 처리 | 업무 |
| private settings() | L115-186 | 생성자 | 팝업 Tdm50_Edit_CheckJob 열기, 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L455-457 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L458-460 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={createListChk}>점검항목생성</Button>
3. <Button type="send" onClick={sendMessage}>알림발송</Button>
4. <Button type="unknown" onClick={updateEndYnChk}>(회사전체 당월)점검마감</Button>
5. <Button type="cancel" onClick={updateEndYnChk}>마감취소</Button>

### Tdm50_TabPage_CheckJob (`client/vi/tdm/Tdm50_TabPage_CheckJob.java`, 926줄)

- 레이아웃: center=vlc
- 툴바 `buttonBarL`: {lockButton} {unLockButton} {rdFileCreateForm}
- 툴바 `buttonBarR`: {label01} {apprInsertButton} {apprViewButton}
- 입력·하위 화면: `lookup` Tdm55_Lookup_ChckRecord, `editor` Apr01_Edit_ApprDoc, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid01` (buildGrid01(), 체크박스(다중)):
  - roleName 200 "직책" Text
  - exctName 100 "임원" TextCenter
  - chckManlCnt 70 "당월점검" Long
  - exctApprYn 70 "제출완료" BooleanYn2
  - lockYn 60 "잠금" BooleanYn2
  - buttonEnable 70 "이행점검<br>보고서" DynamicCell 편집:actionCell
- 그리드 `grid02` (buildGrid02()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - orgName 200 "점검부서" Text
  - orgManagerName 80 "담당자" TextCenter
  - dutyCnt 80 "관리의무" Long
  - manlCnt 80 "점검항목" Long
  - monthManlCnt 80 "대상" Long
  - monthManlDoneCnt 80 "완료" Long
  - monthManlUndoneCnt 80 "미완료" Long
  - orgStatusName 80 "진행상태" TextStatus
  - actionCell 75 "승인이력" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L99-138) → settings(), retrieve01()
[E1] lockButton[잠금].Select (L152) → updateLockYn()
[E2] unLockButton[잠금해제].Select (L158) → updateLockYn()
[E3] apprInsertButton[결재요청].Select (L164) → insertApprChk()
[E4] apprViewButton[문서보기].Select (L170) → viewAppr()
[E5] grid01.SelectionChanged [선택>0] (L176) → retrieve02()
[E6] button01[닫기].Select (L582) → 인라인 L582-587 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid01() | L186-215 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid02() | L217-239 | 필드 초기화 | 조회창 Tdm55_Lookup_ChckRecord 열기 | 업무 |
| public retrieve01() | L241-261 | 생성자,updateLockYn | 서비스 tdm.Tdm53_ChckExct.selectByChckJobId(chckJobId, ceoRoleId) | 업무 |
| public retrieve02() | L263-282 | E5 | 서비스 tdm.Tdm51_ChckOrg.selectByRoleId(companyId, checkYm, stdDate, roleId) | 업무 |
| private updateLockYn() | L284-350 | E1,E2 | 미선택 시 alert "상신문서가 진행중(또는 결재완료)입니다", 서비스 tdm.Tdm53_ChckExct.updateLockYn(isLock, updName) | 업무 |
| private getApprStatus() | L352-410 | retrieve01,insertApprId,viewAppr | 서비스 tdm.Tdm56_ChckRelateAppr.selectApprStatus(relateTableId, ceoRoleId) | 업무 |
| private insertApprChk() | L412-445 | E3 | 상태 처리 | 업무 |
| private dcrChk() | L447-471 | insertApprChk | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) | 업무 |
| private insertLinkApproval() | L473-498 | dcrChk | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private insertApprId() | L500-514 | insertLinkApproval | 서비스 tdm.Tdm56_ChckRelateAppr.insertApprId | 업무 |
| private viewAppr() | L516-564 | E4 | 조회창 Apr01_Lookup_ApprLink 열기, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 tdm.Tdm56_ChckRelateAppr.selectByCeoRoleId(relateTableId, ceoRoleId) | 업무 |
| private readyRd() | L566-594 | updateLockYn | 확인창 표시 | 업무 |
| private processCreate() | L596-627 | readyRd | 확인창 표시, 서비스 tdm.Tdm53_ChckExct.fileCheck(parentId) | 업무 |
| private createRd() | L629-713 | processCreate | 확인창 표시, 서비스 sys.Sys10_File.getServerPath, sys.Sys99_Print.CreateTdmCheckJob(companyId, companyId, personId, windowClassName, pJobTp, updDate, pId) | 업무 |
| private setRdFile() | L715-753 | createRd | 확인창 표시, 서비스 sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName(filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType) | 업무 |
| private lockRollBack() | L755-784 | createRd | 확인창 표시, 서비스 tdm.Tdm53_ChckExct.updateLockYn(isLock, updName) | 업무 |
| private viewRd() | L786-838 | buildGrid01,viewFile | 서비스 sys.Sys99_Print.CreateTdmCheckJob(companyId, personId, windowClassName, pJobTp, updDate, pId) | 업무 |
| private viewFile() | L840-860 | buildGrid01 | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private deleteRdFile() | L862-884 | updateLockYn | 서비스 tdm.Tdm53_ChckExct.deleteList | 업무 |
| private getYYYYMM() | L896-901 | createRd,viewRd | 서비스 yyyy.MM.dd | 업무 |
| private updateChk() | L903-909 | insertApprChk | 상태 처리 | 업무 |
| public clear01() | L911-913 | 공개 메서드 | 상태 처리 | 업무 |
| public clear02() | L915-917 | retrieve01 | 상태 처리 | 업무 |
| public settings() | L140-184 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlContentStyle() | L919-921 | readyRd,processCreate,createRd,setRdFile,lockRollBack | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L923-925 | readyRd | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('roleNm', 200, '직책'),  // L206 SQL 계산 컬럼(selectByChckJobId: tdm20_role_nm)
  gb.textCenter('exctNm', 100, '임원'),  // L207 SQL 계산 컬럼(selectByChckJobId: f_emp_kor_nm(tdm53_exct_id))
  gb.long('chckManlCnt', 70, '당월점검'),  // L208 SQL 계산 컬럼(selectByChckJobId: chck_manl_cnt)
  gb.booleanYn2('exctApprYn', 70, '제출완료'),  // L209
  gb.booleanYn2('lockYn', 60, '잠금'),  // L210
  // ⚠ 대응 없음 (GridBuilder L212) addDynamicCell
];

const buildGrid02 = () => [
  // ⚠DB없음 L227 newHeaderGroupMap06newHeaderGroupConfig13 100 "당월 점검항목" (tdm51_new_header_group_map06new_header_group_config13 컬럼 없음)
  gb.text('orgNm', 200, '점검부서'),  // L228 SQL 계산 컬럼(selectByRoleId: org00_kor_nm)
  gb.textCenter('orgManagerNm', 80, '담당자'),  // L229 SQL 계산 컬럼(selectByRoleId: f_emp_kor_nm(tdm08_person_id))
  gb.long('dutyCnt', 80, '관리의무'),  // L230 SQL 계산 컬럼(selectByRoleId: duty_cnt)
  gb.long('manlCnt', 80, '점검항목'),  // L231 SQL 계산 컬럼(selectByRoleId: manl_cnt)
  gb.long('monthManlCnt', 80, '대상'),  // L232 SQL 계산 컬럼(selectByRoleId: month_manl_cnt)
  gb.long('monthManlDoneCnt', 80, '완료'),  // L233 SQL 계산 컬럼(selectByRoleId: ( month_manl_19_cnt + month_manl_20_cnt…)
  gb.long('monthManlUndoneCnt', 80, '미완료'),  // L234 SQL 계산 컬럼(selectByRoleId: month_manl_cnt - ( month_manl_19_cnt + …)
  gb.textStatus('orgStatusNm', 80, '진행상태'),  // L235 SQL 계산 컬럼(selectByRoleId: f_cdnm('TdmCheckStatus', tdm51_org_stat…)
  // ⚠ 대응 없음 (GridBuilder L236) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* 인라인 L582-587 (new SelectHandler() { @Override publi…) */}>닫기</Button>
2. <Button type="save" onClick={updateLockYn}>잠금</Button>
3. <Button type="cancel" onClick={updateLockYn}>잠금해제</Button>
4. <Button type="register" onClick={insertApprChk}>결재요청</Button>
5. <Button type="search" onClick={viewAppr}>문서보기</Button>

### Tdm55_Lookup_ChckRecord (`client/vi/tdm/Tdm55_Lookup_ChckRecord.java`, 141줄)

- 툴바 `buttonBar`: * 의견이 잘린 경우 해당 컬럼을 더블 클릭하여 확인하세요:
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - rowNum 50 " " LongCenter
  - updDateStr 150 "처리일시" TextCenter
  - procType 100 "구분" Text
  - personInfo 200 "처리자" Text
  - procResult 80 "결과" TextCenter
  - resultCmnt 500 "의견" Text

#### 이벤트
[E0] 화면 열림 (생성자 L48-69) → settings(), show()
[E1] grid.CellDoubleClick [cellIndex == 6] (L72) → 인라인 L72-83 (new CellDoubleClickHandler() { @Overr…)
[E2] closeButton[닫기].Select (L85) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L42-46 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L107-132 | open | 서비스 tdm.Tdm55_ChckRecord.selectByChckOrgId, tdm.Tdm55_ChckRecord.selectByInsuffId, tdm.Tdm55_ChckRecord.selectByRelateId(chckOrgId, chckInsuffId, relateId) | 업무 |
| private settings() | L71-91 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L93-105 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L134-136 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L138-140 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('rowNum', 50, ' '),  // L97 SQL 계산 컬럼(selectByChckOrgId: ROW_NUMBER() OVER(ORDER BY tdm55_upd_da…)
  gb.textCenter('updDateStr', 150, '처리일시'),  // L98 SQL 계산 컬럼(selectByChckOrgId: COALESCE(TO_CHAR(tdm55_upd_date, 'yyyy-…)
  gb.text('procType', 100, '구분'),  // L99
  gb.text('personInfo', 200, '처리자'),  // L100
  gb.textCenter('procResult', 80, '결과'),  // L101
  gb.text('resultCmnt', 500, '의견'),  // L102
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm50_Edit_CheckJob (`client/vi/tdm/Tdm50_Edit_CheckJob.java`, 146줄)

- 입력·하위 화면: `startDate` MyDateField, `endDate` MyDateField, `checkName` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L54-67) → setting(), show()
[E1] updateButton[저장].Select (L70) → update()
[E2] closeButton[닫기].Select (L76) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L46-52 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L69-82 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L84-102 | edit | 상태 처리 | 업무 |
| public update() | L104-137 | E1 | 서비스 tdm.Tdm50_ChckJob.modelUpdate | 업무 |
| private setHtmlStyle() | L139-141 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L143-145 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

