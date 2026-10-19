# Ics20_Tab_RevisionHistoryAdmin

- 종류: 화면
- 메뉴: 기초자료 > 00. 내부통제 > 법규개정내역 등록 (#1257)
- 파일: `client/vi/ics/Ics20_Tab_RevisionHistoryAdmin.java`
- 함께 쓰는 클래스 2개:
  - `Ics20_Edit_RevisionHistoryAdmin` `client/vi/ics/Ics20_Edit_RevisionHistoryAdmin.java`
  - `Ics20_Lookup_Content` `client/vi/ics/Ics20_Lookup_Content.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics19_RevisionRelateIcs.delete` | Ics20_Edit_RevisionHistoryAdmin:410 | [`Ics19_RevisionRelateIcs.java:32`](../../ics/services/Ics19_RevisionRelateIcs.md) | `UpdateDataModel(ics19_revision_relate_ics)` 동적 DELETE |
| `ics.Ics19_RevisionRelateIcs.update` | Ics20_Edit_RevisionHistoryAdmin:317 | [`Ics19_RevisionRelateIcs.java:27`](../../ics/services/Ics19_RevisionRelateIcs.md) | `UpdateDataModel(ics19_revision_relate_ics)` 동적 INSERT/UPDATE → [`ics19_revision_relate_ics.selectById`](../../ics/sql/ics19_revision_relate_ics.md) |
| `ics.Ics20_RevisionHistory.delete` | Ics20_Edit_RevisionHistoryAdmin:342, Ics20_Tab_RevisionHistoryAdmin:265 | [`Ics20_RevisionHistory.java:76`](../../ics/services/Ics20_RevisionHistory.md) | `UpdateDataModel(ics20_revision_history)` 동적 DELETE |
| `ics.Ics20_RevisionHistory.selectByDate` | Ics20_Tab_RevisionHistoryAdmin:235 | [`Ics20_RevisionHistory.java:26`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.selectByDate`](../../ics/sql/ics20_revision_history.md) |
| `ics.Ics20_RevisionHistory.update` | Ics20_Edit_RevisionHistoryAdmin:308 | [`Ics20_RevisionHistory.java:71`](../../ics/services/Ics20_RevisionHistory.md) | `UpdateDataModel(ics20_revision_history)` 동적 INSERT/UPDATE → [`ics20_revision_history.selectById`](../../ics/sql/ics20_revision_history.md) |
| `ics.Ics20_RevisionHistory.updateContent` | Ics20_Lookup_Content:85 | [`Ics20_RevisionHistory.java:60`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.updateContent`](../../ics/sql/ics20_revision_history.md) |

## 테이블

[`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics20_Tab_RevisionHistoryAdmin (`client/vi/ics/Ics20_Tab_RevisionHistoryAdmin.java`, 282줄)

- 레이아웃: center=vlc, south=editPage
- 툴바 `buttonBar`: {radioReg} {radioEffect} {startDate} ~: {closeDate} 소관부처: {financeAgencyComboBox} 통합검색: {searchText} 조문검색: {relatedLawSearchText} {retrieveButton} {insertButton}
- 입력·하위 화면: `searchText` TextField 빈칸="소관부처/법규명/비고", `relatedLawSearchText` TextField 빈칸="관련조문", `radioReg` Radio, `radioEffect` Radio, `startDate` MyDateField, `closeDate` MyDateField, `editPage` Ics20_Edit_RevisionHistoryAdmin, `financeAgencyComboBox` ComboBoxField("FinanceAgencyCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 90 "등록일" Date
  - submissionDate 90 "의견제출일" Date
  - effectDate 90 "시행일" Date
  - reflectionDate 90 "법규반영일" Date
  - financeAgencyName 100 "소관부처" Text
  - title 470 "법규명" Text
  - relatedLaw 470 "조문" Text
  - icsCount 60 "연결법규" LongCenter
  - fileCount 60 "첨부파일" LongCenter

#### 이벤트
[E0] 화면 열림 (생성자 L70-120) → settings()
[E1] grid.SelectionChanged [선택>0] (L112) → retrieveEditPage()
[E2] searchText.KeyPress [Enter] (L150) → retrieve()
[E3] relatedLawSearchText.KeyPress [Enter] (L160) → retrieve()
[E4] insertButton[등록].Select (L168) → insertRow()
[E5] retrieveButton[조회].Select (L174) → retrieve()
[E6] messageBox.DialogHide (L250) → deleteSelectedRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L200-211 | E1 | 상태 처리 | 업무 |
| public insertRow() | L213-218 | E4 | 상태 처리 | 업무 |
| public retrieve() | L220-245 | E2,E3,E5,settings | 서비스 ics.Ics20_RevisionHistory.selectByDate(startDate, closeDate, financeAgencyCode, searchText, relatedLawSearchText, dateType, dateType) | 업무 |
| public deleteRow() | L247-260 | 공개 메서드 | 확인창 표시 | 업무 |
| private deleteSelectedRow() | L262-273 | E6 | GridDeleteData ics.Ics20_RevisionHistory.delete(체크된 행 목록) | 업무 |
| private settings() | L122-180 | 생성자 | 이벤트 연결, 초기값: radioReg=true("등록일"), radioEffect=false("시행일"), startDate=calcDate, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L182-198 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L275-277 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L279-281 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L185
  gb.date('submissionDate', 90, '의견제출일'),  // L187
  gb.date('effectDate', 90, '시행일'),  // L188
  gb.date('reflectionDate', 90, '법규반영일'),  // L189
  gb.text('financeAgencyNm', 100, '소관부처'),  // L190
  gb.text('title', 470, '법규명'),  // L191
  gb.text('relatedLaw', 470, '조문'),  // L192
  gb.longCenter('icsCount', 60, '연결법규'),  // L194
  gb.longCenter('fileCount', 60, '첨부파일'),  // L195
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>

### Ics20_Edit_RevisionHistoryAdmin (`client/vi/ics/Ics20_Edit_RevisionHistoryAdmin.java`, 447줄)

- 툴바 `toolBar`: {anchor}
- 입력·하위 화면: `financeAgencyCode` TextField, `financeAgencyName` ComboBoxField("FinanceAgencyCode"), `title` MyTextArea, `relatedLaw` MyTextArea, `note` MyTextArea, `regDate` MyDateField, `effectDate` MyDateField, `beforeNoticeDate` MyDateField, `submissionDate` MyDateField, `reflectionDate` MyDateField, `lookupContent` Ics20_Lookup_Content, `lookup` Ics01_Lookup_SelectMulti

#### 이벤트
[E0] 화면 열림 (생성자 L103-166) → settings(), getEditor(), show()
[E1] fileUpload.Change (L114) → 인라인 L114-123 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L126) → resetFileUpload()
[E3] uploadFileButton[파일등록].Select (L169) → 인라인 L169-174 (new SelectHandler() { @Override publi…)
[E4] updateButton[저장].Select (L175) → updateRow()
[E5] deleteButton[삭제].Select (L181) → deleteRow()
       └ [E9] messageBox.DialogHide [YES] (L326) → delete()
[E6] icsInsertButton[행 추가].Select (L187) → icsInsertRow()
[E7] icsDeleteButton[행 삭제].Select (L193) → icsDeleteRow()
       └ [E10] messageBox.DialogHide [YES] (L405) → 서비스 ics.Ics19_RevisionRelateIcs.delete
[E8] anchor.MouseDown (L209) → 인라인 L209-222 (new MouseDownHandler() { @Override pu…)
[E11] fileUpload.Change (L429) → 인라인 L429-436 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L202-287 | 생성자 | 조회창 Ics20_Lookup_Content 열기 | 업무 |
| public retrieve() | L289-304 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L306-321 | E4 | 서비스 ics.Ics20_RevisionHistory.update, ics.Ics19_RevisionRelateIcs.update | 업무 |
| public deleteRow() | L323-335 | E5 | ConfirmBox → E9 | 업무 |
| private delete() | L337-361 | E9 | 서비스 ics.Ics20_RevisionHistory.delete | 업무 |
| public icsInsertRow() | L363-394 | E6 | 조회창 Ics01_Lookup_SelectMulti 열기, 미선택 시 alert "상단 법규를 선택하셔야합니다." | 업무 |
| public icsDeleteRow() | L396-416 | E7 | ConfirmBox → E10 | 업무 |
| public init() | L418-420 | delete | 상태 처리 | 업무 |
| private resetFileUpload() | L422-437 | E2 | 상태 처리 | 업무 |
| public getServiceResult() | L440-442 | delete | 상태 처리 | 업무 |
| private settings() | L168-200 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L444-446 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L169-174 (new SelectHandler() { @Override publi…) */}>파일등록</Button>
4. <Button type="addRow" onClick={icsInsertRow}>행 추가</Button>
5. <Button type="removeRow" onClick={icsDeleteRow}>행 삭제</Button>

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

