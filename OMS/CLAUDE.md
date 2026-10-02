# OMS/CLAUDE.md

AS-IS Asset-OMS(GWT/GXT)를 Spring Boot + React로 전환하는 프로젝트. AssetERP 전환에 무엇이 필요한지 가늠하는 것이 목적이다.
상위 `CLAUDE.md`(저장소 공통 규칙)도 함께 적용된다.

## 먼저 볼 문서

- `docs/작업계획.md` — 단계(P1~P5, B 기반 작업, 본작업)와 진행 상태
- `docs/scope.md` — 화면 범위·순서·AssetERP 시사점. **다음에 변환할 화면은 여기 순서대로**
- `../docs/OMS-convert.md` — AS-IS → TOBE 변환 규칙. **화면을 변환할 때 반드시 따른다**

## 고정 사항

- AS-IS 원본: `~/workspace26/Asset-OMS` (패키지 `myOms`). 통째로 읽지 않고 색인이 가리키는 파일·줄만 연다.
- 색인: `../docs/as-is/src/` — OMS로 생성되어 있어야 한다(README의 "소스"가 Asset-OMS인지 확인). 아니면
  `yunhee index-src ~/workspace26/Asset-OMS --menus docs/as-is/menus.tsv` (저장소 루트에서)
- SQL 정합성: `../docs/as-is/sql-check.md` (`yunhee sql-check`)
- DB: docker localhost의 **asseterpdb 고정** (omsdb 사용 안 함). 없는 테이블은 만들지 않고 그 화면은 변환하지 않는다.
- 패키지: `kr.co.kfs.asseterp.oms`. AS-IS 서버 클래스 1개 → `biz.{도메인}`의 `{Domain}{Resource}Controller/Service/Mapper` 1벌.
- 레퍼런스 화면:
  - `Sys01_Tab_Company` (`frontend/src/pages/sys/Sys01_Tab_Company.tsx`) — 공통 그리드(`components/grid`, `../docs/grid-types.md`)·파일/함수 이름·첫 주석·Splitter 규칙
  - `Sys04_Tab_Role` (권한그룹 관리) — 그리드 CRUD 공통 훅 `useGridCrud` (아직 옛 파일 이름 `Sys04RoleView.tsx`)
- 화면 1개 = 세션 1개(`/clear`). 지시에는 색인 화면 파일, 규칙서, 레퍼런스만 넘긴다.

## 구조

- `backend/` — Spring Boot 3.4 / Java 21. `common.*`(jwt, tenant, websocket, error, log, config), `biz.auth`(로그인), `biz.sys`(메뉴 `SysMenu*`) …
- `frontend/` — React 19 + antd 5 + AG Grid + flexlayout. `App.tsx`(LoginPage ↔ MainFrame), `MainFrame.tsx`(TopBar·LeftMenuBar·탭·StatusBar),
  `api/`(axios `apiClient`, baseURL `api`), `pages/`(화면), `components/`(공통), `mock/data.ts`(MyPage 등 아직 mock)
- 변환 전 화면은 `components/PendingScreenView`로 열린다.

## 확인 커맨드

```bash
./bm.sh compile                       # backend 컴파일
(cd backend && gradle test)           # backend 테스트
(cd frontend && npx tsc -b --noEmit)  # frontend 타입체크
./deploy.sh                           # WAR → Tomcat(docker t3600-tomcat) /OMS
```
접속: `http://admin.localhost:8082/OMS/` (admin 테넌트, 로그인 화면에서 회사 선택) / `http://kfstest.localhost:8082/OMS/` (회사 kfstest).
컨텍스트 경로는 대문자 `/OMS`. 배포 후 Tomcat 로그: `docker logs --since 5m t3600-tomcat`.
