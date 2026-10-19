# Ast06_Tab_AccruedIntrinsic

- 종류: 화면
- 메뉴: 관리회계 > 11. 특수회계처리 > 미수/미지급 (#1092)
- 파일: `client/vi/ast/Ast06_Tab_AccruedIntrinsic.java`
- 함께 쓰는 클래스 1개:
  - `Ast05_Lookup_TrCodeWindow` `client/vi/ast/Ast05_Lookup_TrCodeWindow.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast07_Grid_History`](../../ast/components/Ast07_Grid_History.md), [`Ast07_Lookup_Settle`](../../ast/components/Ast07_Lookup_Settle.md), [`Ast07_Lookup_SettleMulti`](../../ast/components/Ast07_Lookup_SettleMulti.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast05_TrCode.selectByWindowClassName` | Ast05_Lookup_TrCodeWindow:180 | [`Ast05_TrCode.java:43`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByWindowClassName`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast06_Tr.selectByAccrued` | Ast06_Tab_AccruedIntrinsic:265 | [`Ast06_Tr.java:174`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByAccrued`](../../ast/sql/ast06_tr.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_AccruedIntrinsic (`client/vi/ast/Ast06_Tab_AccruedIntrinsic.java`, 330줄)

- 레이아웃: center=vlc, south=gridSettle
- 툴바 `buttonBar01`: 수령/지급: {payName} 거래유형: {trName} 거래처: {corpName} 검색: {searchText} {retrieveButton} {updateButton} {multiUpdateButton}
- 입력·하위 화면: `payName` ComboBoxField("RcvPayCode", "%", "전체"), `trCode` TextField, `trName` LookupTriggerField 빈칸="전체", `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="거래유형/거래처/종목/적요", `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupCorpCode` Sys15_Lookup_Corp, `lookupSettle` Ast07_Lookup_Settle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - trName 200 "거래유형" Text
  - corpName 200 "거래처" Text
  - note 450 "종목/거래적요" TextArea
  - amt 150 "거래금액" Long
  - accruedAmt 150 "미수/미지급액" Double 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L60-94) → setting(), retrieve()
[E1] trName.TriggerClick [result != null] (L105) → 인라인 L105-123 (new TriggerClickHandler(){ @Override …)
[E2] corpName.TriggerClick [result != null] (L128) → 인라인 L128-146 (new TriggerClickHandler() { @Override…)
[E3] searchText.KeyPress [Enter] (L173) → retrieve()
[E4] retrieveButton[조회].Select (L182) → retrieve()
[E5] updateButton[결제등록].Select (L188) → insert()
[E6] multiUpdateButton[일괄 결제등록].Select (L194) → multiInsert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L96-217 | 생성자 | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| public retrieve() | L235-272 | 생성자,E3,E4,insert,multiInsert | 서비스 ast.Ast06_Tr.selectByAccrued(companyId, userId, orgId, assetType, abroType, searchText, trCode, payCode, payCode, classTreeId, corpId, corpId) | 업무 |
| private insert() | L274-309 | E5 | 조회창 Ast07_Lookup_Settle 열기, 미선택 시 alert "결제건을 선택해주세요." | 업무 |
| private multiInsert() | L311-325 | E6 | 조회창 Ast07_Lookup_SettleMulti 열기 | 업무 |
| public buildGrid() | L219-233 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L327-329 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L225
  gb.text('trNm', 200, '거래유형'),  // L226
  gb.text('corpNm', 200, '거래처'),  // L227
  gb.textArea('note', 450, '종목/거래적요'),  // L228
  gb.long('amt', 150, '거래금액'),  // L229
  gb.double('accruedAmt', 150, '미수/미지급액'),  // L230
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>결제등록</Button>
3. <Button type="register" onClick={multiInsert}>일괄 결제등록</Button>

### Ast05_Lookup_TrCodeWindow (`client/vi/ast/Ast05_Lookup_TrCodeWindow.java`, 196줄)

- 툴바 `buttonBar`: {label} {searchText} {rcvPayCodeCombo} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="거래코드/명", `rcvPayCodeCombo` ComboBoxField("RcvPayCode", "%", "전체")
- 그리드 `grid` (buildGrid()):
  - trCode 80 "거래코드" TextCenter
  - trName 200 "거래명" Text
  - rcvPayName 100 "수령/지급" Text
  - note 150 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L61-79) → show()
[E1] grid.CellDoubleClick [callbackResult != null] (L82) → hide()
[E2] confirmButton[확인].Select [callbackResult != null] (L92) → hide()
[E3] selectAllButton[전체].Select (L102) → hide()
[E4] cancleButton[닫기].Select (L109) → hide()
[E5] retrieveButton[조회].Select (L115) → retrieve()
[E6] searchText.KeyPress [Enter] (L128) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-59 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L81-141 | open | 상태 처리 | 업무 |
| public retrieve() | L155-186 | E5,E6,open | 서비스 ast.Ast05_TrCode.selectByWindowClassName(companyId, searchText, rcvPayCode, windowClassName) | 업무 |
| public buildGrid() | L143-153 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L188-190 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L192-194 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('trCd', 80, '거래코드'),  // L147
  gb.text('trNm', 200, '거래명'),  // L148
  gb.text('rcvPayNm', 100, '수령/지급'),  // L149
  gb.text('note', 150, '비고'),  // L150
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

