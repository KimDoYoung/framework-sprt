# Emp01_Tab_InoutState

- 종류: 화면
- 메뉴: 경영관리 > 20. 대외보고서 > 기간별 입퇴사현황 (#1287)
- 파일: `client/vi/emp/Emp01_Tab_InoutState.java`
- 함께 쓰는 클래스 1개:
  - `Emp01_Rd_InoutState` `client/vi/emp/Emp01_Rd_InoutState.java`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp01_Tab_InoutState (`client/vi/emp/Emp01_Tab_InoutState.java`, 126줄)

- 레이아웃: north=buttonBar, center=rdForm
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L32-101) → retrieve()
[E1] retrieveButton[조회].Select (L45) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L103-110 | 생성자,E1 | 상태 처리 | 업무 |
| private getStartDate() | L112-115 | retrieve | 상태 처리 | 업무 |
| private getCloseDate() | L117-120 | retrieve | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L123-125 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Emp01_Rd_InoutState (`client/vi/emp/Emp01_Rd_InoutState.java`, 79줄)


#### 이벤트
[E0] 화면 열림 (생성자 L25-27) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L30-57 | 공개 메서드 | 상태 처리 | 업무 |
| public rdClear() | L59-61 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L64-65 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L68-69 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L72-73 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L76-77 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

