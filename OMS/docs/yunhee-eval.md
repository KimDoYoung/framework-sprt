# yunhee 평가 (scope.md 8번 sys 화면 변환 중 측정)

2026-10-01. 대상: `Sys06_Tab_MenuView`, `Sys06_Tab_MenuGuide`, `Sys04_Tab_RoleAdmin` (yunhee 0.1.0, qwen2.5-coder:14b).
비교 기준은 지금 쓰는 방식: 색인(`docs/as-is/src/.../screens/{화면}.md`) → 색인이 가리키는 원본 파일·줄만 읽기.

## 결론

| 명령 | 판정 | 이유 |
|:---|:---|:---|
| `prepare` | **삭제 권장** (2차 비교 참고) | 화면 단위가 아니라 접두사(`Sys06`) 단위라 여러 화면이 섞이고, SQL ID 오매핑·환각이 있어 결국 원본을 다시 읽어야 했다. 출력이 색인보다 크다 |
| `table` | 조건부 | 정확하고 빠르지만 `docs/as-is/db/tables/*.md`와 같은 DBML이라 추가 이득이 거의 없다. `--page`는 동작하지 않음 |
| `run` | 권장 (작게) | 성공 시 3줄로 줄고 원시 로그는 `.yunhee/runs`(git-ignored)에 남는다. 다만 gradle·tsc는 성공 출력이 원래 짧아 절약 폭은 작다. 실패 요약 품질은 이번에 실패가 없어 미검증 |

토큰 절약의 실제 대상은 "원본 소스 읽기"인데, `prepare`가 그것을 대체하지 못했다. 색인 + 필요한 줄만 읽기가 더 싸고 정확하다.

## 4차: 0.1.2로 화면 1개 전 과정 (`Sys07_Tab_Company`, 2026-10-01)

화면 변환 전체를 새 규칙(색인 UI 절 → outline → table → run → api)으로 했다.

| 단계 | 쓴 것 | 관찰 |
|:---|:---|:---|
| AS-IS 분석 | 색인 화면 파일(클래스 5개 UI 절) | 화면 구성은 색인만으로 충분. 복사 로직은 서버 메서드 100줄 + 클라이언트 처리 117줄 + SQL 8개를 색인 줄 번호로만 읽음 (화면 클래스 704줄은 열지 않음) |
| TOBE 위치 | `outline api/sys.ts`, `SysCodeController` | 재사용 함수(`searchCompanies`·`searchCompanyRoles`·`copyCodes` 모양)를 파일을 열지 않고 찾음. `export function useTreeGrid<T>(`(제네릭 함수)는 못 잡음 |
| 스키마 | `table sys03_company_menu sys07_role_menu` | INSERT 컬럼 순서 확인에 정확 |
| 빌드 | `run` 5회 | 실패 1회(TS6133 미사용 import)를 요약만 보고 바로 고침 — 요약 정확 |
| 검증 | `api` 8회 | 메뉴 트리 488행, 복사 API는 자기 회사로 복사(DB 스냅샷 동일 확인), 검증 오류 400. **응답 data가 숫자면 값을 안 보여 줌**(키 목록만) → `--raw` 필요 |

src-index.py 버그 1건도 고침: 툴바 라벨을 마지막 문자열로 잡아 `setHtmlCheckBoxStyle("안내문", "4472C4")`의 색상이 라벨로 나왔다 → 첫 문자열로. 고친 뒤 AS-IS 안내 문구("※ 상단 : 출발지 회사 / 하단 : 목적지 회사")가 보여 TOBE 화면에도 넣었다.

## 3차: yunhee 0.1.1 → 0.1.2 (outline·api 추가, prepare 삭제)

| 명령 | 결과 | 판정 |
|:---|:---|:---|
| `run` | 성공 1줄 / 실패 시 원인·핵심 에러 원문 발췌 정확 | 사용 |
| `outline` (0.1.2) | Java 102파일: 여러 줄 파라미터·중첩 타입·인터페이스 메서드 모두 정확. 남은 오류 3건 — enum 상수 목록이 1KB 한 줄로 나옴(`ErrorCode`), 레코드 본문 메서드 누락(`Tenant.isValid`), 중첩 레코드 2번 출력. MyBatis XML 정확. TS 객체 리터럴 멤버·`const X: React.FC` 정확. `SysMenuService` 15.6KB → 1.4KB | 사용 |
| `api` (0.1.2) | sys 4화면 API: GET 8개 행 수가 직접 curl 검증 값과 모두 일치, 같은 값 PUT 200, 검증 오류 400 메시지 표시, 로그인 실패를 원문으로 표시하고 중단 | 사용 |
| `api -t` | OMS는 Host(`kfstest.localhost`)로 테넌트를 판정해 `X-Tenant-Id`를 무시 → admin으로 호출됨 | 수정 필요: `-t`면 Host를 `{tenant}.localhost`로 |

