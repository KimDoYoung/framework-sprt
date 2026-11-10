# EMP-BZ-0011 결재선 예외 대상을 정한다 (원본에서 효과 없음)

> **한 줄 요약** — #1439에 직원을 "결재선 예외"로 등록·해제한다. 그런데 **지금 원본 어디에서도 이 목록을 읽지 않는다** — 결재선 계산·DB 함수 어느 곳에도 쓰이지 않아, 등록해도 결재에 아무 변화가 없다. 화면과 저장만 있는 기능이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | (원본에 효과가 없어 정해진 때가 없다) |
| 먼저 있어야 하는 것 | EMP-BZ-0001 |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-10 — `402 최사원` 등록 → 사용 해제 → 삭제 |
| ⚠ 메뉴 | **kalpa(상품 S1)에는 #1439 메뉴가 없다.** 이번 실행은 API로만 했다 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1439** 문서작성 > 04. 전자결재 > 결재선 예외처리 | 화면을 연다 | 회사의 예외 목록(등록일·사원명·사용여부·사유) |
| 2 | 〃 | 〃 | [등록] → 사원명 칸 돋보기 → 사원 선택 창에서 `최사원` → 사용 ✓, 사유 입력 → [저장] | 한 줄 |
| 3 | 〃 | 〃 | 사용 해제 → [저장] | 사용여부 꺼짐 |
| 4 | 〃 | 〃 | 줄 선택 → [삭제] → 확인 | 지워짐 |

- 툴바의 "담당자명" 칸은 **조회에 쓰이지 않는다**(원본 `retrieve` L148-159는 회사 ID만 넘긴다). TOBE도 같다.

## DB에 남는 것

| 테이블 | 무엇 | 변화 |
|:---|:---|---|
| `emp30_appr_step_except` | 예외(회사 · 등록일 · 사원 · 사용여부 · 사유) | 단계 2 +1, 단계 4 -1 |

## 결과를 볼 수 있는 화면

- #1439뿐. 이 표를 읽는 다른 화면·SQL·DB 함수가 없다.

## 업무 규칙 · 주의

- **효과 없음 확인 방법**(2026-11-10): 원본 전체(`application/src/main`의 XML·Java)에서 `emp30_appr_step_except`·`emp30_person_id`를 찾으면 이 화면의 클래스·매퍼·모델뿐이다. DB 함수 본문(`pg_proc.prosrc`)에도 없다. TOBE도 이 화면의 API 말고는 읽지 않는다. 원본 화면은 2022-12~2023-02에 만들어졌고, asseterpdb 데이터는 KFS(28000)의 1줄(2026-10-20)뿐이다. 결재선 계산에 쓰려다 만 기능으로 보인다 — 쓰임새는 KFS에 물어볼 일이다.
- TOBE 목록은 원본 SQL과 같다(`yunhee compare` `emp30_appr_step_except.selectByCompanyId`).
- 작은 차이 1 — **사원 없이 저장하면 500 "서버 내부 오류"**(`emp30_person_id` NOT NULL 위반). 원본도 검사 없이 DB 오류가 나지만, TOBE는 다른 화면에서 NOT NULL 칸을 미리 막아 안내한다(변환 가이드 "DB 오류" 원칙). `EmpApprStepExceptService.save`에 필수 검사가 없다.
- 작은 차이 2 — **다른 회사 사원도 등록된다.** 저장 API가 사원이 로그인 회사 사람인지 보지 않는다(실행: kfstest 사원 `29053`이 kalpa 예외에 들어갔다가 지움). 화면은 자기 회사 사원 선택 창만 쓰므로 화면으로는 안 생긴다.
- 클래스 대조(`yunhee analysis ui --tobe`): 버튼 4/4 · 이벤트 8/8 · 그리드 1/1. 사원 선택 창(`Emp00_Lookup_SelectSingle`)의 E1 [전체]·E3 [공통]은 `openAll`·`openPublic`으로 열 때만 생기는 버튼이라 이 화면과 상관없다(TOBE 부품에는 아직 없음 — 그 방식을 쓰는 APR·BIZ·TDM 화면 때 확인).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0011
needs: [EMP-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 2
    api: PUT /api/v1/emp/appr-step-excepts
    body: [{ regDate: "2026-11-10", personId: "<402>", useYn: "true", note: "시험: 결재선 예외" }]
    expect: { table: emp30_appr_step_except, delta: +1 }
  - no: 3
    api: PUT /api/v1/emp/appr-step-excepts
    body: [{ apprStepExceptId: "<…>", regDate: "2026-11-10", personId: "<402>", useYn: "false" }]
  - api: PUT /api/v1/emp/appr-step-excepts
    body: [{ regDate: "2026-11-10", useYn: "true" }]
    expect: { http: 400 }   # 지금은 500 (⚠)
  - api: PUT /api/v1/emp/appr-step-excepts
    body: [{ regDate: "2026-11-10", personId: "<다른 회사 사원>" }]
    expect: { http: 404 }   # 지금은 200 (⚠)
  - no: 4
    api: DELETE /api/v1/emp/appr-step-excepts
    body: ["<…>"]
    expect: { table: emp30_appr_step_except, delta: -1 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp30_Tab_ApprStepExcept`(#1439) — E1 Enter·E2 [조회] `retrieve` L148-159 · E3 [등록] · E4 [저장] `update` L162-165 · E5 [삭제] `deleteChk` L178-196 → E7 · E6 사원 돋보기 `openLookupEmpInfo` L133-145
- AS-IS 서버: `emp.Emp30_ApprStepExcept.selectByCompanyId`·`update`·`delete`
- TOBE: `GET·PUT·DELETE /api/v1/emp/appr-step-excepts`(`EmpApprStepExceptService`)
- TOBE 상태(2026-11-10): **실행(API)** — 등록·해제·삭제·목록 비교, 필수·회사 검사 없음 확인. 화면 눈 확인은 `대기`.
</details>
