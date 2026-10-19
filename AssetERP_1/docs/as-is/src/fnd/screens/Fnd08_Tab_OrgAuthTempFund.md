# Fnd08_Tab_OrgAuthTempFund

- 종류: 화면
- 메뉴: 펀드관리 > 01. 상품기획 > 신규기획펀드 권한설정 (#1047)
- 파일: `client/vi/fnd/Fnd08_Tab_OrgAuthTempFund.java`
- 함께 쓰는 클래스 2개:
  - `Fnd08_Page_OrgAuth` `client/vi/fnd/Fnd08_Page_OrgAuth.java`
  - `Fnd08_Lookup_OrgCode` `client/vi/fnd/Fnd08_Lookup_OrgCode.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd01_FundCode.delete` | Fnd08_Tab_OrgAuthTempFund:248 | [`Fnd01_FundCode.java:222`](../../fnd/services/Fnd01_FundCode.md) | `UpdateDataModel(fnd02_fund_info)` 동적 DELETE, `UpdateDataModel(fnd01_fund_code)` 동적 DELETE |
| `fnd.Fnd01_FundCode.selectByFundName` | Fnd08_Tab_OrgAuthTempFund:201 | [`Fnd01_FundCode.java:38`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundName`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd01_FundCode.selectByFundOrgAuth` | Fnd08_Tab_OrgAuthTempFund:203 | [`Fnd01_FundCode.java:56`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundOrgAuth`](../../fnd/sql/fnd01_fund_code.md) |
| `org.Org01_Code.selectByFundCodeId` | Fnd08_Page_OrgAuth:94 | [`Org01_Code.java:221`](../../org/services/Org01_Code.md) | [`org01_code.selectByFundCodeId`](../../org/sql/org01_code.md) |
| `org.Org01_Code.selectByKorName` | Fnd08_Lookup_OrgCode:136 | [`Org01_Code.java:34`](../../org/services/Org01_Code.md) | [`org01_code.selectByKorName`](../../org/sql/org01_code.md) |
| `org.Org01_Code.updateFundAuth` | Fnd08_Page_OrgAuth:134 | [`Org01_Code.java:376`](../../org/services/Org01_Code.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(fnd08_org_auth)` 동적 INSERT/UPDATE → [`fnd08_org_auth.selectById`](../../fnd/sql/fnd08_org_auth.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_max_workdate`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd08_Tab_OrgAuthTempFund (`client/vi/fnd/Fnd08_Tab_OrgAuthTempFund.java`, 266줄)

- 레이아웃: north=buttonBar, west=grid, center=orgAuthTree
- 툴바 `buttonBar`: 권한부서: {orgKorName} 펀드유형: {fundTypeComboBox} 클래스구분: {classTypeComboBox} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `closeYnCheckBox` CheckBox, `lookupPlanFundField` LookupTriggerField, `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `classTypeComboBox` ComboBoxField("IcamClassType", "%", "전체"), `orgKorName` LookupTriggerField 빈칸="전체", `transDate` MyDateField, `orgCodeId` LongField, `orgAuthTree` Fnd08_Page_OrgAuth, `orgSearch` Fnd08_Lookup_OrgCode
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 70 "코드" Text
  - fundName 250 "펀드명" Text
  - kofiaFundTypeName 100 "펀드유형" Text
  - startDate 90 "등록일" Date
  - endDate 90 "예정일" Date
  - closeName 60 "해지여부" Text
  - orgCodeName 150 "운용부서" Text
  - operator1 90 "운용역" Text
  - note 200 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L61-97) → settings()
[E1] orgKorName.TriggerClick (L114) → 인라인 L114-128 (new TriggerClickHandler(){ @Override …)
[E2] orgKorName.Change (L129) → 인라인 L129-136 (new ChangeHandler() { @Override publi…)
[E3] retrieveButton[조회].Select (L137) → retrieve()
[E4] grid.SelectionChanged [선택>0] (L143) → retrieveEditPage()
[E5] messageBox.DialogHide (L233) → deleteSelectedRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L171-180 | E4 | 상태 처리 | 업무 |
| public retrieve() | L183-215 | E3 | 서비스 fnd.Fnd01_FundCode.selectByFundName, fnd.Fnd01_FundCode.selectByFundOrgAuth(planYn, companyId, closeYn, startDate, fundName, fundTypeCode, classTypeCode, orgId, planYn, empId) | 업무 |
| public update() | L218-219 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L222-227 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L230-243 | 공개 메서드 | 확인창 표시 | 업무 |
| private deleteSelectedRow() | L245-257 | E5 | GridDeleteData fnd.Fnd01_FundCode.delete(체크된 행 목록) | 업무 |
| private settings() | L99-151 | 생성자 | 조회창 Fnd08_Lookup_OrgCode 열기, 이벤트 연결, 초기값: fundTypeComboBox="전체"("IcamFundType"), classTypeComboBox="전체"("IcamClassType"), closeYnCheckBox=false("해지펀드포함"), orgKorName=codeModel.getOrgInfoModel(, orgCodeId=codeModel.getCodeId(, orgCodeId=null | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L153-169 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L259-261 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L263-265 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 70, '코드'),  // L158
  gb.text('fundNm', 250, '펀드명'),  // L159
  gb.text('kofiaFundTypeNm', 100, '펀드유형'),  // L160
  gb.date('startDate', 90, '등록일'),  // L161
  gb.date('endDate', 90, '예정일'),  // L162
  gb.text('closeNm', 60, '해지여부'),  // L163
  gb.text('orgCodeNm', 150, '운용부서'),  // L164
  gb.text('operator1', 90, '운용역'),  // L165
  gb.text('note', 200, '비고'),  // L166
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Fnd08_Page_OrgAuth (`client/vi/fnd/Fnd08_Page_OrgAuth.java`, 147줄)

- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - korName 300 "조직명" Text
  - orgCode 60 "조직코드" Text
  - authYnCheck 40 "권한" Boolean
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L32-55) → 초기화
[E1] updateButton[저장].Select (L36) → update()
[E2] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L45) → getColumn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getColumn() | L57-82 | E2 | 상태 처리 | 업무 |
| public buildTreeGrid() | L84-91 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L93-99 | update | 서비스 org.Org01_Code.selectByFundCodeId | 업무 |
| private addChildItem() | L101-111 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L114-128 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L130-140 | E1 | 서비스 org.Org01_Code.updateFundAuth(fundCodeId) | 업무 |
| public retrieve() | L142-145 | update | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('korNm', 300, '조직명'),  // L86
  gb.text('orgCd', 60, '조직코드'),  // L87
  // ⚠DB없음 L88 authYnCheck 40 "권한" (org01_auth_yn_check 컬럼 없음)
  gb.text('note', 300, '비고'),  // L89
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

### Fnd08_Lookup_OrgCode (`client/vi/fnd/Fnd08_Lookup_OrgCode.java`, 155줄)

- 툴바 `searchBar`: {dateFieldLabel} {searchField} {retrieveButton}
- 입력·하위 화면: `korName` TextField, `baseDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스):
  - orgCode 80 "조직코드" Text
  - parentFullName 300 "조직명" Text
  - levelName 80 "조직구분" Text
  - modDate 100 "최근변경일" Date

#### 이벤트
[E1] korName[조직명].KeyPress [Enter] (L65) → retrieve()
[E2] retrieveButton[조회].Select (L74) → retrieve()
[E3] grid.CellDoubleClick (L86) → confirm()
[E4] oKButton[확인].Select (L95) → confirm()
[E5] cancelButton[닫기].Select (L103) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-114 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L131-137 | E1,E2,open | 서비스 org.Org01_Code.selectByKorName(companyId, korName, baseDate) | 업무 |
| public confirm() | L139-149 | E3,E4 | 미선택 시 alert "선택된 조직이 없습니다" | 업무 |
| private buildGrid() | L116-129 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L151-153 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgCd', 80, '조직코드'),  // L121
  // ⚠DB없음 L122 parentFullName 300 "조직명" (org01_parent_full_nm 컬럼 없음)
  gb.text('levelNm', 80, '조직구분'),  // L124
  gb.date('modDate', 100, '최근변경일'),  // L125
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