0.1.1에서 api가 전부 401이던 원인은 로그인 경로(`/api/auth/login`, yunhee 기본값 `/api/v1/auth/login`)였다.

## 2차: src-index.py UI 섹션 vs prepare (`Sys05_Tab_CompanyUserRole`, 2026-10-01)

`tools/src-index.py`에 **`## UI` 절**을 추가했다 — 화면이 쓰는 클래스마다 레이아웃, 툴바 순서, 입력 위젯(콤보 서비스·빈칸 문구), 그리드 컬럼(필드·폭·헤더·종류·편집기, 체크박스·트리), 이벤트 → 메서드, 메서드 줄 범위·서비스 파라미터·메시지·세션 사용. LLM 없이 정규식·괄호 짝 파싱.

| | 색인 UI 절 | `yunhee prepare Sys05` |
|:---|:---|:---|
| 시간 | 2s (OMS 전체 색인 재생성, 화면 49개) | 37s (화면 1개 묶음) |
| 크기 | 화면 파일 5.8KB (그중 UI 4.0KB, 클래스 3개) | 2.2KB |
| 범위 | 이 화면 + 실제로 쓰는 클래스(Page, Sys01 Lookup)만 | Sys05 접두사 6화면·10파일 섞임(예산 초과로 잘림) |
| 그리드 컬럼 | 3그리드 11컬럼 모두 정확 (Boolean 종류, 권한조직 Lookup 편집기 포함) | 다른 화면 컬럼(재직구분·휴대폰번호…)이 섞이고 기본권한·관리자권한·권한조직 없음 |
| 서비스·SQL | 5개 정확 (+ 파라미터) | 이 화면이 안 쓰는 `selectByUserId`·`getAdminCheck` 포함, `sys04_role.selectByName`·`sys01_company.selectByName` 누락 |
| 이벤트·흐름 | 정확. 처음 1건 오해 소지(생성자 → retrieve()가 핸들러 안 호출이었음, 실제로는 최초 조회 없음) → 핸들러 안 호출은 메서드 요약에서 빼도록 고침 | 없음 |
| 환각 | 없음 (정적 추출) | 있음 |

- 변환에 읽은 원본: **122줄 / 4.5KB** (색인이 가리킨 메서드 4개 + `companyId` grep) — 화면 클래스 전체 565줄 / 20.4KB의 22%. 1차 3화면은 원본 약 970줄을 통째로 읽었다.
- 검증 중 찾은 빈틈 1건(빌더 메서드로 만든 그리드 필드의 이벤트 `treeGrid.expandAll()` 누락, Sys06_Tab_MenuView)도 고쳤다. 49개 화면 파일 중 그리드 40, 툴바 46개에서 추출됨.

**결론: `prepare`는 삭제해도 된다.** 화면 분석은 색인 화면 파일(서비스·SQL·테이블 + UI)로 대체되고, 더 빠르고(2s vs 37~127s) 정확하며(환각 없음) 원본 읽기를 약 1/5로 줄인다. `table --page`도 prepare의 mapper 색인에 기대는 기능이라 함께 정리하면 된다. `table <이름>`·`run`은 유지.

## prepare 측정

| 실행 | 시간 | 출력 | 정확도 |
|:---|---:|---:|:---|
| `prepare Sys06_Tab_MenuView` | 1s | 오류 | 화면 클래스명을 받지 않는다 ("파일을 찾지 못했습니다"). 파일명이 `<코드>_`로 시작하는 것만 찾는다 |
| `prepare Sys06` (기본 ASIS 경로) | — | — | **Asset-ERP(myApp)**를 읽는다. OMS는 `YUNHEE_ASIS_SRC_DIR=~/workspace26/Asset-OMS`를 줘야 한다 |
| `prepare Sys06` (OMS) | 47s | 1.9KB | Menu·MenuGuide·MenuView 3화면 + Edit/Lookup이 한 요약에 섞임. 컬럼은 `Sys06_Tab_Menu` 것. MenuView의 권한그룹·사원 호출(`sys04_role.selectByMenuId`, `sys05_user_role.selectByRoleId`) 없음. 예산 초과로 8/14 파일만 |
| `prepare Sys06 --two-stage` | 127s | 3.4KB | 14파일 전부 반영. "grounding 교정: `insertMenu`·`update`·`delete` 환각 → 교정됨"이라 해놓고 본문에 그대로 남아 있음. MenuView 고유 내용 여전히 없음 |
| `prepare Sys04` (OMS) | 30s | 1.7KB | 버튼↔SQL 오매핑 3건: 저장→`copyRole`(실제 `Sys04_Role.update`), 등록→`insertRole`(실제 클라이언트 행추가), 삭제→`selectById`(실제 `delete`). RoleAdmin의 고객사 그리드(`sys01_company.selectByName`)·고객명/기본권한/관리자권한 컬럼 누락 |

