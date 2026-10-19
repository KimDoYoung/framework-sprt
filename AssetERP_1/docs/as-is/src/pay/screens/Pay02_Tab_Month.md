# Pay02_Tab_Month

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리(Old) > 급여관리(old) (#1083)
- 파일: `client/vi/pay/Pay02_Tab_Month.java`
- 함께 쓰는 클래스 4개:
  - `Pay02_Lookup_Work` `client/vi/pay/Pay02_Lookup_Work.java`
  - `Pay02_Lookup_Unsettled` `client/vi/pay/Pay02_Lookup_Unsettled.java`
  - `Pay02_Lookup_Insert` `client/vi/pay/Pay02_Lookup_Insert.java`
  - `Pay02_Lookup_GroupList` `client/vi/pay/Pay02_Lookup_GroupList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp01_Lookup_TransDate`](../../emp/components/Emp01_Lookup_TransDate.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay02_Month.calculate` | Pay02_Tab_Month:277 | [`Pay02_Month.java:116`](../../pay/services/Pay02_Month.md) | [`pay02_month.selectByCompanyId`](../../pay/sql/pay02_month.md), [`pay02_month.updateRealPay`](../../pay/sql/pay02_month.md) |
| `pay.Pay02_Month.calculateByPersonId` | Pay02_Lookup_Work:158 | [`Pay02_Month.java:163`](../../pay/services/Pay02_Month.md) | [`pay02_month.selectByCompanyId`](../../pay/sql/pay02_month.md), [`pay02_month.updateRealPay`](../../pay/sql/pay02_month.md) |
| `pay.Pay02_Month.checkAppr` | Pay02_Lookup_Insert:159, Pay02_Tab_Month:246 | [`Pay02_Month.java:351`](../../pay/services/Pay02_Month.md) | [`pay05_relate_appr.checkAppr`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay02_Month.delete` | Pay02_Tab_Month:326 | [`Pay02_Month.java:372`](../../pay/services/Pay02_Month.md) | `UpdateDataModel(pay02_month)` 동적 DELETE |
| `pay.Pay02_Month.insert` | Pay02_Lookup_Insert:195 | [`Pay02_Month.java:212`](../../pay/services/Pay02_Month.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay01_annual.selectByApprStatus`](../../pay/sql/pay01_annual.md), [`pay02_month.insert`](../../pay/sql/pay02_month.md), [`pay02_month.selectByLatestInfo`](../../pay/sql/pay02_month.md), [`pay02_month.selectByPayDatePersonId`](../../pay/sql/pay02_month.md), [`sys12_calendar.workDay`](../../sys/sql/sys12_calendar.md) |
| `pay.Pay02_Month.selectByCompanyId` | Pay02_Tab_Month:237 | [`Pay02_Month.java:34`](../../pay/services/Pay02_Month.md) | [`pay02_month.selectByCompanyId`](../../pay/sql/pay02_month.md) |
| `pay.Pay02_Month.selectByYear` | Pay02_Lookup_GroupList:139 | [`Pay02_Month.java:67`](../../pay/services/Pay02_Month.md) | [`pay02_month.selectByYear`](../../pay/sql/pay02_month.md) |
| `pay.Pay02_Month.update` | Pay02_Lookup_Unsettled:127, Pay02_Lookup_Work:155, Pay02_Tab_Month:272 | [`Pay02_Month.java:367`](../../pay/services/Pay02_Month.md) | `UpdateDataModel(pay02_month)` 동적 INSERT/UPDATE → [`pay02_month.selectById`](../../pay/sql/pay02_month.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay02_month`](../../../db/tables/pay.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`sys12_calendar`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay02_Tab_Month (`client/vi/pay/Pay02_Tab_Month.java`, 350줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 해당 연도: {yearText} 구분: {payGroupName} {retrieveButton} {updateButton} {deleteButton} {insertButton}
- 입력·하위 화면: `yearText` TextField, `payDate` MyDateField, `payGroupName` LookupTriggerField 빈칸="구분을 선택해주세요", `lookupWork` Pay02_Lookup_Work, `lookupInsert` Pay02_Lookup_Insert, `lookupGroupList` Pay02_Lookup_GroupList
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - personNo 50 "사번" TextCenter
  - personName 80 "사원명" TextCenter
  - posName 50 "직급" TextCenter
  - basicPay 100 "기본급여" Long 편집:"456EA6"
  - bonusPay 100 "성과급여" Long 편집:"456EA6"
  - mealPay 100 "식대" Long 편집:"456EA6"
  - carMt 100 "차량유지비" Long 편집:"456EA6"
  - etc01Pay 100 "기타급여1" Long 편집:"456EA6"
  - incomeTax 100 "소득세" Long 편집:"DD5E5E"
  - residentTax 100 "주민세" Long 편집:"DD5E5E"
  - npDdc 100 "국민연금" Long 편집:"DD5E5E"
  - hiDdc 100 "건강보험" Long 편집:"DD5E5E"
  - ltDdc 100 "장기요양" Long 편집:"DD5E5E"
  - eiDdc 100 "고용보험" Long 편집:"DD5E5E"
  - yearEndTax 100 "연말정산" Long 편집:"DD5E5E"
  - others01Ddc 100 "기타공제1" Long 편집:"DD5E5E"
  - others02Ddc 100 "기타공제2" Long 편집:"DD5E5E"
  - actionCell 80 "근로시간" Cell 편집:actionCell
  - actionCell 80 "전년도<br>미정산보험료" Cell 편집:actionCell2

#### 이벤트
[E0] 화면 열림 (생성자 L126-140) → eventSetting()
[E1] payGroupName.TriggerClick (L89) → lookupPayGroup()
[E2] retrieveButton[조회].Select (L100) → retrieve()
[E3] updateButton[저장].Select (L106) → checkAppr()
[E4] deleteButton[삭제].Select (L112) → checkAppr()
[E5] insertButton[생성].Select (L118) → insert()
[E6] msgBox.DialogHide [YES] (L306) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package isNumberic() | L66-73 | 미사용 후보 | 상태 처리 | 업무 |
| private eventSetting() | L74-124 | 생성자 | 상태 처리 | 업무 |
| public insert() | L212-222 | E5 | 조회창 Pay02_Lookup_Insert 열기 → 콜백: unmask | 업무 |
| public retrieve() | L224-243 | E2 | 서비스 pay.Pay02_Month.selectByCompanyId(companyId, payCode, payDate) | 업무 |
| public checkAppr() | L245-268 | E3,E4 | 서비스 pay.Pay02_Month.checkAppr(companyId, payCode, payDate) | 업무 |
| public update() | L270-291 | buildGrid,checkAppr | 서비스 pay.Pay02_Month.update, pay.Pay02_Month.calculate(companyId, payCode, payDate) | 업무 |
| public deleteCheck() | L293-321 | checkAppr | 확인창 표시 | 업무 |
| public delete() | L323-327 | E6 | GridDeleteData pay.Pay02_Month.delete(체크된 행 목록) | 업무 |
| public lookupPayGroup() | L329-340 | E1 | 조회창 Pay02_Lookup_GroupList 열기 | 업무 |
| private buildGrid() | L142-210 | 필드 초기화 | 조회창 Pay02_Lookup_Work 열기, 조회창 Pay02_Lookup_Unsettled 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L342-345 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L347-349 | eventSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L182 newHeaderGroupMap01newHeaderGroupConfig14 100 "사원" (pay02_new_header_group_map01new_header_group_config14 컬럼 없음)
  // ⚠DB없음 L183 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle15 100 "지급액(월)" (pay02_new_header_group_map05new_header_group_configset_html_grid_style15 컬럼 없음)
  // ⚠DB없음 L184 newHeaderGroupMap010newHeaderGroupConfigsetHtmlGridStyle19 100 "공제액(월)" (pay02_new_header_group_map010new_header_group_configset_html_grid_style19 컬럼 없음)
  gb.textCenter('personNo', 50, '사번'),  // L186 SQL 계산 컬럼(selectByCompanyId: emp01_emp_no)
  gb.textCenter('personNm', 80, '사원명'),  // L187 SQL 계산 컬럼(selectByCompanyId: f_emp_kor_nm(pay02_person_id))
  gb.textCenter('posNm', 50, '직급'),  // L188 SQL 계산 컬럼(selectByCompanyId: f_cdnm('EmpPosCode', emp03_pos_cd, emp0…)
  gb.long('basicPay', 100, '기본급여', { editor: 'number' }),  // L190
  gb.long('bonusPay', 100, '성과급여', { editor: 'number' }),  // L191
  gb.long('mealPay', 100, '식대', { editor: 'number' }),  // L192
  gb.long('carMt', 100, '차량유지비', { editor: 'number' }),  // L193
  gb.long('etc01Pay', 100, '기타급여1', { editor: 'number' }),  // L194
  gb.long('incomeTax', 100, '소득세', { editor: 'number' }),  // L196
  gb.long('residentTax', 100, '주민세', { editor: 'number' }),  // L197
  gb.long('npDdc', 100, '국민연금', { editor: 'number' }),  // L198
  gb.long('hiDdc', 100, '건강보험', { editor: 'number' }),  // L199
  gb.long('ltDdc', 100, '장기요양', { editor: 'number' }),  // L200
  gb.long('eiDdc', 100, '고용보험', { editor: 'number' }),  // L201
  gb.long('yearEndTax', 100, '연말정산', { editor: 'number' }),  // L202
  gb.long('others01Ddc', 100, '기타공제1', { editor: 'number' }),  // L203
  gb.long('others02Ddc', 100, '기타공제2', { editor: 'number' }),  // L204
  // ⚠ 대응 없음 (GridBuilder L206) addCell
  // ⚠ 대응 없음 (GridBuilder L207) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={checkAppr}>저장</Button>
3. <Button type="delete" onClick={checkAppr}>삭제</Button>
4. <Button type="generate" onClick={insert}>생성</Button>

### Pay02_Lookup_Work (`client/vi/pay/Pay02_Lookup_Work.java`, 184줄)

- 입력·하위 화면: `personName` TextField, `workDay` DoubleField, `totalWorkTime` DoubleField, `extendWorkTime` DoubleField, `nightWorkTime` DoubleField, `holidayWorkTime` DoubleField, `extendPay` LongField, `nightPay` LongField, `holidayPay` LongField

#### 이벤트
[E1] updateButton[저장].Select (L129) → update()
[E2] closeButton[닫기].Select (L135) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L70-146 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L148-175 | E1 | 서비스 pay.Pay02_Month.update, pay.Pay02_Month.calculateByPersonId(companyId, payCode, payDate, personId) | 업무 |
| private setHtmlStyle() | L177-179 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L181-183 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay02_Lookup_Unsettled (`client/vi/pay/Pay02_Lookup_Unsettled.java`, 144줄)

- 입력·하위 화면: `personName` TextField, `hiUnsettled` LongField, `ltUnsettled` LongField, `eiUnsettled` LongField

#### 이벤트
[E1] updateButton[저장].Select (L104) → update()
[E2] closeButton[닫기].Select (L110) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-121 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L123-135 | E1 | 서비스 pay.Pay02_Month.update | 업무 |
| private setHtmlStyle() | L137-139 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L141-143 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay02_Lookup_Insert (`client/vi/pay/Pay02_Lookup_Insert.java`, 226줄)

- 입력·하위 화면: `payName` ComboBoxField("PayMonthCode"), `payCode` TextField, `payDate` MyDateField, `radio01` Radio, `radio02` Radio, `annualYn` TextField, `popup` Emp01_Lookup_TransDate

#### 이벤트
[E1] toggle.ValueChange (L80) → 인라인 L80-92 (new ValueChangeHandler<HasValue<Boole…)
[E2] payName[지급구분].Collapse (L117) → 인라인 L117-122 (new CollapseHandler() { @Override pub…)
[E3] payName[지급구분].ValueChange (L124) → 인라인 L124-135 (new ValueChangeHandler<String>() { @O…)
[E4] updateButton[생성].Select (L137) → checkAppr()
[E5] closeButton[닫기].Select (L144) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-156 | 공개 메서드 | 상태 처리 | 업무 |
| public checkAppr() | L158-176 | E4 | 서비스 pay.Pay02_Month.checkAppr(companyId, payCode, payDate) | 업무 |
| public update() | L178-217 | checkAppr | 조회창 Emp01_Lookup_TransDate 열기, 서비스 pay.Pay02_Month.insert(companyId, payCode, payDate, annualYn) | 업무 |
| private setHtmlStyle() | L219-221 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L223-225 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={checkAppr}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay02_Lookup_GroupList (`client/vi/pay/Pay02_Lookup_GroupList.java`, 155줄)

- 툴바 `buttonBar`: 구분: {payName} {retrieveButton}
- 입력·하위 화면: `payName` ComboBoxField("PayMonthCode", "%", "전체")
- 그리드 `grid` (buildGrid()):
  - payGroupName 220 "분류" Text

#### 이벤트
[E0] 화면 열림 (생성자 L52-110) → show()
[E1] payName[PayMonthCode].KeyPress [Enter] (L60) → retrieve()
[E2] retrieveButton[조회].Select (L68) → retrieve()
[E3] selectButton[확인].Select (L74) → select()
[E4] cancleButton[닫기].Select (L80) → hide()
[E5] grid.CellDoubleClick (L86) → select()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-50 | 공개 메서드 | 상태 처리 | 업무 |
| private select() | L120-124 | E3,E5 | 상태 처리 | 업무 |
| public retrieve() | L126-145 | E1,E2,open | 서비스 pay.Pay02_Month.selectByYear(year, payCode, companyId) | 업무 |
| public buildGrid() | L112-118 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L147-149 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L151-153 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('payGroupNm', 220, '분류'),  // L115 SQL 계산 컬럼(selectByYear: (to_char(pay02_pay_date,'yyyy-mm-dd') |…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

