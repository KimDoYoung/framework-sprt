# Ast01_Lookup_CorpAccount

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `act`, `crd`, `icam`, `pay`
- 파일: `client/vi/ast/Ast01_Lookup_CorpAccount.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast01_ClassTree.selectCorpAccount` | Ast01_Lookup_CorpAccount:209 | [`Ast01_ClassTree.java:153`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectCorpAccount`](../../ast/sql/ast01_class_tree.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_corp_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast01_Lookup_CorpAccount (`client/vi/ast/Ast01_Lookup_CorpAccount.java`, 225줄)

- 툴바 `buttonBar`: 기준일자: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="보관처명/계좌명", `stdDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스):
  - itemSClassName 150 "계좌구분" Text
  - corpName 150 "보관처" Text
  - classTreeName 250 "계좌" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-65) → 초기화
[E1] grid.CellDoubleClick [callbackResult != null] (L111) → hide()
[E2] confirmButton[확인].Select [callbackResult != null] (L121) → hide()
[E3] selectAllButton[전체].Select (L135) → hide()
[E4] selectNotButton[선택안함].Select (L142) → hide()
[E5] cancleButton[닫기].Select (L149) → hide()
[E6] retrieveButton[조회].Select (L155) → retrieve()
[E7] searchText.KeyPress [Enter] (L166) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openPrePayOnly() | L67-72 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L74-77 | openPrePayOnly | 상태 처리 | 업무 |
| public open() | L79-108 | openPrePayOnly | 상태 처리 | 업무 |
| public setting() | L110-182 | open | 미선택 시 alert "계좌를 선택해주세요." | 업무 |
| public retrieve() | L196-215 | E6,E7,open | 서비스 ast.Ast01_ClassTree.selectCorpAccount(companyId, searchText, stdDate, prePayOnlyYn, corpId), 건수 표시 | 업무 |
| public buildGrid() | L184-194 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L217-219 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L221-223 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('itemSClassNm', 150, '계좌구분'),  // L189 SQL 계산 컬럼(selectCorpAccount: f_cdnm('ItemSClassCode', ast01_item_s_c…)
  gb.text('corpNm', 150, '보관처'),  // L190 SQL 계산 컬럼(selectCorpAccount: COALESCE(sys15_corp_nm,''))
  gb.text('classTreeNm', 250, '계좌'),  // L191
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>선택안함</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

