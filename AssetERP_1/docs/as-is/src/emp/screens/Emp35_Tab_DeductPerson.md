# Emp35_Tab_DeductPerson

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 급여공제정보 (#1277)
- 파일: `client/vi/emp/Emp35_Tab_DeductPerson.java`
- 함께 쓰는 클래스 4개:
  - `Emp35_Page_DeductDate` `client/vi/emp/Emp35_Page_DeductDate.java`
  - `Emp35_TabPage_DeductInsert` `client/vi/emp/Emp35_TabPage_DeductInsert.java`
  - `Emp36_Popup_AddDeduct` `client/vi/emp/Emp36_Popup_AddDeduct.java`
  - `Emp35_Popup_DeductCreate` `client/vi/emp/Emp35_Popup_DeductCreate.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Pay03_Lookup_PayAccount`](../../pay/components/Pay03_Lookup_PayAccount.md), [`Pay04_Lookup_Formula`](../../pay/components/Pay04_Lookup_Formula.md), [`Pay31_Popup_InsureApply`](../../pay/components/Pay31_Popup_InsureApply.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp35_Deduct.deleteAll` | Emp35_TabPage_DeductInsert:254 | [`Emp35_Deduct.java:128`](../../emp/services/Emp35_Deduct.md) | [`emp35_deduct.deleteByDeductId`](../../emp/sql/emp35_deduct.md), [`emp36_add_deduct.deleteByDeductId`](../../emp/sql/emp36_add_deduct.md) |
| `emp.Emp35_Deduct.insert` | Emp35_Popup_DeductCreate:94 | [`Emp35_Deduct.java:60`](../../emp/services/Emp35_Deduct.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp35_deduct.deleteByDeductId`](../../emp/sql/emp35_deduct.md), [`emp35_deduct.insert`](../../emp/sql/emp35_deduct.md), [`emp35_deduct.selectByCompanyId`](../../emp/sql/emp35_deduct.md), [`emp36_add_deduct.addDeductTypeInsert`](../../emp/sql/emp36_add_deduct.md), [`emp36_add_deduct.deleteByDeductId`](../../emp/sql/emp36_add_deduct.md) |
| `emp.Emp35_Deduct.selectByPersonId` | Emp35_Page_DeductDate:125 | [`Emp35_Deduct.java:28`](../../emp/services/Emp35_Deduct.md) | [`emp35_deduct.selectByPersonId`](../../emp/sql/emp35_deduct.md) |
| `emp.Emp35_Deduct.selectByStdDate` | Emp35_Tab_DeductPerson:191 | [`Emp35_Deduct.java:42`](../../emp/services/Emp35_Deduct.md) | [`emp35_deduct.selectByStdDate`](../../emp/sql/emp35_deduct.md) |
| `emp.Emp35_Deduct.update` | Emp35_TabPage_DeductInsert:223 | [`Emp35_Deduct.java:138`](../../emp/services/Emp35_Deduct.md) | `UpdateDataModel(emp35_deduct)` 동적 INSERT/UPDATE → [`emp35_deduct.selectById`](../../emp/sql/emp35_deduct.md) |
| `emp.Emp36_AddDeduct.selectByDeductId` | Emp36_Popup_AddDeduct:104 | [`Emp36_AddDeduct.java:27`](../../emp/services/Emp36_AddDeduct.md) | [`emp36_add_deduct.selectByDeductId`](../../emp/sql/emp36_add_deduct.md) |
| `emp.Emp36_AddDeduct.updateDeductCnt` | Emp36_Popup_AddDeduct:117 | [`Emp36_AddDeduct.java:33`](../../emp/services/Emp36_AddDeduct.md) | `UpdateDataModel(emp36_add_deduct)` 동적 INSERT/UPDATE → [`emp36_add_deduct.selectById`](../../emp/sql/emp36_add_deduct.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp35_deduct`](../../../db/tables/emp.md), [`emp36_add_deduct`](../../../db/tables/emp.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_4insure_yn`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp35_Tab_DeductPerson (`client/vi/emp/Emp35_Tab_DeductPerson.java`, 239줄)

- 레이아웃: center=vlc, south=deductPage
- 툴바 `buttonBar`: 재직구분: {transName} 사원명: {personName} {retrieveButton} {settingButton} {formulaButton} {payAccountButton}
- 입력·하위 화면: `transName` StringComboBox, `personName` LookupTriggerField 빈칸="전체", `personId` LongField, `deductPage` Emp35_Page_DeductDate, `lookup` Emp00_Lookup_SelectSingle, `lookupBasicSetup` pay30_Popup_BasicSetup, `lookupformula` Pay04_Lookup_Formula, `lookupPayAccount` Pay03_Lookup_PayAccount
- 그리드 `grid` (buildGrid()):
  - personNo 70 "사번" TextCenter
  - personName 100 "성명" TextCenter
  - hireDate 150 "입사일" Date
  - birthday 150 "생년월일" Date
  - basicDeductCnt 150 "공제대상가족수" LongCenter
  - addDeductYn 150 "추가인적공제여부" Boolean
  - insureYn 150 "4대보험가입" Boolean
  - reprYn 150 "고용보험 미납부" Boolean
  - npsYn 150 "국민연금 미납부" Boolean
  - withHoldRate 150 "원천징수 비율(%)" LongCenter

#### 이벤트
[E0] 화면 열림 (생성자 L58-62) → init(), eventSetting(), retrieve()
[E1] transName[재직].Collapse (L89) → retrieve()
[E2] personName.TriggerClick (L96) → openLookupPerson()
[E3] retrieveButton[조회].Select (L102) → retrieve()
[E4] settingButton[기본설정].Select (L108) → setting()
[E5] formulaButton[임금계산방법].Select (L114) → lookupformula()
[E6] payAccountButton[급여출금계좌].Select (L121) → lookupPayAccount()
[E7] grid.SelectionChanged (L128) → retrieveDeductDate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private eventSetting() | L64-134 | 생성자 | 상태 처리 | 업무 |
| public init() | L136-153 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L171-192 | 생성자,E1,E3 | 서비스 emp.Emp35_Deduct.selectByStdDate(companyId, personId, stdDate, transCode) | 업무 |
| public openLookupPerson() | L194-209 | E2 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public setting() | L211-217 | E4 | 팝업 pay30_Popup_BasicSetup 열기 | 업무 |
| public retrieveDeductDate() | L219-224 | E7 | 상태 처리 | 업무 |
| public lookupformula() | L226-229 | E5 | 조회창 Pay04_Lookup_Formula 열기 | 업무 |
| private lookupPayAccount() | L231-234 | E6 | 조회창 Pay03_Lookup_PayAccount 열기 | 업무 |
| private buildGrid() | L155-169 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L236-238 | eventSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 70, '사번'),  // L157 SQL 계산 컬럼(selectByStdDate: emp01_emp_no)
  gb.textCenter('personNm', 100, '성명'),  // L158 SQL 계산 컬럼(selectByStdDate: emp01_kor_nm)
  gb.date('hireDate', 150, '입사일'),  // L159 SQL 계산 컬럼(selectByStdDate: emp01_hire_date)
  gb.date('birthDay', 150, '생년월일'),  // L160 SQL 계산 컬럼(selectByStdDate: emp02_birthday)
  gb.longCenter('basicDeductCnt', 150, '공제대상가족수'),  // L161
  gb.boolean('addDeductYn', 150, '추가인적공제여부'),  // L162
  gb.boolean('insureYn', 150, '4대보험가입'),  // L163
  gb.boolean('reprYn', 150, '고용보험 미납부'),  // L164
  gb.boolean('npsYn', 150, '국민연금 미납부'),  // L165 SQL 계산 컬럼(selectByStdDate: CASE WHEN f_get_4insure_yn(emp35_person…)
  gb.longCenter('withHoldRate', 150, '원천징수 비율(%)'),  // L166
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="settings" onClick={setting}>기본설정</Button>
3. <Button type="view" onClick={lookupformula}>임금계산방법</Button>
4. <Button type="view" onClick={lookupPayAccount}>급여출금계좌</Button>

