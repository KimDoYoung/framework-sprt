# Com01_Lookup_RelateAppr

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`, `pay`, `tdm`
- 파일: `client/vi/com/Com01_Lookup_RelateAppr.java`
- 함께 쓰는 클래스 1개:
  - `Com01_Grid_RelateFile` `client/vi/com/Com01_Grid_RelateFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc2`](../../apr/components/Apr05_Lookup_LoadDoc2.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `com.Com01_RelateAppr.delete` | Com01_Lookup_RelateAppr:310 | [`Com01_RelateAppr.java:78`](../../com/services/Com01_RelateAppr.md) | `UpdateDataModel(com01_relate_appr)` 동적 DELETE |
| `com.Com01_RelateAppr.listUpdate` | Com01_Lookup_RelateAppr:292 | [`Com01_RelateAppr.java:59`](../../com/services/Com01_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com01_relate_appr)` 동적 INSERT/UPDATE → [`com01_relate_appr.selectById`](../../com/sql/com01_relate_appr.md) |
| `com.Com01_RelateAppr.modelUpdate` | Com01_Lookup_RelateAppr:265 | [`Com01_RelateAppr.java:46`](../../com/services/Com01_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com01_relate_appr)` 동적 INSERT/UPDATE → [`com01_relate_appr.selectById`](../../com/sql/com01_relate_appr.md) |
| `com.Com01_RelateAppr.selectByKeyTableId` | Com01_Lookup_RelateAppr:227 | [`Com01_RelateAppr.java:24`](../../com/services/Com01_RelateAppr.md) | [`com01_relate_appr.selectByKeyTableId`](../../com/sql/com01_relate_appr.md) |
| `sys.Sys10_File.selectByParentId` | Com01_Grid_RelateFile:210 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Com01_Grid_RelateFile:216 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`com01_relate_appr`](../../../db/tables/com.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Com01_Lookup_RelateAppr (`client/vi/com/Com01_Lookup_RelateAppr.java`, 358줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {apprButton} {deleteButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc, `lookup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - title 370 "제목" Text
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "상신상태" TextCenter
  - actionCell 70 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L70-95) → show()
[E1] retrieveButton[조회].Select (L131) → retrieve()
[E2] insertButton[불러오기].Select (L137) → selectAppr()
[E3] deleteButton[연결제거].Select [YES] (L143) → delete()
[E4] messageBox.DialogHide [YES] (L152) → delete()
[E5] apprButton[신규문서 작성].Select (L164) → selectDcrClass()
[E6] closeButton[닫기].Select [callback != null] (L170) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L97-114 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L116-128 | 공개 메서드 | 상태 처리 | 업무 |
| protected retrieve() | L224-228 | E1,open,view,insert | 서비스 com.Com01_RelateAppr.selectByKeyTableId(keyTableId) | 업무 |
| protected selectAppr() | L230-257 | E2 | 조회창 Apr05_Lookup_LoadDoc2 열기 | 업무 |
| protected insert() | L259-278 | selectAppr,createAppr | 서비스 com.Com01_RelateAppr.modelUpdate | 업무 |
| protected insert() | L280-305 | selectAppr,createAppr | 서비스 com.Com01_RelateAppr.listUpdate | 업무 |
| protected delete() | L307-318 | E3,E4 | GridDeleteData com.Com01_RelateAppr.delete(체크된 행 목록) | 업무 |
| protected selectDcrClass() | L320-328 | E5 | 조회창 Dcr01_Lookup_Class 열기 | 업무 |
| protected createAppr() | L330-346 | selectDcrClass | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| protected setDisable() | L348-352 | view | 상태 처리 | 업무 |
| protected settings() | L130-179 | open,view | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| protected buildGrid() | L181-222 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| protected setHtmlHeaderStyle() | L354-356 | open,view | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 370, '제목'),  // L214 SQL 계산 컬럼(selectByKeyTableId: b.apr01_title)
  gb.date('regDate', 90, '등록일'),  // L215 SQL 계산 컬럼(selectByKeyTableId: b.apr01_reg_date)
  gb.date('effectDate', 90, '시행일'),  // L216 SQL 계산 컬럼(selectByKeyTableId: b.apr01_effect_date)
  gb.textCenter('regEmpNm', 80, '등록자'),  // L217 SQL 계산 컬럼(selectByKeyTableId: f_emp_kor_nm(b.apr01_reg_emp_id))
  gb.textCenter('statusNm', 80, '상신상태'),  // L218 SQL 계산 컬럼(selectByKeyTableId: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L219) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={selectAppr}>불러오기</Button>
3. <Button type="register" onClick={selectDcrClass}>신규문서 작성</Button>
4. <Button type="delete" onClick={delete}>연결제거</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Com01_Grid_RelateFile (`client/vi/com/Com01_Grid_RelateFile.java`, 300줄)

- 툴바 `buttonBar`: {uploadFileButton} {fileUploadForm}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid(), 체크박스):
  - fileName 500 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L80-133) → initDropPanel()
[E1] fileUpload.Change (L88) → 인라인 L88-95 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete [callback != null] (L98) → retrieve()
[E3] uploadFileButton[파일업로드].Select (L139) → 인라인 L139-144 (new SelectHandler() { @Override publi…)
[E4] fileDeleteForm.SubmitComplete (L149) → retrieve()
[E5] messageBox.DialogHide [YES] (L177) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-69 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L71-78 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFileGrid() | L157-205 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| public retrieve() | L207-211 | E2,E4,open,view,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L213-242 | E5 | 미선택 시 alert, 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private setDisable() | L244-247 | view | 상태 처리 | 업무 |
| public clear() | L249-251 | 공개 메서드 | 상태 처리 | 업무 |
| private initDropPanel() | L253-260 | 생성자 | 상태 처리 | 업무 |
| public getParentId() | L297-299 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L135-155 | open,view | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.text('fileNm', 500, '첨부파일'),  // L199
  // ⚠ 대응 없음 (GridBuilder L200) addCell
  // ⚠ 대응 없음 (GridBuilder L201) addCell
  // ⚠ 대응 없음 (GridBuilder L202) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L139-144 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>

