# Bmt10_Tab_Info

- 종류: 화면
- 메뉴: 고유자산 > 30. 고유자산 현황 > 전산장비관리 (#1161)
- 파일: `client/vi/bmt/Bmt10_Tab_Info.java`
- 함께 쓰는 클래스 6개:
  - `Bmt20_Lookup_RelateAppr` `client/vi/bmt/Bmt20_Lookup_RelateAppr.java`
  - `Bmt10_Lookup_History` `client/vi/bmt/Bmt10_Lookup_History.java`
  - `Bmt12_Edit_PcHistory` `client/vi/bmt/Bmt12_Edit_PcHistory.java`
  - `Bmt10_Lookup_InfoList` `client/vi/bmt/Bmt10_Lookup_InfoList.java`
  - `Bmt11_TabPage_History` `client/vi/bmt/Bmt11_TabPage_History.java`
  - `Bmt10_Edit_Info` `client/vi/bmt/Bmt10_Edit_Info.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md), [`Ast01_Lookup_ClassTree`](../../ast/components/Ast01_Lookup_ClassTree.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Bmt20_Lookup_RelateAppr:113 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `bmt.Bmt10_Info.modelDelete` | Bmt10_Edit_Info:227 | [`Bmt10_Info.java:49`](../../bmt/services/Bmt10_Info.md) | `UpdateDataModel(bmt10_info)` 동적 DELETE |
| `bmt.Bmt10_Info.modelUpdate` | Bmt10_Edit_Info:191 | [`Bmt10_Info.java:35`](../../bmt/services/Bmt10_Info.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bmt10_info)` 동적 INSERT/UPDATE → [`bmt10_info.selectById`](../../bmt/sql/bmt10_info.md) |
| `bmt.Bmt10_Info.selectByBaseDate` | Bmt10_Tab_Info:228 | [`Bmt10_Info.java:30`](../../bmt/services/Bmt10_Info.md) | [`bmt10_info.selectByBaseDate`](../../bmt/sql/bmt10_info.md) |
| `bmt.Bmt10_Info.selectByCompanyId` | Bmt10_Lookup_InfoList:178, Bmt10_Tab_Info:219 | [`Bmt10_Info.java:25`](../../bmt/services/Bmt10_Info.md) | [`bmt10_info.selectByCompanyId`](../../bmt/sql/bmt10_info.md) |
| `bmt.Bmt11_History.delete` | Bmt11_TabPage_History:182 | [`Bmt11_History.java:36`](../../bmt/services/Bmt11_History.md) | `UpdateDataModel(bmt11_history)` 동적 DELETE |
| `bmt.Bmt11_History.selectByInfoId` | Bmt11_TabPage_History:139 | [`Bmt11_History.java:23`](../../bmt/services/Bmt11_History.md) | [`bmt11_history.selectByInfoId`](../../bmt/sql/bmt11_history.md) |
| `bmt.Bmt11_History.update` | Bmt11_TabPage_History:187 | [`Bmt11_History.java:31`](../../bmt/services/Bmt11_History.md) | `UpdateDataModel(bmt11_history)` 동적 INSERT/UPDATE → [`bmt11_history.selectById`](../../bmt/sql/bmt11_history.md) |
| `bmt.Bmt12_PcHistory.delete` | Bmt10_Lookup_History:212 | [`Bmt12_PcHistory.java:81`](../../bmt/services/Bmt12_PcHistory.md) | `UpdateDataModel(bmt12_pc_history)` 동적 DELETE |
| `bmt.Bmt12_PcHistory.modelUpdate` | Bmt12_Edit_PcHistory:204 | [`Bmt12_PcHistory.java:48`](../../bmt/services/Bmt12_PcHistory.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bmt12_pc_history)` 동적 INSERT/UPDATE → [`bmt12_pc_history.selectById`](../../bmt/sql/bmt12_pc_history.md) |
| `bmt.Bmt12_PcHistory.selectByInfoId` | Bmt10_Lookup_History:157 | [`Bmt12_PcHistory.java:35`](../../bmt/services/Bmt12_PcHistory.md) | [`bmt12_pc_history.selectByInfoId`](../../bmt/sql/bmt12_pc_history.md) |
| `bmt.Bmt20_RelateAppr.delete` | Bmt20_Lookup_RelateAppr:189 | [`Bmt20_RelateAppr.java:52`](../../bmt/services/Bmt20_RelateAppr.md) | `UpdateDataModel(bmt20_relate_appr)` 동적 DELETE |
| `bmt.Bmt20_RelateAppr.modelUpdate` | Bmt20_Lookup_RelateAppr:164 | [`Bmt20_RelateAppr.java:34`](../../bmt/services/Bmt20_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bmt20_relate_appr)` 동적 INSERT/UPDATE → [`bmt20_relate_appr.selectById`](../../bmt/sql/bmt20_relate_appr.md) |
| `bmt.Bmt20_RelateAppr.selectByInfoId` | Bmt20_Lookup_RelateAppr:148 | [`Bmt20_RelateAppr.java:25`](../../bmt/services/Bmt20_RelateAppr.md) | [`bmt20_relate_appr.selectByInfoId`](../../bmt/sql/bmt20_relate_appr.md) |
| `sys.Sys00_Common.selectByKindCode` | Bmt10_Lookup_InfoList:47, Bmt10_Tab_Info:47 | [`Sys00_Common.java:111`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt11_history`](../../../db/tables/bmt.md), [`bmt12_pc_history`](../../../db/tables/bmt.md), [`bmt20_relate_appr`](../../../db/tables/bmt.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bmt10_Tab_Info (`client/vi/bmt/Bmt10_Tab_Info.java`, 258줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일자: {baseDate} 구분: {itemClassName} 검색: {searchText} {checkBox} {retrieveButton} {insertButton}
- 입력·하위 화면: `itemClassName` CommonComboBoxField("sys.Sys00_Common.selectByKindCode", "%", "전체") 빈칸="전체", `checkBox` CheckBox, `baseDate` MyDateField, `searchText` TextField 빈칸="장비명/취득정보/세부사양/비고", `lookup` Bmt10_Lookup_History
- 그리드 `grid` (buildGrid()):
  - astClassTreeName 200 "장비명" Text
  - applyDate 90 "매입일자" Date
  - retireDate 90 "폐기일자" Date 편집:"CE4242"
  - acqAmount 100 "취득금액" Long
  - acqInfo 180 "취득정보" TextArea
  - spec 350 "세부사양" TextArea
  - note 300 "비고" TextArea
  - personName 100 "사용자" TextCenter
  - actionCell 40 "수정" Cell 편집:editCell
  - actionCell 60 "History" Cell 편집:historyCell
  - actionCell 60 "연관문서" Cell 편집:relateAprCell

#### 이벤트
[E0] 화면 열림 (생성자 L56-85) → settings()
[E1] itemClassName[sys.Sys00_Common.selectByKindCode].Collapse (L107) → retrieve()
[E2] searchText.KeyPress [Enter] (L116) → retrieve()
[E3] retrieveButton[조회].Select (L125) → retrieve()
[E4] insertButton[등록].Select (L131) → insert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L202-225 | E1,E2,E3,settings,insert | 서비스 bmt.Bmt10_Info.selectByCompanyId(companyId, itemClassCode, baseDate, checkYn, searchText) | 업무 |
| private selectRetrieve() | L227-239 | buildGrid | 서비스 bmt.Bmt10_Info.selectByBaseDate(infoId, baseDate) | 업무 |
| public insert() | L241-249 | E4 | 팝업 Bmt10_Edit_Info 열기 | 업무 |
| private settings() | L87-137 | 생성자 | 이벤트 연결, 초기값: baseDate=LoginUser.getToday(, checkBox=true("폐기건 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L139-200 | 필드 초기화 | 조회창 Bmt10_Lookup_History 열기, 조회창 Bmt20_Lookup_RelateAppr 열기, 팝업 Bmt10_Edit_Info 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L251-253 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L255-257 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('astClassTreeNm', 200, '장비명'),  // L187 SQL 계산 컬럼(selectByCompanyId: ast01_class_tree_nm)
  gb.date('applyDate', 90, '매입일자'),  // L188
  gb.date('retireDate', 90, '폐기일자'),  // L189
  gb.long('acqAmount', 100, '취득금액'),  // L190
  gb.textArea('acqInfo', 180, '취득정보'),  // L191
  gb.textArea('spec', 350, '세부사양'),  // L192
  gb.textArea('note', 300, '비고'),  // L193
  gb.textCenter('personNm', 100, '사용자'),  // L194 SQL 계산 컬럼(selectByCompanyId: COALESCE(f_emp_kor_nm(( SELECT bmt11_pe…)
  // ⚠ 대응 없음 (GridBuilder L195) addCell
  // ⚠ 대응 없음 (GridBuilder L196) addCell
  // ⚠ 대응 없음 (GridBuilder L197) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>

### Bmt20_Lookup_RelateAppr (`client/vi/bmt/Bmt20_Lookup_RelateAppr.java`, 205줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - regDate 100 "상신일" Date
  - title 300 "상신명" Text
  - actionCell 80 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L86-105) → show()
[E1] retrieveButton[조회].Select (L60) → retrieve()
[E2] insertButton[등록].Select (L66) → insert()
[E3] deleteButton[삭제].Select (L72) → delete()
       └ [E5] msgBox.DialogHide [YES] (L182) → 서비스 bmt.Bmt20_RelateAppr.delete
[E4] closeButton[닫기].Select (L78) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-57 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L144-149 | E1,open,insert | 서비스 bmt.Bmt20_RelateAppr.selectByInfoId(companyId, infoId) | 업무 |
| private insert() | L151-177 | E2 | 조회창 Apr05_Lookup_LoadDoc 열기, 서비스 bmt.Bmt20_RelateAppr.modelUpdate | 업무 |
| private delete() | L179-200 | E3 | ConfirmBox → E5 | 업무 |
| private settings() | L59-84 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L107-142 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '상신일'),  // L137 SQL 계산 컬럼(selectById: b.apr01_reg_date)
  gb.text('title', 300, '상신명'),  // L138 SQL 계산 컬럼(selectById: b.apr01_title)
  // ⚠ 대응 없음 (GridBuilder L139) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Bmt10_Lookup_History (`client/vi/bmt/Bmt10_Lookup_History.java`, 222줄)

- 툴바 `buttonBar`: ▶ 장비이력: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `tabPage` Bmt11_TabPage_History, `lookup` Bmt12_Edit_PcHistory
- 그리드 `grid` (buildGrid()):
  - actionCell 40 "수정" Cell 편집:editCell
  - startDate 90 "시작일자" Date
  - hostName 100 "호스트" Text
  - settingDate 90 "설치(포맷)" Date
  - internalIp 120 "내부IP" Text
  - macAddress 170 "MAC주소" Text
  - etc 300 "기타사항" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L54-82) → show()
[E1] retrieveButton[조회].Select (L96) → retrieve()
[E2] insertButton[등록].Select (L102) → insert()
[E3] deleteButton[삭제].Select (L108) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L191) → delete()
[E4] closeButton[닫기].Select [callback != null] (L114) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L84-93 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L153-166 | E1,open,buildGrid,insert | 서비스 bmt.Bmt12_PcHistory.selectByInfoId(companyId, infoId) | 업무 |
| private insert() | L168-186 | E2 | 팝업 Bmt12_Edit_PcHistory 열기 | 업무 |
| private deleteCheck() | L188-207 | E3 | ConfirmBox → E5 | 업무 |
| private delete() | L209-213 | E5 | GridDeleteData bmt.Bmt12_PcHistory.delete(체크된 행 목록) | 업무 |
| private settings() | L95-123 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L125-151 | 필드 초기화 | 팝업 Bmt12_Edit_PcHistory 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L215-217 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarNoticeStyleNoSpace() | L219-221 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L142) addCell
  gb.date('startDate', 90, '시작일자'),  // L143
  gb.text('hostNm', 100, '호스트'),  // L144
  gb.date('settingDate', 90, '설치(포맷)'),  // L145
  gb.text('internalIp', 120, '내부IP'),  // L146
  gb.text('macAddress', 170, 'MAC주소'),  // L147
  gb.textArea('etc', 300, '기타사항'),  // L148
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Bmt12_Edit_PcHistory (`client/vi/bmt/Bmt12_Edit_PcHistory.java`, 225줄)

- 입력·하위 화면: `astClassTreeName` LookupTriggerField, `infoId` LongField, `startDate` MyDateField, `hostName` TextField, `settingDate` MyDateField, `internalIp` TextField, `macAddress` TextField, `etc` MyTextArea, `note` MyTextArea, `lookup` Bmt10_Lookup_InfoList

#### 이벤트
[E0] 화면 열림 (생성자 L116-175) → add(), show()
[E1] updateButton[저장].Select (L122) → update()
[E2] closeButton[닫기].Select (L128) → hide()
[E3] astClassTreeName[장비명].TriggerClick (L179) → openLookupBmt()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L60-70 | 공개 메서드 | 상태 처리 | 업무 |
| package insert() | L72-89 | 미사용 후보 | 상태 처리 | 업무 |
| public add() | L91-102 | 생성자 | 상태 처리 | 업무 |
| public edit() | L104-114 | 공개 메서드 | 상태 처리 | 업무 |
| private openLookupBmt() | L187-199 | E3 | 조회창 Bmt10_Lookup_InfoList 열기 | 업무 |
| private update() | L201-216 | E1 | 서비스 bmt.Bmt12_PcHistory.modelUpdate | 업무 |
| private settings() | L177-185 | insert,add,edit | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L218-220 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L222-224 | insert,add,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Bmt10_Lookup_InfoList (`client/vi/bmt/Bmt10_Lookup_InfoList.java`, 197줄)

- 툴바 `buttonBar`: 기준일자: {baseDate} 구분: {itemClassName} {checkBox} {retrieveButton}
- 입력·하위 화면: `itemClassName` CommonComboBoxField("sys.Sys00_Common.selectByKindCode", "%", "전체") 빈칸="전체", `checkBox` CheckBox, `baseDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스):
  - astClassTreeName 150 "종목명" Text
  - personName 80 "담당자" TextCenter
  - applyDate 90 "매입일자" Date
  - retireDate 90 "폐기일자" Date 편집:"CE4242"
  - acqAmount 100 "취득금액" Long
  - acqInfo 200 "취득정보" TextArea
  - spec 250 "세부사양" TextArea
  - note 250 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L54-83) → show()
