# AS-IS AssetERP DB 연동 계획 (`app_user` 대체)

> **대상**: `security-test` (및 이후 TOBE 백엔드)  
> **기준 일자**: 2026-09-30  
> **기준 데이터**: 로컬 PostgreSQL `asseterpdb` (운영 AssetERP DB 사본, public 스키마 670개 테이블)  
> **관련 문서**: `docs/security-설계.md`, `docs/log-설계.md`, `docs/websocket-설계.md`

---

## 1. 배경

`security-test`는 인증·세션 로직을 빠르게 검증하려고 전용 테이블 `app_user`(2건: admin, user1)를 만들어 사용했다.
그런데 같은 DB(`asseterpdb`)에 이미 **AS-IS AssetERP의 실제 사용자·회사·조직·권한 데이터**가 복사되어 있다. 처음부터 이것을 썼어야 했다.

- **유효한 것**: 지금까지 검증한 **로직**은 그대로 유효하다. JWT 이중 쿠키, jti 기반 멀티 로그인 차단, Refresh Token 교체·재사용 탐지, 로그인 실패 잠금, 감사 로그, WebSocket이 여기에 해당한다.
- **바꿔야 하는 것**: **데이터 소스**(사용자 조회, 비밀번호, 권한, 회사·부서)를 AS-IS 테이블로 바꿔야 한다.
- **드러나지 않았던 요구사항**: `app_user`가 단순해서 보이지 않던 요구사항이 AS-IS 데이터에는 있다. 한 사람이 역할을 여러 개 가지고, 회사별 역할이 있고, 겸직과 퇴직이 있다. 회사 단위 메시지(`websocket-설계.md` 8장)도 이 데이터가 있어야 제대로 설계할 수 있다.

---

## 2. AS-IS 핵심 테이블

행 수는 로컬 사본 기준이다(2026-09-30).

| 영역 | 테이블 | 행 수 | 내용 |
|:---|:---|---:|:---|
| 회사 | `sys01_company` | 21 (사용 12) | 회사(고객사). `sys01_company_id`, `sys01_company_nm`, `sys01_use_yn`, `sys01_login_secure_yn`(공인IP 보안로그인) |
| 사원 | `emp01_person` | 801 | 사원 기본정보. `emp01_person_id`, `emp01_company_id`, `emp01_emp_no`(사번), `emp01_kor_nm`, `emp01_email_addr`, **`emp01_lock_yn`**(잠금) |
| 사원 | `emp02_others` | 884 | 부가 개인정보 (영문명, 생일 등) |
| 발령 | `emp03_trans` | 1,384 | 발령 이력. `emp03_trans_cd`(100 채용/200 이동/800 겸직/900 퇴직), `emp03_org_code_id`(부서), `emp03_pos_cd`(직위), `emp03_title_cd`(직책), `emp03_org_head_yn`(조직장), `emp03_director_yn`(임원) |
| 비밀번호 | `sys25_password` | 125 | `sys25_person_id`, `sys25_seq`(이력 순번), `sys25_pwd` — 해시가 아니라 **DB 함수 `to_encrypts`/`TO_DECRYPTS`로 양방향 암호화**(AS-IS 소스로 확인, 7장) |
| 권한 | `sys04_role` | 259 | **회사별** 역할. `sys04_company_id`, `sys04_role_nm`, `sys04_admin_yn`, `sys04_default_role` |
| 권한 | `sys05_user_role` | 96 | 사원↔역할 (다대다). `sys05_user_id` = **`emp01_person_id`** (96건 중 94건 일치 확인), `sys05_auth_org_id`(권한 조직) |
| 권한 | `sys07_role_menu`, `sys06_menu` | | 역할별 메뉴 권한 |
| 관리자 | `sys02_user` | 24 | 회사별 시스템 관리자 계정 (`sys02_login_id`, `sys02_passwd`, `sys02_admin_yn`). 사원과 별도 |
| 조직 | `org01_code` / `org02_info` | 536 / 553 | 조직코드(회사별) / 조직정보(명칭, 상위조직 `org02_parent_code_id`, 변경이력) |
| 코드 | `sys08_code_kind` / `sys09_code` | | 공통코드. `EmpPosCode`(직위: 100 사장, 400 부장, 650 사원 …), `EmpTitleCode`(직책: 100 대표이사, 240 팀장 …) |
| 로그인 기록 | `sys26_login` | 55,947 | 로그인 이력 (일시, IP, 모드 P/M, OS, 브라우저) |
| 접속 현황 | `sys28_login_real_time` | 315 | 실시간 로그인 정보 (사원, 접속시간, IP, 세션ID) |
| 공지 | `bbs02_notice` | 94 | 공지사항. `bbs02_company_id`, `bbs02_public_yn`(전체공지), `bbs02_public_company_yn`(전체 고객사 공개) |
| 공지 대상 | `bbs03_target` / `bbs04_target_company` | 39 / 99 | 개별공지 대상 **사원** / 대상 **회사** |
| 알림 권한 | `emp25_mypage_notice` | 15 | MyPage 알림 권한 (내부통제·상신문서 알림 여부) |

