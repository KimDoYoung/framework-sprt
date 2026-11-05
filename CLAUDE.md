# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

레거시 자산운용사 ERP "AssetERP"(GWT/GXT + PostgreSQL + MyBatis, 수백 페이지 규모)를 **Spring Boot + React** 스택(TOBE)으로 전환하기 위한 테스트/프로토타입 프로젝트다. GWT/GXT가 더 이상 발전하지 않는 기술이고 Java 8에 묶여 있는 것이 전환 동기다. 

전환 규칙(네이밍/레이어 규칙 등)은 `docs/TOBE-Framework.md`에 정의되어 있다 — 'Strangler Fig' 전략으로 진행한다.

즉 목표는 기존 AssetERP의 기술스택을 서서히 바꾸어서 충분히 검증한 후 새로운 App으로 서비스하고자 하는 것이다.


## 작업의 구성

작업은 아래 다섯 가지로 나눈다. 각 작업의 규칙·기록은 `AssetERP/docs/` 아래 작업별 폴더에 두고, 폴더마다 README.md 가 길잡이다(전체 지도는 `AssetERP/docs/README.md`).

**작업을 시작하기 전에 그 작업 폴더의 `README.md`를 반드시 먼저 읽는다**(예: 변환 → `AssetERP/docs/변환/README.md`). 요청이 어느 작업인지 애매하면 가장 가까운 작업의 README를 읽고, 여러 작업에 걸치면 해당 README를 모두 읽는다.

| 작업 | 뜻 | docs 폴더 | 핵심 명령 |
|:---|:---|:---|:---|
| 변환 | GWT/GXT 화면을 Spring Boot/React로 옮김 | `AssetERP/docs/변환/` (규칙: `변환-가이드.md`) | `yunhee analysis`·`port-sql`·`run` |
| 업무분석 | AS-IS 업무를 **소스와 DB 구조**로 확인하고 시나리오를 만듦 | `AssetERP/docs/업무분석/` (참고: `변환/09-업무흐름.md`) | `yunhee trace-*`·`table` |
| 변경반영 | AS-IS는 매일 바뀐다. 변환이 끝난 화면도 원본이 바뀌면 파악해서 TOBE에 반영 | `AssetERP/docs/변경반영/` | `./check-git.sh`, `yunhee drift` (05 §7 "원본 변경 점검") |
| 재설계 | AS-IS의 UI·로직(업무흐름)을 TOBE에서 다르게 바꾸고 새 기능을 더함(전환 단위·공존·롤백은 아래 Strangler Fig) | `AssetERP/docs/재설계/` | |
| 테스트 | 업무 로직 기준으로 TOBE 테스트를 자동화 | `AssetERP/docs/테스트/` | `yunhee run "gradle test"` |

* 기술스택이 바뀌면서 달라지는 것
   - 보안: 세션 → JWT (`docs/security-설계.md`)
   - 실시간 통신: WebSocket (`docs/websocket-설계.md`)
   - 로그: `docs/log-설계.md`
* Strangler Fig: 화면(메뉴) 단위로 AS-IS를 TOBE로 바꾼다. 전환 단위, 기존 세션과 JWT의 공존, 문제가 생겼을 때 되돌리는 방법은 아직 문서가 없다 — `재설계` 작업에서 정한다.


## 저장소 구조

**`AssetERP/`가 메인 폴더다.** 실제 AssetERP 변환(화면·백엔드·작업 문서·page-style 등)은 모두 여기서 하며 규칙은 `AssetERP/CLAUDE.md`(변환 작업 규칙)를 따른다.

