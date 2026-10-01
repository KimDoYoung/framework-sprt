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
- `docs/OMS-convert.md` — OMS(AS-IS GWT) → TOBE 화면 변환 규칙(호출·서버·세션·SQL 차이·화면 대응). OMS 화면을 변환할 때 반드시 따른다.
- `docs/docker-compose.yml` — 로컬 PostgreSQL/Redis/Tomcat 개발 인프라 정의(호스트 경로가 특정 서버에 고정되어 있어 그대로는 다른 환경에서 재사용 불가).
- `tools/init-sprt.sh` — `antdesign/`의 골격(디렉토리 구조, 설정 파일, 빈 앱 셸 `App.tsx`, `bm.sh`/`fm.sh`/`deploy.sh`)만 생성하는 스캐폴딩 스크립트. 화면 소스는 생성하지 않는다(추후 `git archive`로 `antdesign/`에서 가져오는 방식으로 전환 예정). 빈 디렉토리에서만 실행되며, `antdesign/`의 설정 파일·디렉토리 구조를 바꾸면 이 스크립트도 함께 갱신한다.
- `tools/dbml-index.py`, `tools/src-index.py` — AS-IS DB 스키마·소스 색인 생성기. `tools/sql-check.py` — AS-IS 매퍼 SQL ↔ asseterpdb 정합성(EXPLAIN). 출력은 `docs/as-is/`(git-ignored, 재생성 가능).

## AS-IS 참조 (전환 작업 시)

AS-IS 소스(`~/oms-data/src/Asset-ERP`, 약 3,000개 Java)와 DB 스키마 문서는 수 MB라 통째로 읽지 않는다. **색인에서 필요한 파일·줄만 골라 읽는다.**

1. `docs/as-is/src/menus.md`를 grep해 메뉴 → 화면 파일(`docs/as-is/src/{도메인}/screens/{화면}.md`)을 찾는다.
2. 화면 파일에 함께 쓰는 클래스, 서비스 → 서버 메서드(파일:줄) → SQL ID → 테이블이 있다. 다른 도메인 컴포넌트(예: 전자결재 `Apr01_Edit_ApprDoc`)는 링크만 있다.
3. 테이블 정의·컬럼 한글 주석은 `docs/as-is/db/tables/{도메인}.md`, DB 함수는 `docs/as-is/db/functions/{이름}.md`.
4. 실제 코드는 색인이 가리키는 소스 파일·줄만 연다.

색인이 없거나 오래됐으면 다시 만든다. DB는 docker 안의 localhost `asseterpdb`로 고정이다(omsdb 등 다른 DB는 쓰지 않는다).
```bash
# 1) asseterpdb 스키마 → DBML 마크다운 (yunhee, 읽기 전용). 인자는 asseterpdb 접속정보를 가진 환경변수 이름
yunhee dbml LOCAL_DB -o .yunhee/asseterp-dbml.md
# 2) DBML → DB 색인
python3 tools/dbml-index.py .yunhee/asseterp-dbml.md                                # → docs/as-is/db/
# 3) 소스 → 소스 색인. 출력은 docs/as-is/src/ 고정, 실행마다 비우고 다시 만든다(앱 패키지 myApp/myOms 자동 탐지)
python3 tools/src-index.py ~/oms-data/src/Asset-ERP --menus docs/as-is/menus.tsv   # AssetERP
python3 tools/src-index.py ~/workspace26/Asset-OMS --menus docs/as-is/menus.tsv    # OMS (AssetERP 색인을 덮어씀)
# 4) 매퍼 SQL이 asseterpdb에서 도는지 EXPLAIN으로 확인 (읽기 전용, 실행 안 함) → docs/as-is/sql-check.md
PGHOST=localhost PGUSER=kdy987 PGPASSWORD=... python3 tools/sql-check.py ~/workspace26/Asset-OMS
```
- DB 스키마가 그대로면 1·2는 건너뛰고 3만 돌린다. 2를 다시 돌렸으면 3도 다시 돌린다(테이블 링크·`⚠DB없음` 판정이 DB 색인을 쓴다).
- `docs/as-is/menus.tsv`는 asseterpdb `sys06_menu`에서 뽑는다(SQL은 `docs/as-is/src/README.md`). 출력 폴더 밖에 두어 지워지지 않게 한다.
- 화면 파일의 `⚠DB없음` 테이블은 asseterpdb에 없는 테이블이다. 프레임 클래스(LoginPage, MainFrame, MyPage …)는 `docs/as-is/src/_frame/screens/`에 있다.

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
gradle test --tests "com.asseterp.test.SomeTestClass"   # 단일 테스트 (antdesign은 규칙 이전 패키지)
```
또는 `./bm.sh run` / `./bm.sh compile` (antdesign/ 루트에서).

### 배포

```bash
./antdesign/deploy.sh
```
frontend를 빌드해 `backend/src/main/resources/static`으로 복사한 뒤 `bootWar`로 WAR(`antdesign.war`)를 패키징한다.

## Backend 아키텍처 (`docs/TOBE-Framework.md` 규칙)

- **Base package는 반드시 `kr.co.kfs.asseterp`** (build.gradle `group`도 동일). 신규 코드는 `com.asseterp`를 쓰지 않는다.
  - AssetERP 원본 전환: `kr.co.kfs.asseterp` (예: `kr.co.kfs.asseterp.biz.emp.controller`)
  - OMS(AssetERP subset): `kr.co.kfs.asseterp.oms` (예: `kr.co.kfs.asseterp.oms.common.jwt`, `kr.co.kfs.asseterp.oms.biz.auth`)
  - `antdesign/`(`com.asseterp.test`), `security-test/`(`com.asseterp.security`)는 이 규칙 이전의 프로토타입이다. 거기서 코드를 가져오면 패키지를 위 규칙으로 바꾼다.
- 레이어: `common.*`(Security/Config/Error/Utils 공통 모듈), `biz.<domain>.*`(도메인별 업무 패키지) — `biz`는 **모든 업무 도메인을 담는 상위 네임스페이스**이며 도메인 코드 자체가 아니다. 각 도메인 패키지 아래 `controller`/`service`/`mapper`/`dto`로 나눈다.
- REST 규칙: `/api/v1/{domain}/{resource}`, 컨트롤러/서비스/매퍼는 `{Domain}Controller`/`{Domain}Service`/`{Domain}Mapper`로 명명하되, 도메인이 크면 AS-IS 서버 클래스 단위 `{Domain}{Resource}Controller`(예: `Sys04_Role` → `SysRoleController`/`SysRoleService`/`SysRoleMapper`, `Sys06_Menu` → `SysMenu*`). 메서드 접두사는 조회 `get/search`, 등록 `create`, 수정 `update`, 삭제 `delete`.
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
