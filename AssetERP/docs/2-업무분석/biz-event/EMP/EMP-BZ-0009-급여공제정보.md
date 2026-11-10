# EMP-BZ-0009 직원의 급여공제 정보를 정한다

> **한 줄 요약** — 급여를 계산하려면 직원마다 **공제대상 가족수·추가인적공제·4대보험 가입·원천징수 비율** 같은 공제 정보가 있어야 한다. 입사 등록 때 기본값 한 벌(입사일 기준)이 자동으로 생기고, 바뀌면 고객사 관리자가 **새 적용시작일**을 만들어 그날부터의 값을 넣는다. 날짜별로 쌓이며 급여는 지급일 기준의 값을 쓴다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 입사 뒤, 가족·보험·세율이 바뀔 때(연말정산 뒤 등) |
| 먼저 있어야 하는 것 | EMP-BZ-0001(입사 때 공제 1벌 자동 생성) |
| 다음 이벤트 | PAY 급여 계산(PAY 도메인) |
| 실제 실행 | kalpa, 2026-11-10 — `401 김사원` 값 고치기 → 2026-01-01 새 적용일 → 같은 날 다시 → 삭제, 값 되돌림 |
| ⚠ 메뉴 | **kalpa(상품 S1)에는 #1277 메뉴가 없다.** 화면으로 하려면 메뉴부터 열어야 한다(아래 "업무 규칙"). 이번 실행은 API로만 했다 |

## 따라 하기

화면은 두 곳이다: **#1277** 경영관리 > 04. 급여관리 > 급여공제정보(위: 직원 목록, 아래: 공제 기간·입력 폼), **#1029** 사원정보 관리의 공제 탭(같은 아래쪽 부품).

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1277** | 화면을 연다(재직구분 `재직`, 사원명 `전체`) | 직원 7명: 공제대상가족수 1 · 4대보험 ✓ · 국민연금 미납부 ✓ · 원천징수 100 (입사 때 기본값) |
| 2 | 〃 | 〃 | `김사원` 행 선택 | 아래에 적용시작일 목록(`2020-03-02`)과 입력 폼 |
| 3 | 〃 | 아래 폼 | 공제대상가족수 `3`, 8~20세 자녀수 `1`, 추가인적공제 ✓, 원천징수 비율 `80` → [저장] | "저장이 완료되었습니다." 원천징수 비율이 비면 "원천징수비율은 필수입력 항목입니다" |
| 4 | 〃 | 〃 | 추가인적공제 옆 아이콘 → 추가인적공제 창: `경로우대` 인원 `1` → [저장] | 4가지(경로우대·장애인·부녀자·한부모) 인원. 추가인적공제를 체크하지 않았으면 "추가인적공제 체크후 등록가능합니다" |
| 5 | 〃 | 아래 목록 | [등록] → 적용일 `2026-01-01` → [생성] | 목록에 `2026-01-01` 추가, **바로 앞 기간의 값이 복사된다**(가족수 3·원천징수 80·경로우대 1까지). 적용일이 비면 "적용일은 필수입력 항목입니다" |
| 6 | 〃 | 〃 | 같은 날 `2026-01-01`로 다시 [생성] | 줄 수 그대로, **기존 같은 날 기간을 새로 바꿔 끼운다**(새 ID, 값은 복사) |
| 7 | 〃 | 아래 폼 | `2026-01-01` 선택 → [삭제] → "선택한 급여공제를 삭제하시겠습니까?" [예] | 그 기간과 추가인적공제 4줄이 지워진다 |
| — | 〃 | #1277 툴바 | [기본설정] · [임금계산방법] · [급여출금계좌] | PAY 도메인 창(`pay30_Popup_BasicSetup`·`Pay04_Lookup_Formula`·`Pay03_Lookup_PayAccount`) — PAY 이벤트에서 다룬다 |
| — | 〃 | 아래 폼 | 4대보험 옆 아이콘 | 4대보험 신고정보 창(`Pay31_Popup_InsureApply`) — PAY 이벤트에서 다룬다 |

## DB에 남는 것

| 테이블 | 무엇 | 단계 3 | 단계 5 | 단계 6 | 단계 7 |
|:---|:---|---:|---:|---:|---:|
| `emp35_deduct` | 공제 기간(사원 · 적용시작일 · 가족수 · 추가공제 · 4대보험 · 대표자 · 원천징수 · 자녀수) | 0 | +1 | 0(바꿔 끼움) | -1 |
| `emp36_add_deduct` | 추가인적공제 4종 인원(기간마다 4줄) | 0 | +4 | 0(바꿔 끼움) | -4 |

- "국민연금 미납부"는 저장된 칸이 아니라 4대보험 신고(`pay31_insure_apply`)에서 계산한다(`f_get_4insure_yn(…, '1')`).

## 결과를 볼 수 있는 화면

- #1277 목록(오늘 기준 적용 중인 값), #1029 공제 탭, PAY 급여 계산.

## 업무 규칙 · 주의

