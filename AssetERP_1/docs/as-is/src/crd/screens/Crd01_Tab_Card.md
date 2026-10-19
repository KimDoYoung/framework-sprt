# Crd01_Tab_Card

- 종류: 화면
- 메뉴: 경영관리 > 92. 법인카드 등록 > 법인카드 및 사용자등록 (#1478)
- 메뉴: 자금관리 > 30. 법인카드관리 > 법인카드 및 사용자등록 (#1038)
- 파일: `client/vi/crd/Crd01_Tab_Card.java`
- 함께 쓰는 클래스 2개:
  - `Crd03_Grid_User` `client/vi/crd/Crd03_Grid_User.java`
  - `Crd01_Edit_Card` `client/vi/crd/Crd01_Edit_Card.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `crd.Crd01_Card.delete` | Crd01_Tab_Card:331 | [`Crd01_Card.java:54`](../../crd/services/Crd01_Card.md) | `UpdateDataModel(crd01_card)` 동적 DELETE |
| `crd.Crd01_Card.selectByText` | Crd01_Tab_Card:251 | [`Crd01_Card.java:27`](../../crd/services/Crd01_Card.md) | [`crd01_card.selectByText`](../../crd/sql/crd01_card.md) |
| `crd.Crd01_Card.update` | Crd01_Edit_Card:231 | [`Crd01_Card.java:49`](../../crd/services/Crd01_Card.md) | `UpdateDataModel(crd01_card)` 동적 INSERT/UPDATE → [`crd01_card.selectById`](../../crd/sql/crd01_card.md) |
| `crd.Crd02_Data.selectByCardNo` | Crd01_Edit_Card:207, Crd01_Tab_Card:292 | [`Crd02_Data.java:26`](../../crd/services/Crd02_Data.md) | [`crd02_data.selectByCardNo`](../../crd/sql/crd02_data.md) |
| `crd.Crd03_Trans.delete` | Crd03_Grid_User:229 | [`Crd03_Trans.java:48`](../../crd/services/Crd03_Trans.md) | `UpdateDataModel(crd03_trans)` 동적 DELETE |
| `crd.Crd03_Trans.deleteByCardId` | Crd01_Tab_Card:323 | [`Crd03_Trans.java:34`](../../crd/services/Crd03_Trans.md) | [`crd03_trans.deleteByCardId`](../../crd/sql/crd03_trans.md) |
| `crd.Crd03_Trans.selectByCardId` | Crd03_Grid_User:161 | [`Crd03_Trans.java:27`](../../crd/services/Crd03_Trans.md) | [`crd03_trans.selectByCardId`](../../crd/sql/crd03_trans.md) |
| `crd.Crd03_Trans.update` | Crd03_Grid_User:196 | [`Crd03_Trans.java:43`](../../crd/services/Crd03_Trans.md) | `UpdateDataModel(crd03_trans)` 동적 INSERT/UPDATE → [`crd03_trans.selectById`](../../crd/sql/crd03_trans.md) |
| `sys.Sys00_Common.selectCardManager` | Crd01_Tab_Card:65 | [`Sys00_Common.java:81`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCardManager`](../../sys/sql/sys00_common.md) |

## 테이블

[`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crd01_Tab_Card (`client/vi/crd/Crd01_Tab_Card.java`, 381줄)

- 레이아웃: center=vlc, south=hlc
- 툴바 `buttonBar`: 사용자: {cardManagerCombo} 검색: {searchText} {useYn} {retrieveButton} {insertButton} {deleteButton} {uploadExcelForm} {downloadForm} {tempDownloadButton} {excelUploadButton}
- 입력·하위 화면: `editForm` Crd01_Edit_Card, `cardManagerCombo` CommonComboBoxField("sys.Sys00_Common.selectCardManager", "%", "전체"), `searchText` TextField 빈칸="카드번호/명을 입력하세요.", `useYn` CheckBox
- 그리드 `grid` (buildGrid()):
  - cardName 200 "카드명" Text
  - cardManagerName 100 "카드사용자" TextCenter
  - cardNoSlip 230 "카드번호" Text
  - bankName 200 "카드회사" Text
  - frDate 100 "시작일자" Date
  - toDate 100 "종료일자" Date
  - cardNo 230 "사용내역 업로드 식별구분" Text
  - cardTypeName 80 "카드구분" Text
  - closeYn 80 "사용여부" BooleanString
  - note 200 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L80-83) → init(), retrieve()
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L102) → retrieve()
[E3] insertButton[등록].Select (L108) → insertRow()
[E4] deleteButton[삭제].Select (L114) → deleteCheck()
       └ [E9] msgBox.DialogHide [YES] (L285) → delete()
[E5] tempDownloadButton[템플릿].Select (L125) → 인라인 L125-130 (new SelectHandler(){ @Override public…)
[E6] excelUploadButton[엑셀업로드].Select (L132) → excelUpload()
[E7] uploadExcelForm.SubmitComplete (L142) → retrieve()
[E8] grid.SelectionChanged [선택>0] (L197) → 인라인 L197-211 (new SelectionChangedHandler<Crd01_Car…)
[E10] fileUploadField.Change (L352) → 인라인 L352-357 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L85-214 | 생성자 | 미선택 시 alert "업로드가 완료되었습니다" | 업무 |
| public retrieve() | L235-268 | 생성자,E1,E2,E7,init | 서비스 crd.Crd01_Card.selectByText(searchText, bankCardCode, companyId, useYn, managerId) | 업무 |
| public insertRow() | L270-280 | E3 | 상태 처리 | 업무 |
| private deleteCheck() | L282-317 | E4 | ConfirmBox → E9 | 업무 |
| public delete() | L319-341 | E9 | GridDeleteData crd.Crd03_Trans.deleteByCardId, crd.Crd01_Card.delete | 업무 |
| private excelUpload() | L343-360 | E6 | 상태 처리 | 업무 |
| private getManagerId() | L362-372 | retrieve | 상태 처리 | 업무 |
| private buildGrid() | L216-233 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L374-376 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L378-380 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('cardNm', 200, '카드명'),  // L221
  gb.textCenter('cardManagerNm', 100, '카드사용자'),  // L222 SQL 계산 컬럼(selectCardManager: f_emp_kor_nm(crd03_person_id))
  gb.text('cardNoSlip', 230, '카드번호'),  // L223
  gb.text('bankNm', 200, '카드회사'),  // L224 SQL 계산 컬럼(selectByText: f_cdnm('CreditCardCompany', crd01_bank_…)
  gb.date('frDt', 100, '시작일자'),  // L225
  gb.date('toDt', 100, '종료일자'),  // L226
  gb.text('cardNo', 230, '사용내역 업로드 식별구분'),  // L227
  gb.text('cardTypeNm', 80, '카드구분'),  // L228 SQL 계산 컬럼(selectByText: f_cdnm('CardType', crd01_card_type, crd…)
  // ⚠ 대응 없음 (GridBuilder L229) addBooleanString
  gb.text('note', 200, '비고'),  // L230
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="download" onClick={() => /* 인라인 L125-130 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
5. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

### Crd03_Grid_User (`client/vi/crd/Crd03_Grid_User.java`, 267줄)

- 입력·하위 화면: `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - frDt 100 "시작일자" Date 편집:MyDateField
  - toDt 100 "종료일자" Date 편집:MyDateField
  - personName 100 "직원" Text 편집:lookupEmpInfo
  - titleName 100 "직급" Text
  - orgName 300 "부서" Text
  - publicYn 100 "공통카드 여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L56-91) → 초기화
[E1] retrieveButton[조회].Select (L57) → retrieve()
[E2] insertButton[등록].Select (L65) → insertRow()
[E3] updateButton[저장].Select (L73) → update()
[E4] deleteButton[삭제].Select (L81) → deleteRow()
       └ [E6] messageBox.DialogHide (L223) → 서비스 crd.Crd03_Trans.delete
[E5] lookupEmpInfo.TriggerClick (L96) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L118-121 | E1 | 상태 처리 | 업무 |
| private openLookupEmpInfo() | L123-152 | E5 | 조회창 Emp00_Lookup_SelectSingle 열기, 미선택 시 alert "시작일자를 입력해주세요." | 업무 |
| public retrieve() | L155-162 | E1 | 서비스 crd.Crd03_Trans.selectByCardId(cardId, companyId) | 업무 |
| public update() | L165-197 | E3 | 서비스 crd.Crd03_Trans.update | 업무 |
| private isDateOverlap() | L198-218 | update | 상태 처리 | 업무 |
| public deleteRow() | L220-242 | E4 | ConfirmBox → E6 | 업무 |
| public insertRow() | L245-266 | E2 | 상태 처리 | 업무 |
| private buildGrid() | L93-116 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('frDt', 100, '시작일자', { editor: 'date' }),  // L106
  gb.date('toDt', 100, '종료일자', { editor: 'date' }),  // L107
  gb.text('personNm', 100, '직원'),  // L108 SQL 계산 컬럼(selectByCardId: f_emp_kor_nm(crd03_person_id))
  gb.text('titleNm', 100, '직급'),  // L109 SQL 계산 컬럼(selectByCardId: f_get_empTrans(crd03_person_id, coalesc…)
  gb.text('orgNm', 300, '부서'),  // L110 SQL 계산 컬럼(selectByCardId: f_get_empTrans(crd03_person_id, coalesc…)
  gb.boolean('publicYn', 100, '공통카드 여부'),  // L111
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Crd01_Edit_Card (`client/vi/crd/Crd01_Edit_Card.java`, 264줄)

- 입력·하위 화면: `cardName` TextField, `cardNo` TextField, `cardNoSlip` TextField, `note` TextField, `frDate` MyDateField, `toDate` MyDateField, `closeYn` CheckBox, `bankCode` TextField, `bankName` ComboBoxField("CreditCardCompany"), `cardType` TextField, `cardTypeName` ComboBoxField("CardType"), `depositId` LongField, `depositName` LookupTriggerField, `lookup` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L75-86) → setting(), getEditor()
[E1] cardTypeName[카드구분].Collapse (L90) → 인라인 L90-95 (new CollapseHandler() { @Override pub…)
[E2] depositName[결제계좌].TriggerClick [result != null] (L105) → 인라인 L105-123 (new TriggerClickHandler() { @Override…)
[E3] updateButton[저장].Select (L125) → updateCheck()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L88-131 | 생성자 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private getEditor() | L133-187 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L189-197 | 공개 메서드 | 상태 처리 | 업무 |
| private updateCheck() | L199-227 | E3 | 서비스 crd.Crd02_Data.selectByCardNo(cardNo, companyId) | 업무 |
| public update() | L229-243 | updateCheck | 서비스 crd.Crd01_Card.update | 업무 |
| private setHtmlStyle() | L259-261 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateCheck}>저장</Button>

