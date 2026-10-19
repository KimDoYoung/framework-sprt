# Rpt01_Tab_DailyWrite

- 종류: 화면
- 메뉴: 커뮤니티 > 04. 업무보고 > 일일업무 입력 (#1236)
- 파일: `client/vi/rpt/Rpt01_Tab_DailyWrite.java`
- 함께 쓰는 클래스 1개:
  - `Rpt01_Edit_DailyWrite` `client/vi/rpt/Rpt01_Edit_DailyWrite.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `rpt.Rpt01_Daily.delete` | Rpt01_Tab_DailyWrite:215 | [`Rpt01_Daily.java:105`](../../rpt/services/Rpt01_Daily.md) | `UpdateDataModel(rpt01_daily)` 동적 DELETE |
| `rpt.Rpt01_Daily.modelUpdate` | Rpt01_Edit_DailyWrite:145 | [`Rpt01_Daily.java:54`](../../rpt/services/Rpt01_Daily.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(rpt01_daily)` 동적 INSERT/UPDATE → [`rpt01_daily.selectById`](../../rpt/sql/rpt01_daily.md) |
| `rpt.Rpt01_Daily.selectByText` | Rpt01_Tab_DailyWrite:184 | [`Rpt01_Daily.java:26`](../../rpt/services/Rpt01_Daily.md) | [`rpt01_daily.selectByText`](../../rpt/sql/rpt01_daily.md) |

## 테이블

[`rpt01_daily`](../../../db/tables/rpt.md)

## DB 함수

`f_emp_kor_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Rpt01_Tab_DailyWrite (`client/vi/rpt/Rpt01_Tab_DailyWrite.java`, 223줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="업무내용/비고", `startDate` MyDateField, `closeDate` MyDateField, `lookup` Rpt01_Edit_DailyWrite
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - content 610 "업무내용(공개)" TextLimitArea
  - note 550 "비고(비공개)" TextLimitArea
  - actionCell 80 "수정" Cell 편집:editCell
  - confirmYnName 80 "확인여부" TextCenter
  - confirmName 100 "확인자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L54-84) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L101) → retrieve()
[E2] retrieveButton[조회].Select (L109) → retrieve()
[E3] insertButton[등록].Select (L115) → insertRow()
[E4] deleteButton[삭제].Select [YES] (L121) → deleteRow()
[E5] msgBox.DialogHide [YES] (L126) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L176-191 | 생성자,E1,E2,buildGrid,insertRow | 서비스 rpt.Rpt01_Daily.selectByText(companyId, personId, startDate, closeDate, searchText) | 업무 |
| public insertRow() | L193-201 | E3 | 팝업 Rpt01_Edit_DailyWrite 열기 | 업무 |
| public deleteRow() | L203-218 | E4,E5 | GridDeleteData rpt.Rpt01_Daily.delete(체크된 행 목록) | 업무 |
| private settings() | L86-144 | 생성자 | 확인창 표시, 이벤트 연결, 초기값: startDate=start, closeDate=close | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L146-174 | 필드 초기화 | 팝업 Rpt01_Edit_DailyWrite 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L220-222 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L166
  // ⚠ 대응 없음 (GridBuilder L167) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L168) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L169) addCell
  gb.textCenter('confirmYnNm', 80, '확인여부'),  // L170 SQL 계산 컬럼(selectByText: CASE WHEN COALESCE(rpt01_confirm_yn,'fa…)
  gb.textCenter('confirmNm', 100, '확인자'),  // L171 SQL 계산 컬럼(selectByText: f_emp_kor_nm(rpt01_confirmer_id))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Rpt01_Edit_DailyWrite (`client/vi/rpt/Rpt01_Edit_DailyWrite.java`, 176줄)

- 입력·하위 화면: `date` MyDateField, `content` MyTextArea, `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L78-114) → settings(), show()
[E1] updateButton[저장].Select (L118) → update()
[E2] closeButton[닫기].Select (L124) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L48-56 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L58-75 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L133-166 | E1 | 서비스 rpt.Rpt01_Daily.modelUpdate | 업무 |
| private settings() | L117-131 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L169-171 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L173-175 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

