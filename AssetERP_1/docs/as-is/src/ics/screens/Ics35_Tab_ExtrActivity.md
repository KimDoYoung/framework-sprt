# Ics35_Tab_ExtrActivity

- 종류: 화면
- 메뉴: 준법감시 > 12. 대외활동 > 대외활동신청 (#1431)
- 파일: `client/vi/ics/Ics35_Tab_ExtrActivity.java`
- 함께 쓰는 클래스 2개:
  - `Ics35_Edit_ExtrActivity` `client/vi/ics/Ics35_Edit_ExtrActivity.java`
  - `Ics35_Grid_FileList` `client/vi/ics/Ics35_Grid_FileList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys10_Lookup_File`](../../sys/components/Sys10_Lookup_File.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr30_Link.selectByLinkCode` | Ics35_Tab_ExtrActivity:310 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `ics.Ics35_ExtrActivity.delete` | Ics35_Tab_ExtrActivity:241 | [`Ics35_ExtrActivity.java:88`](../../ics/services/Ics35_ExtrActivity.md) | `UpdateDataModel(ics35_extr_activity)` 동적 DELETE |
| `ics.Ics35_ExtrActivity.modelUpdate` | Ics35_Edit_ExtrActivity:229 | [`Ics35_ExtrActivity.java:70`](../../ics/services/Ics35_ExtrActivity.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics35_extr_activity)` 동적 INSERT/UPDATE → [`ics35_extr_activity.selectById`](../../ics/sql/ics35_extr_activity.md) |
| `ics.Ics35_ExtrActivity.selectByPersonId` | Ics35_Tab_ExtrActivity:262 | [`Ics35_ExtrActivity.java:39`](../../ics/services/Ics35_ExtrActivity.md) | [`ics35_extr_activity.selectByPersonId`](../../ics/sql/ics35_extr_activity.md) |
| `ics.Ics35_ExtrActivity.updateApprId` | Ics35_Tab_ExtrActivity:356 | [`Ics35_ExtrActivity.java:52`](../../ics/services/Ics35_ExtrActivity.md) | [`ics35_extr_activity.updateApprId`](../../ics/sql/ics35_extr_activity.md) |
| `ics.Ics35_ExtrActivity.updateResultApprId` | Ics35_Tab_ExtrActivity:370 | [`Ics35_ExtrActivity.java:61`](../../ics/services/Ics35_ExtrActivity.md) | [`ics35_extr_activity.updateResultApprId`](../../ics/sql/ics35_extr_activity.md) |
| `sys.Sys10_File.selectByParentId` | Ics35_Grid_FileList:149 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`ics35_extr_activity`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_emptrans`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics35_Tab_ExtrActivity (`client/vi/ics/Ics35_Tab_ExtrActivity.java`, 453줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `lookup` Ics35_Edit_ExtrActivity, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - actionCell 50 "수정" Cell 편집:actionCell01
  - regDate 100 "신청일자" Date
  - activityCorp 200 "활동처" Text
  - activityTgtName2 300 "활동대상" Text
  - activityPeriod 280 "활동기간" Text
  - fileCntStr 80 "첨부자료" TextCenter
  - actionCell 30 "" Cell 편집:actionCell02
  - actionCell 80 "결재요청" Cell 편집:actionCell03
  - apprStatusName 100 "결재상태" TextStatus
  - actionCell 80 "문서보기" Cell 편집:actionCell04
  - actionCell 80 "결재요청" Cell 편집:actionCell05
  - resultApprStatusName 100 "결재상태" TextStatus
  - actionCell 80 "문서보기" Cell 편집:actionCell06

#### 이벤트
[E0] 화면 열림 (생성자 L69-95) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L103) → retrieve()
[E2] insertButton[등록].Select (L109) → insertRow()
[E3] deleteButton[삭제].Select (L115) → deleteRow()
       └ [E4] msgBox.DialogHide [YES] (L234) → 서비스 ics.Ics35_ExtrActivity.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertRow() | L206-214 | E2 | 팝업 Ics35_Edit_ExtrActivity 열기 | 업무 |
| private deleteRow() | L216-252 | E3 | ConfirmBox → E4 | 업무 |
| private retrieve() | L254-268 | 생성자,E1,buildGrid,insertRow,updateApprId,updateResultApprId | 서비스 ics.Ics35_ExtrActivity.selectByPersonId(companyId, personId, startDate, closeDate) | 업무 |
| private viewAppr() | L270-292 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private dcrChk() | L294-335 | buildGrid | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) | 업무 |
| private insertLinkApproval() | L337-353 | dcrChk | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L355-367 | insertLinkApproval | 서비스 ics.Ics35_ExtrActivity.updateApprId(extrActivityId, apprId) | 업무 |
| private updateResultApprId() | L369-381 | insertLinkApproval | 서비스 ics.Ics35_ExtrActivity.updateResultApprId(extrActivityId, resultApprId) | 업무 |
| public createMapping() | L383-399 | dcrChk | 상태 처리 | 업무 |
| public createResultMapping() | L401-416 | dcrChk | 상태 처리 | 업무 |
| private checkStringNull() | L418-426 | createMapping,createResultMapping | 상태 처리 | 업무 |
| private checkStringHtml() | L428-436 | createMapping,createResultMapping | 상태 처리 | 업무 |
| private checkDateNull() | L438-448 | createMapping,createResultMapping | 상태 처리 | 업무 |
| private settings() | L97-121 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L123-204 | 필드 초기화 | 팝업 Ics35_Edit_ExtrActivity 열기, 조회창 Sys10_Lookup_File 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L450-452 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L186 newHeaderGroupMap09newHeaderGroupConfig13 100 "활동신청" (sys10_new_header_group_map09new_header_group_config13 컬럼 없음)
  // ⚠DB없음 L187 newHeaderGroupMap012newHeaderGroupConfig13 100 "결과보고" (sys10_new_header_group_map012new_header_group_config13 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L189) addCell
  gb.date('regDate', 100, '신청일자'),  // L190
  gb.text('activityCorp', 200, '활동처'),  // L191
  gb.text('activityTgtNm2', 300, '활동대상'),  // L192
  gb.text('activityPeriod', 280, '활동기간'),  // L193
  gb.textCenter('fileCntStr', 80, '첨부자료'),  // L194
  // ⚠ 대응 없음 (GridBuilder L195) addCell
  // ⚠ 대응 없음 (GridBuilder L196) addCell
  gb.textStatus('apprStatusNm', 100, '결재상태'),  // L197
  // ⚠ 대응 없음 (GridBuilder L198) addCell
  // ⚠ 대응 없음 (GridBuilder L199) addCell
  gb.textStatus('resultApprStatusNm', 100, '결재상태'),  // L200
  // ⚠ 대응 없음 (GridBuilder L201) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Ics35_Edit_ExtrActivity (`client/vi/ics/Ics35_Edit_ExtrActivity.java`, 249줄)

- 입력·하위 화면: `regDate` MyDateField, `activityCorp` TextField, `activityTgtName` ComboBoxField("ExtrActivityTargetCode") 빈칸="선택", `activityTgtCode` TextField, `activityTgtEtc` TextField 빈칸="기타인 경우 직접기재", `activityPeriod` TextField 빈칸="예) 2025-07-01 10:30 ~ 2025-07-02 17:30", `activityDesc` MyTextArea 빈칸="* 다른 법인 임원 취임인 경우 해당 회사명, 직위, 주요 활동내용 등을 기재\n", `activityPay` TextField 빈칸="예) 시간, 편, 회당 000원 등"

#### 이벤트
[E0] 화면 열림 (생성자 L96-109) → settings(), getEditor(), show()
[E1] activityTgtName[활동대상].Collapse (L121) → 인라인 L121-132 (new CollapseHandler() { @Override pub…)
[E2] uploadButton[첨부자료].Select (L133) → 인라인 L133-138 (new SelectHandler(){ @Override public…)
[E3] updateButton[저장].Select (L139) → update()
[E4] closeButton[닫기].Select (L145) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L61-79 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L81-94 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L153-203 | 생성자 | 상태 처리 | 업무 |
| private update() | L205-240 | E3 | 서비스 ics.Ics35_ExtrActivity.modelUpdate | 업무 |
| private settings() | L111-151 | 생성자 | 이벤트 연결, 초기값: activityTgtEtc=null, activityTgtCode=activityTgtName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L242-244 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L246-248 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="upload" onClick={() => /* 인라인 L133-138 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>

### Ics35_Grid_FileList (`client/vi/ics/Ics35_Grid_FileList.java`, 183줄)

- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid()):
  - fileName 440 "파일명" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L41-53) → settings()
[E1] fileUploadForm.SubmitComplete (L60) → resetFileUpload(), retrieve()
[E2] fileDeleteForm.SubmitComplete (L69) → retrieve()
[E3] fileUpload.Change (L76) → 인라인 L76-83 (new ChangeHandler() { @Override publi…)
[E4] msgBox.DialogHide [YES] (L114) → checkFileDelete()
[E5] fileUpload.Change (L164) → 인라인 L164-171 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public upload() | L86-88 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L142-155 | E1,E2 | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private resetFileUpload() | L157-172 | E1 | 상태 처리 | 업무 |
| private checkFileDelete() | L174-182 | E4 | 상태 처리 | 업무 |
| private settings() | L55-84 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L90-140 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 440, '파일명'),  // L134
  // ⚠ 대응 없음 (GridBuilder L135) addCell
  // ⚠ 대응 없음 (GridBuilder L136) addCell
  // ⚠ 대응 없음 (GridBuilder L137) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

