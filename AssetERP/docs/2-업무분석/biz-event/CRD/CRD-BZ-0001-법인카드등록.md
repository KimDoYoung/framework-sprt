# CRD-BZ-0001 법인카드를 등록하고 사용자를 지정한다

> **한 줄 요약** — 경영관리(자금관리)가 회사 법인카드를 한 장씩 등록한다(카드회사·카드명·카드번호·**사용내역 업로드 식별구분**·기간·신용/체크·출금계좌). 카드마다 **사용자**(사원·기간·공통카드 여부)를 붙인다. 이 카드가 있어야 매달 카드사 사용내역을 올리고(CRD-BZ-0002) 사원에게 배분한다(0003).

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(자금관리 담당) |
| 언제 | 카드 발급·해지 때, 사용자가 바뀔 때 |
| 먼저 있어야 하는 것 | 직원 등록(EMP-BZ-0001), 카드회사 코드(`CreditCardCompany`: 국민 1000·신한 2000·IBK 3000 …, 회사 0 공통), 출금 예금계좌(AST-BZ-0002, 선택) |
| 다음 이벤트 | CRD-BZ-0002 카드 사용내역 업로드 |
| 실제 실행 | kalpa, 2026-11-13, API(관리자 `admin`). 신한카드 `칼파 법인카드(신한)` 등록(우리은행 칼파 운영 계좌 연결) → 사용자 김사원(401, 기간 지정)·최사원(402, 공통카드) 지정 → 목록·사용자 콤보 확인. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1038 자금관리 > 30. 법인카드관리 > 법인카드 및 사용자등록 (#1478 경영관리 쪽 같은 화면). kalpa 메뉴 없음 → API |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1038 | [등록] → 카드회사·카드명·카드번호·식별구분·시작/종료일·카드구분·사용 체크·출금계좌 → [저장] (`PUT /crd/cards`) | `crd01_card` +1 |
| 2 | 경영관리 | #1038 하단 사용자 그리드 | 카드 선택 → 사용자(사원 선택)·시작/종료일·공통카드 → [저장] (`PUT /crd/cards/{id}/users`) | `crd03_trans` +2 |
| 3 | 경영관리 | #1038 | 검색(카드번호/명)·'사용' 체크·카드사용자 콤보로 조회 (`GET /crd/cards`, `…/managers`) | 목록 |
| 4 | 경영관리 | #1038 | 카드 선택 → [삭제] (`DELETE /crd/cards/{id}`) | 사용자 행도 같이 지움 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `crd01_card` | 카드(회사·카드회사·번호·식별구분·기간·사용여부·구분·출금계좌) | +1(시험 카드 2장은 지움) |
| `crd03_trans` | 카드 사용자(사원·기간·사용·공통카드) | +2 |

## 업무 규칙 · 주의

- **`closeYn`은 이름과 달리 "사용 여부"다**(`true` = 사용 중). 화면 '사용' 체크를 켠 조회는 `true`인 카드만 보인다. `false`로 등록하면 기본 조회(사용만)에서 사라진다.
- 목록의 `searchText`는 카드명+식별구분에 `LIKE`로 건다. 빈 값(`%%`)이어야 전체가 나온다(화면은 빈 칸을 이렇게 보냄).
- 카드번호(`cardNoSlip`)가 20자를 넘으면 거절("카드번호를 다시 확인 바랍니다."), **사용내역이 이미 올라온 카드는 식별구분을 못 바꾸고 삭제도 못 한다**(서버·화면 모두).
- 카드사용자 콤보(`managers`)는 현재 날짜가 사용자 기간에 든 사원만 보인다.
- **메뉴 권한 없는 사원(402)이 카드를 수정할 수 있다** → [의심 #181](../../보안_및_버그_의심.md). **같은 식별구분 카드 2장·형식 검사 없음** → [의심 #182](../../보안_및_버그_의심.md). 둘 다 AS-IS도 서버 검사가 없어 옮긴 그대로다.
- `yunhee trace-crud -d crd`: `crd01_card` ASIS CRUD ↔ TOBE 같음(동적 저장은 TOBE가 등록·수정 한 메서드).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CRD-BZ-0001
needs: [EMP-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/crd/cards
    body: { bankCode: "2000", cardName: "칼파 법인카드(신한)", cardNoSlip: "1234-5678-9012-3456", cardNo: "1234567890123456", frDate: "2026-11-01", toDate: "2028-10-31", closeYn: "true", cardType: "1" }
    expect: { track: { crd01_card: +1 } }
  - no: 2
    api: PUT /api/v1/crd/cards/{cardId}/users
    body: [{ personId: "{401}", frDt: "2026-11-01", useYn: "true", publicYn: "false" }, { personId: "{402}", frDt: "2026-11-01", useYn: "true", publicYn: "true" }]
    expect: { track: { crd03_trans: +2 } }
  - no: 3
    api: GET /api/v1/crd/cards?searchText=%
    expect: { rows: 1 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Crd01_Tab_Card`(#1038)·`Crd01_Edit_Card`·`Crd03_Grid_User`, 서버 `Crd01_Card`·`Crd03_Trans`(`UpdateDataModel`).
- TOBE: `CrdCardController`·`CrdCardService`·`CrdCardMapper.xml`.
</details>
