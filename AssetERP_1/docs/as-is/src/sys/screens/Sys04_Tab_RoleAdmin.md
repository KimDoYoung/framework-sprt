# Sys04_Tab_RoleAdmin

- 종류: 화면
- 메뉴: 기초자료 > 50. 권한 > 권한그룹 관리 (#1112)
- 파일: `client/vi/sys/Sys04_Tab_RoleAdmin.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys01_Company.selectByName` | Sys04_Tab_RoleAdmin:166 | [`Sys01_Company.java:41`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByName`](../../sys/sql/sys01_company.md) |
| `sys.Sys04_Role.delete` | Sys04_Tab_RoleAdmin:241 | [`Sys04_Role.java:115`](../../sys/services/Sys04_Role.md) | `UpdateDataModel(sys04_role)` 동적 DELETE |
| `sys.Sys04_Role.selectByName` | Sys04_Tab_RoleAdmin:187 | [`Sys04_Role.java:24`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) |
| `sys.Sys04_Role.update` | Sys04_Tab_RoleAdmin:193 | [`Sys04_Role.java:56`](../../sys/services/Sys04_Role.md) | `UpdateDataModel(sys04_role)` 동적 INSERT/UPDATE → [`sys04_role.selectById`](../../sys/sql/sys04_role.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_company_nm`, `f_sysdate`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys04_Tab_RoleAdmin (`client/vi/sys/Sys04_Tab_RoleAdmin.java`, 247줄)

- 레이아웃: north=buttonBar, west=gridCompany, center=gridRole
- 툴바 `buttonBar`: 고객명: {searchText} {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `gridCompany` (buildGridCompany()):
  - companyName 200 "고객명" Text
  - locationName 150 "Sub-Domain" Text
- 그리드 `gridRole` (buildGridRole(), 체크박스(다중)):
  - companyName 150 "고객명" Text
  - roleName 200 "권한명" Text 편집:TextField
  - seq 70 "조회순서" Text 편집:TextField
  - defaultRole 70 "기본권한" Boolean
  - adminYn 70 "관리자권한" Boolean
  - note 500 "권한설명" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L52-90) → setting(), retrieve()
[E1] searchText.KeyPress [Enter] (L94) → retrieve()
[E2] gridCompany.RowClick (L103) → retrieveRole()
[E3] retrieveButton[조회].Select (L110) → retrieve()
[E4] updateButton[저장].Select (L116) → update()
[E5] insertButton[등록].Select (L122) → insertRow()
[E6] deleteButton[삭제].Select (L128) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L220) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L92-134 | 생성자 | 상태 처리 | 업무 |
| public buildGridCompany() | L136-144 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGridRole() | L146-159 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L162-175 | 생성자,E1,E3 | 서비스 sys.Sys01_Company.selectByName(useYn, companyName) | 업무 |
| private retrieveRole() | L177-188 | E2,retrieve | 미선택 시 alert "고객사를 선택하세요", 서비스 sys.Sys04_Role.selectByName(roleName, companyId) | 업무 |
| public update() | L191-194 | E4 | 서비스 sys.Sys04_Role.update | 업무 |
| public insertRow() | L197-209 | E5 | 미선택 시 alert "고객사를 선택하세요" | 업무 |
| private deleteChk() | L211-235 | E6 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L238-242 | E7 | GridDeleteData sys.Sys04_Role.delete(체크된 행 목록) | 업무 |
| private setHtmlBarStyle() | L244-246 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGridCompany = () => [
  gb.text('companyNm', 200, '고객명'),  // L140
  gb.text('locNm', 150, 'Sub-Domain'),  // L141
];

const buildGridRole = () => [
  gb.text('companyNm', 150, '고객명'),  // L151 SQL 계산 컬럼(selectByName: f_get_company_nm(sys04_company_id))
  gb.text('roleNm', 200, '권한명', { editor: 'text' }),  // L152
  gb.text('seq', 70, '조회순서', { editor: 'text' }),  // L153
  gb.boolean('defaultRole', 70, '기본권한'),  // L154
  gb.boolean('adminYn', 70, '관리자권한'),  // L155
  gb.text('note', 500, '권한설명', { editor: 'text' }),  // L156
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

