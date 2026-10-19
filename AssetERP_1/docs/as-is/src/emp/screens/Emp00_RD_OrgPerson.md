# Emp00_RD_OrgPerson

- 종류: 화면
- 파일: `client/vi/emp/Emp00_RD_OrgPerson.java`
- 함께 쓰는 클래스 1개:
  - `Emp00_RDPage_ColComments` `client/vi/emp/Emp00_RDPage_ColComments.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org01_Tree_OrgCode`](../../org/components/Org01_Tree_OrgCode.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_RD_OrgPerson (`client/vi/emp/Emp00_RD_OrgPerson.java`, 106줄)

- 레이아웃: north=buttonBar, west=cp, center=rdPagePerson
- 툴바 `buttonBar`: 기준일: {baseDate} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `buildTree` Org01_Tree_OrgCode, `rdPagePerson` Emp00_RDPage_ColComments

#### 이벤트
[E0] 화면 열림 (생성자 L39-92) → retrieve()
[E1] retrieveButton[조회].Select (L49) → retrieve()
[E2] orgTree.SelectionChanged [data != null] (L68) → 인라인 L68-78 (new SelectionChangedHandler<Org01_Cod…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L99-101 | 생성자,E1 | 상태 처리 | 업무 |
| public buildGrid() | L94-97 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L103-105 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Emp00_RDPage_ColComments (`client/vi/emp/Emp00_RDPage_ColComments.java`, 67줄)

- 레이아웃: center=rdLayoutContainer, center=rdLayoutContainer
- 입력·하위 화면: `tableNameField` TextField, `text` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L23-33) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L35-48 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L51-52 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L55-56 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L59-60 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L63-64 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

