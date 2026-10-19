# Ics01_Tab_IcsFileUpload

- 종류: 화면
- 메뉴: 기초자료 > 00. 내부통제 > 법규보고 서식파일 등록 (#1107)
- 파일: `client/vi/ics/Ics01_Tab_IcsFileUpload.java`
- 함께 쓰는 클래스 1개:
  - `Ics01_Lookup_IcsFileMultiUpload` `client/vi/ics/Ics01_Lookup_IcsFileMultiUpload.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.getIcsFile` | Ics01_Tab_IcsFileUpload:213 | [`Sys10_File.java:81`](../../sys/services/Sys10_File.md) | [`sys10_file.getIcsFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.update` | Ics01_Tab_IcsFileUpload:223 | [`Sys10_File.java:363`](../../sys/services/Sys10_File.md) | `UpdateDataModel(sys10_file)` 동적 INSERT/UPDATE → [`sys10_file.selectById`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Ics01_Tab_IcsFileUpload:234 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Tab_IcsFileUpload (`client/vi/ics/Ics01_Tab_IcsFileUpload.java`, 270줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 법령구분: {lawNameComboBox} 검색: {searchText} {retrieveButton} {updateButton} {fileUploadButton} {fileDownloadForm} {fileDeleteForm}
- 입력·하위 화면: `lawNameComboBox` ComboBoxField("LawType", "%", "전체"), `searchText` TextField 빈칸="내용/서식파일", `lawTypeComboBox` ComboBoxField("LawType"), `Lookup` Ics01_Lookup_IcsFileMultiUpload
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - lawName 150 "법령구분" Text 편집:lawTypeComboBox
  - note 150 "내용" Text 편집:TextField
  - regDate 100 "등록일" Date
  - fileName 700 "서식파일" Text
  - actionCell 50 "받기" CellFix 편집:downloadCell
  - actionCell 50 "삭제" CellFix 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L61-108) → settings(), show(), retrieve()
[E1] fileDeleteForm.SubmitComplete (L66) → retrieve()
[E2] fileUploadButton[파일업로드].Select (L72) → fileMultiUpload()
[E3] searchText.KeyPress [Enter] (L116) → retrieve()
[E4] retrieveButton[조회].Select (L125) → retrieve()
[E5] updateButton[저장].Select (L131) → update()
[E6] lawTypeComboBox[LawType].Collapse (L145) → 인라인 L145-152 (new CollapseHandler() { @Override pub…)
[E7] msgBox.DialogHide [YES] (L168) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildApprFileGrid() | L140-195 | 필드 초기화 | 확인창 표시 | 업무 |
| private retrieve() | L197-219 | 생성자,E1,E3,E4,update,checkFileDelete,fileMultiUpload | 서비스 sys.Sys10_File.getIcsFile(parentId, lawType, searchText) | 업무 |
| private update() | L221-229 | E5 | 서비스 sys.Sys10_File.update | 업무 |
| private checkFileDelete() | L231-256 | E7 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public fileMultiUpload() | L258-265 | E2 | 조회창 Ics01_Lookup_IcsFileMultiUpload 열기 | 업무 |
| private settings() | L110-138 | 생성자 | 이벤트 연결, 초기값: lawNameComboBox="전체"("LawType") | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L267-269 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('lawNm', 150, '법령구분', { editor: 'select' }),  // L188 SQL 계산 컬럼(getIcsFile: f_cdnm('LawType', sys10_law_type, 0, f_…)
  gb.text('note', 150, '내용', { editor: 'text' }),  // L189
  gb.date('regDate', 100, '등록일'),  // L190
  gb.text('fileNm', 700, '서식파일'),  // L191
  // ⚠ 대응 없음 (GridBuilder L192) addCellFix
  // ⚠ 대응 없음 (GridBuilder L193) addCellFix
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="upload" onClick={fileMultiUpload}>파일업로드</Button>

### Ics01_Lookup_IcsFileMultiUpload (`client/vi/ics/Ics01_Lookup_IcsFileMultiUpload.java`, 148줄)

- 입력·하위 화면: `lawNameComboBox` ComboBoxField("LawType") 빈칸="선택", `content` TextField 빈칸="내용작성"

#### 이벤트
[E0] 화면 열림 (생성자 L46-104) → show()
[E1] fileUpload.Change (L59) → 인라인 L59-72 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L77) → hide()
[E3] updateButton[업로드].Select (L86) → uploadChk()
[E4] closeButton[닫기].Select (L92) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L41-44 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L106-124 | open | 상태 처리 | 업무 |
| public uploadChk() | L126-137 | E3 | 상태 처리 | 업무 |
| private setHtmlStyle() | L140-142 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L144-146 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={uploadChk}>업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

