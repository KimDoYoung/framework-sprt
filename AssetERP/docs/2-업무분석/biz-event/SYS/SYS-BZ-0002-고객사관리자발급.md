# SYS-BZ-0002 고객사 관리자 계정을 발급한다

> **한 줄 요약** — 칼파테크를 고객사로 등록했지만(0001) 아직 로그인할 계정이 없다. KFS 관리자가 칼파테크의 **관리자 계정 `admin`/`1111`**을 만들어 준다. 이 계정으로 칼파테크 담당자가 처음 로그인한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 — 로그인 `admin/admin/1111` |
| 언제 | 고객사 등록 직후 한 번, 이후 고객 담당자가 바뀔 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001 (회사 행). 사용여부를 켜 두어야 실제 로그인된다 |
| 다음 이벤트 | SYS-BZ-0003 메뉴 열어 주기 ([목록](../README.md)) |
| 가상 회사 기준값 | 사용자명 `관리자`, ID `admin`, PW `1111`, 전체권한 체크 (kalpa·kova·igo 같은 값) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 `admin/admin/1111` | **#1075** 관리자 > 01. 고객관리 > 고객별 시스템정보 관리 | 고객 목록에서 **칼파테크 행을 클릭** → 아래 **[고객별 관리자]** 탭 | 행을 클릭해야 탭이 그 회사로 조회된다. 처음엔 빈 그리드 |
| 2 | 〃 | #1075 [고객별 관리자] 탭 | [등록] | 새 행이 추가된다. **전체권한이 이미 체크**돼 있다 |
| 3 | 〃 | 〃 | 사용자명 `관리자`, ID `admin`, PW `1111`, 이메일·휴대폰·사무실번호·기타정보(선택) 입력 | PW 칸은 글자 그대로 보인다(화면에는 복호화해서 보여 준다) |
| 4 | 〃 | 〃 | [저장] | 그리드가 저장된 값으로 다시 채워진다 |
| 5 | 〃 (선택) | 〃 | 전체권한을 **끄고** "권한설정" 칸 클릭 → 메뉴 체크 창 | 이 관리자에게는 체크한 메뉴만 보인다. 가상 회사는 전체권한을 켜 둔다 |

※ 아직 칼파테크에 열린 메뉴가 없으므로(0003 전) 이 계정으로 로그인하면 메뉴는 비어 있다.

## DB에 남는 것

| 테이블 | 무엇 | 추가/수정 | 행 |
|:---|:---|:---|---:|
| `sys02_user` | 고객사 관리자 계정 | 추가(단계 4) | 1 |

- 비밀번호는 `sys02_passwd`에 **암호화(`to_encrypts`)** 되어 저장된다. 화면의 PW는 `to_decrypts`로 푼 값이다.
- 전체권한 `sys02_admin_yn`: `true`면 모든 메뉴, `false`면 `sys82_admin_user_menu`에 체크한 메뉴만(단계 5).
- 이 관리자는 `sys02_user` 한 곳에만 있다. 직원(`emp01`)이 아니다 — 직원 로그인은 EMP 이벤트 뒤 `kalpa/사번/1111`.

## 결과를 볼 수 있는 화면

- #1075 [고객별 관리자] 탭(방금 만든 행), 로그인 화면: `kalpa.localhost:8082/AssetERP`에서 `admin`/`1111` → 로그인된다(사용여부가 켜져 있어야 함).
- #1140 로그인내역(로그인 뒤 기록), #1198 Admin 로그인내역은 KFS Admin 용이다.

## 업무 규칙 · 주의

- **사용자명은 필수.** 비우면 "사용자명을 입력하세요." (AS-IS는 DB 오류 원문 노출)
- **같은 회사 안에서 ID가 겹치면 "이미 사용 중인 ID입니다: …"** (TOBE에서 추가한 검사 — 로그인이 회사 + ID로 찾기 때문. AS-IS는 막지 않았다)
- 비밀번호를 비워 저장하면 기존 비밀번호를 건드리지 않는다.
- **KFS 관리자만** 할 수 있다(고객사 관리자는 403).
- 회사를 지울 때 이 행도 같이 지워야 한다 — `sys02_user`는 `*_company_id`(`sys02_company_id`)로 찾는다.

## 다음 이벤트

SYS-BZ-0003 메뉴 열어 주기. 0003까지 해야 `kalpa/admin/1111`로 로그인했을 때 메뉴가 보인다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0002
needs: [SYS-BZ-0001]
actor: { company: admin, user: admin, password: "1111" }
steps:
  - no: 4
    screen: 1075 [고객별 관리자]
    action: '[등록] → 값 입력 → [저장]'
    api: PUT /api/v1/sys/companies/{companyId}/users
    body: [ { korNm: "관리자", loginId: admin, decPasswd: "1111", email: "admin@kalpa.test",
              tel1: "010-0000-0000", tel2: "02-000-0000", note: "가상회사", adminYn: "true" } ]
expect:
  - { table: sys02_user, op: insert, rows: 1, where: "sys02_company_id = :cid and sys02_login_id = 'admin'" }
  - { column: sys02_passwd, not_equal: "1111" }       # 암호화 저장
  - { api: "GET /api/v1/sys/companies/{companyId}/users", decPasswd: "1111" }
rules:
  - 사용자명 빈 값 → "사용자명을 입력하세요."
  - 같은 회사 ID 중복 → "이미 사용 중인 ID입니다"
  - 고객사 직원 계정은 호출 불가
test: backend/src/test/java/kr/co/kfs/asseterp/biz/scenario/SysBz0002ScenarioTest.java
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select sys02_user_id, sys02_login_id, sys02_kor_nm, sys02_admin_yn, to_decrypts(sys02_passwd) pw
  from sys02_user where sys02_company_id = :cid;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys02_Tab_User`(#1075 탭 "고객별 관리자", [조회]E1·[저장]E2·[등록]E3 `insertRow` L134-145 — 전체권한 기본 true·[삭제]E4), 권한 팝업 `Sys82_Lookup_UserMenu`
- AS-IS 서버: `sys.Sys02_User.update` L394(비밀번호 `encryptsPasswd`), `selectByName` L371, `delete` L412
- TOBE: `SysUserController` `GET·PUT·DELETE /api/v1/sys/companies/{companyId}/users`, `SysUserService.updateUsers`
- TOBE 상태(2026-11-09): **OK** — 시나리오 시험 3개 통과(`yunhee run "gradle test --tests '*SysBz0002*'"`).
- ⚠ 이 세션에서는 API 실행 대신 시험으로 확인했다(로컬 DB의 KFS `admin` 비밀번호가 초기화 상태라 `yunhee api` 로그인 불가). 화면 눈 확인은 `대기(일괄)`.
</details>
