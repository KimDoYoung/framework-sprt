# Emp20_Tab_YearList

- 종류: 화면
- 메뉴: 경영관리 > 02. 휴가/출장 관리 > 연월차휴가 현황 (#1035)
- 파일: `client/vi/emp/Emp20_Tab_YearList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp01_Person.selectByYearList` | Emp20_Tab_YearList:348 | [`Emp01_Person.java:215`](../../emp/services/Emp01_Person.md) | [`emp01_person.selectByYearList`](../../emp/sql/emp01_person.md) |
| `sys.Sys99_Print.insertRdYearList` | Emp20_Tab_YearList:221 | [`Sys99_Print.java:2248`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.selectByYearList`](../../emp/sql/emp01_person.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_get_close_date`, `f_get_datediff`, `f_get_emptrans`, `f_get_last_day`, `f_get_leave_days`, `f_get_leave_days2`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp20_Tab_YearList (`client/vi/emp/Emp20_Tab_YearList.java`, 367줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `leaveYText` TextField 빈칸="YYYY", `radioNow` Radio, `radioYearEnd` Radio, `radioDate` Radio, `stdDate` MyDateField, `retireTypeCombo` StringComboBox
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - empNo 70 "사번" TextFrozen 편집:"center"
  - korName 90 "성명" TextFrozen 편집:"center"
  - hireDateLeaveCalc 90 "입사일자" Date
  - yearPeriod 100 "근무기간" TextRight
  - yearPer 80 "근무년수" Double
  - yearLeaveDays 80 "휴가일수" Double
  - monthPeriod 100 "근무기간" TextCenter 편집:"107C41"
  - monthLeaveDays 80 "휴가일수" Double 편집:"107C41"
  - pyRemainMonthDays 80 "전년도<br>미사용" Double 편집:"107C41"
  - totalDays 100 "발생휴가" DoubleBold 편집:"404040"
  - useYearDays 80 "연차" Double 편집:"0069B4"
  - useMonthDays 80 "월차" Double 편집:"0069B4"
  - useDays 80 "계" DoubleBold 편집:"0069B4"
  - remainYearDays 80 "연차" Double 편집:"CE4242"
  - remainMonthDays 80 "월차" Double 편집:"CE4242"
  - remainDays 80 "계" DoubleBold 편집:"CE4242"
  - rewardTotalDays 80 "발생" Long
  - rewardUseDays 80 "사용" Long
  - rewardRemainDays 80 "잔여" Long
  - spcDays 100 "특별휴가" Double

#### 이벤트
[E0] 화면 열림 (생성자 L69-150) → buttonBarSetting(), retrieve()
[E1] toggleMonthStdDateType.ValueChange (L94) → retrieve()
[E2] leaveYText.KeyPress [Enter] (L170) → retrieve()
[E3] leaveYText.ValueChange (L178) → radioCheck()
[E4] retireTypeCombo[재직].Collapse (L192) → retrieve()
[E5] retrieveButton[조회].Select (L199) → retrieve()
[E6] downLoadButton[출력/다운로드].Select (L205) → 서비스 sys.Sys99_Print.insertRdYearList(companyId, personId, windowClassName, stdYear, monthStdDateType, stdDate, retireType)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buttonBarSetting() | L152-259 | 생성자 | 서비스 sys.Sys99_Print.insertRdYearList(companyId, personId, windowClassName, stdYear, monthStdDateType, stdDate, retireType) | 업무 |
| private radioCheck() | L306-326 | E3 | 상태 처리 | 업무 |
| public retrieve() | L328-354 | 생성자,E1,E2,E4,E5 | 서비스 emp.Emp01_Person.selectByYearList(companyId, stdYear, monthStdDateType, stdDate, retireType) | 업무 |
| public buildGrid() | L261-304 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L356-358 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlGridStyle() | L364-366 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L267 newHeaderGroupMap04newHeaderGroupConfig13 100 "연차" (emp01_new_header_group_map04new_header_group_config13 컬럼 없음)
  // ⚠DB없음 L268 newHeaderGroupMap07newHeaderGroupConfigsetHtmlGridStyle13 100 "월차" (emp01_new_header_group_map07new_header_group_configset_html_grid_style13 컬럼 없음)
  // ⚠DB없음 L269 newHeaderGroupMap011newHeaderGroupConfigsetHtmlGridStyle13 100 "사용휴가" (emp01_new_header_group_map011new_header_group_configset_html_grid_style13 컬럼 없음)
  // ⚠DB없음 L270 newHeaderGroupMap014newHeaderGroupConfigsetHtmlGridStyle13 100 "잔여휴가" (emp01_new_header_group_map014new_header_group_configset_html_grid_style13 컬럼 없음)
  // ⚠DB없음 L271 newHeaderGroupMap017newHeaderGroupConfig13 100 "포상휴가" (emp01_new_header_group_map017new_header_group_config13 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L273) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L274) addTextFrozen
  gb.date('hireDateLeaveCalc', 90, '입사일자'),  // L277
  gb.textRight('yearPeriod', 100, '근무기간'),  // L279
  gb.double('yearPer', 80, '근무년수'),  // L280
  gb.double('yearLeaveDays', 80, '휴가일수'),  // L281
  gb.textCenter('monthPeriod', 100, '근무기간'),  // L283
  gb.double('monthLeaveDays', 80, '휴가일수'),  // L284
  gb.double('pyRemainMonthDays', 80, '전년도<br>미사용'),  // L285
  // ⚠ 대응 없음 (GridBuilder L287) addDoubleBold
  gb.double('useYearDays', 80, '연차'),  // L289
  gb.double('useMonthDays', 80, '월차'),  // L290
  // ⚠ 대응 없음 (GridBuilder L291) addDoubleBold
  gb.double('remainYearDays', 80, '연차'),  // L293
  gb.double('remainMonthDays', 80, '월차'),  // L294
  // ⚠ 대응 없음 (GridBuilder L295) addDoubleBold
  gb.long('rewardTotalDays', 80, '발생'),  // L297
  gb.long('rewardUseDays', 80, '사용'),  // L298
  gb.long('rewardRemainDays', 80, '잔여'),  // L299
  gb.double('spcDays', 100, '특별휴가'),  // L301
];
```

#### 사용된 버튼들
1. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdYearList(companyId, personId, windowClassName, stdYear, monthStdDateType, stdDate, retireType) */}>출력/다운로드</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>

