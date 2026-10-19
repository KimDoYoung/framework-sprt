# Ast01_Lookup_Info

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`, `pay`
- 파일: `client/vi/ast/Ast01_Lookup_Info.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast01_ClassTree.selectByTrCode` | Ast01_Lookup_Info:300 | [`Ast01_ClassTree.java:57`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectByTrCode`](../../ast/sql/ast01_class_tree.md), [`ast05_tr_code.selectByTrCode`](../../ast/sql/ast05_tr_code.md) |

## 테이블

[`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_get_corp_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast01_Lookup_Info (`client/vi/ast/Ast01_Lookup_Info.java`, 408줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `docSearch` TextField, `radioIntrinsic` Radio, `radioManagement` Radio

#### 이벤트
[E0] 화면 열림 (생성자 L133-155) → show()
[E1] toggleAssetType.ValueChange (L171) → retrieve()
[E2] retrieveButton[찾기].Select (L184) → retrieve()
[E3] docSearch.KeyPress [Enter] (L191) → search()
[E4] confirmButton[확인].Select (L211) → confirm()
[E5] selectAllButton[전체].Select (L217) → confirmAll()
[E6] cancleButton[닫기].Select (L223) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public relate() | L71-77 | 공개 메서드 | 상태 처리 | 업무 |
| public select() | L79-85 | 공개 메서드 | 상태 처리 | 업무 |
| public select() | L88-96 | 공개 메서드 | 상태 처리 | 업무 |
| public gridInsert() | L98-105 | 공개 메서드 | 상태 처리 | 업무 |
| public gridInsert() | L107-116 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L118-124 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L126-131 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L157-229 | relate,select,gridInsert,open | 상태 처리 | 업무 |
| public confirm() | L231-244 | E4 | 미선택 시 alert "종목을 선택해주세요" | 업무 |
| public confirmAll() | L246-249 | E5 | 상태 처리 | 업무 |
| package getMenuTree() | L251-286 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L288-296 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L298-320 | E1,E2,relate,select,gridInsert,open | 서비스 ast.Ast01_ClassTree.selectByTrCode(companyId, userId, orgId, trCode, itemLClass, abroType, typeCode, assetType) | 업무 |
| private search() | L322-377 | E3 | 상태 처리 | 업무 |
| public getServiceResult() | L380-395 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L397-399 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L401-403 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L405-407 | relate,select,gridInsert,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>찾기</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={confirmAll}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

