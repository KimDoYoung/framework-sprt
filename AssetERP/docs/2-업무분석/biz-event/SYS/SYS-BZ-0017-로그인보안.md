# SYS-BZ-0017 로그인 보안(공인IP·Mac 주소)을 정한다

> **한 줄 요약** — 고객사가 "우리 사무실에서만 접속하게 해 달라"고 하면 KFS 관리자가 #1075에서 그 회사에 **허용 공인IP**(`sys29_login_secure`, 시작~종료일)를 등록하고 **로그인 보안**(`sys01_login_secure_yn`)을 켠다. 그러면 그 회사 주소로는 허용된 IP·기간에서만 로그인된다. #1442 Mac 주소 관리는 **지금은 쓰이지 않는다** — 원본의 Mac 주소 검사가 어디서도 불리지 않아 새 신청이 생기지 않는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` |
| 언제 | 고객 요청 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001 |
| 실제 실행 | kalpa(회사ID 202611109046432), 2026-11-10 — 켜고 막히는지·풀리는지 확인한 뒤 **원래대로 끔**(IP 0건) |

## 따라 하기 — 공인IP

| 단계 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|
| 1 | **#1075** 관리자 > 01. 고객관리 > 고객별 시스템정보 관리 → 고객 목록에서 칼파테크 선택 → 아래 **관리정보** 탭 그리드의 `보안로그인` 오른쪽 **돋보기(🔍) 아이콘**(열 제목 없음) → 공인IP 창(`Sys29_Lookup_PublicIpList`) | [등록] → 공인IP `203.0.113.10`(다른 곳의 IP), 시작일 `2026-01-01`, 종료일 `9999-12-31` → [저장] | 허용 IP 1건 |
| 2 | #1075 관리정보 탭 칼파테크 행 | `보안로그인` 체크 → [저장] | |
| 3 | `kalpa` 주소로 로그인 | | **"허용되지않은 접근입니다. 관리자에게 문의해주세요"** (확인) |
| 4 | 공인IP 창 | 실제 접속 IP(`172.18.0.1`, 개발 환경의 docker 게이트웨이) 등록 → [저장] | 로그인 **됨** (확인) |
| 5 | 공인IP 창 | 그 IP의 종료일을 어제(`2026-11-09`)로 → [저장] | 다시 **막힘** — 기간 밖 IP는 허용하지 않음 (확인) |
| 6 | (정리) | 로그인 보안 끔 → 시험 IP 2건 삭제 | 칼파테크 로그인 정상 |

※ 순서 주의: 로그인 보안을 켜기 전에 접속할 IP부터 등록한다. 거꾸로 하면 그 회사 사람이 아무도 로그인하지 못한다(KFS 관리자는 admin 주소로 들어와 풀 수 있다).

## Mac 주소 (#1442) — 지금은 쓰이지 않음

- 원래 흐름: 허가받지 않은 기기로 로그인하면 "허가받지 않은 기기로 접속이 시도되었습니다. 관리자에게 해당 기기를 승인요청하시겠습니까?" → 신청 창(`Sys27_Lookup_Request`)에서 사유 입력 → `sys27_login_manage` 신청 행 → KFS가 #1442 관리자 > 02. 시스템관리 > 로그인 Mac 주소 관리에서 승인여부 체크.
- **원본 `LoginPage.checkMacAddress()`가 `@SuppressWarnings("unused")`이고 아무 데서도 부르지 않는다.** 그래서 신청 행이 새로 생기지 않는다. DB에는 2023-02-21 신청 1건(승인됨)뿐이다.
- #1442는 남은 신청을 조회하고 승인여부를 바꾸는 데만 쓸 수 있다(TOBE `PUT /login-manages/{id}/confirm`). [감추기]는 원본 매퍼에 `updateCollapse` SQL이 없어 원본에서도 동작하지 않는다 → TOBE는 "지원하지 않습니다" 안내(`Sys27_Tab_LoginManage.tsx` L71-75). 이번에는 실행하지 않았다.

## DB에 남는 것 (이번 실행: 켰다가 되돌림 → 최종 변화 없음)

| 테이블 | 무엇 | 단계 | 행 |
|:---|:---|:---|---:|
| `sys29_login_secure` | 회사별 허용 공인IP·기간 | 추가(1·4), 수정(5), 삭제(6) | +2 → 0 |
| `sys01_company` | `sys01_login_secure_yn` 로그인 보안 | 수정(2) → 되돌림(6) | 1 |
| `sys27_login_manage` | Mac 주소 신청 | (쓰이지 않음) | 0 |