### Emp35_Page_DeductDate (`client/vi/emp/Emp35_Page_DeductDate.java`, 175줄)

- 레이아웃: north=buttonBar, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton}
- 입력·하위 화면: `DeductInsertPage` Emp35_TabPage_DeductInsert, `popUp` Emp35_Popup_DeductCreate
- 그리드 `grid` (buildGrid()):
  - startDate 190 "적용시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L39-41) → settings()
[E1] retrieveButton[조회].Select (L51) → retrieve()
[E2] insertButton[등록].Select (L57) → insert()
[E3] grid.SelectionChanged (L87) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L105-108 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L111-113 | E1,init,insert | 상태 처리 | 업무 |
| public retrieve() | L115-119 | E1,init,insert | 상태 처리 | 업무 |
| private retrieve() | L121-134 | E1,init,insert | 서비스 emp.Emp35_Deduct.selectByPersonId(companyId, personId) | 업무 |
| private retrievePerson() | L136-149 | retrieve | 서비스 emp.Emp35_Deduct.selectByPersonId(companyId, personId) | 업무 |
| private retrievePage() | L151-159 | E3,retrieve,retrievePerson | 상태 처리 | 업무 |
| private insert() | L161-168 | E2 | 팝업 Emp35_Popup_DeductCreate 열기 | 업무 |
| public getGrid() | L171-174 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L43-95 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L97-102 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),  // L100
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>