참고: 회사별 사원 수는 최대 599명이고, 그다음은 69명과 43명이다. 퇴직(최근 발령 900) 21명, 퇴직이 아니면서 비밀번호가 있는 사원 91명이다.

---

## 3. `app_user` → AS-IS 매핑

| `app_user` 컬럼 | 현재 쓰임 | AS-IS 대응 | 비고 |
|:---|:---|:---|:---|
| `user_id` | JWT `sub`, Redis 키 `security:user:jti:{userId}` | `emp01_person.emp01_person_id` | numeric. Redis 키 체계는 그대로 쓸 수 있다 |
| `username` | 로그인 ID, 감사 로그 행위자, STOMP Principal | **확인 필요** (5장 Q1) | 사번은 회사 간 중복 9건, 이메일은 중복 4건이다. 단독으로는 유일하지 않다 |
| `password` | 평문 비교 (`NoOpPasswordEncoder`) | `sys25_password.sys25_pwd` (최신 `sys25_seq`) | 해시 방식 확인 필요 (Q2). 비밀번호가 없는 사원 709명 (Q3) |
| `full_name` | 화면·JWT `name` | `emp01_person.emp01_kor_nm` | |
| `company_id` | JWT `company_id` | `emp01_person.emp01_company_id` → `sys01_company` | 회사 `sys01_use_yn`이 사용 중이 아니면 로그인을 거부해야 한다 |
| (없음, 설정값 `D101`) | JWT `dept_id` | 최신 유효 발령 `emp03_trans.emp03_org_code_id` → `org01_code`/`org02_info` | 겸직(800)이면 부서가 여러 개다 (Q5) |
| `role` (단일 문자열) | Spring 권한 `ROLE_ADMIN`/`ROLE_USER` | `sys05_user_role` ⋈ `sys04_role` (다대다, 회사별) | 역할명 → Spring 권한 규칙 필요 (Q6) |
| `lock_yn` (`Y`/`N`) | 로그인 실패 잠금 | `emp01_person.emp01_lock_yn` | **값이 `'true'`/`'false'` 문자열**(현재 false 8, null 793)이다. `'Y'` 비교 코드를 고쳐야 한다 |
| `created_at` | - | `emp03_trans`(채용 100)의 `emp03_trans_date` | |
| (없음) | - | 퇴직 여부: 최신 발령 `emp03_trans_cd = '900'` | 퇴직자 로그인 차단 (Q4) |

---

## 4. 코드 영향 범위

