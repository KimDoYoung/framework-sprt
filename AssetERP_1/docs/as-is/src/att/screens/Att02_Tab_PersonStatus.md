# Att02_Tab_PersonStatus

- 종류: 화면
- 메뉴: 경영관리 > 06. 근태관리 > 근태현황 (#1492)
- 파일: `client/vi/att/Att02_Tab_PersonStatus.java`
- 함께 쓰는 클래스 1개:
  - `Att02_Edit_InOutReason` `client/vi/att/Att02_Edit_InOutReason.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `att.Att02_Commute.getPersonStatus` | Att02_Tab_PersonStatus:128 | [`Att02_Commute.java:67`](../../att/services/Att02_Commute.md) | [`att02_commute.getPersonStatus`](../../att/sql/att02_commute.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`pay34_work_time_config`](../../../db/tables/pay.md), [`sys12_calendar`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Att02_Tab_PersonStatus (`client/vi/att/Att02_Tab_PersonStatus.java`, 154줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 근무일자: {startDate} ~: {closeDate} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `lookup` Att02_Edit_InOutReason
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - workDate 100 "근무일자" Date
  - dayOfWeek 50 "요일" TextCenter
  - dateInfo 100 "구분" TextCenter
  - statusName 150 "상태" TextCenter
  - inOutReasonYnStr 35 " " DynamicCell 편집:actionCell01
  - checkInTimeStr 100 "출근시간" TextCenter 편집:"456EA6"
  - checkOutTimeStr 100 "퇴근시간" TextCenter 편집:"456EA6"
  - calcCheckInTimeStr 100 "출근시간" TextCenter
  - calcCheckOutTimeStr 100 "퇴근시간" TextCenter
  - baseWorkTimeStr 120 "기본근로" TextCenter
  - overtimeWorkTimeStr 120 "연장근무" TextCenter
  - nightWorkTimeStr 120 "야간근무" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L46-70) → settings(), retrieve()
[E1] closeDate.ValueChange (L78) → retrieve()
[E2] retrieveButton[조회].Select (L84) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L120-135 | 생성자,E1,E2 | 서비스 att.Att02_Commute.getPersonStatus(companyId, personId, startDate, closeDate) | 업무 |
| public setIconStyle() | L141-143 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L72-90 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-MM-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L92-118 | 필드 초기화 | 팝업 Att02_Edit_InOutReason 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L137-139 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L145-148 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L150-153 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.group('newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle12', 100, '근로자 실입력'),  // L101
  gb.group('newHeaderGroupMap08newHeaderGroupConfigsetHtmlGridStyle12', 100, '관리자 확정'),  // L102
  gb.group('newHeaderGroupMap010newHeaderGroupConfigsetHtmlGridStyle13', 100, '근로시간'),  // L103
  gb.date('workDate', 100, '근무일자'),  // L104
  gb.textCenter('dayOfWeek', 50, '요일'),  // L105
  gb.textCenter('dateInfo', 100, '구분'),  // L106
  gb.textCenter('statusNm', 150, '상태'),  // L107
  // ⚠ 대응 없음 (GridBuilder L108) addDynamicCell
  gb.textCenter('checkInTimeStr', 100, '출근시간'),  // L109
  gb.textCenter('checkOutTimeStr', 100, '퇴근시간'),  // L110
  gb.textCenter('calcCheckInTimeStr', 100, '출근시간'),  // L111
  gb.textCenter('calcCheckOutTimeStr', 100, '퇴근시간'),  // L112
  gb.textCenter('baseWorkTimeStr', 120, '기본근로'),  // L113
  gb.textCenter('overtimeWorkTimeStr', 120, '연장근무'),  // L114
  gb.textCenter('nightWorkTimeStr', 120, '야간근무'),  // L115
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Att02_Edit_InOutReason (`client/vi/att/Att02_Edit_InOutReason.java`, 89줄)

- 입력·하위 화면: `inReason` MyTextArea, `outReason` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L43-71) → show()
[E1] closeButton[닫기].Select (L74) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L34-41 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L73-80 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L82-84 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L86-88 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

