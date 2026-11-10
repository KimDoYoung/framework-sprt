# SYS-BZ-0016 KFS 관리자(Admin) 사용자 목록을 관리한다

> **한 줄 요약** — #1197은 KFS 관리자 **연락처 목록**(`sys80_admin_user_list`: 휴대폰·성명·비고)을 등록·수정·삭제하는 화면이다. **로그인 계정이 아니다.** KFS 관리자의 로그인 계정은 `sys02_user`의 회사 0 행(지금 2개)이고, 고객사 관리자 계정과 같은 곳에서 만든다(SYS-BZ-0002). 원본 소스에서 이 목록을 읽는 다른 화면·SQL·DB 함수는 없다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` (고객사 관리자는 막힘 — "접근 권한이 없습니다", 확인) |
| 언제 | KFS 담당자가 바뀔 때 |
| 먼저 있어야 하는 것 | — |
| 실제 실행 | 2026-11-10, **시험 행을 넣고 고친 뒤 지움**(KFS 실제 목록 3명은 그대로) |

## 따라 하기

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1197** 관리자 > 02. 시스템관리 > Admin 사용자 관리 | (열면 조회) | 휴대폰·성명·비고 목록(3명) |
| 2 | 〃 | [등록] → 휴대폰 `010-0000-0000`, 성명 `업무분석 시험`, 비고 `시험 행` → [저장] | 4명 |
| 3 | 〃 | 그 행의 휴대폰을 `010-0000-0001`로 → [저장] | 바뀐 번호 |
| 4 | 〃 | 그 행 체크 → [삭제] | 3명 |

## DB에 남는 것 (이번 실행: 넣었다가 지움 → 최종 0)

| 테이블 | 무엇 | 단계 | 행 |
|:---|:---|:---|---:|
| `sys80_admin_user_list` | KFS 관리자 연락처(휴대폰 13자·성명 20자·비고 200자, 임시비밀번호 6자 칸) | 추가(2), 수정(3), 삭제(4) | +1 → 0 |

## 업무 규칙 · 주의

- **로그인과 무관하다.** 이 목록에 넣어도 로그인할 수 없고, 지워도 로그인은 그대로다. KFS 관리자 로그인 계정은 `sys02_user`(회사 0)다.
- `sys80_temp_password`(임시 비밀번호) 칸이 있지만 원본 화면·서버 어디에서도 쓰지 않는다(지금 데이터 3행 모두 빈칸). TOBE도 이 칸을 화면에 내리지 않는다.
- 입력 검사가 없다(원본도 `UpdateDataModel`만). 빈 성명도 저장된다.
- **TOBE 문제 — 길이 초과가 500 오류가 된다.** 휴대폰에 13자를 넘게 넣으면(`010-0000-0000-0000`) "서버 내부 오류가 발생했습니다"(HTTP 500)가 뜬다(**확인**, 저장 안 됨). DB 열 길이(`varchar(13)`) 오류가 그대로 올라온다. 다른 TOBE 화면은 이런 DB 오류를 미리 막아 업무 메시지로 바꾼다(05 §6 "DB 오류" — 예: `SysMenuService.checkMenu`). 성명 20자·비고 200자도 같을 것이다(시험 안 함).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0016
actor: { company: admin, user: admin, password: "1111" }
steps:
  - no: 2
    screen: 1197
    api: PUT /api/v1/sys/admin-user-lists
    body: [{ adminUserListId: null, userPhone: "010-0000-0000", userName: "업무분석 시험", note: "시험 행" }]
  - no: 3
    api: PUT /api/v1/sys/admin-user-lists
    body: [{ adminUserListId: "{id}", userPhone: "010-0000-0001", userName: "업무분석 시험", note: "번호 수정" }]
  - no: 4
    api: DELETE /api/v1/sys/admin-user-lists
    body: ["{id}"]
reject:
  - { actor: { company: kalpa, user: admin }, api: GET /api/v1/sys/admin-user-lists, status: 403 }
  - { api: PUT /api/v1/sys/admin-user-lists, body: { userPhone: "010-0000-0000-0000" }, status: 500 }   # 지금 동작. 업무 메시지(400)로 바꾸면 이 줄도 고친다
expect_after_cleanup:
  - { table: sys80_admin_user_list, where: "sys80_admin_user_list_id = :id", rows: 0 }
```
</details>

<details>
<summary>근거 (yunhee · AS-IS · TOBE)</summary>

- 조사: `yunhee trace-pair '#1197'`(서비스 3개 모두 API 짝), `yunhee trace-crud --screen '#1197'`·`--table sys80_admin_user_list`(쓰는 화면 1개), `yunhee grep sys80_`(원본 서버·클라이언트·DB 함수 — 자기 화면·매퍼 외 사용처 없음), `yunhee screen-desc 1197 --section tobe`, `yunhee api --track --log`. trace-crud의 "TOBE -"는 오탐 — TOBE 매퍼 `SysAdminUserListMapper`가 같은 테이블을 쓴다(trace-crud도 "다른 화면에 있음"이라고 함).
- AS-IS: `Sys80_Tab_AdminUserList`(#1197), 서버 `sys.Sys80_AdminUserList.selectByAll`·`update`·`delete`(`UpdateDataModel`)
- TOBE: `SysAdminUserListController` `GET·PUT·DELETE /api/v1/sys/admin-user-lists`(관리자 회사만), `AdminUserListRes`(임시 비밀번호 제외)
- TOBE 상태(2026-11-10): **실행** — 등록·수정·삭제, 고객사 관리자 403, 길이 초과 500 확인. 화면 눈 확인·자동 시험은 아직.
</details>