| 영역 | 파일 | 변경 내용 |
|:---|:---|:---|
| 사용자 조회 | `biz/user/mapper/AppUserMapper.java`, `mapper/AppUserMapper.xml`, `biz/user/entity/AppUser.java` | `emp01_person` 중심 조회로 교체한다(비밀번호·역할·부서 조인). 목표 명명은 TOBE 규칙에 맞춰 `PersonMapper` 등으로 한다 |
| 인증 | `biz/auth/service/AuthService.java`, `biz/auth/dto/UserPrincipal.java` | 역할 목록, 실제 부서, 퇴직·회사 사용 여부 검사를 추가하고 `default-dept-id` 설정을 제거한다 |
| 비밀번호 | `common/config/SecurityConfig.java` | `NoOpPasswordEncoder`를 AS-IS 해시와 호환되는 인코더로 바꾼다 (`DelegatingPasswordEncoder` + 레거시 인코더, 로그인 시 BCrypt로 점진 전환) |
| 잠금 | `biz/auth/service/LoginLockService.java`, `UserService.updateUserUnlock` | `emp01_lock_yn` `'true'`/`'false'`로 바꾼다. 잠금 해제 권한도 AS-IS 역할 기준으로 바꾼다 |
| 권한 | `@PreAuthorize("hasRole('ADMIN')")` (User/Audit/Push 컨트롤러) | `sys04_admin_yn` 또는 역할 매핑 규칙에 따른다 (Q6) |
| 감사 | `biz/audit/*` | 행위자 식별자(username)를 결정해야 한다(Q1). `sys26_login`과의 관계를 정리한다 (Q7) |
| 접속 현황 | `biz/push/service/PresenceService.java` | Redis presence와 `sys28_login_real_time`의 관계를 정리한다 (Q7) |
| WebSocket | `common/websocket/dto/WsUser.java` | `companyId`, 부서, 역할을 추가한다 (`websocket-설계.md` 8장) |
| 화면 | `LoginPage.tsx`, `UserLockCard.tsx` | 로그인 ID 방식(회사 선택 포함 여부)을 반영하고 잠금 관리 목록을 회사별로 바꾼다 |
| 테스트 | `AuthServiceTest` 등 | `AppUser` 픽스처를 AS-IS 구조로 바꾼다 |

`app_user` 테이블은 전환이 끝나면 삭제한다. `sys71_security_audit_log`는 새로 만든 테이블이지만 AS-IS 명명 규칙(`sys` 접두)에 맞춰 두었으므로 유지한다.

---

## 5. 확인 필요 사항

AS-IS 소스나 운영 담당자에게 확인해야 한다. 데이터만으로는 확정하지 않았다.

| # | 질문 | 데이터에서 본 사실 |
|:--|:---|:---|
| Q1 | 사원의 **로그인 ID**는 무엇인가? (사번? 이메일? 회사 선택 + 사번?) → **해결: 서브도메인(회사) + 사번** (7장) | `emp01_person`에 로그인ID 컬럼이 없다. 사번은 회사 간 중복 9건, 이메일은 중복 4건 |
| Q2 | `sys25_pwd` 해시 알고리즘과 salt 여부 → **해결: 해시 아님, `TO_DECRYPTS` 후 평문 비교** | 전부 32자리 16진수 (MD5 계열로 추정) |
| Q3 | 비밀번호가 없는 사원 709명의 의미 (사본에서 제외? 로그인 미사용?) | 사원 801명 중 비밀번호 보유 92명 |
| Q4 | 퇴직 판단 기준 (최신 발령 900? 별도 플래그?) → **해결: 오늘 기준 최신 발령 900** (`checkRetire`) | 최신 발령이 900인 사원 21명 |
| Q5 | 겸직(800) 시 대표 부서 | 겸직 발령 9건 |
| Q6 | AS-IS 역할 → TOBE 권한 매핑 규칙 | 역할 259개(회사별), `sys04_admin_yn=true`인 "AssetERP 관리자" 등 |
| Q7 | `sys26_login`/`sys28_login_real_time`을 TOBE에서도 기록할지 → **`sys26_login`은 기록하도록 구현** (sys28은 미정) | TOBE는 감사 로그(`sys71`)와 Redis presence로 대체 중 |
| Q8 | `sys02_user`(회사별 관리자 계정)의 로그인 경로 → **해결: 사원이 없으면 `sys02_user`로 로그인** (status 20) | 사원과 별도 계정(`admin`, `subAdmin` 등) |