## ⚠ 보안 빈틈 — admin 주소로 돌아가면 IP 제한이 걸리지 않는다

- TOBE `AuthService.login` L82-89는 **접속한 주소의 회사(`tenant.code()`)** 로 로그인 보안을 검사한다. 그런데 **admin 주소에서는 본문의 회사코드로 어느 회사에든 로그인할 수 있다**(`resolveCompanyCode` L191-199 — admin 테넌트면 `req.companyCode()`를 쓴다).
- 그래서 칼파테크 보안을 켜 두어도 `admin.localhost`에서 회사코드 `kalpa`로 로그인하면 **admin의 정책만 검사되고 통과한다**(이번 실행 3단계 전에 확인: 서버 로그 `findLoginPolicy(companyCode=admin)`).
- 원본도 같다. 로그인 화면을 연 서브도메인 회사로 검사하고(L189-203), admin 로그인 화면에는 회사를 고르는 칸이 있다(L218-241).
- 바꾸려면: 검사를 `resolveCompanyCode`로 정한 회사의 정책으로 하면 된다(한 줄 수준). 원본과 달라지므로 사용자 결정 — `4-재설계`(보안: JWT 전환)에서 다룰 항목.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0017
actor: { company: admin, user: admin, password: "1111" }
steps:
  - no: 1
    api: PUT /api/v1/sys/companies/{cid}/login-secures
    body: [{ loginSecureId: null, startDate: "2026-01-01", closeDate: "9999-12-31", publicIp: "203.0.113.10", note: "다른 IP" }]
  - no: 2
    api: PUT /api/v1/sys/companies/{cid}/manage      # GET …/manage 결과에서 loginSecureYn만 "true"
  - no: 3
    actor: { company: kalpa, tenant: kalpa }          # 반드시 kalpa 주소(테넌트)로
    api: POST /api/auth/login
    body: { username: admin, password: "1111", companyCode: kalpa }
    expect: { status: 401, code: IP_NOT_ALLOWED }
  - no: 4
    api: PUT /api/v1/sys/companies/{cid}/login-secures   # publicIp = 접속 IP → 3을 다시 하면 200
  - no: 5
    api: PUT /api/v1/sys/companies/{cid}/login-secures   # closeDate = 어제 → 3을 다시 하면 401
  - no: 6
    api: [PUT …/manage (loginSecureYn "false"), DELETE /api/v1/sys/companies/{cid}/login-secures]
```
</details>

<details>
<summary>근거 (yunhee · AS-IS · TOBE)</summary>

- 조사: `yunhee trace-pair '#1442'`(서비스 4개 중 `updateCollapse`만 API 없음), `yunhee trace-crud --screen '#1442'`·`--table sys27_login_manage`(쓰는 곳: LoginPage·#1442), `yunhee screen-desc 1442 --section tobe,popup`, `yunhee grep`(원본에서 `checkMacAddress()` 호출 0건), `yunhee api --track`, `yunhee log req POST /api/auth/login --trace`(로그인 때 검사한 회사·IP).
- yunhee 주의: `yunhee api -c kalpa`는 admin 주소로 접속한다 → 회사 주소 기준 검사를 보려면 `-t kalpa`. 또 로그인에 성공하면 세션을 다시 쓰므로 로그인 검사를 다시 보려면 `POST /api/auth/login`을 직접 부른다.
- AS-IS: `LoginPage` L189-203(`sys.Sys29_LoginSecure.checkLoginSecure`), L610-655(`checkMacAddress`, 호출 없음), `Sys29_Lookup_PublicIpList`(#1075 공인IP 창), `Sys27_Tab_LoginManage`(#1442), `Sys27_Lookup_Request`(신청 창)
- TOBE: `AuthService.login` L82-89(`AccountMapper.findLoginPolicy`·`countAllowedIp`, `ErrorCode.IP_NOT_ALLOWED`), `resolveCompanyCode` L191-199, `/api/v1/sys/companies/{id}/login-secures`(`GET·PUT·DELETE`), `/api/v1/sys/companies/{id}/manage`, `/api/v1/sys/login-manages`
- TOBE 상태(2026-11-10): **실행** — 공인IP 차단·허용·기간 만료 차단을 칼파테크 주소로 확인하고 되돌림. Mac 주소는 원본에서 쓰이지 않음. 화면 눈 확인·자동 시험은 아직.
</details>
