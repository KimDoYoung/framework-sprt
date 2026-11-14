# TDM-BZ-0007 책무이행점검 — 작업지시 → 점검자 지정·확정 → 점검 → 임원 승인 → 대표이사 보고 → 마감

> **한 줄 요약** — 매월 ① #1455에서 **점검 작업**(점검년월·시작일·마감일)을 만들고 [점검항목생성]으로 **부서 점검현황(`tdm51`)·점검항목(`tdm52`)·승인선(`tdm58`)·임원 승인현황(`tdm53`)**을 한꺼번에 펼친다 ② #1456에서 부서 담당이 항목마다 **점검자**를 지정하고 [확정] → 점검대기(10) ③ 점검자가 #1457에서 점검(진행 11 → 결과·의견 저장 → 점검완료 19; 결과가 **미흡·개선이면 조치계획 필수**) ④ 부서 담당이 [승인요청](20) ⑤ 책무임원이 #1458에서 항목을 승인하고 의견을 적어 **제출**(25) ⑥ #1459에서 미흡 건의 **조치결과**를 적고 조치완료(19) ⑦ #1455에서 임원별 [잠금] 뒤 **대표이사 보고 결재(A94)** → [점검마감]. 점검항목은 **적용 중인 부서 책무매뉴얼(결재 A93 완료)의 점검항목**에서만 만들어지며, 항목의 **점검월(12자리 0/1)과 점검주기**가 그 달에 맞아야 한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 책무 담당(301) · 부서 책무담당자(점검자 401·지정자 202) · 책무임원(202) · 대표이사(100) |
| 언제 | 매월(점검 주기: 월별·분기·반기·연) |
| 먼저 있어야 하는 것 | TDM-BZ-0006(점검항목 + **A93 결재 완료 + 작업대상 [작성완료]**), TDM-BZ-0003(부서 승인선 — **하위 승인자 필수**), 회사 설정 점검 시작일 |
| 다음 이벤트 | TDM-BZ-0008(대시보드·현황) |
| 실제 실행 | kalpa, 2026-11-13. 작업 `2026.11 책무 이행점검`(2026-11-01~11-30) 저장(**ID를 직접 줌**, ⚠#134) → [점검항목생성]이 "미결재된 부서책무매뉴얼이 존재합니다"로 막혀 0006을 마저 했다: 두 의무 [작성완료] → 적용기간 2026-08-01~12-31 저장 → A93 결재(상신 301 → 승인 201, 연결 `PUT /manl-orgs/{id}/appr-id`). 다시 생성 → 점검조직 1건은 생겼으나 **점검항목 0건**(0006의 점검항목에 점검월이 비었음) → `PUT /manls`로 점검월 `111111111111` 저장 뒤 재생성 → 항목 1건. 확정이 "승인선이 존재하지 않습니다"로 막혀 부서 승인선(`tdm09`)에 **하위 승인자(운용본부 ← 정부장)** 추가(`POST /appr-steps/{id}/steps`) 뒤 재생성. 점검자 박과장(401) 지정(202) → [확정](P) → 점검시작(P, 401) → 결과 `2`(미흡)·의견 저장 → 완료 시도 "조치계획을 등록하세요" → 조치계획 `PUT /chck-insuffs` → 점검완료(19) → 승인요청(P, 20) → 임원(202) 일괄승인(P)·의견(A)·제출(P) → 25 → 임원 잠금 → A94 분류 지정(회사 관리자) 뒤 보고 결재(상신 301 → 승인 100)·연결(`POST /check-jobs/{id}/relate-appr`) → [점검마감] → 미흡 조치결과 저장(U)·조치완료(P)(조치상태 19) |
| 메뉴 | #1455 이행점검 작업지시 및 보고 · #1456 업무점검자 지정 및 승인요청 · #1457 책무이행점검 · #1458 책무이행점검 승인 · #1459 미흡내역 조치 · (#1460 대표이행점검 보고 — 메뉴 없음, 이 흐름의 보고는 #1455 [결재요청]). kalpa 메뉴 있음(1455~1459). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 책무 담당 | #1455 | 점검년월 → [작업정보등록](시작일·마감일 → 저장) | 점검 작업(없는 달이면 새 ID의 빈 작업) |
| 2 | 〃 | 〃 | [점검항목생성] | 부서 점검현황·점검항목·승인선·임원 승인현황 생성(실패 문구: "미결재된 부서책무매뉴얼이 존재합니다. #1424 화면에서 결재상태를 확인하세요") |
| 3 | 부서 담당 | #1456 | 부서 선택 → 항목 체크 → [점검자일괄지정] → [확정](승인선) | 항목 점검대기(10), 승인선·점검자 검사 |
| 4 | 점검자 | #1457 | [점검시작] → 점검일·결과(적정 1·미흡 2·개선 3·반려 5·해당없음 9)·의견(10자 이상) → [저장] → [조치계획등록](미흡·개선) → [점검완료] | 점검진행(11) → 점검완료(19) |
| 5 | 부서 담당 | #1456 | [승인요청] | 항목 승인요청(20), 부서장 승인 대기 |
| 6 | 책무임원 | #1458 | 항목 승인(일괄) · 미흡내역 승인 · 의견·보고의견 → [제출] | 항목 승인완료(25), 임원 승인현황 `exctApprYn` |
| 7 | 점검자 | #1459 | 조치결과·조치일 → [저장]·[조치완료] | 조치상태 19 |
| 8 | 책무 담당 | #1455 | 임원 [잠금] → [결재요청](A94) → [점검마감] | 보고 결재 완료, 작업 마감(`endYn`) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `tdm50_chck_job` | 점검 작업 | +1 |
| `tdm51_chck_org` · `tdm52_chck_manl` · `tdm58_chck_appr_step` | 부서 점검현황 · 점검항목 · 점검 승인선 | +1 · +1 · +1 (재생성 때마다 지우고 만든다) |
| `tdm53_chck_exct` · `tdm59_chck_appr_cmnt` · `tdm60_chck_manl_appr` | 임원 승인현황 · 승인의견 · 항목별 승인 | 각 +1 |
| `tdm54_chck_insuff` | 미흡 조치 | +1 (조치완료 19) |
| `tdm55_*` | 점검 이력(처리마다) | 단계마다 +1 |
| `apr01_appr` · `tdm56_chck_relate_appr` | A93·A94 결재 | +2 · +1 |
| `tdm09_appr_step`(0003) · `dcr30_link`(A94) | 하위 승인자 · A94 분류 | +1 · 1줄 갱신 |

## 업무 규칙 · 주의

- **[점검항목생성]이 조용히 0건이 되는 경우**: ① 항목의 `점검월`이 비었거나 그 달이 `0` ② 점검주기(분기·반기·연)의 기준일이 아직 안 옴 ③ 항목 적용 시작일이 점검월 1일보다 뒤 ④ 부서 책무매뉴얼의 적용기간·A93 결재가 안 끝남(이것만 안내 문구가 있다). 오류 없이 `200`이다 → [의심 #137](../../보안_및_버그_의심.md).
- **승인선**: 부서 승인선은 헤더(`C`)만으로는 안 되고 **하위 승인자(`T`) ≥ 1명**이 있어야 하며 마지막 승인자는 **그 책무임원**이어야 한다. 부서 하나에 승인자 1명. 승인선은 **생성 시점에 복사**되므로 승인선을 고치면 [점검항목삭제] 후 다시 생성한다(점검자 지정은 전달 월 값만 이어받아 사라진다).
- 처리구분 코드가 화면마다 다르다: 부서 확정·승인요청 `P/C`, 임원 항목 일괄승인 `P/C`·개별·의견 `A/R/C/U`, 미흡 조치 `U/P/C`. 틀리면 "정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요".
- 점검결과 코드는 한 글자(`1·2·3·5·9`)인데 서버가 검사하지 않아 `"20"` 같은 값은 **500**(`varchar(1)` 초과)이 난다 → 의심 #131과 같은 모양.
- 결과가 미흡·개선이면 [점검완료] 전에 **조치계획**(`PUT /chck-insuffs`)이 있어야 한다("조치계획을 등록하세요"). 증빙 필수 여부는 회사 설정(`evidFileCheckYn`)이 정한다 — kalpa는 증빙 없이 조치완료가 됐다.
- 점검의견·보고의견은 **10자 이상**("의견은 10자 이상 입력해주세요").
- 이행점검 보고(A94)는 `GET /apr/apprs/link-seed` 양식 시드가 없어 `biz-appr`가 못 돌고, A94 문서분류가 회사에 지정돼 있어야 한다(kalpa는 비어 있어 회사 관리자가 책무매뉴얼 분류로 지정). 연결은 `POST /check-jobs/{id}/relate-appr {roleId: 보고CEO 직책, apprId}`.
- 권한: **마감 해제·점검 수정이 '회사'만 본다** → [의심 #135](../../보안_및_버그_의심.md). 작업 ID 채번 → [의심 #134](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: TDM-BZ-0007
needs: [TDM-BZ-0006, TDM-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/tdm/check-jobs
    body: { chckJobId: <새 ID — 클라이언트가 줘야 함(#134)>, checkYm: "2026.11", checkName: "2026.11 책무 이행점검", startDate: "2026-11-01", endDate: "2026-11-30" }
    expect: { track: { tdm50_chck_job: +1 } }
  - no: 2
    api: POST /api/v1/tdm/check-jobs/{chckJobId}/items
    expect: { track: { tdm51_chck_org: +1, tdm52_chck_manl: +1, tdm58_chck_appr_step: +1 } }
  - no: 3
    actor: { company: kalpa, user: "202", password: "1111" }
    api: [PUT /api/v1/tdm/check-manls/checker {chckManlIds, personId: 401의 사원ID}, PUT /api/v1/tdm/check-orgs/{chckOrgId}/fix {actionType: P}]
  - no: 4
    actor: { company: kalpa, user: "401", password: "1111" }
    api: [PUT /api/v1/tdm/check-manls/check-status {actionType: P}, PUT /api/v1/tdm/check-manls/{id} {checkResultCode: "2", checkCmnt: 10자 이상}, PUT /api/v1/tdm/chck-insuffs, PUT /api/v1/tdm/check-manls/{id}/complete {actionType: P}]
    expect: { checkStatusCode: "19" }
  - no: 5
    api: PUT /api/v1/tdm/check-orgs/{chckOrgId}/appr-status {actionType: P}
  - no: 6
    actor: { company: kalpa, user: "202", password: "1111" }
    api: [PUT /api/v1/tdm/check-apprs/{id}/batch-appr {actionType: P, chckManlIds}, PUT .../cmnt {actionType: A, apprCmnt, reportCmnt}, POST /api/v1/tdm/check-apprs/submit {actionType: P}]
    expect: { checkStatusCode: "25" }
  - no: 7
    api: PUT /api/v1/tdm/chck-insuffs/{id}/result
    body: { procType: P, actionDate: "2026-11-20", actionCmnt: 10자 이상 }
  - no: 8
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/tdm/check-jobs/excts/lock, "결재 A94 상신·승인(100)", POST /api/v1/tdm/check-jobs/{id}/relate-appr, PUT /api/v1/tdm/check-jobs/{id}/end {endYn: true}]
    expect: { endYn: true, apprStatusCode: "30" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Tdm50_Tab_CheckJob`(#1455 `createCheckManl`·`updateEndYn`)·`Tdm51_Tab_CheckOrg`(#1456 `updateFix`·`updateApprStatus`)·`Tdm52_Tab_CheckManl`(#1457 `updateCheckStatus`·`updateComplete`)·`Tdm59_Tab_CheckAppr`(#1458 `Tdm59_ChckApprCmnt`·`Tdm60_ChckManlAppr`)·`Tdm54_Tab_CheckInsuff`(#1459 `updateComplete`), 매퍼 `tdm50_chck_job.xml`~`tdm60_chck_manl_appr.xml`.
- TOBE: `TdmCheckJobController`(`/check-jobs`)·`TdmCheckJobService`(`save` L55·`createCheckManl` L99), `TdmCheckOrgController`(`/check-orgs`), `TdmCheckManlController`(`/check-manls`), `TdmCheckApprController`(`/check-apprs`), `TdmChckInsuffController`(`/chck-insuffs`), `TdmApprLinkController`, 매퍼 `TdmCheckJobMapper.xml#insertChckManl` L244-298·`#insertChckApprStep` L301.
</details>
