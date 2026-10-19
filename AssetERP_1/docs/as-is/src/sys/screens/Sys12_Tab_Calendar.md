# Sys12_Tab_Calendar

- 종류: 화면
- 메뉴: 관리자 > 09. 기타 > 일자관리 (#1080)
- 메뉴: 기초자료 > 90. 기타 > 일자관리 (#1113)
- 파일: `client/vi/sys/Sys12_Tab_Calendar.java`
- 함께 쓰는 클래스 2개:
  - `Sys14_Lookup_Holiday` `client/vi/sys/Sys14_Lookup_Holiday.java`
  - `Sys12_Lookup_Customer` `client/vi/sys/Sys12_Lookup_Customer.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys12_Calendar.insertAuto` | Sys12_Tab_Calendar:177 | [`Sys12_Calendar.java:87`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.deleteByDay`](../../sys/sql/sys12_calendar.md), [`sys12_calendar.insertAuto`](../../sys/sql/sys12_calendar.md) |
| `sys.Sys12_Calendar.selectByDay` | Sys12_Lookup_Customer:162 | [`Sys12_Calendar.java:31`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.selectByDay`](../../sys/sql/sys12_calendar.md) |
| `sys.Sys12_Calendar.selectByYear` | Sys12_Tab_Calendar:212 | [`Sys12_Calendar.java:36`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.selectByYear`](../../sys/sql/sys12_calendar.md) |
| `sys.Sys12_Calendar.update` | Sys12_Lookup_Customer:172, Sys12_Tab_Calendar:223 | [`Sys12_Calendar.java:77`](../../sys/services/Sys12_Calendar.md) | `UpdateDataModel(sys12_calendar)` 동적 INSERT/UPDATE → [`sys12_calendar.selectById`](../../sys/sql/sys12_calendar.md) |
| `sys.Sys12_Calendar.updateList` | Sys12_Lookup_Customer:116 | [`Sys12_Calendar.java:72`](../../sys/services/Sys12_Calendar.md) | `UpdateDataModel(sys12_calendar)` 동적 INSERT/UPDATE → [`sys12_calendar.selectById`](../../sys/sql/sys12_calendar.md) |
| `sys.Sys14_Holiday.delete` | Sys14_Lookup_Holiday:259 | [`Sys14_Holiday.java:75`](../../sys/services/Sys14_Holiday.md) | `UpdateDataModel(sys14_holiday)` 동적 DELETE |
| `sys.Sys14_Holiday.insertInitData` | Sys14_Lookup_Holiday:200 | [`Sys14_Holiday.java:54`](../../sys/services/Sys14_Holiday.md) | [`sys14_holiday.deleteByDay`](../../sys/sql/sys14_holiday.md), [`sys14_holiday.insertInitData`](../../sys/sql/sys14_holiday.md) |
| `sys.Sys14_Holiday.selectByYear` | Sys14_Lookup_Holiday:225 | [`Sys14_Holiday.java:29`](../../sys/services/Sys14_Holiday.md) | [`sys14_holiday.selectByYear`](../../sys/sql/sys14_holiday.md) |
| `sys.Sys14_Holiday.update` | Sys14_Lookup_Holiday:242 | [`Sys14_Holiday.java:70`](../../sys/services/Sys14_Holiday.md) | `UpdateDataModel(sys14_holiday)` 동적 INSERT/UPDATE → [`sys14_holiday.selectById`](../../sys/sql/sys14_holiday.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys14_holiday`](../../../db/tables/sys.md)

## DB 함수

`f_create_seq`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys12_Tab_Calendar (`client/vi/sys/Sys12_Tab_Calendar.java`, 239줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 년도: {yearField} 월: {monthComboBox} {retrieveButton} {updateButton} {insertButton} {holidayButton} {customerButton}
- 입력·하위 화면: `yearField` TextField, `monthComboBox` ComboBoxField("MonthsCode", "%", "전체"), `lookup` Sys12_Lookup_Customer, `lookupHoliday` Sys14_Lookup_Holiday
- 그리드 `grid` (buildGrid(), 체크박스):
  - day 100 "일자" Date
  - weekday 100 "요일" Text
  - workingYnFlag 70 "영업일" Boolean
  - offReason 500 "휴일사유" Text 편집:TextField
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L55-85) → settings(), retrieve()
[E1] yearField.KeyPress [Enter] (L90) → retrieve()
[E2] monthComboBox[MonthsCode].Collapse (L100) → retrieve()
[E3] retrieveButton[조회].Select (L107) → retrieve()
[E4] updateButton[저장].Select (L113) → update()
[E5] insertButton[생성].Select [YES] (L119) → insertAuto()
[E6] msgBox.DialogHide [YES] (L124) → insertAuto()
[E7] holidayButton[휴일관리].Select (L142) → lookupHoliday()
[E8] customerButton[고객사반영].Select (L148) → 메시지 "반영할 일자를 선택해주세요"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertAuto() | L174-197 | E5,E6 | 서비스 sys.Sys12_Calendar.insertAuto(companyId, year, month) | 업무 |
| private lookupHoliday() | L199-202 | E7 | 조회창 Sys14_Lookup_Holiday 열기 | 업무 |
| public retrieve() | L205-218 | 생성자,E1,E2,E3,insertAuto | 서비스 sys.Sys12_Calendar.selectByYear(companyId, year, month) | 업무 |
| public update() | L221-224 | E4 | 서비스 sys.Sys12_Calendar.update | 업무 |
| public insertRow() | L227-229 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L232-234 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L87-160 | 생성자 | 조회창 Sys12_Lookup_Customer 열기, 확인창 표시, 이벤트 연결, 초기값: yearField=LoginUser.getYear(, monthComboBox="전체"("MonthsCode") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L162-172 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L236-238 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('day', 100, '일자'),  // L166
  gb.text('weekday', 100, '요일'),  // L167
  // ⚠DB없음 L168 workingYnFlag 70 "영업일" (sys12_working_yn_flag 컬럼 없음)
  gb.text('offReason', 500, '휴일사유', { editor: 'text' }),  // L169
  gb.text('note', 500, '비고', { editor: 'text' }),  // L170
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="generate" onClick={insertAuto}>생성</Button>
4. <Button type="register" onClick={lookupHoliday}>휴일관리</Button>
5. <Button type="save" onClick={() => /* 메시지 "반영할 일자를 선택해주세요" */}>고객사반영</Button>

### Sys14_Lookup_Holiday (`client/vi/sys/Sys14_Lookup_Holiday.java`, 280줄)

- 레이아웃: center=grid
- 툴바 `buttonBar`: 조회연도: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {companyField} {dataButton}
- 입력·하위 화면: `searchText` TextField 빈칸="연도입력", `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - day 100 "일자" Date 편집:MyDateField
  - holidayName 180 "휴일명" Text 편집:TextField
  - note 250 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L76-179) → show()
[E1] searchText.KeyPress [Enter] (L87) → retrieve()
[E2] retrieveButton[조회].Select (L96) → retrieve()
[E3] insertButton[등록].Select (L102) → insertRow()
[E4] updateButton[저장].Select (L108) → update()
[E5] deleteButton[삭제].Select (L114) → deleteRow()
       └ [E9] msgBox.DialogHide [YES] (L252) → 서비스 sys.Sys14_Holiday.delete
[E6] cancelButton[닫기].Select (L120) → hide()
[E7] companyField.TriggerClick [result != null] (L129) → 인라인 L129-144 (new TriggerClickHandler() { @Override…)
[E8] dataButton[기초데이터생성].Select (L145) → initData()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L72-74 | 공개 메서드 | 상태 처리 | 업무 |
| private initData() | L194-215 | E8 | 서비스 sys.Sys14_Holiday.insertInitData(companyId) | 업무 |
| public retrieve() | L217-231 | E1,E2,open | 서비스 sys.Sys14_Holiday.selectByYear(companyId, year) | 업무 |
| private insertRow() | L233-238 | E3 | 상태 처리 | 업무 |
| private update() | L240-247 | E4 | 서비스 sys.Sys14_Holiday.update | 업무 |
| private deleteRow() | L249-270 | E5 | ConfirmBox → E9 | 업무 |
| private buildGrid() | L181-192 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L272-274 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L276-278 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('day', 100, '일자', { editor: 'date' }),  // L187
  gb.text('holidayNm', 180, '휴일명', { editor: 'text' }),  // L188
  gb.text('note', 250, '비고', { editor: 'text' }),  // L189
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={initData}>기초데이터생성</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys12_Lookup_Customer (`client/vi/sys/Sys12_Lookup_Customer.java`, 178줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton} {copyButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 200 "고객사" Text
  - day 100 "일자" Date
  - weekday 100 "요일" Text
  - workingYnFlag 70 "영업일" Boolean
  - offReason 420 "휴일사유" Text 편집:TextField

#### 이벤트
[E1] retrieveButton[조회].Select (L81) → retrieve()
[E2] updateButton[저장].Select (L87) → update()
[E3] copyButton[Admin(관리자)정보로 고객사 변경].Select [YES] (L93) → retrieve()
[E4] msgBox.DialogHide [YES] (L103) → retrieve()
[E5] cancelButton[닫기].Select (L139) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-78 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L159-168 | E1,E3,E4,open | 서비스 sys.Sys12_Calendar.selectByDay(stdDate) | 업무 |
| private update() | L170-173 | E2 | 서비스 sys.Sys12_Calendar.update | 업무 |
| private settings() | L80-145 | open | 확인창 표시, 서비스 sys.Sys12_Calendar.updateList, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L147-157 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L175-177 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '고객사'),  // L151 SQL 계산 컬럼(selectByDay: sys01_company_nm)
  gb.date('day', 100, '일자'),  // L152
  gb.text('weekday', 100, '요일'),  // L153
  // ⚠DB없음 L154 workingYnFlag 70 "영업일" (sys12_working_yn_flag 컬럼 없음)
  gb.text('offReason', 420, '휴일사유', { editor: 'text' }),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="save" onClick={retrieve}>Admin(관리자)정보로 고객사 변경</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

