# Act80_Lookup_RelateAppr

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ast`, `pay`
- 파일: `client/vi/act/Act80_Lookup_RelateAppr.java`
- 함께 쓰는 클래스 1개:
  - `Act80_LookupGrid_RelateFile` `client/vi/act/Act80_LookupGrid_RelateFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.selectOneJournalIdByTrId` | Act80_LookupGrid_RelateFile:104 | [`Act02_Journal.java:61`](../../act/services/Act02_Journal.md) | [`act02_journal.selectOneJournalIdByTrId`](../../act/sql/act02_journal.md) |
| `act.Act80_RelateAppr.delete` | Act80_Lookup_RelateAppr:271 | [`Act80_RelateAppr.java:66`](../../act/services/Act80_RelateAppr.md) | `UpdateDataModel(act80_relate_appr)` 동적 DELETE |
| `act.Act80_RelateAppr.modelUpdate` | Act80_Lookup_RelateAppr:225, Act80_Lookup_RelateAppr:310 | [`Act80_RelateAppr.java:41`](../../act/services/Act80_RelateAppr.md) | [`act80_relate_appr.selectJournalId`](../../act/sql/act80_relate_appr.md), [`act80_relate_appr.selectTrId`](../../act/sql/act80_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(act80_relate_appr)` 동적 INSERT/UPDATE → [`act80_relate_appr.selectById`](../../act/sql/act80_relate_appr.md) |
| `act.Act80_RelateAppr.selectByJournalId` | Act80_Lookup_RelateAppr:204 | [`Act80_RelateAppr.java:25`](../../act/services/Act80_RelateAppr.md) | [`act80_relate_appr.selectByJournalId`](../../act/sql/act80_relate_appr.md) |
| `act.Act80_RelateAppr.selectByTrId` | Act80_Lookup_RelateAppr:200 | [`Act80_RelateAppr.java:33`](../../act/services/Act80_RelateAppr.md) | [`act80_relate_appr.selectByTrId`](../../act/sql/act80_relate_appr.md) |
| `apr.Apr01_Appr.selectById` | Act80_Lookup_RelateAppr:157 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `sys.Sys10_File.selectByParentId2` | Act80_LookupGrid_RelateFile:230 | [`Sys10_File.java:57`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId2`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Act80_LookupGrid_RelateFile:203 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`com01_relate_appr`](../../../db/tables/com.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act80_Lookup_RelateAppr (`client/vi/act/Act80_Lookup_RelateAppr.java`, 329줄)

- 툴바 `buttonBar01`: {retrieveButton} {insertButton} {apprButton} {deleteButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc, `lookup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - title 370 "제목" Text
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "상신상태" TextCenter
  - actionCell 70 "상세보기" Cell 편집:actionCell
  - lockYn 40 "" BooleanIcon

#### 이벤트
[E0] 화면 열림 (생성자 L126-149) → show()
[E1] retrieveButton[조회].Select (L91) → retrieve()
[E2] insertButton[불러오기].Select (L97) → insert()
[E3] deleteButton[연결제거].Select (L103) → preDelete()
       └ [E6] msgBox.DialogHide [YES] (L243) → delete()
[E4] apprButton[신규문서 작성].Select (L109) → selectDcrClass()
[E5] closeButton[닫기].Select [callback != null] (L115) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-72 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L74-77 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L79-88 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L194-206 | E1,open,insert,createAppr | 서비스 act.Act80_RelateAppr.selectByTrId, act.Act80_RelateAppr.selectByJournalId(companyId, trId, journalId) | 업무 |
| private insert() | L208-238 | E2 | 조회창 Apr05_Lookup_LoadDoc 열기, 서비스 act.Act80_RelateAppr.modelUpdate | 업무 |
| private preDelete() | L240-259 | E3 | ConfirmBox → E6 | 업무 |
| private delete() | L261-272 | E6 | GridDeleteData act.Act80_RelateAppr.delete(체크된 행 목록) | 업무 |
| private selectDcrClass() | L274-283 | E4 | 조회창 Dcr01_Lookup_Class 열기 | 업무 |
| private createAppr() | L285-323 | selectDcrClass | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 act.Act80_RelateAppr.modelUpdate | 업무 |
| private settings() | L90-124 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L151-192 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L325-327 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 370, '제목'),  // L183 SQL 계산 컬럼(selectById: b.apr01_title)
  gb.date('regDate', 90, '등록일'),  // L184 SQL 계산 컬럼(selectById: b.apr01_reg_date)
  gb.date('effectDate', 90, '시행일'),  // L185 SQL 계산 컬럼(selectById: b.apr01_effect_date)
  gb.textCenter('regEmpNm', 80, '등록자'),  // L186 SQL 계산 컬럼(selectById: f_emp_kor_nm(b.apr01_reg_emp_id))
  gb.textCenter('statusNm', 80, '상신상태'),  // L187 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L188) addCell
  // ⚠ 대응 없음 (GridBuilder L189) addBooleanIcon
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="register" onClick={insert}>불러오기</Button>
4. <Button type="delete" onClick={preDelete}>연결제거</Button>
5. <Button type="register" onClick={selectDcrClass}>신규문서 작성</Button>

### Act80_LookupGrid_RelateFile (`client/vi/act/Act80_LookupGrid_RelateFile.java`, 236줄)

- 툴바 `buttonBar`: {uploadFileButton} {fileUploadForm}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid(), 체크박스):
  - fileName 450 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell
  - lockYn 40 "" BooleanIcon

#### 이벤트
[E0] 화면 열림 (생성자 L55-94) → 초기화
[E1] fileUpload.Change (L63) → 인라인 L63-70 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L73) → retrieve()
[E3] uploadFileButton[파일업로드].Select (L126) → 인라인 L126-131 (new SelectHandler() { @Override publi…)
[E4] fileDeleteForm.SubmitComplete (L136) → retrieve()
[E5] messageBox.DialogHide [YES] (L164) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L96-120 | 공개 메서드 | 서비스 act.Act02_Journal.selectOneJournalIdByTrId(trId) | 업무 |
| private buildFileGrid() | L144-193 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| private checkFileDelete() | L195-225 | E5 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public retrieve() | L227-231 | E2,E4,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId2(parentId) | 업무 |
| public clear() | L233-235 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L122-142 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.text('fileNm', 450, '첨부파일'),  // L186
  // ⚠ 대응 없음 (GridBuilder L187) addCell
  // ⚠ 대응 없음 (GridBuilder L188) addCell
  // ⚠ 대응 없음 (GridBuilder L189) addCell
  // ⚠ 대응 없음 (GridBuilder L190) addBooleanIcon
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L126-131 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>

