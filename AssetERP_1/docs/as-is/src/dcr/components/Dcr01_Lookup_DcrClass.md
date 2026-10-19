# Dcr01_Lookup_DcrClass

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `fbx`
- 파일: `client/vi/dcr/Dcr01_Lookup_DcrClass.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Dcr01_Lookup_DcrClass:243 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.selectByCompanyIdRole` | Dcr01_Lookup_DcrClass:222 | [`Dcr01_ClassTree.java:156`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentIdRole_1Bang`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Lookup_DcrClass (`client/vi/dcr/Dcr01_Lookup_DcrClass.java`, 343줄)

- 툴바 `buttonBar`: 문서분류: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField, `baseDateField` MyDateField

#### 이벤트
[E1] docSearch.KeyPress [Enter] (L111) → search()
[E2] searchButton[찾기].Select (L119) → search()
[E3] okButton[선택].Select (L125) → confirm()
[E4] selectAllButton[전체].Select (L131) → confirmAll()
[E5] cancleButton[닫기].Select (L137) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L76-80 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L82-85 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L92-95 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L101-169 | 공개 메서드 | 상태 처리 | 업무 |
| package getMenuTree() | L171-208 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L210-218 | getServiceResult | 상태 처리 | 업무 |
| private retrieve() | L220-239 | open | 서비스 dcr.Dcr01_ClassTree.selectByCompanyIdRole(companyId, orgId, typeCode) | 업무 |
| public retrieve() | L241-260 | open | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private search() | L262-282 | E1,E2 | 상태 처리 | 업무 |
| public confirm() | L284-296 | E3 | 미선택 시 alert "분류를 선택해주세요" | 업무 |
| public confirmAll() | L298-301 | E4 | 상태 처리 | 업무 |
| public getServiceResult() | L304-332 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L334-336 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L338-340 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={confirmAll}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