### Emp35_TabPage_DeductInsert (`client/vi/emp/Emp35_TabPage_DeductInsert.java`, 283줄)

- 입력·하위 화면: `startDate` MyDateField, `basicDeductCnt` LongField, `withHoldRate` LongField, `childDeductCnt` LongField, `addDeductYn` CheckBox, `insureYn` CheckBox, `reprYn` CheckBox, `popupAddDeduct` Emp36_Popup_AddDeduct, `insureApply` Pay31_Popup_InsureApply

#### 이벤트
[E0] 화면 열림 (생성자 L73-102) → getEditor()
[E1] updateButton[저장].Select (L83) → update()
[E2] deleteButton[삭제].Select (L89) → deleteChk()
       └ [E5] messageBox.DialogHide [YES] (L240) → delete()
[E3] anchor.MouseDown (L108) → 메시지 "추가인적공제 체크후 등록가능합니다"
[E4] anchor2.MouseDown (L139) → 인라인 L139-149 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L104-201 | 생성자 | 팝업 Emp36_Popup_AddDeduct 열기, 팝업 Pay31_Popup_InsureApply 열기 | 업무 |
| public retrieve() | L203-215 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L217-235 | E1 | 서비스 emp.Emp35_Deduct.update | 업무 |
| public deleteChk() | L237-249 | E2 | ConfirmBox → E5 | 업무 |
| public delete() | L251-265 | E5 | 서비스 emp.Emp35_Deduct.deleteAll(deductId) | 업무 |
| public init() | L267-269 | delete | 상태 처리 | 업무 |
| public init2() | L271-274 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L276-278 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L279-281 | 생성자,getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Emp36_Popup_AddDeduct (`client/vi/emp/Emp36_Popup_AddDeduct.java`, 128줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton}
- 그리드 `grid` (buildGrid()):
  - addDeductTypeName 150 "구분" TextCenter
  - addDeductCnt 120 "인원수" LongCenter 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L46-68) → settings(), show()
[E1] retrieveButton[조회].Select (L71) → retrieve()
[E2] updateButton[저장].Select (L77) → update()
[E3] closeButton[닫기].Select (L83) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-44 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L100-113 | E1,open,update | 서비스 emp.Emp36_AddDeduct.selectByDeductId(deductId) | 업무 |
| public update() | L115-123 | E2 | 서비스 emp.Emp36_AddDeduct.updateDeductCnt | 업무 |
| private settings() | L70-90 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L92-98 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L125-127 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('addDeductTypeNm', 150, '구분'),  // L95 SQL 계산 컬럼(selectByDeductId: f_cdnm('AddDeductType', emp36_add_deduc…)
  gb.longCenter('addDeductCnt', 120, '인원수', { editor: 'number' }),  // L96
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp35_Popup_DeductCreate (`client/vi/emp/Emp35_Popup_DeductCreate.java`, 117줄)

- 입력·하위 화면: `year` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L47-76) → show()
[E1] updateButton[생성].Select (L59) → update()
[E2] closeButton[닫기].Select (L65) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-45 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L78-86 | open | 상태 처리 | 업무 |
| public update() | L88-106 | E1 | 서비스 emp.Emp35_Deduct.insert(companyId, personId, startDate) | 업무 |
| private setHtmlStyle() | L109-111 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L113-115 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

