# ICAM-BZ-0012 KFS가 사용자ID 신청 처리결과를 등록한다

> **한 줄 요약** — KFS 담당이 #1316 사용자ID 처리결과 등록에서 결재가 올라간(상신 10·진행 20·완료 30·반려 40) ICAM 사용자ID 신청서·권한정지 신청서를 보고, ICAM에 실제로 처리한 결과를 적는다. 적는 것은 처리결과(`ProcStateCode` 1 완료 / 9 이행불가)·처리일자·처리상세·처리자다. 그리드에서 바로 고쳐 [저장]하거나, 여러 행을 골라 **[일괄저장]**(`Icam55_Lookup_UserApprResult`) 창에서 같은 결과를 한 번에 넣는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS ICAM 운영 담당(시험은 104) |
| 언제 | ICAM에서 계정을 만들거나 바꾼 뒤 |
| 먼저 있어야 하는 것 | 0011(A33 상신된 신청서) 또는 0013(A34) |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, API(104). 목록(전체 기간, 구분 전체) AS-IS 7 = 7(그리드 10열, 0011 시험 신청서 포함). [일괄저장] 완료·2026-11-14·"ZZ 계정 생성 완료(시험)" → 처리자 104. "(선택안함)+처리일자" 400 "처리결과가 (선택안함)이면 처리일자는 세팅될 수 없습니다." **kalpa 401이 같은 KFS 행을 [저장](처리자 ID를 요청 값 29025로)·[일괄저장](이행불가)으로 바꿈**(⚠#244 보강) → 104가 되돌림 |
| 메뉴 | #1316 KFS > 04. ICAM 사용자ID 관리 > 사용자ID 처리결과 등록 (6곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1316 | 기간·신청서구분(1 신청 / 2 권한정지)·검색어·처리결과 포함 → [조회] (`GET /icam/users/results?startDate=&closeDate=&regType=&searchText=`) | 결재가 올라간 신청서(신청일·구분·회사·사용자·처리구분·결재상태·처리결과·처리일자·처리자) |
| 2 | 〃 | 〃 | 행의 처리결과·처리일자·처리상세 편집 → [저장] (`PUT /icam/users/results [{icamUserId, procStateCode, procDate, procNote, procEmpId}]`) | 저장 |
| 3 | 〃 | 〃 | 행 체크 → [일괄저장] → 창에서 처리결과·처리일자·처리상세 → [저장] (`PUT /icam/users/results/batch {ids, procStateCode, procDate, procNote}`) | 고른 행 모두 같은 결과, 처리자는 로그인 사원 |
| 4 | 〃 | 〃 | 결재상태 셀 → 결재문서 보기 | 결재문서 창 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam55_icam_user` | 처리결과·처리일자·처리상세·처리자(`icam55_proc_*`) | 0011 시험 행에 완료·처리자 104 |

## 업무 규칙 · 주의

- 목록은 결재문서가 있는 행만 나온다(`apr01_status_cd IN ('10','20','30','40')`). 결재가 끝나지 않은(상신) 신청서에도 결과를 적을 수 있다(원본 같음).
- [일괄저장]의 검사는 서버에서도 한다. 처리결과가 (선택안함)이면 처리일자가 없어야 하고, 처리결과를 고르면 처리일자가 있어야 한다.
- 그리드 [저장](`PUT /users/results`)은 처리자 ID를 요청 값 그대로 저장한다. 회사·메뉴 검사도 없다(원본 `UpdateDataModel`도 화면이 보낸 값) → [#244](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0012
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/icam/users/results?startDate=2000-01-01&closeDate=2099-12-31
    expect: rows 7
  - no: 2
    api: PUT /api/v1/icam/users/results/batch
    body: {ids: ["{0011 신청서}"], procStateCode: "1", procDate: 2026-11-14, procNote: "ZZ 계정 생성 완료(시험)"}
    expect: proc_emp_id 29049
  - no: 3
    api: PUT /api/v1/icam/users/results/batch
    body: {ids: ["{0011 신청서}"], procStateCode: "", procDate: 2026-11-14}
    expect: 400 "처리결과가 (선택안함)이면 처리일자는 세팅될 수 없습니다."
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam55_Tab_UserApprResult`(#1316 E2~E4, L178·L250·L260), `Icam55_Lookup_UserApprResult` L141 `icam.Icam55_IcamUser.updateResult`, SQL `icam55_icam_user.selectByDate`.
- TOBE: `IcamUserController` L76-93, `IcamUserService.searchResults` L162-166·`saveResults` L170-177·`updateResult` L181-195.
- 확인: `compare GET /icam/users/results --sql icam55_icam_user.selectByDate --grid Icam55_Tab_UserApprResult` 7=7.
</details>
