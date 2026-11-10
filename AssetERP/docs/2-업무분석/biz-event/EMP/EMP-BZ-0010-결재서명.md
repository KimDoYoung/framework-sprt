# EMP-BZ-0010 직원이 결재 서명을 등록한다

> **한 줄 요약** — 전자결재에서 결재하면 결재란에 서명 그림이 찍힌다. 직원이 **자기 서명 그림**을 #1501에 올리고 그중 **하나만 "사용"**으로 둔다. 결재에 한 번이라도 쓰인 서명은 지울 수 없다(기록이 그 서명을 가리키므로).

| 항목 | 내용 |
|:---|:---|
| 누가 | **직원 본인** — 예: `kalpa/401/Kalpa1234!`. 화면은 로그인한 사람의 서명만 보여 준다 |
| 언제 | 처음 한 번, 서명을 바꿀 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0001, SYS-BZ-0012(직원 비밀번호) |
| 다음 이벤트 | APR 결재(결재 때 "사용" 서명이 찍힘) |
| 실제 실행 | kalpa, 2026-11-10 — `401 김사원`으로 서명 2줄 등록 → 사용 바꾸기 → 삭제 (그림 올리기는 안 함) |
| ⚠ 메뉴 | **kalpa(상품 S1)에는 #1501 메뉴가 없다.** 이번 실행은 API로만 했다 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | **#1501** 문서작성 > 04. 전자결재 > 결재서명관리 | 화면을 연다 | 내 서명 목록(처음엔 없음) |
| 2 | 〃 | 〃 | [등록] → 비고 `정자 서명`, 사용 ✓ → [저장] | 한 줄 생김 |
| 3 | 〃 | 〃 | 그 줄의 올리기 아이콘 → 그림 파일 선택 | 파일을 고르자마자 올리고 저장한다(E1). "서명" 칸에 그림이 보인다. **저장 안 된 새 줄은 올릴 수 없다**(TOBE는 안내, 원본은 실패) |
| 4 | 〃 | 〃 | [등록] → `약식 서명`(사용 안 함) → [저장] | 두 줄 |
| 5 | 〃 | 〃 | `약식 서명`도 사용 ✓ → [저장] | "하나의 서명만 사용가능합니다. 사용여부체크를 확인해주세요" |
| 6 | 〃 | 〃 | `정자` 사용 해제 + `약식` 사용 ✓ 함께 [저장] | 저장 됨 |
| 7 | 〃 | 〃 | 줄 선택 → [삭제] → 확인 | 결재에 쓰인 서명이면 "사용중인 서명은 삭제가 불가능합니다", 아니면 지워짐 |

## DB에 남는 것

| 테이블 | 무엇 | 변화 |
|:---|:---|---|
| `emp60_sign` | 서명(사원 · 사용여부 · 비고) | 단계 2·4마다 +1, 단계 7 -1 |
| `sys10_file`·`sys11_relate_file` | 서명 그림 파일(부모 = 서명 ID, 종류 image) | 단계 3에서 +1씩 |
| (`apr04_appr_step.apr04_sign_id`) | 결재할 때 이 서명 ID가 남는다 | APR 이벤트 |

## 결과를 볼 수 있는 화면

- #1501, 전자결재 문서의 결재란(APR).

## 업무 규칙 · 주의

- "사용"은 **한 사람에 하나**: 화면에 보이는 줄 + DB에 있는 나머지 내 서명을 합쳐 센다(원본 `update` L162-213 → `emp60_sign.notSignIdList`). TOBE는 같은 검사를 **서버에서** 한다(`EmpSignService.save` L33-52).
- 삭제 검사 "결재에 쓰였는가"(`apr04_appr_step.signIdListChk`)는 원본은 화면에서만 부르지만, TOBE는 삭제 API에서도 다시 막는다(`EmpSignService.delete` L61-66).
- 본인 것만 다룬다: 다른 직원(`402`)으로 로그인하면 목록 0줄, 401의 서명 ID로 삭제를 보내도 0건(실행 확인).
- 확인 못 한 것: **서명 그림 올리기**(`data/samples`에 그림 파일이 없음 — 넣어 주시면 확인), **결재에 쓰인 서명 삭제 거부**(kalpa에 아직 결재가 없음 → APR 이벤트 뒤).
- 클래스 대조(`yunhee analysis ui --tobe`): 버튼 4/4 · 이벤트 7/7 · 그리드 1/1. 빠진 것 없음.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0010
needs: [EMP-BZ-0001, SYS-BZ-0012]
actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
steps:
  - no: 2,4
    api: PUT /api/v1/emp/signs
    body: [{ useYn: "true", note: "정자 서명" }, { useYn: "false", note: "약식 서명" }]
    expect: { table: emp60_sign, delta: +2 }
  - no: 5
    api: PUT /api/v1/emp/signs
    body: [{ signId: "<약식>", useYn: "true", note: "약식 서명" }]
    expect: { http: 400, message: "하나의 서명만 사용가능합니다. 사용여부체크를 확인해주세요" }
  - no: 6
    api: PUT /api/v1/emp/signs
    body: [{ signId: "<정자>", useYn: "false" }, { signId: "<약식>", useYn: "true" }]
  - api: POST /api/v1/emp/signs/used
    body: ["<정자>", "<약식>"]
    expect: { data: false }
  - no: 7
    api: DELETE /api/v1/emp/signs
    body: ["<정자>", "<약식>"]
    expect: { table: emp60_sign, delta: -2 }
  - actor: { user: "402" }
    api: DELETE /api/v1/emp/signs
    body: ["<401 서명>"]
    expect: { data: 0 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp60_Tab_Sign`(#1501) — [조회] E2 · [등록] E3 · [저장] E4 `update` L162-213 → `updateFinal` L215-227 · [삭제] E5 `deleteChk` L244-270 → E6 · 그림 올리기 E1(`fileUpdownForm`, `FileUpload?fileType=image&parentId={signId}`)
- AS-IS 서버: `emp.Emp60_Sign.selectByPersonId`·`notSignIdList`·`update`·`deleteChk` L48-63·`delete`
- TOBE: `GET·PUT·DELETE /api/v1/emp/signs`, `POST /api/v1/emp/signs/used`(`EmpSignService`), 그림 `POST /api/v1/sys/files`
- TOBE 상태(2026-11-10): **실행(API, 직원 401)** — 등록·사용 하나 검사·사용 바꾸기·사용 여부·삭제·다른 직원 차단. 그림·결재 사용 삭제 거부는 미확인. 화면 눈 확인은 `대기`.
</details>
