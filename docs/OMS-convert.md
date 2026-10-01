# OMS 변환 규칙 (AS-IS GWT/GXT → TOBE Spring Boot + React)

화면을 변환할 때마다 규칙을 다시 추론하지 않도록 대응 관계를 고정한다.
네이밍·레이어의 기본 규칙은 `docs/TOBE-Framework.md`와 `CLAUDE.md`를 따르고, 여기에는 AS-IS → TOBE 대응만 적는다.

## 0. 화면 하나 변환 순서

1. 색인을 연다: `docs/as-is/src/{도메인}/screens/{화면}.md` (서비스 → 서버 메서드 → SQL ID → 테이블)
2. 제외·수정 대상인지 확인한다: 화면 파일의 `⚠DB없음` 테이블 → 변환하지 않음. `docs/as-is/sql-check.md`에 화면이 있으면 그 SQL을 asseterpdb에 맞춘다.
3. 원본은 색인이 가리키는 파일·줄만 연다 (화면 클래스, 서버 메서드, 매퍼 SQL).
4. Backend → Frontend 순으로 만들고, 아래 화면 등록(§5)을 한다.
5. 확인: `gradle test`, `npx tsc -b --noEmit`, `./deploy.sh` 후 메뉴에서 열어 조회·저장·삭제.

## 1. 호출 (Client → Server)

| AS-IS | TOBE |
|:---|:---|
| `new ServiceRequest("sys.Sys04_Role.selectByName")` + `addParam` → `ServiceCall` | `apiClient.get('v1/sys/roles', { params })` (`frontend/src/api/{domain}.ts`) |
| `GridRetrieveData.retrieve("…select…")` | `GET /api/v1/{domain}/{resource}` → `ApiResponse<List<…Res>>` |
| `GridUpdate.update(store, "…update")` (변경된 행 목록) | `PUT /api/v1/{domain}/{resource}` body: 변경 행 목록 → 저장된 행 목록 반환 |
| `GridDeleteData` / `delete` (체크된 행) | `DELETE /api/v1/{domain}/{resource}` body: ID 목록 |
| 팝업 저장 `ServiceCall("…save")` (단건) | `POST`(신규) / `PUT /{id}`(수정) |
| `ServiceResult.getStatus() < 0` → `SimpleMessage.alert` | `ApiResponse.success=false` → axios 인터셉터/`errorMessage()`로 표시 (`api/client.ts`) |
| `InterfaceCallback` | `async/await` |

- URL 리소스는 AS-IS 서버 클래스의 테이블 이름을 복수형으로: `Sys04_Role` → `/api/v1/sys/roles`, `Sys06_Menu` → `/api/v1/sys/menus`.
- `apiClient`의 baseURL이 `api`(상대 경로)이므로 프론트 경로는 `v1/...`로 쓴다 (WAR `/OMS/` 하위에서도 동작).

## 2. 서버 (Backend)

| AS-IS | TOBE |
|:---|:---|
| `myOms.server.{dom}.{Cls}#method(SqlSession, ServiceRequest, ServiceResult)` | `kr.co.kfs.asseterp.oms.biz.{dom}` 의 `controller` / `service` / `mapper` / `dto`. **AS-IS 서버 클래스 1개 = TOBE `{Domain}{Resource}Controller/Service/Mapper` 1벌** (예: `Sys04_Role` → `SysRoleController`, `SysRoleService`, `SysRoleMapper` + `SysRoleMapper.xml`; `Sys06_Menu` → `SysMenu*`) |
| `request.getParam()`, `getLongParam("x")` (Map) | 요청 `record` DTO (`…SearchReq`, `…SaveReq`), MyBatis 파라미터도 `record` |
| `sqlSession.selectList(mapperName + ".id", map)` | `@Mapper` 인터페이스 메서드 + `resources/mapper/{Domain}Mapper.xml` |
| `result.setRetrieveResult(n, msg, list)` | `ApiResponse.ok(list)` |
| `GridDataModel` 하위 Model (client/server 공용) | 응답 `record` (`…Res`) — 화면에 필요한 컬럼만 |
| 예외·`result.setStatus(-1)` | `throw new BusinessException(ErrorCode.…)` → `GlobalExceptionHandler` |
| 트랜잭션: 서비스 브로커가 메서드 단위 commit | `@Transactional(readOnly = true)` 클래스 기본, 저장·삭제 메서드만 `@Transactional` |

- 메서드 접두사: 조회 `get`(단건)/`search`(목록), 등록 `create`, 수정·일괄저장 `update`, 삭제 `delete`.
- **SQL은 그대로 옮긴다.** 바꾸는 것은 `SELECT` 별칭(record 필드에 맞춤, `map-underscore-to-camel-case`)과 아래 §4 차이뿐.
  옮긴 SQL 위에 AS-IS 위치를 주석으로 남긴다 (예: `<!-- AS-IS sys04_role.selectByName -->`).
- **회사·사용자 조건은 서버에서 넣는다.** 클라이언트가 보낸 `companyId`를 믿지 않고 `@AuthenticationPrincipal UserPrincipal`에서 꺼낸다.

### 저장 (insert / update)

AS-IS sys·emp 화면은 `UpdateDataModel`이 컬럼 메타(`dbConfig.getColumnListTibero`)로 INSERT/UPDATE를 동적으로 만든다.
TOBE는 **테이블마다 명시적인 `insert` / `update` / `delete` SQL**을 매퍼에 둔다.

- 신규/수정 판단: 행의 ID가 없거나 0 이하(프론트 임시 음수 ID)면 INSERT, 아니면 UPDATE.
- 신규 ID: `<selectKey keyProperty="…Id" resultType="long" order="BEFORE">SELECT f_create_seq()</selectKey>` (AS-IS와 같은 시퀀스 함수, 모든 테이블 공통).
  AS-IS의 `getSeq`(행 추가 시 서버에서 ID를 미리 받아 옴)는 쓰지 않는다.
