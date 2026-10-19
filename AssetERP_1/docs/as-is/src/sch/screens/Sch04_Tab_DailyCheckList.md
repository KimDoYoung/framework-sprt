# Sch04_Tab_DailyCheckList

- 종류: 화면
- 메뉴: 스케줄 > 02. 업무일정 체크 > 데일리 체크리스트(상신) (#1308)
- 파일: `client/vi/sch/Sch04_Tab_DailyCheckList.java`
- 함께 쓰는 클래스 1개:
  - `Sch04_Edit_Note` `client/vi/sch/Sch04_Edit_Note.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Sch01_Lookup_InfoView`](../../sch/components/Sch01_Lookup_InfoView.md), [`Sch10_Lookup_Ipo`](../../sch/components/Sch10_Lookup_Ipo.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Sch04_Tab_DailyCheckList:292 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Sch04_Tab_DailyCheckList:574 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sch.Sch04_List.modelUpdate` | Sch04_Edit_Note:95 | [`Sch04_List.java:423`](../../sch/services/Sch04_List.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sch04_list)` 동적 INSERT/UPDATE → [`sch04_list.selectById`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.selectByManagerId` | Sch04_Tab_DailyCheckList:365 | [`Sch04_List.java:34`](../../sch/services/Sch04_List.md) | [`sch04_list.selectByManagerId`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.statusUpdateCheck` | Sch04_Tab_DailyCheckList:236, Sch04_Tab_DailyCheckList:429 | [`Sch04_List.java:254`](../../sch/services/Sch04_List.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch04_list.selectByCheck`](../../sch/sql/sch04_list.md), [`sch04_list.updateStatusCode`](../../sch/sql/sch04_list.md), `UpdateDataModel(sch04_list)` 동적 INSERT/UPDATE → [`sch04_list.selectById`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.updateApprId` | Sch04_Tab_DailyCheckList:558 | [`Sch04_List.java:192`](../../sch/services/Sch04_List.md) | [`sch04_list.updateApprId`](../../sch/sql/sch04_list.md) |
| `sch.Sch10_Ipo.selectById` | Sch04_Tab_DailyCheckList:407 | [`Sch10_Ipo.java:16`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) |
| `sys.Sys00_Common.selectScheduleClass2` | Sch04_Tab_DailyCheckList:149 | [`Sys00_Common.java:171`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectScheduleClass2`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sch09_deadline_day`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_std_date`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Tab_DailyCheckList (`client/vi/sch/Sch04_Tab_DailyCheckList.java`, 605줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일자: {anchor01} {baseDate} {anchor02} 분류: {scheduleClassComboBox} 검색어: {searchText} {retrieveButton} {apprButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="구분/제목/주기구분/비고", `scheduleClassComboBox` CommonComboBoxField("sys.Sys00_Common.selectScheduleClass2", "전체", "전체"), `lookup` Dcr30_Lookup_Link, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - className 120 "분류" Text
  - title 500 "체크항목" Text
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - yes 100 "처리완료" Boolean
  - not 100 "해당없음" Boolean
  - note 400 "체크내용" Text
  - actionCell 60 "" Cell 편집:editCell
  - apprStatusName 80 "결재상태" TextColor
  - actionCell 60 "" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L83-140) → retrieveDoc(), settings(), setIconStyle(), retrieve()
[E1] anchor01.MouseDown (L90) → retrieve()
[E2] anchor02.MouseDown (L102) → retrieve()
[E3] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L156) → retrieve()
[E4] searchText[].KeyPress [Enter] (L165) → retrieve()
[E5] retrieveButton[조회].Select (L174) → retrieve()
[E6] apprButton[상신].Select (L181) → retrieveCheck()
[E7] dcrLinkButton[문서분류지정].Select (L188) → retrieveDoc()
[E8] grid.getStore().StoreRecordChange (L201) → 서비스 sch.Sch04_List.statusUpdateCheck(listId, manageDate, closeDate, infoId, title, scheduleCode, cycleCode, mngOrgId, managerId, personId, statusCode, note, companyId, deadlineId), 메시지 "상신중인 업무는 수정이 불가능합니다."
[E9] msgBox.DialogHide [YES] (L521) → updateApprId()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L335-373 | 생성자,E1,E2,E3,E4,E5,buildGrid,updateApprId | 서비스 sch.Sch04_List.selectByManagerId(companyId, personId, orgId, startDate, classId, aprYn, exceptYn, cancelYn, privateYn, dailyChkYn, statusCode, cycleCode, manageCheck, shareType, searchText) | 업무 |
| private view() | L375-425 | buildGrid | 조회창 Sch01_Lookup_InfoView 열기, 조회창 Sch10_Lookup_Ipo 열기, 서비스 sch.Sch10_Ipo.selectById | 업무 |
| private edit() | L427-467 | buildGrid | 팝업 Sch04_Edit_Note 열기, 서비스 sch.Sch04_List.statusUpdateCheck(listId, manageDate, closeDate, infoId, title, scheduleCode, cycleCode, mngOrgId, managerId, personId, statusCode, note, companyId, deadlineId) | 업무 |
| private retrieveCheck() | L469-500 | E6 | 서비스 sch.Sch04_List.selectByManagerId(companyId, personId, orgId, startDate, classCode, aprYn, exceptYn, cancelYn, privateYn, dailyChkYn, statusCode, cycleCode, manageCheck, shareType, searchText) | 업무 |
| private insertLinkApprovals() | L503-549 | retrieveCheck | 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시 | 업무 |
| private updateApprId() | L551-571 | E9 | 서비스 sch.Sch04_List.updateApprId(apprId) | 업무 |
| private retrieveDoc() | L573-591 | 생성자,E7 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public setIconStyle() | L593-595 | 생성자 | 상태 처리 | 업무 |
| private settings() | L142-272 | 생성자 | 조회창 Dcr30_Lookup_Link 열기 → 콜백: unmask, 서비스 sys.Sys00_Common.selectScheduleClass2, sch.Sch04_List.statusUpdateCheck(listId, manageDate, closeDate, infoId, title, scheduleCode, cycleCode, mngOrgId, managerId, personId, statusCode, note, companyId, deadlineId), 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L274-333 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L597-599 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L601-604 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L321 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle12 100 "체크" (emp03_new_header_group_map04new_header_group_configset_html_grid_style12 컬럼 없음)
  gb.text('classNm', 120, '분류'),  // L322
  gb.text('title', 500, '체크항목'),  // L323
  // ⚠ 대응 없음 (GridBuilder L324) addCell
  // ⚠DB없음 L325 yes 100 "처리완료" (emp03_yes 컬럼 없음)
  // ⚠DB없음 L326 not 100 "해당없음" (emp03_not 컬럼 없음)
  gb.text('note', 400, '체크내용'),  // L327
  // ⚠ 대응 없음 (GridBuilder L328) addCell
  // ⚠ 대응 없음 (GridBuilder L329) addTextColor
  // ⚠ 대응 없음 (GridBuilder L330) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={retrieveCheck}>상신</Button>
3. <Button type="save" onClick={retrieveDoc}>문서분류지정</Button>

### Sch04_Edit_Note (`client/vi/sch/Sch04_Edit_Note.java`, 111줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L54-75) → settings(), show()
[E1] updateButton[저장].Select (L78) → update()
[E2] closeButton[닫기].Select (L84) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L40-52 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L92-106 | E1 | 서비스 sch.Sch04_List.modelUpdate | 업무 |
| private settings() | L77-90 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L108-110 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

