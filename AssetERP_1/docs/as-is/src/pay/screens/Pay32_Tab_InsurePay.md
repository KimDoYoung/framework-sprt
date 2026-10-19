# Pay32_Tab_InsurePay

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 4대보험 정산내역 (#1276)
- 파일: `client/vi/pay/Pay32_Tab_InsurePay.java`
- 함께 쓰는 클래스 1개:
  - `Pay32_Lookup_Detail` `client/vi/pay/Pay32_Lookup_Detail.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Pay32_Tab_InsurePay:140 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `pay.Pay32_InsurePay.delete` | Pay32_Lookup_Detail:257 | [`Pay32_InsurePay.java:63`](../../pay/services/Pay32_InsurePay.md) | `UpdateDataModel(pay32_insure_pay)` 동적 DELETE |
| `pay.Pay32_InsurePay.selectByCompanyId` | Pay32_Tab_InsurePay:229 | [`Pay32_InsurePay.java:24`](../../pay/services/Pay32_InsurePay.md) | [`pay32_insure_pay.selectByCompanyId`](../../pay/sql/pay32_insure_pay.md) |
| `pay.Pay32_InsurePay.selectByPersonId` | Pay32_Lookup_Detail:207 | [`Pay32_InsurePay.java:41`](../../pay/services/Pay32_InsurePay.md) | [`pay32_insure_pay.selectByPersonId`](../../pay/sql/pay32_insure_pay.md) |
| `pay.Pay32_InsurePay.update` | Pay32_Lookup_Detail:212 | [`Pay32_InsurePay.java:58`](../../pay/services/Pay32_InsurePay.md) | `UpdateDataModel(pay32_insure_pay)` 동적 INSERT/UPDATE → [`pay32_insure_pay.selectById`](../../pay/sql/pay32_insure_pay.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay32_Lookup_Detail:88, Pay32_Tab_InsurePay:101 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay32_insure_pay`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay32_Tab_InsurePay (`client/vi/pay/Pay32_Tab_InsurePay.java`, 240줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년도: {yearText} 사원명: {personName} 구분: {insureComboBox} {retrieveButton}
- 입력·하위 화면: `yearText` TextField 빈칸="YYYY", `personName` LookupTriggerField, `personId` LongField, `insureComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체") 빈칸="선택", `lookup` Pay32_Lookup_Detail, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 80 "사번" TextCenter
  - personName 100 "성명" TextCenter
  - insureName 150 "구분" TextCenter
  - tgtAmt 200 "정산보험료" Long
  - payName 150 "납부방법" TextCenter
  - payDiv 150 "분할납부회차" LongCenter
  - remAmt 200 "잔여 정산보험료" Long
  - actionCell 60 "납부상세" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L66-94) → settings(), retrieve()
[E1] insureComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L105) → retrieve()
[E2] yearText.KeyPress [Enter] (L116) → retrieve()
[E3] personName.TriggerClick (L126) → openLookupPerson()
[E4] personName.ValueChange (L132) → retrieve(), openLookupPerson()
[E5] retrieveButton[조회].Select (L164) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openLookupPerson() | L199-214 | E3,E4 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L216-235 | 생성자,E1,E2,E4,E5 | 서비스 pay.Pay32_InsurePay.selectByCompanyId(companyId, personId, insureCode, year) | 업무 |
| private settings() | L96-170 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode, emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle), 이벤트 연결, 초기값: personName=null, personId=null, personName=resultModel.getEmpPersonModel(, personId=resultModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L172-197 | 필드 초기화 | 조회창 Pay32_Lookup_Detail 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L237-239 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 80, '사번'),  // L184 SQL 계산 컬럼(selectByCompanyId: emp01_emp_no)
  gb.textCenter('personNm', 100, '성명'),  // L185 SQL 계산 컬럼(selectByCompanyId: emp01_kor_nm)
  gb.textCenter('insureNm', 150, '구분'),  // L186 SQL 계산 컬럼(selectByCompanyId: f_cdnm('InsureCode', pay32_insure_cd, p…)
  gb.long('tgtAmt', 200, '정산보험료'),  // L187
  gb.textCenter('payNm', 150, '납부방법'),  // L188 SQL 계산 컬럼(selectByCompanyId: f_cdnm('DivPayCode', pay32_pay_cd, pay3…)
  gb.longCenter('payDiv', 150, '분할납부회차'),  // L189
  gb.long('remAmt', 200, '잔여 정산보험료'),  // L190
  // ⚠ 대응 없음 (GridBuilder L191) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Pay32_Lookup_Detail (`client/vi/pay/Pay32_Lookup_Detail.java`, 267줄)

- 툴바 `buttonBar`: 기준년도: {yearText} 구분: {insureName} {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `yearText` TextField 빈칸="YYYY", `insureName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "건강보험", "yyyy", "YYYY"), `divPayComboBox` ComboBoxField("DivPayCode")
- 그리드 `grid` (buildGrid()):
  - date 100 "일자" Date 편집:MyDateField
  - tgtAmt 150 "정산보험료" Long 편집:LongField
  - payName 120 "납부방법" TextCenter 편집:divPayComboBox
  - payDiv 150 "분할납부회차" LongCenter 편집:LongField
  - cnt 150 "납부회차" LongCenter 편집:LongField
  - amt 150 "납부금액" Long 편집:LongField
  - remAmt 150 "잔여금액" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L74-80) → 초기화
[E1] insureName[sys.Sys00_Common.selectByKindGroupCode].Collapse (L108) → retrieve()
[E2] yearText.KeyPress [Enter] (L116) → retrieve()
[E3] retrieveButton[조회].Select (L125) → retrieve()
[E4] insertButton[등록].Select (L131) → insertRow()
[E5] updateButton[저장].Select (L137) → update()
[E6] deleteButton[삭제].Select (L143) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L237) → deleteRow()
[E7] divPayComboBox[DivPayCode].Collapse (L174) → 인라인 L174-182 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-67 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L69-72 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L196-208 | E1,E2,E3,settings | 서비스 pay.Pay32_InsurePay.selectByPersonId(companyId, personId, companyId, personId, insureCode, year) | 업무 |
| public update() | L210-213 | E5 | 서비스 pay.Pay32_InsurePay.update | 업무 |
| public insertRow() | L215-232 | E4 | 상태 처리 | 업무 |
| private deleteChk() | L234-252 | E6 | ConfirmBox → E8 | 업무 |
| public deleteRow() | L254-258 | E8 | GridDeleteData pay.Pay32_InsurePay.delete(체크된 행 목록) | 업무 |
| private settings() | L82-170 | open | 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L172-194 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L260-262 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L264-266 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자', { editor: 'date' }),  // L185
  gb.long('tgtAmt', 150, '정산보험료', { editor: 'number' }),  // L186
  gb.textCenter('payNm', 120, '납부방법', { editor: 'select' }),  // L187 SQL 계산 컬럼(selectByPersonId: f_cdnm('DivPayCode', pay32_pay_cd, pay3…)
  gb.longCenter('payDiv', 150, '분할납부회차', { editor: 'number' }),  // L188
  gb.longCenter('cnt', 150, '납부회차', { editor: 'number' }),  // L189
  gb.long('amt', 150, '납부금액', { editor: 'number' }),  // L190
  gb.long('remAmt', 150, '잔여금액', { editor: 'number' }),  // L191
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

