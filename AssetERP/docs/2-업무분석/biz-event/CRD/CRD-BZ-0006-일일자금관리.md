# CRD-BZ-0006 일일 자금(예금 잔고·입출금)을 정리하고 결재받는다

> **한 줄 요약** — 경영관리·자금담당이 하루의 **예금 잔고와 입출금 내역**(#1164 일일자금관리)을 보고, 필요하면 **[예금잔고정리]**로 잔고를 다시 계산한 뒤 **[출력]**하거나 **[상신]**(링크 **A17 일일자금관리**)해 대표 결재를 받는다. 잔고 정리·대사는 AST-BZ-0004, 입출금 원천은 AST-BZ-0003~0007이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 자금담당(경영관리 301) → 결재자(대표 100) |
| 언제 | 매일 |
| 먼저 있어야 하는 것 | AST-BZ-0002(예금계좌)·AST-BZ-0003~0007(분개·잔고), 문서분류 지정(A17) |
| 다음 이벤트 | — (CRD 마지막) |
| 실제 실행 | kalpa, 2026-11-13, API. 잔고 정리(2026-11-10부터 — 환평가 내역이 있어 거절됨) → 일일 잔고 2행(우리은행 KRW −15,800,000(기초잔고 없음)·USD)·통화별 합계(USD 5,020) → 우리은행 입금(0행)·출금(2행: USD 환전·…) 내역 → A17 문서분류 지정 → 상신 연결 생성 → [출력] 자료(그룹 ID) → A17 상신(제목 `일일자금현황_2026-11-13`, 301 → 100) → 결재 ID 기록 → 100 승인 **완료(30)** → 연결 상태 `완료`. 사원 402로 연결을 새로 만들어 "미상신"으로 되돌리고, 위조 잔고가 본문에 실리는 것 확인(⚠#192·#193, 되돌림). RD 출력 화면 확인 `대기(일괄)` |
| 메뉴 | #1164 자금관리 > 10. 자금관리 > 일일자금관리 (#1470 고유자산 > 40. 예금관리 같은 화면). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 자금담당 | #1164 | 기준일 → [조회] (`GET /ast/books/deposits?holdDate`, `…/cur-sums`) | 계좌별 전일잔고·입금·출금·잔고, 통화별 합계 |
| 2 | 〃 | #1164 | 행 선택 → 아래 입금·출금 내역 (`GET /act/journal-dtls/by-ast?drCrType=D|C`) | 분개 내역 |
| 3 | 〃 | #1164 | [예금잔고정리] (`POST /ast/books/deposits/clean {stdDate}`) | 기준일~오늘 잔고 재계산. 이후 환평가 내역이 있으면 "환평가취소 후 진행하세요" 거절 |
| 4 | 〃 | #1164 | [출력] (`POST /act/deposit-ios/rd-print` → RD) | RD 일일자금 현황 |
| 5 | 〃 | #1164 | 문서분류(A17) → [상신] → (`POST /ast/relate-apprs`) → 결재문서 창(본문 = 일일자금 표) → 결재요청 → (`PUT …/{id}/appr-id`) | 상신, 연결 `상신` |
| 6 | 결재자 | 결재문서 창 | [승인] | `완료`(30), 연결 `완료` |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `ast80_relate_appr` | 일자·링크코드(A17) ↔ 결재문서 | +1(같은 일자는 덮어씀, 최종 1행 `완료`) |
| `apr01_appr`·`apr04_appr_step` | 일일자금현황 결재문서 | +1(완료) |
| `sys99_print` | 출력·상신 본문용 임시 자료 | 행 늘어남(출력마다) |
| `ast09_book` | 예금잔고(정리) | 정리 거절로 변화 없음 |

## 업무 규칙 · 주의

- 이 화면은 읽기 위주이고 쓰기는 잔고 정리·상신 연결뿐이다. 잔고 정리는 환평가 뒤 날짜가 있으면 거절한다(AST-BZ-0009·0013).
- kalpa 우리은행 잔고가 음수(−15.8M)인 것은 시험 기초잔고가 없어서다(AST-BZ-0004 기록).
- 결재 본문은 [출력] 때 만든 자료(그룹 ID)로 만들어진다. 그 자료는 서버가 아니라 **그리드 행을 보내서** 만든다 → [의심 #193](../../보안_및_버그_의심.md).
- 같은 일자·링크코드로 연결을 다시 만들면 이전 연결(결재 완료 포함)이 지워진다 → [의심 #192](../../보안_및_버그_의심.md).
- `yunhee trace-crud -s 1164`: `ast80_relate_appr` ASIS CRUD ↔ TOBE CRUD, `sys99_print`(RD 자료) 같음.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CRD-BZ-0006
needs: [AST-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [GET /api/v1/ast/books/deposits?holdDate=2026-11-13, POST /api/v1/act/deposit-ios/rd-print]
    expect: { rows: 2 }
  - no: 2
    api: [POST /api/v1/ast/relate-apprs, GET /api/v1/apr/apprs/link-seed?linkCode=A17&refId=<groupId>&classTreeId=<분류>&stdDate=2026-11-13, PUT /api/v1/apr/apprs/{apprId} (mode request, A17, effectDate·regDate 날짜시간), PUT /api/v1/ast/relate-apprs/{id}/appr-id]
    expect: { statusCode: "10" }
  - no: 3
    actor: { user: "100" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: 승인 }
    expect: { statusCode: "30", relateAppr.statusName: 완료 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Act02_Tab_DepositIoList`(#1164·#1470, `Apr01_Edit_ApprDoc` A17), 서버 `Ast09_Book`·`Act03_JournalDtl.selectByAstId`·`Ast80_RelateAppr`·`Sys99_Print`.
- TOBE: `Act02_Tab_DepositIoList.tsx`, `AstBookController`·`ActJournalDtlController`·`ActDepositIoController`·`AstRelateApprController`, `DepositIoLinkSeedProvider`.
</details>
