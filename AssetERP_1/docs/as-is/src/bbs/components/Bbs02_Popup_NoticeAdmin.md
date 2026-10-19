# Bbs02_Popup_NoticeAdmin

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/bbs/Bbs02_Popup_NoticeAdmin.java`
- 함께 쓰는 클래스 2개:
  - `Bbs07_TapPage_Comment` `client/vi/bbs/Bbs07_TapPage_Comment.java`
  - `Bbs07_Lookup_FileList` `client/vi/bbs/Bbs07_Lookup_FileList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Lookup_File`](../../bbs/components/Bbs02_Lookup_File.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs05_History.updatePersonId` | Bbs02_Popup_NoticeAdmin:203, Bbs02_Popup_NoticeAdmin:240 | [`Bbs05_History.java:32`](../../bbs/services/Bbs05_History.md) | [`bbs05_history.insert`](../../bbs/sql/bbs05_history.md), [`bbs05_history.selectByNoticeId`](../../bbs/sql/bbs05_history.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs05_history)` 동적 INSERT/UPDATE → [`bbs05_history.selectById`](../../bbs/sql/bbs05_history.md) |
| `bbs.Bbs07_Comment.delete` | Bbs07_TapPage_Comment:188 | [`Bbs07_Comment.java:84`](../../bbs/services/Bbs07_Comment.md) | `UpdateDataModel(bbs07_comment)` 동적 DELETE |
| `bbs.Bbs07_Comment.getSize` | Bbs07_TapPage_Comment:153 | [`Bbs07_Comment.java:39`](../../bbs/services/Bbs07_Comment.md) | [`bbs07_comment.getSize`](../../bbs/sql/bbs07_comment.md) |
| `bbs.Bbs07_Comment.modelUpdate` | Bbs07_TapPage_Comment:169 | [`Bbs07_Comment.java:50`](../../bbs/services/Bbs07_Comment.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs07_comment)` 동적 INSERT/UPDATE → [`bbs07_comment.selectById`](../../bbs/sql/bbs07_comment.md) |
| `bbs.Bbs07_Comment.selectByNoticeId` | Bbs07_TapPage_Comment:143 | [`Bbs07_Comment.java:27`](../../bbs/services/Bbs07_Comment.md) | [`bbs07_comment.selectByNoticeId`](../../bbs/sql/bbs07_comment.md) |
| `sys.Sys10_File.selectByParentId` | Bbs02_Popup_NoticeAdmin:259, Bbs07_Lookup_FileList:213 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Bbs07_Lookup_FileList:224 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`bbs05_history`](../../../db/tables/bbs.md), [`bbs07_comment`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_get_emptrans`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs02_Popup_NoticeAdmin (`client/vi/bbs/Bbs02_Popup_NoticeAdmin.java`, 287줄)

- 입력·하위 화면: `checkBox` CheckBox, `tabPage` Bbs07_TapPage_Comment, `lookupFile` Bbs02_Lookup_File

#### 이벤트
[E0] 화면 열림 (생성자 L192-194) → settings()
[E1] checkBox[해당 공지사항 그만보기].ValueChange [event.getValue()] (L199) → hide()
[E2] closeButton[닫기].Select [callback != null] (L220) → hide()
[E3] fileButton[첨부파일 확인].Select (L229) → 인라인 L229-235 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openWithComment() | L49-94 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L96-130 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L132-162 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L164-190 | 공개 메서드 | 상태 처리 | 업무 |
| private check() | L238-256 | 미사용 후보 | 서비스 bbs.Bbs05_History.updatePersonId(companyId, personId, noticeId, date) | 업무 |
| private setFileButtonText() | L258-269 | openWithComment,open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L196-236 | 생성자 | 조회창 Bbs02_Lookup_File 열기, 서비스 bbs.Bbs05_History.updatePersonId(companyId, personId, noticeId, date), 이벤트 연결, 초기값: checkBox=false("해당 공지사항 그만보기") | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L271-273 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L280-282 | openWithComment,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L284-286 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L229-235 (new SelectHandler(){ @Override public…) */}>첨부파일 확인</Button>

### Bbs07_TapPage_Comment (`client/vi/bbs/Bbs07_TapPage_Comment.java`, 194줄)

- 툴바 `buttonBar`: 댓글등록: {commentField} {insertButton}
- 입력·하위 화면: `commentField` MyTextArea 빈칸="내용을 입력하세요", `lookup` Bbs07_Lookup_FileList

#### 이벤트
[E0] 화면 열림 (생성자 L51-66) → settings()
[E1] insertButton[등 록].Select (L71) → update()
[E2] grid.CellClick [event.getCellIndex() == 3] (L81) → retrieve(), deleteChk()
       └ [E3] msgBox.DialogHide [YES] (L113) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private deleteChk() | L109-133 | E2 | ConfirmBox → E3 | 업무 |
| public retrieve() | L135-150 | E2,update | 서비스 bbs.Bbs07_Comment.selectByNoticeId(companyId, personId, noticeId) | 업무 |
| private getSize() | L152-166 | retrieve | 서비스 bbs.Bbs07_Comment.getSize(companyId, noticeId) | 업무 |
| private update() | L168-183 | E1 | 서비스 bbs.Bbs07_Comment.modelUpdate(companyId, personId, noticeId, comment) | 업무 |
| private delete() | L185-189 | E3 | GridDeleteData bbs.Bbs07_Comment.delete(체크된 행 목록) | 업무 |
| private settings() | L68-99 | 생성자 | 조회창 Bbs07_Lookup_FileList 열기, 미선택 시 alert "내용을 입력해주세요", 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L101-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L191-193 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L103) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L104) addTextSmall
  // ⚠ 대응 없음 (GridBuilder L105) addTextSmall
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={update}>등 록</Button>

### Bbs07_Lookup_FileList (`client/vi/bbs/Bbs07_Lookup_FileList.java`, 255줄)

- 툴바 `buttonBar`: {uploadFileButton} {fileUploadForm}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid()):
  - fileName 440 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L76-128) → settings(), show()
[E1] fileUpload.Change (L91) → 인라인 L91-98 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L101) → retrieve()
[E3] uploadFileButton[파일업로드].Select (L131) → 인라인 L131-136 (new SelectHandler() { @Override publi…)
[E4] fileDeleteForm.SubmitComplete (L139) → retrieve()
[E5] closeButton[닫기].Select (L145) → hide()
[E6] msgBox.DialogHide [YES] (L173) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L63-74 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFileGrid() | L154-208 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| public retrieve() | L210-219 | E2,E4,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L221-246 | E6 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public clear() | L252-254 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L130-152 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L248-250 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.text('fileNm', 440, '첨부파일'),  // L202
  // ⚠ 대응 없음 (GridBuilder L203) addCell
  // ⚠ 대응 없음 (GridBuilder L204) addCell
  // ⚠ 대응 없음 (GridBuilder L205) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L131-136 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

