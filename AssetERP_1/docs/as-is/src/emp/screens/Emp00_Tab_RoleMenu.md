# Emp00_Tab_RoleMenu

- 종류: 화면
- 메뉴: 관리자 > 01. 화면권한관리 > 사원별 메뉴권한(View) (#1283)
- 파일: `client/vi/emp/Emp00_Tab_RoleMenu.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys05_Lookup_PersonRole`](../../sys/components/Sys05_Lookup_PersonRole.md), [`Sys07_Tree_PersonRoleMenu`](../../sys/components/Sys07_Tree_PersonRoleMenu.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Emp00_Tab_RoleMenu:133 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_Tab_RoleMenu (`client/vi/emp/Emp00_Tab_RoleMenu.java`, 144줄)

- 레이아웃: west=cp, center=meneTree
- 툴바 `buttonBar`: 기준일: {baseDateField} 조직/직무/성명: {findTextField} {retrieveButton} {retrieveButton}
- 입력·하위 화면: `baseDateField` MyDateField, `findTextField` TextField, `meneTree` Sys07_Tree_PersonRoleMenu, `lookup` Sys05_Lookup_PersonRole
- 그리드 `grid` (buildGrid(), 체크박스):
  - parentFullName 350 "조직" Text
  - titleName 120 "직책" Text
  - empNo 100 "사번" TextCenter
  - empKorName 100 "성명" TextCenter
  - actionCell 60 "그룹" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L44-80) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L89) → retrieve()
[E2] grid.SelectionChanged (L95) → 인라인 L95-101 (new SelectionChangedHandler<Emp00_Tra…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L124-139 | 생성자,E1 | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode) | 업무 |
| private settings() | L82-102 | 생성자 | 이벤트 연결, 초기값: baseDateField=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L104-122 | 필드 초기화 | 조회창 Sys05_Lookup_PersonRole 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L141-143 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 350, '조직'),  // L115
  gb.text('titleNm', 120, '직책'),  // L116
  gb.textCenter('empNo', 100, '사번'),  // L117
  gb.textCenter('korNm', 100, '성명'),  // L118
  // ⚠ 대응 없음 (GridBuilder L119) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

