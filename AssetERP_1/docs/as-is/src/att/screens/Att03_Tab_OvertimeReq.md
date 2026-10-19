# Att03_Tab_OvertimeReq

- 종류: 화면
- 메뉴: 경영관리 > 06. 근태관리 > 연장근무관리 (#1486)
- 파일: `client/vi/att/Att03_Tab_OvertimeReq.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `att.Att03_OvertimeReq.getConfirmList` | Att03_Tab_OvertimeReq:208 | [`Att03_OvertimeReq.java:54`](../../att/services/Att03_OvertimeReq.md) | [`att03_overtime_req.getConfirmList`](../../att/sql/att03_overtime_req.md) |
| `att.Att13_OvertimeReqHist.updateInfo` | Att03_Tab_OvertimeReq:162, Att03_Tab_OvertimeReq:187 | [`Att13_OvertimeReqHist.java:27`](../../att/services/Att13_OvertimeReqHist.md) | [`att13_overtime_req_hist.insert`](../../att/sql/att13_overtime_req_hist.md), [`att13_overtime_req_hist.selectByOvertimeReqId`](../../att/sql/att13_overtime_req_hist.md), [`att13_overtime_req_hist.updateInfo`](../../att/sql/att13_overtime_req_hist.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md), `att13_overtime_req_hist` ⚠DB없음, [`emp01_person`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay34_work_time_config`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Att03_Tab_OvertimeReq (`client/vi/att/Att03_Tab_OvertimeReq.java`, 219줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {retrieveButton} {updateButton} {confirmButton} {rejectButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `paymentType` ComboBoxField("PaymentTypeCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - confirmYn 50 "확정" BooleanYn
  - workDate 100 "근무일자" Date
  - personNo 100 "사원번호" TextCenter
  - personName 80 "사원명" TextCenter
  - orgName 160 "본부(부서)" Text
  - posName 80 "직위" TextCenter
  - workTypeName 100 "구분" TextCenter
  - overTimeStr 140 "근무시간" TextCenter
  - reason 220 "사유" Text
  - workRewardTypeName 120 "보상구분" TextCenter
  - paymentTypeName 120 "지급방법" TextCenter 편집:"2EAC7E"
  - weekReport 100 "주 연장근로" TextHtmlCenter
  - monthReport 100 "월 연장근로" TextHtmlCenter

#### 이벤트
[E0] 화면 열림 (생성자 L51-77) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L88) → retrieve()
[E2] updateButton[저장].Select (L94) → update()
[E3] confirmButton[확정].Select (L100) → confirm()
[E4] rejectButton[확정취소].Select (L110) → confirm()
[E5] paymentType[PaymentTypeCode].Collapse (L124) → 인라인 L124-127 (e -> { Att03_OvertimeReqModel m = gri…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private update() | L147-173 | E2 | 서비스 att.Att13_OvertimeReqHist.updateInfo(confirmerId, updateList) | 업무 |
| private confirm() | L175-199 | E3,E4 | 서비스 att.Att13_OvertimeReqHist.updateInfo(confirmYn, confirmerId, updateList) | 업무 |
| public retrieve() | L201-214 | 생성자,E1,update,confirm | 서비스 att.Att03_OvertimeReq.getConfirmList(companyId, startDate, closeDate) | 업무 |
| private settings() | L79-120 | 생성자 | 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=endDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L122-145 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L216-218 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.booleanYn('confirmYn', 50, '확정'),  // L130
  gb.date('workDate', 100, '근무일자'),  // L131
  gb.textCenter('personNo', 100, '사원번호'),  // L132 SQL 계산 컬럼(getConfirmList: emp01_emp_no)
  gb.textCenter('personNm', 80, '사원명'),  // L133 SQL 계산 컬럼(getConfirmList: emp01_kor_nm)
  gb.text('orgNm', 160, '본부(부서)'),  // L134 SQL 계산 컬럼(getConfirmList: f_get_empTrans(a.att03_person_id, a.att…)
  gb.textCenter('posNm', 80, '직위'),  // L135 SQL 계산 컬럼(getConfirmList: f_get_empTrans(a.att03_person_id, a.att…)
  gb.textCenter('workTypeNm', 100, '구분'),  // L136 SQL 계산 컬럼(getConfirmList: f_cdnm('WorkTypeCode', a.att03_work_typ…)
  gb.textCenter('overTimeStr', 140, '근무시간'),  // L137 SQL 계산 컬럼(getConfirmList: CASE WHEN a.att03_work_type_cd = '10' T…)
  gb.text('reason', 220, '사유'),  // L138
  gb.textCenter('workRewardTypeNm', 120, '보상구분'),  // L139 SQL 계산 컬럼(getConfirmList: f_cdnm('WorkRewardTypeCode', a.att03_wo…)
  gb.textCenter('paymentTypeNm', 120, '지급방법'),  // L140 SQL 계산 컬럼(getConfirmList: f_cdnm('PaymentTypeCode', a13.att13_pay…)
  // ⚠ 대응 없음 (GridBuilder L141) addTextHtmlCenter
  // ⚠ 대응 없음 (GridBuilder L142) addTextHtmlCenter
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="save" onClick={confirm}>확정</Button>
4. <Button type="cancel" onClick={confirm}>확정취소</Button>

