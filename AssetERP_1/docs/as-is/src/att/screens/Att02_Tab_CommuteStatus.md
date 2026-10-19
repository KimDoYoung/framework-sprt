# Att02_Tab_CommuteStatus

- 종류: 화면
- 메뉴: 경영관리 > 06. 근태관리 > 근태현황(관리자) (#1487)
- 파일: `client/vi/att/Att02_Tab_CommuteStatus.java`
- 함께 쓰는 클래스 1개:
  - `Att02_Edit_InOutReason` `client/vi/att/Att02_Edit_InOutReason.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `att.Att02_Commute.getCommuteStatus` | Att02_Tab_CommuteStatus:208 | [`Att02_Commute.java:54`](../../att/services/Att02_Commute.md) | [`att02_commute.getCommuteStatus`](../../att/sql/att02_commute.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`pay34_work_time_config`](../../../db/tables/pay.md), [`sys12_calendar`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Att02_Tab_CommuteStatus (`client/vi/att/Att02_Tab_CommuteStatus.java`, 224줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 근무일자: {anchor01} {baseDate} {anchor02} 검색: {searchText} 사원: {empKorName} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="사원번호/사원명/본부(부서)", `empKorName` LookupTriggerField 빈칸="전체", `empSearch` Emp00_Lookup_SelectSingle, `lookup` Att02_Edit_InOutReason
- 그리드 `grid` (buildGrid()):
  - statusName 150 "상태" TextCenter
  - inOutReasonYnStr 35 " " DynamicCell 편집:actionCell01
  - personNo 100 "사원번호" TextCenter
  - personName 100 "사원명" TextCenter
  - orgName 160 "본부(부서)" Text
  - posName 80 "직위" TextCenter
  - calcCheckInTimeStr 100 "출근시간" TextCenter
  - calcCheckOutTimeStr 100 "퇴근시간" TextCenter
  - baseWorkTimeStr 120 "기본근로" TextCenter
  - overtimeWorkTimeStr 120 "연장근무" TextCenter
  - nightWorkTimeStr 120 "야간근무" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L58-113) → settings(), setIconStyle(), retrieve()
[E1] anchor01.MouseDown (L64) → retrieve()
[E2] anchor02.MouseDown (L76) → retrieve()
[E3] baseDate.ValueChange (L118) → retrieve()
[E4] searchText.KeyPress [Enter] (L126) → retrieve()
[E5] empKorName.TriggerClick [result == null] (L137) → 인라인 L137-155 (new TriggerClickHandler(){ @Override …)
[E6] empKorName.Change (L156) → 인라인 L156-163 (new ChangeHandler() { @Override publi…)
[E7] retrieveButton[조회].Select (L164) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L200-215 | 생성자,E1,E2,E3,E4,E7 | 서비스 att.Att02_Commute.getCommuteStatus(searchText, companyId, personId, baseDate) | 업무 |
| public setIconStyle() | L221-223 | 생성자 | 상태 처리 | 업무 |
| private settings() | L115-170 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: baseDate=LoginUser.getToday(, empKorName="전체", empKorName=codeModel.getEmpPersonModel( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L172-198 | 필드 초기화 | 팝업 Att02_Edit_InOutReason 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L217-219 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('statusNm', 150, '상태'),  // L181
  // ⚠ 대응 없음 (GridBuilder L182) addDynamicCell
  gb.textCenter('personNo', 100, '사원번호'),  // L183
  gb.textCenter('personNm', 100, '사원명'),  // L184
  gb.text('orgNm', 160, '본부(부서)'),  // L185
  gb.textCenter('posNm', 80, '직위'),  // L186
  gb.textCenter('calcCheckInTimeStr', 100, '출근시간'),  // L190
  gb.textCenter('calcCheckOutTimeStr', 100, '퇴근시간'),  // L191
  gb.textCenter('baseWorkTimeStr', 120, '기본근로'),  // L192
  gb.textCenter('overtimeWorkTimeStr', 120, '연장근무'),  // L193
  gb.textCenter('nightWorkTimeStr', 120, '야간근무'),  // L194
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

