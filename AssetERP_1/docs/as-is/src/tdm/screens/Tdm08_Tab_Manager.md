# Tdm08_Tab_Manager

- 종류: 화면
- 메뉴: 책무 > 01. 기본정보 > 책무담당자 등록 (#1454)
- 파일: `client/vi/tdm/Tdm08_Tab_Manager.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm08_ManagerInfo.delete` | Tdm08_Tab_Manager:360 | [`Tdm08_ManagerInfo.java:56`](../../tdm/services/Tdm08_ManagerInfo.md) | `UpdateDataModel(tdm08_manager_info)` 동적 DELETE |
| `tdm.Tdm08_ManagerInfo.selectByCompanyId` | Tdm08_Tab_Manager:227 | [`Tdm08_ManagerInfo.java:23`](../../tdm/services/Tdm08_ManagerInfo.md) | [`tdm08_manager_info.selectByCompanyId`](../../tdm/sql/tdm08_manager_info.md) |
| `tdm.Tdm08_ManagerInfo.selectByManagerType` | Tdm08_Tab_Manager:243 | [`Tdm08_ManagerInfo.java:32`](../../tdm/services/Tdm08_ManagerInfo.md) | [`tdm08_manager_info.selectByManagerType`](../../tdm/sql/tdm08_manager_info.md) |
| `tdm.Tdm08_ManagerInfo.update` | Tdm08_Tab_Manager:283 | [`Tdm08_ManagerInfo.java:51`](../../tdm/services/Tdm08_ManagerInfo.md) | `UpdateDataModel(tdm08_manager_info)` 동적 INSERT/UPDATE → [`tdm08_manager_info.selectById`](../../tdm/sql/tdm08_manager_info.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today`, `getorg`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm08_Tab_Manager (`client/vi/tdm/Tdm08_Tab_Manager.java`, 371줄)

- 레이아웃: center=centerVlc, east=eastVlc
- 툴바 `buttonBarL`: 검색: {searchText} {retrieveButton}
- 툴바 `buttonBarR`: {insertRButton} {deleteRButton} {updateRButton}
- 입력·하위 화면: `searchText` TextField, `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - managerTypeName 130 "구분" TextCenter
  - orgName 250 "책무이행점검 수행부서" Text
  - personName 120 "부서책무담당자" TextCenter
- 그리드 `manageGrid` (manageBuildGrid()):
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - endDate 100 "적용종료일" Date 편집:MyDateField
  - personName 100 "성명" TextCenter 편집:lookupEmpInfo
  - posName 100 "직위" TextCenter
  - orgName 250 "본부(부서)" Text

#### 이벤트
[E0] 화면 열림 (생성자 L69-110) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L114) → retrieve()
[E2] retrieveButton[조회].Select (L123) → retrieve()
[E3] insertRButton[행 추가].Select (L130) → insert()
[E4] updateRButton[저장].Select (L136) → update()
[E5] deleteRButton[행 삭제].Select [YES] (L142) → delete()
[E6] msgBox.DialogHide [YES] (L151) → delete()
[E7] grid.SelectionChanged [managerInfoModel == null] (L169) → retrieve()
[E8] lookupEmpInfo.TriggerClick (L202) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public manageBuildGrid() | L197-217 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L219-233 | 생성자,E1,E2,E7,update,delete | 서비스 tdm.Tdm08_ManagerInfo.selectByCompanyId(companyId, searchText) | 업무 |
| public retrieve() | L235-249 | 생성자,E1,E2,E7,update,delete | 서비스 tdm.Tdm08_ManagerInfo.selectByManagerType(companyId, managerType, orgId) | 업무 |
| private update() | L251-289 | E4 | 서비스 tdm.Tdm08_ManagerInfo.update | 업무 |
| private isDateOverlap() | L291-311 | update | 상태 처리 | 업무 |
| private insert() | L313-325 | E3 | 상태 처리 | 업무 |
| private openLookupEmpInfo() | L327-354 | E8 | 조회창 Emp00_Lookup_SelectSingle 열기, 미선택 시 alert "시작일자를 입력해주세요." | 업무 |
| private delete() | L356-366 | E5,E6 | GridDeleteData tdm.Tdm08_ManagerInfo.delete(체크된 행 목록) | 업무 |
| private settings() | L112-183 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L185-195 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L368-370 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('managerTypeNm', 130, '구분'),  // L190 SQL 계산 컬럼(selectByCompanyId: manager_type_nm)
  gb.text('orgNm', 250, '책무이행점검 수행부서'),  // L191 SQL 계산 컬럼(selectByCompanyId: tdm08_org_nm)
  gb.textCenter('personNm', 120, '부서책무담당자'),  // L192 SQL 계산 컬럼(selectByCompanyId: tdm08_person_nm)
];

const manageBuildGrid = () => [
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L210
  gb.date('endDate', 100, '적용종료일', { editor: 'date' }),  // L211
  gb.textCenter('personNm', 100, '성명'),  // L212 SQL 계산 컬럼(selectByCompanyId: tdm08_person_nm)
  gb.textCenter('posNm', 100, '직위'),  // L213 SQL 계산 컬럼(selectByManagerType: f_cdnm('EmpPosCode', emp00_pos_cd, tdm0…)
  gb.text('orgNm', 250, '본부(부서)'),  // L214 SQL 계산 컬럼(selectByCompanyId: tdm08_org_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="addRow" onClick={insert}>행 추가</Button>
3. <Button type="removeRow" onClick={delete}>행 삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

