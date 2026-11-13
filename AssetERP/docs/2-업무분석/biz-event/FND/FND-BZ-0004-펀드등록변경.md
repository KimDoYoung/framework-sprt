# FND-BZ-0004 펀드를 등록·변경한다

> **한 줄 요약** — 펀드(`fnd01_fund_code` + 상세 `fnd02_fund_info`)를 #1048에서 등록한다. 코드·이름·유형·설정액·수탁사·사무수탁사·수탁은행·보수율을 넣고, 기획 단계의 임시펀드(FND-BZ-0002)는 **"실제 펀드"로 연결**한다(임시펀드 저장 때 `realFundId`). 펀드는 일반(`planYn=false`) 펀드로 저장되고 회사는 로그인 회사로 고정된다. `closeYn`은 "해지 여부"라서 **정상 운용 중이면 `false`**다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 펀드 담당(kalpa는 관리자가 대행) |
| 언제 | 펀드 설정 때, 조건이 바뀔 때 |
| 먼저 있어야 하는 것 | FND-BZ-0001(수탁사·사무수탁사·수탁은행), 0002(임시펀드), 공통코드(IcamFundType 등) |
| 다음 이벤트 | 0005(권한), 0006(규약), 0007~0011 |
| 실제 실행 | kalpa, 2026-11-13, API. 펀드 `KF001 칼파 주식형 1호`(주식형, 설정액 100억, 시작 2026-12-01, 수탁 `T001`·사무수탁 `00950`·수탁은행 `01640`, 보수율 운용 0.5·판매 0.3·수탁 0.03·사무 0.02) 등록 → 임시펀드 `KP001`을 실제 펀드 `KF001`에 연결. 동일 코드 재저장 → "동일 펀드코드가 존재합니다." 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1048 펀드 등록 및 변경. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 펀드 담당 | #1048 | [등록] → 펀드코드·펀드명·유형·설정액·수탁사/사무수탁사/수탁은행(조회창)·보수율·시작일 → [저장] (`PUT /fnd/fund-codes`) | 펀드 줄 |
| 2 | 상품기획 담당 | #1046 | 임시펀드의 실제 펀드 선택 → [저장] (`PUT /fnd/fund-codes/plans`, `realFundId`) | 임시펀드에 실제 펀드 표시 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `fnd01_fund_code` | 펀드 코드 | +1 (`KF001`) |
| `fnd02_fund_info` | 펀드 상세(수탁·보수율 등) | +1 |
| `fnd02_fund_info`(임시펀드) | `real_fund_id` 연결 | `KP001` → `KF001` |

## 업무 규칙 · 주의

- 필수: 펀드코드 · 펀드명 · 동일 펀드코드 없음(검사 순서·문구는 원본 그대로). `workDate`를 빼면 오늘로 채운다(임시펀드 저장은 못 채워 500 — #159).
- ICAM관리 펀드는 비고만 저장된다.
- **수탁사·사무수탁사·수탁은행 코드가 코드표에 있는지 검사하지 않는다** → 없는 코드(`NOPE`)로도 저장된다(원본은 조회창으로만 고르게 함) → [의심 #161](../../보안_및_버그_의심.md).
- 메뉴 권한이 없는 사원 401이 펀드를 수정할 수 있다 → [의심 #162](../../보안_및_버그_의심.md).
- **펀드 삭제 API가 없다**: 임시펀드용 `DELETE /fnd/fund-codes/plans`는 일반 펀드를 못 지운다(200이지만 행이 남는다). TOBE 화면에도 삭제 버튼이 없다(원본 `Fnd01_Tab_FundCode:383`에는 삭제 호출이 있다) → [의심 #163](../../보안_및_버그_의심.md). 시험으로 만든 `KF999`(없는 수탁 코드로 저장) 1건이 kalpa에 남아 있다 — 지우려면 `fnd02_fund_info`(id 202611139994926)·`fnd01_fund_code`(202611139994925)를 SQL로 지운다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0004
needs: [FND-BZ-0001, FND-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/fnd/fund-codes
    body: { fundCode: "KF001", fundName: "칼파 주식형 1호", kofiaFundTypeCode: "21", seoljAek: 10000000000, startDate: "2026-12-01", closeYn: "false", consignmentCode: "T001", officeWorkCode: "00950", trustBankCode: "01640", managementRate: 0.5, workDate: "2026-11-13" }
    expect: { track: { fnd01_fund_code: +1, fnd02_fund_info: +1 } }
  - no: 2
    api: PUT /api/v1/fnd/fund-codes   # 같은 코드, fundCodeId 없이
    expect: { message: "동일 펀드코드가 존재합니다." }
  - no: 3
    api: PUT /api/v1/fnd/fund-codes/plans   # realFundId = KF001
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Fnd01_Tab_FundCode`(#1048)·`Fnd01_Edit_FundCode`(저장 `updateRow` L378 → `Fnd01_FundCode.update` L139·`noteUpdate` L125).
- TOBE: `FndFundCodeController` `/fnd/fund-codes`·`FndFundCodeService.saveFund` L204-248.
</details>
