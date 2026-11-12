# ATT-BZ-0004 직원이 오후근무를 신청하고 결재받는다

> **한 줄 요약** — 오전에 일이 있어 늦게 나와 늦게 퇴근하는 날은 출퇴근 창의 [오후근무 신청]으로 근무일자·사유를 저장하고 **오후근무 신청서(링크 A73)**를 결재 올린다. 결재가 끝난 날은 정책의 오후근무 시각(예 13:00~22:00)이 그날의 기준이 되어 지각이 아니고, 연장근무 시간도 22:00부터 센다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(402 최사원) → 결재자(팀장 302) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | ATT-BZ-0001(오후근무 시각), A73 문서분류(ATT-BZ-0003 단계 0) |
| 다음 이벤트 | ATT-BZ-0005·0007(상태 판정) |
| 실제 실행 | kalpa, 2026-11-12, API: 402 `2026-11-16` "오전 병원" → 신청서 `202611129140095` 상신 → 302 승인(완료). 그날 연장근무 창 `pmWorkOnDate: true` |
| 메뉴 | 메뉴 없음 — 출퇴근 창 단추로 여는 `Att05_Lookup_PmWork`. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | 출퇴근 창 | [오후근무 신청] | 오후근무 신청 창(내 신청 목록) |
| 2 | 〃 | 신청 창 | [등록] → 근무일자·사유 → [저장] | 줄 저장. 같은 날 신청이 있으면 "같은 근무일자에 이미 신청내역이 존재합니다.", 그날 연장근무 신청이 있으면 "해당일자 연장근무 신청 내역이 있습니다. 취소 후 진행해주세요" |
| 3 | 〃 | 〃 | 줄의 상신 아이콘 → 결재선 → [결재요청] | 제목 `오후근무 신청서 / 최사원 사원 (2026-11-16)`, 상태 `상신` |
| 4 | 결재자 | 결재문서 창 | [승인] | 상태 `완료`. 이후 수정·삭제 불가("결재완료된 항목은 수정이 불가능합니다") |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `att05_pm_work` | 신청 1줄·`att05_appr_id` | kalpa +1 |
| `apr01_appr`·`apr04_appr_step` | 오후근무 신청서(A73) | +1(완료) |

## 결과를 볼 수 있는 화면

- 신청 창 상태, 연장근무 신청 창(그날 근무시간이 오후근무 퇴근시각부터), #1485·#1487·#1492 근무형태.

## 업무 규칙 · 주의

- ⚠ **남의 오후근무를 고칠 수 있다.** TOBE 잠금 검사는 내 줄만 찾고(`selectByIds(company, person, ids)`), 수정 SQL(`AttPmWorkMapper.update` L77-82)은 `pm_work_id`만 조건이다. 실행: **401이 402의 결재완료 줄**(`202611129140094`)을 `PUT /api/v1/att/pm-works {rows:[{pmWorkId, workDate:"2026-11-20", reason:"401이 바꿈", changed:true}]}`로 보내자 날짜·사유가 바뀌었다(결재 완료 상태 그대로). 같은 방법으로 되돌렸다 → [의심 #69](../../보안_및_버그_의심.md)(상). 원본도 UpdateDataModel이라 서버가 주인을 보지 않는다.
- "그날 연장근무 신청 있음" 검사도 `baseDate`가 있을 때만 한다(연장근무 주간 합계와 같은 모양, [의심 #65]).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ATT-BZ-0004
needs: [ATT-BZ-0001, ATT-BZ-0003]
steps:
  - no: 2
    actor: { company: kalpa, user: "402", password: "1111" }
    api: PUT /api/v1/att/pm-works
    body: { baseDate: "2026-11-16", rows: [{ workDate: "2026-11-16", reason: "오전 병원", changed: true }] }
    expect: { track: { att05_pm_work: +1 } }
  - no: 3
    api: [GET /api/v1/apr/apprs/new, GET /api/v1/apr/apprs/link-seed?linkCode=A73&refId=<pmWorkId>, PUT /api/v1/apr/apprs/{apprId}, PUT /api/v1/att/pm-works/{pmWorkId}/appr?apprId=]
  - no: 4
    actor: { company: kalpa, user: "302", password: "1111" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    expect: { statusName: 완료 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Att05_Lookup_PmWork`(defaultCheck L147-150 A73, 상신 L166-202·L221, update L238·L368, notInPmWorkIdList L299, 연장근무 확인 L347, delete L408), `Apr01_Edit_ApprDoc` L1633-(A73 제목·본문), 서버 `att.Att05_PmWork`.
- TOBE: `AttPmWorkController`(`/api/v1/att/pm-works` GET·PUT·DELETE·`/{id}/appr`), `AttPmWorkService.save` L42-86, `AttPmWorkMapper.xml` `update` L77-82, `Att05_Lookup_PmWork.tsx`.
</details>
