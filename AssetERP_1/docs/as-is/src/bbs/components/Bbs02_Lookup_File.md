# Bbs02_Lookup_File

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `mrb`, `sch`
- 파일: `client/vi/bbs/Bbs02_Lookup_File.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Bbs02_Lookup_File:198 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Bbs02_Lookup_File:233 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs02_Lookup_File (`client/vi/bbs/Bbs02_Lookup_File.java`, 271줄)

- 툴바 `buttonBar`: {updateButton}
- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 640 "첨부파일명" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "삭제" Cell 편집:deleteCell
  - actionCell 80 "미리보기" Cell 편집:viewCell

#### 이벤트
[E1] updateButton[파일업로드].Select (L79) → 인라인 L79-84 (new SelectHandler(){ @Override public…)
[E2] okButton[닫기].Select (L87) → confirm()
[E3] fileUpload.Change (L102) → 인라인 L102-109 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L112) → resetFileUpload(), retrieve()
[E5] fileDeleteForm.SubmitComplete (L139) → retrieve()
[E6] fileUpload.Change (L220) → 인라인 L220-227 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUser() | L58-64 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L65-68 | openUser | 상태 처리 | 업무 |
| public open() | L70-151 | openUser | 상태 처리 | 업무 |
| private buildApprFileGrid() | L153-190 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private retrieve() | L192-204 | E4,E5,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private confirm() | L206-211 | E2 | 상태 처리 | 업무 |
| private resetFileUpload() | L213-228 | E4 | 상태 처리 | 업무 |
| private checkFileDelete() | L230-255 | buildApprFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public getServiceResult() | L258-265 | checkFileDelete | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L267-269 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 640, '첨부파일명'),  // L184
  // ⚠ 대응 없음 (GridBuilder L185) addCell
  // ⚠ 대응 없음 (GridBuilder L186) addCell
  // ⚠ 대응 없음 (GridBuilder L187) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L79-84 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={confirm}>닫기</Button>

