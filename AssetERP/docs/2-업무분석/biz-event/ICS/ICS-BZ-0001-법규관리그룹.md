# ICS-BZ-0001 준법감시 담당이 법규 관리그룹을 만들고 담당 부서를 붙인다

> **한 줄 요약** — 법규(내부통제 준수 의무)를 누가 챙기는지 나누기 위해 #1213 법규 관리그룹 등록에서 **관리그룹**(예: `경영지원 통제그룹`)을 만들고, 그 그룹을 맡을 **부서**를 공유로 붙인다. 회사를 만들면 `미지정 통제그룹`(기본)이 하나 생겨 있다. 이 그룹은 다음 이벤트(ICS-BZ-0002)에서 법규에 지정되고, 지정한 법규에는 그룹의 부서가 **일정 공유**(`sch02_share`)로 따라 붙는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시 담당(kalpa 과장 301) |
| 언제 | 도입 때, 담당 조직이 바뀔 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001(회사 — 기본 `미지정 통제그룹` 자동 생성), ORG-BZ-0001(부서) |
| 다음 이벤트 | ICS-BZ-0002(법규에 관리그룹 지정) |
| 실제 실행 | kalpa, 2026-11-13, API(301). 관리그룹 `경영지원 통제그룹`·`운용 통제그룹` 등록 → 각 그룹에 부서 공유(`shareCode "2"`): 경영지원본부·운용본부. 목록 AS-IS 대조 3 = 3(기본 그룹 포함) |
| 메뉴 | #1213 준법감시 > 01. 법규관리 > 법규 관리그룹 등록. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | #1213 | [등록] → 그룹명 → [저장] | 관리그룹 줄 |
| 2 | 〃 | 그룹 선택 → 공유 창 [부서추가] → 부서 선택 → [저장] | 그룹에 부서(구분 "부서") |
| 3 | 〃 | 그룹 선택 → [삭제] | 법규에 쓰이는 그룹이면 사용중 안내(`GET /ics/managers/in-use`) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics02_manager` | 관리그룹 | +2 (기본 그룹은 회사 개설 때 이미 있음) |
| `ics04_share` | 그룹의 부서 공유 | +2 |

## 업무 규칙 · 주의

- 담당자(`personId`) 칸은 목록에 있지만 이 화면 저장 DTO에는 없다(그룹명만 저장) — 원본도 같다.
- 삭제는 로그인 회사 그룹만 지운다. `in-use` 확인 API는 로그인 정보 인자가 없어 다른 회사 그룹 ID도 "쓰는 중인지"만 알려 준다(내용 노출은 없음, 하).
- 같은 이벤트에서 `yunhee biz-authz ics`는 관리그룹·공유 쓰기 API를 사원 401도 부를 수 있다고 본다([의심 #124 계열](../../보안_및_버그_의심.md)).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0001
needs: [SYS-BZ-0001, ORG-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ics/managers, PUT /api/v1/ics/managers/{id}/shares]
    body: [[{ managerId: null, managerGroupName: 경영지원 통제그룹 }, { managerId: null, managerGroupName: 운용 통제그룹 }],
           [{ shareId: null, shareCode: "2", orgId: <경영지원본부> }]]
    expect: { track: { ics02_manager: +2, ics04_share: +1~2 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics02_Tab_Manager`(#1213, 서버 `Ics02_Manager.selectByCompanyId` L28·`checkRelateIcs` L64·`update` L148·`delete` L153), `Ics04_Page_Share`(`Ics04_Share.update` L36). `trace-crud`의 `sch02_share`는 모델 클래스 이름 때문에 잡힌 것이고 실제 쓰기는 `ics04_share`뿐이다.
- TOBE: `IcsManagerController`(`/api/v1/ics/managers`·`/shares`·`/in-use`)·`IcsManagerService`(`requireManager` — 원본에 없는 회사 확인 추가), `Ics02_Tab_Manager.tsx`·`Ics04_Page_Share.tsx`.
</details>
