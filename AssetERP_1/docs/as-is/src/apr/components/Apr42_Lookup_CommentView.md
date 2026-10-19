# Apr42_Lookup_CommentView

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/apr/Apr42_Lookup_CommentView.java`
- 함께 쓰는 클래스 1개:
  - `Apr42_Lookup_FileList` `client/vi/apr/Apr42_Lookup_FileList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr42_Comment.getSize` | Apr42_Lookup_CommentView:103 | [`Apr42_Comment.java:39`](../../apr/services/Apr42_Comment.md) | [`apr42_comment.getSize`](../../apr/sql/apr42_comment.md) |
| `apr.Apr42_Comment.selectByApprId` | Apr42_Lookup_CommentView:93 | [`Apr42_Comment.java:27`](../../apr/services/Apr42_Comment.md) | [`apr42_comment.selectByApprId`](../../apr/sql/apr42_comment.md) |
| `sys.Sys10_File.selectByParentId` | Apr42_Lookup_FileList:213 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Apr42_Lookup_FileList:224 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr42_comment`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_get_emptrans`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr42_Lookup_CommentView (`client/vi/apr/Apr42_Lookup_CommentView.java`, 121줄)

- 입력·하위 화면: `lookup` Apr42_Lookup_FileList

#### 이벤트
[E0] 화면 열림 (생성자 L51-58) → settings()
[E1] grid.CellClick [event.getCellIndex() == 3] (L61) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L33-49 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L84-100 | E1,open | 서비스 apr.Apr42_Comment.selectByApprId(companyId, personId, apprId) | 업무 |
| private getSize() | L102-116 | retrieve | 서비스 apr.Apr42_Comment.getSize(companyId, apprId) | 업무 |
| private settings() | L60-75 | 생성자 | 조회창 Apr42_Lookup_FileList 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L77-82 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L118-120 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L79) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L80) addTextSmall
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Apr42_Lookup_FileList (`client/vi/apr/Apr42_Lookup_FileList.java`, 255줄)

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

