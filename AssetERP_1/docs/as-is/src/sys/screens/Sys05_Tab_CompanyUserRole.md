# Sys05_Tab_CompanyUserRole

- 종류: 화면
- 메뉴: 기초자료 > 50. 권한 > 고객사별 사용자권한그룹 관리 (#1307)
- 파일: `client/vi/sys/Sys05_Tab_CompanyUserRole.java`
- 함께 쓰는 클래스 1개:
  - `Sys05_Page_CompanyUserRole` `client/vi/sys/Sys05_Page_CompanyUserRole.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md), [`Sys01_Lookup_SelectSingle`](../../sys/components/Sys01_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys04_Role.selectByName` | Sys05_Tab_CompanyUserRole:139 | [`Sys04_Role.java:24`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) |
| `sys.Sys05_UserRole.delete` | Sys05_Page_CompanyUserRole:245 | [`Sys05_UserRole.java:60`](../../sys/services/Sys05_UserRole.md) | `UpdateDataModel(sys05_user_role)` 동적 DELETE |
| `sys.Sys05_UserRole.selectByRoleId` | Sys05_Page_CompanyUserRole:148 | [`Sys05_UserRole.java:23`](../../sys/services/Sys05_UserRole.md) | [`sys05_user_role.selectByRoleId`](../../sys/sql/sys05_user_role.md) |
| `sys.Sys05_UserRole.update` | Sys05_Page_CompanyUserRole:219 | [`Sys05_UserRole.java:55`](../../sys/services/Sys05_UserRole.md) | `UpdateDataModel(sys05_user_role)` 동적 INSERT/UPDATE → [`sys05_user_role.selectById`](../../sys/sql/sys05_user_role.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_code_seq`, `f_get_company_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_seq`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys05_Tab_CompanyUserRole (`client/vi/sys/Sys05_Tab_CompanyUserRole.java`, 153줄)

- 레이아웃: west=cp, center=companyUserRolePage
- 툴바 `buttonBar`: 회사명: {companyName} 권한명: {roleName} {retrieveButton}
- 입력·하위 화면: `companyName` LookupTriggerField, `roleName` TextField, `companyUserRolePage` Sys05_Page_CompanyUserRole, `lookup` Sys01_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - roleName 150 "권한명" Text
  - defaultRole 100 "기본권한" Boolean
  - adminYn 100 "관리자권한" Boolean
  - note 550 "권한설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L42-116) → 초기화
[E1] retrieveButton[조회].Select (L47) → retrieve()
[E2] companyName.TriggerClick [result != null] (L56) → retrieve()
[E3] grid.SelectionChanged (L89) → retrieveUserRole()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveUserRole() | L128-133 | E3 | 상태 처리 | 업무 |
| private retrieve() | L135-147 | E1,E2 | 서비스 sys.Sys04_Role.selectByName(roleName, companyId) | 업무 |
| private buildGrid() | L118-126 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L149-151 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 150, '권한명'),  // L121
  gb.boolean('defaultRole', 100, '기본권한'),  // L122
  gb.boolean('adminYn', 100, '관리자권한'),  // L123
  gb.text('note', 550, '권한설명'),  // L124
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys05_Page_CompanyUserRole (`client/vi/sys/Sys05_Page_CompanyUserRole.java`, 252줄)

- 툴바 `buttonBar`: 권한별 사원정보: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookup` Org00_Lookup_SelectSingle, `lookupOrgInfo` LookupTriggerField, `popup` Emp01_Lookup_PersonModel
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 160 "조직" Text
  - titleName 100 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 80 "성명" Text
  - parentFullName 200 "권한조직" Text 편집:lookupOrgInfo

#### 이벤트
[E0] 화면 열림 (생성자 L51-91) → 초기화
[E1] retrieveButton[조회].Select (L53) → retrieve()
[E2] insertButton[등록].Select (L60) → insertRow()
[E3] updateButton[저장].Select (L67) → update()
[E4] deleteButton[삭제].Select (L74) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L225) → deleteRow()
[E5] lookupOrgInfo.TriggerClick (L123) → lookupOrgInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupOrgInfo() | L93-108 | E5 | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| private retrieve() | L134-136 | E1 | 상태 처리 | 업무 |
| public retrieve() | L138-150 | E1 | 서비스 sys.Sys05_UserRole.selectByRoleId(roleId) | 업무 |
| public retrieve() | L152-165 | E1 | 서비스 sys.Sys05_UserRole.selectByRoleId(roleId) | 업무 |
| private insertRow() | L167-215 | E2 | 조회창 Emp01_Lookup_PersonModel 열기 | 업무 |
| public update() | L217-220 | E3 | 서비스 sys.Sys05_UserRole.update | 업무 |
| private deleteChk() | L222-240 | E4 | ConfirmBox → E6 | 업무 |
| private deleteRow() | L242-246 | E6 | GridDeleteData sys.Sys05_UserRole.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L111-132 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L248-250 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 160, '조직'),  // L116
  gb.text('titleNm', 100, '직책'),  // L117
  gb.text('empNo', 80, '사번'),  // L118
  gb.text('korNm', 80, '성명'),  // L119
  gb.text('parentFullNm', 200, '권한조직'),  // L129
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

