# ICS-BZ-0017 확인한 체크리스트를 대분류별로 결재 상신한다(A27)

> **한 줄 요약** — 확인자(준법감시인 등)가 #1230에서 체크리스트를 확인한 뒤 [상신]을 누르면 **대분류별 상신 현황**(대분류·전체 건수·확인 건수·결재 상태) 창이 열리고, 대분류를 골라 결재문서(문서분류에 지정된 **A27 내부통제 체크리스트 점검보고**)를 쓴다. 결재문서가 상신되면 `ics16_relate_appr`에 **이달·주기·대분류 ↔ 결재문서**가 연결돼 현황에 `상신→결재중→완료`가 보인다. 이미 완료된 문서가 있는 대분류를 다시 상신하면 **이전 문서는 폐기 보관 후 삭제**된다(확인 팝업).

| 항목 | 내용 |
|:---|:---|
| 누가 | 확인자 박부장 201(상신), 결재자 김사장 100 |
| 언제 | 매 주기 확인을 마친 뒤 |
| 먼저 있어야 하는 것 | ICS-BZ-0003(확인), 문서분류지정 A27, 결재 체계(APR) |
| 다음 이벤트 | 완료 후 준법감시 현황(#1231) |
| 실제 실행 | kalpa, 2026-11-13. 회사 관리자가 A27 문서분류를 `내부통제 체크리스트`로 지정(⚠ 시험 설정이 남음) → 201이 상신 현황 조회(경영관리업무 전체 4·확인 2) → A27 결재문서(상신 201 → 결재 100) 작성·상신 → 연결(`ics16` +1, 현황 `상신`) → 100 승인 → 현황 `완료`. 확인 2/4 상태로도 상신이 됨(원본도 완료 검사 없음). ⚠ 사원 401이 다른 문서 ID로 다시 연결하며 `lastApprId`로 **완료된 결재문서를 삭제**시킴(복구 불가 — 사본은 `apr99_appr_del`) |
| 메뉴 | #1230 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 확인(부서장) → [상신]. kalpa 메뉴 없음(API). 화면 눈 확인 `대기`, RD(상신 전 결과 PDF 만들기) 확인 안 함 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | 회사 관리자 | #1280 | A27 문서분류 지정 | 상신 양식 |
| 1 | 확인자 | #1230 | 연도·월 → [상신] | 대분류별 상신 현황 창 |
| 2 | 〃 | 현황 창 | 대분류 줄 선택 → (이전 문서가 있으면 확인) | RD 결과 생성 → 문서분류 선택 → 결재문서 창 |
| 3 | 〃 | 결재문서 창 | 제목·본문·결재선 → [결재요청] | 상태 `상신` |
| 4 | 결재자 | 결재함 | [승인] | 상태 `완료` |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `dcr30_link` | A27 ↔ 문서분류 | 1줄 갱신(남음) |
| `apr01_appr`·`apr04_appr_step` | 결재문서·결재선 | +1·+2(401 시험으로 문서는 삭제됨, 결재선은 고아 ⚠) |
| `ics16_relate_appr` | 이달 대분류 ↔ 결재문서 | +1(남음, 연결이 임의 문서로 바뀜 ⚠) |
| `apr99_appr_del` | 폐기 보관 | +1 |

## 업무 규칙 · 주의

- 상태 표시: 연결 문서가 없으면 빈칸, 상신 10·결재중 20·완료 30·반려 40, 임시저장 99는 "이어서 상신"이다. 10·20이면 "결재진행 중인 문서가 존재합니다"로 막고, 그 밖의 상태에서 다시 상신하면 이전 문서가 폐기된다.
- 서버는 **확인 건수가 전체와 같은지 보지 않는다**(원본도 같음).
- ⚠ 연결 API는 `본인·회사` 검사뿐이라 **일반 사원이 완료된 보고 문서를 삭제**할 수 있다 → [의심 #148](../../보안_및_버그_의심.md).
- `yunhee biz-appr A27`은 A27에 연결 시드가 없어 `AttributeError`(`seed_data` None)로 멈춘다. 이번에는 결재문서 API(`GET /apr/apprs/new` → `PUT … mode request` → `POST …/confirm`)를 직접 불렀다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0017
needs: [ICS-BZ-0003, APR-BZ-0001]
steps:
  - no: 0
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/dcr/links
    body: [{ linkId: <A27>, classTreeId: <내부통제 체크리스트> }]
  - no: 1
    actor: { company: kalpa, user: "201", password: "1111" }
    api: GET /api/v1/ics/checklist-confirms/relate-apprs?stdDate=2026-11-01&cycleType=M
    expect: { rows: 1 }
  - no: 2
    actor: { company: kalpa, user: "201", password: "1111" }
    api: [GET /api/v1/apr/apprs/new, PUT /api/v1/apr/apprs/{id}  # mode request, linkCode A27]
    expect: { appr_status: 10 }
  - no: 3
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/ics/checklist-confirms/relate-apprs/appr-id
    body: { stdDate: "2026-11-01", cycleType: M, checklistLClassId: 202309159433556, apprId: <2단계>, lastApprId: null }
    expect: { track: { ics16_relate_appr: +1 } }
  - no: 4
    actor: { company: kalpa, user: "100", password: "1111" }
    api: POST /api/v1/apr/apprs/{id}/confirm
    body: { action: confirm, message: 확인했습니다 }
    expect: { appr_status: 30 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics15_Tab_ChecklistConfirm`(#1230)·`Ics16_Lookup_RelateAppr` — 서버 `Ics16_RelateAppr.updateApprId`·`Dcr30_Link.selectByLinkCode`(A27).
- TOBE: `IcsChecklistConfirmController`(`/checklist-confirms/relate-apprs`·`/appr-id`)·`IcsChecklistConfirmService.updateRelateApprId` L86-106.
</details>
