# Emp54_Tab_Errand

- 종류: 화면
- 메뉴: 신청 > 01. 외출/출장/휴가 > 외출등록 (#1358)
- 파일: `client/vi/emp/Emp54_Tab_Errand.java`
- 함께 쓰는 클래스 2개:
  - `Emp56_Lookup_Share` `client/vi/emp/Emp56_Lookup_Share.java`
  - `Emp54_Edit_Errand` `client/vi/emp/Emp54_Edit_Errand.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp54_Tab_Errand:376 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp54_Tab_Errand:401, Emp54_Tab_Errand:459 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp54_Errand.delete` | Emp54_Tab_Errand:307 | [`Emp54_Errand.java:207`](../../emp/services/Emp54_Errand.md) | `UpdateDataModel(emp54_errand)` 동적 DELETE |
| `emp.Emp54_Errand.modelUpdate` | Emp54_Edit_Errand:335 | [`Emp54_Errand.java:57`](../../emp/services/Emp54_Errand.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp54_errand.insert`](../../emp/sql/emp54_errand.md) |
| `emp.Emp54_Errand.selectByDate` | Emp54_Tab_Errand:206 | [`Emp54_Errand.java:39`](../../emp/services/Emp54_Errand.md) | [`emp54_errand.selectByDate`](../../emp/sql/emp54_errand.md) |
| `emp.Emp54_Errand.update` | Emp54_Tab_Errand:231 | [`Emp54_Errand.java:202`](../../emp/services/Emp54_Errand.md) | `UpdateDataModel(emp54_errand)` 동적 INSERT/UPDATE → [`emp54_errand.selectById`](../../emp/sql/emp54_errand.md) |
| `emp.Emp54_Errand.updatePublicYn` | Emp54_Tab_Errand:319 | [`Emp54_Errand.java:195`](../../emp/services/Emp54_Errand.md) | [`emp54_errand.selectById`](../../emp/sql/emp54_errand.md), [`emp54_errand.updatePublicYn`](../../emp/sql/emp54_errand.md) |
| `emp.Emp56_Share.delete` | Emp56_Lookup_Share:269 | [`Emp56_Share.java:38`](../../emp/services/Emp56_Share.md) | `UpdateDataModel(emp56_share)` 동적 DELETE |
| `emp.Emp56_Share.selectByParentId` | Emp56_Lookup_Share:332 | [`Emp56_Share.java:22`](../../emp/services/Emp56_Share.md) | [`emp56_share.selectByParentId`](../../emp/sql/emp56_share.md) |
| `emp.Emp56_Share.selectShareInfo` | Emp56_Lookup_Share:299 | [`Emp56_Share.java:28`](../../emp/services/Emp56_Share.md) | [`emp56_share.selectShareInfo`](../../emp/sql/emp56_share.md) |
| `emp.Emp56_Share.update` | Emp56_Lookup_Share:283 | [`Emp56_Share.java:33`](../../emp/services/Emp56_Share.md) | `UpdateDataModel(emp56_share)` 동적 INSERT/UPDATE → [`emp56_share.selectById`](../../emp/sql/emp56_share.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys12_calendar`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp54_Tab_Errand (`client/vi/emp/Emp54_Tab_Errand.java`, 524줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {retrieveButton} {insertButton} {cycleInsertButton} {updateButton} {deleteButton} * 이익수령이 있는 경우 '이익수령 제외 신청서'를 상신하세요:
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `errandComboBox` ComboBoxField("ErrandCode"), `lookup` Emp54_Edit_Errand, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date 편집:MyDateField
  - weekday 70 "요일" TextCenter
  - errandName 100 "구분" TextCenter 편집:errandComboBox
  - departTime 120 "외출시각" TextCenter 편집:TextField
  - returnTime 120 "복귀시각" TextCenter 편집:TextField
  - reason 400 "사유" Text 편집:TextField
  - venue 150 "장소" Text 편집:TextField
  - host 150 "주최자" Text 편집:TextField
  - note 150 "비고" Text 편집:TextField
  - actionCell 70 "이익수령<br>제외신청" Cell 편집:apprCell
  - aprStatusName 80 "결재상태" TextCenter
  - publicYn 50 "공개" Boolean
  - shareInfo 150 "공유지정" Text
  - actionCell 30 "" Cell 편집:shareCell

#### 이벤트
[E0] 화면 열림 (생성자 L77-106) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L120) → retrieve()
[E2] insertButton[등록].Select (L126) → insertRow()
[E3] cycleInsertButton[반복등록].Select (L132) → insertCycle()
[E4] updateButton[저장].Select (L138) → update()
[E5] deleteButton[삭제].Select (L144) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L263) → deleteRow()
[E6] errandComboBox[ErrandCode].Collapse (L154) → 인라인 L154-160 (new CollapseHandler() { @Override pub…)
[E8] msgBox.DialogHide [YES] (L350) → checkDcr(), apprView()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L199-212 | 생성자,E1,update,insertCycle,apprView,updateApprId | 서비스 emp.Emp54_Errand.selectByDate(personId, startDate, closeDate) | 업무 |
| public update() | L215-237 | E4 | 서비스 emp.Emp54_Errand.update | 업무 |
| public insertRow() | L240-248 | E2 | 상태 처리 | 업무 |
| public insertCycle() | L250-258 | E3 | 팝업 Emp54_Edit_Errand 열기 | 업무 |
| private deleteChk() | L260-278 | E5 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L281-308 | E7 | 미선택 시 alert "상신문서가 존재하는 내역은 삭제가 불가능합니다", GridDeleteData emp.Emp54_Errand.delete(체크된 행 목록) | 업무 |
| private lookupShare() | L310-337 | buildGrid | 조회창 Emp56_Lookup_Share 열기, 서비스 emp.Emp54_Errand.updatePublicYn(publicYn, errandId) | 업무 |
| private checkAppr() | L339-371 | buildGrid | 확인창 표시 | 업무 |
| private apprView() | L373-396 | E8,checkAppr | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private checkDcr() | L398-424 | E8,checkAppr | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L426-437 | checkDcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L439-456 | insertLinkApproval | 서비스 emp.Emp54_Errand.update | 업무 |
| private searchDcr() | L458-476 | settings | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public createMapping() | L478-493 | checkAppr | 상태 처리 | 업무 |
| private checkStringNull() | L495-503 | createMapping | 상태 처리 | 업무 |
| private checkDateNull() | L505-515 | createMapping | 상태 처리 | 업무 |
| private settings() | L108-150 | 생성자 | 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=cDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L152-196 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L517-519 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L521-523 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자', { editor: 'date' }),  // L180
  gb.textCenter('weekday', 70, '요일'),  // L181
  gb.textCenter('errandNm', 100, '구분', { editor: 'select' }),  // L182
  gb.textCenter('departTime', 120, '외출시각', { editor: 'text' }),  // L183
  gb.textCenter('returnTime', 120, '복귀시각', { editor: 'text' }),  // L184
  gb.text('reason', 400, '사유', { editor: 'text' }),  // L185
  gb.text('venue', 150, '장소', { editor: 'text' }),  // L186
  gb.text('host', 150, '주최자', { editor: 'text' }),  // L187
  gb.text('note', 150, '비고', { editor: 'text' }),  // L188
  // ⚠ 대응 없음 (GridBuilder L189) addCell
  gb.textCenter('aprStatusNm', 80, '결재상태'),  // L190
  gb.boolean('publicYn', 50, '공개'),  // L191
  gb.text('shareInfo', 150, '공유지정'),  // L192
  // ⚠ 대응 없음 (GridBuilder L193) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={insertCycle}>반복등록</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="delete" onClick={deleteChk}>삭제</Button>

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

### Emp54_Edit_Errand (`client/vi/emp/Emp54_Edit_Errand.java`, 575줄)

- 입력·하위 화면: `date` MyDateField, `departTime` TextField, `returnTime` TextField, `reason` TextField, `host` TextField, `venue` TextField, `note` TextField, `errandCode` TextField, `errandName` ComboBoxField("ErrandCode"), `cycleDate` MyDateField, `holidayYn` CheckBox, `cycleNum` LongField, `cycleCode` TextField, `cycleName` ComboBoxField("SimpleCycleCode", "none", "없음"), `radio01_01` Radio, `radio01_02` Radio, `radio01_03` Radio, `radio01_04` Radio, `radio01_05` Radio, `radio02_01` Radio, `radio02_02` Radio, `radio02_03` Radio

#### 이벤트
[E0] 화면 열림 (생성자 L121-138) → settings(), getEditor()
[E1] date[외출일자].ValueChange (L152) → setMonthLabels()
[E2] errandName[구분].Collapse (L158) → 인라인 L158-163 (new CollapseHandler() { @Override pub…)
[E3] cycleName[SimpleCycleCode].Collapse (L164) → setDeafaults(), setMonthLabels()
[E4] updateButton[저장].Select (L199) → update()
[E5] closeButton[닫기].Select (L205) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L97-110 | 공개 메서드 | 상태 처리 | 업무 |
| private init() | L112-119 | insert | 상태 처리 | 업무 |
| private getEditor() | L213-309 | 생성자 | 상태 처리 | 업무 |
| public update() | L311-409 | E4 | 서비스 emp.Emp54_Errand.modelUpdate(updateModel, companyId, holidayYn, cycleName, cycleNum, cycleName, cycleDate, cycleOption) | 업무 |
| private weekRadioChk() | L411-417 | update | 상태 처리 | 업무 |
| private monthRadioChk() | L419-425 | update | 상태 처리 | 업무 |
| private setDeafaults() | L427-445 | E3 | 상태 처리 | 업무 |
| private resetRadio() | L447-457 | init,setDeafaults | 상태 처리 | 업무 |
| private reset() | L459-465 | init,setDeafaults | 상태 처리 | 업무 |
| private disables() | L467-474 | init,setDeafaults | 상태 처리 | 업무 |
| private enableWeek() | L476-490 | setDeafaults | 상태 처리 | 업무 |
| private enableMonth() | L492-505 | setDeafaults | 상태 처리 | 업무 |
| private setRadioReadOnly() | L507-513 | disables,enableWeek,enableMonth | 상태 처리 | 업무 |
| private setMonthLabels() | L515-558 | E1,E3,enableMonth | 상태 처리 | 업무 |
| private settings() | L140-211 | 생성자 | 이벤트 연결, 초기값: errandCode=errandName.getCode(, cycleCode=cycleName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L560-562 | getEditor,setMonthLabels,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L564-566 | settings,getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L568-570 | settings,getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L572-574 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