[E1] itemClassName[sys.Sys00_Common.selectByKindCode].Collapse (L111) → retrieve()
[E2] retrieveButton[조회].Select (L118) → retrieve()
[E3] okButton[확인].Select (L124) → hide()
[E4] closeButton[취소].Select (L131) → hide()
[E5] grid.CellDoubleClick (L138) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L85-90 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L162-184 | E1,E2,open,settings | 서비스 bmt.Bmt10_Info.selectByCompanyId(companyId, itemClassCode, baseDate, checkYn) | 업무 |
| private settings() | L92-145 | open | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L147-160 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L186-188 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L190-192 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('astClassTreeNm', 150, '종목명'),  // L150 SQL 계산 컬럼(selectByCompanyId: ast01_class_tree_nm)
  gb.textCenter('personNm', 80, '담당자'),  // L151 SQL 계산 컬럼(selectByCompanyId: COALESCE(f_emp_kor_nm(( SELECT bmt11_pe…)
  gb.date('applyDate', 90, '매입일자'),  // L152
  gb.date('retireDate', 90, '폐기일자'),  // L153
  gb.long('acqAmount', 100, '취득금액'),  // L154
  gb.textArea('acqInfo', 200, '취득정보'),  // L155
  gb.textArea('spec', 250, '세부사양'),  // L156
  gb.textArea('note', 250, '비고'),  // L157
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Bmt11_TabPage_History (`client/vi/bmt/Bmt11_TabPage_History.java`, 193줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: ▶ 사용자: {retrieveButton} {insertButton} {deleteButton} {updateButton}
- 입력·하위 화면: `lookupEmp` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - startDate 90 "시작일자" Date 편집:MyDateField
  - personName 80 "사원명" TextCenter 편집:lookupEmp
  - messenger 200 "사용 메신저" TextArea 편집:TextArea
  - website 200 "사용 웹사이트" TextArea 편집:TextArea
  - note 180 "비고" TextArea 편집:TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L51-68) → settings()
