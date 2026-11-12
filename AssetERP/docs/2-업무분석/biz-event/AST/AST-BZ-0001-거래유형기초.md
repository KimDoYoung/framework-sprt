# AST-BZ-0001 KFS가 고객사에 거래유형과 화면별 거래유형을 갖춰 준다

> **한 줄 요약** — 자산 거래·미수/미지급 결제·전표는 모두 **거래유형**(`ast05_tr_code`: 9003 미지급금 결제, 9005 계좌이체 …)을 쓴다. 거래유형은 회사마다 있다. KFS 관리자가 #1165 거래유형 등록(관리자)에서 고객사를 골라 **[기초데이터생성]**하면 관리자 회사(0)의 거래유형이 복사된다. 같은 화면의 **[화면별 거래유형 등록]**에서 화면마다 고를 수 있는 거래유형(`ast15_tr_code_window`)을 정한다. 이게 없으면 계좌이체·고유자산 거래 화면의 거래유형 칸이 비고, 미지급 목록(#1390)의 거래 줄도 나오지 않는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(`admin/admin/1111`) → 회사 관리자(#1090에서 고침) |
| 언제 | 회사 개설 때, 원본 거래유형이 바뀔 때 |
| 먼저 있어야 하는 것 | SYS-BZ(고객사 등록) |
| 다음 이벤트 | AST-BZ-0002, ACT 분개맵핑(거래유형별, PAY-BZ-0012 0단계) |
| 실제 실행 | kalpa, 2026-11-12, API: 회사 0 거래유형 89개 → kalpa(`ast05_tr_code` +89). 화면별 거래유형 14화면 44줄을 회사 0과 같게 저장(`ast15` +44). kalpa 관리자·사원의 [기초데이터생성]은 403(ACT 분개맵핑 기초데이터생성도 403). `GET /ast/tr-codes/by-window?windowClassName=Ast06_Tab_TrDeposit` → 9005 계좌이체 |
| 메뉴 | #1165 기초자료 > 40. 관리회계 > 거래유형 등록(관리자) — KFS. #1090 관리자 > 05. 관리회계 > 거래유형 등록 — 고객사. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1165 | 거래코드 체크(전체) → 회사 칸에서 고객사 고름 → [기초데이터생성] | 고객사의 같은 코드를 지우고 관리자 회사 것을 넣음 |
| 2 | 〃 | #1165 | [화면별 거래유형 등록] → 회사 고름 → 화면 줄 클릭 → 거래유형 [등록]/[삭제] | 화면마다 쓸 거래유형 |
| 3 | 회사 관리자 | #1090 | 거래유형 이름·연결종목·연결문서분류 고침 → [저장] | 회사 것만 바뀜 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast05_tr_code` | 회사 거래유형(코드·이름·수령/지급·발생유형) | +89 |
| `ast15_tr_code_window` | 화면(클래스 이름) × 거래유형 | +44 |

## 업무 규칙 · 주의

- [기초데이터생성]은 서버가 KFS 관리자만 허용한다(원본은 막지 않았다 — 서비스 주석).
- 화면별 거래유형 API는 회사관리자가 아니면 `companyId`를 무시하고 로그인 회사에 쓴다 — 사원이 다른 회사(28000)를 지정해도 kalpa에 들어갔다.
- ⚠ 사원이 자기 회사의 화면별 거래유형을 넣고 지운다 → [의심 #105](../../보안_및_버그_의심.md).
- 화면별 거래유형은 따로 [기초데이터생성]이 없어 화면마다 손으로 넣는다(이번엔 API로 회사 0 목록을 그대로 넣음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0001
needs: [SYS-BZ-0001]
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/ast/tr-codes/init-data
    body: { companyIds: [<kalpa>], trCodes: [<회사 0의 ast05_tr_cd 89개>] }
    expect: { track: { ast05_tr_code: +89 } }
  - no: 2
    api: PUT /api/v1/ast/tr-code-windows   # 화면마다 한 번, 14번
    body: { companyId: <kalpa>, className: Ast06_Tab_TrDeposit, items: [{ trCode: "9005", note: null }] }
    expect: { track: { ast15_tr_code_window: +44 (14번 합) } }
  - no: 3
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/ast/tr-codes/init-data
    expect: { status: 403 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast05_Tab_TrCodeAdmin`(#1165 E0~E10, initData → `Ast05_TrCode.insertInitData` L49-64), `Ast05_Tab_TrCodeIntrinsic`(#1090), `Ast15_Lookup_TrCodeWindow`·`Ast15_Page_TrCodeWindow`(`Ast15_TrCodeWindow.insert` L66), SQL `ast05_tr_code.selectByWindowClassName`(회사 `ast15` × `ast05`).
- TOBE: `AstTrCodeController`(`/api/v1/ast/tr-codes` · `/init-data` · `/by-window` · `/intrinsic`), `AstTrCodeService.insertInitData` L136-149(`isSysAdmin`), `AstTrCodeWindowController`(`/api/v1/ast/tr-code-windows`), `AstTrCodeWindowService`(`companyOf`).
</details>
