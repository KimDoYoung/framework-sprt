# TDM-BZ-0006 부서책무매뉴얼 — 작업대상을 정하고 책무의무를 부서에 나눠 점검항목을 작성한다

> **한 줄 요약** — 임원의 책무를 부서가 실제로 점검하게 하려면 ① #1420에서 **매뉴얼 작업대상**(직책·부서·적용 시작일)을 선정하고 ② [책무의무 생성]으로 그 직책의 **관리의무**를 작업 대상 부서의 **매뉴얼 의무**(`tdm41`)로 펼치며 ③ #1421에서 의무를 **부서에 지정**하고 [확정]한 뒤 ④ #1422에서 부서의 **점검항목**(점검 내용·주기·증빙·방법·근거·중요도·임원 관리의무 매핑)을 작성하고 ⑤ #1423에서 부서장이 **보고(결재 A93)**한다. 책무의무는 **적용 시작일 기준으로 결재 완료된 직책배정의 확정 책무**에서 만들어진다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 책무 담당(301) → 부서 책무담당자·관리자 |
| 언제 | 책무구조도 시행·직제 변경 때 |
| 먼저 있어야 하는 것 | TDM-BZ-0004(결재 완료·확정 책무가 채워진 배정), 0002, 0003(담당자) |
| 다음 이벤트 | 매뉴얼 부서 보고(#1423 — 결재 A93, 이번엔 시험 안 함), TDM-BZ-0007(이행점검) |
| 실제 실행 | kalpa, 2026-11-13. 작업대상 `2026 하반기 운용본부 책무매뉴얼`(직책 운용본부장·부서 운용본부, 적용 시작일 2026-07-01) 저장 → [책무의무 생성] **0건**(`insertDuties` Updates 0) — 정부장의 2026-07-01 배정은 확정 책무가 비어 있어서(TDM-BZ-0004). 정부장에게 2026-08-01 배분일을 만들어 확정 책무를 채우고 **적용 시작일을 2026-08-01로 고치자** 의무 2건·부서 지정 2건 생성(`tdm41` +2, `tdm44` +2) → 부서 지정 [확정] → 부서 책무매뉴얼(`tdm42` 운용본부) 생성 → `GET /manls/next-id` → 점검항목 1건 저장(점검 주기 월별 `03`, 근거 "자본시장법 제81조", 증빙 "투자한도 점검표", 중요도 상, 임원 관리의무 `10,30`) → `tdm43` +1 |
| 메뉴 | #1420 매뉴얼 작업대상 선정, #1421 매뉴얼 부서지정, #1422 매뉴얼(점검항목) 작성, (#1423 매뉴얼 보고(부서별), #1424 매뉴얼 관리). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 책무 담당 | #1420 | [등록] → 작업명·직책·부서·적용시작일·사유 → [저장] → [책무의무 생성] | 작업대상, 생성된 매뉴얼 의무 수 |
| 2 | 〃 | #1421 | 의무 선택 → [부서 지정] → [확정] | 의무 ↔ 부서, 확정 시 부서 책무매뉴얼 생성 |
| 3 | 부서 담당 | #1422 | [등록] → 점검항목(내용·주기·증빙·방법·근거·중요도) → [저장] | 점검항목(점검항목코드 자동) |
| 4 | 부서장 | #1423 | [보고] → 결재(A93) | 보고 문서 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `tdm40_manl_job` | 매뉴얼 작업대상 | +1 |
| `tdm41_manl_duty` · `tdm44_manl_duty_org` | 매뉴얼 의무 · 의무-부서 지정 | +2 · +2 |
| `tdm42_manl_org` | 부서별 책무매뉴얼 | +1 |
| `tdm43_manl` | 점검항목 | +1 |

## 업무 규칙 · 주의

- **책무의무 생성이 0건이면 배정의 확정 책무(`tdm35`)가 비어 있거나 적용 시작일에 유효한 결재 완료 배정이 없는 것**이다. 서버는 이유를 알려 주지 않고 `200 Updates 0`으로 끝낸다. 작업대상의 **적용 시작일**이 바뀌면 [책무의무 삭제 → 다시 생성]이 필요하다(이번엔 `DELETE /manl-jobs/{id}/contents` 뒤 재생성).
- 점검항목 저장(`PUT /tdm/manls`)은 본문이 **배열이 아니라 객체**이며 `manlId`는 `next-id`로 먼저 받아야 한다(없으면 "입력값이 올바르지 않습니다." — 어느 칸이 문제인지 알려 주지 않는다). 잘못된 JSON 타입은 400이 아니라 500이 난다.
- 매뉴얼 API 일부(`/manls/{id}/row`·삭제·연결)는 컨트롤러에 로그인 인자가 없지만 서비스가 회사를 검사한다(다른 회사 매뉴얼 → 403).
- 매뉴얼 쓰기 API는 '회사' 검사뿐이다 → [의심 #133](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: TDM-BZ-0006
needs: [TDM-BZ-0004, TDM-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/tdm/manl-jobs, POST /api/v1/tdm/manl-jobs/{id}/duties]
    body: [{ regDate: "2026-07-01", jobName: 2026 하반기 운용본부 책무매뉴얼, manlApplyStartDate: "2026-08-01", roleId: <운용본부장>, orgId: <운용본부>, jobReason: …, startDate: "2026-07-01" }]
    precondition: 운용본부장 배정의 2026-08-01 배분일이 결재 완료 + 확정 책무(tdm35) 있음
    expect: { track: { tdm40_manl_job: +1, tdm41_manl_duty: +2, tdm44_manl_duty_org: +2 } }
  - no: 2
    api: [POST /api/v1/tdm/manl-duties/confirm?manlJobId=<작업>, GET /api/v1/tdm/manls/next-id, PUT /api/v1/tdm/manls]
    body: { manlId: <next-id>, manlOrgId: <운용본부 매뉴얼>, orgId, exctId, roleId, taskId, taskRelateDetailId, taskRelateDutyId, manlDutyId, checkItem: …, checkCycleCode: "03", refBasis: 자본시장법 제81조, importLevelCode: "1", exctDutyMap: "10,30", startDate: "2026-08-01" }
    expect: { track: { tdm42_manl_org: +1, tdm43_manl: +1 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Tdm40_Tab_ManlJob`(#1420)·`Tdm41_Tab_ManlDutyOrg`(#1421)·`Tdm43_Tab_ManlItemReg`(#1422 `Tdm43_Manl.modelUpdate`)·`Tdm42_Tab_ManlOrgAppr`(#1423, 링크 A93), DB 함수 `f_create_tdm_manual`·`f_inner_make_manual`.
- TOBE: `TdmManlJobController`(`/manl-jobs`·`/duties`)·`TdmManlJobMapper.xml#insertDuties`·`#insertDutyOrgs`, `TdmManlDutyController`(`/manl-duties`·`/confirm`), `TdmManlController`(`/manls` — `save` L66-85), `TdmManlOrgController`.
</details>
