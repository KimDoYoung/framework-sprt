# Pay50_Tab_ExpenseSettle

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 미지급반제처리 (#1390)
- 파일: `client/vi/pay/Pay50_Tab_ExpenseSettle.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast07_Grid_History`](../../ast/components/Ast07_Grid_History.md), [`Ast07_Lookup_Settle`](../../ast/components/Ast07_Lookup_Settle.md), [`Ast07_Lookup_SettleMulti`](../../ast/components/Ast07_Lookup_SettleMulti.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast06_Tr.selectByAccrued` | Pay50_Tab_ExpenseSettle:194 | [`Ast06_Tr.java:174`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByAccrued`](../../ast/sql/ast06_tr.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay50_Tab_ExpenseSettle (`client/vi/pay/Pay50_Tab_ExpenseSettle.java`, 246줄)

- 레이아웃: center=vlc, south=gridSettle
- 툴바 `buttonBar01`: 거래처: {corpName} 검색: {searchText} {retrieveButton} {updateButton} {multiUpdateButton}
- 입력·하위 화면: `payName` ComboBoxField("RcvPayCode"), `trCode` TextField, `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="거래처/적요", `lookupCorpCode` Sys15_Lookup_Corp, `lookupSettle` Ast07_Lookup_Settle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - corpName 200 "거래처" Text
  - note 450 "적요" TextArea
  - amt 150 "거래금액" Long
  - accruedAmt 150 "미지급액" Double 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L57-91) → setting(), retrieve()
[E1] corpName.TriggerClick [result != null] (L100) → 인라인 L100-118 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L122) → retrieve()
[E3] retrieveButton[조회].Select (L131) → retrieve()
[E4] updateButton[결제등록].Select (L137) → insert()
[E5] multiUpdateButton[일괄 결제등록].Select (L143) → multiInsert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L93-158 | 생성자 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| public retrieve() | L174-201 | 생성자,E2,E3,insert,multiInsert | 서비스 ast.Ast06_Tr.selectByAccrued(companyId, userId, orgId, assetType, abroType, payCode, classTreeId, searchText, trCode, corpId, corpId) | 업무 |
| private insert() | L203-225 | E4 | 조회창 Ast07_Lookup_Settle 열기, 미선택 시 alert "결제건을 선택해주세요." | 업무 |
| private multiInsert() | L227-241 | E5 | 조회창 Ast07_Lookup_SettleMulti 열기 | 업무 |
| public buildGrid() | L160-172 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L243-245 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L165
  gb.text('corpNm', 200, '거래처'),  // L166
  gb.textArea('note', 450, '적요'),  // L167
  gb.long('amt', 150, '거래금액'),  // L168
  gb.double('accruedAmt', 150, '미지급액'),  // L169
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>결제등록</Button>
3. <Button type="register" onClick={multiInsert}>일괄 결제등록</Button>

