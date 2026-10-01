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
- 응답·파라미터 `record`는 **컬럼 이름**으로 매핑된다(`mybatis.configuration.arg-name-based-constructor-auto-mapping=true` + `map-underscore-to-camel-case`). SELECT 별칭을 record 필드의 snake_case로 맞추면 되고 컬럼 순서는 상관없다.
- AS-IS 서버 클래스 이름이 TOBE에서 겹치면(예: `Org00_OrgInfo`(조직 Lookup) ↔ `Org02_Info`(조직 이력)) 뒤의 것을 내용으로 이름 짓는다 → `OrgHistory*`. 클래스 주석에 AS-IS 이름을 적는다.
- **SQL은 그대로 옮긴다.** 바꾸는 것은 `SELECT` 별칭(record 필드에 맞춤, `map-underscore-to-camel-case`)과 아래 §4 차이뿐.
  옮긴 SQL 위에 AS-IS 위치를 주석으로 남긴다 (예: `<!-- AS-IS sys04_role.selectByName -->`).
- **전 고객사 데이터를 다루는 화면**(관리자 > 고객관리: 메뉴 관리, 회사별 메뉴맵핑, 고객사 관리 …)은 회사 조건이 없으므로 `@PreAuthorize("hasRole('SYSADMIN')")` — admin 테넌트의 KFS 관리자(회사 `admin`)만. AS-IS는 메뉴 권한으로만 막았다.
- **회사·사용자 조건은 서버에서 넣는다.** 클라이언트가 보낸 `companyId`를 믿지 않고 `@AuthenticationPrincipal UserPrincipal`에서 꺼낸다.

### 저장 (insert / update)

AS-IS sys·emp 화면은 `UpdateDataModel`이 컬럼 메타(`dbConfig.getColumnListTibero`)로 INSERT/UPDATE를 동적으로 만든다.
TOBE는 **테이블마다 명시적인 `insert` / `update` / `delete` SQL**을 매퍼에 둔다.

- 신규/수정 판단: 행의 ID가 없거나 0 이하(프론트 임시 음수 ID)면 INSERT, 아니면 UPDATE.
- 신규 ID: 매퍼 `selectNextId`(`SELECT f_create_seq()`, AS-IS와 같은 시퀀스 함수)로 받아 INSERT 파라미터 record에 넣는다. 파라미터가 `record`(불변)라 `<selectKey>`는 쓰지 않는다.
- UPDATE는 화면에서 편집하는 컬럼만 SET하고 `WHERE {pk} AND {회사 컬럼} = 로그인 회사`. 수정 0건이면 `ErrorCode.DATA_NOT_FOUND`. DELETE도 회사 조건을 붙인다.
- 필수값 검사는 서비스에서 `BusinessException(ErrorCode.INVALID_INPUT, "…")`.
- `'true'/'false'` 문자열 컬럼은 SELECT에서 `COALESCE(col = 'true', false) AS …`로 boolean으로 내린다.
  AS-IS의 `getSeq`(행 추가 시 서버에서 ID를 미리 받아 옴)는 쓰지 않는다.
- 저장 후 `selectById`로 다시 읽어 저장된 행 목록을 돌려준다(시퀀스 ID·기본값 반영) — AS-IS `UpdateDataModel`과 같은 동작.
- PK 컬럼은 AS-IS 규칙대로 `{테이블}_id`.
- `sys01_company` INSERT 시 AS-IS가 부가 데이터(org01/org02/sys09)를 함께 넣던 처리는 `SysCompanyService.createCompany`에 옮겼다 (최상위 조직 10000 + 기본 공통코드).
- asseterpdb에만 있는 NOT NULL 컬럼(예: `sys01_biz_no`)은 입력 항목으로 추가하고, AS-IS에만 있는 컬럼(예: `sys01_icam_company_type`)은 뺀다. 화면 주석에 남긴다.

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
| `common.org00_org_info(_with)` / `common.emp00_trans_info` 를 Long 파라미터로 include (회사 0으로 `getOrg(0, …)`/`getPerson(0, …)`) | asseterpdb에는 회사 0 조직만 나와 결과가 빈다 → **로그인 회사 ID**를 넘긴다 (조각은 매퍼에 펼쳐 넣는다) |

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
- 공통 훅: **`frontend/src/hooks/useGridCrud.ts`** (레퍼런스 `pages/sys/Sys04RoleView.tsx`).
  ```tsx
  const crud = useGridCrud<Role>({ idField: 'roleId', search, save: sysApi.updateRoles, remove: sysApi.deleteRoles,
                                   newRow, firstEditField: 'roleNm', validate, deleteConfirm: '…' });
  useEffect(() => { crud.retrieve(); }, []);
  <AgGridReact<Role> ref={crud.gridRef} columnDefs={cols} {...crud.gridProps} />   // 버튼: crud.retrieve / saveRows / addRow / deleteChecked
  ```
  - `search`·`newRow`·`validate`는 `useCallback`으로 감싼다(검색 조건이 바뀔 때만 새로 만든다). `save`는 변경 행 → 저장된 행(**요청 순서**)을 돌려줘야 제자리 교체가 된다.
  - 편집 컬럼은 `editableCol({...})`(파란 글자). 체크박스 선택·Enter/Tab 이동·로딩 표시는 `gridProps`에 들어 있다.
  - API 함수는 `api/{domain}.ts`에서 저장 시 응답 record의 편집 필드만 골라 보낸다(`updateRoles` 참고).
