# APR-BZ-0003 상신한 문서를 거두어 고쳐 다시 올리고, 반려·완료 문서는 폐기를 신청한다

> **한 줄 요약** — 아직 아무도 결재하지 않은 문서는 상신자가 [상신취소]로 거두어 **임시저장(99)으로 되돌려** 고친 뒤 다시 [결재요청]할 수 있다(재상신). 누군가 승인했거나 반려·완료된 문서는 상신취소가 안 되고, 상신자는 **폐기를 신청**(승인자 지정)한다. 임시저장 문서는 상신자가 직접 [삭제]한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 상신자(사원 `kalpa/401`), 반려한 결재자(과장 `301`), 폐기 승인자(부장 `201`) |
| 언제 | 잘못 올렸을 때 · 반려됐을 때 |
| 먼저 있어야 하는 것 | APR-BZ-0001(상신), 반려는 APR-BZ-0002 |
| 다음 이벤트 | 폐기 신청 → 승인·복구는 APR-BZ-0009 |
| 실제 실행 | kalpa, 2026-11-12, API. 화면 눈 확인 `대기` |
| 메뉴 | 결재문서 창의 [상신취소]·[문서폐기 신청], #1443 `문서작성 > 01. 문서작성 > 폐기문서 신청현황` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 사원(401) | 결재문서 창 | 결재 301 한 명으로 [결재요청] | 상태 `상신(10)` |
| 2 | 〃 | 〃 | [상신취소] | 문서 `임시저장(99)`, 결재선 상신자 줄이 `대기(10)`로 돌아간다 |
| 3 | 〃 | 〃 | 제목을 고치고 다시 [결재요청] | `상신(10)` 재상신(같은 문서 ID) |
| 4 | 과장(301) | 〃 | [반려] 사유 입력 | 문서 `반려(40)` |
| 5 | 사원(401) | 〃 | 반려된 문서의 [상신취소]·수정 | "상신취소할 수 없는 문서입니다." / "임시저장 문서만 상신자가 수정할 수 있습니다." — 반려 문서는 **새 문서**로 다시 쓴다 |
| 6 | 〃 | 〃 | [문서폐기 신청] 열기 | 폐기 가능 검사 통과(`ok`). 승인자 기본값은 소속 조직장(없으면 직접 지정) |
| 7 | 〃 | 폐기 신청 창 | 사유 "반려 문서 폐기"·승인자 박부장 → [신청] | 폐기 이력(10)·신청서 저장, 승인자에게 알림 |
| 8 | 〃 | #1443 폐기문서 신청현황 | 조회 | 신청 1건: 문서 제목·상태 `반려`·사유·승인자 박부장·승인 `미승인` |
| 9 | 〃 | 결재문서 창 | 같은 문서 다시 [문서폐기 신청] | "해당문서는 이미 폐기신청이 완료되었습니다" |

**임시저장 삭제**

| 단계 | 누가 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|
| D1 | 과장(301) | 임시저장 문서 [삭제] | 문서·결재선 행이 지워진다 |
| D2 | 다른 사원(401) | 같은 문서 [삭제] | "임시저장 문서만 상신자가 삭제할 수 있습니다." |
| D3 | 상신자 | 상신 중·완료 문서 [삭제] | 같은 메시지(삭제 못 함) |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `apr01_appr`·`apr04_appr_step` | 상태 10 → 99 → 10(재상신), 결재선 처음 상태로 | 2·3 |
| `apr90_disposal_list` | 폐기 신청(사유·승인자·문서) +1 | 7 |
| `apr91_disposal_history` | 폐기 이력(구분 10) +1 | 7 |
| `apr01_appr`·`apr04_appr_step` | 임시저장 삭제 시 −1 / −결재선 수 | D1 |

## 결과를 볼 수 있는 화면

- #1019 상신내역(상태), #1443 폐기문서 신청현황(상신자), #1490 폐기문서 승인(승인자, APR-BZ-0009).

## 업무 규칙 · 주의

