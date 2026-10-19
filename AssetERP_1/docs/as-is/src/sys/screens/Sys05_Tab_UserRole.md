# Sys05_Tab_UserRole

- 종류: 화면
- 메뉴: 관리자 > 01. 화면권한관리 > 권한그룹별 사용자 맵핑 (#1071)
- 파일: `client/vi/sys/Sys05_Tab_UserRole.java`
- 함께 쓰는 클래스 1개:
  - `Sys05_Page_UserRole` `client/vi/sys/Sys05_Page_UserRole.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys04_Role.selectByName` | Sys05_Tab_UserRole:106 | [`Sys04_Role.java:24`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) |
| `sys.Sys05_UserRole.delete` | Sys05_Page_UserRole:236 | [`Sys05_UserRole.java:60`](../../sys/services/Sys05_UserRole.md) | `UpdateDataModel(sys05_user_role)` 동적 DELETE |
| `sys.Sys05_UserRole.selectByRoleId` | Sys05_Page_UserRole:149 | [`Sys05_UserRole.java:23`](../../sys/services/Sys05_UserRole.md) | [`sys05_user_role.selectByRoleId`](../../sys/sql/sys05_user_role.md) |
| `sys.Sys05_UserRole.update` | Sys05_Page_UserRole:210 | [`Sys05_UserRole.java:55`](../../sys/services/Sys05_UserRole.md) | `UpdateDataModel(sys05_user_role)` 동적 INSERT/UPDATE → [`sys05_user_role.selectById`](../../sys/sql/sys05_user_role.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_code_seq`, `f_get_company_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_seq`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys05_Tab_UserRole (`client/vi/sys/Sys05_Tab_UserRole.java`, 120줄)

- 레이아웃: west=cp, center=userRolePage
- 툴바 `buttonBar`: 권한명: {roleName} {retrieveButton}
- 입력·하위 화면: `roleName` TextField, `userRolePage` Sys05_Page_UserRole
- 그리드 `grid` (buildGrid()):
  - roleName 200 "권한명" Text
  - note 550 "권한설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L35-83) → retrieve()
[E1] retrieveButton[조회].Select (L40) → retrieve()
[E2] grid.SelectionChanged (L56) → retrieveUserRole()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveUserRole() | L95-100 | E2 | 상태 처리 | 업무 |
| private retrieve() | L102-114 | 생성자,E1 | 서비스 sys.Sys04_Role.selectByName(roleName, companyId) | 업무 |
| private buildGrid() | L85-93 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L116-118 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 200, '권한명'),  // L88
  gb.text('note', 550, '권한설명'),  // L91
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys05_Page_UserRole (`client/vi/sys/Sys05_Page_UserRole.java`, 243줄)

- 툴바 `buttonBar`: 권한별 사원정보: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookup` Org00_Lookup_SelectSingle, `lookupOrgInfo` LookupTriggerField, `popup` Emp01_Lookup_PersonModel
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 160 "조직" Text
  - titleName 100 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 80 "성명" Text
  - parentFullName 200 "권한조직" Text 편집:lookupOrgInfo

#### 이벤트
[E0] 화면 열림 (생성자 L50-90) → 초기화
[E1] retrieveButton[조회].Select (L52) → retrieve()
[E2] insertButton[등록].Select (L59) → insertRow()
[E3] updateButton[저장].Select (L66) → update()
[E4] deleteButton[삭제].Select (L73) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L216) → deleteRow()
[E5] lookupOrgInfo.TriggerClick (L122) → lookupOrgInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupOrgInfo() | L92-107 | E5 | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| private retrieve() | L133-135 | E1 | 상태 처리 | 업무 |
| public retrieve() | L137-156 | E1 | 서비스 sys.Sys05_UserRole.selectByRoleId(roleId) | 업무 |
| private insertRow() | L158-206 | E2 | 조회창 Emp01_Lookup_PersonModel 열기 | 업무 |
| public update() | L208-211 | E3 | 서비스 sys.Sys05_UserRole.update | 업무 |
| private deleteChk() | L213-231 | E4 | ConfirmBox → E6 | 업무 |
| private deleteRow() | L233-237 | E6 | GridDeleteData sys.Sys05_UserRole.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L110-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L239-241 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 160, '조직'),  // L115
  gb.text('titleNm', 100, '직책'),  // L116
  gb.text('empNo', 80, '사번'),  // L117
  gb.text('korNm', 80, '성명'),  // L118
  gb.text('parentFullNm', 200, '권한조직'),  // L128
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

