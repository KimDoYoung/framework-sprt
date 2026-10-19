# Biz90_Tab_Limit

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > 이익제공 기준관리(준감인) (#1130)
- 파일: `client/vi/biz/Biz90_Tab_Limit.java`
- 함께 쓰는 클래스 1개:
  - `Biz04_Lookup_EmpSetup` `client/vi/biz/Biz04_Lookup_EmpSetup.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz04_ProvideSetup.selectByProvidePurCode` | Biz04_Lookup_EmpSetup:163 | [`Biz04_ProvideSetup.java:21`](../../biz/services/Biz04_ProvideSetup.md) | [`biz04_provide_setup.selectByProvidePurCode`](../../biz/sql/biz04_provide_setup.md) |
| `biz.Biz04_ProvideSetup.upsert` | Biz04_Lookup_EmpSetup:168 | [`Biz04_ProvideSetup.java:38`](../../biz/services/Biz04_ProvideSetup.md) | [`biz04_provide_setup.upsert`](../../biz/sql/biz04_provide_setup.md) |
| `biz.Biz90_Limit.delete` | Biz90_Tab_Limit:187 | [`Biz90_Limit.java:36`](../../biz/services/Biz90_Limit.md) | `UpdateDataModel(biz90_limit)` 동적 DELETE |
| `biz.Biz90_Limit.selectByCompanyId` | Biz90_Tab_Limit:143 | [`Biz90_Limit.java:23`](../../biz/services/Biz90_Limit.md) | [`biz90_limit.selectByCompanyId`](../../biz/sql/biz90_limit.md) |
| `biz.Biz90_Limit.update` | Biz90_Tab_Limit:154 | [`Biz90_Limit.java:31`](../../biz/services/Biz90_Limit.md) | `UpdateDataModel(biz90_limit)` 동적 INSERT/UPDATE → [`biz90_limit.selectById`](../../biz/sql/biz90_limit.md) |
| `sys.Sys09_Code.selectByCodeKind` | Biz04_Lookup_EmpSetup:142 | [`Sys09_Code.java:82`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKind`](../../sys/sql/sys09_code.md) |

## 테이블

[`biz04_provide_setup`](../../../db/tables/biz.md), [`biz90_limit`](../../../db/tables/biz.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz90_Tab_Limit (`client/vi/biz/Biz90_Tab_Limit.java`, 193줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton} {empSetupButton}
- 입력·하위 화면: `lookupEmpSetup` Biz04_Lookup_EmpSetup, `provideRcvComboBox` ComboBoxField("ProvideRcvType")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - provideRcvTypeName 150 "제공/수령" TextCenter 편집:provideRcvComboBox
  - saleRuleLimit1 200 "일반" Long 편집:"0069B4"
  - saleRuleLimit2 200 "경조" Long 편집:"0069B4"
  - companyLimit1 200 "인별 1회" Long 편집:LongField
  - companyLimit2 200 "인별 연간" Long 편집:LongField
  - companyLimit3 200 "회사별 연간" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L51-75) → setting(), retrieve()
[E1] retrieveButton[조회].Select (L78) → retrieve()
[E2] insertButton[등록].Select (L84) → insertRow()
[E3] updateButton[저장].Select (L90) → update()
[E4] deleteButton[삭제].Select (L96) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L167) → deleteRow()
[E5] empSetupButton[직원 자동등록 설정].Select (L102) → 인라인 L102-108 (new SelectHandler() { @Override publi…)
[E6] provideRcvComboBox[ProvideRcvType].Collapse (L116) → 인라인 L116-122 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L77-109 | 생성자 | 조회창 Biz04_Lookup_EmpSetup 열기 | 업무 |
| public retrieve() | L139-149 | 생성자,E1 | 서비스 biz.Biz90_Limit.selectByCompanyId(companyId) | 업무 |
| public update() | L151-155 | E3 | 서비스 biz.Biz90_Limit.update(personId) | 업무 |
| public insertRow() | L157-162 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L164-182 | E4 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L184-188 | E7 | GridDeleteData biz.Biz90_Limit.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L111-137 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlGridStyle() | L190-192 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L124 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle12 100 "편익 기준액" (biz90_new_header_group_map04new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L125 newHeaderGroupMap06newHeaderGroupConfig13 100 "편익상대방 한도액" (biz90_new_header_group_map06new_header_group_config13 컬럼 없음)
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L128
  gb.textCenter('provideRcvTypeNm', 150, '제공/수령', { editor: 'select' }),  // L129 SQL 계산 컬럼(selectByCompanyId: f_cdnm('ProvideRcvType', biz90_provide_…)
  gb.long('saleRuleLimit1', 200, '일반', { editor: 'number' }),  // L130
  gb.long('saleRuleLimit2', 200, '경조', { editor: 'number' }),  // L131
  gb.long('companyLimit1', 200, '인별 1회', { editor: 'number' }),  // L132
  gb.long('companyLimit2', 200, '인별 연간', { editor: 'number' }),  // L133
  gb.long('companyLimit3', 200, '회사별 연간', { editor: 'number' }),  // L134
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="assign" onClick={() => /* 인라인 L102-108 (new SelectHandler() { @Override publi…) */}>직원 자동등록 설정</Button>

### Biz04_Lookup_EmpSetup (`client/vi/biz/Biz04_Lookup_EmpSetup.java`, 187줄)

- 레이아웃: west=purGrid, center=contentGrid
- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `purGrid` (purBuildGrid()):
  - name 200 "이익제공(수령) 목적" Text
- 그리드 `contentGrid` (contentBuildGrid()):
  - provideContentName 250 "이익제공(수령) 내용" Text
  - empSetYn 80 "자동등록" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L45-51) → 초기화
[E1] purGrid.RowClick (L90) → contentRetrieve()
[E2] retrieveButton[조회].Select (L97) → purRetrieve()
[E3] updateButton[저장].Select (L103) → update()
[E4] closeButton[닫기].Select (L109) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-83 | 공개 메서드 | 상태 처리 | 업무 |
| private purBuildGrid() | L117-124 | 필드 초기화 | 상태 처리 | 업무 |
| private contentBuildGrid() | L126-134 | 필드 초기화 | 상태 처리 | 업무 |
| private purRetrieve() | L136-151 | E2,open | 서비스 sys.Sys09_Code.selectByCodeKind(companyId, kindCode, applyDate) | 업무 |
| private contentRetrieve() | L153-164 | E1,purRetrieve,update | 미선택 시 alert "이익제공(수령) 목적을 선택하세요", 서비스 biz.Biz04_ProvideSetup.selectByProvidePurCode(companyId, providePurCode) | 업무 |
| private update() | L166-181 | E3 | 서비스 biz.Biz04_ProvideSetup.upsert | 업무 |
| private settings() | L85-115 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L183-185 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const purBuildGrid = () => [
  gb.text('name', 200, '이익제공(수령) 목적'),  // L121
];

const contentBuildGrid = () => [
  gb.text('provideContentNm', 250, '이익제공(수령) 내용'),  // L130 SQL 계산 컬럼(selectByProvidePurCode: sys09_name)
  gb.boolean('empSetYn', 80, '자동등록'),  // L131
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={purRetrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

