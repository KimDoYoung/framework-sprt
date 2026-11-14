# ACT-BZ-0006 회계를 마감한다(마감검증·마감·마감취소)

> **한 줄 요약** — 회계 책임자가 월말에 **마감검증**(예금·금융자산·감가상각·펀드보수·미승인 전표 등 13개 체크)을 돌려 이상이 없으면 **마감**한다. 마감하면 그 달의 결산원장(`act05`)이 만들어지고 전표에 마감 표시가 붙어서, 그 날짜 이전의 전표는 입력·수정·승인이 막힌다. 잘못 마감했으면 **마감취소**(가장 마지막 달부터)로 푼다. 마감은 한 달씩 차례로만 된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계 책임자(마감 검증 항목 설정은 KFS 관리자) |
| 언제 | 매월 말 |
| 먼저 있어야 하는 것 | 전월 마감, 모든 전표 승인(0003), 예금대사 결과보고 결재 완료(`depositApprYn` 켜진 회사) |
| 다음 이벤트 | (없음 — 다음 달 0002로 돌아감) |
| 실제 실행 | kalpa, 2026-11-13, API. 마감 검증(A) 13개 항목 결과 확인 → **마감(P)이 "예금대사 결과보고 상신문서가 미완료"로 막힘**(결재 문서 없음) → KFS가 kalpa의 `depositApprYn`을 잠시 끔(`PUT /act/close-checks`) → 2026-01 마감(`act05` +3) → 같은 달 재마감 거절 → 2월을 건너뛰고 3월 마감 거절("전월 회계마감 후 처리가능합니다.") → 마감된 1월 날짜 전표 입력 거절 → 2월 마감 → 1월 마감취소는 2월이 있어 거절 → 2월·1월 순서로 취소(`act05` 원복) → 이미 풀린 달 취소 거절 → 사원 402가 마감·취소(⚠#201) → 설정 원복. 계정원장·예금원장 정리 옵션·연결산(결산일 12/31)·승인 전표 날짜 마감 승인 거절은 안 함(승인은 0003의 같은 검사 코드). 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1195 관리회계 > 20. 결산 > 회계마감, #1368 기초자료 > 40. 관리회계 > 마감검증 체크항목(KFS). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 책임자 | #1195 | 연도 → [조회] (`GET /act/gen-ledger-closes?year=`) | 월별 마감 여부 |
| 2 | 〃 | #1195 | 월 선택 → [마감검증] (`POST …/process {procType:"A"}`) | 13개 체크 결과 문구(마감은 안 함) |
| 3 | 〃 | #1195 | 월 선택 → [회계마감] (`procType:"P"`, 정리 옵션 `depositUpdateYn`·`genLedgerUpdateYn`) | 예금·계정원장 정리(옵션) → 검증 → `act05` 생성 → 전표 마감 표시 |
| 4 | 〃 | #1195 | 월 선택 → [마감취소] (`procType:"C"`) | `act05` 삭제, 전표 마감 표시 해제 |
| 5 | KFS | #1368 | 회사별 마감 검증 항목 켜기/끄기 → 저장 (`PUT /act/close-checks`, KFS만) | 그 회사의 검증 13개 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `act05_gen_ledger_close` | 마감 결산원장(마감 한 번에 3행) | 마감 +3 → 취소 −3 (77 → 77) |
| `act02_journal` | 전표 마감 표시(`closeYn`) | 마감하면 true, 취소하면 false |
| `act15_close_check` | 회사별 검증 항목 켜짐/꺼짐 | 저장하면 행 ID가 새로 바뀜(12 → 새 ID). 값은 원복 |

## 업무 규칙 · 주의

- 마감 순서: 처리일 이후에 마감이 있으면 "처리일 이후의 회계마감 내역이 존재합니다."(취소·입력·승인 모두 해당), 전월이 마감 안 됐으면 "전월 회계마감 후 처리가능합니다.", 이미 마감이면 "이미 회계마감이 완료되었습니다. 마감취소 후 재마감 가능합니다.", 마감 안 한 달 취소는 "회계마감 전 입니다."
- 마감검증(A)은 **상태 1(성공)으로 와도 문구에 실패가 적힌다**(예: "예금대사 결과보고 상신문서가 미완료입니다"). 앞 단계 실패가 뒤 단계 성공에 덮이는 AS-IS 동작을 그대로 따른다. 화면은 문구(notes)를 봐야 한다. 마감(P)은 첫 실패에서 멈추고 status −1이다.
- 결재 문서(예금대사 결과보고)가 있어야 마감되는 회사는 [CRD-BZ-0006](../CRD/CRD-BZ-0006-일일자금관리.md)처럼 결재를 먼저 끝내야 한다. kalpa에는 이 결재가 없어 KFS가 검증 항목을 잠시 껐다.
- 마감 검증의 "미승인 전표 0건" 항목은 0004에서 본 대로 장부·재무제표가 미승인 전표까지 포함하기 때문에 필요하다.
- **마감 검증 설정(`GET /act/close-checks`)이 다른 고객사 설정까지 모두 돌려준다**(KFS 화면 #1368용 API, 검사 없음). → [의심 #201](../../보안_및_버그_의심.md). **메뉴 권한 없는 사원이 회계를 마감·취소한다** → 같은 의심에 적음.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ACT-BZ-0006
needs: [ACT-BZ-0003, ACT-BZ-0005]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/act/gen-ledger-closes/process
    body: { closeDate: "2026-01-31", procType: "A", depositUpdateYn: false, genLedgerUpdateYn: false }
    expect: { status: 1 }
  - no: 2
    api: POST /api/v1/act/gen-ledger-closes/process
    body: { closeDate: "2026-01-31", procType: "P", depositUpdateYn: false, genLedgerUpdateYn: false }
    expect: { track: { act05_gen_ledger_close: +3 } }   # kalpa는 depositApprYn을 먼저 꺼야 함(KFS)
  - no: 3
    api: POST /api/v1/act/gen-ledger-closes/process
    body: { closeDate: "2026-01-31", procType: "C", depositUpdateYn: false, genLedgerUpdateYn: false }
    expect: { track: { act05_gen_ledger_close: -3 } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Act04_Tab_Close`(#1195)·`Act04_Lookup_AccountClose`, 서버 `Act04_GenLedger.insertClose`(L199-380)·`closeValidate`(L382-1013), `Act15_Tab_CloseCheck`(#1368).
- TOBE: `ActGenLedgerController`·`ActGenLedgerService.close/run/closeValidate`, `ActCloseCheckController`.
</details>
