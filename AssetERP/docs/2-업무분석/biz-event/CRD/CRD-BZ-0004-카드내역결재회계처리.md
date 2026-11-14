# CRD-BZ-0004 법인카드 내역을 결재받고 회계처리한다

> **한 줄 요약** — 마감한 달의 카드 내역(CRD-BZ-0003)을 **법인카드 사용내역서(A13)**로 묶어 결재 상신하고(#1141 [상신]), 결재가 끝나면 **급여/카드 회계처리**(#1180)에서 카드 사용 전표(차 계정과목 / 대 **미지급비용**)를 만든다. 카드 대금을 낼 때 미지급을 반제하는 것은 AST-BZ-0003이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(상신·회계처리) → 결재자(대표) |
| 언제 | 매월 카드 내역 마감 뒤 |
| 먼저 있어야 하는 것 | CRD-BZ-0003(마감한 내역 + 계정과목), 문서분류 지정(A13), 회계 기초(PAY-BZ-0012에서 kalpa에 복사한 계정·거래유형 9001) |
| 다음 이벤트 | AST-BZ-0003 미지급 결제(카드대금) |
| 실제 실행 | kalpa, 2026-11-13, API. 마감(P) → 301이 A13을 문서분류 `사업비 지출결의서`에 지정 → 2026.11 A13 상신(제목 `법인카드 사용내역서 (2026.11)`, 상신 301 → 결재 100) → 상신 뒤 연결(`relate-apprs/card-management`, 첨부 엑셀 생성 true) → 100 승인 **완료(30)** → #1180 목록 1행(`2026.11 법인카드 사용` 9001, 2건 300,000, 미생성) → [생성] → 전표 2건(접대비 80,000·220,000 / 미지급비용) → 중복 생성 변화 없음 → 전표가 있는 달의 마감취소 거절 → 사원 402가 전표 삭제(⚠#188) → 관리자가 다시 생성. 엑셀·RD·화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1141 법인카드 내역관리 [상신]·[결재보기], #1180 자금관리 > 20. 사업비관리 > 급여/카드 회계처리. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1141 | 기준년월 → [마감](CRD-BZ-0003) | 내역 `biz01_close_yn` true |
| 2 | 경영관리 | #1141 | 문서분류(A13) 선택 → [상신] → "[기준년월] 상신을 진행하시겠습니까?" 예 → 결재문서 창(본문=카드별 사용내역 표) → 결재요청 (`GET /apr/apprs/link-seed?linkCode=A13&dataYm=…&classTreeId=…` → `PUT /apr/apprs/{id}` mode request) | 상신(10), 상신상태 `상신` |
| 3 | 〃 | #1141 | (창 닫힌 뒤) 자동 연결 (`POST /biz/relate-apprs/card-management`) | `biz05_relate_appr` +1, 첨부 엑셀·증빙 사본 |
| 4 | 결재자 | 결재문서 창 | [승인] | `완료`(30) |
| 5 | 경영관리 | #1180 | 기준년월 [조회] → 행 선택 → [생성] (`POST /act/journal-bizs/create`) | 전표(사용일별 줄) 생성 → 행 "생성완료" |
| 6 | 경영관리 | #1180 | (잘못되면) [삭제] (`POST …/delete`) | 전표 삭제, "미생성"으로 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `apr01_appr`·`apr04_appr_step` | 법인카드 사용내역서 A13 | +1(완료 30) |
| `biz05_relate_appr` | 기준년월 ↔ 결재문서(A13) 연결 | +1(`promoId` 비어 있음 — 기준년월 연결) |
| `act02_journal`·`act03_journal_dtl` | 카드 전표(사용일별, 차 접대비/대 미지급비용) | +2 줄 쌍 (80,000·220,000) |
| `ast06_tr` | 거래(법인카드 사용 9001) | 같은 내역 ID(`promoId`)로 생성 |

## 업무 규칙 · 주의

- 계정과목이 없는 행이 있으면 마감이 안 되므로 상신 전에 #1141에서 계정과목을 모두 붙인다. 마감이 끝난 달은 카드 내역(#1039) 삭제·수정이 막힌다.
- **전표가 있는 달은 마감취소가 거절**된다("전표가 존재합니다. 전표삭제 후 취소하세요."). 취소하려면 #1180에서 먼저 삭제.
- 같은 달을 다시 [생성]해도 전표가 늘지 않는다(이미 생성된 내역은 건너뜀).
- #1180 행의 "내역확정"은 마감(`biz01_close_yn`) 상태 표시 문구다(AS-IS 그대로 확인 필요).
- 메뉴 권한 없는 사원(402)이 전표 삭제 → [의심 #188](../../보안_및_버그_의심.md). 결재 상신 API 계약 → [의심 #189](../../보안_및_버그_의심.md). 마감 뒤 수정 → [#187](../../보안_및_버그_의심.md).
- `yunhee trace-crud -s 1141`: `biz05_relate_appr` AS-IS CRUD ↔ TOBE CRD(⚠U 없음) — A13 연결은 insert로 충분(상신 뒤 갱신은 `updateApprId` 경로가 다른 곳). `-s 1180`: `act80_relate_appr` AS-IS CD ↔ TOBE C, `ast06_tr` CRD ↔ CR(⚠D 없음): 전표 삭제 때 `deleteRelateApprByTrId`가 쓰는 것으로 보여 실제 차이는 안 봤다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CRD-BZ-0004
needs: [CRD-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/biz/card-managements/close
    body: { dataYm: "2026.11", procType: "P" }
  - no: 2
    actor: { user: "301" }
    api: [GET /api/v1/apr/apprs/new-id, GET /api/v1/apr/apprs/link-seed?linkCode=A13&dataYm=2026.11&classTreeId=<분류>, PUT /api/v1/apr/apprs/{apprId} (mode request, linkCode A13, effectDate·regDate 날짜시간), POST /api/v1/biz/relate-apprs/card-management]
    expect: { statusCode: "10", excelCreated: true }
  - no: 3
    actor: { user: "100" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: 승인 }
    expect: { statusCode: "30" }
  - no: 4
    actor: { user: admin }
    api: POST /api/v1/act/journal-bizs/create
    body: { stdMonth: "2026.11", rows: [{ trCode: "9001", note: "2026.11 법인카드 사용", retireId: 0 }] }
    expect: { track: { act02_journal: +2 }, journalYn: 생성완료 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Biz01_Tab_CardManagement`(checkApproval L617·getPromoList L646·insertLinkApprovals L670/726·apprChk L879, 링크 A13), `Act02_Tab_CreateJournalBiz`(#1180), 서버 `Act02_Journal.createJournalBiz`·`deleteJournalBiz`.
- TOBE: `AprLinkSeedController`·`CardMgmtLinkSeedProvider`, `BizRelateApprController`(`/card-management`)·`BizCardManagementApprService`, `ActJournalBizController`·`ActJournalBizService`.
</details>
