# security-test 프로젝트

## 구현
security-test.md의 요구사항을 반영하여 **security-test** 프로젝트(Spring Boot 3.4 + React 19 + Ant Design 5)를
  생성하고 실제 동작 검증까지 완료했습니다.
  ──────
  ### 1. 프로젝트 디렉토리 구조

    security-test/
    ├── backend/                                   # Spring Boot 3.4.3 (Java 21, WAR)
    │   ├── build.gradle                           # Spring Security, JJWT 0.12, Redis, MyBatis, Tika
    │   └── src/main/
    │       ├── java/com/asseterp/security/
    │       │   ├── SecurityTestApplication.java   # SpringBootServletInitializer 구현
    │       │   ├── common/
    │       │   │   ├── config/                    # SecurityConfig, RedisConfig
    │       │   │   ├── jwt/                       # JwtTokenProvider, JwtAuthenticationFilter, RedisTokenService
    │       │   │   └── dto/ApiResponse.java       # 공통 응답 DTO
    │       │   └── biz/
    │       │       ├── auth/                      # 로그인, 로그아웃, 세션 API 및 UserPrincipal
    │       │       ├── file/                      # Apache Tika Magic Number MIME 검사 파일 업/다운로드
    │       │       └── user/                      # PostgreSQL app_user 매퍼 및 엔티티
    │       └── resources/
    │           ├── application.properties         # DB, Redis, JWT(10초/60초), 파일용량, 로그 경로
    │           ├── logback-spring.xml             # 날짜별 파일 롤링 로깅 설정
    │           └── mapper/AppUserMapper.xml       # MyBatis XML 매퍼
    ├── frontend/                                  # React 19 + TypeScript + Ant Design 5 (Vite)
    │   ├── src/
    │   │   ├── pages/LoginPage.tsx                # 로그인 화면 (빠른 테스트 계정 버튼 제공)
    │   │   ├── pages/MainPage.tsx                 # 메인 화면 (JWT 상세, 동시접속 차단 테스트, 파일 업로드 테이블)
    │   │   ├── api/                               # axios client (withCredentials: true)
    │   │   └── App.tsx                            # 세션 자동 복원 라우팅
    │   ├── package.json
    │   └── vite.config.ts
    ├── bm.sh                                      # Backend 관리 (./bm.sh run / compile)
    ├── fm.sh                                      # Frontend 관리 (./fm.sh run / compile)
    ├── deploy.sh                                  # 통합 WAR 빌드 및 Tomcat 자동 배포 스크립트
    └── make.sh                                    # 종합 환경 점검, 빌드, DB 확인 마스터 스크립트
  ──────
  ### 2. 핵심 구현 사항 및 요구사항 반영 결과

   요구사항 항목		  | 구현 내용
  --------------------------------|------------------------------------------------------------------------------------
   1. JWT & 쿠키 인증		  | HttpOnly / SameSite=Lax 기반의 ACCESS_TOKEN 쿠키 발급 및 요청 자동 검증
                                  | (JwtAuthenticationFilter)
   2. 날짜별 파일 로그            | logback-spring.xml을 통해 ${asseterp.base.dir}/logs/security-test-%d{yyyy-MM-
                                  | dd}.log 일별 롤링 파일 기록
   3. 로그인 / 메인 페이지        | Ant Design 기반 LoginPage.tsx 및 로그아웃 버튼/세션 확인이 포함된 MainPage.tsx
   4. Redis 연동		  | RedisTokenService를 통해 사용자별 활성 jti를 관리하고 세션 추적
   5. WAR 배포 & Public 허용      | SpringBootServletInitializer 상속 및 SecurityConfig에서 정적 리소스(index.html,
                                  | assets/**) 및 /public/** permitAll 처리
   6. app_user 평문 패스워드      | PostgreSQL app_user 조회 및 NoOpPasswordEncoder로 평문 비교 (admin/1111,
                                  | user1/1111)
   7. 동시(멀티) 로그인 즉시 차단 | 새 브라우저 로그인 시 Redis의 활성 jti가 갱신되어, 이전 브라우저의 요청이 즉시 401
                                  | Unauthorized로 차단됨 (테스트 검증 완료)
   8. JWT Payload 규격            | sub (userId), iss (asset-erp), jti (UUID), username, name, company_id, dept_id,
                                  | roles 포함
   9. 파일 업로드 & Apache Tika   | org.apache.tika:tika-core를 적용하여 파일 바이너리의 Magic Number를 읽어 실제 MIME
                                  | 타입을 검사하고 저장/다운로드 지원
  ──────
  ### 3. 동작 검증 결과

  1. WAR 배포: deploy.sh 실행으로 security-test.war(42MB) 패키징 후 Tomcat(localhost:8082)에 자동 배포 완료
  2. 로그인 & 쿠키 발급: POST /api/auth/login (admin/1111) 호출 시 ACCESS_TOKEN 쿠키 정상 발급 및 200 OK
  3. 쿠키 기반 인증 확인: 발급된 쿠키로 GET /api/auth/me 호출 시 사용자 정보 및 JTI 정상 수신
  4. 동시 로그인 차단 테스트:
      • 다른 세션에서 동일 계정으로 재로그인 발생 시,
      • 이전 세션의 토큰으로 API 요청 시 즉시 401 Unauthorized 차단 확인
  5. Apache Tika MIME 검사 및 파일 업로드/다운로드:
      • test-sample.txt 업로드 시 Tika가 text/plain MIME 타입을 정확히 판별하여 업로드 완료
      • GET /api/file/download/{fileId}로 정상 다운로드 완료
  6. 로그 기록: /home/kdy987/tmp/asseterp-data/logs/security-test.log 파일에 일자별 로그 기록 확인
  ──────
  ### 4. 실행 및 관리 커맨드

  • 통합 관리 (make.sh):
    cd security-test
    ./make.sh          # 인터랙티브 메뉴 실행 (환경설정, 빌드, 배포, DB확인 등)

  • 개발 모드 개별 실행:
    ./bm.sh run        # Spring Boot 백엔드 개발 서버 실행 (포트 8080)
    ./fm.sh run        # Vite 프론트엔드 개발 서버 실행 (포트 5173)

  • Tomcat 배포:
    ./deploy.sh        # WAR 빌드 후 Docker Tomcat(8082) 자동 배포

  • 배포 후 웹 접속 URL:
      • http://localhost:8082/security-test/



### 프롬프트
security-test라는 폴더를 만들고 backend/frontend로 해서 프로젝트를 만들자.

jwt를 베이스로 하는 security를 테스트하는 프로젝트를 만들려고 함.
일단 아래와 같은 기술스택을 사용하려고 하고 있음.

1. jwt 베이스의 기술을 사용, 쿠키를 사용
2. 로그도 같이 설계 로그파일을 남기고 싶음. application.properties에 기술한 폴더에 정해진이름으로 저장
   날짜단위로 로그가 생기게 하면 좋겠음.
3. 로그인페이지와 메인페이지를 만들고 메인페이지에는 로그아웃 버튼이 있게 하면 좋겠음.
4. redis db가 있음.
5. 최종소스는 war임. 즉 보안필터가 특정 폴더의 접근을 허용해야함.(public)
6. 로그인을 위해서 app_user 생성, 테스트를 용이하게 하기  위해서  password는 평문을 비교한다.
7. 멀티 로그인을 허용하지 않으면 즉시 이전 브라우저의 접속을 차단한다.(jti)
8. jwt payload, sub는 user_id를 의미함.
```json
{
  "sub": "10042",
  "iss": "asset-erp",
  "iat": 1774843200,
  "exp": 1774845000,
  "jti": "b3e9c4d2-7c38-4f8a-98a4-0ef6c98123ab",

  "username": "admin",
  "name": "홍길동",
  "company_id": 1,
  "dept_id": "D101",
  "roles": [
    "ROLE_ADMIN",
    "ROLE_ASSET_MANAGER"
  ]
}
```
9. 파일업로드를 구현해 본다. 로그인 상태에서 파일업로드/다운로드가 원활해야한다.(Apache Tika 같은 라이브러리로 MIME Type(Magic Number)을 검사)
10. 
---
## 기술 스택 (TOBE — AssetERP 차세대 [Ant Design])

### Backend

| 구분 | 기술 | 확정 버전 | 라이센스 | 역할 |
|------|------|-----------|----------|------|
| **1** | **Java** | `21 (LTS)` | Oracle / GPLv2 (Eclipse Temurin) | 서버 사이드 언어. GXT가 요구하던 Java 1.8 제약에서 완전히 탈피, 최신 언어 기능(Records, Pattern Matching, Virtual Threads 등) 활용 가능 |
| **2** | **Spring Boot** | `3.4.x` | Apache-2.0 | 백엔드 프레임워크. Java 21 지원, `jakarta.*` 네임스페이스 전환. WAR 배포 또는 내장 톰캣 선택 가능 |
| **3** | **Spring Security** | `6.x` (내장형) | Apache-2.0 | 인증/인가 프레임워크. JWT 기반 토큰 인증, 메뉴별 RBAC 권한 제어. Spring Security 6 API (Lambda DSL, `SecurityFilterChain` Bean 방식) |
| **4** | **MyBatis** | `mybatis-spring-boot-starter 3.0.x` | Apache-2.0 | **기존 AssetERP SQL 매핑 자산 그대로 활용.** XML Mapper 기반 쿼리 관리, 동적 SQL, Map/DTO 자동 매핑 |
| **5** | **PostgreSQL** | `16.x` | PostgreSQL License (BSD-like) | **다중 사용자 동시 접근 RDBMS.** GXT 기반 다수 클라이언트 환경 지원, 풀 스캔 성능, JSONB 타입, 풀텍스트 검색 등 SQLite 대비 확장성 확보 |
| **6** | **Redis** | `7.2.x` | BSD-3-Clause | **인메모리 캐시 & 세션 스토어.** JWT 토큰 블랙리스트, 세션 관리, 공통 코드 캐싱, 실시간 알림 Pub/Sub 채널 |
| **7** | **JWT (jjwt)** | `0.12.x` | Apache-2.0 | JSON Web Token 인증. Java 21 호환, Access/Refresh Token 이중 토큰 구조, jjwt 0.12 API (`Jwts.builder().signWith()`) |
| **8** | **WebSocket (STOMP)** | Spring 내장 | Apache-2.0 | 실시간 양방향 통신. 운영자 공지, 대용량 업로드 진행률, 자산 상태 변경 실시간 알림. Redis Pub/Sub과 연동하여 다중 인스턴스 환경 지원 |

### Frontend

| 구분 | 기술 | 안정 버전 | 라이센스 | 역할 |
|------|------|-----------|----------|------|
| 1 | React | 19.x | MIT | UI 컴포넌트 라이브러리. 컴포넌트 기반 아키텍처, Server Components 대응 가능 |
| 2 | Vite | 6.jwt.access-token-expiration=10000   # 10초 (ms 단위)
jwt.refresh-token-expiration=60000  # 60초 (ms 단위)
x | MIT | 프론트엔드 빌드 도구 및 개발 서버. 빠른 HMR, 프록시 설정, 프로덕션 번들링 |
| 3 | React Router | 7.x | MIT | 클라이언트 사이드 라우팅. SPA 페이지 전환, 중첩 라우트, 메뉴 권한 연동 라우트 가드 |
| 4 | TypeScript | 5.x | Apache-2.0 | 정적 타입 시스템. 자산/ERP 데이터 타입 안정성, API 응답 타입 자동 생성 연동 |
| 5 | Ant Design | 5.x | MIT | **메인 UI 컴포넌트 라이브러리.** Form, Table, Tree, Modal, Drawer, Tabs 등 ERP 화면에 최적화된 풍부한 컴포넌트. CSS-in-JS 기반 테마 커스터마이징 |
| 6 | AG Grid Community | 34.x | MIT | 고성능 데이터 그리드. 대용량 자산 목록 가상 스크롤, 셀 편집, 정렬, 필터링, 컬럼 고정. Ant Design Table로는 부족한 대용량 데이터 처리 보완 |
| 7 | Zustand | 5.x | MIT | 경량 전역 상태관리. 멀티 탭 자산 상태 공유, 화면 간 데이터 연동, 메뉴/권한 전역 상태 |
| 8 | React Hook Form | 7.x | MIT | 고성능 폼 상태관리. Ant Design `Form.Item`과 `Controller` 연동, 복잡한 자산 등록/수정 폼 처리 |
| 9 | Zod | 3.x | MIT | 스키마 기반 유효성 검증. TypeScript 타입 추론과 런타임 검증 통합, 폼 검증 규칙 정의 |
| 10 | axios | 1.x | MIT | HTTP 클라이언트. 인터셉터 기반 JWT 토큰 자동 첨부, 토큰 만료 시 자동 갱신, 공통 에러 처리 |
| 11 | TanStack Query | 5.x | MIT | 서버 상태 관리. API 캐싱, 자동 리페치, 뮤테이션, 낙관적 업데이트. MyBatis 기반 REST API와 연동 |
| 12 | @milkdown/crepe | 7.x | MIT | Markdown WYSIWYG 에디터. 게시판/메뉴얼 콘텐츠 작성, 마크다운 파싱 |
| 13 | dayjs | 1.x | MIT | 날짜 처리. Ant Design v5 내장 의존성, 자산 만료일/계약일 등 날짜 포맷 처리 |

---

- application.properties 사용
```
    # Database (PostgreSQL)
    spring.datasource.driver-class-name=org.postgresql.Driver
    spring.datasource.url=jdbc:postgresql://localhost:5432/asseterpdb
    spring.datasource.username=kdy987
    spring.datasource.password=kalpa987!

    # Redis
    spring.data.redis.host=localhost
    spring.data.redis.port=6379

    # session test
    jwt.access-token-expiration=10000   # 10초 (ms 단위)
    jwt.refresh-token-expiration=60000  # 60초 (ms 단위)

    # 단일 파일 최대 용량
    spring.servlet.multipart.max-file-size=500MB
    # 전체 요청(다중 파일 포함) 최대 용량
    spring.servlet.multipart.max-request-size=500MB
    
    # asseterp base dir
    asseterp.base.dir=/home/kdy987/tmp/asseterp-data
    
- test용 table app_user 생성`
```sql
-- 1. 회원 테이블 생성
-- 1. 회원 테이블 생성
DROP TABLE IF EXISTS app_user;

CREATE TABLE app_user (
    user_id     BIGSERIAL PRIMARY KEY,
    company_id  INTEGER,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(100) NOT NULL, -- 평문 비밀번호 저장
    full_name   VARCHAR(100) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'ROLE_USER',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 테스트용 기초 데이터 삽입 (비밀번호: 평문)
INSERT INTO app_user (company_id,username, password, full_name, role)
VALUES
    (100,'admin', '1111', '시스템 관리자', 'ROLE_ADMIN'),
    (100,'user1', '1111', '일반 사용자', 'ROLE_USER');


select * from app_user;
```
