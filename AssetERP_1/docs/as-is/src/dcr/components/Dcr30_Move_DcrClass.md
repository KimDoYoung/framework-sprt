# Dcr30_Move_DcrClass

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `act`, `apr`, `ast`, `biz`, `car`, `emp`, `flt`, `ics`, `pay`
- 파일: `client/vi/dcr/Dcr30_Move_DcrClass.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Dcr30_Move_DcrClass:262 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr03_OrgAuth.selectByDcrOrgId` | Dcr30_Move_DcrClass:180 | [`Dcr03_OrgAuth.java:61`](../../dcr/services/Dcr03_OrgAuth.md) | [`dcr03_org_auth.selectByDcrOrgId`](../../dcr/sql/dcr03_org_auth.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr30_Move_DcrClass (`client/vi/dcr/Dcr30_Move_DcrClass.java`, 341줄)

- 툴바 `buttonBar`: 문서분류: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L63-69) → 초기화
[E1] docSearch.KeyPress [Enter] (L117) → search()
[E2] searchButton[찾기].Select (L125) → search()
[E3] updateButton[확인].Select (L136) → update()
[E4] nullButton[선택안함].Select (L142) → hide()
[E5] cancleButton[닫기].Select (L151) → hide()
[E6] tree.Selection (L158) → 인라인 L158-165 (new SelectionHandler<Dcr01_ClassTreeM…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNull() | L71-77 | 공개 메서드 | 상태 처리 | 업무 |
| public openNull() | L79-86 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L88-91 | openNull | 상태 처리 | 업무 |
| public open() | L93-112 | openNull | 상태 처리 | 업무 |
| private setting() | L114-166 | open | 상태 처리 | 업무 |
| private update() | L168-209 | E3 | 미선택 시 alert "최하위 문서분류를 선택해주세요", 서비스 dcr.Dcr03_OrgAuth.selectByDcrOrgId(companyId, orgCodeId, classTreeId) | 업무 |
| package getMenuTree() | L211-247 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L250-258 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L260-270 | open | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private search() | L272-315 | E1,E2 | 상태 처리 | 업무 |
| public getServiceResult() | L318-331 | update | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L333-335 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L337-339 | 생성자,openNull | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="unknown" onClick={hide}>선택안함</Button>

