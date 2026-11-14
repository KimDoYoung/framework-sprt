# ACT-BZ-0003 전표를 승인(확정)한다

> **한 줄 요약** — 회계 담당(책임자)이 입력된 전표(0002)와 자동 생성된 전표를 기간·거래처·거래유형으로 찾아 **승인**하면 전표가 확정되어 고칠 수 없게 되고(승인자·승인일시 기록), 잘못 확정했으면 **승인취소**로 되돌린다. 승인·취소는 회계마감(0006)된 날짜 이전·당일에는 막힌다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계 책임자 |
| 언제 | 전표 입력 뒤(보통 월 마감 전) |
| 먼저 있어야 하는 것 | ACT-BZ-0002 전표(또는 카드·펀드보수 등에서 자동 생성된 전표) |
| 다음 이벤트 | ACT-BZ-0004 장부 조회, ACT-BZ-0006 마감 |
| 실제 실행 | kalpa, 2026-11-13, API. 미승인 전표 14건 목록 확인 → 시험 전표 승인(승인자 `관리자`, 승인일시 기록) → 승인 전표 수정 거절("승인완료 전표입니다.") → **승인 전표 삭제는 허용됨(⚠#197)** → 사원 402가 승인(승인자 `최사원`, ⚠#198) → 관리자 승인취소 → 존재하지 않는 전표 ID는 DATA_NOT_FOUND → 시험 전표 모두 삭제(남은 시험 전표 0). 회계마감 걸린 날짜의 승인 거절은 마감(0006) 때 확인 예정. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1207 관리회계 > 10. 전표입력 > 전표승인처리. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 책임자 | #1207 | 기간·거래처·거래유형·미승인만 → [조회] (`GET /act/journal-fixes`) | 전표 목록(승인여부) |
| 2 | 〃 | #1207 | 행 클릭 → 아래에 분개 내역 (`GET /act/journal-fixes/{id}`) | 분개 확인 |
| 3 | 〃 | #1207 | 행 체크 → [승인] (`POST /act/journal-fixes/confirm {procType:"P"}`) | `act02_journal` 승인여부·승인자·승인일시 |
| 4 | 〃 | #1207 | 행 체크 → [승인취소] (`procType:"C"`) | 승인 해제 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `act02_journal` | 승인여부·승인자 이름·승인일시 | 승인 → `승인/관리자`, 취소 → 빈 값 |

## 업무 규칙 · 주의

- 승인 뒤에는 전표 수정이 막힌다(0002 `save`). 승인취소를 해야 다시 고칠 수 있다.
- 마감 검사 둘: 처리일 이후에 마감이 있으면 "처리일(…) 이후의 회계마감 내역이 존재합니다.", 처리일이 마감일이면 "이미 회계마감이 완료되었습니다." 여러 건 중 하나라도 걸리면 전부 취소(트랜잭션).
- TOBE는 내 회사 전표만 DB 값으로 검사한다(AS-IS는 화면이 보낸 회사·일자를 믿음). 다른 회사 ID는 DATA_NOT_FOUND.
- **승인 전표를 지울 수 있다**(전표삭제 화면·API에 승인 검사 없음, 원본도 같은 구조) → [의심 #197](../../보안_및_버그_의심.md). **메뉴 권한 없는 사원이 승인·취소한다** → [의심 #198](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ACT-BZ-0003
needs: [ACT-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/act/journal-fixes/confirm
    body: { procType: P, journalIds: ["{journalId}"] }
    expect: { track: { act02_journal: 0 } }
  - no: 2
    api: POST /api/v1/act/journal-fixes/confirm
    body: { procType: C, journalIds: ["{journalId}"] }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Act02_Tab_JournalFix`(#1207), 서버 `Act02_Journal.updateFixYn`(L597-636) — 마감 두 검사 후 `act02_journal.updateFixYn`.
- TOBE: `ActJournalFixController`·`ActJournalFixService.updateFixYn`.
</details>
