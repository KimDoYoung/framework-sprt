# Pay01_Tab_AnnualPerson

- 종류: 화면
- 메뉴: 경영관리 > 03. 연봉관리 > 연봉조회 (#1104)
- 파일: `client/vi/pay/Pay01_Tab_AnnualPerson.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay01_Tab_AnnualPerson:81 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `pay.Pay01_Annual.selectByPersonId` | Pay01_Tab_AnnualPerson:135 | [`Pay01_Annual.java:39`](../../pay/services/Pay01_Annual.md) | [`pay01_annual.selectByPersonId`](../../pay/sql/pay01_annual.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay01_annual`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay01_Tab_AnnualPerson (`client/vi/pay/Pay01_Tab_AnnualPerson.java`, 143줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - personNo 50 "사번" TextCenter
  - personName 80 "성명" TextCenter
  - startDate 100 "적용시작일" Date
  - closeDate 100 "적용종료일" Date
  - startTime 80 "시업시간" TextCenter
  - closeTime 80 "종업시간" TextCenter
  - monthOtHours 80 "월연장<br>근로시간" LongCenter
  - annualPay 100 "기본연봉" Long 편집:"456EA6"
  - retirePay 100 "퇴직금" Long 편집:"456EA6"
  - yearPay 100 "총연봉" Long 편집:"456EA6"
  - etcAgreement 100 "기타약정사항" Text 편집:"456EA6"
  - basicPay 100 "기본급여" Long
  - mealPay 100 "중식대" Long
  - carMt 100 "차량유지비" Long
  - childcareAllowance 100 "양육수당" Long
  - overPay 100 "연장근로" Long
  - etc01Pay 100 "기타급여1" Long
  - etc02Pay 100 "기타급여2" Long
  - monthPay 100 "합계" Long
  - apprStatusName 100 "상신상태" TextCenter
  - actionCell 60 "" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L42-64) → retrieve()
[E1] retrieveButton[조회].Select (L45) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L130-136 | 생성자,E1 | 서비스 pay.Pay01_Annual.selectByPersonId(companyId, personId, apprYn) | 업무 |
| public buildGrid() | L66-128 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 없습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L138-141 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L101 newHeaderGroupMap01newHeaderGroupConfig17 100 "기본정보" (pay01_new_header_group_map01new_header_group_config17 컬럼 없음)
  // ⚠DB없음 L102 newHeaderGroupMap08newHeaderGroupConfigsetHtmlGridStyle14 100 "연봉 구성" (pay01_new_header_group_map08new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L103 newHeaderGroupMap012newHeaderGroupConfig17 100 "월급여 구성" (pay01_new_header_group_map012new_header_group_config17 컬럼 없음)
  gb.textCenter('personNo', 50, '사번'),  // L105 SQL 계산 컬럼(selectById: emp01_emp_no)
  gb.textCenter('personNm', 80, '성명'),  // L106 SQL 계산 컬럼(selectById: emp01_kor_nm)
  gb.date('startDate', 100, '적용시작일'),  // L107
  gb.date('closeDate', 100, '적용종료일'),  // L108
  gb.textCenter('startTime', 80, '시업시간'),  // L109
  gb.textCenter('closeTime', 80, '종업시간'),  // L110
  gb.longCenter('monthOtHours', 80, '월연장<br>근로시간'),  // L111
  gb.long('annualPay', 100, '기본연봉'),  // L112
  gb.long('retirePay', 100, '퇴직금'),  // L113
  gb.long('yearPay', 100, '총연봉'),  // L114 SQL 계산 컬럼(selectByPersonId: COALESCE(pay01_annual_pay, 0) + COALESC…)
  gb.text('etcAgreement', 100, '기타약정사항'),  // L115
  gb.long('basicPay', 100, '기본급여'),  // L116
  gb.long('mealPay', 100, '중식대'),  // L117
  gb.long('carMt', 100, '차량유지비'),  // L118
  gb.long('childcareAllowance', 100, '양육수당'),  // L119
  gb.long('overPay', 100, '연장근로'),  // L120
  gb.long('etc01Pay', 100, '기타급여1'),  // L121
  gb.long('etc02Pay', 100, '기타급여2'),  // L122
  gb.long('monthPay', 100, '합계'),  // L123 SQL 계산 컬럼(selectByPersonId: COALESCE(pay01_basic_pay,0) + COALESCE(…)
  gb.textCenter('apprStatusNm', 100, '상신상태'),  // L124 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L125) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

