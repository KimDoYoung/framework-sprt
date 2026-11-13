# ICS-BZ-0011 KFS가 법규 마스터(분류 트리·법규 항목)를 관리한다

> **한 줄 요약** — 모든 회사가 공유하는 법규 목록(회사 0 `ics01_class_tree`)은 KFS 관리자가 #1012 법규관리(관리자)에서 **분류 트리**(상위·하위 분류)와 그 아래 **법규 항목**(법규코드·법규명·제출처·관련조문·일임(자문)·상세내용)을 만들고 고치고 옮기고 지운다. 회사 사용자는 #1336 법규조회에서 읽고, 회사 관리는 ICS-BZ-0002(#1013)에서 한다. 개정내역·서식파일·책무 연결 개수는 목록에 같이 나온다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(쓰기 전부), 회사 임직원(읽기) |
| 언제 | 법규가 새로 생기거나 바뀔 때 |
| 먼저 있어야 하는 것 | — (회사 0 공용 자료) |
| 다음 이벤트 | 회사가 새 법규를 관리그룹에 지정(ICS-BZ-0002), 개정내역(0007)·서식파일(0008) 연결 |
| 실제 실행 | KFS(admin), 2026-11-13. 분류 `[업무분석 시험] 분류`(`경영관리` 아래) 생성 → 그 아래 법규 항목 생성 → 내용 저장 → kalpa 301이 트리·법규 목록·상세 조회 → 사원 301·kalpa 회사 관리자의 생성·수정·내용·삭제는 전부 403 → 분류 코드 없이 만들면 "분류코드를 입력해주세요" → 자기 하위로 이동하면 "자기 자신이나 하위 분류로는 이동할 수 없습니다" → 분류 삭제 시 하위 법규까지 함께 삭제(3행). **시험 자료는 모두 지움**. ⚠ 같은 법규코드 중복 저장 가능 |
| 메뉴 | #1012 기초자료 > 00. 내부통제 > 법규관리(관리자), #1336 법규조회(읽기). kalpa에는 #1012가 없어 API로 실행. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1012 | [상위등록] 또는 분류 선택 후 [하위등록] → 분류코드·분류명 → [저장] | 트리에 분류 |
| 2 | 〃 | #1012 | 분류 선택 → 오른쪽 법규 목록에서 [행 추가] → 법규코드·법규명·제출처·관련조문 → [저장] | 법규 줄(개정이력 0건·서식파일 0건) |
| 3 | 〃 | #1012 | 줄의 [상세내용] 셀 → 내용 → [저장] | 상세내용 |
| 4 | 〃 | #1012 | [이동](트리 선택 창) | 법규·분류의 상위가 바뀜 |
| 5 | 회사 임직원 | #1336 | 분류·법규검색 → [조회] | 새 법규가 목록에 나옴 |
| 6 | KFS 관리자 | #1012 | 법규 선택 → [삭제] / 분류 삭제 | 법규(및 하위) 삭제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics01_class_tree` | 분류·법규 항목(회사 0) | +2(분류 1·법규 1)→ 중복 시험 +1 → 분류 삭제로 3행 모두 지움 |

## 업무 규칙 · 주의

- 쓰기는 **KFS 관리자만**이다(사원 301·kalpa `admin` 모두 403, 정상). 읽기는 로그인한 임직원 누구나이며 회사 구분이 없다.
- 분류 삭제는 **하위 법규까지 지운다**(`deleteAll`). 개정내역(0007)에 연결된 법규를 지우면 연결 행이 남는다(0007 참고).
- 서버 검사: 분류코드 필수, 자기·하위로 이동 불가. 법규코드 중복은 검사하지 않는다 → [의심 #147](../../보안_및_버그_의심.md).
- 원본 목록 SQL `selectByCompanyId`는 PostgreSQL 분기(`${isPostgreSql}`) 때문에 `yunhee compare`로 행 수를 비교하지 못했다(API 57행 확인만).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0011
needs: []
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/ics/class-trees
    body: { parentTreeId: 24643, classTreeCode: ZT001, classTreeName: "[업무분석 시험] 분류", seq: 999 }
    expect: { track: { ics01_class_tree: +1 } }
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ics/laws
    body: [{ parentTreeId: <1단계>, classTreeCode: ZL001, classTreeName: "[업무분석 시험] 법규 항목", submitTo: 금융감독원, relatedLaw: 시험법 제1조, advisYn: false }]
    expect: { track: { ics01_class_tree: +1 } }
  - no: 3
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/ics/laws/view
  - no: 4
    actor: { company: admin, user: admin, password: "1111" }
    api: DELETE /api/v1/ics/class-trees/<1단계>
    expect: { track: { ics01_class_tree: -2 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics01_Tab_ClassTree`(#1012)·`Ics01_Edit_ClassTree`·`Ics01_Grid_IcsType`·`Ics01_Move_TreeGrid` — 서버 `Ics01_ClassTree.selectByCompanyId·update·delete·deleteAll` → `ics01_class_tree`.
- TOBE: `IcsClassTreeController`(`/class-trees`)·`IcsLawController`(`/laws`·`/laws/{id}/content`·`/laws/{id}/parent`).
</details>
