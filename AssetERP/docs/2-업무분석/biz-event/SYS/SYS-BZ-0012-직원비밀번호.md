# SYS-BZ-0012 직원 비밀번호를 설정한다(최초 설정·초기화)

> **한 줄 요약** — 직원을 등록해도 비밀번호는 비어 있다. 직원이 로그인을 시도하면 "비밀번호가 설정되지 않았거나 초기화되었습니다"가 나오고, **직원 본인이 규칙에 맞는 비밀번호를 직접 정해야** 로그인된다. 비밀번호를 잊으면 고객사 관리자가 초기화(#1182)해서 다시 비운다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 본인(최초 설정) / 고객사 관리자(초기화) |
| 언제 | 직원 등록 직후 한 번, 잊었을 때·초기화했을 때, 만료 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원) |
| 다음 이벤트 | 로그인 → SYS-BZ-0004~0006(권한)이 있어야 메뉴가 보인다 |
| 실제 실행 | kalpa, 2026-11-09 (직원 7명 `Kalpa1234!`) |

## 따라 하기 — 최초 설정

※ 화면 문구·창 모양은 AS-IS 소스(`Sys25_Lookup_Password`)와 API 응답 기준이다. 브라우저에서 눈으로 확인하는 것은 `대기(일괄)`.

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 `1001` | 로그인 화면(`kalpa.localhost:8082/AssetERP`) | 사번 `1001`, 비밀번호 아무거나 → [로그인] | "비밀번호가 설정되지 않았거나 초기화되었습니다. 비밀번호를 등록한 뒤 로그인해주세요." |
| 2 | 〃 | 비밀번호 설정 창 | 새 비밀번호 `Kalpa1234!` → [저장] | "비밀번호 변경이 완료되었습니다" (현재 비밀번호는 묻지 않는다) |
| 3 | 〃 | 로그인 화면 | 사번 `1001`, 비밀번호 `Kalpa1234!` → [로그인] | 로그인된다 |

## 따라 하기 — 초기화(잊었을 때)

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1182** 비밀번호 초기화 | 직원 선택 → [초기화] | 그 직원의 비밀번호가 비워진다. 직원은 위 "최초 설정"을 다시 한다 |
| 2 | 〃 (잠겼을 때) | #1182 | [잠금해제] | 잠금(`emp01_lock_yn`)이 풀린다 |

## DB에 남는 것

| 테이블 | 무엇 | 추가/수정 | 행 |
|:---|:---|:---|---:|
| `sys25_password` | 직원 비밀번호(암호화 저장, 순번 1) | 추가(최초 설정) / 수정(초기화 = null, 이후 설정 = 값) | 직원 1명당 1 |

## 비밀번호 규칙 (`f_password_rule`)

- 영문+숫자는 10자리 이상, 또는 영문+숫자+특수문자는 8자리 이상.
- **같은 글자 3번 이상 반복 금지**("반복문자는 2회로 제한됩니다.") → `1111`, `Kalpa1111!` 모두 거부.
- 가상 회사 직원 비밀번호는 **`Kalpa1234!`**(규칙 통과를 `f_password_rule`로 확인). 관리자 `admin`은 이 규칙과 무관하게 `1111`. → [규칙 표](../../README.md)
- 새 비밀번호가 현재와 같으면 거부(변경 시, 초기화 직후는 해당 없음).

## 결과를 볼 수 있는 화면

- 직원 로그인, #1140 로그인내역.

## 업무 규칙 · 주의

- 비밀번호가 **비어 있는 채**로는 로그인되지 않는다. 직원 등록만으로는 로그인 불가.
- 비밀번호 만료 시 `PASSWORD_CHANGE_REQUIRED`(만료 10일 전부터 경고). 연장은 "만료 연장"(현재 비밀번호 확인).
- 인증번호(SMS) 경로도 있다 — 이 머신에는 SMS 연동이 없어 동작하지 않는다.
- 비밀번호를 연속으로 틀리면 계정이 잠긴다(`LoginLockService`, 풀기: #1182 [잠금해제]). 횟수는 설정값이다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0012
needs: [EMP-BZ-0001]
actor: { company: kalpa, user: "<사번>" }
steps:
  - no: 1
    action: 로그인 시도
    api: POST /api/auth/login
    expect_code: PASSWORD_INIT_REQUIRED
  - no: 2
    api: POST /api/auth/password/change
    body: { companyCode: kalpa, loginId: "<사번>", newPassword: "Kalpa1234!" }
  - no: 3
    api: POST /api/auth/login
    expect_code: OK
rules:
  - 새 비밀번호 "Kalpa1111!" → "반복문자는 2회로 제한됩니다."
expect:
  - { table: sys25_password, rows: "직원 수" }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select p.emp01_emp_no, w.sys25_seq, w.sys25_pwd is not null as has_pwd
  from emp01_person p left join sys25_password w on w.sys25_person_id = p.emp01_person_id
 where p.emp01_company_id = :cid order by 1;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys25_Lookup_Password`(최초·변경 `insertChcek` L205-281), `Sys25_Lookup_Reset`(인증번호 재설정), #1182 초기화 `resetPassword` L221-235·잠금해제 `resetLock` L206-219
- TOBE: `AuthPasswordService.change`(`POST /api/auth/password/change`), `SysPasswordService.resetPassword`(`POST /api/v1/sys/passwords/persons/{personId}/reset`)·`unlock`, 로그인 판정 `AuthService` L121-124
- TOBE 상태(2026-11-09): **실행** — kalpa 직원 7명 설정·로그인 확인(`Kalpa1111!`는 규칙에 거부, `Kalpa1234!`는 통과). 초기화(#1182)는 아직 안 돌렸다. 자동 시험·화면 눈 확인은 아직.
</details>
