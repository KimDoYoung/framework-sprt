# Pay03_Lookup_PayAccount

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`
- 파일: `client/vi/pay/Pay03_Lookup_PayAccount.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay03_Account.delete` | Pay03_Lookup_PayAccount:197 | [`Pay03_Account.java:42`](../../pay/services/Pay03_Account.md) | `UpdateDataModel(pay03_account)` 동적 DELETE |
| `pay.Pay03_Account.selectByCompanyId` | Pay03_Lookup_PayAccount:169 | [`Pay03_Account.java:22`](../../pay/services/Pay03_Account.md) | [`pay03_account.selectByCompanyId`](../../pay/sql/pay03_account.md) |
| `pay.Pay03_Account.update` | Pay03_Lookup_PayAccount:175 | [`Pay03_Account.java:37`](../../pay/services/Pay03_Account.md) | `UpdateDataModel(pay03_account)` 동적 INSERT/UPDATE → [`pay03_account.selectById`](../../pay/sql/pay03_account.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`pay03_account`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay03_Lookup_PayAccount (`client/vi/pay/Pay03_Lookup_PayAccount.java`, 220줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupAst` LookupTriggerField, `bankComboBox` ComboBoxField("BankCode"), `lookupInfo` Ast01_Lookup_Info
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 120 "출금시작일" Date 편집:MyDateField
  - astClassTreeName 150 "계좌연결" Text 편집:lookupAst
  - bankName 150 "은행명" Text 편집:bankComboBox
  - accountNo 200 "계좌번호" Text 편집:TextField
  - accountName 150 "예금주명" Text 편집:TextField
  - note 250 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L63-116) → show()
[E1] retrieveButton[조회].Select (L70) → retrieve()
[E2] insertButton[등록].Select (L76) → insertRow()
[E3] deleteButton[삭제].Select (L82) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L190) → 서비스 pay.Pay03_Account.delete
[E4] updateButton[저장].Select (L88) → update()
[E5] cancleButton[닫기].Select (L94) → hide()
[E6] lookupAst.TriggerClick (L123) → lookupAst()
[E7] bankComboBox[BankCode].Collapse (L131) → 인라인 L131-138 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-61 | 공개 메서드 | 상태 처리 | 업무 |
| private lookupAst() | L151-164 | E6 | 조회창 Ast01_Lookup_Info 열기 | 업무 |
| public retrieve() | L166-170 | E1,open | 서비스 pay.Pay03_Account.selectByCompanyId(companyId), 건수 표시 | 업무 |
| public update() | L173-176 | E4 | 서비스 pay.Pay03_Account.update | 업무 |
| public insertRow() | L179-184 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L187-208 | E3 | ConfirmBox → E8 | 업무 |
| private buildGrid() | L118-149 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L210-212 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L214-217 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 120, '출금시작일', { editor: 'date' }),  // L141
  gb.text('astClassTreeNm', 150, '계좌연결'),  // L142 SQL 계산 컬럼(selectByCompanyId: ast01_class_tree_nm)
  gb.text('bankNm', 150, '은행명', { editor: 'select' }),  // L143 SQL 계산 컬럼(selectByCompanyId: f_cdnm('BankCode', pay03_bank_cd, pay03…)
  gb.text('accountNo', 200, '계좌번호', { editor: 'text' }),  // L144
  gb.text('accountNm', 150, '예금주명', { editor: 'text' }),  // L145
  gb.text('note', 250, '비고', { editor: 'text' }),  // L146
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

