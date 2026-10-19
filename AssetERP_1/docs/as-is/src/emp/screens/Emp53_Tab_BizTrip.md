# Emp53_Tab_BizTrip

- 종류: 화면
- 메뉴: 신청 > 01. 외출/출장/휴가 > 출장품의 및 결과보고 (#1359)
- 파일: `client/vi/emp/Emp53_Tab_BizTrip.java`
- 함께 쓰는 클래스 3개:
  - `Emp53_Lookup_BizTripShare` `client/vi/emp/Emp53_Lookup_BizTripShare.java`
  - `Emp56_Lookup_Share` `client/vi/emp/Emp56_Lookup_Share.java`
  - `Emp53_Lookup_BizTrip` `client/vi/emp/Emp53_Lookup_BizTrip.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp53_Tab_BizTrip:431 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp53_Tab_BizTrip:461 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp53_BizTrip.delete` | Emp53_Tab_BizTrip:321 | [`Emp53_BizTrip.java:86`](../../emp/services/Emp53_BizTrip.md) | `UpdateDataModel(emp53_biz_trip)` 동적 DELETE |
| `emp.Emp53_BizTrip.modelUpdate` | Emp53_Lookup_BizTrip:252 | [`Emp53_BizTrip.java:68`](../../emp/services/Emp53_BizTrip.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp53_biz_trip)` 동적 INSERT/UPDATE → [`emp53_biz_trip.selectById`](../../emp/sql/emp53_biz_trip.md) |
| `emp.Emp53_BizTrip.selectByPersonId` | Emp53_Tab_BizTrip:287 | [`Emp53_BizTrip.java:41`](../../emp/services/Emp53_BizTrip.md) | [`emp53_biz_trip.selectByPersonId`](../../emp/sql/emp53_biz_trip.md) |
| `emp.Emp53_BizTrip.update` | Emp53_Tab_BizTrip:502 | [`Emp53_BizTrip.java:81`](../../emp/services/Emp53_BizTrip.md) | `UpdateDataModel(emp53_biz_trip)` 동적 INSERT/UPDATE → [`emp53_biz_trip.selectById`](../../emp/sql/emp53_biz_trip.md) |
| `emp.Emp53_BizTrip.updateShareInfo` | Emp53_Lookup_BizTripShare:136 | [`Emp53_BizTrip.java:61`](../../emp/services/Emp53_BizTrip.md) | [`emp53_biz_trip.selectById`](../../emp/sql/emp53_biz_trip.md), [`emp53_biz_trip.updatePublicYn`](../../emp/sql/emp53_biz_trip.md) |
| `emp.Emp56_Share.delete` | Emp56_Lookup_Share:269 | [`Emp56_Share.java:38`](../../emp/services/Emp56_Share.md) | `UpdateDataModel(emp56_share)` 동적 DELETE |
| `emp.Emp56_Share.selectByParentId` | Emp56_Lookup_Share:332 | [`Emp56_Share.java:22`](../../emp/services/Emp56_Share.md) | [`emp56_share.selectByParentId`](../../emp/sql/emp56_share.md) |
| `emp.Emp56_Share.selectShareInfo` | Emp56_Lookup_Share:299 | [`Emp56_Share.java:28`](../../emp/services/Emp56_Share.md) | [`emp56_share.selectShareInfo`](../../emp/sql/emp56_share.md) |
| `emp.Emp56_Share.update` | Emp56_Lookup_Share:283 | [`Emp56_Share.java:33`](../../emp/services/Emp56_Share.md) | `UpdateDataModel(emp56_share)` 동적 INSERT/UPDATE → [`emp56_share.selectById`](../../emp/sql/emp56_share.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp53_Tab_BizTrip (`client/vi/emp/Emp53_Tab_BizTrip.java`, 583줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="출장지/출장목적", `lookup` Dcr30_Lookup_Link, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - startDate 100 "시작일" Date
  - closeDate 100 "종료일" Date
  - bizTripName 100 "구분" TextCenter
  - destination 150 "출장지" Text
  - purpose 200 "출장목적" Text
  - num 100 "출장인원" TextCenter
  - companion 150 "동반인" Text
  - actionCell 60 "수정" Cell 편집:editCell
  - actionCell 60 "결재요청" Cell 편집:apprCell
  - apprStatusName 80 "결재상태" TextCenter
  - actionCell 60 "상세보기" Cell 편집:viewCell
  - actionCell 60 "결재요청" Cell 편집:"456EA6"
  - resultApprStatusName 80 "결재상태" TextCenter 편집:"456EA6"
  - actionCell 60 "상세보기" Cell 편집:"456EA6"
  - shareInfo 150 "공유" Text
  - actionCell 60 "" Cell 편집:shareViewCell

#### 이벤트
[E0] 화면 열림 (생성자 L80-167) → retrieve()
[E1] searchText.KeyPress [Enter] (L112) → retrieve()
[E2] retrieveButton[조회].Select (L121) → retrieve()
[E3] insertButton[등록].Select (L128) → insert()
[E4] deleteButton[삭제].Select (L135) → delete()
       └ [E6] messageBox.DialogHide [YES] (L315) → 서비스 emp.Emp53_BizTrip.delete
[E5] dcrLinkButton[문서분류지정].Select (L142) → 인라인 L142-153 (new SelectHandler() { @Override publi…)
[E7] msgBox.DialogHide [YES] (L347) → checkDcr()
[E8] msgBox.DialogHide [YES] (L395) → checkDcr()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L271-293 | 생성자,E1,E2,buildGrid,insert,apprView,updateApprId | 서비스 emp.Emp53_BizTrip.selectByPersonId(companyId, personId, startDate, closeDate, searchText) | 업무 |
| public insert() | L295-305 | E3 | 조회창 Emp53_Lookup_BizTrip 열기 | 업무 |
| public delete() | L307-329 | E4 | 미선택 시 alert "진행 및 완료된 문서가 포함 되어있습니다. 삭제 불가합니다." → 확인창 E6 | 업무 |
| private checkAppr() | L331-428 | buildGrid | 확인창 표시 | 업무 |
| private apprView() | L430-450 | buildGrid,checkAppr | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private checkDcr() | L452-478 | E7,E8,checkAppr | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L480-491 | checkDcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L493-514 | insertLinkApproval | 서비스 emp.Emp53_BizTrip.update | 업무 |
| public createMapping() | L516-532 | checkDcr | 상태 처리 | 업무 |
| public createResultMapping() | L534-550 | checkDcr | 상태 처리 | 업무 |
| private checkStringNull() | L552-560 | createMapping,createResultMapping | 상태 처리 | 업무 |
| private checkDateNull() | L562-572 | createMapping,createResultMapping | 상태 처리 | 업무 |
| public buildGrid() | L169-269 | 필드 초기화 | 조회창 Emp53_Lookup_BizTrip 열기, 조회창 Emp53_Lookup_BizTripShare 열기, 미선택 시 alert "진행 및 완료된 문서가 있습니다. 수정이 불가합니다.", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L574-576 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L578-581 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L246 newHeaderGroupMap02newHeaderGroupConfig12 100 "출장기간" (emp56_new_header_group_map02new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L247 newHeaderGroupMap010newHeaderGroupConfig13 100 "출장품의" (emp56_new_header_group_map010new_header_group_config13 컬럼 없음)
  // ⚠DB없음 L248 newHeaderGroupMap013newHeaderGroupConfigsetHtmlGridStyle13 100 "결과보고" (emp56_new_header_group_map013new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.date('startDate', 100, '시작일'),  // L251
  gb.date('closeDate', 100, '종료일'),  // L252
  gb.textCenter('bizTripNm', 100, '구분'),  // L253
  gb.text('destination', 150, '출장지'),  // L254
  gb.text('purpose', 200, '출장목적'),  // L255
  gb.textCenter('num', 100, '출장인원'),  // L256
  gb.text('companion', 150, '동반인'),  // L257
  // ⚠ 대응 없음 (GridBuilder L258) addCell
  // ⚠ 대응 없음 (GridBuilder L259) addCell
  gb.textCenter('apprStatusNm', 80, '결재상태'),  // L260
  // ⚠ 대응 없음 (GridBuilder L261) addCell
  // ⚠ 대응 없음 (GridBuilder L262) addCell
  gb.textCenter('resultApprStatusNm', 80, '결재상태'),  // L263
  // ⚠ 대응 없음 (GridBuilder L264) addCell
  gb.text('shareInfo', 150, '공유'),  // L265
  // ⚠ 대응 없음 (GridBuilder L266) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="save" onClick={() => /* 인라인 L142-153 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>

### Emp53_Lookup_BizTripShare (`client/vi/emp/Emp53_Lookup_BizTripShare.java`, 158줄)

- 입력·하위 화면: `publicYn` CheckBox, `shareInfo` LookupTriggerField, `lookup` Emp56_Lookup_Share

#### 이벤트
[E0] 화면 열림 (생성자 L43-46) → 초기화
[E1] publicYn[전체공유 /].ValueChange [event.getValue()] (L70) → 인라인 L70-80 (new ValueChangeHandler<Boolean>() { @…)
[E2] shareInfo[].TriggerClick (L92) → 인라인 L92-103 (new TriggerClickHandler() { @Override…)
[E3] updateButton[저장].Select (L105) → update()
[E4] closeButton[닫기].Select (L111) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L48-66 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L119-133 | open | 상태 처리 | 업무 |
| private update() | L135-148 | E3 | 서비스 emp.Emp53_BizTrip.updateShareInfo(bizTripId, publicYn) | 업무 |
| private settings() | L68-117 | open | 조회창 Emp56_Lookup_Share 열기, 이벤트 연결, 초기값: publicYn=true("전체공유 /"), publicYn=false("전체공유 /") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L150-152 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L154-156 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp56_Lookup_Share (`client/vi/emp/Emp56_Lookup_Share.java`, 339줄)

- 툴바 `buttonBar`: {retrieveButton} {hlc}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - shareName 70 "구분" TextCenter
  - orgName 250 "부서" Text
  - personName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L95-112) → show()
[E1] anchor.MouseDown (L117) → retrieve()
[E2] insertButton[행 추가].Select (L139) → insertRow()
[E3] deleteButton[행 삭제].Select (L145) → deleteRow()
[E4] retrieveButton[새로고침].Select (L151) → retrieve()
[E5] updateButton[저장].Select (L157) → update()
[E6] closeButton[닫기].Select (L163) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L78-82 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L84-87 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L89-93 | 공개 메서드 | 상태 처리 | 업무 |
| private grid() | L178-187 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L189-215 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L217-245 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow() | L247-255 | E2 | 상태 처리 | 업무 |
| private update() | L257-292 | E5 | GridDeleteData emp.Emp56_Share.delete, emp.Emp56_Share.update | 업무 |
| private updateEnd() | L294-317 | update | 서비스 emp.Emp56_Share.selectShareInfo(parentId) | 업무 |
| private deleteRow() | L319-325 | E3 | 상태 처리 | 업무 |
| private retrieve() | L327-333 | E1,E4,view,open | 서비스 emp.Emp56_Share.selectByParentId(parentId) | 업무 |
| private settings() | L114-176 | view,open | 이벤트 연결, 초기값: radio01=false("직원"), radio02=true("부서") | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L335-337 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L182 SQL 계산 컬럼(selectByParentId: f_cdnm('ShareCode', emp56_share_cd, emp…)
  gb.text('orgNm', 250, '부서'),  // L183 SQL 계산 컬럼(selectByParentId: f_org_nm(emp56_org_id, f_today()))
  gb.textCenter('personNm', 100, '성명'),  // L184 SQL 계산 컬럼(selectByParentId: f_emp_kor_nm(emp56_person_id))
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="addRow" onClick={insertRow}>행 추가</Button>
5. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Emp53_Lookup_BizTrip (`client/vi/emp/Emp53_Lookup_BizTrip.java`, 273줄)

- 입력·하위 화면: `bizTripId` LongField, `companyId` LongField, `personId` LongField, `startDate` MyDateField, `closeDate` MyDateField, `bizTripCode` TextField, `destination` TextField, `purpose` TextArea, `num` TextField, `companion` TextField, `apprId` LongField, `resultApprId` LongField, `note` TextArea, `bizTripName` ComboBoxField("BizTripCode"), `publicYn` CheckBox, `shareInfo` LookupTriggerField, `lookup` Emp56_Lookup_Share

#### 이벤트
[E0] 화면 열림 (생성자 L78-80) → 초기화
[E1] publicYn[공유].ValueChange [event.getValue()] (L128) → 인라인 L128-138 (new ValueChangeHandler<Boolean>() { @…)
[E2] shareInfo[].TriggerClick (L146) → 인라인 L146-157 (new TriggerClickHandler() { @Override…)
[E3] updateButton[저장].Select (L159) → update()
[E4] closeButton[닫기].Select ["NEW".equals(actionName)] (L165) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L82-97 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L99-124 | insert | 상태 처리 | 업무 |
| private getEditor() | L179-230 | edit | 상태 처리 | 업무 |
| private update() | L232-263 | E3 | 서비스 emp.Emp53_BizTrip.modelUpdate | 업무 |
| private settings() | L126-177 | edit | 조회창 Emp56_Lookup_Share 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L265-267 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L269-271 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

