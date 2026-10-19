# Fnd08_Tab_OrgAuth

- 종류: 화면
- 메뉴: 펀드관리 > 02. 펀드관리 > 펀드 권한설정 (#1050)
- 파일: `client/vi/fnd/Fnd08_Tab_OrgAuth.java`
- 함께 쓰는 클래스 4개:
  - `Fnd08_Page_OrgAuth` `client/vi/fnd/Fnd08_Page_OrgAuth.java`
  - `Fnd08_Lookup_OrgCode` `client/vi/fnd/Fnd08_Lookup_OrgCode.java`
  - `Fnd08_Lookup_OrgAuth` `client/vi/fnd/Fnd08_Lookup_OrgAuth.java`
  - `Fnd00_Lookup_FundCode` `client/vi/fnd/Fnd00_Lookup_FundCode.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Fnd01_Lookup_SelectMulti`](../../fnd/components/Fnd01_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd00_Fund.selectByLookupFundCode` | Fnd00_Lookup_FundCode:185 | [`Fnd00_Fund.java:100`](../../fnd/services/Fnd00_Fund.md) | [`fnd00_fund.selectByLookupFundCode`](../../fnd/sql/fnd00_fund.md) |
| `fnd.Fnd01_FundCode.delete` | Fnd08_Tab_OrgAuth:293 | [`Fnd01_FundCode.java:222`](../../fnd/services/Fnd01_FundCode.md) | `UpdateDataModel(fnd02_fund_info)` 동적 DELETE, `UpdateDataModel(fnd01_fund_code)` 동적 DELETE |
| `fnd.Fnd01_FundCode.selectByFundName` | Fnd08_Tab_OrgAuth:246 | [`Fnd01_FundCode.java:38`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundName`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd01_FundCode.selectByFundOrgAuth` | Fnd08_Tab_OrgAuth:248 | [`Fnd01_FundCode.java:56`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundOrgAuth`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd08_OrgAuth.updateAuthYn` | Fnd08_Lookup_OrgAuth:300 | [`Fnd08_OrgAuth.java:37`](../../fnd/services/Fnd08_OrgAuth.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd08_org_auth.checkOrgAuth`](../../fnd/sql/fnd08_org_auth.md), `UpdateDataModel(fnd08_org_auth)` 동적 INSERT/UPDATE → [`fnd08_org_auth.selectById`](../../fnd/sql/fnd08_org_auth.md) |
| `org.Org01_Code.selectByFundCodeId` | Fnd08_Page_OrgAuth:94 | [`Org01_Code.java:221`](../../org/services/Org01_Code.md) | [`org01_code.selectByFundCodeId`](../../org/sql/org01_code.md) |
| `org.Org01_Code.selectByKorName` | Fnd08_Lookup_OrgCode:136 | [`Org01_Code.java:34`](../../org/services/Org01_Code.md) | [`org01_code.selectByKorName`](../../org/sql/org01_code.md) |
| `org.Org01_Code.updateFundAuth` | Fnd08_Page_OrgAuth:134 | [`Org01_Code.java:376`](../../org/services/Org01_Code.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(fnd08_org_auth)` 동적 INSERT/UPDATE → [`fnd08_org_auth.selectById`](../../fnd/sql/fnd08_org_auth.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fnd00_fund`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_max_workdate`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd08_Tab_OrgAuth (`client/vi/fnd/Fnd08_Tab_OrgAuth.java`, 311줄)

- 레이아웃: north=buttonBar, west=grid, center=orgAuthTree
- 툴바 `buttonBar`: 권한부서: {orgKorName} 펀드유형: {fundTypeComboBox} 클래스구분: {classTypeComboBox} 펀드찾기: {lookupPlanFundField} {closeYnCheckBox} {retrieveButton} {authAllButton}
- 입력·하위 화면: `closeYnCheckBox` CheckBox, `lookupPlanFundField` LookupTriggerField 빈칸="전체", `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `classTypeComboBox` ComboBoxField("IcamClassType", "%", "전체"), `orgKorName` LookupTriggerField 빈칸="전체", `transDate` MyDateField, `orgCodeId` LongField, `orgAuthTree` Fnd08_Page_OrgAuth, `orgSearch` Fnd08_Lookup_OrgCode, `lookup` Fnd08_Lookup_OrgAuth, `lookupFundCode` Fnd00_Lookup_FundCode
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - fundCode 90 "코드" TextFrozen 편집:"center"
  - fundName 350 "펀드명" TextFrozen 편집:"left"
  - kofiaFundTypeName 120 "펀드유형" Text
  - startDate 90 "생성일" Date
  - endDate 90 "해지일" Date
  - closeName 60 "해지여부" Text
  - kofiaTrustName 120 "신탁구분" Text
  - kofiaPublicName 130 "공모" Text
  - orgCodeName 150 "운용부서" Text
  - operator1 90 "운용역1" Text
  - operator2 90 "운용역2" Text
  - note 200 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L65-106) → settings()
