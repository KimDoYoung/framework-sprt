# Ast09_Tab_FinanceForBook

- 종류: 화면
- 메뉴: 고유자산 > 30. 고유자산 현황 > 금융상품 보유내역(외화) (#1366)
- 파일: `client/vi/ast/Ast09_Tab_FinanceForBook.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Ast09_Tab_FinanceForBook:191 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `ast.Ast09_Book.getHoldDate` | Ast09_Tab_FinanceForBook:311 | [`Ast09_Book.java:58`](../../ast/services/Ast09_Book.md) | [`ast09_book.getHoldDate`](../../ast/sql/ast09_book.md) |
| `ast.Ast09_Book.selectByHoldDate` | Ast09_Tab_FinanceForBook:286 | [`Ast09_Book.java:28`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md) |
| `ast.Ast80_RelateAppr.insert` | Ast09_Tab_FinanceForBook:337 | [`Ast80_RelateAppr.java:58`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.deleteByApprId`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.insert`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ast.Ast80_RelateAppr.selectByCompanyId` | Ast09_Tab_FinanceForBook:386 | [`Ast80_RelateAppr.java:26`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md) |
| `ast.Ast80_RelateAppr.updateApprId` | Ast09_Tab_FinanceForBook:369 | [`Ast80_RelateAppr.java:95`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.updateApprId`](../../ast/sql/ast80_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Ast09_Tab_FinanceForBook:216 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys99_Print.insertRdFinanceBook` | Ast09_Tab_FinanceForBook:142 | [`Sys99_Print.java:661`](../../sys/services/Sys99_Print.md) | [`ast09_book.selectByHoldDate`](../../ast/sql/ast09_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast12_book_real`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md), [`ast80_relate_appr`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_get_biz_date2`, `f_get_corp_nm`, `f_get_datediff`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_sellpossibleqty`, `f_nvl`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast09_Tab_FinanceForBook (`client/vi/ast/Ast09_Tab_FinanceForBook.java`, 441줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 보유일자: {holdDate} 검색: {searchText} {retrieveButton} {downLoadButton}
- 입력·하위 화면: `holdDate` MyDateField, `searchText` TextField 빈칸="보관처/계좌/종목유형/종목명", `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - holdDate 100 "보유일자" Date
  - keepCorpAccountName 200 "보관처/계좌" Text
  - astClassName 150 "종목유형" Text
  - astClassTreeName 250 "종목명" Text
  - accountTypeName 100 "회계구분" Text
  - curCode 40 "통화" TextCenter
  - holdQty 100 "보유수량" Double
  - forPurAmt 120 "외화<br>취득금액" Double 편집:"456EA6"
  - forBookAmt 120 "외화<br>장부금액" Double 편집:"456EA6"
  - purAmt 120 "원화<br>취득금액" Long
  - bookAmt 120 "원화<br>장부금액" Long
  - evalAmt 120 "원화<br>평가금액" Long
  - evalPl 120 "원화<br>평가손익" Long
  - oci 120 "원화<br>기타포괄손익" Long
  - firstPurDate 100 "최초취득일자" Date
  - firstPurAmt 120 "원화<br>최초취득금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L76-114) → settings(), defaultName(), retrieve()
[E1] searchText.KeyPress [Enter] (L123) → retrieve()
[E2] retrieveButton[조회].Select (L132) → retrieve()
[E3] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L138) → 서비스 sys.Sys99_Print.insertRdFinanceBook(companyId, personId, windowClassName, holdDate, astType, searchText)
[E4] classTreeFullName[문서분류].TriggerClick (L176) → openLookupDoc()
[E5] apprButton[상신].Select (L182) → getHoldDate()
[E6] apprViewButton[문서보기].Select (L188) → retrieveApprStep()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L215-235 | 생성자,retrieve | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public retrieve() | L275-297 | 생성자,E1,E2 | 서비스 ast.Ast09_Book.selectByHoldDate(companyId, holdDate, astType, abroType, searchText) | 업무 |
| private openLookupDoc() | L299-308 | E4 | 상태 처리 | 업무 |
| private getHoldDate() | L310-329 | E5 | 서비스 ast.Ast09_Book.getHoldDate(companyId, holdDate, astType) | 업무 |
| private insertLinkApprovals() | L331-365 | getHoldDate | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 ast.Ast80_RelateAppr.insert | 업무 |
| private updateApprId() | L368-381 | insertLinkApprovals | 서비스 ast.Ast80_RelateAppr.updateApprId(relateApprId, apprId) | 업무 |
| private retrieveApprStep() | L383-432 | E6,retrieve,updateApprId | 서비스 ast.Ast80_RelateAppr.selectByCompanyId | 업무 |
| private settings() | L116-213 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 sys.Sys99_Print.insertRdFinanceBook, apr.Apr01_Appr.selectById(companyId, personId, windowClassName, holdDate, astType, searchText), 이벤트 연결, 초기값: holdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L237-273 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L434-436 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L438-440 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('holdDate', 100, '보유일자'),  // L242
  gb.text('keepCorpAccountNm', 200, '보관처/계좌'),  // L243 SQL 계산 컬럼(selectByHoldDate: f_get_corp_nm(ast2.ast01_corp_id) ||'('…)
  gb.text('astClassNm', 150, '종목유형'),  // L244 SQL 계산 컬럼(selectByHoldDate: f_cdnm('ItemMClassCode',ast1.ast01_item…)
  gb.text('astClassTreeNm', 250, '종목명'),  // L245 SQL 계산 컬럼(selectByHoldDate: ast1.ast01_class_tree_nm)
  gb.text('accountTypeNm', 100, '회계구분'),  // L246 SQL 계산 컬럼(selectByHoldDate: f_cdnm('AccountType' ,ast1.ast01_accoun…)
  gb.textCenter('curCode', 40, '통화'),  // L247 SQL 계산 컬럼(selectByHoldDate: COALESCE(ast1.ast01_cur_cd,'KRW'))
  gb.double('holdQty', 100, '보유수량'),  // L248
  gb.double('forPurAmt', 120, '외화<br>취득금액'),  // L249
  gb.double('forBookAmt', 120, '외화<br>장부금액'),  // L250
  gb.long('purAmt', 120, '원화<br>취득금액'),  // L251
  gb.long('bookAmt', 120, '원화<br>장부금액'),  // L252
  gb.long('evalAmt', 120, '원화<br>평가금액'),  // L254
  gb.long('evalPl', 120, '원화<br>평가손익'),  // L255
  gb.long('oci', 120, '원화<br>기타포괄손익'),  // L256
  gb.date('firstPurDate', 100, '최초취득일자'),  // L257
  gb.long('firstPurAmt', 120, '원화<br>최초취득금액'),  // L258
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdFinanceBook(companyId, personId, windowClassName, holdDate, astType, searchText) */}>출력/다운로드</Button>
3. <Button type="register" onClick={getHoldDate}>상신</Button>
4. <Button type="search" onClick={retrieveApprStep}>문서보기</Button>