- 저장소 루트 아래의 다른 폴더(`antdesign/`, `security-test/`, `OMS/` 등)는 테스트용 프로젝트다. 사용자가 따로 지시하지 않으면 변환 작업의 대상이나 참고 기준으로 삼지 않는다. 거기서 코드를 가져오면 패키지를 `kr.co.kfs.asseterp`로 바꾼다(`com.asseterp`는 쓰지 않는다).
- `docs/TOBE-Framework.md` — backend/frontend 네이밍 및 레이어 규칙(신규 코드 작성 시 반드시 준수).
- `tools/dbml-index.py`, `tools/src-index.py`, `tools/sql-check.py` — AS-IS 색인·SQL 정합성 생성기의 원본. 지금은 같은 기능의 `yunhee index-db` / `index-src` / `sql-check`를 쓴다. 출력은 `docs/as-is/`(git-ignored, 재생성 가능).
- `docs/grid-types.md` — 공통 그리드 이름표(GridType·`gb.*`·옵션). yunhee 변환 명세와 TOBE 코드가 이 이름만 쓴다.
- `docs/button-types.md` — 공통 버튼 이름표(`<Button type="search">` 등 type 약 30개, AS-IS `ColorButtonBar` 제목 → type). 컴포넌트는 아직 없음.
- `AssetERP/docs/page-style.md` — 페이지(`*_Tab_*`) 화면 배치 이름표. 스타일 ID(SID: SG·SGVF·SGEF·TG·GG·CG)로 화면 구성을 부른다. 견본 코드는 `AssetERP/docs/page-style/{SID}/`(참조용 복사본). 초안(전체 `_Tab_` 조사 후 확정).

## AS-IS 참조

AS-IS 소스(`~/work/IDMS-IC` = `yunhee config`의 `YUNHEE_ASIS_SRC_DIR`, 약 3,600개 Java. 2026-10-13 전에는 `~/oms-data/src/Asset-ERP`)와 DB 스키마 문서는 수 MB라 통째로 읽지 않는다. **색인에서 필요한 파일·줄만 골라 읽는다.**

1. `docs/as-is/src/menus.md`를 grep해 메뉴 → 화면 파일(`docs/as-is/src/{도메인}/screens/{화면}.md`)을 찾는다.
2. 화면 파일에 함께 쓰는 클래스, 서비스 → 서버 메서드(파일:줄) → SQL ID → 테이블, UI(위젯·그리드 컬럼·이벤트·메서드 줄 범위)가 있다. 다른 도메인 컴포넌트(예: 전자결재 `Apr01_Edit_ApprDoc`)는 링크만 있다.
3. 테이블 정의·컬럼 한글 주석은 `docs/as-is/db/tables/{도메인}.md`, DB 함수는 `docs/as-is/db/functions/{이름}.md`.
4. 실제 코드는 색인이 가리키는 소스 파일·줄만 연다.

색인이 없거나 오래됐으면 다시 만든다. DB는 docker 안의 localhost `asseterpdb`로 고정이다(omsdb 등 다른 DB는 절대 쓰지 않는다).
```bash
# 1) asseterpdb 스키마 → DBML 마크다운 (yunhee, 읽기 전용). 인자는 asseterpdb 접속정보를 가진 환경변수 이름(`.env.yunhee`의 `YUNHEE_DB`, 옛 `LOCAL_DB`도 읽음 — 0.5.0~)
yunhee dbml YUNHEE_DB -o .yunhee/asseterp-dbml.md
# 2) DBML → DB 색인
yunhee index-db .yunhee/asseterp-dbml.md                                 # → docs/as-is/db/
# 3) 소스 → 소스 색인. 실행마다 출력 폴더의 *.md를 지우고 다시 만든다(앱 패키지 myApp/myOms 자동 탐지)
yunhee index-src ~/work/IDMS-IC --menus docs/as-is/menus.tsv             # AssetERP 폴더의 색인은 AssetERP/CLAUDE.md
yunhee index-src ~/workspace26/Asset-OMS --menus docs/as-is/menus.tsv    # OMS (AssetERP 색인을 덮어씀)
# 4) 매퍼 SQL이 asseterpdb에서 도는지 EXPLAIN으로 확인 (읽기 전용, 실행 안 함) → docs/as-is/sql-check.md
PGHOST=localhost PGUSER=kdy987 PGPASSWORD=... yunhee sql-check ~/workspace26/Asset-OMS
```
- **저장소 루트에서** 실행한다(기본 출력이 `{현재 폴더}/docs/as-is/…`). 다른 곳에 만들려면 `-t <폴더>`. `-t`에는 색인 전용 폴더만 준다(그 아래 *.md를 지운다).
- `tools/dbml-index.py`·`src-index.py`·`sql-check.py`는 yunhee로 옮기기 전 원본이다(2026-10-02 대조 결과 출력 동일).
- DB 스키마가 그대로면 1·2는 건너뛰고 3만 돌린다. 2를 다시 돌렸으면 3도 다시 돌린다(테이블 링크·`⚠DB없음` 판정이 DB 색인을 쓴다).
- `docs/as-is/menus.tsv`는 asseterpdb `sys06_menu`에서 뽑는다(SQL은 `docs/as-is/src/README.md`). 출력 폴더 밖에 두어 지워지지 않게 한다.
- 화면 파일의 `⚠DB없음` 테이블은 asseterpdb에 없는 테이블이다. 프레임 클래스(LoginPage, MainFrame, MyPage …)는 `docs/as-is/src/_frame/screens/`에 있다.