[E1] lookupPlanFundField.TriggerClick (L123) → openLookupFundCode()
[E2] orgKorName.TriggerClick (L131) → 인라인 L131-145 (new TriggerClickHandler(){ @Override …)
[E3] orgKorName.Change (L146) → 인라인 L146-153 (new ChangeHandler() { @Override publi…)
[E4] grid.SelectionChanged [선택>0] (L154) → retrieveEditPage()
[E5] retrieveButton[조회].Select (L162) → retrieve()
[E6] authAllButton[일괄 권한설정].Select (L168) → retrieve()
[E7] messageBox.DialogHide (L278) → deleteSelectedRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L206-215 | E4 | 상태 처리 | 업무 |
| private openLookupFundCode() | L217-226 | E1 | 조회창 Fnd00_Lookup_FundCode 열기 | 업무 |
| public retrieve() | L229-260 | E5,E6 | 서비스 fnd.Fnd01_FundCode.selectByFundName, fnd.Fnd01_FundCode.selectByFundOrgAuth(planYn, companyId, closeYn, startDate, fundName, fundTypeCode, classTypeCode, orgId, empId) | 업무 |
| public update() | L263-264 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L267-272 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L275-288 | 공개 메서드 | 확인창 표시 | 업무 |
| private deleteSelectedRow() | L290-302 | E7 | GridDeleteData fnd.Fnd01_FundCode.delete(체크된 행 목록) | 업무 |
| private settings() | L108-180 | 생성자 | 조회창 Fnd08_Lookup_OrgCode 열기, 조회창 Fnd08_Lookup_OrgAuth 열기, 이벤트 연결, 초기값: fundTypeComboBox="전체"("IcamFundType"), classTypeComboBox="전체"("IcamClassType"), closeYnCheckBox=false("해지펀드포함"), orgKorName=codeModel.getOrgInfoModel(, orgCodeId=codeModel.getCodeId(, orgCodeId=null | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L182-204 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L304-306 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L308-310 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L187) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L188) addTextFrozen
  gb.text('kofiaFundTypeNm', 120, '펀드유형'),  // L192
  gb.date('startDate', 90, '생성일'),  // L193
  gb.date('endDate', 90, '해지일'),  // L194
  gb.text('closeNm', 60, '해지여부'),  // L195
  gb.text('kofiaTrustNm', 120, '신탁구분'),  // L196
  gb.text('kofiaPublicNm', 130, '공모'),  // L197
  gb.text('orgCodeNm', 150, '운용부서'),  // L198
  gb.text('operator1', 90, '운용역1'),  // L199
  gb.text('operator2', 90, '운용역2'),  // L200
  gb.text('note', 200, '비고'),  // L201
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={retrieve}>일괄 권한설정</Button>

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

### Fnd08_Lookup_OrgAuth (`client/vi/fnd/Fnd08_Lookup_OrgAuth.java`, 331줄)

- 툴바 `buttonBar01`: 펀드: {insertButton01} {deleteButton01}
- 툴바 `buttonBar02`: 부서: {insertButton02} {deleteButton02}
- 입력·하위 화면: `lookupFundInfo` Fnd01_Lookup_SelectMulti, `lookup` Org00_Lookup_SelectMulti
- 그리드 `grid01` (buildGrid01(), 체크박스(다중)):
  - fundCode 90 "코드" TextCenter
  - fundName 400 "펀드명" Text
  - kofiaFundTypeName 120 "펀드유형" Text
- 그리드 `grid02` (buildGrid02(), 체크박스(다중)):
  - korName 300 "조직명" Text
  - orgCode 60 "조직코드" Text

#### 이벤트
[E0] 화면 열림 (생성자 L76-121) → settings()
[E1] insertButton01[행 추가].Select (L124) → insertRow01()
[E2] deleteButton01[행 삭제].Select (L130) → deleteRow01()
[E3] insertButton02[행 추가].Select (L136) → insertRow02()
[E4] deleteButton02[행 삭제].Select (L142) → deleteRow02()
[E5] confirmButton[권한부여].Select (L148) → confirm()
       └ [E8] msgBox.DialogHide [YES] (L293) → hide()
[E6] cancleButton[권한삭제].Select (L155) → confirm()
[E7] closeButton[닫기].Select (L161) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L71-74 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid01() | L169-177 | 필드 초기화 | 상태 처리 | 업무 |
| private insertRow01() | L179-205 | E1 | 조회창 Fnd01_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow01() | L207-212 | E2 | 상태 처리 | 업무 |
| public buildGrid02() | L214-221 | 필드 초기화 | 상태 처리 | 업무 |
| private insertRow02() | L223-248 | E3 | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow02() | L250-255 | E4 | 상태 처리 | 업무 |
| private confirm() | L257-322 | E5,E6 | ConfirmBox → E8 | 업무 |
| private settings() | L123-167 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L324-326 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L328-330 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.textCenter('fundCd', 90, '코드'),  // L172
  gb.text('fundNm', 400, '펀드명'),  // L173
  gb.text('kofiaFundTypeNm', 120, '펀드유형'),  // L174
];

const buildGrid02 = () => [
  gb.text('korNm', 300, '조직명'),  // L217
  gb.text('orgCd', 60, '조직코드'),  // L218
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={confirm}>권한부여</Button>
2. <Button type="unknown" onClick={confirm}>권한삭제</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="addRow" onClick={insertRow01}>행 추가</Button>
5. <Button type="removeRow" onClick={deleteRow01}>행 삭제</Button>
6. <Button type="addRow" onClick={insertRow02}>행 추가</Button>
7. <Button type="removeRow" onClick={deleteRow02}>행 삭제</Button>

### Fnd00_Lookup_FundCode (`client/vi/fnd/Fnd00_Lookup_FundCode.java`, 222줄)

- 툴바 `searchBar`: {searchField} {fundTypeField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `fundNameText` TextField 빈칸="전체", `closeYnCheckBox` CheckBox, `fundTypeComboBox` ComboBoxField("FundTypeCode", "%", "전체")
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 80 "펀드코드" Text
  - fundName 300 "펀드명" Text
  - fundTypeName 100 "펀드유형" Text
  - orgCodeName 200 "운용부서" Text
  - startDate 100 "설정일" Date
  - closeName 80 "해지구분" Text
  - note 200 "비고" Text

#### 이벤트
[E1] fundNameText[검색].KeyPress [Enter] (L77) → retrieve()
[E2] retrieveButton[조회].Select (L101) → retrieve()
[E3] okButton[확인].Select (L115) → confirm()
[E4] cancelButton[취소].Select (L123) → hide()
[E5] grid.CellDoubleClick (L132) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L55-57 | retrieve | 상태 처리 | 업무 |
| public open() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L65-142 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L162-191 | E1,E2,execute,open | 서비스 fnd.Fnd00_Fund.selectByLookupFundCode(companyId, closeYn, fundName, fundTypeCode, workDate) | 업무 |
| private confirm() | L193-205 | E3,E5 | 미선택 시 alert "조회할 펀드를 선택해주세요" | 업무 |
| public getServiceResult() | L208-216 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L144-160 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L218-220 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 80, '펀드코드'),  // L148
  gb.text('fundNm', 300, '펀드명'),  // L149
  gb.text('fundTypeNm', 100, '펀드유형'),  // L150
  gb.text('orgCodeNm', 200, '운용부서'),  // L151
  gb.date('startDate', 100, '설정일'),  // L152
  gb.text('closeNm', 80, '해지구분'),  // L153
  gb.text('note', 200, '비고'),  // L154
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

