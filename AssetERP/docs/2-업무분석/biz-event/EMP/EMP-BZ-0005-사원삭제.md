# EMP-BZ-0005 잘못 등록한 사원을 지운다

> **한 줄 요약** — 실수로 등록한 사원은 #1029 인적사항 탭에서 [삭제]한다. 원본은 **그 사원이 어디서든 쓰였으면**(로그인 기록 한 번도 포함) 지우지 못하게 하고 "퇴직처리는 '일반발령' 탭에서 가능합니다"로 안내한다. **TOBE에는 이 검사가 없어서** 쓰인 사원도 지워진다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 잘못 등록했을 때(실제로 일한 사원은 EMP-BZ-0004 퇴직) |
| 먼저 있어야 하는 것 | EMP-BZ-0001. 겸직이 있으면 먼저 지운다(EMP-BZ-0003) |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-10 — `499 시험사원` 삭제(로그인 기록 2건이 있어 원본이라면 막혔을 사원) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1029** 사원정보 관리 | 사원 선택 → 인적사항 탭 → [삭제] | (원본) 쓰인 사원이면 "해당 사원은 사용 데이터가 존재합니다. [ 퇴직처리는 '일반발령' 탭에서 가능합니다 ]" — 끝 |
| 2 | 〃 | 〃 | 겸직이 있으면 | "겸직발령내역이 존재합니다. 삭제 후 처리해주세요" |
| 3 | 〃 | 〃 | 확인창 "선택한 사원의 정보를 삭제하면 예전 데이터도 전부 삭제됩니다. 진행하시겠습니까?" → [진행] | 목록에서 사원이 빠진다 |

## DB에 남는 것

| 테이블 | 무엇 | 변화 |
|:---|:---|---:|
| `emp99_person_del` | 삭제한 사원 사본 | +1 |
| `emp01_person` | 사원 | -1 |
| `emp02_others`·`emp03_trans`·`emp35_deduct` 등 | **지우지 않는다**(원본·TOBE 같음) | 0 — 주인 없는 행으로 남는다 |

- 실행 뒤 kalpa에 시험 사원의 행이 남아 있다: `emp02_others` 1 · `emp03_trans` 2 · `emp35_deduct` 1(`person_id = 202611109049804`). 목록은 `emp01_person`과 조인하므로 화면에는 안 보인다. 백업 표(`empbak01_person`·`empbak03_trans`)에도 사본이 있다.

## 결과를 볼 수 있는 화면

- #1029 목록, #1030.

## 업무 규칙 · 주의

- 원본 사용 검사 `emp01_person.checkUsePersonId` = `f_check_use_person_id(personId)`(DB 함수, asseterpdb에 있음): `%person_id`·`%emp_reg_id` 칸이 있는 모든 표에서 이 사원을 세어 더한다. `emp00~03`·`emp35`·백업 표는 뺀다. 1 이상이면 막는다. 로그인 기록(`sys26_login`)도 세므로 **한 번이라도 로그인을 시도한 사원은 지울 수 없다**(실행: 499는 2 = `sys26_login` 2건).
- ⚠ **TOBE 부족 1 — 사용 검사가 없다.** 원본은 2026-08-11(git `a9f8426a0`)에 `deleteConfirm01`로 더했다. TOBE `Emp01_TabPage_Person.tsx` `deleteConfirm` L89-115와 `EmpPersonService.deletePerson` L76-82에는 없다.
- ⚠ **TOBE 부족 2 — 겸직 검사 대상이 다르다.** 지금 원본 `deleteConfirm02` L248-279는 **선택한 사원**의 겸직을 본다. TOBE L92-93은 옛 원본처럼 **로그인한 사용자 ID**로 본다(주석에 "원본 그대로"라고 적혀 있는데, 옛 원본 기준이다). 그래서 관리자가 지울 때 겸직이 있어도 막지 못한다.
- 두 가지 모두 drift 기준보다 앞선 원본 변경이다(변환할 때 빠짐).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0005
needs: [EMP-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 3
    api: DELETE /api/v1/emp/persons/{personId}
    expect: [{ table: emp01_person, delta: -1 }, { table: emp99_person_del, delta: +1 },
             { table: emp03_trans, delta: 0 }]
  # 원본이라면: f_check_use_person_id(personId) > 0 → 삭제 막음
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp01_TabPage_Person` [삭제] E7 → `deleteConfirm01` L212-246(`emp.Emp01_Person.checkUsePersonId`) → `deleteConfirm02` L248-279(`emp.Emp04_AddTitle.selectByPersonId`) → E9 `delete`
- AS-IS 서버: `emp.Emp01_Person.checkUsePersonId` L97-113, `deleteTarget` L165-170(`insertEmpDel` + emp01_person 삭제)
- TOBE: `DELETE /api/v1/emp/persons/{personId}`(`EmpPersonService.deletePerson`), `GET /api/v1/emp/persons/{personId}/add-titles/count`
- TOBE 상태(2026-11-10): **실행** — 삭제 + 삭제 이력. 사용 검사 없음(위 ⚠). 화면 눈 확인은 `대기`.
</details>
