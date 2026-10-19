# Dcr01_Tab_DcrManager

- 종류: 화면
- 메뉴: 관리자 > 03. 문서관리 > 업무별 문서작성(관리자) (#1003)
- 파일: `client/vi/dcr/Dcr01_Tab_DcrManager.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Grid_DocList`](../../apr/components/Apr01_Grid_DocList.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Dcr01_Tab_DcrManager:199 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Tab_DcrManager (`client/vi/dcr/Dcr01_Tab_DcrManager.java`, 277줄)

- 레이아웃: west=vlc, center=cp02
- 툴바 `buttonBar`: 문서분류: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L68-147) → retrieve()
[E1] retrieveButton[조회].Select (L74) → retrieve()
[E2] docSearch.KeyPress [Enter] (L82) → search()
[E3] searchButton[찾기].Select (L92) → search()
[E4] tree.Selection (L108) → 인라인 L108-116 (new SelectionHandler<Dcr01_ClassTreeM…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package getMenuTree() | L149-184 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L187-195 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L197-208 | 생성자,E1 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private search() | L210-254 | E2,E3 | 상태 처리 | 업무 |
| public getServiceResult() | L257-272 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L274-276 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>

