# Sch04_Tab_List

- 종류: 화면
- 메뉴: 스케줄 > 01. 업무일정 > (X)기간별 스케줄 조회 (#1440, 미사용)
- 파일: `client/vi/sch/Sch04_Tab_List.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sch04_Lookup_SchList`](../../sch/components/Sch04_Lookup_SchList.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch04_List.selectByManagerId` | Sch04_Tab_List:354 | [`Sch04_List.java:34`](../../sch/services/Sch04_List.md) | [`sch04_list.selectByManagerId`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.selectByToDoList` | Sch04_Tab_List:368 | [`Sch04_List.java:318`](../../sch/services/Sch04_List.md) | [`sch04_list.selectByToDoList`](../../sch/sql/sch04_list.md) |
| `sys.Sys00_Common.selectScheduleClass2` | Sch04_Tab_List:151 | [`Sys00_Common.java:171`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectScheduleClass2`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sch09_deadline_day`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_get_std_date`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Tab_List (`client/vi/sch/Sch04_Tab_List.java`, 447줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: {closeRadio} {manageRadio} {startDate} ~: {closeDate} 분류: {scheduleClassComboBox} 처리여부: {statusComboBox} {exceptYnBox} {searchButton}
- 툴바 `buttonBar02`: 검색: {searchText} 공유구분: {shareTypeComboBox}
- 입력·하위 화면: `exceptYnBox` CheckBox, `shareTypeComboBox` StringComboBox, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="제목/부서/담당자", `manageRadio` Radio, `closeRadio` Radio, `scheduleClassComboBox` CommonComboBoxField("sys.Sys00_Common.selectScheduleClass2", "전체", "전체"), `statusComboBox` ComboBoxField("ScheduleStatusCode", "%", "전체", "전체"), `lookup` Sch04_Lookup_SchList
- 그리드 `grid` (buildGrid(), 체크박스):
  - closeDate 100 "마감일" Date
  - className 150 "분류" Text
  - title 500 "제목" Text
  - cycleName 100 "주기구분" TextCenter
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - personName 100 "담당자" TextCenter
  - statusName 100 "처리여부" TextCenter
  - manageDate 100 "처리일" Date
  - apprStatusName 80 "결재상태" TextColor
  - note 350 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L76-130) → settings()
[E1] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L158) → retrieve()
[E2] statusComboBox[ScheduleStatusCode].Collapse (L172) → retrieve()
[E3] searchText.KeyPress [Enter] (L252) → retrieve()
[E4] shareTypeComboBox[전체].Collapse (L268) → retrieve()
[E5] searchButton[조회].Select (L275) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L310-360 | E1,E2,E3,E4,E5 | 서비스 sch.Sch04_List.selectByManagerId(companyId, personId, orgId, manageCheck, startDate, endDate, shareType, exceptYn, statusCode, classId, searchText) | 업무 |
| private view() | L362-395 | buildGrid | 조회창 Sch04_Lookup_SchList 열기, 서비스 sch.Sch04_List.selectByToDoList | 업무 |
| private settings() | L132-281 | 생성자 | 서비스 sys.Sys00_Common.selectScheduleClass2, 이벤트 연결, 초기값: closeRadio=true("마감일"), manageRadio=false("처리일"), startDate=LoginUser.getToday(, closeDate=LoginUser.getToday(, exceptYnBox=false("완료건 제외") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L283-308 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L435-437 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L439-441 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L443-445 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 100, '마감일'),  // L295
  gb.text('classNm', 150, '분류'),  // L297
  gb.text('title', 500, '제목'),  // L298
  gb.textCenter('cycleNm', 100, '주기구분'),  // L299
  // ⚠ 대응 없음 (GridBuilder L300) addCell
  gb.textCenter('personNm', 100, '담당자'),  // L301
  gb.textCenter('statusNm', 100, '처리여부'),  // L302
  gb.date('manageDate', 100, '처리일'),  // L303
  // ⚠ 대응 없음 (GridBuilder L304) addTextColor
  gb.text('note', 350, '비고'),  // L305
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

