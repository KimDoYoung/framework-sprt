# FND-BZ-0007 일임계좌와 타사무 보유주식을 등록한다

> **한 줄 요약** — 일임(자문) 계좌를 #1388에서 등록하고(관리코드·관리명·거래기관·계좌번호·시작/종료일), #1389에서 **어느 조직이 그 계좌를 볼 수 있는지** 정한다(펀드 권한 FND-BZ-0005와 같은 방식, `adv` 쪽 `adv…org_auth`). 타사 사무수탁 펀드·일임 계좌의 **보유 주식**은 기준일별로 #1426(펀드)·#1427(일임)에서 따로 등록한다(`book-extr`). 이 이벤트로 펀드관리 메뉴의 일임·타사무 화면이 채워진다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 일임 담당(kalpa는 관리자가 대행) |
| 언제 | 일임 계약 때, 보유 종목이 바뀔 때 |
| 먼저 있어야 하는 것 | FND-BZ-0001(거래기관), 0004(펀드 — #1426용) |
| 다음 이벤트 | 0011(운용현황) |
| 실제 실행 | kalpa, 2026-11-13, API. 일임계좌 `KA001`(거래기관 신한은행 01640)을 만들고 운용본부에 권한을 줌 → 운용본부 사원 402의 목록에 KA001이 나오고 경영지원본부 사원 401은 안 나옴. `KA002`·`KA003`(종료일 있음)도 등록. 일임 보유주식 `KA001·삼성전자`, 펀드 보유주식(타사무) `KF001·SK하이닉스` 기준일 2026-11-13. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1388 일임계좌 등록, #1389 일임계좌 권한설정, #1427 일임보유주식등록(타사무), #1426 펀드보유주식등록(타사무). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 일임 담당 | #1388 | [등록] → 관리코드·관리명·거래기관·계좌번호·시작일 → [저장] (`PUT /adv/accounts`) | 계좌 줄 |
| 2 | 일임 담당 | #1389 | 계좌 체크 → 조직 체크 → [권한부여] (`PUT /adv/org-auths`) | 조직별 열람 권한 |
| 3 | 담당자 | #1427 / #1426 | 기준일 → [추가] 종목 → [저장] (`PUT /adv/book-extrs`, `PUT /fnd/book-extrs`) 또는 엑셀 업로드 | 보유 종목 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `adv02_account` | 일임계좌 | +3 (`KA001`~`KA003`) |
| `adv` 조직 권한 | 계좌 × 조직 | +1 (운용본부 `true`) |
| `adv11_book_extr` | 일임 보유주식(타사무) | +1 |
| `fnd11_book_extr` | 펀드 보유주식(타사무) | +1 |

## 업무 규칙 · 주의

- **서버가 계좌 저장 값을 검사하지 않는다**: 빈 본문으로도 모든 칸이 빈 계좌 행이 생기고, 같은 관리코드(`KA001`)를 두 번 저장해도 막지 않는다 → [의심 #167](../../보안_및_버그_의심.md).
- **일임계좌 삭제 API가 없다**(`trace-crud --screen 1388`: AS-IS `adv02_account` CRUD / TOBE CRU, "TOBE에 D 없음"). 시험으로 만든 빈 행·중복 행은 `KA002`·`KA003`로 이름을 바꿔 재사용했다 → [의심 #168](../../보안_및_버그_의심.md).
- 보유주식은 계좌·펀드 코드가 실제 있는지 보지 않는다(`NOACCT`로도 저장, 시험 행은 지움) → [의심 #169](../../보안_및_버그_의심.md).
- 메뉴 권한이 없는 사원 401이 계좌 저장·보유주식 저장을 할 수 있다(`yunhee biz-authz adv --probe-write`로 확인, #133·#162·#164 같은 유형) → #167에 함께 적음.
- ⚠ `biz-authz --probe-write`는 "안전한 프로빙"이라지만 일임계좌처럼 검증이 없는 저장 API에는 **빈 행을 실제로 만든다**.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0007
needs: [FND-BZ-0001, FND-BZ-0004, FND-BZ-0005]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/adv/accounts
    body: { manageCode: "KA001", manageName: "칼파 일임계좌 1", trCorpCode: "01640", trCorpName: "신한은행", accountNoDec: "110-123-456789", startDate: "2026-11-13" }
    expect: { track: { adv02_account: +1 } }
  - no: 2
    api: PUT /api/v1/adv/org-auths
    body: { accountIds: ["{KA001}"], orgCodeIds: ["{운용본부}"], confirm: "true" }
  - no: 3
    actor: { user: "402" }
    api: GET /api/v1/adv/org-auths/accounts
    expect: { rows: 1 }
  - no: 4
    api: [PUT /api/v1/adv/book-extrs, PUT /api/v1/fnd/book-extrs]
    expect: { track: { adv11_book_extr: +1, fnd11_book_extr: +1 } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Adv02_Tab_Account`(#1388)·`Adv05_Tab_OrgAuth`(#1389)·`Adv11_Tab_BookExtr`(#1427)·`Fnd11_Tab_BookExtr`(#1426).
- TOBE: `AdvAccountController`·`AdvOrgAuthController`·`AdvBookExtrController`, `FndBookExtrController`.
</details>
