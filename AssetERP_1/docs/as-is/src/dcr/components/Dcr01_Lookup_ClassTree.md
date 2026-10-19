# Dcr01_Lookup_ClassTree

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pln`
- 파일: `client/vi/dcr/Dcr01_Lookup_ClassTree.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByParentIdResrchYn` | Dcr01_Lookup_ClassTree:133 | [`Dcr01_ClassTree.java:107`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentIdResrchYn`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Lookup_ClassTree (`client/vi/dcr/Dcr01_Lookup_ClassTree.java`, 157줄)

- 툴바 `searchBar`: {retrieveButton}

#### 이벤트
[E1] retrieveButton[조회].Select (L48) → retrieve()
[E2] okButton[확인].Select (L62) → hide()
[E3] cancelButton[취소].Select (L72) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-83 | 공개 메서드 | 상태 처리 | 업무 |
| package getMenuTree() | L85-119 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L121-129 | getServiceResult | 상태 처리 | 업무 |
| private retrieve() | L131-140 | E1,open | 서비스 dcr.Dcr01_ClassTree.selectByParentIdResrchYn | 업무 |
| public getServiceResult() | L143-151 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L153-155 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

