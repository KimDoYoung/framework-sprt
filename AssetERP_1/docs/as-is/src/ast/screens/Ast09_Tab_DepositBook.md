# Ast09_Tab_DepositBook

- 종류: 화면
- 메뉴: 고유자산 > 40. 예금관리 > 예금잔고대사 (#1473)
- 메뉴: 관리회계 > 20. 결산 > 예금잔고대사 (#1159)
- 파일: `client/vi/ast/Ast09_Tab_DepositBook.java`
- 함께 쓰는 클래스 1개:
  - `Ast12_Lookup_RealDeposit` `client/vi/ast/Ast12_Lookup_RealDeposit.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Tab_JournalSub`](../../act/screens/Act02_Tab_JournalSub.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Ast09_Tab_DepositBook:198, Ast09_Tab_DepositBook:451 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `ast.Ast09_Book.createDepositBook` | Ast09_Tab_DepositBook:349 | [`Ast09_Book.java:163`](../../ast/services/Ast09_Book.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast09_Book.selectByHoldDate` | Ast09_Tab_DepositBook:272 | [`Ast09_Book.java:28`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md) |
| `ast.Ast12_BookReal.selectByHoldDate` | Ast12_Lookup_RealDeposit:168 | [`Ast12_BookReal.java:22`](../../ast/services/Ast12_BookReal.md) | [`ast12_book_real.selectByHoldDate`](../../ast/sql/ast12_book_real.md) |
| `ast.Ast12_BookReal.update` | Ast12_Lookup_RealDeposit:173 | [`Ast12_BookReal.java:27`](../../ast/services/Ast12_BookReal.md) | `UpdateDataModel(ast12_book_real)` 동적 INSERT/UPDATE → [`ast12_book_real.selectById`](../../ast/sql/ast12_book_real.md) |
| `ast.Ast80_RelateAppr.insert` | Ast09_Tab_DepositBook:475 | [`Ast80_RelateAppr.java:58`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.deleteByApprId`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.insert`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ast.Ast80_RelateAppr.selectApprId` | Ast09_Tab_DepositBook:440 | [`Ast80_RelateAppr.java:42`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md) |
| `ast.Ast80_RelateAppr.selectByCompanyId` | Ast09_Tab_DepositBook:288 | [`Ast80_RelateAppr.java:26`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md) |
| `ast.Ast80_RelateAppr.updateApprId` | Ast09_Tab_DepositBook:510 | [`Ast80_RelateAppr.java:95`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.updateApprId`](../../ast/sql/ast80_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Ast09_Tab_DepositBook:397 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`ast80_relate_appr`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_depositbook`, `f_create_seq`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_sellpossibleqty`, `f_nvl`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast09_Tab_DepositBook (`client/vi/ast/Ast09_Tab_DepositBook.java`, 556줄)

- 레이아웃: center=vlc, south=cp
- 툴바 `buttonBar`: 보유일자: {holdDate} 검색: {searchText} {retrieveButton} {insertButton} {depositButton}
- 입력·하위 화면: `holdDate` MyDateField, `searchText` TextField 빈칸="구분/계좌", `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `lookupRealDeposit` Ast12_Lookup_RealDeposit, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - holdDate 100 "보유일자" Date
  - astSClassName 100 "구분" TextCenter
  - keepCorpAccountName 350 "계좌" Text
  - curCode 70 "통화" TextCenter
  - preDayAmt 150 "통화기준 전일잔액" Double
  - forBookAmt 150 "통화기준 잔액" Double
  - bookAmt 150 "원화 잔액" Long
  - fxPl 120 "환산손익" Long
  - realAmt 150 "실제잔고" Double 편집:"DD5E5E"
  - diffAmt 120 "차이금액" Double 편집:"DD5E5E"
  - actionCell 60 "계정별원장" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L94-146) → settings(), retrieve(), defaultName()
[E1] searchText.KeyPress [Enter] (L155) → retrieve()
[E2] holdDate.ValueChange (L164) → retrieve()
[E3] retrieveButton[조회].Select (L171) → retrieve()
[E4] insertButton[잔고입력(대사용)].Select (L177) → lookupRealDeposit()
[E5] depositButton[예금잔고정리].Select (L183) → depositUpdate()
       └ [E9] msgBox.DialogHide [YES] (L342) → retrieve()
[E6] apprButton[상신].Select (L189) → insertLinkApproval()
[E7] apprViewButton[문서보기].Select (L195) → retrieveApprStep()
[E8] classTreeFullName[문서분류].TriggerClick (L220) → openLookupDoc()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L261-282 | 생성자,E1,E2,E3,E9,insertLinkApproval,updateApprId | 서비스 ast.Ast09_Book.selectByHoldDate(companyId, holdDate, astType, depositDiffYn, searchText) | 업무 |
| private retrieveApprStep() | L284-334 | E7,retrieve | 서비스 ast.Ast80_RelateAppr.selectByCompanyId | 업무 |
| private depositUpdate() | L336-377 | E5 | ConfirmBox → E9 | 업무 |
| private lookupRealDeposit() | L379-382 | E4 | 조회창 Ast12_Lookup_RealDeposit 열기 | 업무 |
| private openLookupDoc() | L385-394 | E8 | 상태 처리 | 업무 |
| private defaultName() | L396-416 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L418-506 | E6 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 ast.Ast80_RelateAppr.selectApprId, apr.Apr01_Appr.selectById, ast.Ast80_RelateAppr.insert | 업무 |
| private updateApprId() | L509-521 | insertLinkApproval | 서비스 ast.Ast80_RelateAppr.updateApprId(relateApprId, apprId) | 업무 |
| private getGridList() | L523-529 | insertLinkApproval | 상태 처리 | 업무 |
| private getFxYn() | L531-547 | insertLinkApproval | 상태 처리 | 업무 |
| private settings() | L148-226 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 이벤트 연결, 초기값: holdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L228-259 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L549-551 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L553-555 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('holdDate', 100, '보유일자'),  // L246
  gb.textCenter('astSClassNm', 100, '구분'),  // L247 SQL 계산 컬럼(selectByHoldDate: f_cdnm('ItemSClassCode',ast1.ast01_item…)
  gb.text('keepCorpAccountNm', 350, '계좌'),  // L248 SQL 계산 컬럼(selectById: f_get_corp_nm(ast2.ast01_corp_id) ||'('…)
  gb.textCenter('curCode', 70, '통화'),  // L249 SQL 계산 컬럼(selectById: COALESCE(ast1.ast01_cur_cd,'KRW'))
  gb.double('preDayAmt', 150, '통화기준 전일잔액'),  // L250 SQL 계산 컬럼(selectByHoldDate: coalesce(( SELECT holdQty FROM ( SELECT…)
  gb.double('forBookAmt', 150, '통화기준 잔액'),  // L251
  gb.long('bookAmt', 150, '원화 잔액'),  // L252
  gb.long('fxPl', 120, '환산손익'),  // L253
  gb.double('realAmt', 150, '실제잔고'),  // L254 SQL 계산 컬럼(selectByHoldDate: COALESCE(ast12_real_qty,0))
  gb.double('diffAmt', 120, '차이금액'),  // L255 SQL 계산 컬럼(selectByHoldDate: ast09_hold_qty - COALESCE(ast12_real_qt…)
  // ⚠ 대응 없음 (GridBuilder L256) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={lookupRealDeposit}>잔고입력(대사용)</Button>
3. <Button type="view" onClick={depositUpdate}>예금잔고정리</Button>
4. <Button type="register" onClick={insertLinkApproval}>상신</Button>
5. <Button type="search" onClick={retrieveApprStep}>문서보기</Button>

### Ast12_Lookup_RealDeposit (`client/vi/ast/Ast12_Lookup_RealDeposit.java`, 201줄)

- 툴바 `buttonBar`: 잔고일자: {holdDate} 검색: {searchText} {retrieveButton} {getRcntAmtButton}
- 입력·하위 화면: `holdDate` MyDateField, `searchText` TextField 빈칸="기관/계좌/통화"
- 그리드 `grid` (buildGrid(), 체크박스):
  - holdDate 100 "기준일" Date
  - itemSClassName 100 "구분" Text
  - corpName 150 "기관" Text
  - astClassTreeName 150 "계좌" Text
  - curCode 80 "기준통화" TextCenter
  - realAmt 150 "원화 잔고" Long 편집:LongField
  - realForAmt 120 "외화 잔고" Double 편집:DoubleField

#### 이벤트
[E1] searchText.KeyPress [Enter] (L94) → retrieve()
[E2] retrieveButton[조회].Select (L103) → retrieve()
[E3] getRcntAmtButton[최근잔고 가져오기].Select (L109) → setRealAmt()
[E4] updateButton[저장].Select (L115) → update()
[E5] closeButton[닫기].Select [YES] (L121) → hide()
[E6] msgBox.DialogHide [YES] (L127) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-85 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L163-169 | E1,E2,open | 서비스 ast.Ast12_BookReal.selectByHoldDate(companyId, holdDate, searchText) | 업무 |
| private update() | L171-184 | E4 | 서비스 ast.Ast12_BookReal.update | 업무 |
| private setRealAmt() | L186-191 | E3 | 상태 처리 | 업무 |
| private settings() | L87-147 | open | 확인창 표시, 이벤트 연결, 초기값: holdDate=stdDate | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L149-161 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L193-195 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L197-199 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('holdDate', 100, '기준일'),  // L152
  gb.text('itemSClassNm', 100, '구분'),  // L153 SQL 계산 컬럼(selectByHoldDate: f_cdnm('ItemSClassCode',ast01_item_s_cl…)
  gb.text('corpNm', 150, '기관'),  // L154 SQL 계산 컬럼(selectByHoldDate: f_get_corp_nm(ast01_corp_id))
  gb.text('astClassTreeNm', 150, '계좌'),  // L155 SQL 계산 컬럼(selectByHoldDate: ast01_class_tree_nm)
  gb.textCenter('curCd', 80, '기준통화'),  // L156 SQL 계산 컬럼(selectByHoldDate: COALESCE(ast01_cur_cd,'KRW'))
  gb.long('realAmt', 150, '원화 잔고', { editor: 'number' }),  // L157
  gb.double('realForAmt', 120, '외화 잔고', { editor: 'number' }),  // L158
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={setRealAmt}>최근잔고 가져오기</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