- 화면 등록: `frontend/src/pages/screens.ts`의 `SCREENS`에 `'{AS-IS 클래스}': 컴포넌트`를 추가하면 메뉴에서 열린다.

### 공통 부품 (2번 묶음에서 추가)

| 부품 | AS-IS | 사용 |
|:---|:---|:---|
| `hooks/useTreeGrid.tsx` | GXT `TreeGrid` | AG Grid Community에 treeData가 없어 **외부 필터로 접기/펼치기**. 서버는 깊이 우선 순서 + `level` 평평한 목록을 준다. `tree.treeCol(col)`, `{...tree.gridProps}`, `expandAll/collapseAll/reveal/ancestors/descendants`. 레퍼런스 `Sys07RoleMenuView` |
| `components/lookup/PersonLookup` | `Emp01_Lookup_PersonModel` | 사원 다중 선택 → `crud.addRows(list.map(…))`. API `GET v1/emp/trans` |
| `components/lookup/OrgLookup` | `Org00_Lookup_SelectSingle`(기본 모드) | 조직 단일 선택(더블클릭) → `crud.updateRow(id, patch)`. API `GET v1/org/org-infos` |
| `components/sys/RoleSelectList` | Sys05/Sys07 왼쪽 권한그룹 그리드 | 권한명 검색 + 첫 행 자동 선택 → `onSelect(role)` |
| 마스터-디테일 레이아웃 | `BorderLayoutContainer` west/center, south | antd `Splitter`(가로/`layout="vertical"`). 디테일은 `useEffect([master])`에서 `crud.retrieve()` |

- `components/sys/MenuCheckTree` (3번 묶음): 메뉴 트리 + 권한 체크(켜면 상위도, 하위는 같은 값) + 바꾼 행만 저장. `load`/`save`/`nameField`/`checkField`만 넘긴다 (`Sys07RoleMenuView`, `Sys03CompanyMenuView`).
- `components/sys/CompanySelectList`: 고객사 검색 + 첫 행 선택 (SYSADMIN 화면의 왼쪽).
- 편집 팝업(CRUD 팝업형): antd `Modal` + `Form`, 신규 `POST` / 수정 `PUT /{id}` / 삭제 `DELETE /{id}`, 저장 후 재조회하고 그 행을 펼쳐 선택 (`pages/sys/sys06/MenuEditModal`).
- 4번 묶음 공통 부품: `hooks/useLoginUser`(`useLoginUser()`, `isSysAdmin(user)` — 버튼 비활성용, 실제 검사는 서버), `components/lookup/CompanyLookup`(단일/`multiple`), `components/lookup/CodeLookup`(코드 다중 선택), `components/sys/CodeGrid`(코드종류의 코드 CRUD).
- 회사를 고르는 화면(KFS 관리자가 다른 회사 데이터를 볼 때): 프론트는 `companyId`를 보내고 서버는 `SysCodeService.companyOf(user, companyId)` — SYSADMIN이 아니면 로그인 회사로 바꾼다.
- 공통코드 콤보: `components/common/CodeSelect`(`kindCd="OrgLevelCode"`), 코드명 표시가 필요하면 `loadCodes(kindCd)`(캐시). API `GET v1/sys/codes/by-kind` (AS-IS `ComboBoxField` → `sys09_code.selectByCodeKind`).
- 이력(기준일) 트리: 서버가 재귀 CTE의 `depth`로 `level`을, `ORDER BY path`로 깊이 우선 순서를 준다 → `useTreeGrid` 그대로 (`Org01OrgCodeView`).
- 7번 묶음: `hooks/useCodes(kindCd)` → `{ codes, nameOf }` (그리드 코드 콤보 컬럼: `cellEditor: 'agSelectCellEditor'`, `values: codes.map(c => c.code)`, `valueFormatter: p => nameOf(p.value)`). `OrgLookup`의 `baseDate`는 기준일 고정(AS-IS `openFixDate`). `useGridCrud`의 `reloadAfterSave`(저장 응답이 목록 전체일 때), `onChanged`(저장·삭제 후 다른 영역 갱신).
- 파일(사진·엑셀 템플릿/업로드, AS-IS `FileUpload`/`ExcelUpload` 서블릿)은 공통 파일 정책(sys10) 결정 전까지 변환하지 않는다. 목록 다운로드는 AG Grid `exportDataAsCsv`로 대체.
- 일자 컬럼: SELECT에서 `::date` → record `LocalDate` → JSON `yyyy-MM-dd`, AG Grid `cellDataType: 'dateString'`.
- 체크 매핑(권한 Y/N 토글) 화면은 `useGridCrud` 대신 `dirty` Set + 저장 후 서버 응답으로 교체(`Sys05PersonRoleView`, `Sys07RoleMenuView`).
- 매핑 저장 시 상위 키(권한그룹 등)가 로그인 회사 것인지 서비스에서 확인한다(`SysRoleService.requireRole`). 유니크 위반은 `DuplicateKeyException` → `ErrorCode.DUPLICATE_DATA`.

## 6. 하지 않는 것

- 테이블·DB 함수를 새로 만들지 않는다 (asseterpdb 고정, omsdb 사용 안 함).
- AS-IS SQL을 "개선"하지 않는다. asseterpdb에서 안 도는 부분(§4)만 고친다.
- GWT UI 레이아웃 세부를 코드로 옮기려 하지 않는다. 필요하면 AS-IS 화면 스크린샷(`docs/asis-oms/`)을 본다.
