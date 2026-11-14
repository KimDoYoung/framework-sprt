# ICAM-BZ-0007 운용사가 펀드별 운용보수 입금계좌를 관리한다

> **한 줄 요약** — 운용사가 #1217 운용보수 입금계좌 관리에서 운용보수를 받는 펀드마다 고유자산 예금계좌를 시작일과 함께 정한다. **화면·API·테이블이 #1204(0004)와 같다**(`icam11_fee_deposit`, 공용 그리드 `Icam11_Grid_MngFeeDeposit`). 다른 점은 운용사 선택칸이 없다는 것(늘 전체 운용사, `corpId` 없음)뿐이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용사 자금 담당(시험은 KFS 28000의 104 — 운용보수 자료도 28000에 있음) |
| 언제 | 새 펀드 운용보수가 생길 때, 계좌가 바뀔 때 |
| 먼저 있어야 하는 것 | 0003(운용보수 `icam10_fee`), AST-BZ-0001 예금계좌 |
| 다음 이벤트 | 0008(보수인출거래 재생성이 이 계좌로 거래를 만든다) |
| 실제 실행 | 2026-11-14, API. 0004에서 같은 API로 확인: 목록 AS-IS 591 = 591(운용사 `%`), 펀드 이력 3 = 3, 등록·삭제, 타사 사원 수정 404·삭제 0. 남의 회사 계좌 ID도 저장된다(⚠#243). 화면은 `corpId: null`로만 부른다(`Icam11_Tab_FundMngFeeDeposit.tsx` L48) |
| 메뉴 | #1217 관리회계 > 30. 펀드운용보수관리 > 운용보수 입금계좌 관리 (10개 회사). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

0004의 1~4단계와 같다(1단계에 운용사 조회창이 없다). API: `GET /icam/fee-deposits?searchText=` → `GET /icam/fee-deposits/by-fund` → `PUT /icam/fee-deposits` → `DELETE /icam/fee-deposits`.

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam11_fee_deposit` | 펀드·시작일·입금계좌(사무·운용 보수 구분 열 없음) | 0004에서 +1 → −1 |

## 업무 규칙 · 주의

- 입금계좌 표에 보수구분 열이 없다. 그래서 #1204와 #1217이 같은 행을 보고 고친다(원본도 같은 `selectByCompanyId` — 원본 그대로).
- 목록은 발생보수(`icam10_fee`)가 있는 펀드와 INNER JOIN이다. 사무·운용 모두의 펀드가 나온다.

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam11_Tab_FundMngFeeDeposit`(#1217 E3~E6, `retrieve` L141 `icam.Icam11_FeeDeposit.selectByCompanyId`), `Icam11_Grid_MngFeeDeposit` L117·L155·L180.
- TOBE: `frontend/src/pages/icam/Icam11_Tab_FundMngFeeDeposit.tsx` L48, `IcamFeeDepositService`(0004와 같음).
</details>
