# Pay02_Tab_PersonListManager

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리(Old) > 급여명세서(경영관리팀)(old) (#1183)
- 파일: `client/vi/pay/Pay02_Tab_PersonListManager.java`
- 함께 쓰는 클래스 1개:
  - `Pay02_Rd_PersonList` `client/vi/pay/Pay02_Rd_PersonList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Pay02_Tab_PersonListManager:111 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `pay.Pay02_Month.selectByYearPersonId` | Pay02_Tab_PersonListManager:168 | [`Pay02_Month.java:51`](../../pay/services/Pay02_Month.md) | [`pay02_month.selectByYearPersonId`](../../pay/sql/pay02_month.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay02_month`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay02_Tab_PersonListManager (`client/vi/pay/Pay02_Tab_PersonListManager.java`, 209줄)

- 레이아웃: north=buttonBar, west=grid, center=rdPayForm
- 툴바 `buttonBar`: 해당 연도: {yearText} 사원명: {personName} {retrieveButton}
- 입력·하위 화면: `yearText` TextField, `personName` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - payDate 120 "일자" Date
  - payName 80 "구분" TextCenter
  - realPay 160 "실수령액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L55-140) → 초기화
[E1] retrieveButton[조회].Select (L68) → retrieve()
[E2] personName.TriggerClick (L96) → openLookupPerson()
[E3] personName.ValueChange (L102) → retrieve(), openLookupPerson()
[E4] grid.CellClick (L134) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L151-154 | E4,retrieve | 상태 처리 | 업무 |
| public retrieve() | L156-178 | E1,E3,openLookupPerson | 서비스 pay.Pay02_Month.selectByYearPersonId(companyId, personId, year) | 업무 |
| public openLookupPerson() | L180-191 | E2,E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public openLookupPerson() | L193-204 | E2,E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public buildGrid() | L142-149 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L206-208 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('payDate', 120, '일자'),  // L144
  gb.textCenter('payNm', 80, '구분'),  // L145 SQL 계산 컬럼(selectByYearPersonId: f_cdnm('PayMonthCode', pay02_pay_cd, pa…)
  gb.long('realPay', 160, '실수령액'),  // L146
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Pay02_Rd_PersonList (`client/vi/pay/Pay02_Rd_PersonList.java`, 73줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L27-51 | 공개 메서드 | 상태 처리 | 업무 |
| public rdClear() | L53-55 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L58-59 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L62-63 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L66-67 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L70-71 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