---

## 6. 전환 순서

1. **Q1·Q2 확인**: 로그인 ID와 비밀번호 검증이 정해져야 로그인이 가능하다.
2. **조회 계층 교체**: `emp01_person` 기준 사용자 조회와 역할·부서 조인. 읽기 전용이다.
3. **인증 전환**: 레거시 비밀번호 인코더, 퇴직·회사 사용 여부 검사, 역할 매핑(Q6).
4. **잠금 전환**: `emp01_lock_yn`(`'true'`/`'false'`)에 기록한다. AS-IS와 같은 컬럼이므로 기존 AssetERP 화면과 잠금 상태가 공유된다.
5. **WebSocket 확장**: `WsUser`에 회사, 부서, 역할을 추가하고 회사 단위 메시지를 만든다(`websocket-설계.md` 8장).
6. **`app_user` 삭제**와 문서 갱신 (`security-설계.md` 4.1).

주의: 로컬 `asseterpdb`는 운영 데이터 사본이라 **실제 개인정보**(이름, 이메일, 연락처, 주민번호 컬럼 등)가 들어 있다. 테스트 로그와 스크린샷에 원문이 남지 않게 하고, 쓰기(잠금 등) 테스트는 테스트 전용 사원으로 한다.

---

## 7. AS-IS 로그인 분석과 구현 결과 (2026-09-30)

AS-IS 로그인 소스(`LoginPage.java`, `Sys02_User.getLoginInfo`, `sys01_company`/`sys02_user`/`sys25_password` 매퍼)를 확인하고 `security-test`를 AS-IS 테이블로 전환했다. `app_user`는 코드에서 제거했다. **테이블 DROP은 아직 하지 않았다.**

### 7.1 AS-IS 서브도메인 로그인

- 접속 URL이 `{sys01_loc_nm}.도메인`이다 (예: `kfstest.localhost:5151`). **브라우저(GWT)가** URL에서 첫 라벨을 떼어 회사 코드로 쓴다 (`LoginPage` 생성자, `substring(0, indexOf("."))`).
- `admin`, `admindev`, `admindr`, `extadmin`은 `admin`으로 정규화한다. 이 경우 로그인 창에 **회사 선택**(`Sys01_Lookup_SelectSingle`)이 나타나고, 로그인할 때 회사 코드를 선택한 회사로 바꿔 보낸다.
- 서버(`getLoginInfo`)는 클라이언트가 보낸 `companyCode`를 그대로 믿는다. 순서: 퇴사 확인(900) → 사원(`emp01_emp_no` + `sys01_loc_nm`) → 잠금(`emp01_lock_yn`) → 비밀번호 없음·초기화(99) → 90일 경과(98) → 비밀번호 또는 회사 비상 비밀번호 비교(10/2) → 사원이 없으면 `sys02_user`(20). 결과는 모두 `sys26_login`에 남긴다.
- **실패 횟수는 DB에 없다.** 브라우저 변수(`passWordCnt`)로 세고, 5회가 되면 브라우저가 `userLock`을 호출해 `emp01_lock_yn='true'`로 만든다. 새로고침하면 횟수는 0으로 돌아간다. 따라서 잠금용 컬럼을 새로 만들 필요가 없다.

### 7.2 TOBE(security-test) 구현