## 커맨드

모두 `AssetERP/`에서 실행한다. 빌드·테스트·배포는 셸에서 직접 돌리지 않고 `yunhee run`으로 돌린다.

```bash
cd AssetERP
yunhee run "./fm.sh compile"          # frontend 컴파일(타입체크는 frontend에서 yunhee run "npx tsc -b --noEmit")
yunhee run "./bm.sh compile"          # backend 컴파일
yunhee run "./deploy.sh"              # frontend 빌드 → backend static 복사 → bootWar(AssetERP.war) → Tomcat 배포
```
개발 서버는 `./fm.sh run`(Vite, 5173), `./bm.sh run`. `gradlew` wrapper가 없어 시스템 `gradle`을 쓴다.


### 변경분 반영 커맨드

ASIS 변경 분 반영 - ASIS 소스의 변경된 내용을 git pull하고 그에 따라서 index 작업을 다시 한다.

```bash
cd AssetERP
./check-git.sh

```

## Backend 아키텍처 (`docs/TOBE-Framework.md` 규칙)

- **Base package는 반드시 `kr.co.kfs.asseterp`** (build.gradle `group`도 동일).
  - AssetERP 원본 전환: `kr.co.kfs.asseterp` (예: `kr.co.kfs.asseterp.biz.emp.controller`)
- 레이어: `common.*`(Security/Config/Error/Utils 공통 모듈), `biz.<domain>.*`(도메인별 업무 패키지) — `biz`는 **모든 업무 도메인을 담는 상위 네임스페이스**이며 도메인 코드 자체가 아니다. 각 도메인 패키지 아래 `controller`/`service`/`mapper`/`dto`로 나눈다.
- REST 규칙: `/api/v1/{domain}/{resource}`, 컨트롤러/서비스/매퍼는 `{Domain}Controller`/`{Domain}Service`/`{Domain}Mapper`로 명명하되, 도메인이 크면 AS-IS 서버 클래스 단위 `{Domain}{Resource}Controller`(예: `Sys04_Role` → `SysRoleController`/`SysRoleService`/`SysRoleMapper`, `Sys06_Menu` → `SysMenu*`). 메서드 접두사는 조회 `get/search`, 등록 `create`, 수정 `update`, 삭제 `delete`.
- 모든 API 응답은 공통 `ApiResponse<T>`로 감싸고, 업무 예외는 `BusinessException`으로 일원화해 `RestControllerAdvice`에서 처리.
- DTO는 Lombok 클래스 대신 Java 21 `record` 사용을 권장. Lombok은 `@RequiredArgsConstructor`/`@Slf4j`/`@Getter`/`@Builder`만 허용, `@Setter`/`@Data`는 금지.
- MyBatis 사용 시 파라미터는 Map 대신 전용 DTO/VO 사용. Service는 기본 읽기 전용 트랜잭션, CUD 메서드에만 쓰기 트랜잭션을 선언.

