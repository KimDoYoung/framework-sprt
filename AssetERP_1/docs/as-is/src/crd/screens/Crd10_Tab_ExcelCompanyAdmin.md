# Crd10_Tab_ExcelCompanyAdmin

- 종류: 화면
- 메뉴: 기초자료 > 30. 자산&경영 > 법인카드 업로드 기초자료(관리자) (#1352)
- 파일: `client/vi/crd/Crd10_Tab_ExcelCompanyAdmin.java`
- 함께 쓰는 클래스 1개:
  - `Crd11_Lookup_ExcelCodeAdmin` `client/vi/crd/Crd11_Lookup_ExcelCodeAdmin.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `crd.Crd10_ExcelCompany.delete` | Crd10_Tab_ExcelCompanyAdmin:209 | [`Crd10_ExcelCompany.java:38`](../../crd/services/Crd10_ExcelCompany.md) | `UpdateDataModel(crd10_excel_company)` 동적 DELETE |
| `crd.Crd10_ExcelCompany.selectByCompanyId` | Crd10_Tab_ExcelCompanyAdmin:141 | [`Crd10_ExcelCompany.java:25`](../../crd/services/Crd10_ExcelCompany.md) | [`crd10_excel_company.selectByCompanyId`](../../crd/sql/crd10_excel_company.md) |
| `crd.Crd10_ExcelCompany.update` | Crd10_Tab_ExcelCompanyAdmin:176 | [`Crd10_ExcelCompany.java:33`](../../crd/services/Crd10_ExcelCompany.md) | `UpdateDataModel(crd10_excel_company)` 동적 INSERT/UPDATE → [`crd10_excel_company.selectById`](../../crd/sql/crd10_excel_company.md) |
| `crd.Crd11_ExcelCode.delete` | Crd11_Lookup_ExcelCodeAdmin:199 | [`Crd11_ExcelCode.java:60`](../../crd/services/Crd11_ExcelCode.md) | `UpdateDataModel(crd11_excel_code)` 동적 DELETE |
| `crd.Crd11_ExcelCode.selectByCompanyId` | Crd11_Lookup_ExcelCodeAdmin:159 | [`Crd11_ExcelCode.java:26`](../../crd/services/Crd11_ExcelCode.md) | [`crd11_excel_code.selectByCompanyId`](../../crd/sql/crd11_excel_code.md) |
| `crd.Crd11_ExcelCode.update` | Crd11_Lookup_ExcelCodeAdmin:231 | [`Crd11_ExcelCode.java:55`](../../crd/services/Crd11_ExcelCode.md) | `UpdateDataModel(crd11_excel_code)` 동적 INSERT/UPDATE → [`crd11_excel_code.selectById`](../../crd/sql/crd11_excel_code.md) |

## 테이블

[`crd10_excel_company`](../../../db/tables/crd.md), [`crd11_excel_code`](../../../db/tables/crd.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crd10_Tab_ExcelCompanyAdmin (`client/vi/crd/Crd10_Tab_ExcelCompanyAdmin.java`, 212줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `creditCardCompanyComboBox` ComboBoxField("CreditCardCompany"), `openLookup` Crd11_Lookup_ExcelCodeAdmin
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bankName 150 "카드사명" Text 편집:creditCardCompanyCo…
  - actionCell 80 "맵핑" Cell 편집:actionCell
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L52-102) → retrieve()
[E1] retrieveButton[조회].Select (L61) → retrieve()
[E2] insertButton[등록].Select (L68) → insertRow()
[E3] updateButton[저장].Select (L75) → update()
[E4] deleteButton[삭제].Select (L82) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L189) → deleteRow()
[E5] creditCardCompanyComboBox[CreditCardCompany].Collapse (L109) → 인라인 L109-117 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L137-148 | 생성자,E1 | 서비스 crd.Crd10_ExcelCompany.selectByCompanyId(companyId) | 업무 |
| public update() | L150-177 | E3 | 서비스 crd.Crd10_ExcelCompany.update | 업무 |
| public insertRow() | L179-184 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L186-204 | E4 | ConfirmBox → E6 | 업무 |
| public deleteRow() | L206-210 | E6 | GridDeleteData crd.Crd10_ExcelCompany.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L104-135 | 필드 초기화 | 조회창 Crd11_Lookup_ExcelCodeAdmin 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('bankNm', 150, '카드사명', { editor: 'select' }),  // L130 SQL 계산 컬럼(selectByCompanyId: f_cdnm('CreditCardCompany', crd10_bank_…)
  // ⚠ 대응 없음 (GridBuilder L131) addCell
  gb.text('note', 500, '비고', { editor: 'text' }),  // L132
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Crd11_Lookup_ExcelCodeAdmin (`client/vi/crd/Crd11_Lookup_ExcelCodeAdmin.java`, 237줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `cardExcelCodeComboBox` ComboBoxField("CreditCardExcelCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bankExcelName 200 "업로드 구분코드" Text 편집:cardExcelCodeComboB…
  - seq 100 "위치(세로줄)" LongCenter 편집:LongField
  - text 280 "비고" TextArea 편집:MyTextArea

#### 이벤트
[E1] retrieveButton[조회].Select (L95) → retrieve()
[E2] insertButton[등록].Select (L101) → insertRow()
[E3] updateButton[저장].Select (L107) → update()
[E4] deleteButton[삭제].Select (L113) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L179) → deleteRow()
[E5] closeButton[닫기].Select (L120) → hide()
[E6] cardExcelCodeComboBox[CreditCardExcelCode].Collapse (L135) → 인라인 L135-143 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-92 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L94-127 | open | 상태 처리 | 업무 |
| public retrieve() | L153-165 | E1,open | 서비스 crd.Crd11_ExcelCode.selectByCompanyId(companyId, bankCode) | 업무 |
| private insertRow() | L167-174 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L176-194 | E4 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L196-200 | E7 | GridDeleteData crd.Crd11_ExcelCode.delete(체크된 행 목록) | 업무 |
| private update() | L202-232 | E3 | 서비스 crd.Crd11_ExcelCode.update | 업무 |
| private buildGrid() | L129-151 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L234-236 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('bankExcelNm', 200, '업로드 구분코드', { editor: 'select' }),  // L146 SQL 계산 컬럼(selectByCompanyId: f_cdnm('CreditCardExcelCode', crd11_ban…)
  gb.longCenter('seq', 100, '위치(세로줄)', { editor: 'number' }),  // L147
  gb.textArea('note', 280, '비고', { editor: 'largeText' }),  // L148
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

