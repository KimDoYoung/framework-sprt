# DCR-BZ-0001 문서분류(업무 트리)를 만들고 고친다

> **한 줄 요약** — 고객사 관리자가 결재문서를 쓸 때 고르는 **문서분류 트리**(분류 → 업무 → 문서종류)를 만든다. 분류를 만들고(루트), 그 아래 업무(하위)를 붙이고, 이름·구분코드·순서를 고치고, 쓰지 않는 것은 사용여부를 끄고, 다른 분류 밑으로 옮기고, 지운다. 'Asset-ERP' 제공 분류(KFS가 복사해 준 것)는 고칠 수 없다. 이 트리가 문서작성·문서검색·문서권한(0002)의 기준이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 (KFS 관리자가 제공 분류 복사) |
| 언제 | 도입 때, 업무 체계가 바뀔 때 |
| 먼저 있어야 하는 것 | 회사 개설, 제공 분류 복사(kalpa는 622행 있음) |
| 다음 이벤트 | DCR-BZ-0002 권한, 0003 양식, 0004 문서분류 지정 |
| 실제 실행 | kalpa, 2026-11-13, API(관리자). 루트 분류 `BZ시험분류` 생성(`dcr01_class_tree` +1) → 이름 없이 생성은 거절("업무명은 필수입력 항목입니다") → **같은 이름·구분코드로 한 번 더 생성됨(⚠원본과 같음, 의심 #202에 포함)** → 하위 업무 생성·수정 → 다른 분류로 이동 → 사용여부 끔 → 제공 분류(`상품전략`)의 값 변경 시도는 거절("'Asset-ERP'에서 제공하는 문서분류는 변경불가능합니다") → 사원 402가 수정·삭제(⚠#202) → 자기 자식 밑으로 이동해 **순환 구조가 생김(⚠#203)** → 되돌림 → 시험 분류 3건 삭제(20909 원복). 하위 문서종류·양식연결·내규/준법 연결 창·문서분류 복사(KFS)는 안 함. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1001 관리자 > 03. 문서관리 > 문서분류 (#1110 기초자료 > 20. 문서(전자결재) > 문서분류는 KFS용). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 관리자 | #1001 | 검색 [조회] (`GET /dcr/class-trees/all`) | 분류 트리(분류 C / 문서종류 T) |
| 2 | 〃 | #1001 | [업무등록] → 이름·구분코드·순서·비고 (`POST /dcr/class-trees`, parentTreeId 0) | 루트 분류 +1 |
| 3 | 〃 | #1001 | 상위 선택 → [하위등록] (`POST …`, parentTreeId=상위) | 하위 +1 |
| 4 | 〃 | #1001 | 행 편집 → [저장] (`POST …/check-update` 검사 → `PUT …/{id}`) | 갱신 |
| 5 | 〃 | #1001 | [사용여부설정] (`PUT …/use-yn`) | 사용 끔/켬(문서작성 목록에서 빠짐) |
| 6 | 〃 | #1001 | 이동 창에서 새 상위 선택 (`PUT …/{id}/parent`) | 상위 변경 |
| 7 | 〃 | #1001 | [삭제] → 사용 확인(`GET …/{id}/delete-check`: 문서분류지정·상신문서 건수) → 확인 (`DELETE …/{id}`) | 삭제 |
| 8 | KFS | #1001 | [문서분류복사] (`POST …/admin-copy`) | (안 함) |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `dcr01_class_tree` | 문서분류 트리(이름·구분코드·순서·상위·유형 C/T·사용·제공여부) | 루트 +2·하위 +1 → 삭제 −3 (20909 원복) |

## 업무 규칙 · 주의

- 필수: 업무명. 구분코드·순서·비고는 선택. 회사 0(제공 원본)에서만 구분코드 중복을 막는다(원본 `updateCheck`). 고객사 안에서는 **같은 이름·구분코드가 중복 등록된다**(원본과 같음).
- 제공 분류(`adminYn`)는 이름·구분코드·순서·비고를 바꾸면 `check-update`에서 막힌다.
- 삭제 확인은 문서분류지정(`dcr30_link`)과 상신문서 건수를 보여 주기만 하고(0이면 `", "` 같은 빈 문구), 사용 중이어도 삭제는 막지 않는다 — 원본 `deleteCheck`도 건수만 돌려준다.
- 이동(`/parent`)은 서버가 **자기 자신·자기 후손 밑인지 검사하지 않는다** → [의심 #203](../../보안_및_버그_의심.md). 원본도 같은 `update`로 상위를 바꾼다(화면 트리가 막을 수도 있으나 서버 검사는 없음).
- 사원이 수정·삭제한다 → [의심 #202](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: DCR-BZ-0001
needs: []
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/dcr/class-trees
    body: { parentTreeId: 0, classTreeName: "BZ시험분류", classTreeCode: "BZT", seq: "999" }
    expect: { track: { dcr01_class_tree: +1 } }
  - no: 2
    api: PUT /api/v1/dcr/class-trees/use-yn
    body: [ { classTreeId: "{classTreeId}", useYn: false } ]
  - no: 3
    api: DELETE /api/v1/dcr/class-trees/{classTreeId}
    expect: { track: { dcr01_class_tree: -1 } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Dcr01_Tab_ClassTree`(#1001), `Dcr01_Edit_ClassTree`, `Dcr01_Move_TreeGrid`, 서버 `Dcr01_ClassTree`(update·updateCheck·deleteCheck·deleteAll·insertAdminCopy).
- TOBE: `DcrClassTreeController`·`DcrClassTreeService`(createClassTree·updateClassTree·moveParent·updateUseYn·updateCheck·deleteCheck·delete).
</details>