- **[상신취소] 조건**: 상신자(결재선 첫 줄 본인), 아무도 승인하지 않은 상태. 한 명이라도 승인하면 "결재중인 문서는 상신취소가 불가능합니다". 반려(40)·완료(30)는 불가.
- 업무 화면에서 상신된 문서(`linkCode` 있음)를 상신취소하면 "특정 화면에서 상신된 문서로, 상신취소 시 즉시 폐기됩니다. 진행하시겠습니까?"를 묻고 [예]면 임시저장이 아니라 **폐기문서로 옮겨진다**(`apr99_appr_del`, 업무 화면의 결재 연결은 풀림).
- 폐기 신청 검사: 이미 신청함 / 자금집행결의서가 있음("자금집행결의서가 존재하여 폐기할 수 없습니다") / 증빙자료로 연결됨("증빙자료로 연결되어 있어 폐기할 수 없습니다"). 신청은 완료·반려 문서의 상신자만(다른 사원은 `접근 권한이 없습니다`). 사유·승인자 필수("사유는 필수입력항목입니다"·"승인자는 필수선택항목입니다").
- 재상신은 같은 문서 ID로 되돌아오며 결재선이 처음 상태(상신자 `대기`)부터 다시 시작한다.
- ⚠ 폐기 승인자(`confirmEmpId`)를 서버가 조직장인지 확인하지 않는다(아무 사원 ID나 받음 — 코드로만 확인, 재현 안 함).
- 안 한 것: 화면 눈 확인, 업무 화면 연결 문서 상신취소(즉시 폐기)·인감 날인신청 정리, 폐기 승인·복구(APR-BZ-0009), 반려 문서를 새 문서로 불러오기(`load-docs`).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0003
needs: [APR-BZ-0001, APR-BZ-0002]
steps:
  - no: 1~3
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api:
      - PUT /api/v1/apr/apprs/{apprId}        # mode request, 상신 401 + 결재 301
      - POST /api/v1/apr/apprs/{apprId}/cancel-request   # { confirmed: false }
      - PUT /api/v1/apr/apprs/{apprId}        # 다시 mode request
    expect: { after_cancel: { doc: 99, steps: "001:00:10 002:10:10" }, after_resubmit: { doc: 10 } }
  - no: 4
    actor: { user: "301" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm   # { action: reject, message: "" }
    expect: { doc: 40, rejectReason: "반려사유 미입력" }
  - no: 5
    actor: { user: "401" }
    api: POST /api/v1/apr/apprs/{apprId}/cancel-request
    expect: { data: { ok: false, message: "상신취소할 수 없는 문서입니다." } }
  - no: 6~9
    api:
      - GET /api/v1/apr/apprs/{apprId}/disposal-check
      - POST /api/v1/apr/apprs/{apprId}/disposal   # { reason: "반려 문서 폐기", confirmEmpId: <201> }
      - GET /api/v1/apr/disposal-lists/mine?startDate=2026-11-01&closeDate=2026-11-30
    expect: { tables: { apr90_disposal_list: +1, apr91_disposal_history: +1 }, again: "해당문서는 이미 폐기신청이 완료되었습니다" }
  - no: D1~D3
    api: [DELETE /api/v1/apr/apprs/{임시저장 apprId}]
    expect: { owner: ok, other: "임시저장 문서만 상신자가 삭제할 수 있습니다." }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Apr01_Edit_ApprDoc` 상신취소 가능 판정(L660-728), `cancelCheck01/02`(L1207-1222), `deleteChk01`(L1275-1300), `Apr90_Lookup_DisposalList.updateChk/update`(L108-158), 서버 `apr.Apr92_ApprModi.deleteByApprId`·`apr.Apr04_ApprStep.cancelUpdate`·`apr.Apr90_DisposalList.modelUpdate`(L123-226)·`apr.Apr01_Appr.deleteByApprId`(L1017-1070).
- TOBE: `AprApprActionService.cancelRequest`(L178-201), `AprApprWriteService.delete`(L164-188), `AprApprDisposalService`(`check`·`submit` L37-93), `AprApprExtraController`(`GET /{id}/disposal-check`·`POST /{id}/disposal`), `AprDisposalListController`(`GET /mine`).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
