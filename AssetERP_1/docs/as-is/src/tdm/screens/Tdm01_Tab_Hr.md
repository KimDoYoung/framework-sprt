# Tdm01_Tab_Hr

- 종류: 화면
- 메뉴: 책무 > 01. 기본정보 > 임원 등록 (#1411)
- 파일: `client/vi/tdm/Tdm01_Tab_Hr.java`
- 함께 쓰는 클래스 2개:
  - `Tdm03_Lookup_AddTitle` `client/vi/tdm/Tdm03_Lookup_AddTitle.java`
  - `Tdm01_Lookup_HrChangeInfo` `client/vi/tdm/Tdm01_Lookup_HrChangeInfo.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp07_Career.delete` | Tdm03_Lookup_AddTitle:365 | [`Emp07_Career.java:38`](../../emp/services/Emp07_Career.md) | `UpdateDataModel(emp07_career)` 동적 DELETE |
| `emp.Emp07_Career.selectByPersonId` | Tdm03_Lookup_AddTitle:211 | [`Emp07_Career.java:20`](../../emp/services/Emp07_Career.md) | [`emp07_career.selectByPersonId`](../../emp/sql/emp07_career.md) |
| `emp.Emp07_Career.update` | Tdm03_Lookup_AddTitle:332 | [`Emp07_Career.java:33`](../../emp/services/Emp07_Career.md) | `UpdateDataModel(emp07_career)` 동적 INSERT/UPDATE → [`emp07_career.selectById`](../../emp/sql/emp07_career.md) |
| `tdm.Tdm01_Hr.selectByCompanyId` | Tdm01_Tab_Hr:129 | [`Tdm01_Hr.java:27`](../../tdm/services/Tdm01_Hr.md) | [`tdm01_hr.selectByCompanyId`](../../tdm/sql/tdm01_hr.md) |
| `tdm.Tdm01_Hr.selectPersonModifyed` | Tdm01_Lookup_HrChangeInfo:132 | [`Tdm01_Hr.java:37`](../../tdm/services/Tdm01_Hr.md) | [`tdm01_hr.selectPersonModifyed`](../../tdm/sql/tdm01_hr.md) |
| `tdm.Tdm01_Hr.updateHrInfo` | Tdm01_Lookup_HrChangeInfo:165 | [`Tdm01_Hr.java:42`](../../tdm/services/Tdm01_Hr.md) | [`emp00_trans_info.selectGetPersonByPersonId`](../../emp/sql/emp00_trans_info.md), [`tdm01_hr.insert`](../../tdm/sql/tdm01_hr.md), [`tdm01_hr.selectByPersonId`](../../tdm/sql/tdm01_hr.md), [`tdm01_hr.updateEndDate`](../../tdm/sql/tdm01_hr.md), [`tdm01_hr.updateHrChange`](../../tdm/sql/tdm01_hr.md), [`tdm02_hr_record.insert`](../../tdm/sql/tdm02_hr_record.md) |
| `tdm.Tdm03_AddTitle.delete` | Tdm03_Lookup_AddTitle:354 | [`Tdm03_AddTitle.java:31`](../../tdm/services/Tdm03_AddTitle.md) | `UpdateDataModel(tdm03_add_title)` 동적 DELETE |
| `tdm.Tdm03_AddTitle.selectByPersonId` | Tdm03_Lookup_AddTitle:206 | [`Tdm03_AddTitle.java:21`](../../tdm/services/Tdm03_AddTitle.md) | [`tdm03_add_title.selectByPersonId`](../../tdm/sql/tdm03_add_title.md) |
| `tdm.Tdm03_AddTitle.update` | Tdm03_Lookup_AddTitle:255 | [`Tdm03_AddTitle.java:26`](../../tdm/services/Tdm03_AddTitle.md) | `UpdateDataModel(tdm03_add_title)` 동적 INSERT/UPDATE → [`tdm03_add_title.selectById`](../../tdm/sql/tdm03_add_title.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp07_career`](../../../db/tables/emp.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm02_hr_record`](../../../db/tables/tdm.md), [`tdm03_add_title`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_tdmpersoninfo`, `f_sysdate`, `f_today`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm01_Tab_Hr (`client/vi/tdm/Tdm01_Tab_Hr.java`, 165줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {exceptRetireCheckBox} {retrieveButton} {getHrButton}
- 입력·하위 화면: `searchText` TextField 빈칸="임원명/직위/조직명", `exceptRetireCheckBox` CheckBox, `lookup` Tdm01_Lookup_HrChangeInfo
- 그리드 `grid` (buildGrid()):
  - personName 150 "임원명" TextCenter
  - posName 150 "직위" Text
  - orgName 250 "본부(부서)" Text
  - hireDate 100 "입사일" Date
  - retireDate 100 "퇴사일" Date
  - endDate 100 "책무대상<br>종료일" Date
  - addTitle 250 "직무겸직" Text
  - actionCell 40 " " Cell 편집:addTitleCell
  - updName 100 "등록(변경)자" TextCenter
  - updDateStr 150 "등록(변경)일시" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L40-65) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L73) → retrieve()
[E2] retrieveButton[조회].Select (L82) → retrieve()
[E3] getHrButton[인사정보 가져오기].Select (L88) → lookupChangeHr()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L121-135 | 생성자,E1,E2,lookupChangeHr,lookupAddTitle | 서비스 tdm.Tdm01_Hr.selectByCompanyId(companyId, exceptRetireYn, searchText) | 업무 |
| private lookupChangeHr() | L137-145 | E3 | 조회창 Tdm01_Lookup_HrChangeInfo 열기 | 업무 |
| private lookupAddTitle() | L147-157 | buildGrid | 조회창 Tdm03_Lookup_AddTitle 열기 | 업무 |
| private settings() | L67-94 | 생성자 | 이벤트 연결, 초기값: exceptRetireCheckBox=true("퇴사자 제외") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L96-119 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L159-161 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L162-164 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNm', 150, '임원명'),  // L107
  gb.text('posNm', 150, '직위'),  // L108
  gb.text('orgNm', 250, '본부(부서)'),  // L109
  gb.date('hireDate', 100, '입사일'),  // L110
  gb.date('retireDate', 100, '퇴사일'),  // L111
  gb.date('endDate', 100, '책무대상<br>종료일'),  // L112
  gb.text('addTitle', 250, '직무겸직'),  // L113
  // ⚠ 대응 없음 (GridBuilder L114) addCell
  gb.textCenter('updNm', 100, '등록(변경)자'),  // L115
  gb.textCenter('updDateStr', 150, '등록(변경)일시'),  // L116
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={lookupChangeHr}>인사정보 가져오기</Button>

### Tdm03_Lookup_AddTitle (`client/vi/tdm/Tdm03_Lookup_AddTitle.java`, 371줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `fromYM` TextField 빈칸="YYYY.MM", `toYM` TextField 빈칸="YYYY.MM"
- 그리드 `interGrid` (interBuildGrid()):
  - addTitleName 250 "겸직명" Text 편집:TextField
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - closeDate 100 "적용종료일" Date 편집:MyDateField
- 그리드 `exterGrid` (exterBuildGrid()):
  - fromYearMonth 80 "시작년월" TextCenter 편집:fromYM
  - toYearMonth 80 "종료년월" TextCenter 편집:toYM
  - companyName 220 "회사명" Text 편집:TextField
  - industry 150 "업종" Text 편집:TextField
  - finalTitle 100 "최종직위" Text 편집:TextField
  - finalRole 240 "업무(역활,권한)" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L64-71) → 초기화
[E1] retrieveButton[조회].Select (L106) → retrieve()
[E2] insertButton[등록].Select (L112) → insertInterGrid(), insertExterGrid()
[E3] updateButton[저장].Select (L122) → updateInterGrid(), updateExterGrid()
[E4] messageBox.DialogHide (L126) → updateInterGrid(), updateExterGrid()
[E5] deleteButton[삭제].Select (L142) → deleteInterGrid(), deleteExterGrid()
[E6] messageBox.DialogHide (L146) → deleteInterGrid(), deleteExterGrid()
[E7] closeButton[닫기].Select [callback != null] (L162) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L73-99 | 공개 메서드 | 상태 처리 | 업무 |
| private interBuildGrid() | L173-182 | 필드 초기화 | 상태 처리 | 업무 |
| private exterBuildGrid() | L184-201 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L203-212 | E1,open | 서비스 tdm.Tdm03_AddTitle.selectByPersonId, emp.Emp07_Career.selectByPersonId(personId, personId, extrAddTitleYn) | 업무 |
| private insertInterGrid() | L214-221 | E2 | 상태 처리 | 업무 |
| private insertExterGrid() | L223-230 | E2 | 상태 처리 | 업무 |
| private updateInterGrid() | L232-261 | E3,E4 | 서비스 tdm.Tdm03_AddTitle.update | 업무 |
| private updateExterGrid() | L263-344 | E3,E4 | 서비스 emp.Emp07_Career.update | 업무 |
| private deleteInterGrid() | L346-355 | E5,E6 | GridDeleteData tdm.Tdm03_AddTitle.delete(체크된 행 목록) | 업무 |
| private deleteExterGrid() | L357-366 | E5,E6 | GridDeleteData emp.Emp07_Career.delete(체크된 행 목록) | 업무 |
| private settings() | L101-171 | open | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L368-370 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const interBuildGrid = () => [
  gb.text('addTitleNm', 250, '겸직명', { editor: 'text' }),  // L177
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L178
  gb.date('closeDate', 100, '적용종료일', { editor: 'date' }),  // L179
];

const exterBuildGrid = () => [
  gb.textCenter('frYm', 80, '시작년월'),  // L193
  gb.textCenter('toYm', 80, '종료년월'),  // L194
  gb.text('companyNm', 220, '회사명', { editor: 'text' }),  // L195
  gb.text('industry', 150, '업종', { editor: 'text' }),  // L196
  gb.text('finalTitle', 100, '최종직위', { editor: 'text' }),  // L197
  gb.text('finalRole', 240, '업무(역활,권한)', { editor: 'text' }),  // L198
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={() => /* insertInterGrid(), insertExterGrid() */}>등록</Button>
3. <Button type="save" onClick={() => /* updateInterGrid(), updateExterGrid() */}>저장</Button>
4. <Button type="delete" onClick={() => /* deleteInterGrid(), deleteExterGrid() */}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm01_Lookup_HrChangeInfo (`client/vi/tdm/Tdm01_Lookup_HrChangeInfo.java`, 194줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - changeTypeName 50 "구분" TextCenter
  - personName 80 "임원명" TextCenter
  - befPosName 80 "직위" Text 편집:"0069B4"
  - befTitleName 80 "직책" Text 편집:"0069B4"
  - befOrgName 150 "조직명" Text 편집:"0069B4"
  - befHireDate 90 "입사일" Date 편집:"0069B4"
  - befRetireDate 90 "퇴사일" Date 편집:"0069B4"
  - befEndDate 90 "책무대상<br>종료일" Date 편집:"0069B4"
  - aftPosName 80 "직위" Text 편집:"085820"
  - aftTitleName 80 "직책" Text 편집:"085820"
  - aftOrgName 150 "조직명" Text 편집:"085820"
  - aftHireDate 90 "입사일" Date 편집:"085820"
  - aftRetireDate 90 "퇴사일" Date 편집:"085820"
  - aftEndDate 90 "책무대상<br>종료일" Date 편집:"085820"

#### 이벤트
[E0] 화면 열림 (생성자 L55-79) → settings(), show()
[E1] retrieveButton[조회].Select (L82) → retrieve()
[E2] updateButton[적용].Select (L88) → preUpdate()
       └ [E4] messageBox.DialogHide (L147) → update()
[E3] closeButton[닫기].Select (L94) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-53 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L127-138 | E1,open | 서비스 tdm.Tdm01_Hr.selectPersonModifyed(companyId) | 업무 |
| private preUpdate() | L140-157 | E2 | ConfirmBox → E4 | 업무 |
| private update() | L159-186 | E4 | 서비스 tdm.Tdm01_Hr.updateHrInfo(companyId, updName) | 업무 |
| private settings() | L81-100 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L102-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L188-190 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlGridStyle() | L191-193 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L106 newHeaderGroupMap03newHeaderGroupConfigsetHtmlGridStyle16 100 "변동 전" (tdm03_new_header_group_map03new_header_group_configset_html_grid_style16 컬럼 없음)
  // ⚠DB없음 L107 newHeaderGroupMap09newHeaderGroupConfigsetHtmlGridStyle16 100 "변동 후" (tdm03_new_header_group_map09new_header_group_configset_html_grid_style16 컬럼 없음)
  gb.textCenter('changeTypeNm', 50, '구분'),  // L109
  gb.textCenter('personNm', 80, '임원명'),  // L110
  gb.text('befPosNm', 80, '직위'),  // L111
  gb.text('befTitleNm', 80, '직책'),  // L112
  gb.text('befOrgNm', 150, '조직명'),  // L113
  gb.date('befHireDate', 90, '입사일'),  // L114
  gb.date('befRetireDate', 90, '퇴사일'),  // L115
  gb.date('befEndDate', 90, '책무대상<br>종료일'),  // L116
  gb.text('aftPosNm', 80, '직위'),  // L117
  gb.text('aftTitleNm', 80, '직책'),  // L118
  gb.text('aftOrgNm', 150, '조직명'),  // L119
  gb.date('aftHireDate', 90, '입사일'),  // L120
  gb.date('aftRetireDate', 90, '퇴사일'),  // L121
  gb.date('aftEndDate', 90, '책무대상<br>종료일'),  // L122
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={preUpdate}>적용</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

