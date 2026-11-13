# ICS-BZ-0002 준법감시 담당이 회사에 적용할 법규를 고르고 관리그룹을 지정한다

> **한 줄 요약** — 법규 목록(`ics01_class_tree`, 회사 0이 KFS가 관리하는 **공통 마스터**: 분류 245줄)은 모든 회사가 같이 본다. 회사는 #1013 법규관리에서 **우리 회사에 해당 없는 법규를 제외**(`ics03_company_info` — 제외·ICAM 자동·자문 관련 여부)하고, 법규마다 **관리그룹을 지정**한다. 관리그룹을 지정하면 그 그룹의 **부서가 법규의 일정 공유**(`sch02_share`)로 따라 붙어, 그 부서가 그 법규의 공유 대상이 된다(`sch02_share` 일정 공유 테이블).

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시 담당(kalpa 과장 301) |
| 언제 | 도입 때, 법규가 바뀌거나 조직이 바뀔 때 |
| 먼저 있어야 하는 것 | ICS-BZ-0001(관리그룹), KFS가 관리하는 법규 마스터 |
| 다음 이벤트 | ICS-BZ-0003(체크리스트) |
| 실제 실행 | kalpa, 2026-11-13, API(301). 법규 목록 `GET /ics/laws/manage`는 **186건**(마스터 245줄 가운데). ① 법규 2건(`자산건전성 보고`·`재무건전성 보고`)에 `경영지원 통제그룹` 지정(`PUT /ics/relate-managers`) → `ics05_relate_manager` +2, 그룹의 부서가 법규 일정 공유로 복사(`sch02_share` +2) ② 법규 1건을 이 회사 법규에서 **제외**(`PUT /ics/laws/company-info`, `ics03_company_info` +1). 관리그룹 필터 조회 2건 = 지정한 2건, 제외 목록 1건 |
| 메뉴 | #1013 준법감시 > 01. 법규관리 > 법규관리(관련: #1336 법규조회, #1255 월별 법규조회). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | #1013 | 분류·관리그룹·법규검색 → [조회] | 법규 목록(코드·법규명·제출처·관련법령·개정건수·주기·파일·관리그룹) |
| 2 | 〃 | 줄 선택 → [관리그룹 일괄지정] | 그룹이 붙고 그룹의 부서가 일정 공유로 따라 붙음 |
| 3 | 〃 | 제외할 법규 설정 → [저장] | 이 회사 법규에서 빠짐(제외 목록 `GET /ics/laws/except`에서 보임) |
| 4 | 〃 | 줄 더블클릭 | 법규 상세(내용·파일·서식) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics05_relate_manager` | 법규 ↔ 관리그룹 | +2 |
| `sch02_share` | 법규별 공유(일정) — 관리그룹의 부서 복사 | +2 |
| `ics03_company_info` | 회사별 법규 설정(제외 여부 등) | +1 |

## 업무 규칙 · 주의

- 법규 마스터를 고치는 것(`PUT /ics/laws`, 삭제, 이동, 파일 연결)은 KFS 관리자 전용이다. 회사는 **설정(제외·관리그룹·자문 여부)**만 한다.
- 법규 마스터(회사 0)에는 시험용 체크리스트 분류 `영임TEST대분류`가 남아 있어 새 회사에도 보인다 → 체크리스트(ICS-BZ-0003)의 [의심 #129](../../보안_및_버그_의심.md).
- 법규 상세·첨부 조회(`/ics/laws/{id}/detail`·`/files`)·기한 조회는 로그인 정보 인자가 없는 API다(마스터라 노출 위험은 낮다).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0002
needs: [ICS-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/ics/relate-managers, PUT /api/v1/ics/laws/company-info]
    body: [{ managerId: <경영지원 통제그룹>, classTreeIds: [24762, 24763] }, [{ classTreeId: 24764, exceptYn: "true", autoYn: "false", advisYn: "false" }]]
    expect: { track: { ics05_relate_manager: +2, sch02_share: +2, ics03_company_info: +1 } }
  - no: 2
    api: GET /api/v1/ics/laws/manage?mngGroupId=<경영지원 통제그룹>
    expect: { total: 2 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics01_Tab_ClassTreeUser`(#1013), `Ics01_Tab_ClassTree`(KFS), 서버 `Ics01_ClassTree`·`Ics05_RelateManager`·`Ics03_CompanyInfo`.
- TOBE: `IcsLawController`(`/api/v1/ics/laws/manage`·`/company-info`·`/except`), `IcsRelateManagerController`(`/relate-managers` — 지정 때 `deleteShare`·`insertShare`로 일정 공유 복사), `Ics01_Tab_ClassTreeUser.tsx`.
</details>