## Frontend 아키텍처

`AssetERP/frontend/src`: React + TypeScript + Ant Design(일반 폼·목록) + AG Grid(그리드). 화면은 `pages/{도메인}/`, 공통 부품은 `components/`·`hooks/`, API는 `api/`, 화면 등록은 `pages/screens.ts`.

- 공통 부품 사용법은 `AssetERP/docs/변환/11-프론트부품.md`, 배치·간격 규칙은 `변환-가이드.md`, 화면 유형은 `AssetERP/docs/page-style.md`를 본다. 부품 소스를 통째로 읽지 않는다.
- `docs/TOBE-Framework.md`의 frontend 규칙: 대시보드는 "MyPage" 용어 사용, 아이콘은 Ant Design 아이콘만 사용, Tailwind 사용 자제, StatusBar를 TopBar와 콘텐츠 사이에 배치, 뷰포트 피팅(no-scroll body + 내부 가상 스크롤 격리) 레이아웃 유지.

## yunhee의 이용 (local qwen2.5를 이용하는 agent)


- 이 머신에는 AI 어시스턴트의 토큰 낭비를 원천 차단하기 위한 로컬 CLI `yunhee`가 설치되어 있습니다.
- yunhee의 기능과 사용법은 `/home/kdy987/work/yunhee-cli/docs/help/` 폴더에 fully 기술되어 있다. 간단한 도움말은 `yunhee --help`, `yunhee <command> --help`로 본다(명령 옵션이 기억나지 않으면 추측하지 말고 먼저 `--help`).
-  작업 시 불필요한 전체 파일 읽기, grep/find, 셸 직접 빌드(mvn/gradle/npm)나 curl 호출을 금지합니다.

1. **작업 전 도구 탐색**:
   - 상황에 맞는 명령어를 찾으려면 먼저 아래 중앙 가이드 색인을 읽으세요:
   👉 `/home/kdy987/work/yunhee-cli/docs/help/index.md`
2. **세부 작업별 전문 가이드 (필요할 때 해당 파일 열람)**:
   - 화면 레이아웃/그리드/SQL/메서드 분석: `/home/kdy987/work/yunhee-cli/docs/help/analysis.md`
   - 업무 흐름/CRUD 매트릭스/상태 전이 추적: `/home/kdy987/work/yunhee-cli/docs/help/trace.md`
   - SQL 포팅/DTO 생성/화면 스타일/드리프트: `/home/kdy987/work/yunhee-cli/docs/help/migration.md`
   - 코드 줄 단위 탐색/빌드 실행/API/서버 로그:
   ￹`/home/kdy987/work/yunhee-cli/docs/help/ops-and-log.md`
3. **핵심 금기 사항**:
   - ❌ grep 대신 `yunhee grep`, tail/head 대신 `yunhee cat --tail/--head` 사용
   - ❌ 소스 파일 전체를 읽지 마세요(cat 파일은 하지 말것) ➔ `yunhee outline <경로>` 및 `yunhee cat <파일:줄범위>` 사용
   - ❌ 셸에서 직접 빌드/테스트를 돌리지 마세요 ➔ `yunhee run "<명령>"` 사용 (에러 자동 압축)
   - ❌ 전체 DDL을 검색하거나 DB에 임의 쿼리하지 마세요 ➔ `yunhee table <테이블>` 사용


## 작업완료
8. **작업 완료 알림 (ntfy)**: 사용자의 요청에 따른 작업(화면 변환, 버그 수정, 빌드/테스트 등)이 끝나면 **항상** 아래 `curl` 명령을 실행하여 ntfy 알림을 전송한다:
   `curl -s -d "claude/agy message: <작업내용 요약> 작업 끝 남" ntfy.sh/asseterp-framework-gwtgxt-2-sbreact-2026`

