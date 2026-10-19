# Pay03_Tab_Account

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리(Old) > 회사계좌관리(X) (#1086, 미사용)
- 파일: `client/vi/pay/Pay03_Tab_Account.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay03_Account.delete` | Pay03_Tab_Account:199 | [`Pay03_Account.java:42`](../../pay/services/Pay03_Account.md) | `UpdateDataModel(pay03_account)` 동적 DELETE |
| `pay.Pay03_Account.selectByCompanyId` | Pay03_Tab_Account:124 | [`Pay03_Account.java:22`](../../pay/services/Pay03_Account.md) | [`pay03_account.selectByCompanyId`](../../pay/sql/pay03_account.md) |
| `pay.Pay03_Account.update` | Pay03_Tab_Account:176 | [`Pay03_Account.java:37`](../../pay/services/Pay03_Account.md) | `UpdateDataModel(pay03_account)` 동적 INSERT/UPDATE → [`pay03_account.selectById`](../../pay/sql/pay03_account.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`pay03_account`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay03_Tab_Account (`client/vi/pay/Pay03_Tab_Account.java`, 210줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `bankComboBox` ComboBoxField("BankCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - bankName 200 "은행명" Text 편집:bankComboBox
  - accountNo 500 "계좌번호" Text 편집:TextField
  - accountName 200 "예금주명" Text 편집:TextField
  - payYn 100 "급여출금" Boolean
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L51-95) → 초기화
[E1] retrieveButton[조회].Select (L55) → retrieve()
[E2] insertButton[등록].Select (L62) → insertRow()
[E3] updateButton[저장].Select (L69) → update()
[E4] deleteButton[삭제].Select (L76) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L192) → 서비스 pay.Pay03_Account.delete
[E5] bankComboBox[BankCode].Collapse (L102) → 인라인 L102-109 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L120-131 | E1 | 서비스 pay.Pay03_Account.selectByCompanyId(companyId), 건수 표시 | 업무 |
| public update() | L134-178 | E3 | 서비스 pay.Pay03_Account.update | 업무 |
| public insertRow() | L181-186 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L189-209 | E4 | ConfirmBox → E6 | 업무 |
| public buildGrid() | L97-117 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('bankNm', 200, '은행명', { editor: 'select' }),  // L111 SQL 계산 컬럼(selectByCompanyId: f_cdnm('BankCode', pay03_bank_cd, pay03…)
  gb.text('accountNo', 500, '계좌번호', { editor: 'text' }),  // L112
  gb.text('accountNm', 200, '예금주명', { editor: 'text' }),  // L113
  // ⚠DB없음 L114 payYn 100 "급여출금" (pay03_pay_yn 컬럼 없음)
  gb.text('note', 500, '비고', { editor: 'text' }),  // L115
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

