# ACT-BZ-0004 회계장부(분개장·계정별원장·계정과목집계표)를 본다

> **한 줄 요약** — 회계 담당이 입력·승인한 전표(0002·0003)가 장부에 어떻게 쌓였는지 본다. **분개장**은 전표를 날짜순 차변/대변 줄로, **계정별원장**은 계정 하나의 거래와 누적 잔액을, **계정과목집계표**는 계정과목 트리별 전일·금일 잔액을 보여 준다. 집계표는 [계정원장 정리]를 눌러야 최신이 된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계 담당 |
| 언제 | 수시, 월말 점검 때 |
| 먼저 있어야 하는 것 | ACT-BZ-0002 전표(승인 여부는 상관없음, 아래 주의) |
| 다음 이벤트 | ACT-BZ-0005 재무제표, ACT-BZ-0006 마감 |
| 실제 실행 | kalpa, 2026-11-13, API. 시험 전표 2건(접대비 50,000 승인·30,000 미승인, 현금 대변)을 만들고 → 분개장 2행(차변 접대비·대변 현금 짝) → 계정별 목록(13개 거래유형) → 계정별원장(접대비 차변, 현금 대변 누적잔액 −50,000 → −80,000) → [계정원장 정리](`/gen-ledgers/summary`) → 집계표 접대비 금일 증감 **80,000(미승인 포함)** → 사원 402도 분개장 조회·계정원장 정리 가능(⚠#199) → 시험 전표 삭제 후 정리 다시 → 접대비 금일 증감 0(300,000 원복). 출력(RD)·엑셀·외화 분개장(#1177)은 안 함. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1149 분개장, #1177 분개장(외화), #1150 계정별원장, #1151 계정과목집계표 (모두 관리회계 > 21. 회계장부). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 담당 | #1149 | 기간·거래처·거래유형·검색 [조회] (`GET /act/journal-dtls`) | 전표별 차변/대변 줄 |
| 2 | 〃 | #1150 | 계정 선택(`GET …/account-codes`로 거래 있는 목록) → 기간 [조회] (`GET …/by-account`) | 거래와 누적 잔액(`balAmt`) |
| 3 | 〃 | #1151 | 기준일·구분 [조회] (`GET /act/gen-ledgers`) | 계정 트리별 전일/금일 잔액·증감 |
| 4 | 〃 | #1151 | [계정원장 정리] (`POST /act/gen-ledgers/summary`) | `act04_gen_ledger`을 기간만큼 다시 만듦(`f_create_genledger`) |
| 5 | 〃 | #1151 | 행 더블클릭 → 계정별 일자 내역 (`GET /act/gen-ledgers/by-account`), [출력/다운로드] | (안 함) |

## DB에 남는 것

조회는 남기지 않는다. 쓰기는 [계정원장 정리] 하나다.

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `act04_gen_ledger` | 일자별 계정과목 잔액 요약(집계표의 원천) | 2026-11-13 35행이 시험 전표를 반영했다가 정리 다시 뒤 원복 |

## 업무 규칙 · 주의

- 집계표 구분(`diffType`)은 `1`이면 증감 없는 계정을 뺀다(0행), 그 밖의 값은 전부(34행).
- **미승인 전표도 장부·집계표에 들어간다.** `f_create_genledger`가 분개장(`act03`)만 읽고 승인 여부(`act02` 승인)를 보지 않는다. 계정원장 쪽도 같다. 그래서 마감(0006)이 "미승인 전표 0건"을 따로 검사한다. 버그가 아니라 구조로 보고 의심에는 적지 않았다.
- 집계표는 [계정원장 정리]를 하지 않으면 새 전표가 안 보인다(전표를 지워도 마찬가지 — 정리 다시 해야 원복).
- 분개장 `journalNo`는 일자별 순번(261113014, 015…)이고 전표별로 서로 다르다.
- **메뉴 권한 없는 사원이 장부를 읽고 [계정원장 정리]로 집계표를 다시 만든다** → [의심 #199](../../보안_및_버그_의심.md).
- `close-check`(`GET /act/gen-ledgers/close-check`)는 로그인 검사 표시가 `⚠없음`이나 읽기 전용 마감 여부 확인이다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ACT-BZ-0004
needs: [ACT-BZ-0002, ACT-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: GET /api/v1/act/journal-dtls?startDate=2026-11-13&closeDate=2026-11-13
    expect: { rows: ">=2" }
  - no: 2
    api: GET /api/v1/act/journal-dtls/by-account?startDate=2026-11-13&closeDate=2026-11-13&accountCode=3101010000
  - no: 3
    api: POST /api/v1/act/gen-ledgers/summary
    body: { startDate: "2026-11-13", closeDate: "2026-11-13" }
  - no: 4
    api: GET /api/v1/act/gen-ledgers?stdDate=2026-11-13&diffType=0
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Act02_Tab_Journal`(#1149)·`Act02_Tab_JournalSub`(#1150)·`Act04_Tab_GenLedger`(#1151), 서버 `Act02_Journal`·`Act04_GenLedger.summaryGenLedger`(DB 함수 `f_create_genledger`).
- TOBE: `ActJournalDtlController`·`ActGenLedgerListController`.
</details>