- **[생성]의 세 갈래**(원본 `Emp35_Deduct.insert` L60-126, TOBE `EmpDeductService.createDeduct` L48-77 같음): 적용일 이전 기간이 없으면 빈 기간, 바로 앞 기간이 **같은 날**이면 값 복사 + 옛 기간 삭제(바꿔 끼움), **다른 날**이면 값 복사. 추가인적공제 인원도 바로 앞 기간에서 복사한다(`emp36_add_deduct.addDeductTypeInsert`).
- 목록은 원본 SQL과 같다(`yunhee compare` `emp35_deduct.selectByStdDate`: 7 = 7, 열 10개 포함).
- ⚠ **TOBE 보안 — 추가인적공제 조회·저장에 회사 검사가 없다.** `GET·PUT /api/v1/emp/deducts/{deductId}/add-deducts`(`EmpDeductService.getAddDeducts`·`updateAddDeducts` L102-114, 매퍼 `selectAddDeducts`·`updateAddDeduct`)는 로그인 회사를 보지 않는다. 실행: **kalpa 관리자가 다른 회사 직원의 공제 ID(`202306191543339`)로 추가인적공제 4줄을 읽었다.** 저장도 `emp36_add_deduct_id`만으로 고치므로 다른 회사 값을 바꿀 수 있다(남의 데이터라 쓰기 시험은 안 함). ID는 날짜+순번이라 짐작할 수 있다. 원본도 서버 검사가 없지만 TOBE는 JWT·회사 분리가 원칙(`docs/security-설계.md`)이라 막아야 한다.
- 작은 차이 — [생성]은 요청한 사원이 로그인 회사 사람인지 보지 않는다(`createDeduct`). 다른 회사 사원 ID를 주면 내 회사 ID로 주인 없는 공제 행이 생긴다. 시험은 안 했다.
- **kalpa에는 이 메뉴가 없다.** 회사 메뉴(`sys03_company_menu`)를 보면 상품 S1 회사 2곳은 #1277이 없고, 메뉴가 있는 회사는 7곳이다. EMP 업무 화면 대부분(#1032 휴가 등)도 같다 — [EMP 업무흐름](EMP-업무흐름.md#가상-회사-kalpa의-메뉴-범위) 참조.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0009
needs: [EMP-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 3
    api: PUT /api/v1/emp/deducts/{deductId}
    body: { deductId: "<401 입사 공제>", basicDeductCnt: 3, addDeductYn: "true", insureYn: "true", withHoldRate: 80, childDeductCnt: 1 }
  - no: 3
    api: PUT /api/v1/emp/deducts/{deductId}
    body: { deductId: "<…>", basicDeductCnt: 3 }
    expect: { http: 400, message: "원천징수비율은 필수입력 항목입니다" }
  - no: 4
    api: PUT /api/v1/emp/deducts/{deductId}/add-deducts
    body: [{ addDeductId: "<경로우대 행>", addDeductCnt: 1 }]
  - no: 5
    api: POST /api/v1/emp/deducts
    body: { personId: "<401>", startDate: "2026-01-01" }
    expect: [{ table: emp35_deduct, delta: +1 }, { table: emp36_add_deduct, delta: +4 }, { copied: { basicDeductCnt: 3, withHoldRate: 80, 경로우대: 1 } }]
  - no: 6
    api: POST /api/v1/emp/deducts
    body: { personId: "<401>", startDate: "2026-01-01" }
    expect: [{ table: emp35_deduct, delta: 0 }, { table: emp36_add_deduct, delta: 0 }]
  - no: 7
    api: DELETE /api/v1/emp/deducts/{deductId}
    expect: [{ table: emp35_deduct, delta: -1 }, { table: emp36_add_deduct, delta: -4 }]
security:
  - api: GET /api/v1/emp/deducts/{다른 회사 deductId}/add-deducts
    expect: { http: 404 }   # 지금은 200 + 4행 (⚠)
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp35_Tab_DeductPerson`(#1277, E0~E7) — 아래 `Emp35_Page_DeductDate`(적용시작일 목록, [조회]·[등록]) + `Emp35_TabPage_DeductInsert`(폼, [저장] `update` L217-235 · [삭제] `deleteChk` L237-249 · 추가공제 아이콘 E3 · 4대보험 아이콘 E4) + `Emp36_Popup_AddDeduct` + `Emp35_Popup_DeductCreate`(`update` L88-106). #1029 공제 탭도 같은 부품
- AS-IS 서버: `emp.Emp35_Deduct.selectByStdDate`·`selectByPersonId`·`insert` L60-126·`update`·`deleteAll`, `emp.Emp36_AddDeduct.selectByDeductId`·`updateDeductCnt`
- TOBE: `GET /api/v1/emp/deducts/persons`, `GET /api/v1/emp/persons/{id}/deducts`, `POST·PUT·DELETE /api/v1/emp/deducts[/{id}]`, `GET·PUT /api/v1/emp/deducts/{id}/add-deducts`(`EmpDeductService`)
- 클래스 대조(`yunhee analysis ui --tobe frontend/src`): 5개 클래스 모두 버튼·이벤트·그리드 수가 같다.
- TOBE 상태(2026-11-10): **실행(API)** — 저장·필수 검사·추가공제·생성 세 갈래 중 두 갈래(다른 날·같은 날)·삭제·목록 비교·보안 확인. "이전 기간 없음" 갈래는 실행 안 함. PAY 창 4개는 PAY 이벤트로. 화면 눈 확인은 `대기`.
</details>
