# PAY-BZ-0008 경영관리팀이 원천징수영수증을 올려 직원이 보고, 갑근세확인서를 결재받아 발급한다

> **한 줄 요약** — 연말정산이 끝나면 경영관리팀이 #1220 원천징수영수증 업로드에서 직원별 영수증 파일(PDF)을 올리고(파일 하나 = 영수증 행 하나) 행마다 **사원**을 지정한다. 직원은 #1219 원천징수영수증(사본)에서 **본인 것만** 보고 내려받는다. 직원이 갑근세(근로소득 원천징수) 확인서를 요청하면 경영관리팀이 #1364 갑근세확인서 발급에서 사원·기준연도·용도·제출처·통수를 등록하고 **[상신]**(링크 X01)해 결재받은 뒤 확인서(RD)를 출력한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(kalpa 과장 301) → 직원(401) / 결재자(대표 100) |
| 언제 | 해마다 연말정산 뒤(영수증), 직원 요청 때(확인서) |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), PAY-BZ-0004(그 해 급여 — 확인서 금액), #1364 [문서분류지정] X01 → `증명서` |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-12, API: 301이 `원천징수영수증_401_2025.pdf`(`data/samples/1.pdf` 복사본) 업로드 → 사원 401·비고 "2025년 귀속" 지정(`yunhee biz-patch`) → 401 #1219 1건, 402 0건. 301이 401 갑근세확인서(2026, 금융기관 제출용, OO은행, 2통) 등록 → `yunhee biz-appr X01`로 상신 `202611129140315` → 100 승인 **완료** → 수정 막힘. 목록 AS-IS와 일치(영수증 1 = 1, 확인서 1 = 1). 확인서 RD 출력은 확인 `대기` |
| 메뉴 | #1220 경영관리 > 04. 급여관리 > 원천징수영수증 업로드, #1219 같은 곳 > 원천징수영수증(사본), #1364 같은 곳 > 갑근세확인서 발급. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1220 | [파일업로드] → 영수증 파일들 선택(여러 개면 하나씩 올라감) | 파일마다 줄(사원 `-`, 등록일 오늘) |
| 2 | 〃 | 〃 | 줄의 사원명 칸 → 사원 고르기, 비고 → [저장] | 사원 지정. 사원명으로 [조회]하면 그 사원 것만. 줄 [삭제]는 파일과 함께 |
| 3 | 직원 | #1219 | 화면 열기 → 줄 클릭 / 내려받기 아이콘 | 본인 영수증만, PDF는 오른쪽 미리보기 |
| 4 | 경영관리 | #1364 | [등록] → 사원·발급신청일·기준연도·용도(`CertUseCode`)·제출처·소요수량 → [저장] | 발급번호 자동(연도별 순번) |
| 5 | 〃 | 〃 | 줄의 [상신] → 결재문서 창(X01, 제목 `갑근세원천징수확인서 발급 (김사원)#2026-001`) → 결재요청 | 상태 `상신`. 이후 수정·삭제는 "이미 결재가 진행 중이거나 완료된 문서는 수정이 불가능합니다" |
| 6 | 결재자 | 결재문서 창 | [승인] | 상태 `완료` → 출력 아이콘으로 확인서(RD) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay08_tax_withholding` | 영수증 행(사원·등록일·비고) | +1 (`202611129140304`) |
| `sys10_file` | 영수증 파일(부모 = 영수증 행, 종류 `pay08`) | +1 (`202611129140305`) |
| `pay40_income_tax_withholding` | 갑근세확인서 발급 행(기준연도·용도·제출처·통수·발급번호·결재 ID) | +1 (`202611129140311`) |
| `apr01_appr`·`apr04_appr_step` | 갑근세확인서(X01) | +1(완료) |
| `dcr30_link` | kalpa X01 → `증명서` | 1줄 갱신 |

## 업무 규칙 · 주의

- #1219는 서버가 로그인 사원으로 정한다(`/mine`) — 본인 영수증만 목록에 나온다.
- ⚠ 그러나 **파일 내려받기 API는 파일 ID만 보고 준다** — 다른 직원의 영수증, 급여대장 PDF, **다른 회사 결재 첨부**까지 받았다 → [의심 #88](../../보안_및_버그_의심.md)(상).
- ⚠ #1220 API에 권한 검사가 없어 사원이 남의 영수증을 자기에게 다시 지정할 수 있다 → [의심 #89](../../보안_및_버그_의심.md)(상).
- ⚠ 확인서 결재 ID 연결을 검사하지 않아 완료 건 잠금이 풀린다 → [의심 #90](../../보안_및_버그_의심.md)(중).
- 세액표·근로소득공제표 조회 API(`/pay/tax-calcs`·`/tax-deducts`, KFS 공통)는 사원도 읽는다(공개 기준표라 문제로 보지 않음, 쓰기는 KFS 관리자만).
- 이번 실행에 쓴 yunhee 0.8.8(fix060-biz) 명령: `biz-event-new`(이 문서 골격), `biz-endpoints pay --path tax-`, `biz-patch`(사원 지정), `biz-code CertUseCode`, `biz-appr X01 … --link-path … --link-style body --confirm`, `biz-authz pay --path tax-receipts --probe-write`.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0008
needs: [EMP-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: POST /api/v1/pay/tax-receipts
    form: { file: 원천징수영수증_401_2025.pdf }   # data/samples/1.pdf 복사본
    expect: { track: { pay08_tax_withholding: +1, sys10_file: +1 } }
  - no: 2
    api: PUT /api/v1/pay/tax-receipts
    body: [{ taxWithholdingId: <영수증>, personId: <401>, note: "2025년 귀속" }]
  - no: 3
    actor: { company: kalpa, user: "401", password: "1111" }
    api: GET /api/v1/pay/tax-receipts/mine
    expect: { rows: 1 }   # 402는 0
  - no: 4
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/pay/tax-withholdings
    body: [{ personId: <401>, regDate: "2026-11-12", stdYear: "2026", purUseCode: "1", submitTo: OO은행, cnt: 2 }]
    expect: { issueNo: 1 }
  - no: 5
    cli: yunhee biz-appr X01 --ref <발급 행> -u 301 -c kalpa --approver 100 --link-path "/api/v1/pay/tax-withholdings/{ref}/appr-id" --link-style body --confirm
    expect: { statusCode: "30" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay08_Tab_TaxWithholdingAdmin`(#1220 E0~E11, retrieve L302, update L355), 서블릿 `FileUpload.uploadPay08` L643-690, `Pay08_Tab_TaxWithholding`(#1219 retrieve L113), `Pay40_Tab_TaxWithholding`(#1364, delete L403, 상신 X01), 서버 `pay.Pay08_TaxWithholding`(selectByCompanyId L24·selectByPersonId L34·update L45·delete L50), `pay.Pay40_IncomeTaxWithholding`.
- TOBE: `PayTaxReceiptController`(`/api/v1/pay/tax-receipts` GET·POST·PUT·DELETE·`/mine`), `PayTaxReceiptService` L28-75, `PayTaxWithholdingController`(`/api/v1/pay/tax-withholdings` GET·PUT·DELETE·`/{id}/appr-id`), `PayTaxWithholdingService` L28-107, `SysFileController` L158.
</details>
