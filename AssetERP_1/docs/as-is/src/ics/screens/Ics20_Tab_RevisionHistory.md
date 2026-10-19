# Ics20_Tab_RevisionHistory

- 종류: 화면
- 메뉴: 준법감시 > 00. 법규정보 > 법규개정내역 (#1256)
- 파일: `client/vi/ics/Ics20_Tab_RevisionHistory.java`
- 함께 쓰는 클래스 2개:
  - `Ics20_Edit_RevisionHistory` `client/vi/ics/Ics20_Edit_RevisionHistory.java`
  - `Ics20_Lookup_Content` `client/vi/ics/Ics20_Lookup_Content.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics20_RevisionHistory.delete` | Ics20_Tab_RevisionHistory:251 | [`Ics20_RevisionHistory.java:76`](../../ics/services/Ics20_RevisionHistory.md) | `UpdateDataModel(ics20_revision_history)` 동적 DELETE |
| `ics.Ics20_RevisionHistory.selectByDate` | Ics20_Tab_RevisionHistory:221 | [`Ics20_RevisionHistory.java:26`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.selectByDate`](../../ics/sql/ics20_revision_history.md) |
| `ics.Ics20_RevisionHistory.updateContent` | Ics20_Lookup_Content:85 | [`Ics20_RevisionHistory.java:60`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.updateContent`](../../ics/sql/ics20_revision_history.md) |

## 테이블

[`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics20_Tab_RevisionHistory (`client/vi/ics/Ics20_Tab_RevisionHistory.java`, 268줄)

- 레이아웃: center=vlc, south=editPage
- 툴바 `buttonBar`: {radioReg} {radioEffect} {startDate} ~: {closeDate} 소관부처: {financeAgencyComboBox} 통합검색: {searchText} 조문검색: {relatedLawSearchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="소관부처/법규명/비고", `relatedLawSearchText` TextField 빈칸="관련조문", `radioReg` Radio, `radioEffect` Radio, `startDate` MyDateField, `closeDate` MyDateField, `editPage` Ics20_Edit_RevisionHistory, `financeAgencyComboBox` ComboBoxField("FinanceAgencyCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 90 "등록일" Date
  - submissionDate 90 "의견제출일" Date
  - effectDate 90 "시행일" Date
  - title 470 "법규명" Text
  - relatedLaw 470 "조문" Text
  - financeAgencyName 100 "소관부처" Text
  - reflectionDate 90 "법규반영일" Date
  - icsCount 60 "연결법규" LongCenter
  - fileCount 60 "첨부파일" LongCenter

#### 이벤트
[E0] 화면 열림 (생성자 L68-117) → settings()
[E1] grid.SelectionChanged [선택>0] (L109) → retrieveEditPage()
[E2] searchText.KeyPress [Enter] (L147) → retrieve()
[E3] relatedLawSearchText.KeyPress [Enter] (L158) → retrieve()
[E4] retrieveButton[조회].Select (L166) → retrieve()
[E5] messageBox.DialogHide (L236) → deleteSelectedRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L193-204 | E1 | 상태 처리 | 업무 |
| public retrieve() | L206-231 | E2,E3,E4,settings | 서비스 ics.Ics20_RevisionHistory.selectByDate(startDate, closeDate, financeAgencyCode, searchText, relatedLawSearchText, dateType, dateType) | 업무 |
| public deleteRow() | L233-246 | 공개 메서드 | 확인창 표시 | 업무 |
| private deleteSelectedRow() | L248-259 | E5 | GridDeleteData ics.Ics20_RevisionHistory.delete(체크된 행 목록) | 업무 |
| private settings() | L119-172 | 생성자 | 이벤트 연결, 초기값: radioReg=true("등록일"), radioEffect=false("시행일"), startDate=calcDate, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L174-191 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L261-263 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L265-267 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L178
  gb.date('submissionDate', 90, '의견제출일'),  // L180
  gb.date('effectDate', 90, '시행일'),  // L181
  gb.text('title', 470, '법규명'),  // L182
  gb.text('relatedLaw', 470, '조문'),  // L183
  gb.text('financeAgencyNm', 100, '소관부처'),  // L185
  gb.date('reflectionDate', 90, '법규반영일'),  // L186
  gb.longCenter('icsCount', 60, '연결법규'),  // L187
  gb.longCenter('fileCount', 60, '첨부파일'),  // L188
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Ics20_Edit_RevisionHistory (`client/vi/ics/Ics20_Edit_RevisionHistory.java`, 189줄)

- 툴바 `toolBar`: {anchor}
- 입력·하위 화면: `financeAgencyCode` TextField, `financeAgencyName` ComboBoxField("FinanceAgencyCode"), `title` MyTextArea, `relatedLaw` MyTextArea, `note` MyTextArea, `regDate` MyDateField, `effectDate` MyDateField, `beforeNoticeDate` MyDateField, `submissionDate` MyDateField, `reflectionDate` MyDateField, `lookupContent` Ics20_Lookup_Content

#### 이벤트
[E0] 화면 열림 (생성자 L64-84) → getEditor(), show()
[E1] anchor.MouseDown (L93) → 인라인 L93-106 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L86-158 | 생성자 | 조회창 Ics20_Lookup_Content 열기 | 업무 |
| public retrieve() | L160-175 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L177-179 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L182-184 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L186-188 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

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

