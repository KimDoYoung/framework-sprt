# Ast01_Lookup_ClassTree

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bmt`
- 파일: `client/vi/ast/Ast01_Lookup_ClassTree.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast01_ClassTree.selectByCompanyId` | Ast01_Lookup_ClassTree:178 | [`Ast01_ClassTree.java:32`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectByCompanyId`](../../ast/sql/ast01_class_tree.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md)

## DB 함수

`f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_get_corp_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast01_Lookup_ClassTree (`client/vi/ast/Ast01_Lookup_ClassTree.java`, 236줄)

- 툴바 `buttonBar`: 자산구분: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L94-115) → show()
[E1] docSearch.KeyPress [Enter] (L61) → search()
[E2] searchButton[찾기].Select (L69) → search()
[E3] updateButton[확인].Select (L80) → update()
[E4] cancleButton[닫기].Select (L86) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-57 | 공개 메서드 | 상태 처리 | 업무 |
| private buttonBarSetting() | L59-92 | open | 상태 처리 | 업무 |
| private update() | L117-125 | E3 | 상태 처리 | 업무 |
| package getMenuTree() | L127-163 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L166-174 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L176-188 | open | 서비스 ast.Ast01_ClassTree.selectByCompanyId | 업무 |
| private search() | L190-210 | E1,E2 | 상태 처리 | 업무 |
| public getServiceResult() | L213-226 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L228-230 | buttonBarSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L232-234 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