- 모든 실행에서 "연관 테이블 스키마 … 포함: 없음", "mapper_index_meta 없음" — mapper 색인이 OMS로 만들어져 있지 않다.
- 기존 캐시 `.yunhee/prep/ast01.md`에도 "Grid Columns (예시) ID / 자산 이름 / 소유자 / 등록일" 같은 일반화된 내용이 있다.

### 색인과 비교 (화면 1개 기준)

| | 색인 화면 파일 | prepare |
|:---|:---|:---|
| 크기 | 0.8~1.5KB | 1.7~3.4KB (여러 화면 합본) |
| 시간 | 즉시 (파일 읽기) | 30~127s |
| 서비스 → 서버 파일:줄 → SQL ID → 테이블 | 정확 (정적 분석) | 일부 누락·오매핑 |
| 화면 UI(컬럼·버튼·편집 컬럼) | 없음 → 원본 화면 파일을 읽음 | 있으나 다른 화면 것이 섞여 신뢰 불가 → 결국 원본을 읽음 |

이번 3화면에서 읽은 원본: 화면·부속 클래스 819줄 + 서버 메서드·SQL 약 150줄. prepare를 써도 이 양은 줄지 않았다.

## table 측정

- `yunhee table sys04_role`: 1s, 593B, DB 접속·LLM 없음. 내용은 `docs/as-is/db/tables/sys.md`의 같은 블록과 같다(둘 다 `.yunhee/asseterp-dbml.md`에서 나옴).
- `yunhee table --page Sys04`: "오류: 테이블 이름 또는 --page를 지정하세요" (지정했는데 나오는 오해 소지 있는 메시지 — mapper 색인이 비어 있는 것으로 보임). `--page Sys04_Tab_RoleAdmin`: 파일을 찾지 못함.

## run 측정

| 명령 | 결과 | 출력 |
|:---|:---|:---|
| `./bm.sh compile` ×3 | 성공 1.4~2.7s | 3줄 + (처음 1회) 로그 꼬리 10줄 |
| `npx tsc -b --noEmit` ×3 | 성공 6s | 3줄 |
| `gradle -p backend test` | 성공 6.4s | 3줄 + 꼬리 12줄 |
| `./deploy.sh` | 성공 22s | 3줄 + 꼬리 15줄 (원 출력 1.9KB) |

- 실행 디렉터리마다 `.yunhee/runs/`가 생긴다(`OMS/.yunhee`, `OMS/frontend/.yunhee`) — 루트 `.gitignore`의 `.yunhee`로 무시됨.
- 실패 시 Qwen 요약은 이번에 실패가 없어 확인하지 못했다.

## yunhee 쪽 개선 제안 (yunhee-cli)

1. `prepare`가 화면 클래스명(`Sys06_Tab_MenuView`)을 받아, 그 화면 + 실제로 쓰는 클래스만 읽게 한다 (`docs/as-is/src/.../screens/*.md`의 "함께 쓰는 클래스"를 그대로 쓰면 된다).
2. 서비스 → SQL ID는 LLM이 아니라 색인(정적 분석) 값을 그대로 넣고, LLM은 UI 요약만 하게 한다. grounding에서 환각으로 판정된 항목은 본문에서 지운다.
3. 프로젝트별 ASIS 경로(`.yunhee/project.json`에 `asis_src_dir`)를 두어 OMS/AssetERP를 env 없이 구분한다.
4. `table --page`는 mapper 색인이 없으면 그 사실을 오류로 알린다.

## CLAUDE.md 규칙 변경 제안 (승인 후 반영)

- 1번(화면 분석은 prepare): → "화면 분석은 `docs/as-is/src` 색인 우선. prepare는 위 1·2가 고쳐질 때까지 쓰지 않는다."
- 2번(table): 유지하되 "`docs/as-is/db/tables/*.md`와 같은 내용 — 둘 중 하나만 본다."
- 3번(run): 유지.
