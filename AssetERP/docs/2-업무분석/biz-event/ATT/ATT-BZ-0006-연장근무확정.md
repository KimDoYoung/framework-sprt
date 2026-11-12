# ATT-BZ-0006 경영관리팀이 결재 끝난 연장근무를 확정하고 지급방법을 정한다

> **한 줄 요약** — #1486 연장근무관리는 **결재 완료(30)된 연장근무 신청**을 모두 보여 주고(사원·근무시간·사유·보상구분·주/월 누계 `5 / 12`), 경영관리가 지급방법을 고르고 [저장]·[확정]·[확정취소]한다. 확정·지급방법은 신청 행이 아니라 이력 테이블 `att13_overtime_req_hist`에 행마다 한 줄로 남는다. 급여(연장근로수당) 계산의 입력이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(kalpa 과장 301) |
| 언제 | 월말 급여 마감 전 |
| 먼저 있어야 하는 것 | ATT-BZ-0003(결재 완료된 신청) |
| 다음 이벤트 | PAY(연장근로수당 — 아직 정리 안 함) |
| 실제 실행 | kalpa, 2026-11-12, API: 301 목록 2줄(정상 1 + 위조 1). AS-IS SQL과 행 수 일치(2 = 2). 사원 401이 `PUT` 확정 → 200, `att13` +1 |
| 메뉴 | #1486 경영관리 > 06. 근태관리 > 연장근무관리. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1486 | 조회기간 → [조회] | 완료된 연장근무 줄: 확정·근무일자·사원·부서·직위·구분·근무시간·사유·보상구분·지급방법·주 연장근로·월 연장근로(한도에 닿으면 빨간색) |
| 2 | 〃 | 〃 | 지급방법 칸 선택 → [저장] | 지급방법 저장(이력 줄 생성·갱신) |
| 3 | 〃 | 〃 | 줄 체크 → [확정] / [확정취소] | 확정 표시 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `att13_overtime_req_hist` | 신청마다 1줄(지급방법·확정·확정자·변경사유) | +1(사원 401이 넣은 것) |

## 업무 규칙 · 주의

- 목록은 결재 상태 30만. **조회기간은 원본 SQL이 쓰지 않는다**(TOBE `AttOvertimeReqService.getConfirmList` 주석) — 회사 전체 완료 건이 다 나온다.
- ⚠ **TOBE의 '확정' 열은 늘 꺼져 있다.** 원본 `att03_overtime_req.getConfirmList`는 `a13.att13_confirm_yn`을 읽는데 TOBE `AttOvertimeReqMapper.xml` L33은 `COALESCE(att03_confirm_yn,'false')`를 읽는다. [확정]은 `att13`에 쓰므로 눌러도 화면에 반영되지 않는다. 실행: `att13_confirm_yn=true` 저장 뒤 목록 `confirmYn: false` → [의심 #68](../../보안_및_버그_의심.md).
- ⚠ 권한 검사가 없다. 실행: 사원 401이 `PUT /api/v1/att/overtime-reqs {confirmYn:true, rows:[{overtimeReqId:<본인 신청>, paymentTypeCode:"10"}]}` → 200, 본인 연장근무를 확정했다. 사원도 `GET`으로 회사 전체 연장근무 목록을 받는다 → [의심 #67].
- ATT-BZ-0003의 위조 신청(이미 완료된 문서를 붙인 11-13 신청)이 이 목록에 정상 건처럼 나온다 → [의심 #66].
- 지급방법 공통코드 `PaymentTypeCode`가 DB에 없다(회사 0에도) — 콤보가 비고 이름이 빈칸이다 → [의심 #72].
- 주/월 누계는 결재 완료 건의 분 합계를 시간으로 내림한 값 / 근로시간 기준 주 최대(`pay34`, 회사 행이 없으면 회사 0) · 월 한도(`pay01_annual.pay01_month_ot_hours`, 없으면 누계만).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ATT-BZ-0006
needs: [ATT-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/att/overtime-reqs
    compare: att03_overtime_req.getConfirmList   # 2 = 2
  - no: 3
    api: PUT /api/v1/att/overtime-reqs
    body: { confirmYn: true, rows: [{ overtimeReqId: <id>, paymentTypeCode: "10", changeReason: "" }] }
    expect: { track: { att13_overtime_req_hist: +1 }, confirmYn: true }   # TOBE는 false(의심 #68)
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Att03_Tab_OvertimeReq`(E0~E5: 조회·저장·확정·확정취소·지급방법 콤보), 서버 `att.Att03_OvertimeReq.getConfirmList`·`updateInfo`, `Att13_OvertimeReqHist`, SQL `att03_overtime_req.getConfirmList`(L80 `a13.att13_confirm_yn AS att03_confirm_yn`).
- TOBE: `AttOvertimeReqController`(`GET`·`PUT /api/v1/att/overtime-reqs`), `AttOvertimeReqService` L28-46, `AttOvertimeReqMapper.xml` L32-93, `Att03_Tab_OvertimeReq.tsx`.
</details>