- 저장 후 `selectById`로 다시 읽어 저장된 행 목록을 돌려준다(시퀀스 ID·기본값 반영) — AS-IS `UpdateDataModel`과 같은 동작.
- PK 컬럼은 AS-IS 규칙대로 `{테이블}_id`.
- `sys01_company` INSERT 시 AS-IS가 부가 데이터(org01/org02/sys09)를 함께 넣던 처리는 해당 화면 변환 때 서비스에 명시적으로 옮긴다.

## 3. 세션 (`LoginUser` → `UserPrincipal`)

| AS-IS `LoginUser` | TOBE `UserPrincipal` (backend) / `User` (frontend `types/auth.ts`) |
|:---|:---|
| `getCompanyId()` | `companyId` |
| `getSubDomain()` | `companyCode` (sys01_loc_nm). 접속 테넌트는 `tenant` |
| `getUserId()` (사원 emp01_person_id) | `userId` (사원은 양수 emp01_person_id) |
| `getIsManager()` (회사관리자 sys02_user) | `userId < 0` (`LoginAccount.isEmployeeSessionId`), roles `ROLE_ADMIN` |
| `getEmpNo()` | `loginId` (사원은 사번) |
| `getUserName()` | `name` |
| `getOrgCodeId()` / `getParentCodeId()` | **미구현** — 지금은 `deptId`가 임시값(`asseterp.auth.default-dept-id`). 조직을 쓰는 화면을 변환할 때 발령(emp03_trans) 조회를 로그인에 추가한다 |
| `getToday()` / `getYear()` | 서버: SQL의 `f_sysdate()`/`f_today()`. 화면 기본값: `dayjs()` |

## 4. SQL을 asseterpdb에 맞출 때 (P2 결과, `docs/as-is/sql-check.md`)

| AS-IS | TOBE |
|:---|:---|
| `COLLATE "ko_KR.utf8"` | `COLLATE "ko-KR-x-icu"` (asseterpdb에 libc ko_KR 로케일이 없음) |
| `getPerson()` 결과의 `emp00_grade_nm` | asseterpdb `getPerson()`에는 `emp00_grade_cd`만 있다 → `f_cdnm(…, emp00_grade_cd, …)` 등으로 이름을 구한다 |
| `getOrg()` 결과의 `org00_seq` | `org00_sort_order` |
| `<choose>`의 Tibero 분기(`${isTibero}`) | 버리고 PostgreSQL 분기만 옮긴다 |
| `mst01/02/06/07/08`, `tgt01/02`, `tb_ord_mst` | 테이블 없음 → 그 화면은 변환하지 않는다 |

## 5. 화면 (Frontend)

| AS-IS | TOBE |
|:---|:---|
| `client/vi/{dom}/{Xxx}_Tab_{Name}.java` (GXT 탭) | `frontend/src/pages/{dom}/{Xxx}{Name}View.tsx` (예: `pages/sys/Sys04RoleView.tsx`) |
| `MenuOpener.TAB_REGISTRY.put("Sys04_Tab_Role", …)` | 화면 등록표: `sys06_class_nm` → 컴포넌트 (`MainFrame` 탭 factory가 메뉴의 `classNm`으로 찾고, 없으면 `PendingScreenView`) |
| GXT `Grid` + `GridBuilder` | AG Grid (`LargeDataView` 패턴: 외부 스크롤 없이 그리드 내부 가상 스크롤) |
| 검색바 `OmsTextField` + `OmsButton(조회/초기화/저장/행추가/삭제/등록)` | antd `Form`(inline) + `Button`. 버튼 구성·순서는 AS-IS 그대로 |
| `*_Popup_*` / `*_Lookup_*` (Window) | antd `Modal` + `Form` |
| `Model` / `ModelProperties` | `types/{domain}.ts` 의 interface (API 응답 record와 같은 필드) |
| 탭 진입 시 `retrieve()` | `useEffect`로 최초 조회 |

### 그리드 CRUD 동작 (AS-IS `doc/OMS-그리드베이스-CRUD.md`, `crud_pattern_1/2.md`)

- 조회: 서버 ORDER BY 그대로. 초기화: 검색 조건 비우고 다시 조회.
- 행추가: 선택 행 바로 아래에 임시 음수 ID(-1, -2, …) 행 추가 → 편집 가능 상태.
- 저장: 추가·변경된 행만 `PUT`. 응답의 저장된 행으로 임시 행을 **제자리에서** 교체(재조회하지 않아 위치 유지).
- 삭제: 체크된 행 `DELETE` (확인 대화상자). 임시 행은 서버 호출 없이 제거.
- 편집: 편집 가능한 컬럼은 파란색, 더블클릭(또는 클릭)으로 편집, **Enter → 아래 행 같은 컬럼, Tab → 오른쪽 셀**.
- 등록(팝업형, crud_pattern_2): 행 오른쪽 수정/삭제 아이콘, 팝업 저장 후 재조회.
- 이 동작은 **첫 레퍼런스 화면에서 공통 훅/컴포넌트로 만들고**, 이후 화면은 그것을 쓴다. 만든 뒤 여기에 이름과 사용법을 적는다.

## 6. 하지 않는 것

- 테이블·DB 함수를 새로 만들지 않는다 (asseterpdb 고정, omsdb 사용 안 함).
- AS-IS SQL을 "개선"하지 않는다. asseterpdb에서 안 도는 부분(§4)만 고친다.
- GWT UI 레이아웃 세부를 코드로 옮기려 하지 않는다. 필요하면 AS-IS 화면 스크린샷(`docs/asis-oms/`)을 본다.
