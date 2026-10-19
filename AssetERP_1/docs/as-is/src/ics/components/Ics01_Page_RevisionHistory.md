# Ics01_Page_RevisionHistory

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sch`
- 파일: `client/vi/ics/Ics01_Page_RevisionHistory.java`
- 함께 쓰는 클래스 2개:
  - `Ics20_Lookup_File` `client/vi/ics/Ics20_Lookup_File.java`
  - `Ics20_Lookup_Content` `client/vi/ics/Ics20_Lookup_Content.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics20_RevisionHistory.selectByClassTreeId` | Ics01_Page_RevisionHistory:79 | [`Ics20_RevisionHistory.java:48`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.selectByClassTreeId`](../../ics/sql/ics20_revision_history.md) |
| `ics.Ics20_RevisionHistory.updateContent` | Ics20_Lookup_Content:85 | [`Ics20_RevisionHistory.java:60`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.updateContent`](../../ics/sql/ics20_revision_history.md) |
| `sys.Sys10_File.selectByParentId` | Ics20_Lookup_File:105 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Page_RevisionHistory (`client/vi/ics/Ics01_Page_RevisionHistory.java`, 86줄)

- 입력·하위 화면: `lookupContent` Ics20_Lookup_Content, `lookupFile` Ics20_Lookup_File
- 그리드 `grid` (buildGrid()):
  - regDate 90 "등록일" Date
  - submissionDate 90 "의견제출일" Date
  - effectDate 90 "시행일" Date
  - title 450 "법규명" Text
  - actionCell 60 "상세내용" Cell 편집:contentCell
  - financeAgencyName 100 "소관부처" Text
  - reflectionDate 90 "법규반영일" Date
  - fileCount 60 "첨부파일" LongCenter
  - actionCell 30 " " Cell 편집:fileListCell

#### 이벤트
[E0] 화면 열림 (생성자 L23-26) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private fileList() | L69-72 | buildGrid | 조회창 Ics20_Lookup_File 열기 | 업무 |
| public retrieve() | L74-85 | 공개 메서드 | 서비스 ics.Ics20_RevisionHistory.selectByClassTreeId(classTreeId) | 업무 |
| package buildGrid() | L28-67 | 필드 초기화 | 조회창 Ics20_Lookup_Content 열기, 미선택 시 alert "첨부파일이 없습니다.", 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L56
  gb.date('submissionDate', 90, '의견제출일'),  // L57
  gb.date('effectDate', 90, '시행일'),  // L58
  gb.text('title', 450, '법규명'),  // L59
  // ⚠ 대응 없음 (GridBuilder L60) addCell
  gb.text('financeAgencyNm', 100, '소관부처'),  // L61
  gb.date('reflectionDate', 90, '법규반영일'),  // L62
  gb.longCenter('fileCount', 60, '첨부파일'),  // L63
  // ⚠ 대응 없음 (GridBuilder L64) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Ics20_Lookup_File (`client/vi/ics/Ics20_Lookup_File.java`, 117줄)

- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 440 "첨부파일명" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "미리보기" Cell 편집:viewCell

#### 이벤트
[E1] closeButton[닫기].Select (L46) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-65 | 공개 메서드 | 상태 처리 | 업무 |
| private buildApprFileGrid() | L67-97 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private retrieve() | L99-111 | open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private setHtmlHeaderStyle() | L113-115 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 440, '첨부파일명'),  // L92
  // ⚠ 대응 없음 (GridBuilder L93) addCell
  // ⚠ 대응 없음 (GridBuilder L94) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics20_Lookup_Content (`client/vi/ics/Ics20_Lookup_Content.java`, 102줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E1] updateButton[저장].Select (L60) → update()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-80 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L82-96 | E1 | 서비스 ics.Ics20_RevisionHistory.updateContent | 업무 |
| private setHtmlHeaderStyle() | L98-100 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

