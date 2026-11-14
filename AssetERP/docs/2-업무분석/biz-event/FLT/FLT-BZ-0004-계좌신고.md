# FLT-BZ-0004 직원이 증권계좌 개설·폐쇄를 신고한다

> **한 줄 요약** — 직원은 본인·가족 명의의 증권계좌를 #1125 계좌신고에 등록하고(개설일·신고사유·관계·명의·계좌번호·개설기관·점포·종목유형, 주 계좌 하나), 고른 계좌를 **계좌개설신고(B05)** 결재로 상신한다. 계좌를 닫으면 [계좌폐쇄] 탭에서 폐쇄일을 넣고 **계좌폐쇄신고(B06)**로 상신한다. 계좌번호는 암호화해 저장한다(`flt03_account`, `flt06_account_close`). 준법감시인은 #1488 계좌신고현황에서 기준일의 전 직원 계좌를 본다. 서약서(0003)가 끝나 있어야 하고, 보고주기가 없으면 상신이 막힌다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(kalpa 사원 401) → 결재자(301) · 준법감시인(#1488) |
| 언제 | 입사 때(신규입사), 계좌를 만들거나 닫을 때 |
| 먼저 있어야 하는 것 | FLT-BZ-0003(서약서 완료·보고주기), **B05·B06 문서분류 지정**(kalpa·회사 0 모두 비어 있었음 — 화면에서 직접 고를 수도 있음), 증권사 거래처(`sys15_corp`), 공통코드 `AccountRegReason`(1 신규입사·2 계좌개설)·`FamilyRelateCode`(1 본인·2 배우자·3 자녀1 …) |
| 다음 이벤트 | FLT-BZ-0005 초기보유(계좌별 [최초원장 등록]), 0009 계좌대체 |
| 실제 실행 | kalpa, 2026-11-14, API. ① 회사 관리자가 B05·B06 → `컴플라이언스/임직원 금융투자상품 매매/임직원 금융투자상품 계좌 신고` 지정. ② 401 `PUT /flt/accounts` 2계좌(본인 키움증권 여의도 `5555-01-123456` 주계좌 · 배우자 삼성증권 강남 `7777-02-654321`, 종목유형 `100000` 지분증권) → +2, AS-IS 2 = 2(그리드 12열). ③ `biz-appr B05 … --link-path /api/v1/flt/accounts/appr-id --confirm` → 결재 `202611149150153` 완료, 두 계좌 상태 "완료". ④ **완료된 배우자 계좌의 계좌번호를 바꿔 저장해도 됨(⚠#220)** → 되돌림. ⑤ 배우자 계좌 폐쇄 `POST /flt/accounts/closes {closeDate:2026-11-14}` → `flt06` +1 → `biz-appr B06 … /closes/appr-id --confirm` → 결재 `202611149150163` 완료. ⑥ #1488 `GET /flt/accounts/status-by-date?setupDate=2026-11-14` 2행, AS-IS 2 = 2(그리드 11열). **사원 401도 같은 조회가 됨(⚠#221)** |
| 메뉴 | #1125 준법감시 > 10. 임직원매매 > 계좌신고, #1488 11. 임직원매매(준감인) > 계좌신고현황. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1125 | 화면 열기(`GET /flt/accounts/status` — 보고주기·서약서 상태, `GET /flt/accounts/doc-class?linkCode=B05`) | 서약서가 안 끝났으면 [보고주기 변경 및 서약서 서명]으로 0003 |
| 2 | 〃 | 〃 | [등록] → 개설일·신고사유·관계·명의·계좌번호·개설기관(거래처 창)·점포·종목유형(창) → [저장] (`PUT /flt/accounts`) | 필수 검사 8가지, 주 계좌는 하나만 |
| 3 | 〃 | 〃 | [주 계좌 설정] 창 | 주 계좌 바꾸기 |
| 4 | 〃 | 〃 | 계좌 체크 → 문서분류 → [상신] → 결재문서 창 → 연결(`PUT /flt/accounts/appr-id {apprId, ids, stdDate, checkCycle}`) | "신고할 계좌정보를 선택해주세요"·"해당 계좌정보를 저장 후 상신을 진행해주세요"·"결재 중인 문서이거나, 완료된 문서가 포함되어있습니다"·"보고주기를 먼저 입력해주세요" |
| 5 | 결재자 | 결재문서 창 | [승인] | 계좌 상태 "완료" |
| 6 | 직원 | #1125 [계좌폐쇄] 탭 | 계좌 체크 → [계좌폐쇄] → 폐쇄일 (`POST /flt/accounts/closes`) → [상신] (B06, `PUT /flt/accounts/closes/appr-id`) | 폐쇄 신고 |
| 7 | 준감인 | #1488 | 기준일 → [조회] (`GET /flt/accounts/status-by-date`) | 부서·사원·증권사·계좌번호·명의·관계·종목유형·개설일·신고/폐쇄 결재 상태 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `flt03_account` | 401 계좌 2개(계좌번호 암호화) | +2 (남겨 둠) |
| `flt06_account_close` | 배우자 계좌 폐쇄 2026-11-14 | +1 |
| `apr01_appr` | B05 계좌개설신고·B06 계좌폐쇄신고(완료) | +2 |
| `dcr30_link` | kalpa B05·B06 문서분류 | 2건 갱신 |

## 업무 규칙 · 주의

- 저장 필수 검사와 "상신 중인 정보" 막기는 **화면에만** 있다. 서버는 결재가 끝난 계좌도 그대로 고친다 → [의심 #220](../../보안_및_버그_의심.md).
- #1488은 준법감시인 화면인데 사원도 같은 API로 전 직원 계좌번호(평문)를 본다 → [의심 #221](../../보안_및_버그_의심.md).
- 계좌신고 화면은 대상자 정보에서 보고주기만 쓴다 — [의심 #219](../../보안_및_버그_의심.md)(예외사원 보고 시작일)는 계좌신고와는 상관없다.
- 새 고객사는 B05·B06 문서분류도 비어 있다(0003의 A06·A08·A09와 같음). 화면은 문서분류 칸에서 직접 고를 수 있어 막히지는 않는다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FLT-BZ-0004
needs: [FLT-BZ-0003]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/flt/accounts
    body: [ { accountId: null, setupDate: "2026-11-10", regReason: "1", familyRelateCode: "1", mainAccountYn: true, accountName: "김사원", accountNoDec: "5555-01-123456", corpId: "{키움증권}", corpBranchName: "여의도지점", itemType: "100000" } ]
    expect: { track: { flt03_account: +1 } }
  - no: 2
    tool: yunhee biz-appr B05 --ref {accountId} -u 401 -c kalpa --approver 301 --link-path /api/v1/flt/accounts/appr-id --link-style body --link-body '{"apprId": {apprId}, "ids": [{accountId}], "stdDate": "2026-11-14", "checkCycle": "1"}' --confirm
    expect: { account: { apprStatusName: "완료" } }
  - no: 3
    api: POST /api/v1/flt/accounts/closes
    body: { closeDate: "2026-11-14", accountIds: ["{accountId}"] }
    expect: { track: { flt06_account_close: +1 } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Flt03_Tab_AccountReport`(#1125 E0~E17: check L19-46(B05 분류·`Flt02_Emp.selectByDate`의 checkCycle·서약서), update, insertLinkApproval 검사 4가지), `Flt06_TabPage_AccountClose`(B06), `Flt03_Lookup_MainAccount`, `Flt03_Tab_AccountAdmin`(#1488 `flt03_account.selectByDate`), 서버 `Flt03_Account.update` L96-108(암호화 뒤 `UpdateDataModel`).
- TOBE: `FltAccountController`(`/api/v1/flt/accounts`·`/status`·`/doc-class`·`/appr-id`·`/closes`·`/closes/appr-id`·`/status-by-date`), 프론트 `Flt03_Tab_AccountReport.tsx` L81-97·L102·L356, `Flt06_TabPage_AccountClose.tsx` L60·L177.
</details>
