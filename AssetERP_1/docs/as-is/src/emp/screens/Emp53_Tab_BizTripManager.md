# Emp53_Tab_BizTripManager

- 종류: 화면
- 메뉴: 경영관리 > 02. 휴가/출장 관리 > 출장관리 (#1381)
- 파일: `client/vi/emp/Emp53_Tab_BizTripManager.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp53_Tab_BizTripManager:212 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `emp.Emp53_BizTrip.selectByCompanyId` | Emp53_Tab_BizTripManager:198 | [`Emp53_BizTrip.java:27`](../../emp/services/Emp53_BizTrip.md) | [`emp53_biz_trip.selectByCompanyId`](../../emp/sql/emp53_biz_trip.md) |
| `emp.Emp53_BizTrip.update` | Emp53_Tab_BizTripManager:208 | [`Emp53_BizTrip.java:81`](../../emp/services/Emp53_BizTrip.md) | `UpdateDataModel(emp53_biz_trip)` 동적 INSERT/UPDATE → [`emp53_biz_trip.selectById`](../../emp/sql/emp53_biz_trip.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp53_Tab_BizTripManager (`client/vi/emp/Emp53_Tab_BizTripManager.java`, 245줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {searchText} {resultSkipYn} {retrieveButton} {updateButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="출장자/출장지/출장목적", `resultSkipYn` CheckBox, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - personInfo 150 "출장자" Text
  - startDate 100 "시작일" Date
  - closeDate 100 "종료일" Date
  - bizTripName 100 "구분" TextCenter
  - destination 120 "출장지" Text
  - purpose 150 "출장목적" Text
  - num 80 "출장인원" TextCenter
  - companion 150 "동반인" Text
  - apprStatusName 80 "결재상태" TextCenter
  - actionCell 60 "상세보기" Cell 편집:viewCell
  - resultApprStatusName 80 "결재상태" TextCenter
  - actionCell 60 "상세보기" Cell 편집:resultViewCell
  - resultSkipYn 50 "여부" Boolean 편집:"456EA6"
  - skipReason 200 "사유" Text 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L65-81) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L113) → retrieve()
[E2] retrieveButton[조회].Select (L121) → retrieve()
[E3] updateButton[저장].Select (L127) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L189-204 | 생성자,E1,E2,apprView | 서비스 emp.Emp53_BizTrip.selectByCompanyId(companyId, startDate, closeDate, resultSkipYn, searchText) | 업무 |
| private update() | L206-209 | E3 | 서비스 emp.Emp53_BizTrip.update | 업무 |
| private apprView() | L211-231 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private settings() | L83-133 | 생성자 | 이벤트 연결, 초기값: startDate=fromDate, closeDate=endDate, resultSkipYn=true("완료건 제외") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L135-187 | 필드 초기화 | 미선택 시 alert "해당 관련문서가 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L233-235 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L237-239 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L241-244 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L166 newHeaderGroupMap03newHeaderGroupConfig12 100 "출장기간" (emp56_new_header_group_map03new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L167 newHeaderGroupMap010newHeaderGroupConfig12 100 "출장품의" (emp56_new_header_group_map010new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L168 newHeaderGroupMap012newHeaderGroupConfig12 100 "결과보고" (emp56_new_header_group_map012new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L169 newHeaderGroupMap014newHeaderGroupConfigsetHtmlGridStyle12 100 "결과보고서 면제" (emp56_new_header_group_map014new_header_group_configset_html_grid_style12 컬럼 없음)
  gb.text('personInfo', 150, '출장자'),  // L171
  gb.date('startDate', 100, '시작일'),  // L172
  gb.date('closeDate', 100, '종료일'),  // L173
  gb.textCenter('bizTripNm', 100, '구분'),  // L174
  gb.text('destination', 120, '출장지'),  // L175
  gb.text('purpose', 150, '출장목적'),  // L176
  gb.textCenter('num', 80, '출장인원'),  // L177
  gb.text('companion', 150, '동반인'),  // L178
  gb.textCenter('apprStatusNm', 80, '결재상태'),  // L179
  // ⚠ 대응 없음 (GridBuilder L180) addCell
  gb.textCenter('resultApprStatusNm', 80, '결재상태'),  // L181
  // ⚠ 대응 없음 (GridBuilder L182) addCell
  gb.boolean('resultSkipYn', 50, '여부'),  // L183
  gb.text('skipReason', 200, '사유', { editor: 'text' }),  // L184
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

