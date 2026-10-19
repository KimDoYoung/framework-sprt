# Sch06_Lookup_AlarmSetup

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bbs`
- 파일: `client/vi/sch/Sch06_Lookup_AlarmSetup.java`
- 함께 쓰는 클래스 1개:
  - `Sch11_Edit_IpoAlarmSetup` `client/vi/sch/Sch11_Edit_IpoAlarmSetup.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch06_Alarm.delete` | Sch06_Lookup_AlarmSetup:326 | [`Sch06_Alarm.java:33`](../../sch/services/Sch06_Alarm.md) | `UpdateDataModel(sch06_alarm)` 동적 DELETE |
| `sch.Sch06_Alarm.selectByTargetId` | Sch06_Lookup_AlarmSetup:343 | [`Sch06_Alarm.java:23`](../../sch/services/Sch06_Alarm.md) | [`sch06_alarm.selectByTargetId`](../../sch/sql/sch06_alarm.md) |
| `sch.Sch06_Alarm.update` | Sch06_Lookup_AlarmSetup:305 | [`Sch06_Alarm.java:28`](../../sch/services/Sch06_Alarm.md) | `UpdateDataModel(sch06_alarm)` 동적 INSERT/UPDATE → [`sch06_alarm.selectById`](../../sch/sql/sch06_alarm.md) |
| `sch.Sch11_IpoCompany.selectByIpoId` | Sch11_Edit_IpoAlarmSetup:47 | [`Sch11_IpoCompany.java:24`](../../sch/services/Sch11_IpoCompany.md) | [`sch11_ipo_company.selectByIpoId`](../../sch/sql/sch11_ipo_company.md) |
| `sch.Sch11_IpoCompany.update` | Sch11_Edit_IpoAlarmSetup:64 | [`Sch11_IpoCompany.java:44`](../../sch/services/Sch11_IpoCompany.md) | `UpdateDataModel(sch11_ipo_company)` 동적 INSERT/UPDATE → [`sch11_ipo_company.selectById`](../../sch/sql/sch11_ipo_company.md) |

## 테이블

[`sch06_alarm`](../../../db/tables/sch.md), [`sch11_ipo_company`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch06_Lookup_AlarmSetup (`client/vi/sch/Sch06_Lookup_AlarmSetup.java`, 367줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton} * 알람은 메일로 발송됩니다:
- 입력·하위 화면: `ipoGrid` Sch11_Edit_IpoAlarmSetup, `dayWeekComboField` ComboBoxField("DayWeekCode"), `befAftComboField` ComboBoxField("BeforeAfterCode"), `ampmComboField` ComboBoxField("AmPmCode"), `hourComboField` ComboBoxField("HourCode12"), `minuteComboField` ComboBoxField("MinuteCode2"), `holidayComboField` ComboBoxField("HolidaySettleCode")
- 그리드 `grid` (grid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - num 50 "" LongCenter 편집:LongField
  - dayWeekName 50 "" TextCenter 편집:dayWeekComboField
  - befAftName 50 "" TextCenter 편집:befAftComboField
  - amPmName 80 "" TextCenter 편집:ampmComboField
  - hourName 80 "" TextCenter 편집:hourComboField
  - minuteName 80 "" TextCenter 편집:minuteComboField
  - holidayName 120 "" TextCenter 편집:holidayComboField
  - useYn 50 "" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L65-69) → 초기화
[E1] retrieveButton[조회].Select (L117) → retrieve()
[E2] insertButton[등록].Select (L123) → insertRow()
[E3] deleteButton[삭제].Select (L129) → delete()
       └ [E12] msgBox.DialogHide [YES] (L320) → 서비스 sch.Sch06_Alarm.delete
[E4] updateButton[저장].Select (L135) → preCheck()
[E5] closeButton[닫기].Select [callback != null] (L141) → hide()
[E6] dayWeekComboField[DayWeekCode].Collapse (L157) → 인라인 L157-163 (new CollapseHandler() { @Override pub…)
[E7] befAftComboField[BeforeAfterCode].Collapse (L166) → 인라인 L166-172 (new CollapseHandler() { @Override pub…)
[E8] ampmComboField[AmPmCode].Collapse (L175) → 인라인 L175-181 (new CollapseHandler() { @Override pub…)
[E9] hourComboField[HourCode12].Collapse (L184) → 인라인 L184-190 (new CollapseHandler() { @Override pub…)
[E10] minuteComboField[MinuteCode2].Collapse (L193) → 인라인 L193-199 (new CollapseHandler() { @Override pub…)
[E11] holidayComboField[HolidaySettleCode].Collapse (L202) → 인라인 L202-208 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L71-114 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L116-150 | open | 상태 처리 | 업무 |
| private grid() | L152-227 | 필드 초기화 | 상태 처리 | 업무 |
| private insertRow() | L229-251 | E2 | 상태 처리 | 업무 |
| private preCheck() | L253-301 | E4 | 상태 처리 | 업무 |
| private update() | L303-310 | preCheck | 서비스 sch.Sch06_Alarm.update | 업무 |
| private delete() | L312-337 | E3 | ConfirmBox → E12 | 업무 |
| private retrieve() | L339-352 | E1,open | 서비스 sch.Sch06_Alarm.selectByTargetId(targetId) | 업무 |
| private setHtmlHeaderStyle() | L354-356 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L358-361 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L363-365 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  // ⚠DB없음 L210 newHeaderGroupMap02newHeaderGroupConfig13 100 "일/주" (sch06_new_header_group_map02new_header_group_config13 컬럼 없음)
  // ⚠DB없음 L211 newHeaderGroupMap05newHeaderGroupConfig13 100 "시간" (sch06_new_header_group_map05new_header_group_config13 컬럼 없음)
  // ⚠DB없음 L212 newHeaderGroupMap08newHeaderGroupConfig11 100 "휴일지정" (sch06_new_header_group_map08new_header_group_config11 컬럼 없음)
  // ⚠DB없음 L213 newHeaderGroupMap09newHeaderGroupConfig11 100 "사용" (sch06_new_header_group_map09new_header_group_config11 컬럼 없음)
  gb.longCenter('num', 50, '', { editor: 'number' }),  // L217
  gb.textCenter('dayWeekNm', 50, ''),  // L218 SQL 계산 컬럼(selectByTargetId: f_cdnm('DayWeekCode' , sch06_day_week_c…)
  gb.textCenter('befAftNm', 50, ''),  // L219 SQL 계산 컬럼(selectByTargetId: f_cdnm('BeforeAfterCode' , sch06_bef_af…)
  gb.textCenter('amPmNm', 80, ''),  // L220 SQL 계산 컬럼(selectByTargetId: f_cdnm('AmPmCode' , sch06_am_pm_cd , sc…)
  gb.textCenter('hourNm', 80, ''),  // L221 SQL 계산 컬럼(selectByTargetId: f_cdnm('HourCode12' , sch06_hour_cd , s…)
  gb.textCenter('minuteNm', 80, ''),  // L222 SQL 계산 컬럼(selectByTargetId: f_cdnm('MinuteCode2' , sch06_minute_cd …)
  gb.textCenter('holidayNm', 120, ''),  // L223 SQL 계산 컬럼(selectByTargetId: f_cdnm('HolidaySettleCode' , sch06_holi…)
  gb.boolean('useYn', 50, ''),  // L224
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={preCheck}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch11_Edit_IpoAlarmSetup (`client/vi/sch/Sch11_Edit_IpoAlarmSetup.java`, 71줄)

- 그리드 `grid` (grid(), 행번호숨김):
  - demandSdateAlarmYn 130 "수요예측시작일" Boolean
  - demandCdateAlarmYn 120 "수요예측종료일" Boolean
  - subscriptionSdateAlarmYn 100 "청약시작일" Boolean
  - subscriptionCdateAlarmYn 100 "청약종료일" Boolean
  - payDateAlarmYn 90 "납입일" Boolean
  - listDateAlarmYn 90 "상장일" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L20-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private grid() | L27-40 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L42-60 | 공개 메서드 | 서비스 sch.Sch11_IpoCompany.selectByIpoId(companyId, ipoId) | 업무 |
| public update() | L62-65 | 공개 메서드 | 서비스 sch.Sch11_IpoCompany.update | 업무 |
| public getModiCnt() | L67-69 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const grid = () => [
  gb.boolean('demandSdateAlarmYn', 130, '수요예측시작일'),  // L32
  gb.boolean('demandCdateAlarmYn', 120, '수요예측종료일'),  // L33
  gb.boolean('subscriptionSdateAlarmYn', 100, '청약시작일'),  // L34
  gb.boolean('subscriptionCdateAlarmYn', 100, '청약종료일'),  // L35
  gb.boolean('payDateAlarmYn', 90, '납입일'),  // L36
  gb.boolean('listDateAlarmYn', 90, '상장일'),  // L37
];
```

#### 사용된 버튼들
버튼 사용하지 않음