| 항목 | 구현 |
|:---|:---|
| 회사 판별 | **서버가** Host의 첫 라벨로 판별한다 (`common/tenant/TenantResolver`, `TenantFilter`). 서브도메인이 없는 `localhost`/IP는 `asseterp.tenant.default-code`(admin). 등록되지 않았거나 사용 중지된 회사는 `/api/**`에서 `TENANT_NOT_FOUND`를 반환한다 |
| 프록시 | Vite 프록시 `xfwd: true` + `server.forward-headers-strategy=framework` → `X-Forwarded-Host`로 판별한다 |
| 로그인 화면 | `GET /api/public/tenant`로 회사명을 표시하고, 무효한 회사면 "유효하지 않은 고객정보"를 띄운다. admin이면 `GET /api/public/companies`로 회사 선택을 표시한다 |
| 회사 코드 신뢰 | 요청의 `companyCode`는 **admin 테넌트일 때만** 쓴다. 일반 회사 서브도메인에서는 무시한다 (AS-IS의 조작 가능성 제거) |
| 계정 | `AccountMapper`: 사원(`emp01_person` + 최신 `sys25_password` + 오늘 기준 최신 `emp03_trans`) → 없거나 겸직(800)이면 `sys02_user`. 퇴직(900)은 `RETIRED_EMPLOYEE` |
| 세션 ID | 사원 = `emp01_person_id`, 회사관리자 = `-sys02_user_id`. 두 시퀀스가 겹치는 값(1)이 있어 음수로 구분한다 (`LoginAccount.sessionUserId`) |
| 사용자 이름 | `{회사코드}:{로그인ID}` (예: `kfstest:217`). 사번이 회사마다 겹치므로 감사 로그와 WebSocket 사용자 라우팅에 쓴다 |
| 권한 | 사원 `ROLE_USER`, 회사관리자 `ROLE_ADMIN`, admin 회사 관리자는 `ROLE_SYSADMIN`을 추가로 받는다. `sys04/sys05` 역할 매핑(Q6)은 아직 하지 않았다 |
| 잠금 | 사원만 대상이다. 실패 횟수는 Redis에 세고(서버 측), 5회(`max-failures`)가 되면 `emp01_lock_yn='true'`. 회사관리자는 AS-IS처럼 잠그지 않는다 |
| 비밀번호 상태 | 없음·초기화, 90일 경과(`password-expire-days`) → `PASSWORD_CHANGE_REQUIRED`. 만료는 비밀번호가 맞은 뒤에 알린다 (AS-IS는 비밀번호 확인 전에 알려 계정 상태가 노출됨). 비밀번호 변경 화면은 범위 밖이다 |
| 토큰 | Access/Refresh에 `tenant`(로그인한 호스트), `company_code`, `company_id`(Long) 클레임을 넣는다. 요청 테넌트와 다르면 `TENANT_MISMATCH`. 쿠키는 host-only라 서브도메인끼리 자연히 분리된다 |
| 이력 | `sys26_login`에 AS-IS 상태코드(01/02/10/20/98/99)로 기록한다 (`LoginHistoryService`, 별도 트랜잭션) |
| 잠금 관리 | 관리자 회사의 사원만 조회·해제한다 (`emp01_lock_yn='false'`) |

### 7.3 검증 (2026-09-30)

- 단위 테스트 55건 통과 (`AuthServiceTest` 16, `TenantResolverTest` 4 등).
- curl로 확인: `kfstest`/`admindev`/`kalpa`/`localhost` 판별, `X-Forwarded-Host` 판별, 무효 회사 차단, admin 이외 회사 목록 차단, 사원 로그인 성공, 다른 서브도메인으로 옮긴 토큰 거부, admin에서 회사 선택 로그인, 일반 서브도메인의 `companyCode` 무시, 5회 실패 잠금 후 올바른 비밀번호 거부, `sys26_login` 기록.
- 테스트 사원(`kfstest:217`)에 임시 비밀번호 행을 넣어 확인한 뒤 행 삭제, 잠금·이력·Redis 키를 원상 복구했다.

### 7.4 남은 일

- `app_user` 테이블 DROP (확인 후).
- 역할 매핑(Q6), 실제 부서(Q5), 비상 비밀번호(`sys01_emgrcy_passwd`), 보안로그인 IP 검사(`sys01_login_secure_yn`), 비밀번호 변경 화면.
- 접속자 현황(presence)과 관리자 WebSocket 구독은 아직 회사 구분 없이 전체를 보여준다.
- `server.forward-headers-strategy=framework`는 X-Forwarded-* 헤더를 무조건 신뢰한다. 운영에서는 신뢰할 프록시 뒤에서만 쓴다.
