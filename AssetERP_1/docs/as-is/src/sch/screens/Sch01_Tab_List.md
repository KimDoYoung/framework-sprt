# Sch01_Tab_List

- 종류: 화면
- 메뉴: 스케줄 > 01. 업무일정 > 기간별 업무일정 조회 (#1226)
- 파일: `client/vi/sch/Sch01_Tab_List.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sch01_Lookup_InfoView`](../../sch/components/Sch01_Lookup_InfoView.md), [`Sch10_Lookup_Ipo`](../../sch/components/Sch10_Lookup_Ipo.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch01_Info.selectByCloseDate` | Sch01_Tab_List:230 | [`Sch01_Info.java:33`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectByCloseDate`](../../sch/sql/sch01_info.md) |
| `sch.Sch10_Ipo.selectById` | Sch01_Tab_List:242 | [`Sch10_Ipo.java:16`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Sch01_Tab_List:139 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectScheduleClass2` | Sch01_Tab_List:107 | [`Sys00_Common.java:171`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectScheduleClass2`](../../sys/sql/sys09_code.md) |

## 테이블

[`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sch09_deadline_day`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_deadline_nm`, `f_get_emptrans`, `f_get_std_date`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch01_Tab_List (`client/vi/sch/Sch01_Tab_List.java`, 265줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 마감일: {startDate} ~: {closeDate} 분류: {scheduleClassComboBox} 공유구분: {shareTypeComboBox} 주기: {cycleComboBox} 검색: {searchText} {dailyYnCheckBox} {searchButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `shareTypeComboBox` StringComboBox, `dailyYnCheckBox` CheckBox, `searchText` TextField 빈칸="스케줄명/상세내용/담당부서/담당자", `scheduleClassComboBox` CommonComboBoxField("sys.Sys00_Common.selectScheduleClass2", "전체", "전체"), `cycleComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `lookup` Sch01_Lookup_InfoView
- 그리드 `grid` (buildGrid()):
  - closeDate 90 "마감일" Date
  - manageDate 90 "처리일" Date
  - className 130 "분류" Text
  - title 250 "일정명" Text
  - contentLimit 350 "상세내용" TextArea
  - deadlineName 150 "주기" Text
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - statusName 80 "처리여부" TextCenter
  - personName 80 "처리자" TextCenter
  - managerOrgInfo 200 "등록자" Text
  - note 250 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L58-95) → settings()
[E1] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L114) → retrieve()
[E2] shareTypeComboBox[나의 스케줄].Collapse (L128) → retrieve()
[E3] cycleComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L147) → retrieve()
[E4] searchText.KeyPress [Enter] (L156) → retrieve()
[E5] searchButton[조회].Select (L168) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L202-236 | E1,E2,E3,E4,E5,settings | 서비스 sch.Sch01_Info.selectByCloseDate(companyId, personId, orgId, startDate, endDate, classId, shareType, cycleCode, dailyYn, searchText) | 업무 |
| private lookupSch() | L238-257 | buildGrid | 조회창 Sch10_Lookup_Ipo 열기, 조회창 Sch01_Lookup_InfoView 열기, 서비스 sch.Sch10_Ipo.selectById(ipoId) | 업무 |
| private settings() | L97-174 | 생성자 | 서비스 sys.Sys00_Common.selectScheduleClass2, sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=LoginUser.getToday(, dailyYnCheckBox=false("데일리 체크리스트만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L176-200 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L259-261 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L262-264 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 90, '마감일'),  // L187
  gb.date('manageDate', 90, '처리일'),  // L188
  gb.text('classNm', 130, '분류'),  // L189
  gb.text('title', 250, '일정명'),  // L190
  gb.textArea('contentLimit', 350, '상세내용'),  // L191
  gb.text('deadlineNm', 150, '주기'),  // L192
  // ⚠ 대응 없음 (GridBuilder L193) addCell
  gb.textCenter('statusNm', 80, '처리여부'),  // L194
  gb.textCenter('personNm', 80, '처리자'),  // L195
  // ⚠DB없음 L196 managerOrgInfo 200 "등록자" (sch03_manager_org_info 컬럼 없음)
  gb.text('note', 250, '비고'),  // L197
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

