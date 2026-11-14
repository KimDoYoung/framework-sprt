# ICAM-BZ-0004 사무관리사가 펀드별 사무보수 입금계좌를 등록한다

> **한 줄 요약** — 사무관리사(KFS 28000)가 #1204 펀드별 보수입금계좌 등록에서 ICAM 발생보수가 있는 펀드마다 **보수를 받을 고유자산 예금계좌**(`ast01_class_tree`)를 적용 시작일과 함께 정한다(`icam11_fee_deposit`). 0005의 보수인출거래 생성(`f_create_fundFeeRcvTr*`)이 이 계좌로 입금 거래를 만든다. 원본 [ICAM발생내역 가져오기]도 계좌가 없는 펀드에 빈 행을 만들어 둔다(`getICAMFundFee` → `icam11_fee_deposit.insert`).

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS(28000) 자금·회계 담당(시험은 기본 계정 104) |
| 언제 | 새 펀드 보수가 생길 때, 입금계좌가 바뀔 때(새 시작일로 한 줄 더) |
| 먼저 있어야 하는 것 | 0003(그 펀드의 `icam10_fee` — 목록이 발생보수 펀드와 INNER JOIN), AST-BZ-0001 고유자산 예금계좌 |
| 다음 이벤트 | 0005 보수원장·인출거래 |
| 실제 실행 | 2026-11-14, API(104). 목록 AS-IS 591 = 591, 펀드 `18001A` 계좌 이력 AS-IS 3 = 3. [등록] 2026-11-14 시작 줄 저장 `+1` → [삭제] `−1`. kalpa 401이 KFS 줄 수정 404·삭제 0건. **kalpa 401이 자기 회사 줄에 KFS 예금계좌 ID를 넣어도 저장되고 계좌명 `기업#013-1`이 돌아온다**(⚠#243) → 지움 |
| 메뉴 | #1204 관리회계 > 30. 사무보수관리 > 펀드별 보수입금계좌 등록 (10개 회사). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1204 | 운용사(`Sys15_Lookup_Corp`, 비우면 전체)·검색어 → [조회] (`GET /icam/fee-deposits?corpId=&searchText=`) | 왼쪽: 펀드(운용사·펀드·통화·수탁사·현재 입금계좌·시작일) |
| 2 | 〃 | 〃 | 펀드 행 클릭 (`GET /icam/fee-deposits/by-fund?icamCompanyCode=&fundCode=`) | 오른쪽: 그 펀드의 계좌 이력 |
| 3 | 〃 | 〃 | [등록] → 시작일·입금계좌(예금 조회창) → [저장] (`PUT /icam/fee-deposits {items:[{feeDepositId:0, icamCompanyCode, fundCode, startDate, depositId}]}`) | 이력에 한 줄 |
| 4 | 〃 | 〃 | 줄 체크 → [삭제] (`DELETE /icam/fee-deposits {ids}`) | 줄 없어짐 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam11_fee_deposit` | 회사·ICAM 운용사·펀드·시작일·입금계좌 | +1 → −1 (1,489행 그대로) |

## 업무 규칙 · 주의

- 회사는 로그인 회사로 고정(원본도 `LoginUser.getCompanyId()`). 수정·삭제도 회사 조건이 있다.
- **입금계좌(`depositId`)가 내 회사 계좌인지 서버가 보지 않는다**(원본 `UpdateDataModel`도 같음). 다른 회사 계좌 ID를 넣으면 그 계좌 이름이 보이고, 0005 인출거래가 남의 계좌를 가리킨다 → [의심 #243](../../보안_및_버그_의심.md).
- 같은 펀드·같은 시작일 줄을 두 번 넣어도 막지 않는다(원본도 같음 — 확인만).
- 저장 응답의 운용사명·펀드명은 비어 온다(`selectById`가 발생보수와 JOIN하지 않음). 화면은 다시 조회해 채운다.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0004
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/icam/fee-deposits?searchText=
    expect: rows 591
  - no: 2
    api: GET /api/v1/icam/fee-deposits/by-fund?icamCompanyCode=1806&fundCode=18001A
    expect: rows 3
  - no: 3
    api: PUT /api/v1/icam/fee-deposits
    body: {items: [{feeDepositId: 0, icamCompanyCode: "1806", fundCode: 18001A, startDate: 2026-11-14, depositId: 202205110122848}]}
    expect: icam11_fee_deposit +1
  - no: 4
    api: DELETE /api/v1/icam/fee-deposits
    body: {ids: ["{3의 id}"]}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam11_Tab_OfficeMngFeeDeposit`(#1204 E1~E7), `Icam11_Grid_MngFeeDeposit` L117·L155·L180, 서버 `Icam11_FeeDeposit` L21-36(`UpdateDataModel`), SQL `icam11_fee_deposit.selectByCompanyId`·`selectByFundCode2`.
- TOBE: `IcamFeeDepositController` L31-53, `IcamFeeDepositService` L28-58, `IcamFeeDepositMapper.xml` L33(`ast01_class_tree` JOIN, 회사 조건 없음).
- 확인: `compare GET /icam/fee-deposits --sql icam11_fee_deposit.selectByCompanyId` 591=591, `…/by-fund --sql …selectByFundCode2` 3=3, `api PUT … --track icam11_fee_deposit`.
</details>
