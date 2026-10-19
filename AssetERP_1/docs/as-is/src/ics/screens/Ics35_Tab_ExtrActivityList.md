# Ics35_Tab_ExtrActivityList

- 종류: 화면
- 메뉴: 준법감시 > 12. 대외활동 > 대외활동 신청내역 (#1432)
- 파일: `client/vi/ics/Ics35_Tab_ExtrActivityList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics35_ExtrActivity.selectByCompanyId` | Ics35_Tab_ExtrActivityList:144 | [`Ics35_ExtrActivity.java:26`](../../ics/services/Ics35_ExtrActivity.md) | [`ics35_extr_activity.selectByCompanyId`](../../ics/sql/ics35_extr_activity.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`ics35_extr_activity`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics35_Tab_ExtrActivityList (`client/vi/ics/Ics35_Tab_ExtrActivityList.java`, 183줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {checkBox} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `checkBox` CheckBox, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - regDate 100 "신청일자" Date
  - personName 100 "신청자" TextCenter
  - personNo 80 "사번" TextCenter
  - orgName 150 "부서명" Text
  - activityCorp 200 "활동처" Text
  - activityTgtName2 200 "활동대상" Text
  - activityPeriod 280 "활동기간" Text
  - apprStatusName 100 "결재상태" TextStatus
  - actionCell 80 "문서보기" Cell 편집:actionCell01
  - resultApprStatusName 100 "결재상태" TextStatus
  - actionCell 80 "문서보기" Cell 편집:actionCell02

#### 이벤트
[E0] 화면 열림 (생성자 L50-76) → settings(), retrieve()
[E1] checkBox[조회기간 없이 결과보고 누락건만 조회].ValueChange [event.getValue()] (L85) → 인라인 L85-96 (new ValueChangeHandler<Boolean>() { @…)
[E2] retrieveButton[조회].Select (L97) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L136-150 | 생성자,E2 | 서비스 ics.Ics35_ExtrActivity.selectByCompanyId(companyId, startDate, closeDate, unknown) | 업무 |
| private viewAppr() | L152-174 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private settings() | L78-103 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, checkBox=false("조회기간 없이 결과보고 누락건만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L105-134 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L176-178 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L180-182 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L119 newHeaderGroupMap08newHeaderGroupConfig12 100 "활동신청" (sys10_new_header_group_map08new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L120 newHeaderGroupMap010newHeaderGroupConfig12 100 "결과보고" (sys10_new_header_group_map010new_header_group_config12 컬럼 없음)
  gb.date('regDate', 100, '신청일자'),  // L121
  gb.textCenter('personNm', 100, '신청자'),  // L122
  gb.textCenter('personNo', 80, '사번'),  // L123
  gb.text('orgNm', 150, '부서명'),  // L124
  gb.text('activityCorp', 200, '활동처'),  // L125
  gb.text('activityTgtNm2', 200, '활동대상'),  // L126
  gb.text('activityPeriod', 280, '활동기간'),  // L127
  gb.textStatus('apprStatusNm', 100, '결재상태'),  // L128
  // ⚠ 대응 없음 (GridBuilder L129) addCell
  gb.textStatus('resultApprStatusNm', 100, '결재상태'),  // L130
  // ⚠ 대응 없음 (GridBuilder L131) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

