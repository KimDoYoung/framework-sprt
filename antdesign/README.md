# antdesign

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
| 2 | Vite | 6.x | MIT | 프론트엔드 빌드 도구 및 개발 서버. 빠른 HMR, 프록시 설정, 프로덕션 번들링 |
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

## 스크립트 가이드
- 백엔드 실행/컴파일: `./bm.sh`
- 프론트엔드 실행/컴파일: `./fm.sh`
- 배포 패키징: `./deploy.sh`
