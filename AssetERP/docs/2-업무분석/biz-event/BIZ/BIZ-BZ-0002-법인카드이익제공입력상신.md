# BIZ-BZ-0002 직원이 법인카드 사용내역에 이익제공 내용을 입력하고 상신한다

> **한 줄 요약** — 직원이 #1131 이익제공 입력(법인카드)에서 **자기 카드 사용내역**(CRD-BZ-0002에서 확정된 `biz01_promo` 행)을 기간으로 조회하고, 행마다 **제공 목적·내용·계정과목·비고**를 [일괄저장]으로 붙이고, 아래 그리드에 **함께한 내부 직원·거래상대방(회사·이름·부서)**을 넣은 뒤(`biz02_person`), 한 달 치를 골라 **이익제공 결재(링크코드 A41)**로 [상신]한다. 상신 때 엑셀 내역서와 RD 요약 PDF가 결재문서에 첨부된다. 간소화 화면 #1319는 인원 그리드 대신 행에 거래상대방·인원수를 직접 적는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 법인카드를 쓴 직원(카드 사용자 또는 실사용자) → 결재자 |
| 언제 | 카드로 거래상대방에게 식사·선물 등을 제공한 뒤, 월 단위 상신 |
| 먼저 있어야 하는 것 | BIZ-BZ-0001 한도기준(거래상대방 필수입력 여부)·직원 자동등록, CRD-BZ-0002 카드 사용내역 확정, **A41 문서분류 지정**(kalpa·회사 0 모두 비어 있었음 — DCR-BZ-0004) |
| 다음 이벤트 | BIZ-BZ-0004 사용내역 조회, 0005 한도초과 현황, 0006 상세현황 |
| 실제 실행 | kalpa, 2026-11-14, API. 401 `GET /biz/promos/cards`(2026-11) 2건(주유소 80,000·호텔 220,000, 카드 관리자 **마감**, CRD-BZ-0004 A13 결재 완료) → AS-IS 2 = 2(그리드 12열). 호텔 건 `202611139995027`: 자동등록(식사 1001 → 401 본인 +1) · 내부 402 +1 · 거래처 삼성증권 홍길동·이몽룡 +2 → AS-IS 내부 2 = 2 · 외부 2 = 2. kalpa 관리자가 A41 → `상품전략/마케팅/이익제공 및 수령보고서` 지정 → 401 A41 상신(`202611149150285`, 결재 301) → [상신] 연결(`POST /promos/cards/appr-link`, 엑셀 첨부·RD 출력 2행·내역 2건 `appr_id`) → 301 승인 **완료(30)**. **마감 내역 [일괄저장]·완료 뒤 간소화 저장·402가 남의 내역에 인원 추가가 모두 됨**(⚠#233) |
| 메뉴 | #1131 준법감시 > 40. 이익제공(수령)현황 > 이익제공 입력(법인카드) · #1319 (s)이익제공입력(카드). kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1131 | 기간(월 첫날~끝날)·검색어·[미상신만]·계정 콤보 → [조회] (`GET /biz/promos/cards`) | 내 카드 내역(마감·카드명·승인일·가맹점·업종·금액·목적·내용·계정·인원·결재상태) |
| 2 | 〃 | 〃 | 행 선택 (`GET /promos/{id}/appr-status`, `GET /people/internal`·`/external`) | 아래 내부 직원·거래처 인원. 결재 상태가 없음·반려(40)일 때만 고칠 수 있다(화면) |
| 3 | 〃 | 〃 | 행 체크 → [일괄저장] → 마감 확인(`POST /promos/close-check`) → 창에서 목적·내용·계정·과세·비고 (`PUT /promos/accounts`) | 고른 행에 일괄 반영. 마감된 행이면 "마감된 내역이 있습니다" |
| 4 | 〃 | 아래 인원 그리드 | [직원 추가](사원 조회창 → `POST /people/internal`) · [거래처 추가](MKT 거래처 조회창 → `POST /people/external`) · [삭제](`DELETE /people`). 직원 자동등록 내용코드면 `POST /people/auto-register` | 인원 수가 위 행에 반영 |
| 5 | 〃 | #1131 | 한 달 치 행 체크 → [상신] → 거래상대방 필수 확인(`POST /promos/cards/target-info-check`) → "N건을 상신하시겠습니까?" [예] → 결재문서 창(A41 분류, `GET /promos/doc-class?linkCode=A41`) → 결재선 → [상신] | 결재문서 + 엑셀 내역서·RD 요약 PDF 첨부, 내역에 결재 ID (`POST /promos/cards/appr-link`) |
| 6 | 결재자 | 결재함 | [승인] (`POST /apr/apprs/{id}/confirm`) | 내역 결재상태 완료 |
| 7 | 직원 | #1319 | 행에서 목적·내용·계정·**거래상대방·인원수**·비고 직접 입력 → 저장 (`PUT /promos/{id}/simple`) | 인원 그리드 없이 행에 저장 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `biz01_promo` | 목적(`provide_pur_cd`)·내용·계정과목·과세·비고·거래상대방·인원수·결재 ID(`biz01_appr_id`) | 2건 결재 ID `202611149150285`, 호텔 건 거래상대방 삼성증권·4명 |
| `biz02_person` | 내역별 인원(직원 `emp_yn=true`·사원 ID / 거래처 회사·이름·부서) | +4(401·402·홍길동·이몽룡). 402 위조 행 1은 지움 |
| `dcr30_link` | A41 문서분류 | kalpa A41 → `202611109046895`(이익제공 및 수령보고서) |
| `apr01_appr`·`apr04_appr_step` | A41 결재문서 | `202611149150285` 완료(30) |
| `sys10_file` | 첨부 엑셀 `이익제공 입력(법인카드) 2026.11.xls` (+ RD PDF) | +1. RD PDF는 시뮬레이터가 다른 폴더(`tools/rd-simulator/data/rd/`)에 저장해 TOBE가 "RD 서버 저장 파일이 생기지 않음" 경고 — 시험 환경 경로 문제 |
| `sys99_print`(`insertPrintCard`) | RD 출력용 임시 행(`Biz01_Tab_Card_Simple`) | +2 |

## 업무 규칙 · 주의

- 상신 전 화면 검사(원본 `checkApproval`): 이미 상신 중·완료(10·20·30)인 행이 섞이면 거절, **한 달 단위**만, 계정과목이 여러 개면 제목에 함께 적는다. 거래상대방 필수(0001 `targetInfoReqYn`)면 거래처 인원 없는 행을 센다. 이 검사는 모두 화면에만 있다 — `appr-link`는 결재 ID가 내 문서인지·이미 다른 결재가 붙었는지 보지 않는다(#4와 같은 모양).
- [일괄저장]·인원·간소화 저장은 마감·결재 완료 내역도 서버가 받는다 → [의심 #233](../../보안_및_버그_의심.md). 원본도 화면 검사뿐이고 그마저 첫 행만 본다.
- 조회 대상은 카드 사용자 또는 실사용자(#1406 배분)가 나인 행이다(`selectByCard` personId).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0002
company: kalpa
as: 401
steps:
  - no: 1
    api: GET /api/v1/biz/promos/cards?startDate=2026-11-01&closeDate=2026-11-30
  - no: 2
    api: POST /api/v1/biz/people/auto-register
    body: ["{promoId}"]
  - no: 3
    api: POST /api/v1/biz/people/external
    body: {promoId: "{promoId}", targets: [{targetCompanyName: 삼성증권, targetEmpName: 홍길동, targetOrgName: 법인영업부}]}
  - no: 4
    api: POST /api/v1/biz/promos/cards/target-info-check
    body: ["{promoId}"]
  - no: 5
    api: PUT /api/v1/apr/apprs/{apprId}      # A41, classTreeId = GET /biz/promos/doc-class?linkCode=A41
  - no: 6
    api: POST /api/v1/biz/promos/cards/appr-link
    body: {apprId: "{apprId}", promoIds: ["{promoId}"], titleName: "이익제공 입력(법인카드) 2026.11"}
  - no: 7
    as: 301
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: {action: confirm, message: 확인}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz01_Tab_Card`(#1131 E0~E10, `closeCheck` L918-972, `checkLimit` L554, `checkApproval` L587-653, `insertLinkApprovals` L740 — 링크코드 A41 L535·L746), `Biz01_Tab_CardSimple`(#1319), `Biz02_Grid_InternalList`·`ExternalList`, SQL `biz01_promo.selectByCard`, `biz02_person.selectByInternal`·`selectByExternal`.
- TOBE: `BizPromoController`(`/promos/cards`·`/accounts`·`/{id}/simple`·`/close-check`·`/cards/target-info-check`·`/cards/appr-link`), `BizCardApprService.linkAppr` L31-40, `BizPersonController`·`BizPersonService`(`countPromo` 회사만).
- 확인: `compare GET /biz/promos/cards --sql biz01_promo.selectByCard --grid Biz01_Tab_Card` 2=2, 인원 2=2·2=2. `biz-appr`는 연결 API가 POST라 못 써서(PUT만 부름) 결재는 `yunhee api`로 직접 했다.
</details>