[E1] retrieveButton[조회].Select (L71) → retrieve()
[E2] insertButton[등록].Select (L77) → insert()
[E3] deleteButton[삭제].Select (L83) → deleteCheck()
       └ [E6] msgBox.DialogHide [YES] (L161) → delete()
[E4] updateButton[저장].Select (L89) → update()
[E5] lookupEmp.TriggerClick [result != null] (L101) → 인라인 L101-121 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L133-140 | E1 | 서비스 bmt.Bmt11_History.selectByInfoId(companyId, infoId) | 업무 |
| private retrieve() | L142-147 | E1 | 서비스 bmt.Bmt11_History.selectByInfoId(companyId, infoId) | 업무 |
| private insert() | L149-156 | E2 | 상태 처리 | 업무 |
| private deleteCheck() | L158-177 | E3 | ConfirmBox → E6 | 업무 |
| private delete() | L179-183 | E6 | GridDeleteData bmt.Bmt11_History.delete(체크된 행 목록) | 업무 |
| private update() | L185-188 | E4 | 서비스 bmt.Bmt11_History.update | 업무 |
| private settings() | L70-95 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L97-131 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarNoticeStyleNoSpace() | L190-192 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 90, '시작일자', { editor: 'date' }),  // L124
  gb.textCenter('personNm', 80, '사원명'),  // L125 SQL 계산 컬럼(selectByInfoId: f_emp_kor_nm(bmt11_person_id))
  gb.textArea('messenger', 200, '사용 메신저', { editor: 'largeText' }),  // L126
  gb.textArea('website', 200, '사용 웹사이트', { editor: 'largeText' }),  // L127
  gb.textArea('note', 180, '비고', { editor: 'largeText' }),  // L128
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Bmt10_Edit_Info (`client/vi/bmt/Bmt10_Edit_Info.java`, 251줄)

