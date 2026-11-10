# EMP-BZ-0002 직원을 발령한다 (이동·승진·승급)

> **한 줄 요약** — 직원이 부서를 옮기거나 승진하면 고객사 관리자가 #1029 **일반발령 탭**에 발령 한 줄을 더한다. 발령은 지우거나 덮지 않고 **날짜별로 쌓이며**, 기준일로 조회하면 그날의 소속·직위가 보인다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 인사발령 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001(직원), ORG-BZ-0001(옮겨 갈 조직) |
| 다음 이벤트 | EMP-BZ-0003 겸직, EMP-BZ-0004 퇴직 ([목록](../README.md)) |
| 실제 실행 | kalpa, 2026-11-10 — 시험 사원 `499 시험사원`(경영지원본부 사원, 입사 2026-11-02)으로 이동·승진. EMP-BZ-0004·0005에서 정리 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1029** 경영관리 > 01. 조직 및 사원관리 > 사원정보 관리 | 왼쪽 목록에서 `499 시험사원` 선택 → **일반발령** 탭 | 발령 목록: `2026-11-02 채용 정규직 경영지원본부 팀원 사원` |
| 2 | 〃 | 〃 | [등록] | 맨 위에 새 행. 발령일 = 오늘, 조직은 지금 소속, 나머지는 최근 발령에서 복사(아래 ⚠ 2) |
| 3 | 〃 | 〃 | 발령일 `2026-11-10`, 발령구분 `이동`, 발령조직 `운용본부`(돋보기), 담당업무 `펀드 운용 보조`, 비고 `부서이동` → [저장] | 행이 저장된다 |
| 4 | 〃 | 〃 | 다시 [등록] → 발령일 `2026-11-11`, 발령구분 `승진`, 발령직위 `과장` → [저장] | 발령 3줄 |
| 5 | 〃 | #1029 왼쪽 목록 | 기준일 `2026-11-09` / `11-10` / `11-11` → [조회] | 경영지원본부·사원·채용 → 운용본부·사원·이동 → 운용본부·과장·승진 |
| 6 | 〃 | 일반발령 탭 | 같은 발령일 행을 두 개 두고 [저장] | "동일안 발령일에 이미 발령내용이 존재합니다"(원본 문구 그대로) |
| 7 | 〃 | 〃 | 발령이 1건뿐인 사원의 행 → [삭제] | "발령정보는 1(개)이상 있어야합니다" |

- 발령구분 코드(`EmpTransCode`): `100` 채용 · `200` 이동 · `300` 승진 · `400` 승급 · `800` 겸직 · `900` 퇴직.
- [특정직위 및 알림설정]은 특정직위(`EmpGradeCode`)를 사원별로 정하는 별도 창이다(EMP-BZ-0007).

## DB에 남는 것

| 테이블 | 무엇 | 추가 |
|:---|:---|---:|
| `emp03_trans` | 발령 한 줄(발령일·구분·조직·직책·직위·담당업무·조직장·임원 여부 …) | 단계 3·4마다 +1 |

- `(사원, 발령일, 발령구분)`이 유일하다. 화면은 같은 발령일을 아예 막고(원본 `update` L226-238), TOBE 서버는 같은 발령일·같은 구분만 막는다.

## 결과를 볼 수 있는 화면

- #1029 목록(기준일), #1030 조직별 사원조회, #1028 "조직 장" 칸(조직장 표시).

## 업무 규칙 · 주의

- 현재 소속·직위는 **기준일까지 가장 늦은 발령**이다(`common.emp00_trans_info`). 퇴직(900)만 **발령일 다음 날부터** 적용된다.
- ⚠ **TOBE 부족 1 — [임원] 열이 없다.** 원본 그리드에는 `임원`(`emp03_director_yn`, 2026-03-12·16 추가)이 있는데, TOBE 그리드·저장 요청(`TransSaveReq`)에 없다. 조직장·등기임원·책무임원·비상근은 있다.
- ⚠ **TOBE 부족 2 — [등록] 때 복사하는 값이 옛 방식이다.** 원본(2026-08-26 "일반발령 등록시 최근정보 copy")은 **가장 최근 발령**에서 발령구분·특정직위·담당업무·조직장·임원·책무임원·비상근·비고까지 복사한다. TOBE `Emp03_TabPage_Trans.tsx` L142-149는 왼쪽 목록의 사원 행에서 사원구분·직책·직위·등기임원·조직만 복사한다.
- 두 가지 모두 `yunhee drift`의 기준(`546a87d`)보다 앞선 원본 변경이라 drift에 걸리지 않는다. 변환할 때 빠진 것이다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0002
needs: [EMP-BZ-0001, ORG-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
setup:
  - api: POST /api/v1/emp/trans-infos
    body: { empNo: "499", korNm: "시험사원", kindCd: "10", hireDate: "2026-11-02", hireCd: "10",
            titleCd: "250", posCd: "650", orgCodeId: "<경영지원본부>", mobileTelNo: "010-4990-499", emailAddr: "499@kalpa.test" }
steps:
  - no: 3
    api: PUT /api/v1/emp/trans
    body: [{ personId: "<499>", transDate: "2026-11-10", transCd: "200", kindCd: "10", orgCodeId: "<운용본부>",
             titleCd: "250", posCd: "650", duty: "펀드 운용 보조", transReason: "부서이동" }]
    expect: { table: emp03_trans, delta: +1 }
  - no: 4
    api: PUT /api/v1/emp/trans
    body: [{ personId: "<499>", transDate: "2026-11-11", transCd: "300", posCd: "500", ... }]
    expect: { table: emp03_trans, delta: +1 }
  - no: 5
    api: GET /api/v1/emp/trans-infos?transDate=2026-11-11&transCode=100&separateAddTitle=true
    expect: { row: { empNo: "499", orgKorNm: "운용본부", posNm: "과장" } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp00_Tab_TransInfo`(#1029) → `Emp03_TabPage_Trans` [등록] E3 `insertRow` L277-338 · [저장] E5 `update` L212-248 · [삭제] E4 `deleteRow` L341-358(`emp.Emp03_Trans.deleteCheck`)
- AS-IS 서버: `emp.Emp03_Trans.update` L195-198(UpdateDataModel)
- TOBE: `PUT /api/v1/emp/trans`·`DELETE /api/v1/emp/trans`(`EmpTransService.updateTranses` L69-96), 목록 `GET /api/v1/emp/trans-infos`
- TOBE 상태(2026-11-10): **실행** — 이동·승진 저장, 기준일별 목록. 목록은 `yunhee compare`로 원본 `emp00_trans_info.selectByText`와 재직(100)·퇴직(900)·전체(000) 모두 행 수가 같다. 화면 눈 확인은 `대기`.
</details>
