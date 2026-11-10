# EMP-BZ-0004 직원을 퇴직 처리한다

> **한 줄 요약** — 직원이 그만두면 사원을 지우지 않고 #1029 일반발령 탭에 **`퇴직` 발령**을 한 줄 더한다. **퇴직일 다음 날부터** 그 사원은 재직 목록에서 빠지고 로그인하면 "퇴사한 사원입니다. 관리자에게 문의해주세요."가 나온다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 퇴사 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001 |
| 다음 이벤트 | — (실수로 등록한 사원만 EMP-BZ-0005 삭제) |
| 실제 실행 | kalpa, 2026-11-10 — `499 시험사원` 퇴직 발령(2026-11-09) → 로그인 거부 확인. EMP-BZ-0005에서 삭제 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1029** 사원정보 관리 | 사원 선택 → 일반발령 탭 → [등록] | 새 행(앞 발령 복사) |
| 2 | 〃 | 〃 | 발령일 = 마지막 근무일(`2026-11-09`), 발령구분 `퇴직`, 비고 `개인사유` → [저장] | 행 저장 |
| 3 | 〃 | #1029 목록 | 구분 `재직` / `퇴직` / `전체` → [조회](기준일 2026-11-10) | 재직 7명(499 없음) · 퇴직 1명(499) · 전체 8명 |
| 4 | 퇴직한 직원 | 로그인 화면 | `kalpa` / `499` / 비밀번호 | "퇴사한 사원입니다. 관리자에게 문의해주세요." (비밀번호보다 먼저 검사) |

## DB에 남는 것

| 테이블 | 무엇 | 추가 |
|:---|:---|---:|
| `emp03_trans` | 퇴직 발령(`emp03_trans_cd = '900'`) | +1 |
| `sys26_login` | 로그인 시도 기록 | 로그인할 때마다 +1 |

## 결과를 볼 수 있는 화면

- #1029 목록 `퇴직` 필터, 퇴직자 목록(`GET /api/v1/emp/trans-infos/retired`), #1287 기간별 입퇴사현황.

## 업무 규칙 · 주의

- 퇴직(900)은 **발령일 다음 날부터** 효력이 있다(`common.emp00_trans_info`: 900은 `trans_date < 기준일`, 나머지는 `<=`). 퇴직일 당일까지는 재직이다.
- 퇴직 발령 뒤에 다른 발령을 더 넣지 않는다(목록과 로그인은 가장 늦은 발령을 본다).
- 로그인 거부는 TOBE `AuthService.login` L96-100(`RETIRED_EMPLOYEE`)이 한다.
- 실행 메모: 원래 이동·승진 발령(11-10·11-11)을 지우고 퇴직을 11-09로 넣었다. 오늘(11-10)부터 퇴직 효력이 나게 하려는 것이다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0004
needs: [EMP-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 2
    api: PUT /api/v1/emp/trans
    body: [{ personId: "<499>", transDate: "2026-11-09", transCd: "900", kindCd: "10", orgCodeId: "<경영지원본부>",
             titleCd: "250", posCd: "650", transReason: "개인사유" }]
    expect: { table: emp03_trans, delta: +1 }
  - no: 3
    api: GET /api/v1/emp/trans-infos?transDate=2026-11-10&transCode=100&separateAddTitle=true
    expect: { absent: { empNo: "499" } }
  - no: 4
    api: POST /api/auth/login
    body: { companyCode: kalpa, username: "499", password: "Kalpa1234!" }
    expect: { http: 401, code: RETIRED_EMPLOYEE }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: 발령 저장은 EMP-BZ-0002와 같다. 목록 필터 `Emp00_Tab_TransInfo.retrieve` L394-432(재직 100 · 퇴직 900 · 겸직 800 · 전체 000), 퇴직 효력 `Common.xml` `emp00_trans_info` L1484-1485
- TOBE: `PUT /api/v1/emp/trans`, `GET /api/v1/emp/trans-infos`, `AuthService.login` L96-100
- TOBE 상태(2026-11-10): **실행** — 퇴직 저장, 목록 3가지 필터가 원본 SQL과 행 수가 같음(`yunhee compare`), 로그인 401 `RETIRED_EMPLOYEE`. 화면 눈 확인은 `대기`.
</details>