- 입력·하위 화면: `astClassTreeName` LookupTriggerField, `astClassTreeId` LongField, `applyDate` MyDateField, `retireDate` MyDateField, `acqAmount` LongField, `acqInfo` MyTextArea, `note` MyTextArea, `spec` MyTextArea, `lookupClassTree` Ast01_Lookup_ClassTree

#### 이벤트
[E0] 화면 열림 (생성자 L93-164) → show()
[E1] updateButton[저장].Select (L100) → update()
[E2] closeButton[닫기].Select (L106) → hide()
[E3] deleteButton[삭제].Select (L112) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L208) → delete()
[E4] astClassTreeName[장비명].TriggerClick (L168) → openLookupAst()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L68-79 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L81-91 | 공개 메서드 | 상태 처리 | 업무 |
| private openLookupAst() | L176-186 | E4 | 조회창 Ast01_Lookup_ClassTree 열기 | 업무 |
| private update() | L188-203 | E1 | 서비스 bmt.Bmt10_Info.modelUpdate | 업무 |
| private deleteCheck() | L205-224 | E3 | ConfirmBox → E5 | 업무 |
| private delete() | L226-238 | E5 | 서비스 bmt.Bmt10_Info.modelDelete | 업무 |
| private settings() | L166-174 | insert,open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L240-242 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L244-246 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L248-250 | insert,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="delete" onClick={deleteCheck}>삭제</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

