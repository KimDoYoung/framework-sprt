# Sys07_Tree_PersonRoleMenu

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`
- 파일: `client/vi/sys/Sys07_Tree_PersonRoleMenu.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys06_Menu.selectByPersonId` | Sys07_Tree_PersonRoleMenu:131 | [`Sys06_Menu.java:275`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectUserMenu1Bang`](../../sys/sql/sys06_menu.md) |

## 테이블

[`emp04_add_title`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys07_Tree_PersonRoleMenu (`client/vi/sys/Sys07_Tree_PersonRoleMenu.java`, 215줄)

- 툴바 `buttonBar`: {menuSearch} {refreshButton} {expandAll} {collapseAll}
- 입력·하위 화면: `menuSearch` TextField 빈칸="화면명"

#### 이벤트
[E0] 화면 열림 (생성자 L41-53) → settings()
[E1] menuSearch.KeyPress [Enter] (L60) → search()
[E2] refreshButton[조회].Select (L68) → refresh()
[E3] expandAll[펼치기].Select (L74) → 인라인 L74-79 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L80) → 인라인 L80-85 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getMenuTree() | L88-119 | 필드 초기화 | 상태 처리 | 업무 |
| public refresh() | L121-125 | E2 | 상태 처리 | 업무 |
| public retrieve() | L127-153 | refresh | 서비스 sys.Sys06_Menu.selectByPersonId | 업무 |
| private setChildItem() | L155-165 | retrieve | 상태 처리 | 업무 |
| private addChild() | L167-175 | getServiceResult | 상태 처리 | 업무 |
| private search() | L177-197 | E1 | 상태 처리 | 업무 |
| public getServiceResult() | L200-214 | retrieve | 상태 처리 | 업무 |
| private settings() | L55-86 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={refresh}>조회</Button>
2. <Button type="expand" onClick={() => /* 인라인 L74-79 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L80-85 (new SelectHandler(){ @Override public…) */}>감추기</Button>

