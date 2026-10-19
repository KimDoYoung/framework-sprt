# Sch04_Tab_DailyCheckListStatus

- 종류: 화면
- 메뉴: 스케줄 > 02. 업무일정 체크 > 업무일정 체크내역 (#1356)
- 파일: `client/vi/sch/Sch04_Tab_DailyCheckListStatus.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Sch01_Lookup_InfoView`](../../sch/components/Sch01_Lookup_InfoView.md), [`Sch10_Lookup_Ipo`](../../sch/components/Sch10_Lookup_Ipo.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Sch04_Tab_DailyCheckListStatus:213 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `sch.Sch04_List.selectCheckListStatus` | Sch04_Tab_DailyCheckListStatus:199 | [`Sch04_List.java:101`](../../sch/services/Sch04_List.md) | [`sch04_list.selectCheckListStatus`](../../sch/sql/sch04_list.md) |
| `sch.Sch10_Ipo.selectById` | Sch04_Tab_DailyCheckListStatus:272 | [`Sch10_Ipo.java:16`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) |
| `sys.Sys00_Common.selectScheduleClass2` | Sch04_Tab_DailyCheckListStatus:103 | [`Sys00_Common.java:171`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectScheduleClass2`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sch01_info`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Tab_DailyCheckListStatus (`client/vi/sch/Sch04_Tab_DailyCheckListStatus.java`, 293줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 처리일: {startDate} ~: {closeDate} 분류: {scheduleClassComboBox} 상태: {statusComboBox} 검색: {searchText} {searchButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="체크항목/체크내용", `scheduleClassComboBox` CommonComboBoxField("sys.Sys00_Common.selectScheduleClass2", "전체", "전체"), `statusComboBox` ComboBoxField("ScheduleStatusCode", "%", "전체", "전체"), `editor` Apr01_Edit_ApprDoc, `lookup` Sch01_Lookup_InfoView
- 그리드 `grid` (buildGrid()):
  - manageDate 100 "처리일" Date
  - closeDate 100 "마감일" Date
  - className 150 "분류" Text
  - title 500 "체크항목" Text
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - statusName 100 "체크상태" TextCenter
  - note 300 "체크내용" TextArea
  - apprStatusName 80 "결재상태" Text
  - actionCell 60 "" Cell 편집:apprCell

#### 이벤트
[E0] 화면 열림 (생성자 L60-92) → settings()
[E1] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L110) → retrieve()
[E2] statusComboBox[ScheduleStatusCode].Collapse (L124) → retrieve()
[E3] searchText.KeyPress [Enter] (L133) → retrieve()
[E4] searchButton[조회].Select (L142) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L181-205 | E1,E2,E3,E4,apprView | 서비스 sch.Sch04_List.selectCheckListStatus(companyId, personId, startDate, endDate, statusCode, classId, searchText) | 업무 |
| private apprView() | L207-238 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지 않습니다", 서비스 apr.Apr01_Appr.selectById | 업무 |
| private view() | L240-288 | buildGrid | 조회창 Sch01_Lookup_InfoView 열기, 조회창 Sch10_Lookup_Ipo 열기, 미선택 시 alert "상세보기를 지원하지 않습니다.", 서비스 sch.Sch10_Ipo.selectById(ipoId) | 업무 |
| private settings() | L94-148 | 생성자 | 서비스 sys.Sys00_Common.selectScheduleClass2, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-MM-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L150-179 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L290-292 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('manageDate', 100, '처리일'),  // L168
  gb.date('closeDate', 100, '마감일'),  // L169
  gb.text('classNm', 150, '분류'),  // L170
  gb.text('title', 500, '체크항목'),  // L171
  // ⚠ 대응 없음 (GridBuilder L172) addCell
  gb.textCenter('statusNm', 100, '체크상태'),  // L173
  gb.textArea('note', 300, '체크내용'),  // L174
  gb.text('apprStatusNm', 80, '결재상태'),  // L175
  // ⚠ 대응 없음 (GridBuilder L176) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

