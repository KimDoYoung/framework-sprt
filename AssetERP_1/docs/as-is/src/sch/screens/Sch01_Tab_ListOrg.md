# Sch01_Tab_ListOrg

- 종류: 화면
- 메뉴: 스케줄 > 01. 업무일정 > 부서별 업무일정 조회 (#1357)
- 파일: `client/vi/sch/Sch01_Tab_ListOrg.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sch01_Lookup_InfoView`](../../sch/components/Sch01_Lookup_InfoView.md), [`Sch10_Lookup_Ipo`](../../sch/components/Sch10_Lookup_Ipo.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch01_Info.selectByOrg` | Sch01_Tab_ListOrg:212 | [`Sch01_Info.java:63`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectByOrg`](../../sch/sql/sch01_info.md) |
| `sch.Sch10_Ipo.selectById` | Sch01_Tab_ListOrg:243 | [`Sch10_Ipo.java:16`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Sch01_Tab_ListOrg:130 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sch09_deadline_day`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_deadline_nm`, `f_get_emptrans`, `f_get_std_date`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch01_Tab_ListOrg (`client/vi/sch/Sch01_Tab_ListOrg.java`, 266줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 마감일: {startDate} ~: {closeDate} 부서: {orgLookup} {subOrgYnCheckBox} 주기: {cycleComboBox} 검색: {searchText} {dailyYnCheckBox} {searchButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `dailyYnCheckBox` CheckBox, `searchText` TextField 빈칸="분류/스케줄명/상세내용/등록자", `orgLookup` LookupTriggerField, `subOrgYnCheckBox` CheckBox, `cycleComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `orgSearch` Org00_Lookup_SelectMulti, `lookup` Sch01_Lookup_InfoView
- 그리드 `grid` (buildGrid()):
  - closeDate 90 "마감일" Date
  - manageDate 90 "처리일" Date
  - className 130 "분류" Text
  - title 300 "일정명" Text
  - content 400 "상세내용" TextArea
  - deadlineName 150 "주기" Text
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - statusName 80 "처리여부" TextCenter
  - personName 80 "처리자" TextCenter
  - managerOrgInfo 200 "등록자" Text
  - note 250 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L67-103) → settings()
[E1] orgLookup.TriggerClick (L116) → lookupOrg()
[E2] cycleComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L138) → retrieve()
[E3] searchText.KeyPress [Enter] (L147) → retrieve()
[E4] searchButton[조회].Select (L159) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L193-218 | E2,E3,E4,settings | 서비스 sch.Sch01_Info.selectByOrg(companyId, orgId, subOrgYn, startDate, endDate, dailyYn, cycleCode, searchText) | 업무 |
| private lookupOrg() | L220-237 | E1 | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private lookupSch() | L239-258 | buildGrid | 조회창 Sch10_Lookup_Ipo 열기, 조회창 Sch01_Lookup_InfoView 열기, 서비스 sch.Sch10_Ipo.selectById(ipoId) | 업무 |
| private settings() | L105-165 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=LoginUser.getToday(, subOrgYnCheckBox=true("하위부서 포함"), dailyYnCheckBox=false("데일리 체크리스트만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L167-191 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L260-262 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L263-265 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 90, '마감일'),  // L178
  gb.date('manageDate', 90, '처리일'),  // L179
  gb.text('classNm', 130, '분류'),  // L180
  gb.text('title', 300, '일정명'),  // L181
  gb.textArea('content', 400, '상세내용'),  // L182
  gb.text('deadlineNm', 150, '주기'),  // L183
  // ⚠ 대응 없음 (GridBuilder L184) addCell
  gb.textCenter('statusNm', 80, '처리여부'),  // L185
  gb.textCenter('personNm', 80, '처리자'),  // L186
  // ⚠DB없음 L187 managerOrgInfo 200 "등록자" (sch03_manager_org_info 컬럼 없음)
  gb.text('note', 250, '비고'),  // L188
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

