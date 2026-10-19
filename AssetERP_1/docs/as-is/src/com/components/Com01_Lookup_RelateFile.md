# Com01_Lookup_RelateFile

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `fnd`
- 파일: `client/vi/com/Com01_Lookup_RelateFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Com01_Lookup_RelateFile:195 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Com01_Lookup_RelateFile:230 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Com01_Lookup_RelateFile (`client/vi/com/Com01_Lookup_RelateFile.java`, 267줄)

- 툴바 `buttonBar`: {updateButton}
- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid(), 체크박스):
  - fileName 640 "첨부파일명" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "삭제" Cell 편집:deleteCell
  - actionCell 80 "미리보기" Cell 편집:viewCell

#### 이벤트
[E1] updateButton[파일업로드].Select (L77) → 인라인 L77-82 (new SelectHandler(){ @Override public…)
[E2] okButton[닫기].Select (L85) → confirm()
[E3] fileUpload.Change (L99) → 인라인 L99-106 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L109) → resetFileUpload(), retrieve()
[E5] fileDeleteForm.SubmitComplete (L136) → retrieve()
[E6] fileUpload.Change (L217) → 인라인 L217-224 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L56-62 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L63-66 | view | 상태 처리 | 업무 |
| public open() | L68-148 | view | 상태 처리 | 업무 |
| private buildFileGrid() | L150-187 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private retrieve() | L189-201 | E4,E5,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private confirm() | L203-208 | E2 | 상태 처리 | 업무 |
| private resetFileUpload() | L210-225 | E4 | 상태 처리 | 업무 |
| private checkFileDelete() | L227-252 | buildFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public getServiceResult() | L254-261 | checkFileDelete | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L263-265 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.text('fileNm', 640, '첨부파일명'),  // L181
  // ⚠ 대응 없음 (GridBuilder L182) addCell
  // ⚠ 대응 없음 (GridBuilder L183) addCell
  // ⚠ 대응 없음 (GridBuilder L184) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L77-82 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={confirm}>닫기</Button>

