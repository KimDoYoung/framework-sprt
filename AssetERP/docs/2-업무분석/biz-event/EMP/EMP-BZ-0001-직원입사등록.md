# EMP-BZ-0001 직원을 입사 등록한다

> **한 줄 요약** — 칼파테크에 직원 7명이 입사했다. 고객사 관리자가 사장 1명과, 두 본부마다 부장·과장·사원 1명씩을 등록한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 직원이 입사할 때마다 |
| 먼저 있어야 하는 것 | ORG-BZ-0001(조직), **SYS-BZ-0007(사원구분 코드)** |
| 다음 이벤트 | SYS-BZ-0012 직원 비밀번호 설정, SYS-BZ-0004~0006 권한 |
| 실제 실행 | kalpa, 2026-11-09 (7명) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1029** 경영관리 > 01. 조직 및 사원관리 > 사원정보 관리 | [등록] | 신규사원 등록 창 |
| 2 | 〃 | 같은 창 | 사번·성명·입사일·이메일·휴대폰, 사원구분 `정규직`, 채용구분 `공개채용`, 직위·직책, 조직 선택 → [저장] | 목록에 직원이 생긴다 |
| 3 | 〃 | 〃 | 7명 반복 | 7행 |

가상 회사 직원(kalpa·kova·igo 모두 같은 7명):

| 사번 | 이름 | 소속 | 직위 | 직책 |
|:---|:---|:---|:---|:---|
| 100 | 김사장 | (주)칼파테크 | 사장 | 대표이사 |
| 201 | 박부장 | 경영지원본부 | 부장 | 본부장 |
| 202 | 정부장 | 운용본부 | 부장 | 본부장 |
| 301 | 김과장 | 경영지원본부 | 과장 | 팀장 |
| 302 | 박과장 | 운용본부 | 과장 | 팀장 |
| 401 | 김사원 | 경영지원본부 | 사원 | 팀원 |
| 402 | 최사원 | 운용본부 | 사원 | 팀원 |

**사번에 직함이 들어 있다**(`1xx` 사장·`2xx` 부장·`3xx` 과장·`4xx` 사원 + 순번). 4개 직급만 쓴다 — [규칙](../../README.md).

입사일은 모두 `2020-03-02`, 사원구분 정규직(`10`), 채용구분 공개채용(`10`), 이메일 `사번@kalpa.test`, 휴대폰 `010-1000-사번`.

## DB에 남는 것

| 테이블 | 무엇 | 행(7명) |
|:---|:---|---:|
| `emp01_person` | 사람(사번·성명·입사일·연락처) | 7 |
| `emp02_others` | 기타정보(빈 행) | 7 |
| `emp03_trans` | 입사 발령(조직·직위·직책·사원구분) | 7 |
| `emp35_deduct` | 급여공제(자동 생성) | 7 |
| `emp36_add_deduct` | 추가인적공제 구분별(회사 0의 구분 4개씩) | 28 |

이 단계에서 **생기지 않는 것:** 비밀번호(`sys25_password`, SYS-BZ-0012), 권한그룹 연결(`sys05_user_role`, SYS-BZ-0006).

## 결과를 볼 수 있는 화면

- #1029 목록, #1030 조직별 사원조회. 직원 로그인은 비밀번호를 정한 뒤에 된다.

## 업무 규칙 · 주의

- 필수: 사원번호·성명·입사일·이메일·사원구분·휴대폰번호·직책·직위·조직. 빠지면 "○○은 필수입력 항목입니다".
- **사원번호는 회사 안에서 유일**("이미 사용 중인 사원번호입니다." — AS-IS는 DB 오류 원문).
- **사원구분 코드가 회사에 없으면 고를 수 없다**: 사원구분(시스템코드)은 회사 등록 때 복사되지 않는다 → SYS-BZ-0007.
- 직위(사장·부장·과장·사원)와 직책(대표이사·본부장·팀장·팀원)은 별개 코드다.
- 가상 회사 직원 로그인: `kalpa/사번/Kalpa1234!`(비밀번호 설정 뒤).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0001
needs: [ORG-BZ-0001, SYS-BZ-0007]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 2
    screen: 1029
    action: '[등록] → 값 입력 → [저장] (7명)'
    api: POST /api/v1/emp/trans-infos
    body: { empNo: "100", korNm: "김사장", kindCd: "10", hireDate: "2020-03-02", mobileTelNo: "010-1000-100",
            hireCd: "10", emailAddr: "100@kalpa.test", titleCd: "100", posCd: "100", orgCodeId: "<루트>" }
expect:
  - { table: emp01_person, rows: 7 }
  - { table: emp03_trans, rows: 7 }
  - { table: emp35_deduct, rows: 7 }
  - { table: sys25_password, rows: 0 }   # 비밀번호는 SYS-BZ-0012
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select p.emp01_emp_no, p.emp01_kor_nm, t.emp03_org_code_id, t.emp03_pos_cd, t.emp03_title_cd
  from emp01_person p join emp03_trans t on t.emp03_person_id = p.emp01_person_id
 where p.emp01_company_id = :cid order by 1;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp00_Tab_TransInfo`(#1029, [등록] E5 `insert`), 등록 창 `Emp03_Edit_Person`(필수 검사 `update` L304-339, 사번 중복 `empNoCheck` L315)
- AS-IS 서버: `emp.Emp00_TransInfo.update` L415(사람·기타정보·채용발령·급여공제를 한 번에)
- TOBE: `POST /api/v1/emp/trans-infos`(`EmpTransInfoController.createTransInfo`), `EmpTransInfoService.createTransInfo`(한 트랜잭션)
- TOBE 상태(2026-11-09): **실행** — kalpa에서 API로 7명 등록, 오류 없음. 자동 시험·화면 눈 확인은 아직(`대기`).
- 사원구분 코드 값: `sys09_code` 종류 29(정규직 10·계약직 20·수습직 30·임시직 40·기타직 99), 직위 종류 27, 직책 종류 28, 채용구분 종류 32.
</details>
