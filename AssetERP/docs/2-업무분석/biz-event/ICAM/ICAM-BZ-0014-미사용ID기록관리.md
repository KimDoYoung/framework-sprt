# ICAM-BZ-0014 KFS가 미사용ID 처리(삭제·정지해제) 기록을 관리한다

> **한 줄 요약** — KFS 담당이 #1317 미사용ID 기록관리에서 처리결과가 **완료(1)**인 신청서·권한정지 행에 그 뒤의 일을 적는다: 계정 **삭제일자**·**정지 해제일자**·비고(`icam55_icam_user`). 행을 더블클릭해 하나씩 고치거나(`Icam55_Edit_UserStopAuth`), 여러 행을 골라 **[일괄저장]**(`Icam55_Lookup_UserStopAuth`) 창에서 같은 값을 넣는다. 두 날짜가 모두 비면 관리자(처리자)도 비운다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS ICAM 운영 담당(시험은 104) |
| 언제 | 정지한 계정을 지우거나 다시 열 때 |
| 먼저 있어야 하는 것 | 0012에서 처리결과 완료 |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, API(104). 0013 시험 행 2개를 0012 [일괄저장]으로 완료 → 목록(전체 기간) AS-IS 13 = 13(그리드 11열). `…496` 개별 저장 삭제일자 2026-11-14 → 관리자 104. `…497` [일괄저장] 해제일자 2026-11-14 → 관리자 104. 두 날짜를 비운 일괄저장 → 날짜·관리자 비움 |
| 메뉴 | #1317 KFS > 04. ICAM 사용자ID 관리 > 미사용ID 기록관리 (6곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1317 | 기간·검색어·삭제대상만 → [조회] (`GET /icam/users/stop-auths?startDate=&closeDate=&searchText=&delTarget=`) | 처리 완료된 행(회사·사용자ID·이름·처리일자·삭제일자·해제일자·비고·관리자) |
| 2 | 〃 | 〃 | 행 더블클릭 → 삭제일자·해제일자·비고 → [저장] (`PUT /icam/users/stop-auths/{icamUserId}`) | 저장 |
| 3 | 〃 | 〃 | 체크 → [일괄저장] → 창 → [저장] (`PUT /icam/users/stop-auths/batch {ids, delDate, unstopDate, note}`) | 고른 행 모두 같은 값 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam55_icam_user` | 삭제일자·해제일자·비고·관리자(`icam55_del_date`·`unstop_date`·`note`·`mng_emp_id`) | 시험 행 2개 |

## 업무 규칙 · 주의

- 관리자는 로그인 사원으로 서버가 정한다(두 날짜가 모두 비면 비움).
- 회사·메뉴 검사가 없다(`본인`만) — 다른 회사 사원도 같은 행을 고친다 → [#244](../../보안_및_버그_의심.md) (같은 표).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0014
company: 28000 (KFS)
pre:
  - api: PUT /api/v1/icam/users/results/batch
    body: {ids: ["{0013 두 행}"], procStateCode: "1", procDate: 2026-11-14}
steps:
  - no: 1
    api: GET /api/v1/icam/users/stop-auths?startDate=2000-01-01&closeDate=2099-12-31
    expect: rows 13
  - no: 2
    api: PUT /api/v1/icam/users/stop-auths/{id1}
    body: {delDate: 2026-11-14, note: "ZZ 계정 삭제(시험)"}
    expect: mng_emp_id 29049
  - no: 3
    api: PUT /api/v1/icam/users/stop-auths/batch
    body: {ids: ["{id2}"], unstopDate: 2026-11-14}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam55_Tab_UserStopAuth`(#1317 E2·E3, L173 `selectByProcStateCode`), `Icam55_Edit_UserStopAuth.update` L129-150, `Icam55_Lookup_UserStopAuth.update` L123-149, SQL `icam55_icam_user.updateStopAuth`.
- TOBE: `IcamUserStopAuthController` L33-49, `IcamUserStopAuthService` L30-55.
- 확인: `compare GET /icam/users/stop-auths --sql icam55_icam_user.selectByProcStateCode --grid Icam55_Tab_UserStopAuth` 13=13.
</details>
