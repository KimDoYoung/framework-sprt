# Rpt10_Tab_FssSubmit

- 종류: 화면
- 메뉴: 기초자료 > 30. 자산&경영 > 금감원 업무보고서 (#1292)
- 파일: `client/vi/rpt/Rpt10_Tab_FssSubmit.java`
- 함께 쓰는 클래스 1개:
  - `Rpt10_Edit_WriteGuide` `client/vi/rpt/Rpt10_Edit_WriteGuide.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `rpt.Rpt10_FssSubmit.delete` | Rpt10_Tab_FssSubmit:188 | [`Rpt10_FssSubmit.java:59`](../../rpt/services/Rpt10_FssSubmit.md) | `UpdateDataModel(rpt10_fss_submit)` 동적 DELETE |
| `rpt.Rpt10_FssSubmit.modelUpdate` | Rpt10_Edit_WriteGuide:167 | [`Rpt10_FssSubmit.java:41`](../../rpt/services/Rpt10_FssSubmit.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(rpt10_fss_submit)` 동적 INSERT/UPDATE → [`rpt10_fss_submit.selectById`](../../rpt/sql/rpt10_fss_submit.md) |
| `rpt.Rpt10_FssSubmit.selectBySearchText` | Rpt10_Tab_FssSubmit:161 | [`Rpt10_FssSubmit.java:23`](../../rpt/services/Rpt10_FssSubmit.md) | [`rpt10_fss_submit.selectBySearchText`](../../rpt/sql/rpt10_fss_submit.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Rpt10_Edit_WriteGuide:127 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`rpt10_fss_submit`](../../../db/tables/rpt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Rpt10_Tab_FssSubmit (`client/vi/rpt/Rpt10_Tab_FssSubmit.java`, 194줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="보고서코드", `lookup` Rpt10_Edit_WriteGuide
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - reportCode 100 "보고서코드" TextCenter
  - reportName 180 "보고서명" Text
  - submitCycleName 100 "제출주기" TextCenter
  - writeTarget 220 "작성대상" Text
  - writeGuide 500 "작성요령" TextLimitArea
  - reviseHistory 400 "개정연혁" TextLimitArea
  - actionCell 80 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L48-73) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L79) → retrieve()
[E2] retrieveButton[조회].Select (L87) → retrieve()
[E3] insertButton[등록].Select (L93) → insertRow()
[E4] deleteButton[삭제].Select [YES] (L99) → deleteRow()
[E5] msgBox.DialogHide [YES] (L104) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L155-168 | 생성자,E1,E2,buildGrid,insertRow | 서비스 rpt.Rpt10_FssSubmit.selectBySearchText(companyId, personId, searchText) | 업무 |
| public insertRow() | L170-178 | E3 | 팝업 Rpt10_Edit_WriteGuide 열기 | 업무 |
| public deleteRow() | L180-189 | E4,E5 | GridDeleteData rpt.Rpt10_FssSubmit.delete(체크된 행 목록) | 업무 |
| private settings() | L75-122 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L124-153 | 필드 초기화 | 팝업 Rpt10_Edit_WriteGuide 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L191-193 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('reportCd', 100, '보고서코드'),  // L144
  gb.text('reportNm', 180, '보고서명'),  // L145
  gb.textCenter('submitCycleNm', 100, '제출주기'),  // L146 SQL 계산 컬럼(selectBySearchText: f_cdnm('CycleCode', rpt10_submit_cycle_…)
  gb.text('writeTarget', 220, '작성대상'),  // L147
  // ⚠ 대응 없음 (GridBuilder L148) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L149) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L150) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Rpt10_Edit_WriteGuide (`client/vi/rpt/Rpt10_Edit_WriteGuide.java`, 189줄)

- 입력·하위 화면: `submitCycleCode` TextField, `reportCode` TextField, `reportName` TextField, `writeTarget` TextField, `writeGuide` MyTextArea, `reviseHistory` MyTextArea, `submitCycleName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode")

#### 이벤트
[E1] submitCycleName[제출주기].Collapse (L128) → 인라인 L128-133 (new CollapseHandler() { @Override pub…)
[E2] updateButton[저장].Select (L135) → update()
[E3] closeButton[닫기].Select (L141) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L57-66 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L68-77 | 공개 메서드 | 상태 처리 | 업무 |
| public getEditor() | L79-117 | settings | 상태 처리 | 업무 |
| private update() | L155-180 | E2 | 서비스 rpt.Rpt10_FssSubmit.modelUpdate | 업무 |
| private settings() | L119-153 | view,edit | 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: submitCycleCode=submitCycleName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L182-184 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L186-188 | view,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

