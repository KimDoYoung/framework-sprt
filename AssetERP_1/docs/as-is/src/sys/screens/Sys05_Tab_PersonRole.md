# Sys05_Tab_PersonRole

- 종류: 화면
- 메뉴: 관리자 > 01. 화면권한관리 > 사용자별 권한그룹 맵핑 (#1072)
- 파일: `client/vi/sys/Sys05_Tab_PersonRole.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Sys05_Tab_PersonRole:212 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `sys.Sys04_Role.selectByUserId` | Sys05_Tab_PersonRole:171 | [`Sys04_Role.java:40`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByUserId`](../../sys/sql/sys04_role.md) |
| `sys.Sys04_Role.updateUserRole` | Sys05_Tab_PersonRole:233 | [`Sys04_Role.java:61`](../../sys/services/Sys04_Role.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys04_role.selectByUserId`](../../sys/sql/sys04_role.md), `UpdateDataModel(sys05_user_role)` 동적 INSERT/UPDATE → [`sys05_user_role.selectById`](../../sys/sql/sys05_user_role.md), `UpdateDataModel(sys05_user_role)` 동적 DELETE |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_company_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys05_Tab_PersonRole (`client/vi/sys/Sys05_Tab_PersonRole.java`, 253줄)

- 레이아웃: center=vlc, south=cp
- 툴바 `buttonBar`: 사원검색: {searchText} 재직구분: {workTypeCode} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `workTypeCode` StringComboBox
- 그리드 `userGrid` (buildUserGrid(), 체크박스):
  - orgKorName 200 "부서명" Text
  - titleName 100 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 100 "성명" Text
  - posName 100 "직위" Text
  - kindName 80 "사원구분" Text
  - mobileTelNo 120 "헨드폰번호" Text
  - emailAddress 200 "이메일주소" Text
- 그리드 `userRoleGrid` (buildRoleGrid(), 체크박스):
  - roleName 200 "권한명" Text
  - userRoleYn 40 "권한" Boolean
  - seq 80 "순서" Text
  - note 600 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L53-127) → retrieve()
[E1] retrieveButton[조회].Select (L64) → retrieve()
[E2] searchText.KeyPress [Enter] (L70) → retrieve()
[E3] userGrid.SelectionChanged (L97) → retrieveUserRole()
[E4] updateButton[저장].Select (L109) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildUserGrid() | L129-147 | 필드 초기화 | 상태 처리 | 업무 |
| public buildRoleGrid() | L149-160 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieveUserRole() | L163-176 | E3 | 서비스 sys.Sys04_Role.selectByUserId(userId, companyId) | 업무 |
| public retrieve() | L180-222 | 생성자,E1,E2 | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transCode) | 업무 |
| public update() | L225-239 | E4 | 미선택 시 alert "선택된 사원이 없습니다", 서비스 sys.Sys04_Role.updateUserRole(userId, companyId) | 업무 |
| public insertRow() | L242-243 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L246-247 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L249-251 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildUserGrid = () => [
  gb.text('korNm', 200, '부서명'),  // L135
  gb.text('titleNm', 100, '직책'),  // L136
  gb.text('empNo', 80, '사번'),  // L137
  gb.text('korNm', 100, '성명'),  // L138
  gb.text('posNm', 100, '직위'),  // L139
  gb.text('kindNm', 80, '사원구분'),  // L140
  gb.text('mobileTelno', 120, '헨드폰번호'),  // L143
  gb.text('emailAddr', 200, '이메일주소'),  // L144
];

const buildRoleGrid = () => [
  gb.text('roleNm', 200, '권한명'),  // L154
  gb.boolean('userRoleYn', 40, '권한'),  // L155 SQL 계산 컬럼(selectByUserId: case when sys05_user_role_id is null th…)
  gb.text('seq', 80, '순서'),  // L156
  gb.text('note', 600, '비고'),  // L157
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

