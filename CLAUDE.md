# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

레거시 자산운용사 ERP "AssetERP"(GWT/GXT + PostgreSQL + MyBatis, 수백 페이지 규모)를 **Spring Boot + React** 스택(TOBE)으로 전환하기 위한 테스트/프로토타입 프로젝트다. GWT/GXT가 더 이상 발전하지 않는 기술이고 Java 8에 묶여 있는 것이 전환 동기다. `antdesign/`은 Ant Design 기반으로 화면 디자인을 시험하는 하위 프로젝트다.

전환 규칙(네이밍/레이어 규칙 등)은 `docs/TOBE-Framework.md`에 정의되어 있다 — backend/frontend 코드를 작성하기 전에 반드시 확인할 것. 레거시 화면 스크린샷은 `docs/asis-asseterp/`(git-ignored)에 있다.

## 저장소 구조

- `antdesign/` — Spring Boot(backend) + React(frontend) 프로토타입. 실제 작업은 대부분 여기서 이뤄진다.
  - `antdesign/backend/` — Spring Boot 3.4.3 / Java 21, 현재는 골격 수준(컨트롤러/도메인 패키지 없음).
  - `antdesign/frontend/` — Vite + React 19 + TypeScript + Ant Design 5 UI 프로토타입. 실제 API 연동 없이 mock 데이터로 동작.
  - `antdesign/bm.sh`, `antdesign/fm.sh`, `antdesign/deploy.sh` — 각각 backend/frontend 관리 스크립트와 배포 스크립트.
- `docs/TOBE-Framework.md` — backend/frontend 네이밍 및 레이어 규칙(신규 코드 작성 시 반드시 준수).
- `docs/docker-compose.yml` — 로컬 PostgreSQL/Redis/Tomcat 개발 인프라 정의(호스트 경로가 특정 서버에 고정되어 있어 그대로는 다른 환경에서 재사용 불가).
- `tools/init-sprt.sh` — `antdesign/` 프로젝트 전체(디렉토리 구조, `package.json`, 모든 소스 파일, `bm.sh`/`fm.sh`/`deploy.sh` 등)를 처음부터 생성하는 스캐폴딩 스크립트. `antdesign/`의 구조를 바꾸는 작업을 하면 이 스크립트도 함께 갱신해야 재생성 시 실제 코드와 어긋나지 않는다.

## 커맨드

### Frontend (`antdesign/frontend`)

```bash
cd antdesign/frontend
npm install          # 최초 1회
npm run dev          # Vite 개발 서버 (포트 5173, /api → localhost:8080 프록시)
npm run build         # tsc -b (타입체크) 후 vite build
npx tsc -b --noEmit   # 빌드 없이 타입체크만
npm run preview
```
또는 `./fm.sh run` / `./fm.sh compile` (antdesign/ 루트에서).

프론트엔드에는 아직 테스트 러너가 설정되어 있지 않다.

### Backend (`antdesign/backend`)

`gradlew` wrapper가 없으므로 시스템에 설치된 `gradle`을 사용한다.

```bash
cd antdesign/backend
gradle bootRun            # 개발 서버 실행
gradle compileJava         # 컴파일만
gradle test                # 전체 테스트
gradle test --tests "com.asseterp.SomeTestClass"   # 단일 테스트
```
또는 `./bm.sh run` / `./bm.sh compile` (antdesign/ 루트에서).

### 배포

```bash
./antdesign/deploy.sh
```
frontend를 빌드해 `backend/src/main/resources/static`으로 복사한 뒤 `bootWar`로 WAR(`antdesign.war`)를 패키징한다.

## Backend 아키텍처 (`docs/TOBE-Framework.md` 규칙)

- Base package: `com.asseterp` (build.gradle group) / 규칙 문서상 목표 패키지는 `kr.co.kfs.asseterp`.
- 레이어: `common.*`(Security/Config/Error/Utils 공통 모듈), `biz.<domain>.*`(도메인별 업무 패키지) — `biz`는 **모든 업무 도메인을 담는 상위 네임스페이스**이며 도메인 코드 자체가 아니다. 각 도메인 패키지 아래 `controller`/`service`/`mapper`/`dto`로 나눈다.
- REST 규칙: `/api/v1/{domain}/{resource}`, 컨트롤러/서비스/매퍼는 `{Domain}Controller`/`{Domain}Service`/`{Domain}Mapper`로 명명. 메서드 접두사는 조회 `get/search`, 등록 `create`, 수정 `update`, 삭제 `delete`.
- 모든 API 응답은 공통 `ApiResponse<T>`로 감싸고, 업무 예외는 `BusinessException`으로 일원화해 `RestControllerAdvice`에서 처리.
- DTO는 Lombok 클래스 대신 Java 21 `record` 사용을 권장. Lombok은 `@RequiredArgsConstructor`/`@Slf4j`/`@Getter`/`@Builder`만 허용, `@Setter`/`@Data`는 금지.
- MyBatis 사용 시 파라미터는 Map 대신 전용 DTO/VO 사용. Service는 기본 읽기 전용 트랜잭션, CUD 메서드에만 쓰기 트랜잭션을 선언.

## Frontend 아키텍처

`antdesign/frontend/src`는 현재 목업 데이터 기반 UI 셸 프로토타입이다(axios/React Router/TanStack Query/Zustand 등은 `antdesign/README.md` 기술 스택 표에는 명시돼 있지만 아직 `package.json`에는 설치되어 있지 않다).

- `App.tsx` — 앱 전체 셸. `TopBar` + `LeftMenuBar`(1차 아이콘 메뉴 + 2/3차 서브메뉴) + `flexlayout-react` 기반 `Layout`/`Model`(다중 분할·탭 도킹) + `StatusBar`로 구성. FlexLayout 모델은 `localStorage`(`asseterp_flexlayout_model`)에 자동 저장/복원된다.
- 메뉴 클릭(`LeftMenuBar`의 3차 메뉴)은 FlexLayout에 새 탭을 열거나 기존 탭을 활성화한다. 탭 콘텐츠는 `App.tsx`의 `factory()`가 결정: `component: 'mypage'`이면 `components/mypage/MyPageCalendar` + `MyPageGrids`(일정/전자결재/컴플라이언스 그리드 박스) + `EmployeePanel`을 조합한 대시보드를, 그 외에는 범용 `LargeDataView`(AG Grid 기반 대용량 그리드)를 렌더링한다.
- `mock/data.ts`가 메뉴 트리와 모든 화면의 샘플 데이터를 생성하는 유일한 데이터 소스다. 실제 백엔드 연동 전까지 새 화면도 이 패턴을 따른다.
- `docs/TOBE-Framework.md`의 frontend 규칙: 대시보드는 "MyPage" 용어 사용, 아이콘은 Ant Design 아이콘만 사용, Tailwind 사용 자제, StatusBar를 TopBar와 콘텐츠 사이에 배치, 뷰포트 피팅(no-scroll body + 내부 가상 스크롤 격리) 레이아웃 유지.
- 대용량 그리드는 AG Grid(`LargeDataView`), 일반 폼/목록 화면은 Ant Design 컴포넌트를 사용하도록 구분되어 있다(기술 스택 표 기준).
